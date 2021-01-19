const admin = require("../config/firebase");
const getPagination = require("../utility/getPagination");
const { tMateris: materiModel } = require("../models");
const { Op } = require("sequelize");
const bucket = admin.storage().bucket();

exports.CreateMateri = async (req, res, next) => {
  let data;
  let pathImage;
  if (req.file) {
    data = bucket.file(
      `materi-image/${new Date().getTime()}.${req.file.mimetype.split("/")[1]}`
    );
    await data.save(req.file.buffer);
    pathImage = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(data.name)}?alt=media`;
  }

  try {
    if (!req.body.title || !req.body.description || !req.file) {
      throw new Error("title, description, and image is required");
    }

    const materi = await materiModel.create({
      title: req.body.title,
      description: req.body.description,
      image: pathImage,
    });
    if (materi) {
      res.status(201).json({
        success: true,
        msg: "Create Materi Success",
        data: {
          id: materi.get("id"),
          title: materi.get("title"),
          description: materi.get("description"),
          image: materi.get("image"),
          createdAt: materi.get("createdAt"),
          updatedAt: materi.get("updatedAt"),
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

exports.GetAllMateri = async (req, res, next) => {
  try {
    const params = {
      currentPage: parseInt(req.query.page) || 1,
      perPage: parseInt(req.query.limit) || 12,
    };
    const dataMateri = await materiModel.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${req.query.q || ""}%`,
        },
      },
      limit: params.perPage,
      offset: parseInt(params.perPage) * (parseInt(params.currentPage) - 1),
      order: [["createdAt", "DESC"]],
    });
    if (dataMateri.rows.length > 0) {
      res.status(200).send({
        success: true,
        data: dataMateri.rows,
        pagination: getPagination(req, params, dataMateri.count),
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
exports.GetDetailMateri = async (req, res, next) => {
  try {
    const dataMater = await materiModel.findOne({
      where: { id: req.params.id },
    });
    if (dataMater) {
      res.status(200).send({
        success: true,
        data: dataMater.dataValues,
      });
    } else {
      res.status(404).send({
        success: false,
        msg: "Materi Not Found",
      });
    }
  } catch (err) {
    console.log(err);
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};

exports.updateDataMateri = async (req, res, next) => {
  let data;
  let pathImage;
  if (req.file) {
    data = bucket.file(
      `materi-image/${new Date().getTime()}.${req.file.mimetype.split("/")[1]}`
    );
    await data.save(req.file.buffer);
    pathImage = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(data.name)}?alt=media`;
  }
  try {
    const fillAble = ["title", "description", "image"];

    let materi = await materiModel.findOne({
      where: { id: req.params.id },
    });
    if (materi) {
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
      const updateData = await materiModel.update(dataToUpdate, {
        where: { id: req.params.id },
      });
      if (updateData && pathImage && materi.dataValues.image) {
        await bucket
          .file(
            `materi-image/${
              materi.dataValues.image
                .substring(
                  materi.dataValues.image.indexOf("materis-image%2F"),
                  materi.dataValues.image.indexOf("?alt=media")
                )
                .split("%2F")[1]
            }`
          )
          .delete();
      }
      materi = await materiModel.findOne({
        where: { id: req.params.id },
      });
      res.status(200).json({
        success: true,
        msg: "Updated materi Success",
        data: materi.dataValues,
      });
    } else {
      res.status(404).send({
        success: false,
        msg: "materi Not Found",
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

exports.DeleteMateri = async (req, res, next) => {
  try {
    const dataMateri = await materiModel.findOne({
      where: { id: req.params.id },
    });

    if (!dataMateri) {
      throw new Error("Materi Not Found");
    }
    await dataMateri.destroy();
    if (dataMateri.dataValues.image) {
      await bucket
        .file(
          `materi-image/${
            dataMateri.dataValues.image
              .substring(
                dataMateri.dataValues.image.indexOf("materi-image%2F"),
                dataMateri.dataValues.image.indexOf("?alt=media")
              )
              .split("%2F")[1]
          }`
        )
        .delete();
    }

    res.status(200).json({
      success: true,
      msg: "Delete Materi Success",
    });
  } catch (err) {
    const error = new Error(err.message || "Something Error");
    error.status = 202;
    next(error);
  }
};
