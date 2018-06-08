'use strict';

/**
 * Created by mvezina on 2018-05-31
 * This module provides utilities as well as express middleware to verify (and perform other functionality) on
 * JWT tokens passed between Myant services
 */

let jwt = require('jsonwebtoken');


/**
 * Takes in a JWT token, and ensures it is consistently formatted
 * @param claims The JWT token
 */
function processAuthzToken(claims) {

    if(!claims)
        return {};

    let user = claims.user;

    // Verify the user object
    if(!user)
        throw {clientMessage: "JWT is missing 'user'"};

    if(!user.id)
        throw {clientMessage: "JWT is missing 'user.id'"};

    if(!user.roles)
        user.roles = [];

    return claims;
}

/**
 * Creates a JSON String that conforms to GraphQL's format for displaying error messages.
 */
function createGraphQlError(message)
{
    return JSON.stringify({errors: [{message}]});
}

function createJwtAuthMiddleware({config}) {
    if(!config.jwt || !config.jwt.secret)
        throw new Error("Invalid configuration object. Failed to create JWT middleware");

    return function (req, res, next) {

        let authzHeader = req.header('Authorization');

        // Since there is no authorization header, there are no claims to set
        if (!authzHeader) {
            res.locals.claims = {};
            return next()
        }

        let splitHeaderArr = authzHeader.split(' ');

        if (splitHeaderArr.length !== 2) {
            console.error("Invalid Auth header");
            return res.status(200).send(createGraphQlError("Invalid Authorization Header"));
        }

        // Split Authorization header into variables
        let authType = splitHeaderArr[0];
        let tokenString = splitHeaderArr[1];

        if (authType !== 'Bearer') {
            console.error("Authorization type was not 'Bearer'");
            return res.status(200).send(createGraphQlError('Authorization type must be Bearer'));
        }

        try {

            // Verify the token and set the claims if the token can be verified
            let authzToken = jwt.verify(tokenString, config.jwt.secret);
            res.locals.claims = processAuthzToken(authzToken);
            return next();
        } catch (err) {
            // Display an error message to the client if one has been defined
            let clientMessage = err && err.clientMessage;

            console.log("There was an error while verifying the token: " + tokenString);
            console.error(err);

            // Return a graphql error
            return res.status(200).send(createGraphQlError('Failed to authenticate. Invalid JWT.' + (clientMessage ? ` Reason: ${clientMessage}` : "")));
        }
    }
}


/**
 * Creates express middleware using config.
 * Middleware function for JWT auth will be returned
 * @param config The loaded configuration object
 */
module.exports = function ({config}) {
    if (!config)
        throw new Error("Invalid configuration object. Failed to create middleware");

    return createJwtAuthMiddleware({config});
};