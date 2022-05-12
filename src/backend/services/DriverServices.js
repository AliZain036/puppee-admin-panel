
import { db } from '../firebase';
import { Brand } from '../models/brand';

export const getDrivers = async function () {
    const query = await db.collection('Driver').get();

    let Drivers = [];

    query.docs.forEach((doc) => {
            Drivers.push(doc.data());
    });

    return Drivers;
};

export const addBrand = async function (data) {
    await db.collection('Driver').add(data);
};

export const deleteDriver = async function (id) {
    await db.collection('Driver').doc(id).delete();
};

export const updateBrand = async function (id, data) {
    await db.collection('Driver').doc(id).set(data, { merge: true });
};

export const getDriverById = async function (id) {
    const query = await db.collection('Driver').doc(id).get();
    return query.data();
};