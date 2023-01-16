import express from "express";
import homeController from "../controlles/homeController";
import userController from "../controlles/userController";
import doctorController from "../controlles/doctorController";
import patientController from "../controlles/patientController";
import specialtyController from "../controlles/specialtyController";
import clinicController from "../controlles/clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  //api
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.handleGetAllCode);

  //doctor
  router.get("/api/top-doctor-home", doctorController.handleGetAllDoctors);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-infor-doctor", doctorController.postInforDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post("/api/create-schedule", doctorController.createSchedule);
  router.get(
    "/api/get-doctor-schedule-by-date",
    doctorController.getScheduleByDate
  );
  router.get(
    "/api/get-extra-doctor-infor-by-id",
    doctorController.getExtraDoctorInforById
  );
  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );
  router.post("/api/confirm-remedy", doctorController.confirmRemedy);

  //patient
  router.post(
    "/api/patient-booking-appointment",
    patientController.postBookAppointment
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.postComfirmAppointment
  );

  //specialty
  router.post("/api/post-specialty", specialtyController.postSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );

  //clinic
  router.post("/api/post-clinic", clinicController.postClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
