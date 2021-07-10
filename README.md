

# AIngle Java  Instructions 

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

## Example Java Code

This exmaple is provided for illustration purposes only.  The only thing you need to connect to the Kafka AIngle broker is to point to the correct URL provided above. You do not need to read any further to find that answer, but if you insist, we are providing a couple of sample files here: a **producer.java** and a **consumer.java**

The following example can run directly from a console. Let's assume that you use Console A and Console B for this purpose.  You will need to run the producer.java code on **Console A** and the consumer.java code on **Console B**.

### Code you need in the **`producer.java`** file

### `producer.java`

```java
//import util.properties packages
import java.util.Properties;

//import simple producer packages
import org.apache.kafka.clients.producer.Producer;

//import KafkaProducer packages
import org.apache.kafka.clients.producer.KafkaProducer;

//import ProducerRecord packages
import org.apache.kafka.clients.producer.ProducerRecord;

//Create java class named “SimpleProducer”
public class SimpleProducer {
   
   public static void main(String[] args) throws Exception{
      
      // Check arguments length value
      if(args.length == 0){
         System.out.println("Enter topic name");
         return;
      }
      
      //Assign topicName to string variable
      String topicName = args[0].toString();
      
      // create instance for properties to access producer configs   
      Properties props = new Properties();
      
      //Assign localhost id
      props.put("bootstrap.servers", “kafkaaingle.ai:9092");
      
      //Set acknowledgements for producer requests.      
      props.put("acks", “all");
      
      //If the request fails, the producer can automatically retry,
      props.put("retries", 0);
      
      //Specify buffer size in config
      props.put("batch.size", 16384);
      
      //Reduce the no of requests less than 0   
      props.put("linger.ms", 1);
      
      //The buffer.memory controls the total amount of memory available to the producer for buffering.   
      props.put("buffer.memory", 33554432);
      
      props.put("key.serializer", 
         "org.apache.kafka.common.serializa-tion.StringSerializer");
         
      props.put("value.serializer", 
         "org.apache.kafka.common.serializa-tion.StringSerializer");
      
      Producer<String, String> producer = new KafkaProducer
         <String, String>(props);
            
      for(int i = 0; i < 10; i++)
         producer.send(new ProducerRecord<String, String>(topicName, 
            Integer.toString(i), Integer.toString(i)));
               System.out.println(“Message sent successfully”);
               producer.close();
   }
}
```



### Run the following commands on Console A

**Compilation** − The application can be compiled using the following command.

```shell
javac -cp “/path/to/kafka/kafka_2.11-0.9.0.0/lib/*” *.java
```

**Execution** − The application can be executed using the following command.

```shell
java -cp “/path/to/kafka/kafka_2.11-0.9.0.0/lib/*”:. SimpleProducer <topic-name>
```

### Code you need in the **`consumer.java`** file

### `consumer.java`

```java
import java.util.Properties;
import java.util.Arrays;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class SimpleConsumer {
   public static void main(String[] args) throws Exception {
      if(args.length == 0){
         System.out.println("Enter topic name");
         return;
      }
      //Kafka consumer configuration settings
      String topicName = args[0].toString();
      Properties props = new Properties();
      
      props.put("bootstrap.servers", "kafkaaingle.ai:9092");
      props.put("group.id", "test");
      props.put("enable.auto.commit", "true");
      props.put("auto.commit.interval.ms", "1000");
      props.put("session.timeout.ms", "30000");
      props.put("key.deserializer", 
         "org.apache.kafka.common.serializa-tion.StringDeserializer");
      props.put("value.deserializer", 
         "org.apache.kafka.common.serializa-tion.StringDeserializer");
      KafkaConsumer<String, String> consumer = new KafkaConsumer
         <String, String>(props);
      
      //Kafka Consumer subscribes list of topics here.
      consumer.subscribe(Arrays.asList(topicName))
      
      //print the topic name
      System.out.println("Subscribed to topic " + topicName);
      int i = 0;
      
      while (true) {
         ConsumerRecords<String, String> records = con-sumer.poll(100);
         for (ConsumerRecord<String, String> record : records)
         
         // print the offset,key and value for the consumer records.
         System.out.printf("offset = %d, key = %s, value = %s\n", 
            record.offset(), record.key(), record.value());
      }
   }
}
```



### Run the following commands on Console B

**Compilation** − The application can be compiled using the following command.

```shell
javac -cp “/path/to/kafka/kafka_2.11-0.9.0.0/lib/*” *.java
```

**Execution −** The application can be executed using the following command

```shell
java -cp “/path/to/kafka/kafka_2.11-0.9.0.0/lib/*”:. SimpleConsumer <topic-name>
```

**Input** − Open the producer CLI and send some messages to the topic. You can put the smple input as ‘Hello Consumer’.

**Output** − Following will be the output.

```shell
Subscribed to topic Hello-Kafka
offset = 3, key = null, value = Hello Consumer
```



### How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ


