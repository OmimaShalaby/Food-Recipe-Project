export const systemRoles = {
    SuperAdmin: "Super-Admin",
    Admin: "Admin",
    User: "User"
};

const { SuperAdmin, Admin, User } = systemRoles;

const roles = {
    USER: [User],
    USER_ADMIN: [Admin, User],
    ADMIN_SUPER_ADMIN: [SuperAdmin, Admin],
    USER_ADMIN_SUPER: [SuperAdmin, User],
    USER_ADMIN_SUPER_ADMIN: [SuperAdmin, Admin, User]
};

export default roles;