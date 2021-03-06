
// Dependencias
const functions = require('firebase-functions');

// Servicios
const db = require('./services/db');
// const DATABASE = require('./db');
const notifications = require('./services/notifications');

// Constantes
const { COLLECTIONS, DRIVER_STATUS } = require('./constants');

/**
 * Se suscribe a la creación de un documento en la colección de Notificaciones
 */
exports.sendNotifications = functions.firestore
    .document(`${COLLECTIONS.NOTIFICATION_USER}/{userId}`)
    .onCreate((snap) => {

        // Obtiene datos de la notificación del usuario
        const notificationUser = snap.data();

        // Evalua la ciudad de origen, si no existe de lo contrario no continua
        if (!notificationUser.currentCity) { return false; }

        // Busca en la colección de Ubicación del conductor por la misma ciudad
        // de la oferta
        db.find(
            COLLECTIONS.DRIVER_LOCATION,
            {
                key: 'originCity',
                value: notificationUser.currentCity
            }
        ).then(docs => {
            if (docs.length === 0) { return false; }

            docs.forEach(doc => {
                const driverLocation = doc.data();
                if (driverLocation.status === DRIVER_STATUS.ACTIVE) {

                    // Busca el conductor que este activo por su identificador
                    db.findById(COLLECTIONS.DRIVERS, driverLocation.driverId)
                        .then(doc => {
                            const driver = doc.data();
                            if (!driver || !driver.pushToken) { return false; }
                            const notification = {
                                body: `Hay nuevo viaje de ${notificationUser.currentCity} a ${notificationUser.destinationCity}`
                            }
                            notifications.send(driver.pushToken, notification);
                        });
                }
            })
        });
    });

// TODO: nfv => Para Probar
// exports.test = functions.https.onRequest(async (req, res) => {
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const driver = await DATABASE.collection(COLLECTIONS.DRIVERS).add({ pushToken: 'ExponentPushToken[vGGlb5BKu862JvsW8F3JeS]' });
//     const driver2 = await DATABASE.collection(COLLECTIONS.DRIVERS).add({ pushToken: 'ExponentPushToken[vGGlb5BKu862JvsW8F3JeS]' });
//     await DATABASE.collection(COLLECTIONS.DRIVER_LOCATION).add({ originCity: 'Madrid', status: DRIVER_STATUS.ACTIVE, driverId: driver.id });
//     await DATABASE.collection(COLLECTIONS.DRIVER_LOCATION).add({ originCity: 'Boston', status: DRIVER_STATUS.ACTIVE, driverId: driver2.id });
//     await DATABASE.collection(COLLECTIONS.OFFERS).add({ driverId: driver.id, status: 'ACTIVE', currentCity: 'Madrid', destinationCity: 'Las Rozas' });
//     await DATABASE.collection(COLLECTIONS.OFFERS).add({ driverId: driver2.id, status: 'ACTIVE', currentCity: 'Boston', destinationCity: 'San Francisco' });
//     res.json({ result: 'DONE' });
// });
