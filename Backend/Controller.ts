import { Request, Response } from "express";
import * as Models from "./Models";
import * as Funcs from "./Functions";
import * as Schedule from "./scheduleFunctions";
import * as Storage from "./Connection";
import { v4 as uuidv4 } from 'uuid';

import mercadopago from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

//Payment Management


// Schedule Management

// Returns DecodedSchedule
export const getUserSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;

    let modelSchedule = await Models.SCHEDULES_MOD.findOne({where: {USER_ID: id}});

    if(modelSchedule != null) {
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

// Requires the cookies (ScheduleUpdateObject)
export const putUserSchedule = async (req: Request, res: Response) => {
    const id = req.body.id;
    const newSchedule = Schedule.codeSchedule(req.body.newSchedule);

    try {
        await Funcs.isLoggedIn(req, res);
        const [updatedRows] = await Models.SCHEDULES_MOD.update(newSchedule, {
            where: {USER_ID: id}
        });
        
        const updated = await Models.SCHEDULES_MOD.findOne({where: {USER_ID: id}});

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
export const getListaUsuarios = async (req: Request, res: Response) => {
    const users = await Models.USERS_MOD.findAll({
        attributes: { exclude: ["USER_EMAIL", "USER_PASSWORD", "USER_LAST_LOG", "USER_FILTER_AGE", "USER_SUPERMATCHES", "USER_FILTER_GENDER"] },
        include: [{
            model: Models.IMAGES_MOD, as: 'USER_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
        }],
        order: [[{
            model: Models.IMAGES_MOD, as: 'USER_IMAGES'
        }, 'IMAGE_ORDER', 'ASC']
        ]
    });
    users ? res.status(200).json(
        {
            message: "Lista de Perfiles",
            data: users
        }
    ) : res.status(404).json({
        errors: [{
            message: "No fue posible obtener los perfiles",
            extensions: {
                code: "Conts.getListaUsuarios"
            }
        }]
    })
} // Add Schedule match
export const getUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;

    const user = await Models.USERS_MOD.findByPk(id, {
        attributes: { exclude: ["USER_GENDER", "USER_PASSWORD"] },
        include: [{
            model: Models.IMAGES_MOD, as: 'USER_IMAGES',
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"],
        }],
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
    const info = req.body;
    try {
        let updated = await Funcs.updateUser(req, res, info.bio, info.last_log, info.status, info.rating, info.filter_age, info.filter_gender)
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

//LogIn and Register
export const postLogin = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        Funcs.logIn(data.email, data.password).then((value) => {
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
                    maxAge: 60 * 15 * 1000
                })
                res.cookie("refresh_token", value[1], {
                    httpOnly: true,
                    secure: true,
                    maxAge: 7000 * 60 * 60 * 24
                })
                res.status(200).json(
                    {
                        message: "Log In Succesfull",
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
        res.cookie("access_token", null, { maxAge: 0 })
        res.cookie("refresh_token", null, { maxAge: 0 })
        res.status(200).send({
            message: "Succesfully signed out"
        })
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
                message: "Error: "+error.message,
                extensions: {
                    code: "Funcs.auth"
                }
            }]
        })
    }
}
export const postRegister = async (req: Request, res: Response) => {
    let [firstname, lastname, email, password, college_id, gender, birthdate, bio, filter_age, filter_gender] = [req.body.firstname, req.body.lastname, req.body.email, req.body.password,
    req.body.college_id, req.body.gender, req.body.birthdate, req.body.bio, req.body.filter_age, req.body.filter_gender];
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
            await Funcs.verifyEmail(req.body.email)
            res.status(200).send({
                message: "Verification email was sent!",
            })
        } 
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Unable to send verification email: "+error.message,
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
                message: "Email was not verified: "+error.message,
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
                message: "Unable to send password reset email: "+error.message,
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
                message: "Password was not reset: "+error.message,
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
    const data = req.body;
    try {
        let college = await Funcs.createCollege(data.name, data.domain, data.city)
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

        var upload = Storage.multer.fields([{ name: 'image' }, { name: 'relation' }, { name: "type" }])
        upload(req, res, async function (error) {
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
                        const img = files['image'][0];
                        if (!img.mimetype.startsWith('image/')) {
                            return res.status(400).send({
                                errors: [{
                                    message: 'Only image files are allowed',
                                    extensions: {
                                        code: 'InvalidFileType'
                                    }
                                }]
                            })
                        }
                        let img_id = uuidv4()
                        let relation = req.body.relation ?? current_user.getDataValue("USER_ID")
                        console.log(relation)
                        let data = await Funcs.addImage2DB(img_id, relation, req.body.type)
                        const blob = Storage.bucket.file(`${req.body.type + "/" + img_id}_post.jpg`);
                        const blobStream = blob.createWriteStream({
                            resumable: false,
                            gzip: true
                        });
                        blobStream.end(img.buffer);
                        try {
                            res.status(200).send({
                                message: "Image added to the DB",
                                data: data
                            })
                        } catch (error) {
                            res.status(401).send({
                                errors: [{
                                    message: error,
                                    extensions: {
                                        code: "Could not connect to GCP"
                                    }
                                }]
                            })
                        }
                    } else throw new Error("Issue with files");
                } catch (error: any) {
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
    let current_user = await Funcs.isLoggedIn(req, res)

    const data = req.body;
    try {
        let event = await Funcs.createEvent(current_user.getDataValue("USER_ID"), data.title, data.description, data.date, data.location, data.capacity, data.lock)
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
    let current_user = await Funcs.isLoggedIn(req, res)
    const data = req.body;

    if (await Funcs.isAdmin(current_user.getDataValue("USER_ID"), data.event_id)) {
        try {
            let event = await Funcs.updateEvent(data.id, data.title, data.description, data.date, data.location, data.capacity, data.status)
            res.status(200).send({
                message: "Evento actualizado",
                data: {
                    event: event
                }
            })
        } catch (error) {
            res.status(401).send({
                message: "Error al actualizar Evento: " + error,
                data: {
                    error: "Funcs.updateEvent"
                }
            })
        }
    } else {
        res.status(401).send({
            message: "No tienes permisos para actualizar este evento",
            data: {
                error: "Funcs.isAdmin"
            }
        })
    }


}

//User Events
export const getMyApplications = async (req: Request, res: Response) => {
    let current_user = await Funcs.isLoggedIn(req, res)

    if (!current_user) { 
        res.status(498).send({
            message: "No hay un usuario logueado",
            data: {
                error: "Funcs.isLoggedIn"
            }
        }) 
    } else {
        try {
        const applications = await Funcs.checkMyApplications(current_user)
        applications ? res.status(200).send({
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
}}
export const postRequestEvent = async (req: Request, res: Response) => {
    let current_user = await Funcs.isLoggedIn(req, res)
    const event_id = req.params.event

    try {
        const data = await Funcs.requestAttendEvent(current_user, event_id)
        if (data) {
            let result= data==1? "Aceptado": "Pendiente" 
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
    let current_user = await Funcs.isLoggedIn(req, res)
    const req_uevent = req.body.req_uevent
    const req_user = req.body.req_user
    const decision = req.body.decision
    
    try {
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
    let current_user = await Funcs.isLoggedIn(req, res)

    try {
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
    let current_user = await Funcs.isLoggedIn(req, res)

    try {
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
    let current_user = await Funcs.isLoggedIn(req, res)
    const event_id = req.params.event

    try {
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
    let current_user = await Funcs.isLoggedIn(req, res)
    let event_id= req.params.event
    
    try {
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
