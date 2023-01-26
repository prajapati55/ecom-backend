import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { toNumber } from "../../common/helpers/cast.helper"
export class QueryUserDto {
    @Transform(({ value }) => toNumber(value))
    @IsNumber()
    @IsOptional()
    limit: number;

    @Transform(({ value }) => toNumber(value, { min: 1 }))
    @Min(1)
    @IsNumber()
    @IsOptional()
    page: number;

    @IsOptional()
    name: string;
}