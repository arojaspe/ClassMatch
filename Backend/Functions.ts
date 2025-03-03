import { Request, Response } from "express";
import * as Models from "./Models";
import { v4 as uuidv4 } from 'uuid';
import { sign, verify } from "jsonwebtoken";
import { resend } from "./Connection";
import {ResetPass} from "../Email_templates/Reset";
import {VerifyEmail} from "../Email_templates/Verification";
import { FloatDataType, Model, Op, Sequelize, literal } from 'sequelize';
import moment from "moment";

//Error showing
interface Result<T> { data: any, error?: string }

// Data hanlding
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
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* 
Bulk Testing

Interests
export function TestInterests() {
    intereses.forEach( (value) =>
        Models.INTERESTS_MOD.create({
            INTEREST_ID: uuidv4(),
            INTEREST_NAME: value
        })
    )
}
*/

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
            USER_RATING: 1000,
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
        const usuario = await Models.USERS_MOD.findByPk(uuid, {
            attributes: {
                exclude:
                    ["USER_PASSWORD"],
            },
            include:
                [
                    {
                        model: Models.SCHEDULES_MOD, as: "USER_SCHEDULE",
                        attributes: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
                    }
                ]
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
export async function findUsersByRating(current_user: string, totalCount: number = 20) {

    const currentUserData = await Models.USERS_MOD.findOne({
        where: { USER_ID: current_user },
        attributes: ["USER_RATING", "USER_FILTER_GENDER", "USER_FILTER_AGE"],
    });

    const currentRating = currentUserData!.getDataValue("USER_RATING");
    const currentFiltGen = currentUserData!.getDataValue("USER_FILTER_GENDER");
    const filtAge = currentUserData!.getDataValue("USER_FILTER_AGE").split("-");

    const mn = moment().subtract(filtAge[0], "years").format("YYYY-MM-DD");
    const mx = moment().subtract(filtAge[1], "years").format("YYYY-MM-DD");

    const otherUsers = await Models.USERS_MOD.findAll({
        where: {
            USER_ID: { [Op.ne]: current_user },
            // USER_GENDER: { [Op.eq]: currentFiltGen },
            // USER_BIRTHDATE: { [Op.between]: [mn, mx] }
        },
        attributes: ["USER_ID", "USER_RATING", "USER_FIRSTNAME"]
    });

    const lowerUsers = otherUsers.filter(user => user.getDataValue("USER_RATING") < currentRating);
    const higherUsers = otherUsers.filter(user => user.getDataValue("USER_RATING") >= currentRating);

    const sortedByCloseness = [...otherUsers].sort((a, b) => {
        const diffA = Math.abs(a.getDataValue("USER_RATING") - currentRating);
        const diffB = Math.abs(b.getDataValue("USER_RATING") - currentRating);
        return diffA - diffB;
    });

    const countClosest = Math.floor(totalCount * 0.70);
    const countLower = Math.floor(totalCount * 0.15);
    const countHigher = totalCount - countClosest - countLower;

    const closestUsers = sortedByCloseness.slice(0, countClosest);

    const closestUserIds = new Set(closestUsers.map(u => u.getDataValue("USER_ID")));
    const lowerUnique = lowerUsers.filter(user => !closestUserIds.has(user.getDataValue("USER_ID")));
    const higherUnique = higherUsers.filter(user => !closestUserIds.has(user.getDataValue("USER_ID")));

    const randomLower = shuffleArray(lowerUnique).slice(0, countLower);
    const randomHigher = shuffleArray(higherUnique).slice(0, countHigher);

    let finalUsers = [...closestUsers, ...randomLower, ...randomHigher];

    finalUsers = shuffleArray(finalUsers);

    finalUsers.forEach((E) => {
        console.log(E.getDataValue("USER_ID"), E.getDataValue("USER_FIRSTNAME"));
    });

    return finalUsers;
}
export let isPremium = async function (id: string): Promise<boolean> {
    const result = await Models.SUBSCRIPTIONS_MOD.findOne({ where: { SUBSCRIPTION_USER: id } })
    return result? true: false
}
export let findUser = async function (id?: string, email?: string) {
    if (id) {
        let usuario = await Models.USERS_MOD.findByPk(id)
        if (!usuario) {
            throw new Error("No user was found: " + id)
        }
        return usuario
    }
    let usuario = await Models.USERS_MOD.findOne({ where: { USER_EMAIL: email } })
    if (!usuario) {
        throw new Error("No user was found: " + email)
    }

    return usuario
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
let checkAge = function (birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const hasBirthdayPassed = (today.getMonth() > birth.getMonth()) ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

    return hasBirthdayPassed ? age : age - 1;
}

//Emails
export async function verifyEmail(email: string) {
    let confirmation_token = sign({
        uuid: uuidv4(),
        email: email,
    }, "id_secret", { expiresIn: "30m" });

    resend.emails.send({
        from: 'team@classmatch.site',
        to: email,
        subject: 'Email de Verificación',
        react: VerifyEmail({
            magicLink: confirmation_token,
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
                });

            await Models.SCHEDULES_MOD.create({
                SCHEDULE_ID: uuidv4(),
                USER_ID: payload.uuid,
                MONDAY: 4000,
                TUESDAY: 4000,
                WEDNESDAY: 4000,
                THURSDAY: 4000,
                FRIDAY: 4000,
                SATURDAY: 4000,
                SUNDAY: 4000
            });

            await Models.SUBSCRIPTIONS_MOD.create({
                SUBSCRIPTION_ID: uuidv4(),
                SUBSCRIPTION_USER: payload.uuid,
                SUBSCRIPTION_API_ID: null,
                SUBSCRIPTION_PLAN: "Basic"
            });
        } else {
            throw new Error("No email was found")
        }
    }
    return payload.uuid
}
export async function resetPassword(email: string) {
    let confirmation_token = sign({
        password: uuidv4().substring(0, 7),
        email: email,
    }, "password_reset", { expiresIn: "10m" });

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Restablecer tu contraseña',
        react: ResetPass({
            magicLink: confirmation_token,
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

// Interests
export async function updateInterests(userId: string, interestsIds: Array<string>) {
    // First erases the previous interests
    await Models.USER_INTERESTS_MOD.destroy({
        where: {
            UINTEREST_USER: userId,
        },
    })

    // Creates the new interests
    let newUserInterestsIds: Array<string> = [];

    for (let interestId of interestsIds) {
        let id: string = uuidv4();

        await Models.USER_INTERESTS_MOD.create({
            UINTEREST_ID: id,
            UINTEREST_USER: userId,
            UINTEREST_INTEREST: interestId,
        })

        newUserInterestsIds.push(id);
    }

    return newUserInterestsIds;
}
export async function findInterests(userId: String) {
    const interestsList = await Models.USER_INTERESTS_MOD.findAll({
        attributes: { exclude: ["UINTEREST_ID", "UINTEREST_USER"] },
        where: {
            UINTEREST_USER: userId,
        },
        order: [['UINTEREST_INTEREST', 'ASC']]
    });


    let userInterests: Array<string> = [];

    for (let interest of interestsList) {
        let interestRow = await Models.INTERESTS_MOD.findByPk(interest.get("UINTEREST_INTEREST") as string);

        if (interestRow) {
            userInterests.push(interestRow.get("INTEREST_NAME") as string);
        }
    }

    return userInterests;
}
export async function findInterestsIds(interests: Array<string>) {
    let ids: Array<string> = [];

    for (let interest of interests) {
        let interestRow = await Models.INTERESTS_MOD.findOne({
            where: { INTEREST_NAME: interest }
        });

        if (interestRow != null)
            ids.push(interestRow.get("INTEREST_ID") as string);
    }

    return ids;
}
export async function findUsersByInterests(interestsIds: Array<string>,
    ageL: number,
    ageU: number,
    gender: Array<string>,
    colleges: Array<string>) {
    const uInterestsRows = await Models.USER_INTERESTS_MOD.findAll({
        attributes: { exclude: ["UINTEREST_ID", "UINTEREST_INTEREST"] },
        where: {
            UINTEREST_INTEREST: interestsIds
        },
    });

    let userIds = uInterestsRows.map(row => row.get("UINTEREST_USER"));
    userIds = Array.from(new Set(userIds));

    const users = await Models.USERS_MOD.findAll({
        attributes: { exclude: ["USER_EMAIL", "USER_PASSWORD", "USER_LAST_LOG", "USER_FILTER_AGE", "USER_SUPERMATCHES", "USER_FILTER_GENDER"] },
        where: {
            [Op.and]: [
                { USER_ID: userIds },
                { USER_GENDER: gender },
                { USER_COLLEGE_ID: colleges },
                Sequelize.literal(`TIMESTAMPDIFF(YEAR, USER_BIRTHDATE, CURDATE()) BETWEEN ${Number(ageL)} AND ${Number(ageU)}`),
            ]
        },
        include: [{
            model: Models.IMAGES_MOD, as: 'USER_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
        },
        {
            model: Models.SCHEDULES_MOD, as: "USER_SCHEDULE",
            attributes: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        }
        ],
        order: [[{
            model: Models.IMAGES_MOD, as: 'USER_IMAGES'
        }, 'IMAGE_ORDER', 'ASC']
        ]
    });

    return users;
}

// Reports
export async function createReport(reportingId: string, reportedId: string, reason: string) {
    let id: string = uuidv4();
    await Models.REPORT_MOD.create({
        REPORT_ID: id,
        REPORTING_USER: reportingId,
        REPORTED_USER: reportedId,
        REPORT_REASON: reason
    })

    return id;
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
export async function addImage2DB(image_id: string, relation: string, type: string, order: number): Promise<{ IMAGE_LINK: string, IMAGE_ORDER: number }> {
    try {
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
export async function deleteImagefromDB(cur_image_link: string, new_image_link?: string) {
    if (new_image_link) {
        await Models.IMAGES_MOD.update(
            { IMAGE_LINK: new_image_link },
            { where: { IMAGE_LINK: cur_image_link } }
        );
        return
    }
    const image = await Models.IMAGES_MOD.findOne({
        where: { IMAGE_LINK: cur_image_link },
    });

    if (!image) {
        throw new Error(`Image record not found for IMAGE_LINK: ${cur_image_link}`);
    }

    const deletedOrder = image.getDataValue("IMAGE_ORDER");

    await Models.IMAGES_MOD.destroy({
        where: { IMAGE_LINK: cur_image_link },
    });

    await Models.IMAGES_MOD.update(
        { IMAGE_ORDER: literal("IMAGE_ORDER - 1") },
        { where: { IMAGE_ORDER: { [Op.gt]: deletedOrder } } }
    );
}
export async function modifyImgOrder(CURRENT_USER: string, IMAGE_ID: string, IMAGE_ORDER: number) {
    if (await isMyImage(CURRENT_USER, IMAGE_ID)) {
        Models.IMAGES_MOD.update(
            {
                IMAGE_ORDER: IMAGE_ORDER
            },
            {
                where: { IMAGE_ID: IMAGE_ID }
            })
    }
}
export async function findAllImages(uuid: string): Promise<number> {
    let order = await Models.IMAGES_MOD.count({
        where: { IMAGE_RELATION: uuid }
    })
    if (order == 8) {
        throw new Error("Max number of images reached")
    }
    return order + 1
}
let isMyImage = async function (current_user: string, image_id: string): Promise<boolean> {
    return await Models.IMAGES_MOD.findByPk(image_id).then((image) => {
        return current_user === image?.getDataValue("IMAGE_RELATION")
    })
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
            attributes: ["EVENT_ID"],
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
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
        },
        {
            model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
            
            required: false
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

    if (max_capacity <= attendees) {
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
                order: [['IMAGE_ORDER', 'ASC']]
            }]
        }]
    })
    return applications
}
export async function requestAttendEvent(user: string, event: string) {
        let uevent_ = await checkUserUEvent(user, event)
        if (uevent_) {
            throw new Error("User has requested to attend this event already")
        }
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
                UEVENTS_ATTENDEE: user,
                UEVENTS_ACCEPTED: accepted
            })
            return (accepted)
        } else {
            throw new Error(ans)
        }
    }
export async function requestDecision(current_user: string, uevent_id: string, decision: string) {
    let uevent = await Models.USER_EVENTS_MOD.findOne({
        where: { UEVENTS_ID: uevent_id, UEVENTS_ACCEPTED: null }
    })
    console.log(decision, typeof(decision))
    if (!uevent) {
        throw new Error("User not found in event")
    } else if (await !isAdmin(current_user, uevent.getDataValue("UEVENTS_EVENT"))) {
        throw new Error("You are not the admin of this event")
    } else if (!["0", "1"].includes(decision)) {
        throw new Error("Decision must be 0 or 1")
    }
    console.log(uevent.toJSON())

    let ans = await isEventFull(uevent.getDataValue("UEVENTS_EVENT"))
    uevent.set({
        UEVENTS_ACCEPTED: decision
    })
    uevent.save()    
    return {
        user: uevent.getDataValue("UEVENTS_ATTENDEE"),
        decision: decision == "0" ? "Solicitud denegada" : "Solicitud aprobada",
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
    
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]

    })
    ueventExpired = await Models.EVENTS_MOD.findAll({
        where: {
            EVENT_ADMIN: current_user,
            EVENT_STATUS: 0
        },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'ASC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
    })

    if (ueventActive.length + ueventExpired.length === 0) {
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
        include: [
            {
            model: Models.EVENTS_MOD, as: "EVENTS",
            where: {
                EVENT_STATUS: 1
            },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
        },
        {
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"]
        }
    ]
    })
    ueventExpired = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_ATTENDEE: current_user,
            UEVENTS_ACCEPTED: 1
        },
        attributes: [],
        include: [{
            model: Models.EVENTS_MOD, as: "EVENTS",
            where: {
                EVENT_STATUS: 0
            },
            attributes: ["EVENT_ID", "EVENT_TITLE", "EVENT_DATE", "EVENT_STATUS"],
            order: [['EVENT_DATE', 'DESC']],
            include: [{
                model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
        },
        {
            model: Models.USERS_MOD,
            attributes: ["USER_ID" ,"USER_FIRSTNAME", "USER_LASTNAME"]
        }]
    })

    if (ueventActive.length + ueventExpired.length === 0) {
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
            UEVENTS_ACCEPTED: 1,
            UEVENTS_ATTENDEE: { [Op.ne]: current_user }
        },
        attributes: [],
        include: [{
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
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
                where: { IMAGE_ORDER: 1 },
                limit: 1,
                required: false
            }]
        }]
    })

    let ueventRequested = await Models.USER_EVENTS_MOD.findAll({
        where: {
            UEVENTS_EVENT: event,
            UEVENTS_ACCEPTED: null
        },
        attributes: ["UEVENTS_ID"],
        include: [{
            model: Models.USERS_MOD,
            attributes: ["USER_ID", "USER_FIRSTNAME", "USER_LASTNAME"],
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
                where: { IMAGE_ORDER: 1 }
            }]
        }]
    })

    if (ueventAccepted.length + ueventRequested.length === 0) {
        throw new Error("Event has no requests yet")
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
    console.log(user_id)
    let uevent = await Models.USER_EVENTS_MOD.findOne({
        where: {
            UEVENTS_ATTENDEE: user_id,
            UEVENTS_EVENT: event_id
        }
    })
    return uevent
}

//Chats
export const checkMyChats = async (current_user: string) => {
    try {
        const subrooms = await Models.ROOMS_MOD.findAll({
            where: { ROOM_USER: current_user },
            attributes: ["ROOM_ID"],
            group: ["ROOM_ID"]
        })

        const roomIds = subrooms.map(room => room.getDataValue("ROOM_ID"));

        const rooms = await Models.ROOMS_MOD.findAll({
            where: {
                ROOM_ID: { [Op.in]: roomIds },
                ROOM_USER: { [Op.ne]: current_user }
            },
            attributes: ["ROOM_ID", "ROOM_EVENT"],
            group: ["ROOM_ID"],
            include: [
                {
                    model: Models.CHATS_MOD,
                    attributes: ["CHAT_ROOM", "CHAT_ID", "CHAT_SENDER"],
                    order: [["CHAT_TIMESTAMP", "DESC"]],
                    where: { CHAT_SENDER: { [Op.ne]: current_user } },
                    include: [{
                        model: Models.READ_STATUS_MOD, as: 'READ_STATUS',
                        attributes: ["RS_USER"],
                        where: { RS_USER: current_user},
                        required: false
                    }],
                    limit: 1,
                    required: false
                },
                {
                    model: Models.USERS_MOD,
                    attributes: ["USER_ID", "USER_FIRSTNAME"],
                    order: [["USER_LAST_LOG", "DESC"]],
                    required: false,
                    include: [{
                        model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                        attributes: ["IMAGE_LINK"],
                        where: { IMAGE_ORDER: 1 },
                        limit: 1,
                        required: false
                    }]
                },
                {
                    model: Models.EVENTS_MOD,
                    as: "EVENT_ROOM",
                    attributes: ["EVENT_ID", "EVENT_TITLE"],
                    order: [["EVENT_DATE", "DESC"]],
                    required: false,
                    include: [{
                        model: Models.IMAGES_MOD, as: 'EVENT_IMAGES',
                        attributes: ["IMAGE_LINK"],
                        where: { IMAGE_ORDER: 1 },
                        limit: 1,
                        required: false
                    }]
                },
            ],
        })

        if (rooms.length === 0) {
            throw new Error("User has no chats");
        }

        let user_rooms: { NEW: Boolean; ROOM_ID: any; USER_FIRSTNAME: any;  USER_IMAGE: string; }[] = []
        let event_rooms: { NEW: Boolean; EVENT_TITLE: any; ROOM_ID: any; EVENT_IMAGE: string; }[] = []

        rooms.forEach(room => {
            let new_message: any = false
            if (room.getDataValue("CHATS_MODs")[0]) {
                if (room.getDataValue("CHATS_MODs")[0].getDataValue("CHAT_SENDER") !== current_user) {
                    if (!room.getDataValue("CHATS_MODs")[0].getDataValue("READ_STATUS")[0]) {
                    new_message= true
                }
            }
            }            
            if (room.getDataValue("ROOM_EVENT") === null) {                
                user_rooms.push(
                    {
                        NEW: new_message,
                        ROOM_ID: room.getDataValue("ROOM_ID"),
                        USER_FIRSTNAME: room.getDataValue("USER_MOD").getDataValue("USER_FIRSTNAME"),
                        USER_IMAGE: room.getDataValue("USER_MOD").getDataValue("USER_IMAGES")[0].IMAGE_LINK ?? "https://picsum.photos/255"
                    }
                )
            } else {
                event_rooms.push(
                    {
                        NEW: new_message,
                        ROOM_ID: room.getDataValue("ROOM_ID"),
                        EVENT_TITLE: room.getDataValue("EVENT_ROOM").getDataValue("EVENT_TITLE"),
                        EVENT_IMAGE: room.getDataValue("EVENT_ROOM").getDataValue("EVENT_IMAGES")[0].IMAGE_LINK ?? "https://picsum.photos/255"
                    }
                )
            }
        })

        return {
            users: user_rooms,
            events: event_rooms,
        };
    } catch (error: any) {
        console.log(error)
        throw new Error(error)
    }
};
export const sendMessage = async (sender: string, room: string, message: string) => {
    const newMessage = await Models.CHATS_MOD.create({
        CHAT_ID: uuidv4(),
        CHAT_SENDER: sender,
        CHAT_ROOM: room,
        CHAT_MESSAGE: message
    });
    return newMessage
};
export const getRoomMessages = async (current_user: string, room: string, page: number) => {
    await isUserinRoom(current_user, room);

    const max_pages = await Models.CHATS_MOD.count({
        where: { CHAT_ROOM: room },
    })

    if (page * 20 >= max_pages / 20 + 20) {
        throw new Error("This room has no more messages")
    }

    const messages = await Models.CHATS_MOD.findAll({
        where: { CHAT_ROOM: room },
        attributes: ["CHAT_ID", "CHAT_SENDER", "CHAT_MESSAGE", "CHAT_TIMESTAMP"],
        include: [{
            model: Models.READ_STATUS_MOD,
            as: "READ_STATUS",
            required: false,
            where: { RS_USER: { [Op.ne]: current_user } },
            attributes: ["RS_USER", "RS_TIMESTAMP"],
        }],
        order: [["CHAT_TIMESTAMP", "ASC"]],
        limit: 50,
        offset: (page - 1) * 50
    });

    if (messages.length === 0) {
        throw new Error("No messages found in this room");
    }

    const formattedMessages = messages.map((msg) => {
        const obj = msg.toJSON();
        if (obj.CHAT_SENDER !== current_user) {
            delete obj.READ_STATUS;
        }
        return obj;
    });
    updateReadStatus(current_user, room)
    return formattedMessages;
};
export const updateReadStatus = async (current_user: string, room: string) => {
    const messages = await Models.CHATS_MOD.findAll({
        where: {
            CHAT_ROOM: room,
            CHAT_SENDER: { [Op.ne]: current_user }
        },
        attributes: ["CHAT_ID"],
        include: [{
            model: Models.READ_STATUS_MOD,
            as: "READ_STATUS",
            required: false,
            where: { RS_USER: current_user },
            attributes: ["RS_CHAT"]
        }]
    });

    const messagesToMarkRead = messages
        .filter(msg => {
            const readRecords = msg.get("READ_STATUS");
            return !readRecords || (Array.isArray(readRecords) && readRecords.length === 0);
        })
        .map(msg => ({
            RS_CHAT: msg.get("CHAT_ID"),
            RS_USER: current_user,
            RS_TIMESTAMP: new Date(),
        }));

    if (messagesToMarkRead.length === 0) return;
    await Models.READ_STATUS_MOD.bulkCreate(messagesToMarkRead, { ignoreDuplicates: true });

    return messagesToMarkRead;
};

//Rooms
export async function createRoom(users: string[], event?: string) {
    const room_id = uuidv4()
    users.forEach((user) => {
        if (event) {
            Models.ROOMS_MOD.create({
                ROOM_ID: room_id,
                ROOM_USER: user,
                ROOM_EVENT: event
            })
        } else {
            Models.ROOMS_MOD.create({
                ROOM_ID: room_id,
                ROOM_USER: user,
            })
        }
    })
    return room_id
}
export async function checkRoomAndMatches(current_user: string) {
    let ignoredUsers: string[]= []
    try {
        const rooms= await Models.ROOMS_MOD.findAll({
                where: {
                    ROOM_USER: current_user,
                    ROOM_EVENT: null
                },
                attributes: ["ROOM_ID"]
            })
        for (let i= 0; i < rooms.length; i++) {
            const user= await allUsersinRoomExcept(rooms[i].getDataValue("ROOM_ID"), current_user)
            ignoredUsers.push(user[0])
        }
    } catch(e: any) {
        console.log(e)
    }
    try {
        const users = await Models.MATCHES_MOD.findAll(
            {
                where: {
                    MATCHING_USER: current_user
                },
                attributes: ["MATCHED_USER"]
            })
            for (let i= 0; i < users.length; i++) {
                ignoredUsers.push(users[i].getDataValue("MATCHED_USER"))
            }
    } catch(e: any) {
        console.log(e)
    }
    return ignoredUsers
}
let isUserinRoom = async function (user_id: string, room_id: string): Promise<boolean> {
    console.log(user_id, room_id)

    let room = await Models.ROOMS_MOD.findAll({
        where: {
            ROOM_ID: room_id,
            ROOM_USER: user_id
        }
    })
    if (!room[0]) {
        throw new Error("User not found in given room")
    }
    return true
}
export async function allUsersinRoomExcept(room_id: string, current_user: string): Promise<string[]> {
    let users: string[]= [] 

    let room = await Models.ROOMS_MOD.findAll({
        where: {
            ROOM_ID: room_id,
            ROOM_USER: {[Op.ne]: current_user}
        }
    })

    for (let i= 0; i< room.length; i++) {
        users.push(room[i].getDataValue("ROOM_USER"))
    }
    return users
}
let findRoom = async function (event: string) {
    let room = await Models.ROOMS_MOD.findOne({
        where: {
            ROOM_EVENT: event
        }
    })
    if (room) {
        return room
    }
    throw new Error("Event room not found")
}

//Matches
export async function createMatch(current_user: string, other_user: string, supermatch: boolean) {
    if (await matchAlreadyExists(current_user, other_user)) {
        return
    } else if (await isAlreadyMatch(current_user, other_user)) {
        Models.MATCHES_MOD.destroy({
            where: {
                MATCHING_USER: other_user,
            MATCHED_USER: current_user}
        })
        const room_id = await createRoom([current_user, other_user])
        return {
            ROOM_ID: room_id
        }
    }
    else {
        await Models.MATCHES_MOD.create({
            MATCH_ID: uuidv4(),
            MATCHING_USER: current_user,
            MATCHED_USER: other_user,
            SUPERMATCH: supermatch
        })
        ELOUpdate(current_user, other_user, supermatch)
    }
    return null
}
let isAlreadyMatch = async function (current: string, other: string): Promise<boolean> {

    let match = await Models.MATCHES_MOD.findOne({
        where: {
            MATCHING_USER: other,
            MATCHED_USER: current
        }
    })

    return match ? true : false
}
let matchAlreadyExists = async function (current: string, other: string): Promise<boolean> {

    let match = await Models.MATCHES_MOD.findOne({
        where: {
            MATCHING_USER: current,
            MATCHED_USER: other
        }
    })

    return match ? true : false
}
let ELOUpdate = async (current_user: string, other_user: string, supermatch: boolean) => {
    let users = [current_user, other_user]
    const current_rating = await Models.USERS_MOD.findOne({
        where: {
            USER_ID: current_user
        },
        attributes: ["USER_RATING"]
    })
    const other_rating = await Models.USERS_MOD.findOne({
        where: {
            USER_ID: other_user
        },
        attributes: ["USER_RATING"]
    })

    const ratings: number[] = ELOcurrrentONother(current_rating?.getDataValue("USER_RATING"), other_rating?.getDataValue("USER_RATING"), supermatch)

    ratings.forEach(async (rating) => {
        let ind = ratings.indexOf(rating)
        await Models.USERS_MOD.update({
            USER_RATING: ratings[ind]
        },
            {
                where: {
                    USER_ID: users[ind]
                }
            });
    })
};
let ELOcurrrentONother = function (current_user: number, other_user: number, supermatch: boolean): number[] {
    let K = 32 //Change standard
    if (supermatch) {
        K = 16
    }
    const Pcurrent = current_user - K * (1 - 1 / (1 + Math.pow(10, (other_user - current_user) / 400)))
    const Pother = other_user + K * (1 - 1 / (1 + Math.pow(10, (current_user - other_user) / 400)))

    return [Pcurrent, Pother]
}
