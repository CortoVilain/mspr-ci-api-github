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
    getCustomerById: function(customer_id) {

        return new Promise((resolve, reject) => {
            
            let query = customersCollection.doc(customer_id)
            
            query
                .get()
                .then(doc => {

                    if(doc.exists) {

                        let result = []

                        result.push({
                            customer_id: doc.id,
                            firstname: doc.data().firstname,
                            lastname: doc.data().lastname
                        })

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
    getCustomers: function() {

        return new Promise((resolve, reject) => {

            customersCollection
                .get()
                .then(querySnapshot => {

                    if(!(querySnapshot.size == 0)) {

                        let result = []

                        querySnapshot
                            .forEach(doc => {
                                
                                result.push({
                                    customer_id: doc.id,
                                    firstname: doc.data().firstname,
                                    lastname: doc.data().lastname
                                })
                            })
                        
                        resolve(result)
                    }
                    else {
                        resolve("Aucun client")
                    }
                })
        })
    },
    addCustomer: function(firstname, lastname) {

        return new Promise((resolve, reject) => {

            let customer = {
                firstname: firstname,
                lastname: lastname
            }

            customersCollection.add(customer)
                .then(
                    resolve("Ajout de l'utilisateur " + firstname + " " + lastname)
                )
        })
        .catch(err => {
            reject(err)
        })
    }
}