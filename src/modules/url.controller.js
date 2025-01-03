import mongoose from "mongoose";
import { URLModel } from "../../DB/urlModel.js";
import { clientRedis, getOrSetCache } from "../utils/redis.js";
import { AnalyticsModel } from './../../DB/analyticsModel.js';
import moment from 'moment';

export const storeVisit = async (req, shortId) => {

  //get client's IP address
  const ipAddress =
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.connection?.remoteAddress ||
    req.ip;

  const analyticsEvent = {
    shortId,
    ipAddress,
    timestamp: new Date(),
  };

  try {
    //publish event to Redis channel

    clientRedis.publish('analyticsChannel', JSON.stringify(analyticsEvent), (err, reply) => {
      if (err) {
        console.error("Error publishing message:", err);
      } else {
        console.log("Message published:", reply);
      }
    });

    console.log(`Published analytics event for shortId: ${shortId}`);
  } catch (error) {
    console.error('Error publishing analytics event:', error);
  }
};

export const shortenURL = async (req, res, next) => {
  const { originalURL, expiresAt } = req.body;

  if (!originalURL) {
    return next(new Error('Original URL is required', { cause: 400 }));
  }

  //Check if expiresAt is before today
  if (expiresAt && moment(expiresAt).isBefore(moment(), 'day')) {
    return next(new Error('Expiration date must be in the future.', { cause: 400 }));
  }
  try {
    //generate unique identifier
    const shortId = new mongoose.Types.ObjectId().toString();

    const newURL = {
      originalURL,
      shortId,
      expiresAt
    }

    await URLModel.create(newURL);
    //create the shortenedURL by shortId
    const shortenedURL = `${req.protocol}://${req.headers.host}/${shortId}`;
    res.status(201).json({ message: "Original URL Shortened successfully.", shortened_URL: shortenedURL });
  } catch (error) {
    console.error(error);
    return next(new Error('Internal Server Error', { cause: 500 }));
  }
}

export const redirectURL = async (req, res, next) => {
  const { shortId } = req.params;

  try {
    const URLDoc = await getOrSetCache(`${shortId}`, async () => {

      const URLDoc = await URLModel.findOne({ shortId });

      if (!URLDoc) {
        return next(new Error('Shortened URL not found.', { cause: 404 }));
      }
      const data = URLDoc
      return data;
    }, 86400)
    
     //check for expiration for URL
      
     if (URLDoc.expiresAt && new Date(URLDoc.expiresAt) < new Date()) {
      await URLModel.findOneAndUpdate({ shortId, isActive:true }, {isActive:false})
      clientRedis.del(`${shortId}`)
      clientRedis.del(`Analytics_${shortId}`)

      return next(new Error('URL has expired.', { cause: 410 }));
    }
    //publish event in redis channel (new visit)
    storeVisit(req, shortId);

    //redirect to the original URL
    res.redirect(URLDoc?.originalURL);
  } catch (error) {
    console.error(error);
    return next(new Error('Internal Server Error', { cause: 500 }));
  }
}

export const getAnalytics = async (req, res, next) => {
  const { shortId } = req.params
  try {
    // implement redis cache
    const analyticsData = await getOrSetCache(`Analytics_${shortId}`, async () => {
      //get analytics from the database
      const analyticsData = await AnalyticsModel.findOne({ shortId });

      if (!analyticsData) {
        return next(new Error('No analytics data found for this ID..', { cause: 404 }));
      }

      const data = analyticsData
      return data;
    }, 86400)

    // breakdown visits by IP
    const visitsByIP = analyticsData.visitDetails.reduce((acc, visit) => {
      const ip = visit.ipAddress;
      acc[ip] = (acc[ip] || 0) + 1; // count visits for each IP
      return acc;
    }, {});

    // breakdown visits by timestamp per day
    const visitsByTimestamp = analyticsData.visitDetails.reduce((acc, visit) => {
      const timestamp = new Date(visit.timestamp).toISOString().slice(0, 10);
      acc[timestamp] = (acc[timestamp] || 0) + 1; // count visits per day
      return acc;
    }, {});

    // prepare response
    const response = {
      shortId,
      totalVisits: analyticsData.visitCount,
      visitsByIP,
      visitsByTimestamp
    };

    res.status(200).json({ Analytics: response });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    next(new Error('Internal Server Error', { cause: 500 }));
  }
}