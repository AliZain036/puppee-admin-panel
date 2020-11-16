
import { db } from '../firebase';
import { Event } from '../models/event';

export const getEvents = async function () {
    const query = await db.collection('promoOffers').get();

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

export const addEvent = async function (data) {
    await db.collection('Events').add(data);
};

export const deleteEvent = async function (id) {
    await db.collection('Events').doc(id).delete();
};

export const updateEvent = async function (id, data) {
    await db.collection('promoOffers').doc(id).set(data, { merge: true });
};

export const getEventById = async function (id) {
    const query = await db.collection('Events').doc(id).get();
    return Event.fromFirestore(query);
};