import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'admin@example.com', description: 'The email of the user' })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user (min 6 characters)' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
