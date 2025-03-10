import { Router } from "express";
import * as Conts from "./Controller";
import * as Subs from "./Subscriptions";

const router= Router();

//User Management: u
router.get("/us", Conts.getListaUsuarios);
router.get("/u/:id", Conts.getUsuario); //Backend
router.put("/u", Conts.putUsuario);

//Reports Management: r
router.post("/r", Conts.postReport);

//Interests Management:
router.put("/ui", Conts.putUserInterests);
router.get("/i", Conts.getInterests);
router.get("/ui/:id", Conts.getUserInterests);

//Login and Register
router.post("/login", Conts.postLogin);
router.get("/logout", Conts.getLogOut);
router.get("/auth", Conts.getAuthenticate);
router.post("/register", Conts.postRegister);

router.post("/verify", Conts.postVerification);
router.get("/verify/:token", Conts.getVerification);
router.put("/resetp", Conts.putPasswordReset);
router.get("/resetp/:token", Conts.getPasswordReset);

//College Management: c
router.get("/c", Conts.getColleges)
router.post("/c", Conts.postColleges)

//Images WIP!!!!
router.post("/upload", Conts.postImage)
router.post("/BULK/upload", Conts.BULKTestImage)
router.put("/u/pics", Conts.putImage)
router.delete("/u/pics", Conts.deleteImage)

//Event Management: e
router.get("/e", Conts.getEvents)
router.get("/e/:id", Conts.getEvent)
router.post("/e", Conts.postEvent)
router.put("/e/:id", Conts.putEvent)

//Event Management: m
router.post("/m", Conts.postMatch)

//User Event Management: ue
router.get("/ue/myrequests", Conts.getMyApplications)
router.post("/ue.us/", Conts.postRequestEvent)
router.post('/ue.ad/req', Conts.postRequestAdmin)
router.get('/ue.ad/my-events', Conts.getUEventsAdmin)
router.get('/ue.us/my-events', Conts.getUEvents)
router.get('/ue.us/attendees/:event', Conts.getUEventAttendees)
router.get('/ue.ad/requests/:event', Conts.getUEReqsAdmin)

//Mercadopago suscription management: 
//router.post("/payment", Conts.postPaySuscription)

//Schedules manegement
router.get("/sch/:id", Conts.getUserSchedule);
router.put("/sch/:id", Conts.putUserSchedule);

//Subscriptions manegement
router.post("/sub", Subs.createSubscription);
router.post("/sub", Subs.createSubscription);
router.get("/plan", Subs.getPlan);
router.post("/webhook", Subs.receiveWebhook);

export default router;
