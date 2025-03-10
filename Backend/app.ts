import express from "express";
import cors from "cors";
const app = express();

app.use(cors({ origin: "https://www.classmatch.site", credentials: true }));
app.use(express.json());

app.listen(5000, () => {
    console.log("Servidor backend corriendo en el puerto 5000");
});