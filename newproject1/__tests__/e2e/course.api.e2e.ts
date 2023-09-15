import request from 'supertest'
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils"
import {CreateCourseModel} from "../../src/features/courses/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/features/courses/models/UpdateCourseModel";
import {CourseType} from "../../src/db/db";

const getRequest = () => {
    return request(app)
}
describe ('/course', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })
    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.courses)
            .expect(200, []);
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get(`${RouterPaths.courses}/1`)
            .expect(404)
    })

    it('shouldn\'t create course with corr input data', async () => {
        await request(app)
            .post(RouterPaths.courses)
            .send({ title: '' })
            .expect(400)

        await request(app)
            .get(RouterPaths.courses)
            .expect(200, []);
    })

    let createdCourse1: any = null

    it('should create course1 with corr input data', async () => {

        const data: CreateCourseModel = { title: 'love code' };
        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send(data)
            .expect(201, )

        createdCourse1 = createResponse.body;

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: data.title
        })
        await request(app)
            .get(RouterPaths.courses)
            .expect(200, [createdCourse1]);
    })

    it('shouldnt update course witth incorr input data', async () => {

        await request(app)
            .put(`${RouterPaths.courses}/${createdCourse1.id}`)
            .send({title: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200)

    })

    it('shouldnt update course THAt not exist', async () => {

        const data1: UpdateCourseModel = {title: 'crack code' };
        await request(app)
            .put(`${RouterPaths.courses}/${-343}`)
            .send(data1)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    let createdCourse2: any = null

    it('create new course2', async () => {
        const data: CreateCourseModel = { title: 'love 2 code' };
        const createResponse = await request(app)
            .post(RouterPaths.courses)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })
        await request(app)
            .get(RouterPaths.courses)
            .expect(200, [createdCourse1, createdCourse2]);
    })

    it('should update course with corr data', async () => {

        const data2: UpdateCourseModel = { title: 'crack code' };
        await request(app)
            .put(`${RouterPaths.courses}/${createdCourse1.id}`)
            .send(data2)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: data2.title
            })
        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it('should delete', async () => {
        await request(app)
            .delete(`${RouterPaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .delete(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get(`${RouterPaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get(RouterPaths.courses)
            .expect(200, []);

    })
    afterAll(done => {
        done()
    })
})