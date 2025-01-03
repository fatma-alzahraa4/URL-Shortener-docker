import { Router } from "express";
import { getAnalytics, redirectURL, shortenURL } from "./url.controller.js";
import { asyncHandler } from "../utils/errorHandeling.js";
import { getAnalyticsSchema, redirectURLSchema, shortenURLSchema } from "./url.validation.js";
import { validationCoreFunction } from "../middlewares/validation.js";

const router = Router()

router.post('/shorten',
    validationCoreFunction(shortenURLSchema),
    asyncHandler(shortenURL)
)

router.get('/:shortId',
    validationCoreFunction(redirectURLSchema),
    asyncHandler(redirectURL)
)

router.get('/analytics/:shortId',
    validationCoreFunction(getAnalyticsSchema),
    asyncHandler(getAnalytics)
)
export default router