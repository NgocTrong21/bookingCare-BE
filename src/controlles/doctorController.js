import doctorService from "../services/doctorService";

let handleGetAllDoctors = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) {
    limit = 10;
  }
  try {
    let doctors = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json({
      errorCode: 0,
      message: "OK",
      doctors,
    });
  } catch (e) {
    return {
      errorCode: -1,
      message: "Error from server ...",
    };
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let inforDoctors = await doctorService.getAllDoctorsServices();
    return res.status(200).json({
      errorCode: 0,
      message: "OK",
      doctors: inforDoctors,
    });
  } catch (e) {
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let message = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let detailDoctors = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json({
      errorCode: 0,
      message: "OK",
      doctors: detailDoctors,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let createSchedule = async (req, res) => {
  try {
    let response = await doctorService.handleCreateSchedule(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let message = await doctorService.handleGetScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(message);
  } catch (e) {
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getExtraDoctorInforById = async (req, res) => {
  try {
    let message = await doctorService.handleGetExtraDoctorInforById(
      req.query.doctorId
    );
    return res.status(200).json(message);
  } catch (e) {
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let data = await doctorService.handleGetListPatientForDoctor(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let confirmRemedy = async (req, res) => {
  try {
    let data = await doctorService.handleConfirmRemedy(req.body);
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
  handleGetAllDoctors: handleGetAllDoctors,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  createSchedule: createSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraDoctorInforById: getExtraDoctorInforById,
  getListPatientForDoctor: getListPatientForDoctor,
  confirmRemedy: confirmRemedy,
};
