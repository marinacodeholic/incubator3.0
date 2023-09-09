import express, {Request, Response} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCourseModel} from "./models/QueryCourseModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseModel} from "./models/URIParamsCourseModel";

export const app = express();
const port = 0808

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id:number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[]} = {
    courses: [
        {id: 1, title: 'one plate', studentsCount: 10},
        {id: 2, title: 'two balls', studentsCount: 10},
        {id: 3, title: 'three cups', studentsCount: 10},
        {id: 4, title: 'four trees', studentsCount: 10},
    ]
}

//for .map
const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}
app.get('/courses', (req: RequestWithQuery<QueryCourseModel>,
                     res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses
    if(req.query.title) {
        foundCourses = foundCourses
            .filter(c=>c.title.indexOf(req.query.title) > -1)
    }
    res.json(foundCourses.map(getCourseViewModel))
})

app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>,
                         res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(getCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
                      res: Response<CourseViewModel>) => {

    if (!req.body.title){
        res.sendStatus(400)
        return;
    }

    const createCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 10
    }

    db.courses.push(createCourse); // ОБЯЗАТЕЛЬНО ЛОЖИМ В БД!!

    //res.status(201).json(createCourse)
    res.status(HTTP_STATUSES.CREATED_201) //иначе будет статус 200ок. 201 created
    res.json(getCourseViewModel(createCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseModel>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseModel,UpdateCourseModel>,
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

app.delete ('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})