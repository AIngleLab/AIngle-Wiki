

# AIngle C++ Instructions 

AIngle is a distributed-ledger technology built from the ground up to support real-time communication among IoT devices with quantum-level security. These installation instructions are intended to install AIngle on any machine running C++ code via Kafka.

If you need to connect any of your FASTER IoT devices, the integration could not be simpler.  If your connection to FASTER is done through Kafka, you will only need to change your Kafka broker URL.  Here is the address of the FASTER-AIngle Kafka broker URL:

```shell
kafka.aingle.ai:9092
```

That's it!!!! Your IoT device should now be able to transmit all your data via AIngle with quamtum-proof security and maximum privacy.

## How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ

## Under the Hood

You really do not need to change anything on your code other than the address of the Kafka broker you are using.  However, if you run into problems we would like to confirm that you can run the following example.

## Example C++ Code

This exmaple is provided for illustration purposes only.  The only thing you need to connect to the Kafka AIngle broker is to point to the correct URL provided above. You do not need to read any further to find that answer, but if you insist, we are providing a couple of sample files here: a **producer.cpp** and a **consumer.cpp**

First of all, the following example was run in our machines using following library (we downloaded it into our **src/** directory). However, you can use any Kafka library of your choice. 

[librdkafka]([edenhill/librdkafka: The Apache Kafka C/C++ library (github.com)](https://github.com/edenhill/librdkafka))

### Code you need in the **`producer.cpp`** file

Place the following code in your **`producer.cpp`**

```c++

#include <iostream>
#include <string>
#include <list>
#include <stdint.h>
#include <rdkafkacpp.h>
 
static bool run = true;
static bool exit_eof = false;
 
void dump_config(RdKafka::Conf* conf) {
    std::list<std::string> *dump = conf->dump();
 
    printf("config dump(%d):\n", (int32_t)dump->size());
    for (auto it = dump->begin(); it != dump->end(); ) {
        std::string name = *it++;
        std::string value = *it++;
        printf("%s = %s\n", name.c_str(), value.c_str());
    }
 
    printf("---------------------------------------------\n");
}
 
class my_event_cb : public RdKafka::EventCb {
public:
    void event_cb(RdKafka::Event &event) override {
        switch (event.type())
        {
        case RdKafka::Event::EVENT_ERROR:
            std::cerr << "ERROR (" << RdKafka::err2str(event.err()) << "): " <<
                event.str() << std::endl;
            if (event.err() == RdKafka::ERR__ALL_BROKERS_DOWN)
                run = false;
            break;
 
        case RdKafka::Event::EVENT_STATS:
            std::cerr << "\"STATS\": " << event.str() << std::endl;
            break;
 
        case RdKafka::Event::EVENT_LOG:
            fprintf(stderr, "LOG-%i-%s: %s\n",
                event.severity(), event.fac().c_str(), event.str().c_str());
            break;
 
        default:
            std::cerr << "EVENT " << event.type() <<
                " (" << RdKafka::err2str(event.err()) << "): " <<
                event.str() << std::endl;
            break;
        }
    }
};
 
class my_hash_partitioner_cb : public RdKafka::PartitionerCb {
public:
    int32_t partitioner_cb(const RdKafka::Topic *topic, const std::string *key,
        int32_t partition_cnt, void *msg_opaque) override {
        return djb_hash(key->c_str(), key->size()) % partition_cnt;
    }
private:
    static inline unsigned int djb_hash(const char *str, size_t len) {
        unsigned int hash = 5381;
        for (size_t i = 0; i < len; i++)
            hash = ((hash << 5) + hash) + str[i];
        return hash;
    }
};
 
namespace producer_ts {
 
class my_delivery_report_cb : public RdKafka::DeliveryReportCb {
public:
    void dr_cb(RdKafka::Message& message) override {
        printf("message delivery %d bytes, error:%s, key: %s\n",
            (int32_t)message.len(), message.errstr().c_str(), message.key() ? message.key()->c_str() : "");
    }
};
 
void producer_test() {
    printf("producer test\n");
 
    int32_t partition = RdKafka::Topic::PARTITION_UA;
 
    printf("input brokers list(kafka.aingle.ai:9092):\n");
    std::string broker_list;
 
    //std::cin >> broker_list;
    broker_list = "kafka.aingle.ai:9092";
 
    printf("input partition:");
 
    //std::cin >> partition;
    partition = 0;
 
    // config 
    RdKafka::Conf* global_conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    RdKafka::Conf* topic_conf = RdKafka::Conf::create(RdKafka::Conf::CONF_TOPIC);
 
    my_hash_partitioner_cb          hash_partitioner;
    my_event_cb                     event_cb;
    my_delivery_report_cb           delivery_cb;
  
 
    std::string err_string;
    if (topic_conf->set("partitioner_cb", &hash_partitioner, err_string) != RdKafka::Conf::CONF_OK) {
        printf("set partitioner_cb error: %s\n", err_string.c_str());
        return;
    }
 
    global_conf->set("metadata.broker.list", broker_list, err_string);
    global_conf->set("event_cb", &event_cb, err_string);
    global_conf->set("dr_cb", &delivery_cb, err_string);
    //global_conf->set("retry.backoff.ms", "10", err_string);
    //global_conf->set("debug", "all", err_string);
    //global_conf->set("debug", "topic,msg", err_string);
    //global_conf->set("debug", "msg,queue", err_string);
 
    dump_config(global_conf);
    dump_config(topic_conf);
 
 
    // create producer
    RdKafka::Producer* producer = RdKafka::Producer::create(global_conf, err_string);
    if (!producer) {
        printf("failed to create producer, %s\n", err_string.c_str());
        return;
    }
 
    printf("created producer %s\n", producer->name().c_str());
 
    std::string topic_name;
    while (true) {
 
        printf("input topic to create:\n");
        std::cin >> topic_name;
 
        // create topic
        RdKafka::Topic* topic =
            RdKafka::Topic::create(producer, topic_name, topic_conf, err_string);
 
        if (!topic) {
            printf("try create topic[%s] failed, %s\n",
                topic_name.c_str(), err_string.c_str());
            return;
        }
 
        printf(">");
        for (std::string line; run && std::getline(std::cin, line); ) {
            if (line.empty()) {
                producer->poll(0);
                continue;
            }
 
            if (line == "quit") {
                break;
            }
 
            std::string key = "kafka_test";
 
            RdKafka::ErrorCode res = producer->produce(topic, partition,
                RdKafka::Producer::RK_MSG_COPY,
                (char*)line.c_str(), line.size(), key.c_str(), key.size(), NULL);
 
            if (res != RdKafka::ERR_NO_ERROR) {
                printf("produce failed, %s\n", RdKafka::err2str(res).c_str());
            }
            else {
                printf("produced msg, bytes %d\n", (int32_t)line.size());
            }
 
            // do socket io
            producer->poll(0);
 
            printf("outq_len: %d\n", producer->outq_len());
 
            //producer->flush(1000);
 
            //while (run && producer->outq_len()) {
            //    printf("wait for write queue( size %d) write finish\n", producer->outq_len());
            //    producer->poll(1000);
            //}
 
            printf(">");
        }
 
        delete topic;
 
        if (!run) {
            break;
        }
    }
 
    run = true;
 
    while (run && producer->outq_len()) {
        printf("wait for write queue( size %d) write finish\n", producer->outq_len());
        producer->poll(1000);
    }
 
    delete producer;
}
}
```



Code you need in the **`consumer.cpp`** file

`consumer.cpp`

```c++

#include <iostream>
#include <string>
#include <list>
#include <stdint.h>
#include <rdkafkacpp.h>
 
static bool run = true;
static bool exit_eof = false;
 
void dump_config(RdKafka::Conf* conf) {
    std::list<std::string> *dump = conf->dump();
 
    printf("config dump(%d):\n", (int32_t)dump->size());
    for (auto it = dump->begin(); it != dump->end(); ) {
        std::string name = *it++;
        std::string value = *it++;
        printf("%s = %s\n", name.c_str(), value.c_str());
    }
 
    printf("---------------------------------------------\n");
}
 
class my_event_cb : public RdKafka::EventCb {
public:
    void event_cb(RdKafka::Event &event) override {
        switch (event.type())
        {
        case RdKafka::Event::EVENT_ERROR:
            std::cerr << "ERROR (" << RdKafka::err2str(event.err()) << "): " <<
                event.str() << std::endl;
            if (event.err() == RdKafka::ERR__ALL_BROKERS_DOWN)
                run = false;
            break;
 
        case RdKafka::Event::EVENT_STATS:
            std::cerr << "\"STATS\": " << event.str() << std::endl;
            break;
 
        case RdKafka::Event::EVENT_LOG:
            fprintf(stderr, "LOG-%i-%s: %s\n",
                event.severity(), event.fac().c_str(), event.str().c_str());
            break;
 
        default:
            std::cerr << "EVENT " << event.type() <<
                " (" << RdKafka::err2str(event.err()) << "): " <<
                event.str() << std::endl;
            break;
        }
    }
};
 
class my_hash_partitioner_cb : public RdKafka::PartitionerCb {
public:
    int32_t partitioner_cb(const RdKafka::Topic *topic, const std::string *key,
        int32_t partition_cnt, void *msg_opaque) override {
        return djb_hash(key->c_str(), key->size()) % partition_cnt;
    }
private:
    static inline unsigned int djb_hash(const char *str, size_t len) {
        unsigned int hash = 5381;
        for (size_t i = 0; i < len; i++)
            hash = ((hash << 5) + hash) + str[i];
        return hash;
    }
};
 
namespace consumer_ts
{
void msg_consume(RdKafka::Message* message, void* opaque)
{
    switch (message->err())
    {
    case RdKafka::ERR__TIMED_OUT:
        break;
 
    case RdKafka::ERR_NO_ERROR:
        /* Real message */
        std::cout << "Read msg at offset " << message->offset() << std::endl;
        if (message->key())
        {
            std::cout << "Key: " << *message->key() << std::endl;
        }
        printf("%.*s\n", static_cast<int>(message->len()), static_cast<const char *>(message->payload()));
        break;
    case RdKafka::ERR__PARTITION_EOF:
        /* Last message */
        if (exit_eof)
        {
            run = false;
        }
        break;
    case RdKafka::ERR__UNKNOWN_TOPIC:
    case RdKafka::ERR__UNKNOWN_PARTITION:
        std::cerr << "Consume failed: " << message->errstr() << std::endl;
        run = false;
        break;
    default:
        /* Errors */
        std::cerr << "Consume failed: " << message->errstr() << std::endl;
        run = false;
    }
}
 
class my_consumer_cb : public RdKafka::ConsumeCb {
public:
    void consume_cb(RdKafka::Message &msg, void *opaque) override
    {
        msg_consume(&msg, opaque);
    }
};
 
void consumer_test() {
    printf("conumer test\n");
 
    int32_t partition = RdKafka::Topic::PARTITION_UA;
 
    printf("input brokers list(kafka.aingle.ai:9092):\n");
    std::string broker_list;
 
    //std::cin >> broker_list;
    broker_list = "kafka.aingle.ai:9092";
 
    printf("inpute partition:");
 
    //std::cin >> partition;
    partition = 0;
 
    // config 
    RdKafka::Conf* global_conf = RdKafka::Conf::create(RdKafka::Conf::CONF_GLOBAL);
    RdKafka::Conf* topic_conf = RdKafka::Conf::create(RdKafka::Conf::CONF_TOPIC);
 
    my_hash_partitioner_cb          hash_partitioner;
    my_event_cb                     event_cb;
    my_consumer_cb                  consume_cb;
 
    int64_t start_offset = RdKafka::Topic::OFFSET_BEGINNING;
 
    std::string err_string;
    if (topic_conf->set("partitioner_cb", &hash_partitioner, err_string) != RdKafka::Conf::CONF_OK){
        printf("set partitioner_cb error: %s\n", err_string.c_str());
        return;
    }
 
    global_conf->set("metadata.broker.list", broker_list, err_string);
    global_conf->set("event_cb", &event_cb, err_string);
    //global_conf->set("debug", "all", err_string);
    //global_conf->set("debug", "topic,msg", err_string);
    //global_conf->set("debug", "topic,msg,queue", err_string);
 
    dump_config(global_conf);
    dump_config(topic_conf);
 
    // create consumer
    RdKafka::Consumer* consumer = RdKafka::Consumer::create(global_conf, err_string);
    if (!consumer) {
        printf("failed to create consumer, %s\n", err_string.c_str());
        return;
    }
 
    printf("created consumer %s\n", consumer->name().c_str());
 
    // create topic
    printf("input topic name:\n");
 
    std::string topic_name;
    std::cin >> topic_name;
 
    RdKafka::Topic* topic = RdKafka::Topic::create(consumer, topic_name, topic_conf, err_string);
    if (!topic) {
        printf("try create topic[%s] failed, %s\n", topic_name.c_str(), err_string.c_str());
        return;
    }
 
    // Start consumer for topic+partition at start offset
    RdKafka::ErrorCode resp = consumer->start(topic, partition, start_offset);
    if (resp != RdKafka::ERR_NO_ERROR) {
        printf("Failed to start consumer: %s\n", 
            RdKafka::err2str(resp).c_str());
        return;
    }
 
    int use_ccb = 0;
    while (run) {
        //consumer->consume_callback(topic, partition, 1000, &consume_cb, &use_ccb);
        //consumer->poll(0);
 
        RdKafka::Message *msg = consumer->consume(topic, partition, 2000);
        msg_consume(msg, NULL);
        delete msg;
    }
 
    // stop consumer
    consumer->stop(topic, partition);
    consumer->poll(1000);
 
    delete topic;
    delete consumer;
}
};
```

### How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ


