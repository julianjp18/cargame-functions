/**
 * Servicios de notificaciones
 */

//  Dependencias
const fetch = require('node-fetch');

// Endpoint de notificaciones
const URL = 'https://exp.host/--/api/v2/push/send'
const headers = {
    'Content-Type': 'application/json'
};

const services = {
    send: (token, data) => {

        const { title = 'Cargame', body } = data;
        const params = {
            to: token,
            sound: 'default',
            title,
            body
        };
        return fetch(URL, {
            method: 'post',
            body: JSON.stringify(params),
            headers
        })
    }
};

module.exports = services;