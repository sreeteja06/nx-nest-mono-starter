import { IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateOptionsDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsPositive()
    @IsInt()
    @Type(() => Number)
    limit?: number = 100;
}
