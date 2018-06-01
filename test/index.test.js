let chai = require('chai');
let index = require('../lib/index');
let assert = chai.assert;

describe('module exports', async () => {

    /**
     * We want to ensure that the exported module has a consistent structure
     */
    it('has a consistent exported object structure', async () => {
        assert.typeOf(index, 'object');

        // Utilities
        assert.typeOf(index.utils, 'object');
        assert.typeOf(index.utils.isAdmin, 'function');

        // Middleware
        assert.typeOf(index.createMiddleware, 'function');
    });
});