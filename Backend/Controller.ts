import { Request, Response, RequestHandler } from "express";
import { Op, Sequelize } from "sequelize";
import * as Models from "./Models";
import * as Funcs from "./Functions";
import * as Schedule from "./scheduleFunctions";
import * as Storage from "./Connection";
import { v4 as uuidv4 } from 'uuid';

import dotenv from "dotenv";
dotenv.config();

// Reports

// Receives object with
// reportedUserId : id (string)
// reason: string
export const postReport = async (req: Request, res: Response) => {
    const { reportedUserId, reason } = req.body;
    console.log(reason);

    try {
        const currUser = await Funcs.isLoggedIn(req, res);
        const reportId = await Funcs.createReport(currUser.USER_ID, reportedUserId, reason);

        res.status(200).send({
            data: {
                message: "Reporte creado satisfactoriamente",
                data: reportId
            }
        })

    } catch (error) {
        res.status(401).json({
            errors: [{
                message: "Could not connect to DB",
                extensions: {
                    code: "Controller issue postReport"
                }
            }]
        })
    }

}

// Interests
// Receives user id or string "SELF"
// Returns list of Interests
export const getUserInterests = async (req: Request, res: Response) => {
    let { id } = req.params;

    try {
        const currUser = await Funcs.isLoggedIn(req, res);

        if (id === "SELF") {
            id = currUser.USER_ID;
        }

        const interestsList = await Funcs.findInterests(id);

        res.status(200).send({
            data: {
                message: "Lista de intereses encontrada satisfactoriamente",
                data: interestsList
            }
        })

    } catch (error) {
        res.status(401).json({
            errors: [{
                message: "Could not connect to DB",
                extensions: {
                    code: "Controller issue getInterests"
                }
            }]
        })
    }


}

// Retreives all possible Interests available
export const getInterests = async (req: Request, res: Response) => {
    try {
        const interestsList = await Models.INTERESTS_MOD.findAll();

        res.status(200).send({
            data: {
                message: "Lista de intereses encontrada satisfactoriamente",
                data: interestsList
            }
        })

    } catch (error) {
        res.status(401).json({
            errors: [{
                message: "Could not connect to DB",
                extensions: {
                    code: "Controller issue getInterests"
                }
            }]
        })
    }
}

// Receives list of interests Ids
// Returns ids of interest-user table
export const putUserInterests = async (req: Request, res: Response) => {
    const interestsIds = req.body;
    console.log(interestsIds);

    if (interestsIds.length > 8) {
        res.status(401).json({
            errors: [{
                message: "Too many interests. Max 8",
                extensions: {
                    code: "Controller issue putUserInterests"
                }
            }]
        })
    }
    else {
        try {
            const currUser = await Funcs.isLoggedIn(req, res);
            const userInterestsIds = await Funcs.updateInterests(currUser.USER_ID,
                interestsIds);

            //console.log(userInterestsIds);
            res.status(200).send({
                data: {
                    message: "Succesfully updated",
                    data: userInterestsIds
                }
            })

        } catch (error) {
            res.status(401).json({
                errors: [{
                    message: "Could not connect to DB",
                    extensions: {
                        code: "Controller issue putUserInterests"
                    }
                }]
            })
        }
    }
}

// Schedule Management
// Returns DecodedSchedule
export const getUserSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;

    const modelSchedule = await Models.SCHEDULES_MOD.findOne({ where: { USER_ID: id } });

    if (modelSchedule) {
        const codedSchedule = Schedule.buildCodedSchedule(modelSchedule.toJSON());
        const decodedSchedule = Schedule.decodeSchedule(codedSchedule);


        res.status(201).json(
            {
                message: "Horario encontrado",
                data: decodedSchedule
            })
    }
    else {
        res.status(404).json({
            errors: [{
                message: "No existe horario con ID: " + id,
                extensions: {
                    code: "Conts.getUserSchedule - No user found"
                }
            }]
        })
    }
}

interface ScheduleUpdateObject {
    id: string;
    newSchedule: Schedule.DecodedSchedule;
}

// Receives DecodedSchedule
export const putUserSchedule = async (req: Request, res: Response) => {
    const newSchedule = Schedule.codeSchedule(req.body);

    try {
        const currUser = await Funcs.isLoggedIn(req, res);
        const [updatedRows] = await Models.SCHEDULES_MOD.update(newSchedule, {
            where: { USER_ID: currUser.USER_ID }
        });

        const updated = await Models.SCHEDULES_MOD.findOne({ where: { USER_ID: currUser.USER_ID } });

        res.status(200).send({
            data: {
                message: "Succesfully updated",
                data: updated
            }
        })

    } catch (error) {
        res.status(401).json({
            errors: [{
                message: "Could not connect to DB",
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }
}

//User Management
//gender: "M", "F", "NB"
//ageL: agelowlimit
//ageU: ageuplimit
//SEPARADOS POR COMAS SIN ESPACIOS
//interests: adfasfas,adfafs,afdsfaf ... (Ids)
//colleges: asdfasdfsaf,adfafdssa,adfasf... (Ids)
export const getListaUsuarios = async (req: Request, res: Response) => {
    const currUser = await Funcs.isLoggedIn(req, res);

    let gender = req.query.gender as string || ["M", "F", "NB"];
    if (typeof gender === "string")
        gender = gender.split(",");

    const iageL = req.query.ageL;
    let ageL = 0;
    if (iageL != null)
        ageL = Number(iageL);

    const iageU = req.query.ageU;
    let ageU = 100;
    if (iageU != null)
        ageU = Number(iageU);


    const interests = req.query.interests as string || "any";
    let users = null;

    let colleges = req.query.colleges as string || currUser.USER_COLLEGE_ID;
    colleges = colleges.split(",");

    if (interests === "any") {
        users = await Models.USERS_MOD.findAll({
            attributes: { exclude: ["USER_EMAIL", "USER_PASSWORD", "USER_LAST_LOG", "USER_FILTER_AGE", "USER_SUPERMATCHES", "USER_FILTER_GENDER"] },
            where: {
                [Op.and]: [
                    { USER_GENDER: gender },
                    { USER_COLLEGE_ID: colleges },
                    { USER_ID: { [Op.notIn]: await Funcs.checkRoomAndMatches(currUser.USER_ID) } },
                    Sequelize.literal(`TIMESTAMPDIFF(YEAR, USER_BIRTHDATE, CURDATE()) BETWEEN ${Number(ageL)} AND ${Number(ageU)}`),
                ]
            },
            include: [{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES',
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
            },
            {
                model: Models.SCHEDULES_MOD, as: "USER_SCHEDULE",
                attributes: {
                    exclude: ["SCHEDULE_ID", "USER_ID"]
                }
            }
            ],
            order: [[{
                model: Models.IMAGES_MOD, as: 'USER_IMAGES'
            }, 'IMAGE_ORDER', 'ASC']
            ]
        });
    }
    else {
        const interestsArray = interests.toString().split(",");
        console.log(interestsArray);
        users = await Funcs.findUsersByInterests(interestsArray, ageL, ageU, gender, colleges);
    }

    if (users) {
        const otherUsers = users.map(user => user.toJSON());
        const userScheduleModel = await Models.SCHEDULES_MOD.findOne({ where: { USER_ID: currUser.USER_ID } });
        const currUserSchedule = Schedule.buildCodedSchedule(userScheduleModel!.toJSON());
        console.log(currUserSchedule);

        const scheduleFilteredUsers = Schedule.scheduleFilter(otherUsers, currUserSchedule, currUser.USER_ID);

        res.status(200).json(
            {
                message: "Lista de Perfiles",
                data: scheduleFilteredUsers
            }
        );
    }
    else {
        res.status(404).json({
            errors: [{
                message: "No fue posible obtener los perfiles",
                extensions: {
                    code: "Conts.getListaUsuarios"
                }
            }]
        });
    }
} // Add Schedule match
export const getUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;

    const user = await Models.USERS_MOD.findByPk(id, {
        attributes: { exclude: ["USER_GENDER", "USER_PASSWORD"] },
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

    user ? res.status(201).json(
        {
            message: "Usuario encontrado",
            data: user
        }
    ) : res.status(404).json({
        errors: [{
            message: "No existe usuario con ID: " + id,
            extensions: {
                code: "Conts.getUsuario - No user found"
            }
        }]
    })
}
export const putUsuario = async (req: Request, res: Response) => {
    const { bio, last_log, status, rating, filter_age, filter_gender } = req.body

    try {
        const current_user = await Funcs.isLoggedIn(req, res)
        let updated = await Funcs.updateUser(current_user.USER_ID, res, bio, last_log, status, rating, filter_age, filter_gender)
        res.status(200).send({
            data: {
                message: "Succesfully updated",
                data: updated
            }
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Could not update user: " + error.message,
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }
}

//LogIn and Register
export const postLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        Funcs.logIn(email, password).then((value) => {
            if (typeof (value) != "object") {
                res.status(401).json({
                    errors: [{
                        message: value,
                        extensions: {
                            code: "Funcs.logIn - Checking DB info"
                        }
                    }]
                })
            } else {
                res.cookie("access_token", value[0], {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 60 * 15 * 1000
                })
                res.cookie("refresh_token", value[1], {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7000 * 60 * 60 * 24
                })
                res.status(200).json(
                    {
                        message: "Success Logging in",
                        data: value[2]
                    }
                )
            }
        })
    } catch (error) {
        console.log(error);
        res.status(401).json({
            errors: [{
                message: "Error al hacer Log In",
                extensions: {
                    code: "Funcs.logIn- All"
                }
            }]
        })
    }
}
export const getLogOut = async (req: Request, res: Response) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.cookie("access_token", null, { maxAge: 0 });
        res.cookie("refresh_token", null, { maxAge: 0 });
        res.status(200).send({
            message: "Succesfully signed out",
        });
    } catch (error: any) {
        res.status(401).send({
            errors: [{
                message: error.message,
                extensions: {
                    code: "Conts.postLogOut - Controller issue"
                }
            }]
        })
    }
}
export const getAuthenticate = async (req: Request, res: Response) => {
    try {
        const current_user = await Funcs.isLoggedIn(req, res)
        res.status(200).send({
            message: "User is logged in",
            data: current_user
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Error: " + error.message,
                extensions: {
                    code: "Funcs.auth"
                }
            }]
        })
    }
}
export const postRegister = async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, college_id, gender, birthdate, bio, filter_age, filter_gender } = req.body;
    try {
        Funcs.createUser(firstname, lastname, email, password, gender, birthdate, college_id, bio, filter_age, filter_gender).then((value) => {
            if (typeof (value) == "string") {
                res.status(401).json({
                    errors: [{
                        message: value,
                        extensions: {
                            code: "Funcs.createUser"
                        }
                    }]
                })
            } else {
                res.status(200).json({
                    data: {
                        message: "Succesfully Created",
                        pending_verification: value
                    }
                });
            }
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: error.message,
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }
}
export const postVerification = async (req: Request, res: Response) => {
    try {
        if (!req.body.email) {
            res.status(401).json({
                errors: [{
                    message: "Unable to send verification email: Missing email",
                    extensions: {
                        code: "Conts.pVer"
                    }
                }]
            })
        } else {
            await Funcs.findUser(undefined, req.body.email)
            Funcs.verifyEmail(req.body.email)
            res.status(200).send({
                message: "Verification email was sent!",
            })
        }
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Unable to send verification email: " + error.message,
                extensions: {
                    code: "Funcs.vEm"
                }
            }]
        })
    }
}
export const getVerification = async (req: Request, res: Response) => {
    try {
        let uuid: string = await Funcs.checkVerification(req.params.token)
        res.status(200).send({
            message: "User has been verified!",
            data: {
                user_id: uuid
            }
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Email was not verified: " + error.message,
                extensions: {
                    code: "Funcs.chVer"
                }
            }]
        })
    }
}
export const putPasswordReset = async (req: Request, res: Response) => {
    try {
        if (!req.body.email) {
            res.status(401).json({
                errors: [{
                    message: "Unable to send password reset email: Missing an email",
                    extensions: {
                        code: "Conts.pPassR"
                    }
                }]
            })
        } else {
            await Funcs.resetPassword(req.body.email)
            res.status(200).send({
                message: "Email was sent!",
            })
        }
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Unable to send password reset email: " + error.message,
                extensions: {
                    code: "Funcs.rPass"
                }
            }]
        })
    }
}
export const getPasswordReset = async (req: Request, res: Response) => {
    try {
        let password: string = await Funcs.checkPasswordReset(req.params.token)
        res.status(200).send({
            message: "Password has been reset! We strongly advise you to update it",
            data: {
                new_password: password
            }
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Password was not reset: " + error.message,
                extensions: {
                    code: "Funcs.cPass"
                }
            }]
        })
    }
}

//Colleges
export const getColleges = async (req: Request, res: Response) => {

    const colleges = await Models.COLLEGES_MOD.findAll();

    colleges ? res.status(200).send({
        message: "Lista de Universidades",
        data: {
            colleges: colleges
        }
    }) : res.status(401).send({
        message: "Error al obtener Universidades",
        data: {
            error: "Funcs.getColleges"
        }
    })
}
export const postColleges = async (req: Request, res: Response) => {
    const { name, domain, city } = req.body;
    try {
        let college = await Funcs.createCollege(name, domain, city)
        res.status(200).send({
            message: "Universidad creada",
            data: {
                college: college
            }
        })
    } catch (error) {
        res.status(401).send({
            message: "Error al crear Universidad",
            data: {
                error: "Funcs.createCollege"
            }
        })
    }
}

//Images
export const postImage = async (req: Request, res: Response) => {
    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        var upload = Storage.multer.fields([{ name: 'relation' }, { name: "type" }, { name: 'images' }])
        upload(req, res, async function (error) {
            let relation = req.body.relation ?? current_user.USER_ID
            if (error) {
                res.status(401).send({
                    errors: [{
                        message: error,
                        extensions: {
                            code: "Could not upload image"
                        }
                    }]
                })
            } else {
                try {
                    if (req.files) {
                        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                        const imgs = files['images'];
                        const current_images: number = await Funcs.findAllImages(relation)
                        let data: { IMAGE_LINK: string; IMAGE_ORDER: number; }[] = []
                        if (imgs.length + current_images - 1 > 8) {
                            return res.status(400).send({
                                errors: [{
                                    message: `Cantidad máxima de imagenes es 8. Las imagenes no sen enviaron`,
                                    extensions: {
                                        code: 'MaxNumbImgs'
                                    }
                                }]
                            })
                        }
                        for (let ind = 0; ind < imgs.length; ind++) {
                            let img = imgs[ind];

                            if (!img.mimetype.startsWith('image/')) {
                                return res.status(400).send({
                                    errors: [{
                                        message: `Solo archivos de tipo imagen, el archivo ${ind} no es válido. Las imágenes anteriores se enviaron.`,
                                        extensions: {
                                            code: 'InvalidFileType'
                                        }
                                    }]
                                });
                            }
                            let img_id = uuidv4();
                            const blob = Storage.bucket.file(`${req.body.type + "/" + img_id}_post.jpg`);
                            const blobStream = blob.createWriteStream({
                                resumable: false,
                                gzip: true
                            });
                            blobStream.end(img.buffer);
                            data.push(await Funcs.addImage2DB(img_id, relation, req.body.type, current_images + ind));
                        }
                        return res.status(200).send({
                            message: "Images added to the DB",
                            data: data
                        })

                    } else throw new Error("Issue with files");
                } catch (error: any) {
                    console.log("We are here 1")
                    res.status(401).send({
                        errors: [{
                            message: error.message,
                            extensions: {
                                code: "Conts.postImage"
                            }
                        }]
                    });
                }
            }
        })
    } catch (error: any) {
        res.status(401).send({
            errors: [{
                message: error.message,
                extensions: {
                    code: "Controller issue"
                }
            }]
        });
    }
}
export const putImage = async (req: Request, res: Response) => {
    const { image_ids, image_orders } = req.body;

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        if (image_ids.length !== image_orders.length) {
            throw new Error("Image ids and image orders must have the same length");
        }
        for (let i = 0; i < image_ids.length; i++) {
            Funcs.modifyImgOrder(current_user.USER_ID, image_ids[i], image_orders[i])
        }
        res.status(200).send({
            message: "Imagenes actualizadas"
        })
    } catch (error) {
        res.status(401).send({
            message: "Error al actualizar Imagenes: " + error,
            data: {
                error: "Funcs.modImgOr"
            }
        })
    }
}
export const deleteImage = async (req: Request, res: Response) => {
    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        var upload = Storage.multer.fields([{ name: 'curr_images' }, { name: "new_images" }])
        upload(req, res, async function (error) {
            if (error) {
                res.status(401).send({
                    errors: [{
                        message: error,
                        extensions: {
                            code: "Could not delete images"
                        }
                    }]
                })
            } else {
                try {
                    let old_imgs = req.body.curr_images
                    old_imgs= old_imgs.filter((n: any) => n != "")
                    const count_images: number = await Funcs.findAllImages(current_user.USER_ID)
                    
                    let data: any = []
                    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                    let imgs: any = files['new_images'];                 
                    if (imgs === undefined) {
                        imgs = []
                        console.log("No new images")
                    }
                    console.log(old_imgs)
                    if ((count_images-old_imgs.length-1) + imgs.length === 0) {
                            return res.status(400).send({
                                errors: [{
                                    message: `Tienes que tener una imagen por lo menos`,
                                    extensions: {
                                        code: 'MinNumbImgs'
                                    }
                                }]
                            })
                        }
                        for (let ind = 0; ind < old_imgs.length; ind++) {
                            if (imgs[ind]) {
                                let img = imgs[ind];
                                if (!img.mimetype.startsWith('image/')) {
                                    return res.status(400).send({
                                        errors: [{
                                            message: `Solo archivos de tipo imagen, el archivo ${ind} no es válido. Las imágenes anteriores se enviaron.`,
                                            extensions: {
                                                code: 'InvalidFileType'
                                            }
                                        }]
                                    });
                                }
                                let img_id = uuidv4();
                                const blob = Storage.bucket.file(`USER/${img_id}_post.jpg`);
                                const blobStream = blob.createWriteStream({
                                    resumable: false,
                                    gzip: true
                                });
                                blobStream.end(img.buffer);
                                let path = `https://storage.googleapis.com/classmatch/USER/${img_id}_post.jpg`
                                await Funcs.deleteImagefromDB(old_imgs[ind], path)
                                data.push({
                                    OLD: old_imgs[ind],
                                    NEW: path
                                })
                            } else {
                                await Funcs.deleteImagefromDB(old_imgs[ind])
                                data.push({
                                    OLD: old_imgs[ind],
                                    NEW: ""
                                });
                            }
                            const oldFile = Storage.bucket.file(old_imgs[ind].split("classmatch/")[1]);
                            await oldFile.delete().catch((err) =>
                                console.error(`Error deleting file for IMAGE_ID ${old_imgs[ind]}:`, err)
                            );
                            console.log("Deleted: "+ind)
                        }
                        return res.status(200).send({
                            message: "Images deleted from DB",
                            data: data
                        })
                } catch (error: any) {
                    res.status(401).send({
                        errors: [{
                            message: error.message,
                            extensions: {
                                code: "Conts.deleteImage"
                            }
                        }]
                    });
                }
            }
        })
    } catch (error: any) {
        res.status(401).send({
            errors: [{
                message: error.message,
                extensions: {
                    code: "Controller issue"
                }
            }]
        });
    }
}

//Events
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Funcs.activeEvents()
        events ? res.status(200).send({
            message: "Lista de Eventos Activos",
            data: {
                events: events
            }
        }) : res.status(401).send({
            message: "Error al obtener Eventos",
            data: {
                error: "Funcs.getEvents"
            }
        })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al obtener Eventos",
            data: {
                error: error.message
            }
        })
    }

}
export const getEvent = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const event = await Funcs.allEventInfo(id)
        event ? res.status(200).send({
            message: "Evento encontrado",
            data: {
                event: event
            }
        }) : res.status(401).send({
            message: "Error al obtener Evento",
            data: {
                error: "Funcs.getEvent"
            }
        })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al obtener Evento: " + error.message,
            data: {
                error: "Funcs.getEvent"
            }
        })
    }
}
export const postEvent = async (req: Request, res: Response) => {

    const { title, description, date, location, capacity, lock } = req.body;
    try {
        let current_user = await Funcs.isLoggedIn(req, res)

        let event = await Funcs.createEvent(current_user.USER_ID, title, description, date, location, capacity, lock)
        res.status(200).send({
            message: "Evento creado",
            data: {
                event: event
            }
        })
    } catch (error) {
        res.status(401).send({
            message: "Error al crear Evento",
            data: {
                error: "Funcs.createEvent"
            }
        })
    }
}
export const putEvent = async (req: Request, res: Response) => {
    const { event_id, id, title, description, date, location, capacity, status } = req.body;

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        if (await Funcs.isAdmin(current_user.USER_ID, event_id)) {
            let event = await Funcs.updateEvent(id, title, description, date, location, capacity, status)
            res.status(200).send({
                message: "Evento actualizado",
                data: {
                    event: event
                }
            })
        } else {
            res.status(401).send({
                message: "No tienes permisos para actualizar este evento",
                data: {
                    error: "Funcs.isAdmin"
                }
            })
        }
    } catch (error) {
        res.status(401).send({
            message: "Error al actualizar Evento: " + error,
            data: {
                error: "Funcs.updateEvent"
            }
        })
    }
}

//User Events
export const getMyApplications = async (req: Request, res: Response) => {
    try {
        let current_user = await Funcs.isLoggedIn(req, res).then((value) => value.USER_ID)
        const applications = await Funcs.checkMyApplications(current_user)
        applications[0] ? res.status(200).send({
            message: "Lista de Eventos aplicados",
            data: applications
        }) : res.status(404).send({
            message: "No se ha aplicado a ningun evento",
            data: {
                error: "Conts.gMyApps"
            }
        })
    } catch (error: any) {
        res.status(500).send({
            message: "Error al obtener Eventos: " + error.message,
            data: {
                error: "Funcs.cMyApps"
            }
        })
    }
}
export const postRequestEvent = async (req: Request, res: Response) => {
    const event_id = req.params.event

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.requestAttendEvent(current_user, event_id)
        if (data) {
            let result = data == 1 ? "Aceptado" : "Pendiente"
            res.status(200).send({
                message: "Se ha aplicado a este evento exitosamente",
                data: {
                    evento: event_id,
                    aceptacion: result
                }
            })
        } else {
            res.status(404).send({
                message: "No fue posible aplicar al evento en este momento",
                data: {
                    error: "Conts.pReqEv"
                }
            })
        }
    } catch (error: any) {
        res.status(401).send({
            message: "Error al aplicar a evento: " + error.message,
            data: {
                error: "Funcs.rAttEv"
            }
        })
    }
}
export const postRequestAdmin = async (req: Request, res: Response) => {
    const { req_uevent, req_user, decision } = req.body

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.requestDecision(current_user, req_uevent, req_user, Number(decision))
        data ?
            res.status(200).send({
                message: "Solicitud de evento respondida",
                data: data
            }) : res.status(404).send({
                message: "Error al responder solicitud",
                data: {
                    error: "Conts.pReqAdm"
                }
            })
    } catch (error: any) {
        res.status(401).send({
            message: "No fue posible responder a esta solicitud: " + error.message,
            data: {
                error: "Funcs.rDec"
            }
        })
    }
}
export const getUEventsAdmin = async (req: Request, res: Response) => {
    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.findMyUEventsAdmin(current_user)
        data ?
            res.status(200).send({
                message: "Eventos organizados encontrados",
                data: data
            }) : res.status(404).send({
                message: "No se han encontrado eventos organizados",
                data: {
                    error: "Conts.gUEvAdm"
                }
            })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al encontrar eventos: " + error.message,
            data: {
                error: "Funcs.fMUEAdm"
            }
        })
    }
}
export const getUEvents = async (req: Request, res: Response) => {
    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.findMyUEvents(current_user)
        data ?
            res.status(200).send({
                message: "Eventos asistidos encontrados",
                data: data
            }) : res.status(404).send({
                message: "No se han encontrado eventos asistidos",
                data: {
                    error: "Conts.gUEv"
                }
            })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al encontrar eventos: " + error.message,
            data: {
                error: "Funcs.fMUEv"
            }
        })
    }
}
export const getUEventAttendees = async (req: Request, res: Response) => {
    const event_id = req.params.event

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.findUEventAttendees(current_user, event_id)
        data ?
            res.status(200).send({
                message: "Usuarios asistentes encontrados",
                data: data
            }) : res.status(404).send({
                message: "No se han encontrado usuarios asistentes aún",
                data: {
                    error: "Conts.gUEvAt"
                }
            })
    } catch (error: any) {
        res.status(401).send({
            message: "No fue posible encontrar otros usuarios: " + error.message,
            data: {
                error: "Funcs.fUEvAt"
            }
        })
    }
}
export const getUEReqsAdmin = async (req: Request, res: Response) => {
    let event_id = req.params.event

    try {
        let current_user = await Funcs.isLoggedIn(req, res)
        const data = await Funcs.findUEventRequestsAdmin(current_user, event_id)
        data ?
            res.status(200).send({
                message: "Solicitudes de evento encontradas",
                data: data
            }) : res.status(404).send({
                message: "No se han encontrado solicitudes",
                data: {
                    error: "Conts.gUERAdm"
                }
            })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al encontrar solicitudes: " + error.message,
            data: {
                error: "Funcs.fUERAdm"
            }
        })
    }
}

//Matches
export const postMatch = async (req: Request, res: Response) => {
    const { other_user, supermatch} = req.body;

    try {
        let current_user = await Funcs.isLoggedIn(req, res)

        if (current_user.USER_ID === other_user) {
            throw new Error("User is the same person")
        }
        let data = await Funcs.createMatch(current_user.USER_ID, other_user, supermatch)
        data ? 
        res.status(200).send({
            message: "Hay match entre usuarios",
            data: data
        }):
        res.status(200).send({
            message: "Match enviado"
        })
    } catch (error: any) {
        res.status(401).send({
            message: "Error al crear Match: "+error.message,
            data: {
                error: "Funcs.crMtc"
            }
        })
    }
}