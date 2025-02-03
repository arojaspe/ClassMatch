import { Router } from "express";
import * as Conts from "./Controller";

const router= Router();

//User Management: u
router.get("/us", Conts.getListaUsuarios);
router.get("/u/:id", Conts.getUsuario); //Backend
router.put("/u", Conts.putUsuario);

//Login and Register
router.post("/login", Conts.postLogin);
router.get("/logout", Conts.getLogOut);
router.get("/auth", Conts.getAuthenticate);
router.post("/register", Conts.postRegister);

//College Management: c
router.get("/c", Conts.getColleges)
router.post("/c", Conts.postColleges)

//Images WIP!!!!
router.post("/upload", Conts.postImage)

export default router;