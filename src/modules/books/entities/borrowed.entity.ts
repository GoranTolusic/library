import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Book } from './book.entity';

@Entity('borrowed_books')
export class Borrowed {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    createdAt: number;

    @ApiProperty()
    @Column()
    updatedAt: number;

    @ApiProperty()
    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.borrowed, { onDelete: 'CASCADE' })
    user: User;

    @ApiProperty()
    @Column()
    bookId: number;

    @ManyToOne(type => Book, book => book.borrowed, { onDelete: 'CASCADE' })
    book: Book;

}
