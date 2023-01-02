import { Injectable } from '@nestjs/common';

export interface IHelloService {
  execute(): void;
}

@Injectable()
export class HelloService implements IHelloService {
  execute(): void {
    console.info('サービス処理を実行しました');
  }
}
