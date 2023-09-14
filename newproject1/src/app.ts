import express from "express";
import {request} from "express";
import {getCoursesRouter} from './routes/courses.router';
import {getTestsRouter} from './routes/tests';
import {db} from "./db/db";
import {getInterestingRouter} from './routes/getInterestingRouter';

export const app = express();

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use("/courses", getCoursesRouter(db)) //говорим апп управляться с GetCourseRouter.
//ИЗМЕНЕНИЯ ПОСЛЕ "/courses", в основном коде нужно прописывать пусть БЕЗ /courses
app.use("/__test__", getTestsRouter(db))
app.use("/interesting", getInterestingRouter(db))