import express from "express";
import {
  startSession,
  updateSession,
  endSession
} from "../controllers/session.controller.js";

import { getSessionById } from "../controllers/session.controller.js";



const router = express.Router();

router.post("/start", startSession);
router.post("/update", updateSession);
router.post("/end", endSession);
router.get("/:id", getSessionById);

export default router;
