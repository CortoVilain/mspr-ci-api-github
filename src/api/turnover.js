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
    getTurnovers: function() {

        return new Promise((resolve, reject) => {
            
            customersCollection
                .get()
                .then(querySnapshot => {

                    if(!(querySnapshot.size == 0)) {

                        let turnoverht = 0
                        let index = 0

                        querySnapshot
                            .forEach(async doc => {

                                if(doc.exists){

                                    let queryPurchases = customersCollection.doc(doc.id).collection("purchases")

                                    await queryPurchases
                                        .get()
                                        .then(querySnapshotPurchase => {

                                            if(!(querySnapshotPurchase.size == 0)) {

                                                querySnapshotPurchase
                                                    .forEach(purchase => {

                                                        let quantity = purchase.data().quantity
                                                        let unitPrice = purchase.data().unitPrice
                                                        
                                                        turnoverht += quantity * unitPrice
                                                    })
                                            }
                                        })
                                    
                                    index++

                                    if(querySnapshot.size == index) {

                                        
                                        let turnoverttc = parseFloat((turnoverht * 1.2).toFixed(2))
                                            
                                        let result = [{
                                            "turnoverht": turnoverht,
                                            "turnoverttc": turnoverttc
                                        }]
                                        
                                        resolve(result)
                                    }
                                }
                            })
                    }
                    else {
                        resolve("Aucun document")
                    }
                })
        })
        .catch(err => {
            reject(err)
        })
    }
}