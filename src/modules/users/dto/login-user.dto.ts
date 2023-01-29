import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'admin@mail.com' })
    email: string

    @IsNotEmpty()
    @ApiProperty({ example: 'test1234' })
    password: string

}
