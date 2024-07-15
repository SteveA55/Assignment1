#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

export default function rabbitMqConnectAndSend(message: string) {

    amqp.connect('amqp://localhost', function (error: string, connection: any) {
        if (error) {
            console.log("RABBIT MQ ...CONNECTION... ERROR: ", error)
        }
        connection.createChannel(function (error: string, channel: any) {
            if (error) {
                console.log("RABBIT MQ ...CREATE CHANNEL.. ERROR: ", error)
            }
            var queue = 'aqueue';
            //var message = 'Rabbit MQ is up and running';
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(`[MESSAGE SENT] ${message} !!`);
        });

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);

    });
}

//rabbitMqConnectAndSend("hellllllo");