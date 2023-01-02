import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [KafkaModule, HelloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
