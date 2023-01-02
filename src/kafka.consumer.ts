import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer, KafkaMessage } from 'kafkajs';

/**
 * KafkaConsumerの基底クラス
 */
@Injectable()
export abstract class KafkaConsumer implements OnModuleInit {
  /**
   * クラスメンバ
   */
  private readonly kafka: Kafka;
  private readonly logger: Logger = new Logger();
  private consumer: Consumer; // onModuleInitが呼び出された際に値を格納

  /**
   * 抽象メンバ
   */
  abstract readonly consumerGroupName: string;
  abstract readonly consumerTopicName: string;

  /**
   * コンストラクタ
   */
  constructor() {
    this.kafka = new Kafka({
      brokers: process.env['BROKER_ENDPOINTS']?.split(',') ?? [
        'localhost:9093',
      ],
    });
  }
  /**
   * ハンドラ処理（業務処理）
   */
  abstract handler(message: KafkaMessage): void;

  /**
   * ホストモジュールの依存関係が解決された直後の処理
   */
  async onModuleInit() {
    this.consumer = this.kafka.consumer({
      groupId: this.consumerGroupName,
      heartbeatInterval: 20000,
      sessionTimeout: 60000,
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [this.consumerTopicName],
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ partition, message }) => {
        this.execute(partition, message);
      },
    });
  }

  /**
   * 終了シグナルを受け取った時の処理
   */
  async onModuleDestroy() {
    this.logger.log(`${this.consumerGroupName}をkafkaから切断します`);
    await this.consumer.disconnect();
  }

  /**
   * 実行処理
   */
  private execute(partition: number, message: KafkaMessage): void {
    this.actionBeforeHandler();
    if (this.isIdempotent()) {
      this.handler(message);
    } else {
      this.logger.warn(`${this.consumerGroupName}の処理が重複しました`);
    }
    this.actionAfterHandler();
  }

  /**
   * ハンドラーの前処理
   */
  private actionBeforeHandler(): void {
    this.logger.log(`${this.consumerGroupName}の処理を開始します`);
    this.logger.log(`${this.consumerTopicName}からメッセージを取得します`);
  }

  /**
   * ハンドラーの後処理
   */
  private actionAfterHandler(): void {
    this.logger.log(`${this.consumerGroupName}の処理を終了します`);
  }

  /**
   * 冪等処理
   */
  private isIdempotent(): boolean {
    // TODO: アプリケーション固有の冪等チェックを記載する
    return true;
  }
}
