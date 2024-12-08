import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, UserRole } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(user.doctor && { doctor: user.doctor }),
        ...(user.patient && { patient: user.patient }),
      },
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      // Validate role-specific fields
      if (registerDto.role === UserRole.DOCTOR && (!registerDto.specialization || !registerDto.licenseNumber)) {
        throw new BadRequestException('Doctors must provide specialization and license number');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: registerDto.role,
          phoneNumber: registerDto.phoneNumber,
          dateOfBirth: registerDto.dateOfBirth ? new Date(registerDto.dateOfBirth) : null,
          address: registerDto.address,
          ...(registerDto.role === UserRole.DOCTOR && {
            doctor: {
              create: {
                specialization: registerDto.specialization!,
                licenseNumber: registerDto.licenseNumber!,
              },
            },
          }),
          ...(registerDto.role === UserRole.PATIENT && {
            patient: {
              create: {},
            },
          }),
        },
        include: {
          doctor: true,
          patient: true,
        },
      });

      return {
        access_token: this.jwtService.sign({
          sub: user.id,
          email: user.email,
        }),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          ...(user.doctor && { doctor: user.doctor }),
          ...(user.patient && { patient: user.patient }),
        },
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }
}
