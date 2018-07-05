module.exports = {
    claims: require('./claims'),
    createJwtMiddleware: require('./middleware/jwt-auth'),
    Roles: require('./constants/roles'),
    Scopes: require('./constants/scopes'),
    ResourceActions: require('./constants/resource-actions')
}
