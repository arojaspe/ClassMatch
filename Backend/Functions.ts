import { Request, Response } from "express";
import * as Models from "./Models";
import { v4 as uuidv4 } from 'uuid';
import { sign, verify } from "jsonwebtoken";
import { FloatDataType, Model, Op, Sequelize } from 'sequelize';

//Error showing
interface Result<T> { data: any, error?: string }

//String Handling
export function str2hsh(str: string): string {
    let hash = 0;
    if (str.length == 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

//Users
export async function createUser(firstname: string, lastname: string, email: string, password:string, gender: string, birthdate: Date, college: string, bio: string, filter_age: string, filter_gender: string) {
    let usuario = await findUser(undefined, email)
    if (usuario) {
        throw new Error("User with that email already exists")
    } else {
        let id: string = uuidv4()
        await Models.USERS_MOD.create({
            USER_ID: id,
            USER_FIRSTNAME: firstname,
            USER_LASTNAME: lastname,
            USER_EMAIL: email,
            USER_PASSWORD: str2hsh(password),
            USER_COLLEGE_ID: college,
            USER_GENDER: gender,
            USER_BIRTHDATE: birthdate,
            USER_BIO: bio,
            USER_LAST_LOG: new Date(),
            USER_RATING: 0,
            USER_FILTER_AGE: filter_age,
            USER_SUPERMATCHES: 5,
            USER_FILTER_GENDER: filter_gender
        })
        return ([id])
    }
}
export async function updateUser(req: Request, bio?: Text, last_log?: Date, status?: Boolean, rating?: FloatDataType, filter_age?: string, filter_gender?: string) {
        let usuario: Model<any, any> = await isLoggedIn(req)

        usuario.set({
            USER_BIO: bio ?? usuario.getDataValue("USER_BIO"),
            USER_LAST_LOG: last_log ?? usuario.getDataValue("USER_LAST_LOG"),
            USER_STATUS: status ?? usuario.getDataValue("USER_STATUS"),
            USER_RATING: rating ?? usuario.getDataValue("USER_RATING"),
            USER_FILER_AGE: filter_age ?? usuario.getDataValue("USER_FILTER_AGE"),
            USER_FILTER_GENDER: filter_gender?? usuario.getDataValue("USER_FILTER_GENDER")
        })
        usuario.save();
}
export async function logIn(email: string, password: string){
    try {
        let usuario = await findUser(undefined, email)
        if (usuario) {
            if (str2hsh(password) == usuario?.getDataValue("USER_PASSWORD")) {
                let tokens = await updateToken(usuario)
                return ([tokens.data[0], tokens.data[1], await authUser(usuario.getDataValue("USER_ID"))])
            } else {
                throw new Error("Not the correct password")
            }
        } else {
            throw new Error("No user with that email")
        }
    } catch (error: any) {
        return(error.message)
    }
}
export async function authUser(uuid: string){
    try {
        const usuario = await Models.USERS_MOD.findOne({
            where: { USER_ID: uuid },
            attributes: {
                exclude:
                    ["USER_PASSWORD"]
            }
        })
        return {message: "Success Logging in", data: usuario}
    } catch (error: any) {
        throw new Error("User not logged in");
    }
}
export async function isLoggedIn(req: Request) {
        const payload: any = verify(req.cookies["access_token"], "access_secret")

        const user: Result<any> = await authUser(payload.id)
        if (user.error) {
            console.error(user.error)
        }
        return (user?.data)
}
let updateToken = async function (user: Model<any, any>) {
    try {
        let access_token = sign({
            id: user.getDataValue("USER_ID")
        }, "access_secret", { expiresIn: "15m" });

        let refresh_token = sign({
            id: user.getDataValue("USER_ID")
        }, "refresh_secret", { expiresIn: "1w" });
        return {data: [access_token, refresh_token]}
    } catch (error) {
        throw new Error("Unable to update credentials");
    }
}
export let findUser = async function (id?: string, email?: string) {
    if (id) {
        let usuario = await Models.USERS_MOD.findByPk(id)
        return usuario
    }
    let usuario = await Models.USERS_MOD.findOne({ where: { USER_EMAIL: email } })
    return usuario
}

//Colleges
export async function createCollege(name: string, domain: string, city: string) {
    let college = await findCollege(undefined, domain, city)
    if (college) {
        return ("College already exists!")
    } else {
        let id: string = uuidv4()
        await Models.COLLEGES_MOD.create({
            COLLEGE_ID: id,
            COLLEGE_NAME: name,
            COLLEGE_DOMAIN: domain,
            COLLEGE_CITY: city            
        })
        return ([id])
    }
}
let findCollege = async function (id?: string, domain?: string, city?: string) {
    if (id) {
        let college = await Models.COLLEGES_MOD.findByPk(id)
        return college
    }
    let college = await Models.COLLEGES_MOD.findOne({ where: { COLLEGE_DOMAIN: domain, COLLEGE_CITY: city } })
    return college

}

//Colleges unsure!!!
export const getCollege = async (req: Request, res: Response) => {

    const { college_id } = req.params;

    const college = await Models.COLLEGES_MOD.findByPk(college_id);

    res.status(200).send({
        data: {
            college: college,
            msg: "Succesful"
        }
    })
}