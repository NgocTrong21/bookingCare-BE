import specialtyService from "../services/specialtyService";

let postSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.handlePostSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.handleGetAllSpecialty();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errorCode: -1,
      message: "Error from server...",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let data = await specialtyService.handleGetSpecialtyById(
      req.query.id,
      req.query.location
    );

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
  postSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
