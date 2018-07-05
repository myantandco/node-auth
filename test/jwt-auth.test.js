let {createJwtMiddleware} = require('../lib/index');
let {createRequest, createResponse} = require('node-mocks-http');
let jwt = require('jsonwebtoken');
let chai = require('chai');
let assert = chai.assert;
let _ = require('lodash');

let jwtSecret = 'abc123';

let verifyJwt = createJwtMiddleware({jwtSecret});

let payload = {
    "user": {
        "id": 1,
        "roles": ['ADMIN']
    },
    "permissions": {},
    "iat": 1496757187,
    "exp": 1600000000
};

let jwtToken = jwt.sign(payload, jwtSecret);
let validReqOpts;

let next = () => { /* do nothing */ };

describe('validate JWT', function () {
    beforeEach(function () {
        validReqOpts = {
            method: 'GET',
            url: '/graphql',
            headers: {
                Authorization: 'Bearer ' + jwtToken
            }
        }
    });
    it('attaches the payload to the request for a valid jwt', function () {
        let request = createRequest(validReqOpts);
        let response = createResponse();
        verifyJwt(request, response, next);
        assert.deepStrictEqual(response.locals.claims, payload)
    });

    let invalidRequests = [
        // {reqChange:["headers", {}]}, // TODO uncomment when authz fully on
        {reqChange: ["headers", {Authorization: "adsf"}]},
        {reqChange: ["headers", {Authorization: "Bearer BADTOKEN"}]},
        {reqChange: ["headers", {Authorization: `Bearer ${jwt.sign({foo: 'bar'}, 'BADSECRET')}`}]},
    ];

    invalidRequests.forEach((test) => {
        it('should not allow ' + test.reqChange[0] + ' of ' + JSON.stringify(test.reqChange[1]), () => {
            let modifiedOpts = _.cloneDeep(validReqOpts);
            modifiedOpts[test.reqChange[0]] = test.reqChange[1];
            let request = createRequest(modifiedOpts);
            let response = createResponse();
            verifyJwt(request, response, next);
            assert.equal(response.statusCode, 401);
        })
    })
});