
import { db } from '../firebase';
import {TermsofService} from "../models/termsOfService"


export const getTerms = async function () {
    const query = await db.collection('privacypolicy').doc("rL7zXpzNd2ZqcxwKEc2o").get();
    return query.data();
};

export const addTerms = async function (data) {
    await db.collection('Terms').add(data);
};

export const deleteTerms = async function (id) {
    await db.collection('Terms').doc(id).delete();
};

export const updateTerms = async function (data) {
    await db.collection('privacypolicy').doc("rL7zXpzNd2ZqcxwKEc2o").set(data, { merge: true });
};
