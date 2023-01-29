import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from '../../services/hash.service';
import { JWTService } from '../../services/jwt.service';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { _ } from 'lodash'
import { RedisService } from '../../services/redis.service';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>,
    private hashService: HashService,
    private dataSource: DataSource,
    private jwtService: JWTService,
    private redisService: RedisService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let createdUser: any

    //Check if email exists
    await this.checkIfEmailExists(createUserDto.email)

    //hash password
    createUserDto.password = await this.hashService.hash(createUserDto.password)

    //Insert new user in DB
    try {
      createdUser = await this.repository.save(createUserDto)
    } catch (e) {
      throw new HttpException(e.message, 500)
    }

    //return created user's info without password
    return _.omit(createdUser, ['password'])
  }

  async login(loginUserDto: LoginUserDto) {
    //Fetching user with repository doesn't return password so we use custom query to get all data
    let user = await this.getUserWithPassword({ email: loginUserDto.email }, 'email')

    //compare password from inputs with stored hashed password
    let matches = await this.hashService.comparePasswords(loginUserDto.password, user.password)
    if (!matches) throw new HttpException('Incorrect password. Try Again!', 403)
    if (!user.active) throw new HttpException('Your account has been deactivated!', 403)

    //set role in redis
    await this.redisService.setKey(`user-${user.id}`, user.role)

    //return accessToken 
    return { accessToken: this.jwtService.generateToken(_.omit(user, ['password'])) }
  }

  async deactivateUser(user: User): Promise<User> {
    user.active = false
    return await this.repository.save(user)
  }

  async findAll(params: { page: number; limit: number; }): Promise<User[]> {
    let limit = params.limit || 10
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: params.page ? (params.page - 1) * limit : 0,
      relations: ['books']
    })
  }

  async findOne(params: object): Promise<User> {
    return await this.repository.findOne({
      where: params,
      relations: ['books']
    })
  }

  async update(id: number, loggedUserId: number, updateUserDto: UpdateUserDto): Promise<User> {
    let updated
    let user = await this.findOne({ id: id })
    if (!user) throw new HttpException('User not found!', 404)

    //Check ownership
    if (user.role === 'admin' && user.id !== loggedUserId) throw new HttpException('Unable to update other admins account', 403)

    //check unique email
    if (updateUserDto.email && user.email !== updateUserDto.email) await this.checkIfEmailExists(updateUserDto.email)

    //check and hash password
    if (updateUserDto.password) updateUserDto.password = await this.hashService.hash(updateUserDto.password)

    //create repo instance and save changes
    try {
      Object.assign(user, updateUserDto)
      updated = await this.repository.save(user)
    } catch (e) {
      throw new HttpException(e.message, 500)
    }

    return updated;
  }

  async remove(id: number) {
    let user = await this.findOne({ id: id })
    if (!user) throw new HttpException('User not found!', 404)

    //Always delete author or inactive admin. Active admins are "delete" proof
    if (user.role === 'admin' && user.active) throw new HttpException('Unable to delete active admin users', 403)
    await this.repository.delete(id)
    return { message: "deleted" };
  }

  private async checkIfEmailExists(email: string) {
    let mailExists = await this.repository.findOneBy({ email: email })
    if (mailExists) throw new HttpException('Email already exists. Bla bla bla :)', 403)
    return email
  }

  private async getUserWithPassword(param: ObjectLiteral, columnName: string): Promise<User> {
    let user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where(`users.${columnName} = :${columnName}`, param)
      .getOne()
    if (!user) throw new HttpException(`User with provided ${columnName} not found`, 403)
    return user
  }


}


