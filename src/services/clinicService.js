import db from "../models";
import bcrypt from "bcryptjs";

let handlePostClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.address ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.provinceId
      ) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          provinceId: data.provinceId,
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

let handleGetAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
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

let handleGetClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      let doctorInfors = [];
      if (!inputId) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["image"],
          },
        });

        if (clinic) {
          let doctors = await db.Doctor_Infor.findAll({
            where: {
              clinicId: inputId,
            },
          });
          if (doctorInfors) {
            doctorInfors = doctors;
          }
          data = { ...clinic, doctorInfors };
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
  handlePostClinic,
  handleGetAllClinic,
  handleGetClinicById,
};
