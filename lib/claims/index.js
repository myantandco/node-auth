let ResourceActions = require('../constants/resource-actions')
let Roles = require('../constants/roles')


function NotAuthorized(message) {
    this.name = 'NotAuthorized'
    this.message = message
    this.stack = (new Error()).stack
}
NotAuthorized.prototype = new Error


function IdentityClaim({user}) {
    this.user = user
}
IdentityClaim.prototype.assertPermission = function({resourceOwner, scope, action=ResourceActions.READ}) {
    if (resourceOwner === this.user.id) {
        return
    }
    if (this.user.roles.includes('ADMIN')) {
        return
    }
    if (this.user.roles.includes('DATA_ADMIN') && action === ResourceActions.READ) {
        return
    }
    throw new NotAuthorized(``)
}


function GrantClaim({owner, client, scopes}) {
    this.owner = owner
    this.client = client
    this.scopes = scopes
}
GrantClaim.prototype.assertPermission = function({resourceOwner, scope, action=ResourceActions.READ}) {
    if (resourceOwner !== this.owner.id) {
        throw new NotAuthorized(``)
    }
    if (!this.scopes.includes(scope)) {
        throw new NotAuthorized(``)
    }
}


function GroupClaim({user, group}) {
    this.user = user
    this.group = group
}
GroupClaim.prototype.assertPermission = function({resourceOwner, scope, action=ResourceActions.READ}) {
    if (!this.group.users.includes(resourceOwner)) {
        throw new NotAuthorized(``)
    }
    if (!this.group.scopes.includes(scope)) {
        throw new NotAuthorized(``)
    }
    if (action === ResourceActions.WRITE) {
        throw new NotAuthorized(``)
    }
}


function UnknownClaim() {}
UnknownClaim.prototype.assertPermission = function () {
    throw new NotAuthorized(``)
}


function claimFactory(claims) {
    switch (claims.type) {
        case 'identity':
            return new IdentityClaim(claims)
        case 'group':
            return new GroupClaim(claims)
        case 'grant':
            return new GrantClaim(claims)
        default:
            return new UnknownClaim()
    }
}


module.exports = {
    NotAuthorized,
    IdentityClaim,
    GrantClaim,
    GroupClaim,
    UnknownClaim,
    claimFactory
}
