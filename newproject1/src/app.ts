import express from "express";
import {request} from "express";
import {getCoursesRouter} from './features/courses/courses.router';
import {getTestsRouter} from './routes/tests';
import {db} from "./db/db";
import {getInterestingRouter} from './routes/getInterestingRouter';
import {getUsersRouter} from "./features/users/users.router";
import exp from "constants";

export const app = express();

export const RouterPaths = {
    courses:'/courses',
    users: '/users',
    __test__: '/__test__'
}
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use("/courses", getCoursesRouter(db)) //говорим апп управляться с GetCourseRouter.
//ИЗМЕНЕНИЯ ПОСЛЕ "/courses", в основном коде нужно прописывать пусть БЕЗ /courses
app.use("/__test__", getTestsRouter(db))
app.use("/interesting", getInterestingRouter(db))
app.use("/users", getUsersRouter(db))

