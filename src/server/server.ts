import path from "path"
import "dotenv/config"
import "./shared/service/TranslationsYup"
import express from "express";
import { router } from "./routes";
import multer from "multer";


const app =  express()

app.use(express.json())
app.use(router)

app.use('/uploads', express.static(path.join(__dirname, '..' ,"..", 'uploads')));

export const upload = multer({ dest: 'uploads/' });


export {app}