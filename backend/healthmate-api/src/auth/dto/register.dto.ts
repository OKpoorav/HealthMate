import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  address?: string;

  // Doctor-specific fields
  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;
} 