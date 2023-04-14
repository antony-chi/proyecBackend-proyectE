import { sequelize } from "./database/database.js";
import express from "express";
//importamos las rutas
import rutas from "./routes/reactivos.routes.js";
import examenRutas from "./routes/examen.routes.js"

async function main(){
    try {
        await sequelize.sync({force:false})
        await sequelize.authenticate()
        console.log("conexion a la base exitosa")
    } catch (error) {
        console.log("No se pudo conectar a la base")
        return;
    }

    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended:false}));
    app.use(rutas);
    //insertamos las rutas de examenes 
    app.use(examenRutas)
    app.listen(3000);

    console.log("El servidor escucha en el puerto 3000")
}

//llamanos a la funcion main()
main();