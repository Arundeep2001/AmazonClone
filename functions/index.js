/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
const stripe= require("stripe")('sk_test_51NZWXwSFBwiTvzetmsm7emWZH0l9Yb9BT7bdaoW37xt1ETzUVwwRmwd5BCZgcl2LU2rK83SWHWwxkMSodLL8MX6L00678uimf6');

//API


//App config
const app = express();

//Middlewares
app.use(cors({origin: true}));
app.use(express.json());

//API routes
app.get('/', (request,response)=>response.status(200).send('Hello world'));

app.post('/payments/create', async (request,response)=>{
    const total = request.query.total;

    console.log('Payment request received for this amount >>>', total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency:"inr",
        payment_method_types: ['card'],
    });

    response.status(201).json({
        clientSecret: paymentIntent.client_secret,
    });
})

//Listener command
exports.api = functions.https.onRequest(app);

