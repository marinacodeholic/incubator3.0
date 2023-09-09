"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 1133;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: 'one plate' },
        { id: 2, title: 'two balls' },
        { id: 3, title: 'three cups' },
        { id: 4, title: 'four trees' },
    ]
};
exports.app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
exports.app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});
exports.app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const createCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createCourse);
    //res.status(201).json(createCourse)
    res.status(201); //иначе будет статус 200ок. 201 created
    res.json(createCourse);
});
exports.app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(204);
});
exports.app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(404);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    foundCourse.title = req.body.title;
    res
        .json(foundCourse)
        .sendStatus(204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
