import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  Kafka,
  Consumer,
  KafkaMessage,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';

/**
 * KafkaConsumerの基底クラス
 */
@Injectable()
export abstract class KafkaConsumer implements OnModuleInit {
  /**
   * クラスメンバ
   */
  private readonly consumers: Consumer[] = [];
  private readonly kafka: Kafka;
  protected logger: Logger = new Logger();
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
   * ホストモジュールの依存関係が解決された直後の処理
   */
  async onModuleInit() {
    const consumer = this.kafka.consumer({
      groupId: this.consumerGroupName,
      heartbeatInterval: 20000,
      sessionTimeout: 60000,
    });
    const topic: ConsumerSubscribeTopics = {
      topics: [this.consumerTopicName],
    };

    const config: ConsumerRunConfig = {
      eachMessage: async ({ message }) => {
        this.actionBeforeHandler();
        await this.handler(message);
        this.actionAfterHandler();
      },
    };

    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  /**
   * 終了シグナルを受け取った時の処理
   */
  async onModuleDestroy() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  /**
   * メイン処理（業務処理）
   */
  abstract handler(message: KafkaMessage): void;

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
}
