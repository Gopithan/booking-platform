import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin@example.com', description: 'The email of the user' })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @IsString()
    password: string;
}
