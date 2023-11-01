import express from "express";
import cors from "cors";
import carRoutes from "./routes/carRoutes.js";
import archivedRoutes from "./routes/archivedRoutes.js";

const app = express();

app.use(cors());

app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/archived", archivedRoutes);

export { app };
