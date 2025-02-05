import { Request, Response } from "express";
import * as Models from "./Models";
import { v4 as uuidv4 } from 'uuid';
import { sign, verify } from "jsonwebtoken";
import { resend } from "./Connection";
import RaycastMagicLinkEmail from "../Email_templates/Verification";
import { FloatDataType, Model, Op, where } from 'sequelize';

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

//Users !!!!!!!!!!
export async function createUser(firstname: string, lastname: string, email: string, password: string, gender: string,
    birthdate: Date, college: string, bio: string, filter_age: string, filter_gender: string) {
    let usuario = await findUser(undefined, email)
    let college_domain = await findCollege(college).then((college) => college?.getDataValue("COLLEGE_DOMAIN"))
    if (usuario) {
        throw new Error("User with that email already exists")
    } else if (email.split("@").at(-1) != college_domain) {
        throw new Error("Email is not valid for this college")
    }
    else {
        await Models.USERS_MOD.create({
            USER_ID: null,
            USER_FIRSTNAME: firstname,
            USER_LASTNAME: lastname,
            USER_EMAIL: email,
            USER_PASSWORD: str2hsh(password),
            USER_GENDER: gender,
            USER_BIRTHDATE: birthdate,
            USER_COLLEGE_ID: college,
            USER_BIO: bio,
            USER_LAST_LOG: new Date(),
            USER_RATING: 0,
            USER_FILTER_AGE: filter_age,
            USER_SUPERMATCHES: 5,
            USER_FILTER_GENDER: filter_gender
        })
        verifyEmail(email)
        return "Email has been sent for verification"
    }
}
export async function updateUser(user_id: string, res: Response, bio?: Text, last_log?: Date, status?:
    Boolean, rating?: FloatDataType, filter_age?: string, filter_gender?: string) {
    let usuario: Model<any, any> = await findUser(user_id)
    usuario.set({
        USER_BIO: bio ?? usuario.getDataValue("USER_BIO"),
        USER_LAST_LOG: last_log ?? usuario.getDataValue("USER_LAST_LOG"),
        USER_STATUS: status ?? usuario.getDataValue("USER_STATUS"),
        USER_RATING: rating ?? usuario.getDataValue("USER_RATING"),
        USER_FILER_AGE: filter_age ?? usuario.getDataValue("USER_FILTER_AGE"),
        USER_FILTER_GENDER: filter_gender ?? usuario.getDataValue("USER_FILTER_GENDER")
    })
    usuario.save();
    return usuario
}
export async function logIn(email: string, password: string) {
    try {
        let usuario = await findUser(undefined, email)
        if (usuario) {
            if (!usuario.getDataValue("USER_ID")) {
                throw new Error("Email has not been verified")
            }
            if (str2hsh(password) == usuario?.getDataValue("USER_PASSWORD")) {
                let tokens = await addTokens(usuario)
                return ([tokens.data[0], tokens.data[1], await authUser(usuario.getDataValue("USER_ID"))])
            } else {
                throw new Error("Not the correct password")
            }
        } else {
            throw new Error("No user with that email")
        }
    } catch (error: any) {
        return (error.message)
    }
}
export async function isLoggedIn(req: Request, res: Response) {
    let payload: any;
    if (!req.cookies["refresh_token"]) {
        throw new Error("User signed out")
    }
    try {
        payload = verify(req.cookies["access_token"], "access_secret")
        if (!payload.USER_ID) {
            throw new Error("Email has not been verified")
        }
    } catch (accessTokenError: any) {
        if (accessTokenError.message === "jwt must be provided" || accessTokenError.message.includes("expired")) {
            const newAccessToken = refreshToken(req, res);
            payload = await verify(newAccessToken, "access_secret")
        } else {
            throw accessTokenError;
        }
    }
    const { iat, exp, ...filteredPayload } = payload
    return filteredPayload
}
export function refreshToken(req: Request, res: Response): string {
    const refresh_token = req.cookies["refresh_token"];
    if (!refresh_token) {
        throw new Error("Refresh token is missing");
    }
    const payload: any = verify(refresh_token, "refresh_secret");
    const access_token = sign({
        USER_ID: payload.USER_ID,
        USER_FIRSTNAME: payload.USER_FIRSTNAME,
        USER_LASTNAME: payload.USER_LASTNAME,
        USER_EMAIL: payload.USER_EMAIL,
        USER_COLLEGE_ID: payload.USER_COLLEGE_ID,
        USER_BIRTHDATE: payload.USER_BIRTHDATE,
        USER_BIO: payload.USER_BIO,
        USER_STATUS: payload.USER_STATUS,
        USER_LAST_LOG: payload.USER_LAST_LOG,
        USER_SUPERMATCHES: payload.USER_SUPERMATCHES,
        USER_FILTER_AGE: payload.USER_FILTER_AGE,
        USER_FILTER_GENDER: payload.USER_FILTER_GENDER
    }, "access_secret", { expiresIn: "15m" });

    res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 15 * 1000 // 15 minutes
    });

    return access_token;
}
export async function authUser(uuid: string) {
    try {
        console.log("Here: " + uuid)
        const usuario = await Models.USERS_MOD.findByPk(uuid, {
            attributes: {
                exclude:
                    ["USER_PASSWORD"]
            }
        })
        if (!usuario?.getDataValue("USER_ID")) {
            throw new Error("Email not verified")
        } else {
            return usuario
        }
    } catch (error: any) {
        throw new Error("User not logged in");
    }
}
export let findUser = async function (id?: string, email?: string) {
    if (id) {
        let usuario = await Models.USERS_MOD.findByPk(id)
        return usuario!
    }
    let usuario = await Models.USERS_MOD.findOne({ where: { USER_EMAIL: email } })
    return usuario!
}
let addTokens = function (user: Model<any, any>) {
    try {
        const access_token = sign({
            USER_ID: user.getDataValue("USER_ID"),
            USER_FIRSTNAME: user.getDataValue("USER_FIRSTNAME"),
            USER_LASTNAME: user.getDataValue("USER_LASTNAME"),
            USER_EMAIL: user.getDataValue("USER_EMAIL"),
            USER_COLLEGE_ID: user.getDataValue("USER_COLLEGE_ID"),
            USER_BIRTHDATE: user.getDataValue("USER_BIRTHDATE"),
            USER_BIO: user.getDataValue("USER_BIO"),
            USER_STATUS: user.getDataValue("USER_STATUS"),
            USER_LAST_LOG: user.getDataValue("USER_LAST_LOG"),
            USER_SUPERMATCHES: user.getDataValue("USER_SUPERMATCHES"),
            USER_FILTER_AGE: user.getDataValue("USER_FILTER_AGE"),
            USER_FILTER_GENDER: user.getDataValue("USER_FILTER_GENDER")
        }, "access_secret", { expiresIn: "15m" });
        const refresh_token = sign({
            USER_ID: user.getDataValue("USER_ID"),
            USER_FIRSTNAME: user.getDataValue("USER_FIRSTNAME"),
            USER_LASTNAME: user.getDataValue("USER_LASTNAME"),
            USER_EMAIL: user.getDataValue("USER_EMAIL"),
            USER_COLLEGE_ID: user.getDataValue("USER_COLLEGE_ID"),
            USER_BIRTHDATE: user.getDataValue("USER_BIRTHDATE"),
            USER_BIO: user.getDataValue("USER_BIO"),
            USER_STATUS: user.getDataValue("USER_STATUS"),
            USER_LAST_LOG: user.getDataValue("USER_LAST_LOG"),
            USER_SUPERMATCHES: user.getDataValue("USER_SUPERMATCHES"),
            USER_FILTER_AGE: user.getDataValue("USER_FILTER_AGE"),
            USER_FILTER_GENDER: user.getDataValue("USER_FILTER_GENDER")
        }, "refresh_secret", { expiresIn: "1w" });

        return { data: [access_token, refresh_token] }

    } catch (error) {
        throw new Error("Unable to update credentials");
    }
}

//Emails
export async function verifyEmail(email: string) {
    let confirmaiton_token = sign({
        uuid: uuidv4(),
        email: email,
    }, "id_secret", { expiresIn: "30m" });

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: "daviseven84@gmail.com",
        subject: 'Email de Verificación',
        react: RaycastMagicLinkEmail({
            magicLink: confirmaiton_token,
        })
    })
}
export async function checkVerification(token: string) {
    let payload: any;
    payload = verify(token, "id_secret")
    if (payload) {
        let new_user = await findUser(undefined, payload.email)
        if (new_user) {
            if (new_user?.getDataValue("USER_ID")) {
                throw new Error("User is verified already")
            }
            await Models.USERS_MOD.update({ USER_ID: payload.uuid },
                {
                    where: {
                        USER_EMAIL: payload.email
                    }
                })
        } else {
            throw new Error("No email was found")
        }
    }
    return payload.uuid
}
export async function resetPassword(email: string) {
    let confirmaiton_token = sign({
        password: uuidv4().substring(0, 7),
        email: email,
    }, "password_reset", { expiresIn: "10m" });

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Restablecer tu contraseña',
        react: RaycastMagicLinkEmail({
            magicLink: confirmaiton_token,
        })
    })
}
export async function checkPasswordReset(token: string) {
    let payload: any;
    payload = verify(token, "password_reset")
    if (payload) {
        let user = await findUser(undefined, payload.email)
        if (user) {
            await Models.USERS_MOD.update({ USER_PASSWORD: str2hsh(payload.password) },
                {
                    where: {
                        USER_EMAIL: payload.email
                    }
                })
        } else {
            throw new Error("No email was found")
        }
    }
    return payload.password
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

//Images
export async function addImage2DB(image_id: string, relation: string, type: string): Promise<{ IMAGE_LINK: string, IMAGE_ORDER: number }> {
    try {
        let order = await findAllImages(relation)
        let path: string = `https://storage.googleapis.com/classmatch/${type}/${image_id}_post.jpg`

        await Models.IMAGES_MOD.create({
            IMAGE_ID: image_id,
            IMAGE_RELATION: relation,
            IMAGE_LINK: path,
            IMAGE_ORDER: order,
            IMAGE_TYPE: type
        })
        return { IMAGE_LINK: path, IMAGE_ORDER: order }
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
}
let findAllImages = async function (uuid: string): Promise<number> {
    let order = await Models.IMAGES_MOD.count({
        where: { IMAGE_RELATION: uuid }
    })
    if (order == 8) {
        throw new Error("Max number of images reached")
    }
    return order + 1
}

//Events
export async function activeEvents() {
    try {
        await Models.EVENTS_MOD.update(
            { EVENT_STATUS: 0 },
            {
                where: {
                    EVENT_DATE: {
                        [Op.lt]: new Date()
                    },
                    EVENT_STATUS: {
                        [Op.ne]: 0
                    }
                }
            }
        )
        let allEventsInfo: Model<any, any>[] = []
        await Models.EVENTS_MOD.findAll({
            include: [{
                attributes: ["EVENT_ID"],
            }],
            where: {
                EVENT_STATUS: 1
            }
        }).then(async (events) => {
            for (let i = 0; i < events.length; i++) {
                allEventsInfo.push(await allEventInfo(events[i].getDataValue("EVENT_ID")))
            }
        })
        return allEventsInfo
    } catch (err) {
        throw new Error("Error updating and retrieving events:" + err);
    }
}
export const allEventInfo = async (event_id: string) => {
    let event = await Models.EVENTS_MOD.findByPk(event_id, {
        include: [{
            model: Models.USERS_MOD, as: 'EVENT_USERS',
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"]
        },
        {
            model: Models.IMAGES_MOD, as: 'USER_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
            where: { IMAGE_ORDER: 1 }
        },
        {
            model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"]
        }]
    })
    if (event) {
        return event
    } else {
        throw new Error("Event not found")
    }
}
export async function createEvent(admin: string, title: string, description: string, date: Date, location: string, capacity: number, lock: boolean) {
    let id: string = uuidv4()
    if (capacity > 8) {
        throw new Error("Max capacity is 8")
    }
    await Models.EVENTS_MOD.create({
        EVENT_ID: id,
        EVENT_ADMIN: admin,
        EVENT_TITLE: title,
        EVENT_DESCRIPTION: description,
        EVENT_CAPACITY: capacity,
        EVENT_LOCK: lock,
        EVENT_DATE: date,
        EVENT_LOCATION: location,
        EVENT_STATUS: 1
    })
    return ([title, id])
}
export async function updateEvent(id: string, title?: string, description?: string, date?: Date, location?: string, capacity?: number, status?: boolean) {
    let event: Model<any, any> = await findEvent(id)
    if (!event) {
        throw new Error("Event not found");
    }
    event.set({
        EVENT_TITLE: title ?? event.getDataValue("EVENT_TITLE"),
        EVENT_DESCRIPTION: description ?? event.getDataValue("EVENT_DESCRIPTION"),
        EVENT_DATE: date ?? event.getDataValue("EVENT_DATE"),
        EVENT_LOCATION: location ?? event.getDataValue("EVENT_LOCATION"),
        EVENT_CAPACITY: capacity ?? event.getDataValue("EVENT_CAPACITY"),
        EVENT_STATUS: status ?? event.getDataValue("EVENT_STATUS")
    })
    event.save();
    return event
}
export async function isAdmin(user: string, event: string): Promise<boolean> {
    let event_ = await findEvent(event)
    if (event_.getDataValue("EVENT_ADMIN") == user) {
        return true
    }
    return false
}
let findEvent = async function (id: string) {
    let event = await Models.EVENTS_MOD.findByPk(id)
    if (!event) {
        throw new Error("Event not found")
    }
    return event
}
let isEventFull = async function (id: string) {
    let max_capacity: number = await Models.EVENTS_MOD.findByPk(id).then((value) =>
        value?.getDataValue("EVENT_CAPACITY")
    )
    let attendees = await Models.USER_EVENTS_MOD.count({
        where: {
            UEVENTS_EVENT: id
        }
    })

    let ans: string = `Max capacity not reached ${attendees} out of ${max_capacity}`;

    if (max_capacity >= attendees) {
        ans = await denyAllRequests(id)
    }
    return ans
}

//User Events
export async function checkMyApplications(current_user: string) {
    Models.EVENTS_MOD.update(
        { EVENT_STATUS: 0 },
        {
            where: {
                EVENT_DATE: {
                    [Op.lt]: new Date()
                },
                EVENT_STATUS: {
                    [Op.ne]: 0
                }
            }
        }
    )
    let applications = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_ACCEPTED: null,
            UEVENTS_ATTENDEE: current_user
        },
        attributes: ["UEVENTS_ID"],
        include: [{
            model: Models.EVENTS_MOD, as: "EVENTS",
            where: {
                EVENT_STATUS: 1
            },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_ADMIN", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }
            }]
        }]
    })
    return applications
}
export async function requestAttendEvent(user: string, event: string) {
    try {
        let uevent_ = await checkUserUEvent(user, event)
        if (uevent_) {
            throw new Error("User has requested to atend this event already")
        }
    } catch (error) {
        let ans = await isEventFull(event)
        if (ans[0] == "M") {
            let event_ = await Models.EVENTS_MOD.findByPk(event)
            if (event_?.getDataValue("EVENT_STATUS") == 0) {
                throw new Error("Event has expired already")
            }

            let id: string = uuidv4()
            let accepted = null
            if (event_?.getDataValue("EVENT_LOCK") == 0) {
                accepted = 1
            }
            await Models.USER_EVENTS_MOD.create({
                UEVENTS_ID: id,
                UEVENTS_EVENT: event,
                UEVENTS_USER: user,
                UEVENTS_ACCEPTED: accepted
            })
            return (accepted)
        } else {
            throw new Error(ans)
        }
    }
}
export async function requestDecision(current_user: string, uevent_id: string, user: string, decision: number) {
    let uevent = await Models.USER_EVENTS_MOD.findOne({
        where: { UEVENTS_ID: uevent_id, UEVENTS_ATTENDEE: user }
    })
    if (!uevent) {
        throw new Error("User not found in event")
    } else if (await !isAdmin(current_user, uevent?.getDataValue("UEVENT_EVENT"))) {
        throw new Error("You are not the admin of this event")
    } else if ([0, 1].includes(decision)!) {
        throw new Error("Decision must be 0 or 1")
    }

    uevent.set({
        UEVENTS_ACCEPTED: decision
    })
    uevent.save()

    let ans = await isEventFull(uevent.getDataValue("UEVENTS_EVENT"))
    return {
        user: user,
        decision: decision == 0 ? "Solicitud denegada" : "Solicitud aprobada",
        note: ans
    }
}
export async function findMyUEventsAdmin(current_user: string) {

    let ueventActive: Model<any, any>[] = []
    let ueventExpired: Model<any, any>[] = []

    ueventActive = await Models.EVENTS_MOD.findAll({
        where: {
            EVENT_ADMIN: current_user,
            EVENT_STATUS: 1
        },
        include: [{
            model: Models.EVENTS_MOD,
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
        
    })
    ueventExpired = await Models.EVENTS_MOD.findAll({
        where: {
            EVENT_ADMIN: current_user,
            EVENT_STATUS: 0
        },
        include: [{
            model: Models.EVENTS_MOD,
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'ASC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })

    if (!ueventActive || !ueventExpired) {
        throw new Error("User has not  organized any Events")
    }
    return {
        active: ueventActive,
        expired: ueventExpired
    }
}
export async function findMyUEvents(current_user: string) {

    let ueventActive: Model<any, any>[] = []
    let ueventExpired: Model<any, any>[] = []

    ueventActive = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_ATTENDEE: current_user,
            UEVENTS_ACCEPTED: 1
        },
        attributes: [],
        include: [{
            model: Models.EVENTS_MOD,
            where: {
                EVENT_STATUS: 1
            },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_ADMIN", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })
    ueventExpired = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_ATTENDEE: current_user,
            UEVENTS_ACCEPTED: 1
        },
        attributes: [],
        include: [{
            model: Models.EVENTS_MOD,
            where: {
                EVENT_STATUS: 0
            },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_ADMIN", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'ASC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })

    if (!ueventActive || !ueventExpired) {
        throw new Error("User has not attended any Events")
    }
    return {
        active: ueventActive,
        expired: ueventExpired
    }
}
export async function findUEventAttendees(current_user: string, event: string) {
    let attendees: Model<any, any>[] = []

    attendees = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_EVENT: event,
            UEVENT_ACCEPTED: 1,
            UEVENTS_USER: { [Op.ne]: current_user }
        },
        attributes: [],
        include: [{
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })
    if (!attendees) {
        throw new Error("Current user did not attend this Event")
    }
    return attendees
}
export async function findUEventRequestsAdmin(admin: string, event: string) {
    if (!isAdmin(admin, event)) {
        throw new Error("Current user is not the Admin of this Event")
    }

    let ueventAccepted = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_EVENT: event,
            UEVENTS_ACCEPTED: 1
        },
        attributes: [],
        include: [{
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })

    let ueventRequested = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_EVENT: event,
            UEVENTS_ACCEPTED: null
        },
        attributes: ["UEVENT_ID"],
        include: [{
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }}]
        }]
    })

    if (!ueventAccepted || !ueventRequested) {
        throw new Error("Event has not requests yet")
    }
    return {
        accepted: ueventAccepted,
        requested: ueventRequested
    }
}
let denyAllRequests = async function (event_id: string) {
    let uevent = await Models.USER_EVENTS_MOD.findAll({
        where: { UEVENTS_ID: event_id, UEVENTS_ACCEPTED: null }
    })
    if (!uevent) {
        throw new Error("No Event was found with id: " + event_id)
    }
    uevent.forEach(element => {
        element.set({
            UEVENTS_ACCEPTED: 0
        })
        element.save()
    });

    return uevent.length + " requests have been denied. Max capacity was reached"
}
let checkUserUEvent = async function (user_id: string, event_id: string) {
    let uevent = await Models.USER_EVENTS_MOD.findOne({
        where: {
            UEVENTS_ATTENDEE: user_id,
            UEVENTS_EVENT: event_id
        }
    })
    if (!uevent) {
        throw new Error("User has not requested to attend Event")
    }
    return uevent
}