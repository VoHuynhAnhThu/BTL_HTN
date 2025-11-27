import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { TransformInterceptor } from './core/transorm.interceptor';
import { GardenInfoModule } from './modules/garden-info/garden-info.module';
import { HumidityRecordsModule } from './modules/humidity-records/humidity-records.module';
import { LightRecordsModule } from './modules/light-records/light-records.module';import { PumpRecordsModule } from './modules/pump-records/pump-records.module';
import { TemperatureRecordsModule } from './modules/temperature-records/temperature-records.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthController } from './health.controller';
import { AiModule } from './modules/ai/ai.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CoreIotModule } from './modules/coreiot/coreiot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) throw new Error('Missing MONGODB_URI in .env');
        return { uri };
      },
      inject: [ConfigService],
    }),
    NotificationsModule,
    MqttModule,
    LightRecordsModule,
    CoreIotModule,
    UsersModule,
    HumidityRecordsModule,
    PumpRecordsModule,
    TemperatureRecordsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get<string>('MAIL_USER');
        const pass = configService.get<string>('MAIL_PASS');
        if (!user || !pass) throw new Error('Missing MAIL_USER or MAIL_PASS');
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
          },
          defaults: { from: '"No Reply" <no-reply@localhost>' },
          template: {
            dir: process.cwd() + '/src/mail/templates',
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    GardenInfoModule,
    AiModule
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ],
})
export class AppModule {}