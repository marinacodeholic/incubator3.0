import express, {Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {QueryCourseModel} from "./models/QueryCourseModel";
// import {Response} from "express";
import {CourseViewModel} from "./models/CourseViewModel";
import {db} from "./db/db";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {CourseType} from "./db/db"








// for .map



// app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
//                       res: Response<CourseViewModel>) => {
//
//     if (!req.body.title){
//         res.sendStatus(400)
//         return;
//     }
//
//     const createCourse: CourseType = {
//         id: +(new Date()),
//         title: req.body.title,
//         studentsCount: 10
//     }
//
//     db.courses.push(createCourse); // ОБЯЗАТЕЛЬНО ЛОЖИМ В БД!!
//
//     //res.status(201).json(createCourse)
//     res.status(HTTP_STATUSES.CREATED_201) //иначе будет статус 200ок. 201 created
//     res.json(getCourseViewModel(createCourse))
// })


