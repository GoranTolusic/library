import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends OmitType(PartialType(CreateBookDto), ['createdAt', 'uid', 'userId'] as const) { }
