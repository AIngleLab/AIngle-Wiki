import Kafka from 'node-rdkafka';
import eventType from '../eventType.js';
import {encode} from "punycode";


const publicKey = []
const agentId = encode(publicKey)
const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'kafka.aingle.ai:9092',
}, {});

consumer.connect();

consumer.on('ready', () => {
  console.log('consumer ready..', agentId)
  consumer.subscribe(['AIngle']);
  consumer.consume();
}).on('data', (data) => {
  console.log(`received message: ${eventType.fromBuffer(data.value)}`);
});
