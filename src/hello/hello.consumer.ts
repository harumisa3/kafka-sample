import { Injectable } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { KafkaConsumer } from 'src/kafka/kafka.consumer';
import { HelloService } from './hello.service';

@Injectable()
export class HelloConsumer extends KafkaConsumer {
  consumerGroupName: string;
  consumerTopicName: string;
  constructor(private readonly helloService: HelloService) {
    super();
    this.consumerGroupName = 'テンプレート';
    this.consumerTopicName = 'テンプレート';
  }
  handler(message: KafkaMessage): void {
    /**
     * Consumer固有のロジックを書く
     */
    this.helloService.execute();
  }
}
