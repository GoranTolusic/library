import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';
import { uid } from 'uid';

export class CreateBookDto {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    content: string

    @IsString()
    @ApiProperty()
    publisher: string

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    userId: number

    readonly createdAt: number = Date.now()

    readonly updatedAt: number = Date.now()

    readonly uid: string = uid()
}

