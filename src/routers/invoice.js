import { Router } from "express";
import {
  generateInvoice,
  getInvoicePage,
  getInvoicePDFPage,
  getInvoicePreviewPage,
} from "../controller/invoice.js";
import { uploadSingle } from "../middleware/multer.js";

let router = Router();

// Temporary route for testing pdf generation
router.get("/invoice-pdf/:eventId/:invoiceId?", getInvoicePDFPage);
router.get("/:eventId", getInvoicePage);
router.get("/preview/:eventId/:invoiceId?", getInvoicePreviewPage);
router.post("/generate/:eventId", uploadSingle, generateInvoice);

export default router;
