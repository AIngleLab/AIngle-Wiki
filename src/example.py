# Necessary libraries for the use of kafka
from kafka import KafkaProducer
from kafka.errors import KafkaError
# substitute with PostgreSQL wherever necessary
import sqlite3

# kafka connection invoker
producer = KafkaProducer(bootstrap_servers=["kafka.aingle.ai:9092"])
# Creating table into database!!!
# Connect to sqlite database
conn = sqlite3.connect('../data.db')
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
        conn = sqlite3.connect('../data.db')
        cursor = conn.execute("SELECT * from task")
        producer.send('Dog-Suit', str(cursor).encode())
        print("Listening..")
    except KafkaError as e:
        print(e)


kafka_reproduce()
