/**
 * requireSuperAdmin middleware
 * Use AFTER the main `auth` middleware.
 * Rejects the request if the authenticated admin is not a superadmin.
 */
const requireSuperAdmin = (req, res, next) => {
    // req.user is set by the auth middleware
    if (!req.user || !req.user.admin) {
        return res.status(401).json({ msg: 'Admin authentication required.' });
    }

    if (req.user.admin.role !== 'superadmin') {
        return res.status(403).json({
            msg: 'Access denied. Super Admin privileges required for this action.'
        });
    }

    next();
};

module.exports = requireSuperAdmin;
