import { Router } from "express";
import * as Conts from "./Controller";

const router= Router();

//User Management
router.get("/us", Conts.getListaUsuarios);
router.get("/u/:id", Conts.getUsuario);
router.post("/u/:id", Conts.postUsuario);
router.put("/u/:id", Conts.putUsuario);

//Profiles
router.get("/profiles", Conts.getUsuario);

//Login and Register
router.post("/login", Conts.postLogin);
router.post("/logout", Conts.postLogOut);
router.get("/auth", Conts.getAuthenticate);
router.post("/refresh", Conts.postRefreshToken);
router.post("/register", Conts.postRegister);

//College Management
router.get("/colleges", Conts.getColleges)

//Images WIP!!!!
//router.get("/u/pics", Conts.getUserImages)

export default router;