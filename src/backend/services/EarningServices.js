
import { db } from '../firebase';
import { Brand } from '../models/brand';

export const getEarning = async function () {
    const query = await db.collection('Delivery').get();

    let Drivers = [];

    query.docs.forEach((doc) => {
            Drivers.push(doc.data());
    });

    return Drivers;
};

export const addBrand = async function (data) {
    await db.collection('Users').add(data);
};

export const deleteUser = async function (id) {
    await db.collection('Users').doc(id).delete();
};

export const updateBrand = async function (id, data) {
    await db.collection('Users').doc(id).set(data, { merge: true });
};

export const getUsersById = async function (id) {
    const query = await db.collection('Users').doc(id).get();
    return query.data();
};