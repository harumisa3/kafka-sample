import { Injectable, Logger } from '@nestjs/common';

export interface IHelloService {
  execute(): void;
}

@Injectable()
export class HelloService implements IHelloService {
  private logger: Logger = new Logger();
  execute(): void {
    this.logger.log('サービス処理を実行しました');
  }
}
