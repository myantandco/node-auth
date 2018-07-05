let chai = require('chai');
let assert = chai.assert;

describe('module exports', async () => {

    /**
     * We want to ensure that the exported module has a consistent structure
     */
    it('has a consistent exported object structure', () => {
        let module = require('../lib');

        assert.typeOf(module, 'object');

        // Enums
        assert.typeOf(module.Roles, 'object');
        assert.typeOf(module.Scopes, 'object');
        assert.typeOf(module.ResourceActions, 'object');

        // Middleware
        assert.typeOf(module.createMiddleware, 'function');

        // Claims
        assert.typeOf(module.claims.NotAuthorized, 'function')
        assert.typeOf(module.claims.IdentityClaim, 'function')
        assert.typeOf(module.claims.GroupClaim, 'function')
        assert.typeOf(module.claims.GrantClaim, 'function')
        assert.typeOf(module.claims.UnknownClaim, 'function')
        assert.typeOf(module.claims.claimFactory, 'function')
    });
});