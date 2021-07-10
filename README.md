AIngle C#  Instructions
=========

AIngle is a distributed-ledger technology built from the ground up to support real-time communication among IoT devices with quantum-level security. These installation instructions are intended to install AIngle on any machine running C# code via Kafka.

If you need to connect any of your FASTER IoT devices, the integration could not be simpler. If your connection to FASTER is done through Kafka, you will only need to change your Kafka broker URL. Here is the address of the FASTER-AIngle Kafka broker URL:

```
kafka.aingle.ai:9092
```

That's it!!!! Your IoT device should now be able to transmit all your data via AIngle with quamtum-proof security and maximum privacy.

## How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ

## Under the Hood

You really do not need to change anything on your code other than the address of the Kafka broker you are using. However, if you run into problems we would like to confirm that you can run the following example.

## Example C# Code

This example is provided for illustration purposes only. The only thing you need to connect to the Kafka AIngle broker is to point to the correct URL provided above. You do not need to read any further to find that answer, but if you insist, we are providing a couple of sample files here: a **producer.cs** and a **consumer.cs**

First of all, the following example was run in our machines using following library (we downloaded it into our **src/** directory). However, you can use any Kafka library of your choice.

### Consumer

```C#
using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using kafka4net;
using kafka4net.ConsumerImpl;

namespace examples
{
    public static class ConsumerExample
    {
        // Notice, unlike java driver, port is not mandatory and will resolve to default value 9092.
        // Explicit ports are allowed though, for example "kafka1:9092, kafka2:9093, kafka3:9094"
        readonly static string _connectionString = "kafka1, kafka2, kafka3";
        readonly static string _topic = "some.topic";

        /// <summary>Simplest consumer with termination example</summary>
        public static async Task TakeForOneMinute()
        {
            // If you want to consume all messages in the topic, use TopicPositionFactory.Start
            // TopicPositionFactory.End will start waiting for new messages starting from the moment of subscription
            var consumer = new Consumer(new ConsumerConfiguration(_connectionString, _topic, new StartPositionTopicEnd()));

            consumer.OnMessageArrived.Subscribe(msg => {
                // Perform your own deserialization here
                var text = Encoding.UTF8.GetString(msg.Value);
                Console.WriteLine($"Got message: '{text}' Partition: {msg.Partition} Offset: {msg.Offset} Lag: {msg.HighWaterMarkOffset - msg.Offset}");
            });

            // Connecting starts when subscribing to OnMessageArrived. If you need to know when connection is actually one, wait for IsConnected task completion
            await consumer.IsConnected;
            Console.WriteLine("Connected");

            // Consume for one minute
            await Task.Delay(TimeSpan.FromMinutes(1));

            await consumer.CloseAsync();
            Console.WriteLine("Closed");
        }
    }
}
```



### Consumer from multiple partitions

```C#
using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using kafka4net;
using kafka4net.ConsumerImpl;

namespace examples
{
    public static class ConsumerExample
    {
        // Notice, unlike java driver, port is not mandatory and will resolve to default value 9092.
        // Explicit ports are allowed though, for example "kafka1:9092, kafka2:9093, kafka3:9094"
        readonly static string _connectionString = "kafka1, kafka2, kafka3";
        readonly static string _topic = "some.topic";

        public static async Task SubscribeToMultipleTopics()
        {
            var rx = new Regex("some\\.topic\\..+");
            var cluster = new Cluster(_connectionString);
            await cluster.ConnectAsync();
            var allTopics = await cluster.GetAllTopicsAsync();
            var wantedTopics = allTopics.Where(topic => rx.IsMatch(topic)).ToArray();

            var consumers = wantedTopics.Select(topic => new Consumer(new ConsumerConfiguration(_connectionString, topic, new StartPositionTopicEnd()))).ToArray();
            consumers.AsParallel().ForAll(consumer => consumer.OnMessageArrived.Subscribe(msg => {
                var text = Encoding.UTF8.GetString(msg.Value);
                Console.WriteLine($"Got message '{text}' from topic '{msg.Topic}' partition {msg.Partition} offset {msg.Offset}");
            }));

            await Task.Delay(TimeSpan.FromMinutes(1));

            await Task.WhenAll(consumers.Select(consumer => consumer.CloseAsync()));
        }

    }
}
```

### Producer
```C#
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using kafka4net;

namespace examples
{
    public static class ProducerExample
    {
        // Notice, unlike java driver, port is not mandatory and will resolve to default value 9092.
        // Explicit ports are allowed though, for example "kafka1:9092, kafka2:9093, kafka3:9094"
        readonly static string _connectionString = "kafka1, kafka2, kafka3";
        readonly static string _topic = "some.topic";

        public async static Task Produce100RandomMessages()
        {
            var rnd = new Random();
            var randomNumbers = Enumerable.Range(1, 100).Select(_ => rnd.Next().ToString());
            var producer = new Producer(_connectionString, new ProducerConfiguration(_topic));

            // Technically not mandatory, but good idea to listen to possible errors and act accordingly to your application requirements
            producer.OnPermError += (exception, messages) => Console.WriteLine($"Failed to write {messages.Length} because of {exception.Message}");

            // When message is confirmed by kafka broker to be persisted, OnSuccess is called. Can be used if upstream requires acknowlegement for extra reliability.
            producer.OnSuccess += messages => Console.WriteLine($"Sent {messages.Length} messages");

            await producer.ConnectAsync();

            foreach(var str in randomNumbers)
            {
                // Message.Key is optional. If not set, then driver will partition messages at random. In this case, for sake of example, partition by 1st character of the string
                var key = BitConverter.GetBytes(str[0]);
                // Implement your own serialization here.
                var msg = new Message { Value = Encoding.UTF8.GetBytes(str),  Key = key};
                producer.Send(msg);
            }

            // Await for every producer to complete. Note, that calling CloseAsync is safe: all bessages currently in buffers will be awaited until flushed.
            await producer.CloseAsync(TimeSpan.FromMinutes(1));
        }
    }
}
```