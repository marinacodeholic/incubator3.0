import express, {Response} from "express";
import {CourseType, DBType} from "../../db/db";
import {CourseViewModel} from "./models/CourseViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {QueryCourseModel} from "./models/QueryCourseModel";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {HTTP_STATUSES} from "../../utils";



export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return{
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const getCoursesRouter = (db: DBType) => {
    const CoursesRouter = express.Router()



    CoursesRouter.get('/', (req: RequestWithQuery<QueryCourseModel>,
                                   res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses
        if(req.query.title) {
            foundCourses = foundCourses
                .filter(c=>c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getCourseViewModel))
    })

    CoursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseModel>,
                                       res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(404);
            return;
        }
        res.json(getCourseViewModel(foundCourse))
    })

    CoursesRouter.post('/', (req: RequestWithBody<CreateCourseModel>,
                             res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        }

        db.courses.push(createdCourse) //обязательно ложим в БД

        res        // обязательно следить за порядком ответа. иначе будет статус 200ок!.
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createdCourse))
    })

    CoursesRouter.delete('/:id', (req: RequestWithParams<URIParamsCourseModel>, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    CoursesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseModel,UpdateCourseModel>,
                                       res) => {
        if (!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(404);
            return;
        }
        foundCourse.title = req.body.title;
        res
            .sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            .json(foundCourse)
    })
    return CoursesRouter
}
