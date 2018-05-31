import {loadConfig} from '../../../../config/index';
import {createJwtAuthz} from '../../../middleware/jwt-authz';
import {createRequest, createResponse} from 'node-mocks-http'
import chai from 'chai';

let assert = chai.assert;
let config = loadConfig();
let verifyJwt = createJwtAuthz({config});
let jwt = require('jsonwebtoken');
let _ = require('lodash');

let payload = {
    "user": {
        "id": 1,
        "roles": ['ADMIN']
    },
    "permissions": {},
    "iat": 1496757187,
    "exp": 1600000000
};
let jwtToken = jwt.sign(payload, config.jwt.secret);
let validReqOpts;

describe('integration::validate JWT', function () {
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
        verifyJwt(request, response, null);
        assert.deepStrictEqual(response.locals.claims, payload)
    });

    let invalidRequests = [
        // {reqChange:["headers", {}]}, // TODO uncomment when authz fully on
        {reqChange: ["headers", {Authorization: "adsf"}]},
        {reqChange: ["headers", {Authorization: "Bearer BADTOKEN"}]},
    ];

    invalidRequests.forEach((test) => {
        it('should not allow ' + test.reqChange[0] + ' of ' + JSON.stringify(test.reqChange[1]), () => {
            let modifiedOpts = _.cloneDeep(validReqOpts);
            modifiedOpts[test.reqChange[0]] = test.reqChange[1];
            let request = createRequest(modifiedOpts);
            let response = createResponse();
            verifyJwt(request, response, null);
            assert.equal(response.statusCode, 401)
        })
    })
});