import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateServiceDto {
    @ApiPropertyOptional({ example: 'Premium Haircut & Styling', description: 'The title of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Premium professional haircut, wash, and styling.', description: 'The description of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Description cannot be empty' })
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 60, description: 'Duration of the service in minutes' })
    @IsInt()
    @IsPositive({ message: 'Duration must be a positive integer' })
    @IsOptional()
    duration?: number;

    @ApiPropertyOptional({ example: 65.0, description: 'Price of the service' })
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({ example: true, description: 'Whether the service is active and bookable' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
