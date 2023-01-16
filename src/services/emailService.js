require("dotenv").config();
const nodemailer = require("nodemailer");
import moment from "moment/moment";

let sendSimpleEmail = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Maximus 👻" <trong21082001@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám từ hệ thống</p>
        <h4>Thông tin lịch khám:</h4>
        <div>Thời gian: ${dataSend.timeString}</div>
        <div>Bác sĩ: ${dataSend.doctorName}</div>
        <p>Nếu thông tin trên chính xác hãy click vào link dưới đây để xác thực!</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
        `, // html body
  });
};

let sendAttachment = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Maximus 👻" <trong21082001@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Xác nhận đã khám và thông tin đơn thuốc", // Subject line
    html: `
        <h3>Xin chào ${dataSend.namePatient}</h3>
        <p>Cảm ơn bạn đã tin tưởng và chọn khám tại cơ sở của chúng tôi vào lúc ${dataSend.timeString}</p>
        <div>Dưới đây là thông tin đơn thuốc của bạn</div>
        `, // html body
    attachments: [
      {
        // encoded string as an attachment
        filename: "text1.png",
        content: dataSend.fileBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
};
