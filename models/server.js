import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import conn from "../database/dbConnection.js"
import authRouter from "../routes/auth.routes.js";
import accountRouter from "../routes/account.routes.js";
import postRouter from "../routes/post.routes.js"


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
        this.app.use(this.path, authRouter)
        this.app.use(this.path, accountRouter)
        this.app.use(this.path, postRouter)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo con exito', this.port);
        })
    }

}
