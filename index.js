import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

const PORT = process.env.PORT;
const MONGO_DB = process.env.MONGO_DB;

app.listen(PORT, async () => {
  await mongoose.connect(MONGO_DB);
  console.log(`App is listening on http://localhost:${PORT}`);
});
