import { model, Schema } from "mongoose";

const analyticsSchema = new Schema({
  shortId: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 0 },
  visitDetails: [
    {
      ipAddress: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export const AnalyticsModel = model('Analytics', analyticsSchema);
