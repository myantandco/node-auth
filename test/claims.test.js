let { assert } = require('chai')

let { NotAuthorized, IdentityClaim, GroupClaim, GrantClaim, UnknownClaim, claimFactory } = require('../lib/claims')
let { Scopes, ResourceActions } = require('../lib')


describe('claims', function() {
    describe('identity', function () {
        it('should reject access, not the resource owner', function () {
            let claim = new IdentityClaim({
                user: {id: 1234, roles: []}
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 5678
                }),
                NotAuthorized
            )
        })

        it('should allow read/write access, resource owner', function () {
            let claim = new IdentityClaim({
                user: {id: 1234, roles: []}
            })

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 1234
                })
            )

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 1234,
                    action: ResourceActions.WRITE
                })
            )
        })

        it('should allow read/write access, admin', function () {
            let claim = new IdentityClaim({
                user: {id: 1234, roles: ['ADMIN']}
            })

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 5678
                })
            )

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 5678,
                    action: ResourceActions.WRITE
                })
            )
        })

        it('should allow readonly access, data admin', function () {
            let claim = new IdentityClaim({
                user: {id: 1234, roles: ['DATA_ADMIN']}
            })

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 5678
                })
            )

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 5678,
                    action: ResourceActions.WRITE
                }),
                NotAuthorized
            )
        })
    })

    describe('group', function() {
        it('should reject access, group doesn\'t include resource owner', function() {
            let claim = new GroupClaim({
                user: {id: 1},
                group: {
                    id: 1234,
                    users: [2, 3, 4],
                    scopes: [Scopes.PUBLIC_PROFILE]
                }
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 5,
                    scope: Scopes.PUBLIC_PROFILE
                }),
                NotAuthorized
            )
        })

        it('should reject access, group doesn\'t include the requested scope', function() {
            let claim = new GroupClaim({
                user: {id: 1},
                group: {
                    id: 1234,
                    users: [2, 3, 4],
                    scopes: [Scopes.HEART_RATE]
                }
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 2,
                    scope: Scopes.PUBLIC_PROFILE
                }),
                NotAuthorized
            )
        })

        it('should reject access, groups only give readonly permissions', function() {
            let claim = new GroupClaim({
                user: {id: 1},
                group: {
                    id: 1234,
                    users: [2, 3, 4],
                    scopes: [Scopes.PUBLIC_PROFILE]
                }
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 2,
                    scope: Scopes.PUBLIC_PROFILE,
                    action: ResourceActions.WRITE
                }),
                NotAuthorized
            )
        })

        it('should allow readonly access', function() {
            let claim = new GroupClaim({
                user: {id: 1},
                group: {
                    id: 1234,
                    users: [2, 3, 4],
                    scopes: [Scopes.PUBLIC_PROFILE]
                }
            })

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 2,
                    scope: Scopes.PUBLIC_PROFILE
                })
            )
        })
    })

    describe('grant', function() {
        it('should reject access, grant is for another resource owner', function() {
            let claim = new GrantClaim({
                owner: {id: 1},
                client: {id: 2},
                scopes: [Scopes.PUBLIC_PROFILE]
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 3,
                    scope: Scopes.PUBLIC_PROFILE
                }),
                NotAuthorized
            )
        })

        it('should reject access, grant is for another scope', function() {
            let claim = new GrantClaim({
                owner: {id: 1},
                client: {id: 2},
                scopes: [Scopes.HEART_RATE]
            })

            assert.throws(
                () => claim.assertPermission({
                    resourceOwner: 1,
                    scope: Scopes.PUBLIC_PROFILE
                }),
                NotAuthorized
            )
        })

        it('should allow access', function() {
            let claim = new GrantClaim({
                owner: {id: 1},
                client: {id: 2},
                scopes: [Scopes.PUBLIC_PROFILE]
            })

            assert.isUndefined(
                claim.assertPermission({
                    resourceOwner: 1,
                    scope: Scopes.PUBLIC_PROFILE
                })
            )
        })
    })

    describe('factory', function () {
        it('should return an identity claim', function () {
            assert.instanceOf(
                claimFactory({type: 'identity'}),
                IdentityClaim
            )
        })

        it('should return a group claim', function () {
            assert.instanceOf(
                claimFactory({type: 'group'}),
                GroupClaim
            )
        })

        it('should return a grant claim', function () {
            assert.instanceOf(
                claimFactory({type: 'grant'}),
                GrantClaim
            )
        })

        it('should return an unknown claim, missing type', function () {
            assert.instanceOf(
                claimFactory({}),
                UnknownClaim
            )
        })

        it('should return an unknown claim, invalid type', function () {
            assert.instanceOf(
                claimFactory({type: 'foobar'}),
                UnknownClaim
            )
        })
    })
})