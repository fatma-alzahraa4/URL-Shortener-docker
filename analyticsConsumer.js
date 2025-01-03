import { AnalyticsModel } from "./DB/analyticsModel.js";
import { dbConnection } from "./DB/connection.js";
import { clientRedis } from "./src/utils/redis.js";

import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve('./config/.env') })
import Redis from 'ioredis';

dbConnection()

export const subsecriber = new Redis({
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    tls: {
        rejectUnauthorized: false
      }
});

subsecriber.subscribe('analyticsChannel', (error, count) => {
    if (error) {
        console.error('Failed to subscribe to channel:', error);
    } else {
        console.log(`Subscribed to ${count} channel(s). Waiting for messages...`);
    }
});

subsecriber.on('message', async (channel, message) => {
    if (channel === 'analyticsChannel') {
        console.log("Received message:", message);
        try {
            const { shortId, ipAddress, timestamp } = JSON.parse(message);
            //update url analytics in the database
             const analyticsData = await AnalyticsModel.findOneAndUpdate(
                { shortId },
                {
                    $inc: { visitCount: 1 },
                    $push: { visitDetails: { ipAddress, timestamp } },
                },
                { upsert: true, new: true }
            );

            //update url analytics in the database
            clientRedis.setex(`Analytics_${shortId}`,86400, JSON.stringify(analyticsData))

            console.log(`Processed analytics event for shortId: ${shortId}`);
        } catch (error) {
            console.error('Error processing analytics event:', error);
        }
    }
});
