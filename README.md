# AIngle Development KIT for Japan Pilot V1

AIngle is a distributed-ledger technology built from the ground up to support real-time communication among IoT devices with quantum-level security. These installation instructions are intended to install AIngle on any machine running C++ code via Kafka.

If you need to connect any of your FASTER IoT devices, the integration could not be simpler.  If your connection to FASTER is done through Kafka, you will only need to change your Kafka broker URL.  Here is the address of the FASTER-AIngle Kafka broker URL:

```shell
kafka.aingle.ai:9092
```

That's it!!!  You should now be connected to the KAFKA-AIngle broker.

#### The following repositories are being provider for the rare cases where you need more specific instructions for your particular environment.

## Kafka Configuration for AIngle
```
broker.id=0
advertised.listeners=PLAINTEXT://kafka.aingle.ai:9092
num.network.threads=3
num.io.threads=8
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600
log.dirs=/home/kafka/kafka/kafka/logs
num.partitions=1
num.recovery.threads.per.data.dir=1
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
log.flush.interval.messages=10000
log.flush.interval.ms=1000
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
zookeeper.connect=localhost:2181
group.initial.rebalance.delay.ms=0
delete.topic.enable = true
```


## Specific Instructions for Python

```
https://github.com/AIngleLab/AIngle-Wiki/tree/aingle-python
```



## Specific Instructions for JavaScript

```
https://github.com/AIngleLab/AIngle-Wiki/tree/aingle-javascript
```

## Specific Instructions for C++

```
https://github.com/AIngleLab/AIngle-Wiki/tree/aingle-c+%2B
```

## Specific Instructions for Java

```
https://github.com/AIngleLab/AIngle-Wiki/tree/aingle-java
```

## Specific Instructions for C#

```
https://github.com/AIngleLab/AIngle-Wiki/tree/aingle-csharp
```


## How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ

