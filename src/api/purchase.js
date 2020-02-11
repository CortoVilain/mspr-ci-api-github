const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

// Début Configuration firestore
const admin = require('firebase-admin');
const serviceAccount = require("../../keyfile.json");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://mspr-ci-database.firebaseio.com'
    });
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack);
    }
}
// Fin Configuration firestore

const db = admin.firestore();
const customersCollection = db.collection("customers");

require('dotenv').config();

module.exports = {
    getPurchasesByCustomerId: function(customer_id) {

        return new Promise((resolve, reject) => {
            
            let query = customersCollection.doc(customer_id).collection("purchases")
            
            query
                .get()
                .then(querySnapshot => {

                    if(!(querySnapshot.size == 0)) {

                        let purchases = []

                        querySnapshot
                            .forEach(doc => {

                                purchases.push({
                                    purchase_id: doc.id,
                                    product: doc.data().product,
                                    quantity: doc.data().quantity,
                                    unitPrice: doc.data().unitPrice
                                })        
                            })

                        let result = [{
                            customer_id: customer_id,
                            purchases
                        }]
                        
                        resolve(result)
                    }
                    else {
                        resolve("Aucun document")
                    }
                })
        })
        .catch(err => {
            reject(err)
        })
    },
    addPurchase: function(customer_id, product, quantity, unitPrice) {

        return new Promise((resolve, reject) => {

            let purchase = {
                date: new Date(),
                product: product,
                quantity: quantity,
                unitPrice: unitPrice
            }

            customersCollection.doc(customer_id).collection("purchases").add(purchase)
                .then(
                    resolve("Ajout de l'achat de " + quantity + " " + product + "(s) à " + unitPrice + "€ chacun")
                )
        })
        .catch(err => {
            reject(err)
        })
    }
}