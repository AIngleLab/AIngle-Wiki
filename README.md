# AIngle JavaScript Instructions

AIngle is a distributed-ledger technology built from the ground up to support real-time communication among IoT devices with quantum-level security. These installation instructions are intended to install AIngle on any machine running JavaScript code via Kafka.

## Prerequisites
The following libraries need to be installed and working in your environment.
* `node` (Version 14.1x.x)
* `@aingle/aiid-js`
* Your favorite Kafka library (E.g., we have tested with node-rdkafka)​
### Packages to install

There are two ways to install AIngle, which depends on what you want to do.  

1) Installation through the console

```shell
npm install @aingle/aiid-js
```

2) Installation by inserting the `"@aingle/aiid-js": "^0.0.5"` dependency in **Package.json** as follows:

> ```js
> 
> {
>   "name": "node-kafka-aingle",
>   "type": "module",
>   "version": "1.0.0",
>   "description": "",
>   "main": "index.js",
>   "scripts": {
>     "start:producer": "node producer/index.js",
>     "start:consumer": "node consumer/index.js"
>   },
>   "author": "Ainlge Team",
>   "license": "MIT",
>   "dependencies": {
>     "@aingle/aiid-js": "^0.0.5",
>     "avsc": "^5.6.2",
>     "node": "^16.4.0",
>     "node-rdkafka": "^2.10.1"
>   },
>   "devDependencies": {
>     "chai": "^4.3.4"
>   }
> }
> ```

### Change your Kafka broker

Now all you need to do is change the Kafka broker in your code to the following Kafka broker.

```shell
kafka.aingle.ai:9092
```

### Change your producer code

Now you need to change your producer and consumer code as follows:

```javascript
import {encode} from "punycode";
const publicKey = []
const agentId = encode(publicKey)
```

## Running TESTS

We have prepared a test which we highly recommend you run to make sure everything is working before you try it in your own system.  To run the test, follow these steps:

1) Clone the following repository:

```shell
git clone --branch aingle-javascript https://github.com/AIngleLab/AIngle-Wiki.git aingle
```

2) Make sure that you have installed the following dependencies

AIngle has been tested with npm version 6 and above and node 14.1x.x and above.  So make sure that you have upgraded if you run into any problems.

3) Run a producer and a consumer in two separate consoles

Now, open two different consoles.  We will call them Console A and Console B.

<u>On Console A, run the following two commands:</u>

Install npm dependencies

```shell
npm install
```

If you run into any problems, most likely you have versioning issues with node.  If so, please follow the instructions the the following wiki:

[Installing Node.js Tutorial: Using nvm]: https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/

Start the producer

```shell

npm run start:producer
```

If everything went well, your console will start sending data.  This is an example of what you might see in your console:

```shell
...
message queued ({"category":"FirstResponder","noise":"commands"})
message queued ({"category":"DOG","noise":"find "})
message queued ({"category":"DOG","noise":"search"})
message queued ({"category":"DOG","noise":"search"})
...
```

<u>On Console B, run the following command:</u>

Start the consumer

```shell
npm run start:consumer
```

If everything went well, your console will start receiving data.  This is an example of what you might see in your console:

```shell
consumer ready.. 
received message: {"category":"DOG","noise":"find "}
received message: {"category":"FirstResponder","noise":"commands"}
received message: {"category":"DOG","noise":"find "}
received message: {"category":"DOG","noise":"find "}
...
```
### How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ

