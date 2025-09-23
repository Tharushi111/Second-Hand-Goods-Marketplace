import express from "express";
import { addFinance, getFinances } from "../controllers/financeController.js";

const router = express.Router();

router.post("/", addFinance);
router.get("/", getFinances);

export default router;
