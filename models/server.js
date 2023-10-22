import express from "express";
import cors from "cors"
import conn from "../database/dbConnection.js"

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = '/inmobil/';
        this.middleware();
        this.database();
    }


    middleware() {
        this.app.use(express.static('public'));
        this.app.use(express.json());
        this.app.use(cors());
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

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo con exito');
        })
    }

}

export {
    Server
}