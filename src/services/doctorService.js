import db from "../models";
import _ from "lodash";
import emailService from "../services/emailService";

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        where: {
          roleId: "R2",
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["ValueEn", "ValueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["ValueEn", "ValueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve(doctors);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctorsServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve(doctors);
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredFields = (inputData) => {
  let arr = [
    "doctorId",
    "contentMarkdown",
    "contentHTML",
    "action",
    "priceId",
    "paymentId",

    "specialtyId",
    "clinicId",
    "note",
    "provinceId",
  ];
  let isValidate = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValidate = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValidate,
    element,
  };
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkData = checkRequiredFields(inputData);
      if (checkData.isValidate === false) {
        resolve({
          errorCode: 1,
          message: `Missing parameter: ${checkData.element}`,
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentMarkdown: inputData.contentMarkdown,
            contentHTML: inputData.contentHTML,
            description: inputData.description,
            doctorId: inputData.doctorId,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: {
              doctorId: inputData.doctorId,
            },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.specialtyId = inputData.specialtyId;
            doctorMarkdown.clinicId = inputData.clinicId;
            await doctorMarkdown.save();
          }
        }

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          doctorInfor.priceId = inputData.priceId;
          doctorInfor.paymentId = inputData.paymentId;

          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          doctorInfor.provinceId = inputData.provinceId;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.priceId,
            paymentId: inputData.paymentId,

            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
            provinceId: inputData.provinceId,
          });
        }

        resolve({
          errorCode: 0,
          message: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errorCode: 1,
          message: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Clinic,
                  as: "detailClinic",
                  attributes: {
                    exclude: ["contentHTML", "contentMarkdown", "image"],
                  },
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }
        resolve(data);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleCreateSchedule = (inputData) => {
  let formatInput = inputData.arrData.map((item) => {
    item.maxNumber = process.env.MAX_NUMBER_SCHEDULE;
    return item;
  });

  return new Promise(async (resolve, reject) => {
    try {
      let existData = await db.Schedule.findAll({
        where: {
          doctorId: inputData.doctorId,
          date: `${inputData.date}`,
        },
        attributes: ["doctorId", "timeType", "date", "maxNumber"],
      });

      let toCreate = _.differenceWith(formatInput, existData, (a, b) => {
        return a.timeType === b.timeType && +a.date === +b.date;
      });

      let toUpdate = _.differenceWith(existData, formatInput, (a, b) => {
        return a.timeType === b.timeType && +a.date === +b.date;
      });

      if (toCreate && toCreate.length > 0) {
        await db.Schedule.bulkCreate(toCreate);
        resolve({
          errorCode: 0,
          message: "OK",
        });
      } else if (toUpdate && toUpdate.length > 0) {
        toUpdate.forEach(async (item) => {
          await db.Schedule.destroy({
            where: {
              date: item["date"],
              doctorId: item["doctorId"],
              timeType: item["timeType"],
            },
          });
        });
        resolve({
          errorCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errorCode: -1,
          message: "Missing parameters!",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId,
            date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (!dataSchedule) {
          dataSchedule = [];
        }
        resolve({
          errorCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetExtraDoctorInforById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputId,
          },
          attributes: {
            exclude: ["doctorId", "id"],
          },
          include: [
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Clinic,
              as: "detailClinic",
              attributes: {
                exclude: ["contentHTML", "contentMarkdown", "image"],
              },
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) {
          data = {};
        }

        resolve({
          errorCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        let bookings = await db.Booking.findAll({
          where: {
            date: date,
            doctorId: doctorId,
            statusId: "S2",
          },
          include: [
            {
              model: db.User,
              exclude: ["password", "image"],
              as: "patientInfor",
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["keyMap", "valueVi", "valueEn"],
                },
              ],
              raw: true,
              nest: true,
            },
            {
              model: db.Allcode,
              as: "bookingTime",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errorCode: 0,
          message: "Ok",
          data: bookings,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let handleConfirmRemedy = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.date ||
        !inputData.patientId ||
        !inputData.doctorId ||
        !inputData.namePatient ||
        !inputData.timeString ||
        !inputData.fileBase64
      ) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        //update statusId
        let appointment = await db.Booking.findOne({
          where: {
            date: inputData.date,
            patientID: inputData.patientId,
            doctorId: inputData.doctorId,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        //send remedy
        await emailService.sendAttachment(inputData);
        resolve({
          errorCode: 0,
          message: "Update appointment succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctorsServices: getAllDoctorsServices,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  handleCreateSchedule: handleCreateSchedule,
  handleGetScheduleByDate: handleGetScheduleByDate,
  handleGetExtraDoctorInforById: handleGetExtraDoctorInforById,
  handleGetListPatientForDoctor: handleGetListPatientForDoctor,
  handleConfirmRemedy: handleConfirmRemedy,
};
