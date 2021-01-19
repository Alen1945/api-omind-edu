const admin = require("../config/firebase");
const getPagination = require("../utility/getPagination");
const { tEvents: eventModel } = require("../models");
const { Op } = require("sequelize");
const bucket = admin.storage().bucket();

exports.CreateEvents = async (req, res, next) => {
  let data;
  let pathImage;
  if (req.file) {
    data = bucket.file(
      `event-image/${new Date().getTime()}.${req.file.mimetype.split("/")[1]}`
    );
    await data.save(req.file.buffer);
    pathImage = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(data.name)}?alt=media`;
  }

  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.eventDate ||
      !req.file
    ) {
      throw new Error("title, description,evenDate, and image is required");
    }

    const event = await eventModel.create({
      title: req.body.title,
      eventDate: req.body.eventDate,
      description: req.body.description,
      image: pathImage,
    });
    if (event) {
      res.status(201).json({
        success: true,
        msg: "Create event Success",
        data: {
          id: event.get("id"),
          title: event.get("title"),
          description: event.get("description"),
          eventDate: event.get("eventDate"),
          image: event.get("image"),
          createdAt: event.get("createdAt"),
          updatedAt: event.get("updatedAt"),
        },
      });
    } else {
      throw new Error("Something Error");
    }
  } catch (err) {
    if (data) {
      await data.delete();
    }
    console.log(err);
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};

exports.GetAllEvent = async (req, res, next) => {
  try {
    const params = {
      currentPage: parseInt(req.query.page) || 1,
      perPage: parseInt(req.query.limit) || 12,
    };
    const dataEvent = await eventModel.findAndCountAll({
      limit: params.perPage,
      offset: parseInt(params.perPage) * (parseInt(params.currentPage) - 1),
      order: [["createdAt", "DESC"]],
    });
    if (dataEvent.rows.length > 0) {
      res.status(200).send({
        success: true,
        data: dataEvent.rows,
        pagination: getPagination(req, params, dataEvent.count),
      });
    } else {
      res.status(200).send({
        success: true,
        data: [],
        msg: "Data is Empty",
      });
    }
  } catch (err) {
    console.log(err);
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};

exports.updateDataEvent = async (req, res, next) => {
  let data;
  let pathImage;
  if (req.file) {
    data = bucket.file(
      `event-image/${new Date().getTime()}.${req.file.mimetype.split("/")[1]}`
    );
    await data.save(req.file.buffer);
    pathImage = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(data.name)}?alt=media`;
  }
  try {
    const fillAble = ["title", "description", "eventDate", "image"];

    let event = await eventModel.findOne({
      where: { id: req.params.id },
    });
    if (event) {
      const dataToUpdate = {};
      fillAble.forEach((v) => {
        if (v == "image" && pathImage) {
          dataToUpdate[v] = pathImage;
        } else if (req.body[v]) {
          dataToUpdate[v] = req.body[v];
        }
      });
      if (!(Object.keys(dataToUpdate).length > 0)) {
        throw new Error("Please defined update data");
      }
      const updateData = await eventModel.update(dataToUpdate, {
        where: { id: req.params.id },
      });
      if (updateData && pathImage && event.dataValues.image) {
        await bucket
          .file(
            `event-image/${
              event.dataValues.image
                .substring(
                  event.dataValues.image.indexOf("event-image%2F"),
                  event.dataValues.image.indexOf("?alt=media")
                )
                .split("%2F")[1]
            }`
          )
          .delete();
      }
      event = await eventModel.findOne({
        where: { id: req.params.id },
      });
      res.status(200).json({
        success: true,
        msg: "Updated event Success",
        data: event.dataValues,
      });
    } else {
      res.status(404).send({
        success: false,
        msg: "event Not Found",
      });
    }
  } catch (err) {
    if (data) {
      await data.delete();
    }
    console.log("ada", err);
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};

exports.DeleteEvent = async (req, res, next) => {
  try {
    const dataEvent = await eventModel.findOne({
      where: { id: req.params.id },
    });

    if (!dataEvent) {
      throw new Error("Event Not Found");
    }
    await dataEvent.destroy();
    if (dataEvent.dataValues.image) {
      await bucket
        .file(
          `event-image/${
            dataEvent.dataValues.image
              .substring(
                dataEvent.dataValues.image.indexOf("event-image%2F"),
                dataEvent.dataValues.image.indexOf("?alt=media")
              )
              .split("%2F")[1]
          }`
        )
        .delete();
    }

    res.status(200).json({
      success: true,
      msg: "Delete Event Success",
    });
  } catch (err) {
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};
