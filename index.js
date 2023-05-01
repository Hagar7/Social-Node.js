import { config } from "dotenv";
import { initateApp } from "./src/utils/initateApp.js";
import express from "express";


config({path:'./config/.env'})

const app = express();

initateApp(app,express)