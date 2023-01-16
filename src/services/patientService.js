import db from "../models";
import bcrypt from "bcryptjs";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";
import emailService from "../services/emailService";

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let handlePostBookAppointment = (data) => {
  let token = uuidv4();
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.timeType ||
        !data.fullName ||
        !data.doctorName
      ) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        await emailService.sendSimpleEmail({
          email: data.email,
          patientName: data.fullName,
          timeString: data.timeString,
          doctorName: data.doctorName,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        //upsert patient
        const [user, created] = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.gender,
            phonenumber: data.phoneNumber,
            lastName: data.fullName,
          },
        });

        //create booking record
        if (user) {
          await db.Booking.findOrCreate({
            where: {
              patientID: user.id,
              date: data.date,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientID: user.id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }

        resolve({
          errorCode: 0,
          message: "Create booking succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handlePostConfirmAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errorCode: 1,
          message: "Missing parameters",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errorCode: 0,
            message: "Update appointment succeed!",
          });
        } else {
          resolve({
            errorCode: 2,
            message: "Appoinment has been actived or does not exist",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  handlePostBookAppointment,
  handlePostConfirmAppointment,
};
