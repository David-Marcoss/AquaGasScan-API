import supertest from "supertest"
import {app} from "../src/server/server"

export const testServer = supertest(app)