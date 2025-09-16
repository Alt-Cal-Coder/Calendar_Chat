import { Router } from 'express';
import { getAddressDetails, getAddressOptions } from '../controller/location.js';

let router = Router();

router.get("/get-address-options", getAddressOptions);
router.get("/get-address-details/:placeId", getAddressDetails);

export default router;
