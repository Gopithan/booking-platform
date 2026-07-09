import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './auth/user.entity';
import { Service } from './services/service.entity';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure SQLite database
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User, Service, Booking],
      synchronize: true, // Automatically sync database schema (ideal for dev/SQLite)
      logging: false,
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule { }
