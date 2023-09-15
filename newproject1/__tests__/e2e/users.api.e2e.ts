import request from 'supertest'
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils"
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";
import {UpdateUserModel} from "../../src/features/users/models/UpdateUserModel";
import {usersTestManager} from "../utils/usersTestManager";


const getRequest = () => {
    return request(app)
}
describe ('test for /users', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })
    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.users)
            .expect(200, []);
    })

    it('should return 404 for not existing entity', async () => {
        await request(app)
            .get(`${RouterPaths.users}/1`)
            .expect(404)
    })

    it('shouldn\'t create entity with incorr input data', async () => {
        const data: CreateUserModel = {userName: ''};

        await usersTestManager.createUser(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, []);
    })

    let createdEntity1: any = null

    it('should create Entity1 with corr input data', async () => {
        const data: CreateUserModel = { userName: 'Mark' };

        const createResponse = await usersTestManager.createUser(data)

        createdEntity1 = createResponse.body;

        expect(createdEntity1).toEqual({
            id: expect.any(Number),
            userName: data.userName
        })
        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1]);
    })

    let createdEntity2: any = null

    it('create new Entity2', async () => {
        const data: CreateUserModel = { userName: 'Mark 2' };

        const createResponse = await usersTestManager.createUser(data)

        createdEntity2 = createResponse.body;

        expect(createdEntity2).toEqual({
            id: expect.any(Number),
            userName: data.userName
        })
        await request(app)
            .get(RouterPaths.users)
            .expect(200, [createdEntity1, createdEntity2]);
    })

    it('shouldnt update entity THAt not exist', async () => {

        const data1: UpdateUserModel = {userName: 'Markusha' };
        await request(app)
            .put(`${RouterPaths.users}/${-343}`)
            .send(data1)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })


    it('shouldnt update Entity with incorr input data', async () => {

        await request(app)
            .put(`${RouterPaths.users}/${createdEntity1.id}`)
            .send({title: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200)

    })


    it('should update entity with corr data', async () => {

        const data2: UpdateUserModel = { userName: 'MarkKim' };
        await request(app)
            .put(`${RouterPaths.users}/${createdEntity1.id}`)
            .send(data2)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdEntity1,
                userName: data2.userName
            })
        await request(app)
            .get(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity2)
    })

    it('should delete', async () => {
        await request(app)
            .delete(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .delete(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get(RouterPaths.users)
            .expect(200, []);

    })
    // afterAll(done => {
    //     done()
    // })
})