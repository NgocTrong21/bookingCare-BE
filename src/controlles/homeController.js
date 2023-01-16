import db from "../models/index";
import {
  createNewUser,
  getAllUsers,
  getUserInforByID,
  updateUserData,
  deleteUserById,
} from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD from View");
};

let displayGetCRUD = async (req, res) => {
  let data = await getAllUsers();
  console.log("------------------");
  console.log(data);
  console.log("------------------");
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userID = req.query.id;
  if (userID) {
    let userData = await getUserInforByID(userID);
    console.log("------------------");
    console.log(userData);
    console.log("------------------");
    res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    res.send("Not found!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
  });
};

let deleteCRUD = async (req, res) => {
  let userID = req.query.id;
  let allUsers = await deleteUserById(userID);
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
  });
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
