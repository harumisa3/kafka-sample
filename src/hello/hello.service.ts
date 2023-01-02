import { Injectable, Logger } from '@nestjs/common';

export interface IHelloService {
  execute(message: Buffer): void;
}

@Injectable()
export class HelloService implements IHelloService {
  private logger: Logger = new Logger();
  execute(message: Buffer): void {
    const msgJson = Buffer.from(message).toString();
    this.logger.log(`受信したメッセージ：${msgJson}`);
  }
}
