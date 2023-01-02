import { Injectable } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { KafkaConsumer } from 'src/kafka.consumer';
import { HelloService } from './hello.service';

@Injectable()
export class HelloConsumer extends KafkaConsumer {
  readonly consumerGroupName: string;
  readonly consumerTopicName: string;
  constructor(private readonly helloService: HelloService) {
    super();
    this.consumerGroupName = 'HelloWorldConsumer';
    this.consumerTopicName = 'TestTopic';
  }
  handler(message: KafkaMessage): void {
    /**
     * Consumer固有のロジックを書く
     */
    this.helloService.execute();
  }
}
