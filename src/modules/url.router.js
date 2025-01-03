import { Router } from "express";
import { getAnalytics, redirectURL, shortenURL } from "./url.controller.js";
import { asyncHandler } from "../utils/errorHandeling.js";
// import { validationCoreFunction } from "../../middlewares/validation.js";

const router = Router()

router.post('/shorten',
    // validationCoreFunction(categoryValidation.addCategorySchema),
    asyncHandler(shortenURL)
)

router.get('/:shortId',
    // validationCoreFunction(categoryValidation.addCategorySchema),
    asyncHandler(redirectURL)
)

router.get('/analytics/:shortId',
    // validationCoreFunction(categoryValidation.addCategorySchema),
    asyncHandler(getAnalytics)
)
export default router