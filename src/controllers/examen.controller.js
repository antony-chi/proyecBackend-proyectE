import modelosInit from "../models/init-models.js"
import { sequelize } from "../database/database.js";
import { Op } from "sequelize";
import reactivos from "../models/reactivos.js";
let models = modelosInit(sequelize);

//obtener infor de examenes contestados
export const getExamenes = async (req,res) =>{
    let response;
    try {
        response = await models.examenes.findAll({
            attributes:{exclude:['id_examen','usuario_id','area_id']},
            include: {
                model: models.usuarios,
                as: "usuario",
                attributes: {exclude:['id_usuario']}
            }
        })
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response);
}
//crear registro nuevo de examen respondido
export const createExamen = async (req,res) =>{
    let {noreactivos,aciertos,tiempo,usuario_id,area_id} = req.body;
    let response;
    //inicializamos fecha_examen para pasarla el metodo newDate y nos tome la fecha actual del sistema. sin necesidad de escribirlo manualmente en el JSON
    let fecha_examen = new Date();

    if(aciertos > noreactivos){
        console.log("aciertos no puede ser mayor a noreactivos")
        res.status(400).json({"Estatus":"El numero de aciertos no puede ser mayor al numero de reactivo"})
        return;
    }
    try {
        response = await models.examenes.create({
            noreactivos,
            aciertos,
            fecha_examen,
            tiempo,
            usuario_id,
            area_id
        })
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response);
}

//crear registro de respuestas usuario
export const respuestas_usuarios = async (req,res) =>{
    let {examen_id,usuario_id,respuestas} = req.body;
    let response;
    
    if( examen_id === undefined || examen_id[0] === undefined){
        console.log("Hubo un error: examen_id esta indefined en el body JSON")
        res.status(500).json({"Error": `"examen_id" no esta difinido en el body.json, ${examen_id}`})
        return;
    }else if(usuario_id === undefined || usuario_id[0] === undefined){
        console.log("Hubo un error: usuario_id esta indefined en el body JSON")
        res.status(500).json({"Error": `"usuario_id" no esta difinido en el body.json, ${usuario_id}`})
        return;
    }else if(respuestas === undefined || respuestas.length < 1){
        console.log("Hubo un error: respuestas undefined en el body JSON")
        res.status(500).json({"Error": `"respuestas" no esta difinido en el bode.json, ${respuestas}`})
        return;
    }
    try {
        /*respuestas.forEach( async (element) => {
            response = await models.respuestas_usuarios.create({
                respuesta: element.respuesta,
                usuario_id,
                examen_id,
                reactivo_id: element.reactivo_id
            })
        });*/
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    console.log("respuestas_usuarios se registo con exito")
    res.status(200).json(response);
}