import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';

@Module({
  providers: [],
  exports: [KafkaConsumer],
})
export class KafkaModule {}
