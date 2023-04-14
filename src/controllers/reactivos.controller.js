import modelosInit from "../models/init-models.js"
import { sequelize } from "../database/database.js";
import { Op } from "sequelize";
import respuestas from "../models/respuestas.js";
let models = modelosInit(sequelize);

//obtener reactivos
export const getReactivos = async (req,res) =>{
    let response;
    try {
        response = await models.reactivos.findAll()
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response);
}
//crear reactivo
export const createReactivo = async (req,res) =>{
    let {descripcion,nombre_examen,area_id} = req.body;
    let response;
    try {
        response = await models.reactivos.create({
            descripcion:descripcion,
            nombre_examen:nombre_examen,
            area_id: area_id
        })
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(response);
}
//editar reactivo con id 
export const editarReactivo = async (req,res) =>{
    let {id} = req.params;
    let {descripcion,nombre_examen,area_id} = req.body;
    let consulta;
    try {
        consulta = await models.reactivos.findByPk(id)
        consulta.descripcion = descripcion
        consulta.nombre_examen = nombre_examen
        consulta.area_id = area_id
        //se guarda los camnios en la base
        await consulta.save()

    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    res.status(200).json(consulta);
};

//eliminar reactivo con ID
export const eliminarReactivo = async (req,res) =>{
    let {id} = req.params;
    let response;
    try {
       response = await models.reactivos.destroy({
        where:{id_reactivo:id}
       })
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }
    if (response === 1){
        response = {"Estatus": "Se elimino el registro"}
    }else{
        response = {"Estatus": "No se pudo eliminar el registro, revisa tus datos"}

    }
    res.status(200).json(response);
};

//generarExamen para ello
//01 Generar el aleatorio
//02 Obtener las respuestas
//03 Generar un objeto examen
//04 Un numero de preguntas fijo (5,10,3)
export const generarExamen = async (req,res) =>{
    let consulta;
    let numeroRandon;
    let numero_preguntas = req.params.preguntas; 
    let preguntasObtenidos = []
    try {
        consulta = await models.reactivos.findAll({
            attributes: {exclude:['id_reactivo', 'area_id']},
            include:{
                model: models.respuestas,
                as: "respuesta",
                attributes: {exclude:['id_respuesta', 'reactivo_id']}
            }
        })

        if(numero_preguntas > consulta.length){
            console.log(`No se cuentan con ${numero_preguntas} preguntas, intenta con un numero menor`)
            res.status(500).json({"Error": `No se cuenta con ${numero_preguntas} preguntas en la BDA, actualmente hay ${consulta.length} preguntas en BDA`})
            return;
        }
        for (let i = 0; i < numero_preguntas; i++) {
            numeroRandon = 0;
            numeroRandon = getRandomInt(consulta.length);
            if(typeof consulta[numeroRandon] === 'undefined'){
                i--;
            }else{
                preguntasObtenidos.push(consulta[numeroRandon]);
                delete(consulta[numeroRandon])
            }
        }
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }

    res.status(200).json(preguntasObtenidos);
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

//obtenerRespuesta
export const obtenerRespuesta = async (req,res) =>{
    let consulta;
    let {noReactivo,respuesta} = req.params;
    try {
        //para prevenir que se envie algo distinto a un numero es la api
        let noReactivEsNumero = Number(noReactivo);
        let siesnumero = noReactivEsNumero / noReactivEsNumero;
        if(siesnumero != 1){
            console.log("no es un numero")
            res.status(500).json({"Eror": "Error iserte un numero de reactivo"})
            return;
        }
        
        consulta = await models.respuestas.findAll({
            attributes: ["escorrecto"],
            where: {
                reactivo_id: noReactivo,
                descripcion:{[Op.like]: `${respuesta}%`}
            }
        })
        //validando que la consulta sea correcto consulta.length no sea vacio
        if(consulta.length <= 0 ){
            console.log("Error en la consulta, la pregunta o respuesta no es valido")
            res.status(404).json({"Error": `el reactivo ${noReactivo} no se encotra o la respuesta /${respuesta} no existe en la base`})
            return;
        }
    } catch (error) {
        console.log("Hubo un error: " + error)
        res.status(500).json({"Error": "Hubo un error, " + error})
        return;
    }

    res.status(200).json(consulta);
};