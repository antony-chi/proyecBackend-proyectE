import { Router } from "express";
import { getReactivos, createReactivo, editarReactivo, eliminarReactivo, generarExamen, obtenerRespuesta} from "../controllers/reactivos.controller.js";

const router = Router();
//CRUD 
router.post('/api/createReactivo', createReactivo)
router.get('/api/getReactivos', getReactivos)
router.put('/api/editarReactivo/:id', editarReactivo)
router.delete('/api/eliminarReactivo/:id', eliminarReactivo)

router.get('/api/generarExamen/:preguntas', generarExamen)
router.get('/api/obtenerRespuesta/:noReactivo/:respuesta', obtenerRespuesta)

export default router; 