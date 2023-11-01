import { Router } from "express";
import { cleanArchive, getArchivedCars } from "../controllers/carController.js";

const router = Router();

router.route("/").get(getArchivedCars).delete(cleanArchive);

export default router;
