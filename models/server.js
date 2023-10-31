import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload";
import conn from "../database/dbConnection.js"
import authRouter from "../routes/auth.routes.js";
import accountRouter from "../routes/account.routes.js";
import postRouter from "../routes/post.routes.js"
import profileRouter from "../routes/profiles.routes.js";


export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = '/api';
        this.middleware();
        this.database();
        this.routers();
    }

    middleware() {
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.urlencoded({
            extended : false
        }));
        this.app.use(cookieParser());
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : './uploads'
        }));
    }

    async database() {
        await conn.getConnection()
            .then(connetion => {
                console.log('Conexion exitosa a la base de datos');
                connetion.release();
            }).catch((err) => {
                console.log(err, 'No se ha podido establecer la conexion con la base de datos')
            }
            );
    }

    routers(){
        this.app.use(this.path, authRouter);
        this.app.use(this.path, accountRouter);
        this.app.use(this.path, postRouter);
        this.app.use(this.path, profileRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo con exito', this.port);
        })
    }

}
