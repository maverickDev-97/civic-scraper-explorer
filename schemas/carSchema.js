import { Schema, model } from "mongoose";

const carSchema = new Schema({
  carTitle: String,
  carPrice: String,
  carImage: String,
  carVin: String,
  dateAdded: String,
});

export const Car = model("Car", carSchema);
