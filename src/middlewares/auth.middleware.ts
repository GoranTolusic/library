import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwt.service';
import { UsersService } from '../modules/users/users.service';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JWTService, private userService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        let decoded
        if (!req.headers.accesstoken) throw new HttpException('You are not logged in', 401)
        try {
            decoded = this.jwtService.verifyToken(req.headers.accesstoken)
        } catch (e) {
            throw new HttpException(e.message, 401)
        }
        //Check for actual data in users table
        let fetchUser = await this.userService.findOne({ id: decoded.id })
        if (!fetchUser) throw new HttpException('Unable to retrieve logged user data', 404)
        if (!fetchUser.active) throw new HttpException('Your account has been deactivated', 403)

        //assign loggedUser to request variable to have access in controllers
        Object.assign(req,  { user: fetchUser })

        next();
    }
}
