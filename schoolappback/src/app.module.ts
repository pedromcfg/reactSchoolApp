import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { SubjectsModule } from './subjects/subjects.modules';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './guards/at.guard';

@Module({
  imports: [
    SubjectsModule,
    MongooseModule.forRoot(
      'mongodb+srv://pedromcfg:schoolapp@schoolapp.6peowyz.mongodb.net/schoolapp?retryWrites=true&w=majority',
    ),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: AtGuard,
  }],
})
export class AppModule {}
