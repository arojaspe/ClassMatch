import { Request, Response } from "express";
import * as Models from "./Models";
import * as Funcs from "./Functions";
import { sign, verify } from "jsonwebtoken";

//User Management
export const getListaUsuarios = async (req: Request, res: Response) => {
    
    const users= await Models.USERS_MOD.findAll({
        attributes: {exclude:  ["USER_EMAIL", "USER_PASSWORD", "USER_LAST_LOG", "USER_FILTER_AGE", "USER_SUPERMATCHES", "USER_FILTER_GENDER"]},
        include: [{ 
                model: Models.USER_IMAGES_MOD, as: 'USER_IMAGES', 
                attributes: ["IMAGE_LINK", "IMAGE_ORDER"], 
            }], 
            order: [[{ 
                model: Models.USER_IMAGES_MOD, as: 'USER_IMAGES' }, 'IMAGE_ORDER', 'ASC'] 
            ]
        });
    users ? res.status(201).json(
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
}
export const getUsuario = async (req: Request, res: Response) => {
    
    const {id} = req.params;

    const user= await Models.USERS_MOD.findByPk(id, {
        attributes: {exclude: ["USER_GENDER", "USER_PASSWORD"]}
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
    
    const {body}= req;
    try {
        const user= Models.USERS_MOD.build(body);
        await user.save();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al crear Usuario",
        })
    }
}
export const putUsuario = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        Funcs.logIn(data.user, data.password).then((value) => {
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
                res.status(200).send({
                    message: "Success Logging in",
                    data: {
                        access_token: value[0],
                        expires_in: 7000 * 60 * 60 * 24,
                        refresh_token: value[1],
                        user: value[2]
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({
            errors: [{
                message: "Error al hacer Log In",
                extensions: {
                    code: "Funcs.logIn"
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
                res.status(200).send(value[2])
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
            data: {
                message: "Succesfully signed out"
            }
        })
    } catch (error) {
        res.status(401).send({
            errors: [{
                message: error,
                extensions: {
                    code: "Conts.postLogOut - Controller issue"
                }
            }]
        })   
    }
}
export const getAuthenticate= async (req: Request, res: Response)=> {
    try {
        const user = await Funcs.isLoggedIn(req)
        if(typeof(user)!= "object") {
            res.status(401).send({
                errors: [{
                    message: user,
                    extensions: {
                        code: "Funcs.isLoggedIn"
                    }
                }]
            })
            throw new Error("No auth")
        }
        res.status(200).send({
            message: "User is logged in",
            data: {
                user: user
            }
        })
    } catch (error) {
        res.status(401).send({
            errors: [{
                message: error,
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }
}
export const postRefreshToken= async (req: Request, res: Response) => {
    try {
        const refresh_token= req.cookies["refresh_token"]
        const payload: any = verify(refresh_token, "refresh_secret")
        if(!payload) {
            res.status(401).send({
                errors: [{
                    message: "Token is null",
                    extensions: {
                        code: "Verifyig tokens"
                    }
                }]
            })
            throw new Error("No tokens")
        }
        let access_token= sign({
            id: payload.id
        },"access_secret", {expiresIn: "15m"});
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 15
        })
        res.status(200).send({
            data: {
                msg: "New Access Token was given",
                access_token: access_token
            }
        })
    } catch (error) {
        res.status(401).send({
            errors: [{
                message: error,
                extensions: {
                    code: "Controller issue"
                }
            }]
        })
    }
}
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
    } catch (error) {
        console.log(error);
        res.status(401).json({
            errors: [{
                message: error,
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