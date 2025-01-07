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
exports.getCollege = exports.createCollege = exports.isLoggedIn = exports.authUser = exports.logIn = exports.updateUser = exports.createUser = exports.str2hsh = void 0;
const Models = __importStar(require("./Models"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = require("jsonwebtoken");
//String Handling
function str2hsh(str) {
    let hash = 0;
    if (str.length == 0)
        return hash.toString();
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}
exports.str2hsh = str2hsh;
//Users
function createUser(firstname, lastname, email, password, gender, birthdate, college, bio, filter_age, filter_gender) {
    return __awaiter(this, void 0, void 0, function* () {
        let usuario = yield findUser(undefined, email);
        if (usuario) {
            return ("User with that email already exists");
        }
        else {
            let id = (0, uuid_1.v4)();
            yield Models.USERS_MOD.create({
                USER_ID: id,
                USER_FIRSTNAME: firstname,
                USER_LASTNAME: lastname,
                USER_EMAIL: email,
                USER_PASSWORD: str2hsh(password),
                USER_COLLEGE_ID: college,
                USER_GENDER: gender,
                USER_BIRTHDATE: birthdate,
                USER_BIO: bio,
                USER_LAST_LOG: Date.now(),
                USER_RATING: 0,
                USER_FILTER_AGE: filter_age,
                USER_SUPERMATCHES: 5,
                USER_FILTER_GENDER: filter_gender
            });
            return ([id]);
        }
    });
}
exports.createUser = createUser;
function updateUser(req, bio, last_log, status, rating, filter_age, filter_gender) {
    return __awaiter(this, void 0, void 0, function* () {
        let usuario = yield isLoggedIn(req);
        usuario.set({
            USER_BIO: bio !== null && bio !== void 0 ? bio : usuario.getDataValue("USER_BIO"),
            USER_LAST_LOG: last_log !== null && last_log !== void 0 ? last_log : usuario.getDataValue("USER_LAST_LOG"),
            USER_STATUS: status !== null && status !== void 0 ? status : usuario.getDataValue("USER_STATUS"),
            USER_RATING: rating !== null && rating !== void 0 ? rating : usuario.getDataValue("USER_RATING"),
            USER_FILER_AGE: filter_age !== null && filter_age !== void 0 ? filter_age : usuario.getDataValue("USER_FILTER_AGE"),
            USER_FILTER_GENDER: filter_gender !== null && filter_gender !== void 0 ? filter_gender : usuario.getDataValue("USER_FILTER_GENDER")
        });
        usuario.save();
    });
}
exports.updateUser = updateUser;
function logIn(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let usuario = yield findUser(undefined, email);
            if (usuario) {
                if (str2hsh(password) == (usuario === null || usuario === void 0 ? void 0 : usuario.getDataValue("USER_PASSWORD"))) {
                    let tokens = yield updateToken(usuario);
                    return ([tokens.data[0], tokens.data[1], yield authUser(usuario.getDataValue("USER_ID"))]);
                }
                else {
                    return ("Not the correct password");
                }
            }
            else {
                return ("No user with that email");
            }
        }
        catch (error) {
            throw new Error("Could not Log In");
        }
    });
}
exports.logIn = logIn;
function authUser(uuid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuario = yield Models.USERS_MOD.findOne({
                where: { USER_ID: uuid },
                attributes: {
                    exclude: ["USER_PASSWORD"]
                }
            });
            return { data: usuario };
        }
        catch (error) {
            throw new Error("User not logged in");
        }
    });
}
exports.authUser = authUser;
function isLoggedIn(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = (0, jsonwebtoken_1.verify)(req.cookies["access_token"], "access_secret");
        const user = yield authUser(payload.id);
        if (user.error) {
            console.error(user.error);
        }
        return (user === null || user === void 0 ? void 0 : user.data);
    });
}
exports.isLoggedIn = isLoggedIn;
let updateToken = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let access_token = (0, jsonwebtoken_1.sign)({
                id: user.getDataValue("USER_ID")
            }, "access_secret", { expiresIn: "15m" });
            let refresh_token = (0, jsonwebtoken_1.sign)({
                id: user.getDataValue("USER_ID")
            }, "refresh_secret", { expiresIn: "1w" });
            return { data: [access_token, refresh_token] };
        }
        catch (error) {
            throw new Error("Unable to update credentials");
        }
    });
};
let findUser = function (id, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            let usuario = yield Models.USERS_MOD.findByPk(id);
            return usuario;
        }
        let usuario = yield Models.USERS_MOD.findOne({ where: { USER_EMAIL: email } });
        return usuario;
    });
};
//Colleges
function createCollege(name, domain, city) {
    return __awaiter(this, void 0, void 0, function* () {
        let college = yield findCollege(undefined, domain, city);
        if (college) {
            return ("College already exists!");
        }
        else {
            let id = (0, uuid_1.v4)();
            yield Models.USERS_MOD.create({
                COLLEGE_ID: id,
                COLLEGE_NAME: name,
                COLLEGE_DOMAIN: domain,
                COLLEGE_CITY: city
            });
            return ([id]);
        }
    });
}
exports.createCollege = createCollege;
let findCollege = function (id, domain, city) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            let college = yield Models.COLLEGES_MOD.findByPk(id);
            return college;
        }
        let college = yield Models.USERS_MOD.findOne({ where: { COLLEGE_DOMAIN: domain, COLLEGE_CITY: city } });
        return college;
    });
};
//Colleges unsure!!!
const getCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { college_id } = req.params;
    const college = yield Models.COLLEGES_MOD.findByPk(college_id);
    res.status(200).send({
        data: {
            college: college,
            msg: "Succesful"
        }
    });
});
exports.getCollege = getCollege;
