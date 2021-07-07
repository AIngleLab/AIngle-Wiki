import Kafka from 'node-rdkafka';
import eventType from '../eventType.js';
import {encode} from "punycode";


const publicKey = []
const agentId = encode(publicKey)
const stream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': 'kafka.aingle.ai:9092'
}, {}, {
  topic: 'AIngle'
});

stream.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

function queueRandomMessage() {
  const category = getRandomAnimal();
  const noise = getRandomNoise(category);
  const event = { category, noise };
  const success = stream.write(eventType.toBuffer(event));     
  if (success) {
    console.log(`message queued (${JSON.stringify(event)})`);
  } else {
    console.log('Too many messages in the queue already..');
  }
}

function getRandomAnimal() {
  const categories = ['DOG', 'FirstResponder'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomNoise(work) {
  if (work === 'DOG') {
    const noises = ['find ', 'search'];
    return noises[Math.floor(Math.random() * noises.length)];
  } else if (work === 'FirstResponder') {
    const noises = ['control', 'commands'];
    return noises[Math.floor(Math.random() * noises.length)];
  } else {
    return 'silence..';
  }
}

setInterval(() => {
  queueRandomMessage();
}, 3000);
