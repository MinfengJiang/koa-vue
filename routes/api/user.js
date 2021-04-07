const Router = require('koa-router');
const {
    find
} = require('../../models/User');
const router = new Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const passport = require('../../config/passport');

const {
    secretOrKey
} = require('../../config/key');

/**
 * @route GET api/user/test
 * @desc test
 * @access public
 */
router.get('/test', ctx => {
    ctx.status = 200;
    ctx.body = 'user page'
});

/**
 * @route POST api/user/register
 * @desc register
 * @access public
 */
router.post('/register', async ctx => {
    const {
        name,
        email,
        password
    } = ctx.request.body;

    const findResult = await User.find({
        email: email
    });

    if (findResult.length > 0) {
        ctx.status = 500;
        ctx.body = "invaild email!"
    } else {
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const newUser = new User({
            name,
            email,
            avatar,
            password
        });

        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
            })
        })

        await newUser.save().then(user => {
            ctx.body = user;
        }).catch(err => {
            console.log(err);
        });

        ctx.body = newUser;
    }
});

/**
 * @route POST api/user/login
 * @desc login
 * @access private
 */
router.post('/login', async ctx => {
    const {
        data
    } = ctx.request.body;
    const email = data[0];
    const password = data[1];
    let findResult = await User.find({
        name: email
    });
    let user = findResult[0];
    if (findResult.length === 0) {
        ctx.status = 404;
        ctx.body = 'invaild email!';
    } else {
        let result = await bcrypt.compareSync(password, user.password);
        let payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        };
        let token = jwt.sign(payload, secretOrKey, {
            expiresIn: 3600
        });
        
        // set result true
        result = true;
        
        if (result) {
            ctx.status = 200;
            ctx.body = {
                message: 'success',
                token: "Bearer " + token
            }
        } else {
            ctx.status = 400;
            ctx.body = {
                message: 'invaild password!',
                token: "Bearer " + token
            }
        }
    }
});

module.exports = router.routes();