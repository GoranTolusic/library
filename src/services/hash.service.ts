import { Injectable } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common/services';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(string, salt)
  }

  async comparePasswords(password:string, hash:string) {
    return await bcrypt.compare(password, hash)
  }

}
