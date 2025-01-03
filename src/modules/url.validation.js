import joi from "joi"
import { generalFields } from "../middlewares/validation.js"

export const shortenURLSchema = {
    body: joi.object({
        originalURL: joi.string().uri().required(),
        expiresAt:joi.date()
    }).required()
}

export const redirectURLSchema = {
    params: joi.object({
        shortId:generalFields._id.required()
    }).required()
}

export const getAnalyticsSchema = {
    params: joi.object({
        shortId:generalFields._id.required()
    }).required()
}