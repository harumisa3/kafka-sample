import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { HelloModule } from './hello/hello.module';
import { KafkasModule } from './kafkas/kafkas.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule, KafkasModule, HelloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
