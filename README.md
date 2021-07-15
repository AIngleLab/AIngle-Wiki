## Introduction

 AIngle is a distributed-ledger technology built from the ground up to support real-time communication among IoT devices with quantum-level security. These installation instructions are intended to install AIngle on any machine running Python code via Kafka. 

### Requirements

- Python 3.x and above
- Ubuntu 14.04 and above

### Packages to install:

Please follow the 

#### <u>Python:</u>

First make sure that you have Python 3.x and above installed in the device that will be communicating via AIngle with other devices.  Rund the following command.

```shell
pip install kafka-python
```

This should return the following success message

```shell
Successfully installed kafka-python-x.x.x
```

The actual version, might be a different depending on when you install it. 

#### <u>Install Rust language:</u>

Next you need to install the latest version of the Rust language, which is used because it is the multi-language support language that we use internally for AIngle.

Run the folling command on your terminal or command console.

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

If everyting goes well, you should receive the following prompt. Please select the number 1 option and press enter.

```shell
1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
> 1
```

After a while you shoudl receive the following success message

```shell
Rust is installed now. Great!
```

#### <u>Check the installation of Rust</u>:

You can test the Rust installation with the following command.  

**IMPORTANT**: Before you do so, please open a new terminal or console and run the following command.

```shell
rustc --version
```

If you runned the above command on a new terminal or console, you should see the following message, confirming that you have successfully installed Rust

```shell
rustc 1.53.0 (53cb7b09b 2021-06-17)
```

The actual version, might be a different depending on when you install it. 

#### <u>Download the source code from the following repository:</u>

After you have completed the above steps, you are ready to download the AIngle package from GitHub. 

Run the following command in the directory you wish to install AIngle

```shell
git clone --branch Tohoku-University https://github.com/AIngleLab/AIngle-Wiki.git aingle
```

This will download the following folder with all the files you will need:

```
ls -l
drwxr-xr-x  6 Yuri  staff  192 Jul  6 09:16 aingle
```

Run the ls command to view the contents of the AIngle folder

```shell
cd aingle
ls -l
total 24
-rw-r--r--  1 Yuri  staff   124 Jul  6 09:16 Cargo.toml
-rw-r--r--  1 Yuri  staff  6477 Jul  6 09:16 README.md
drwxr-xr-x  6 Yuri  staff   192 Jul  6 09:16 src
```

#### <u>Add the code to your src folder</u>

If your project folder is on the **opt** directory, then run the following command to copy the Cargo.toml file one level above your **src** folder

```
mv Cargo.toml ~/opt/NameOfYourProject/
mv README.md ~/opt/NameOfYourProject/src/
mv -R src ~/opt/NameOfYourProject/src/
```

### <u>Test your installation</u>

How to make sure that everything is working.

```python
python example.py
Starting worker..
Listening..
```

This means that you have successfully installed AIngle!!!

### How to use AIngle in your code

The example.py file has an example of how you need to use AIngle in your source code for your device.  

```python
# Necessary libraries for the use of kafka
from kafka import KafkaProducer
from kafka.errors import KafkaError
# substitute with PostgreSQL wherever necessary
import sqlite3

# kafka connection invoker
producer = KafkaProducer(bootstrap_servers=["kafka.aingle.ai:9092"])
# Creating a connection to the table that contains your dog suite data!!!
# The following example connects to sqlite database.  In your case you should substitute the following line for your database.  
conn = sqlite3.connect('../data.db')

# Example A: This is an example for PostgreSQL. 
#conn = psycopg2.connect(
#    host="localhost",
#    database="suppliers",
#    user="postgres",
#    password="Abcd1234")
    
# cursor object
cursor = conn.cursor()
# drop query
cursor.execute("DROP TABLE IF EXISTS task")
# create query
query = """CREATE TABLE task(
        ID INT PRIMARY KEY NOT NULL,
        NAME CHAR(20) NOT NULL )"""
cursor.execute(query)
conn.execute("INSERT INTO task (ID,NAME) "
             "VALUES (1, 'Connection with kafka')")
# commit and close
conn.commit()
conn.close()


# To be used in the code fraction, where the data of the canine suit to be written are sent
def kafka_reproduce():
    try:
        print("Starting worker..")
        # You should substitute the following line for your connecting to your database.  For example, PostgreSQL
        conn = sqlite3.connect('../data.db') # If you follow the Example A above, you can just substitute this line.
        # In the folloing line substitute the asteriscs for the name of the columns in your table that you want to share with AIngle's kafka broker.
        # You can also leave the asterics and all the columns will be streamed to the AIngle kafka broker.
        cursor = conn.execute("SELECT * from task") # If you are following Example A, then just substitute "tasK" for the name of your PostgreSQL table.
        producer.send('Dog-Suit', str(cursor).encode())
        print("Listening..")
    except KafkaError as e:
        print(e)


kafka_reproduce()
```
### How to get support

If you have any questions or problems, please don't hesitate to contact us at the following Slack channel:

aingle.slack.com

To register in this channel, please click on the following [URL](https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ)

https://join.slack.com/t/aingle/shared_invite/zt-sj8sntae-xpx9der4fkGdlMwp6tIgDQ


