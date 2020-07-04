const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Joi = require('joi');

admin.initializeApp();

exports.subscriptions = functions.region('europe-west1').https.onRequest(function(request, response) {
  // STEP: Validation
  const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
  });
  
  const { error, value } = Joi.validate(
    request.body, 
    schema, 
    { stripUnknown: true }
  );

  if (error) {
    return response.status(422).send({message: error.details[0].message});
  }

  // STEP: Record creation
  const database = admin.firestore();
  return database.collection('subscriptions')
    .add(value)
    .then(() => response.status(200).end());
});

