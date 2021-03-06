/**
 * Principales operaciones base de datos
 */

// Conexión base de datos
const db = require('../db');

const services = {
    /**
     * Consulta por un campo
     * @param {String} collectionName Nombre de la colección
     * @param {Object} filter         Filtro de busqueda
     */
    find: (collectionName, filter) => {
        const collection = db.collection(collectionName);
        const { key, value, operator = '==' } = filter;
        const query = collection.where(key, operator, value).get();
        return query.then((snapshot) => {
            if (snapshot.empty) {
                return [];
            }
            return snapshot.docs;
        });
    },
    /**
     * Consulta por identificador principal
     * @param {String} collectionName Nombre de la colección
     * @param {String} id             Identificador
     */
    findById: (collectionName, id) => {
        return db.collection(collectionName).doc(id).get()
    }
};

module.exports = services;