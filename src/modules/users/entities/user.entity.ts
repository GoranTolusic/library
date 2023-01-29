import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/entities/book.entity';
import { Borrowed } from '../../books/entities/borrowed.entity';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ default: true })
  active: boolean;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ default: 'user' })
  role: string;

  @ApiProperty()
  @Column()
  createdAt: number;

  @ApiProperty()
  @Column()
  updatedAt: number;

  @Column({ select: false })
  password?: string;

  @OneToMany(type => Book, book => book.user)
  books: Book[];

  @OneToMany(type => Borrowed, borrowed => borrowed.user)
  borrowed: Borrowed[];

}