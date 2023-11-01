import { Car } from "../schemas/carSchema.js";
import { scrap } from "../scrapers.js";
import { getCurrentDate } from "../utils/index.js";

const insertCarsToDB = async (data) => {
  data.forEach(async (carItem) => {
    await Car.collection.updateOne(
      { carVin: carItem.carVin },
      { $set: { ...carItem, dateAdded: getCurrentDate() } },
      {
        upsert: true,
      }
    );
  });
};

const getArchivedCarsFromDB = async () => {
  const cars = await Car.find({});
  return cars;
};

const cleanArchivedCars = async () => {
  const cars = await Car.deleteMany({});
  return cars;
};

export const getCurrentCars = (_, res) => {
  scrap()
    .then(async (data) => {
      await insertCarsToDB(data);
      return res.status(200).json(data);
    })
    .catch((err) => console.log(err));
};

export const getArchivedCars = (_, res) => {
  getArchivedCarsFromDB().then((result) => {
    res.status(200).json({
      message: "Success",
      data: result,
    });
  });
};

export const cleanArchive = (_, res) => {
  cleanArchivedCars().then((result) => {
    res.status(200).json({
      message: "Success",
      data: result,
    });
  });
};
