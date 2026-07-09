import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({ example: 'Haircut & Styling', description: 'The title of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty({ example: 'Professional haircut, wash, and styling.', description: 'The description of the service' })
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @ApiProperty({ example: 45, description: 'Duration of the service in minutes' })
    @IsInt()
    @IsPositive({ message: 'Duration must be a positive integer' })
    duration: number;

    @ApiProperty({ example: 50.0, description: 'Price of the service' })
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;

    @ApiProperty({ example: true, description: 'Whether the service is active and bookable', required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
