import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Kafka,
  Consumer,
  KafkaMessage,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';
@Injectable()
export abstract class KafkaConsumer implements OnModuleInit {
  private readonly consumers: Consumer[];
  private readonly kafka: Kafka;
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
   * アプリケーション起動時の処理
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
        this.actionBeforeHandler();
      },
    };

    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  /**
   * アプリケーション停止時の設定
   */
  async onApplicationShutdown() {
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
    console.info('前処理');
  }

  /**
   * ハンドラーの後処理
   */
  private actionAfterHandler(): void {
    console.log('後処理');
  }
}
