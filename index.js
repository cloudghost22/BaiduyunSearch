/**
 * Created by lwy on 2017-04-21.
 */

let express = require('express');
let config = require('./config/default');
let pkg = require('./package.json');
let routes = require('./routers');
let path = require('path');
let app = express();


// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'pug');
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

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