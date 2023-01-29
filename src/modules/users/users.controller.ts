import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiHeader, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Admin } from '../../guards/admin.guard';

@ApiTags('users')
@ApiHeader({ name: 'accesstoken', description: 'token' })
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiResponse({ type: User, status: 200 })
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @ApiResponse({ type: User, status: 200, isArray: true })
  @ApiQuery({ name: 'page', description: 'number of page', required: false })
  @ApiQuery({ name: 'limit', description: 'number of users', required: false })
  @Get('users')
  async findAll(@Query() params) {
    return await this.usersService.findAll(params);
  }

  @ApiResponse({ type: User, status: 200 })
  @Get('users/:id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne({ id: id });
  }

  @ApiResponse({ type: User, status: 200 })
  @Patch('users/deactivate')
  async deactivate(@Request() request) {
    return await this.usersService.deactivateUser(request.user);
  }

  @ApiResponse({ type: User, status: 200 })
  @Post('users/create')
  @UseGuards(Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  async add(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiResponse({ type: User, status: 200 })
  @Patch('users/:id')
  @UseGuards(Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Request() request, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, request.user.id, updateUserDto);
  }

  @ApiResponse({ type: User, status: 200 })
  @Delete('users/:id')
  @UseGuards(Admin)
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
