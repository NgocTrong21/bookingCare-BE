import db from "../models";
import bcrypt from "bcryptjs";

let handlePostSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.contentHTML ||
        !data.contentMarkdown
      ) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.image,
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
        });
        resolve({
          errorCode: 0,
          message: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        resolve({
          errorCode: 0,
          message: "Ok",
          data,
        });
      } else {
        resolve({
          errorCode: 0,
          message: "Ok",
          data: [],
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      let doctorInfors = [];
      if (!inputId || !location) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["contentHTML", "contentMarkdown", "name"],
        });

        if (specialty) {
          data = specialty;
          if (location === "ALL") {
            doctorInfors = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
              },
              attributes: ["doctorId"],
            });
            if (doctorInfors) {
              data.doctorInfors = doctorInfors;
            } else {
              data.doctorInfors = [];
            }
          } else {
            doctorInfors = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId"],
            });
            if (doctorInfors) {
              data.doctorInfors = doctorInfors;
            } else {
              data.doctorInfors = [];
            }
          }
        } else {
          data = {};
        }
        resolve({
          errorCode: 0,
          message: "Ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handlePostSpecialty,
  handleGetAllSpecialty,
  handleGetSpecialtyById,
};
