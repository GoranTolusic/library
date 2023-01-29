import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';

export class BorrowDto {

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    bookId: number

    readonly createdAt: number = Date.now()

    readonly updatedAt: number = Date.now()
}

