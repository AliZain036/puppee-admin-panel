
import { db } from '../firebase';
import { Brand } from '../models/brand';

export const getCards = async function () {
    const query = await db.collection('giftCard').get();

    let Drivers = [];

    query.docs.forEach((doc) => {
        // const brand = Brand.fromFirestore(doc);
        // if (brand) {
            Drivers.push(doc.data());
        // }
    });
    console.log('giftCard', Drivers);

    return Drivers;
};

export const addBrand = async function (data) {
    await db.collection('giftCard').add(data);
};

export const deleteUser = async function (id) {
    await db.collection('giftCard').doc(id).delete();
};

export const updateBrand = async function (id, data) {
    await db.collection('giftCard').doc(id).set(data, { merge: true });
};

export const getgiftCardById = async function (id) {
    const query = await db.collection('giftCard').doc(id).get();
    return query.data();
};