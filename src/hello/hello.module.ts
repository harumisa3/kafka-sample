import { Module } from '@nestjs/common';
import { HelloConsumer } from './hello.consumer';
import { HelloService } from './hello.service';

@Module({
  providers: [HelloConsumer, HelloService],
})
export class HelloModule {}
