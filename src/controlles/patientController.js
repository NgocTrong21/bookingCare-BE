import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let data = await patientService.handlePostBookAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let postComfirmAppointment = async (req, res) => {
  try {
    let data = await patientService.handlePostConfirmAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

module.exports = {
  postBookAppointment,
  postComfirmAppointment,
};
