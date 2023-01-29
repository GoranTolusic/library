import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Borrowed } from './borrowed.entity';

@Entity('books')
export class Book {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    content: string;

    @ApiProperty()
    @Column()
    publisher: string;

    @ApiProperty()
    @Column()
    uid: string;

    @ApiProperty()
    @Column()
    createdAt: number;

    @ApiProperty()
    @Column()
    updatedAt: number;

    @ApiProperty()
    @Column()
    userId: number;

    @ManyToOne(type => User, user => user.books, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(type => Borrowed, borrowed => borrowed.book)
    borrowed: Borrowed[];

}
