import { Injectable } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';
const jwt = require('jsonwebtoken');


@Injectable()
export class JWTService {
  generateToken(user: User) : string {
    let token = jwt.sign(user, process.env.JWT_SECRET)
    return token
  }

  verifyToken(token) {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  }

}
