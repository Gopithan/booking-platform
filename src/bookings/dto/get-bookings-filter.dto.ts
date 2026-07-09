import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../booking-status.enum';

export class GetBookingsFilterDto {
    @ApiPropertyOptional({ description: 'Search term for customer name or email' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ enum: BookingStatus, description: 'Filter by booking status' })
    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;

    @ApiPropertyOptional({ description: 'Page number (default: 1)', default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page (default: 10, max: 100)', default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number = 10;
}
