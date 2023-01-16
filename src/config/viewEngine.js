import { UseBuiltInsOption } from "@babel/preset-env/lib/options";
import express from "express";

let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "ejx");
  app.set("views", "./src/views");
};

module.exports = configViewEngine;
