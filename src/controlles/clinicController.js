import clinicService from "../services/clinicService";

let postClinic = async (req, res) => {
  try {
    let data = await clinicService.handlePostClinic(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.handleGetAllClinic();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let data = await clinicService.handleGetClinicById(req.query.id);

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server",
    });
  }
};

module.exports = {
  postClinic,
  getAllClinic,
  getDetailClinicById,
};
