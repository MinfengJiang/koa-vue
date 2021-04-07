const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

const {
    mongoURI
} = require('./config/key');

const passport = require('koa-passport');

/**
*开发阶段的临时配置
*/
let devConfig = (app)=>{
    if (process.env.NODE_ENV === 'production'){
        console.log(process.env.NODE_ENV);
        return;
    }
    //开发环境下，允许跨域请求。
    //注意：跨域请求开启必须放在route配置之前！！！
    app.use(cors({
        origin: function (ctx) { //设置允许来自指定域名请求
            // if (ctx.url === '/test') {
            //     return '*'; // 允许来自所有域名请求
            // }
            return ctx.header.origin; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    }));
};

const user = require('./routes/api/user');
const redfish = require('./routes/api/redfish');

const app = new Koa();
const router = new Router();
app.use(bodyParser());

devConfig(app);

const port = process.env.PORT || 8080;

// require('./config/passport')(passport);

//connect mongodb
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('mongodb connected!');
}).catch((err) => {
    console.log(err);
});

//config router links
router.use("/api/user", user);
router.use("/redfish/v1", redfish);

//config router
router.get('/', async (ctx, next) => {
    ctx.body = 'hello world'
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`server started on:${port}`)
});