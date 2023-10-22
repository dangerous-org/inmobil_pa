import mysql from 'mysql2/promise'

const conn = mysql.createPool({
    host : 'containers-us-west-165.railway.app',
    port : '5604',
    database : 'railway',
    user : 'root',
    password : 'fOQBLtn2kiKNQOGkW5Iy'
});

    export default conn;