const FIRMWARE_ADMIN = 'FIRMWARE_ADMIN';
const DATA_ADMIN = 'DATA_ADMIN';
const ADMIN = 'ADMIN';


let getAdmins = function () {
    return {
        ADMIN,
        DATA_ADMIN,
        FIRMWARE_ADMIN
    };
};

let adminRoles = Object.values(getAdmins());

module.exports.isAdmin = ({user}) => user.roles.filter(function (role) {
    return adminRoles.indexOf(role) > -1;
}).length > 0;

module.exports.getAdminRoles = getAdmins;