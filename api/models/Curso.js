/**
 * Curso.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Codigo de curso.
     */
    codigo: {type: "number"},

    /**
     * Nombre.
     */
    nombre: {type: "string"},

    /**
     * URL imagen del curso.
     */
    img: {type: "string"},

    /**
     * Codigo de la Unidad Academica.
     */
    UA: {type: "string"},

    /**
     * Nombre de la Unidad Academica
     */
    nombreUA: {type: "string"},

    /**
     * Fecha de inicio del curso.
     */
    inicio: {type: "string"},

    /**
     * Fecha de finalizacion del curso.
     */
    fin: {type: "string"},

    /**
     * Categoria del curso.
     * Docentes ucc/graduados ucc/publico gral/etc..
     */
    categoria: {type: "string"},

    /**
     * Estado de vigencia.
     * Ej: vigente, cancelado, recargado, etc..
     */
    vigente: {type: "string"},

    /**
     * Estado general.
     * Ej: iniciado, terminado
     */
    estado: {type: "string"},

    /**
     * Cupo maximo de inscriptos.
     */
    cupoMax: {type: "number"},

    /**
     * Cantidad de horas de duracion.
     */
    cantHoras: {type: "number"},

    /**
     * Alumnos inscriptos.
     */
    alumnos: {
      collection: "alumno",
      via: "curso",
      through: "alumnoporcurso"
    },

    /**
     * Docentes que participan.
     */
    docentes: {
      collection: "docente",
      via: "curso",
      through: "docenteporcurso"
    }
  },

};

