import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    firstName: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @ApiProperty({ example: 'marko@mail.com', required: true })
    email: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    password: string

    @IsIn(['author', 'user'])
    @ApiProperty({ required: true })
    @IsNotEmpty()
    role: string

    readonly createdAt: number = Date.now()

    readonly updatedAt: number = Date.now()
}
