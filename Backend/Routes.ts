import { Router } from "express";
import * as Conts from "./Controller";

const router= Router();

//User Management: u
router.get("/us", Conts.getListaUsuarios);
router.get("/u/:id", Conts.getUsuario); //Backend
router.post("/u/:id", Conts.postUsuario);
router.put("/u", Conts.putUsuario);

//Profiles: p
router.get("/p", Conts.getUsuario);

//Login and Register
router.post("/login", Conts.postLogin);
router.post("/logout", Conts.postLogOut);
router.get("/auth", Conts.getAuthenticate);
router.post("/register", Conts.postRegister);

//College Management: c
router.get("/c", Conts.getColleges)
router.post("/c", Conts.postColleges)

//Images WIP!!!!
router.post("/upload", Conts.postImage)

export default router;