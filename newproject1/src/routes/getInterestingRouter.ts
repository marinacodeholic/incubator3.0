import {DBType} from "../db/db";
import express from "express";
import {RequestWithParams, RequestWithQuery} from "../types";
import {URIParamsCourseModel} from "../features/courses/models/URIParamsCourseModel";
import {QueryCourseModel} from "../features/courses/models/QueryCourseModel";



export const getInterestingRouter = (db: DBType) => {
    const router = express.Router()

    router.get('/books', (req: RequestWithQuery<QueryCourseModel>,
                          res) => {

        res.json({title: 'it\'s books handler'})
    })

    router.get('/:id', (req: RequestWithParams<URIParamsCourseModel>,
                        res) => {

        res.json({title: 'data by id:'  + req.params.id})
    })



    return router
}