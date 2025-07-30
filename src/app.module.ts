import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './config/health/health.module';
import { AuthModule } from './controllers/auth/auth.module';
import { UserManagementModule } from './controllers/user-management/user-management.module';
import { LogManagementModule } from './controllers/log-management/log-management.module';
import { JwtAuthGuard } from './config/guards/jwt-auth.guard';
import { WebSocketModule } from './controllers/web-socket/web-socket.module';
import { SapIntegrationModule } from './controllers/sap-integration/sap-integration.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MasterDataModule } from './controllers/master-data/master-data.module';
import { GatePassModule } from './controllers/gate-pass/gate-pass.module';
import { QualityControlModule } from './controllers/quality-control/quality-control.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    HealthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserManagementModule,
    LogManagementModule,
    WebSocketModule,
    SapIntegrationModule,
    MasterDataModule,
    GatePassModule,
    QualityControlModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
