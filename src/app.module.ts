import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DocumentsModule } from './documents/documents.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    PatientsModule,
    AppointmentsModule,
    DocumentsModule,
    ChatModule,
  ],
})
export class AppModule {} 