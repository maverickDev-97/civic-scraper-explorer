import { Router } from "express";
import { getCurrentCars } from "../controllers/carController.js";

const router = Router();

router.route("/").get(getCurrentCars);

export default router;
