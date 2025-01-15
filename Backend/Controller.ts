import { Request, Response } from "express";
import * as Models from "./Models";
import * as Funcs from "./Functions";
import * as Storage from "./Connection";
import { v4 as uuidv4 } from 'uuid';

//User Management
export const getListaUsuarios = async (req: Request, res: Response) => {
    const users= await Models.USERS_MOD.findAll({
        attributes: {exclude:  ["USER_EMAIL", "USER_PASSWORD", "USER_LAST_LOG", "USER_FILTER_AGE", "USER_SUPERMATCHES", "USER_FILTER_GENDER"]},
        include: [{ 
                model: Models.IMAGES_MOD, as: 'USER_IMAGES', 
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"], 
            }], 
            order: [[{ 
                model: Models.IMAGES_MOD, as: 'USER_IMAGES' }, 'IMAGE_ORDER', 'ASC'] 
            ]
        });
    users ? res.status(200).json(
        {
            message: "Lista de Perfiles",
            data: users,
            schedules: 9 // WIP! 
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
    
    const {id} = req.params;

    const user= await Models.USERS_MOD.findByPk(id, {
        attributes: {exclude: ["USER_GENDER", "USER_PASSWORD"]},
        include: [{ 
            model: Models.IMAGES_MOD, as: 'USER_IMAGES', 
            attributes: ["IMAGE_LINK", "IMAGE_ORDER"], 
        }], 
        order: [[{ 
            model: Models.IMAGES_MOD, as: 'USER_IMAGES' }, 'IMAGE_ORDER', 'ASC'] 
        ]
    });

    user ? res.status(201).json(
        {
            message: "Usuario encontrado",
            data: user
        }
    ) : res.status(404).json({
        errors: [{
            message: "No existe usuario con ID: " +id,
            extensions: {
                code: "Conts.getUsuario - No user found"
            }
        }]
    })
}
export const postUsuario = async (req: Request, res: Response) => {
    
    try {
        const info= req.body;
        let user_id=  Funcs.createUser(info.firstname, info.lastname, info.email, info.password, info.gender, info.birthdate, 
            info.college_id, info.bio, info.filter_age, info.filter_gender);
         res.status(200).json({
            message: "Usuario creado",
            data: user_id
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "Error al crear Usuario",
            errors: error.message
        })
    }
}
export const putUsuario = async (req: Request, res: Response) => {
    const info= req.body   
    try {
        let updated = await Funcs.updateUser(req, info.bio, info.last_log, info.status, info.rating, info.filter_age, info.filter_gender)
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
            if (typeof(value) != "object") {
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
export const postLogOut = async (req: Request, res: Response) => {
    try {
        res.cookie("access_token", "", {maxAge: 0})
        res.cookie("refresh_token", "", {maxAge: 0})
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
export const getAuthenticate= async (req: Request, res: Response)=> {
    try {
        const current_user = await Funcs.isLoggedIn(req)

        if(typeof(current_user)!= "object") {
            res.status(401).send({
                errors: [{
                    message: current_user,
                    extensions: {
                        code: "Funcs.isLoggedIn"
                    }
                }]
            })
            throw new Error("No auth")
        }
        res.status(200).send({
            message: "User is logged in",
            data: current_user
        })
    } catch (error: any) {
        if (error.message == "jwt must be provided") {
            Funcs.refreshToken(req, res, "/api/auth")
        } else {
        res.status(401).send({
            errors: [{
                message: error.message,
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }}
} //Copy and Paste REDIRECT!
export const postRegister = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        Funcs.createUser(data.firstname, data.lastname, data.email, data.password, data.college_id, data.gender, data.birthdate, data.bio, data.filter_age, data.filter_gender).then((value) => {
            if (typeof(value) == "string") {
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
                        new_user_id: value[0]
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
                }}]
        })
    }  
}

//Colleges
export const getColleges = async (req: Request, res: Response) => {
    
    const colleges= await Models.COLLEGES_MOD.findAll({
        attributes: ["college_name", "college_city"]
    });
    
    colleges? res.status(200).send({
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
export const postImage= async (req: Request, res: Response) => {
    try {
        let current_user= await Funcs.isLoggedIn(req)

        var upload = Storage.multer.fields([{name: 'image'}, {name: 'relation'}, {name: "type"}])
        upload(req, res, async function (error) {
            if (error) {
              res.status(401).send({
                errors: [{
                    message: error,
                    extensions: {
                        code: "Could not upload image"
                    }}]
            })
            } else {
                try {
                    if (req.files) {
                        const files= req.files as {[fieldname: string]: Express.Multer.File[]};
                        const img= files['image'][0];
                        if (!img.mimetype.startsWith('image/')) {
                            return res.status(400).send({ 
                                errors: [{ message: 'Only image files are allowed',
                                    extensions: { code: 'InvalidFileType' 
                                }
                            }]
                        })}
                        let img_id= uuidv4()
                        let relation= req.body.relation?? current_user.getDataValue("USER_ID")
                        console.log(relation)
                        let data = await Funcs.addImage2DB(img_id, relation, req.body.type)
                        const blob = Storage.bucket.file(`${req.body.type+"/"+img_id}_post.jpg`);
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
                                    }}]
                            })
                        }
                        } else throw new Error("Issue with files");
                } catch (error: any) {
                        res.status(401).send({
                            errors: [{
                                message: error.message,
                                extensions: {
                                    code: "Conts.postImage"
                                }}]
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
                }}]
        });
    }
}