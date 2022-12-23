import express from "express";
import cors from "cors";
import ejs from "ejs"
import {data} from "./src/bot";
import routes from "./src/routes";

const app = express()

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/files', express.static('public'));
app.use(routes)


app.get("/", (req, res) => {
    res.render('index', data)
})

export default app;


