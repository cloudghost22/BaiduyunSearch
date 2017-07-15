/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let config = require('./config/default');
let pkg = require('./package.json');
let routes = require('./routers');
let path = require('path');
let app = express();
let session = require('express-session');


// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'pug');
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: false,
    saveUninitialized:true,
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    }
}));

//设置模板全局常量
app.locals.search = {
    title:pkg.name,
    description:pkg.description
};

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    // uploadDir:path.join(__dirname,'public/images'),
    keepExtensions:true
}));

// 路由
routes(app);

// error page
app.use(function (err,req,res,next) {
    res.render('error',{
        error:err
    });
});


// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
});