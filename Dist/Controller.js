"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColleges = exports.postRegister = exports.postRefreshToken = exports.getAuthenticate = exports.postLogOut = exports.postLogin = exports.putUsuario = void 0;
const Models = __importStar(require("./Models"));
const Funcs = __importStar(require("./Functions"));
const jsonwebtoken_1 = require("jsonwebtoken");
//User Management
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        Funcs.logIn(data.user, data.password).then((value) => {
            if (typeof (value) != "object") {
                res.status(401).json({
                    errors: [{
                            message: value,
                            extensions: {
                                code: "Funcs.logIn - Checking DB info"
                            }
                        }]
                });
            }
            else {
                res.cookie("access_token", value[0], {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 15 * 1000
                });
                res.cookie("refresh_token", value[1], {
                    httpOnly: true,
                    secure: true,
                    maxAge: 7000 * 60 * 60 * 24
                });
                res.status(200).send({
                    message: "Success Logging in",
                    data: {
                        access_token: value[0],
                        expires_in: 7000 * 60 * 60 * 24,
                        refresh_token: value[1],
                        user: value[2]
                    }
                });
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            errors: [{
                    message: "Error al hacer Log In",
                    extensions: {
                        code: "Funcs.logIn"
                    }
                }]
        });
    }
});
exports.putUsuario = putUsuario;
//LogIn and Register
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        Funcs.logIn(data.user, data.password).then((value) => {
            if (typeof (value) != "object") {
                res.status(401).json({
                    errors: [{
                            message: value,
                            errors: [{
                                    message: "value",
                                    extensions: {
                                        code: "Funcs.logIn - Checking DB info"
                                    }
                                }]
                        }]
                });
            }
            else {
                res.cookie("access_token", value[0], {
                    httpOnly: true,
                    secure: true,
                    maxAge: 60 * 15 * 1000
                });
                res.cookie("refresh_token", value[1], {
                    httpOnly: true,
                    secure: true,
                    maxAge: 7000 * 60 * 60 * 24
                });
                res.status(200).send({
                    message: "Success Logging in",
                    data: {
                        access_token: value[0],
                        expires_in: 7000 * 60 * 60 * 24,
                        refresh_token: value[1],
                        user: value[2]
                    }
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            errors: [{
                    message: "Error al hacer Log In",
                    extensions: {
                        code: "Funcs.logIn"
                    }
                }]
        });
    }
});
exports.postLogin = postLogin;
const postLogOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("access_token", "", { maxAge: 0 });
        res.cookie("refresh_token", "", { maxAge: 0 });
        res.status(200).send({
            data: {
                message: "Succesfully signed out"
            }
        });
    }
    catch (error) {
        res.status(401).send({
            errors: [{
                    message: error,
                    extensions: {
                        code: "Conts.postLogOut - Controller issue"
                    }
                }]
        });
    }
});
exports.postLogOut = postLogOut;
const getAuthenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Funcs.isLoggedIn(req);
        if (typeof (user) != "object") {
            res.status(401).send({
                errors: [{
                        message: user,
                        extensions: {
                            code: "Funcs.isLoggedIn"
                        }
                    }]
            });
            throw new Error("No auth");
        }
        res.status(200).send({
            data: {
                user: user
            }
        });
    }
    catch (error) {
        res.status(401).send({
            errors: [{
                    message: error,
                    extensions: {
                        code: "Controller issue"
                    }
                }]
        });
    }
});
exports.getAuthenticate = getAuthenticate;
const postRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refresh_token = req.cookies["refresh_token"];
        const payload = (0, jsonwebtoken_1.verify)(refresh_token, "refresh_secret");
        if (!payload) {
            res.status(401).send({
                errors: [{
                        message: "Token is null",
                        extensions: {
                            code: "Verifyig tokens"
                        }
                    }]
            });
            throw new Error("No tokens");
        }
        let access_token = (0, jsonwebtoken_1.sign)({
            id: payload.id
        }, "access_secret", { expiresIn: "15m" });
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 15
        });
        res.status(200).send({
            data: {
                msg: "New Access Token was given",
                access_token: access_token
            }
        });
    }
    catch (error) {
        res.status(401).send({
            errors: [{
                    message: error,
                    extensions: {
                        code: "Controller issue"
                    }
                }]
        });
    }
});
exports.postRefreshToken = postRefreshToken;
const postRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        Funcs.createUser(data.firstname, data.lastname, data.email, data.password, data.college_id, data.gender, data.birthdate, data.bio, data.filter_age, data.filter_gender).then((value) => {
            if (typeof (value) == "string") {
                res.status(401).json({
                    errors: [{
                            message: value,
                            extensions: {
                                code: "Funcs.createUser"
                            }
                        }]
                });
            }
            else {
                res.status(200).json({
                    data: {
                        message: "Succesfully Created",
                        new_user_id: value[0]
                    }
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            errors: [{
                    message: error,
                    extensions: {
                        code: "Controller issue"
                    }
                }]
        });
    }
});
exports.postRegister = postRegister;
//Colleges
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const colleges = yield Models.COLLEGES_MOD.findAll({
        attributes: ["college_id", "college_name"]
    });
    colleges ? res.status(200).send({
        data: {
            colleges: colleges,
            msg: "Succesful"
        }
    }) : res.status(401).send({
        data: {
            msg: "Unsuccesful",
            error: "Funcs.getColleges"
        }
    });
});
exports.getColleges = getColleges;
