import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AddBook implements CanActivate {
  private usersService
  constructor(usersService: UsersService) {
    this.usersService = usersService
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let proceed = false

    if (!request.body.userId) throw new HttpException('userId is missing in body request', 400)
    let ownerWithRole = await this.usersService.findOne({ id: parseInt(request.body.userId) })
    if (!ownerWithRole) throw new HttpException('User not found', 404)

    //If you are owner of book then proceed
    if (request.user.id == request.body.userId) proceed = true

    //If you are admin make further check for user roles
    if (request.user.role == 'admin' && ownerWithRole.role == 'author') proceed = true

    return proceed;
  }
}