const Router = require('koa-router');
const {
    find
} = require('../../models/User');
const router = new Router();

/**
 * @route GET /redfish/v1/AccountService/Accounts
 * @desc Accounts
 * @access private
 */
 router.get('/AccountService/Accounts/admin', ctx => {
    ctx.status = 200;
    ctx.body = {
        message: 'success',
        PasswordChangeRequired: false,
    }
});

module.exports = router.routes();