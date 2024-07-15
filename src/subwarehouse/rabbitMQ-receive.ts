#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

export default function rabbitMqReceive() {

    amqp.connect('amqp://localhost', function (error: string, connection: any) {

        if (error) {

            console.log("RABBIT MQ ...CONNECTION... ERROR: ", error)
            return;

        }

        connection.createChannel(function (error: string, channel: any) {

            if (error) {

                console.log("RABBIT MQ ...CREATE CHANNEL.. ERROR: ", error)
                return;

            }

            var queue = 'aqueue';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log(`[WAITING FOR MESSAGES] ${queue}`);

            channel.consume(queue, function (msg: any) {
                console.log(`[MESSAGE RECEIVED] ${msg.content} !!`);
            });

        });

    });

}

//rabbitMqReceive();