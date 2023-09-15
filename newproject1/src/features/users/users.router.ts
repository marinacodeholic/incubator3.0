import express, {Response} from "express";
import {DBType, UserType} from "../../db/db";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import {HTTP_STATUSES} from "../../utils";
import {UserViewModel} from "./models/UserViewModel";
import {CreateUserModel} from "./models/CreateUserModel";
import {QueryUsersModel} from "./models/QueryUsersModel";
import {URIParamsUserIdModel} from "./models/URIParamsUserIdModel";
import {UpdateUserModel} from "./models/UpdateUserModel";

export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return{
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}

export const getUsersRouter = (db: DBType) => {
    const router = express.Router()

    router.post('/', (req: RequestWithBody<CreateUserModel>,
                      res: Response<UserViewModel>) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        const createdEntity: UserType = {
            id: +(new Date()),
            userName: req.body.userName
        }

        db.users.push(createdEntity) //обязательно ложим в БД

        res        // обязательно следить за порядком ответа. иначе будет статус 200ок!.
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityToViewModel(createdEntity))
    })

    router.get('/', (req: RequestWithQuery<QueryUsersModel>,
                            res: Response<UserViewModel[]>) => {
        let foundEntities = db.users
        if(req.query.userName) {
            foundEntities = foundEntities
                .filter(c=>c.userName.indexOf(req.query.userName) > -1)
        }
        res.json(foundEntities.map(mapEntityToViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                               res: Response<UserViewModel>) => {
        const foundUser = db.users.find(c => c.id === +req.params.id);

        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        res.json(mapEntityToViewModel(foundUser))
    })


    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>, res) => {
        db.users = db.users.filter(c => c.id !== +req.params.id);

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel,UpdateUserModel>,
                               res) => {
        if (!req.body.userName){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const foundUser = db.users.find(c => c.id === +req.params.id);
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        foundUser.userName = req.body.userName;
        res
            .sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            .json(foundUser)
    })
    return router
}