import { Router } from "express";
import * as Conts from "./Controller";

const router= Router();

//User Management
router.put("/user/:id", Conts.putUsuario);

//Login and Register
router.post("/login", Conts.postLogin);
router.post("/logout", Conts.postLogOut);
router.get("/auth", Conts.getAuthenticate);
router.post("/refresh", Conts.postRefreshToken);
router.post("/register", Conts.postRegister);

//Images
router.get("/colleges", Conts.getColleges)

export default router;