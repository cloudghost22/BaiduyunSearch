module.exports = function (app) {
    app.use("/",require('./main'));
    app.use("/index",require('./main'));
    app.use("/result",require('./result'));
    app.use("/main",require('./main'));
    app.use("/pages",require('./pages'));
    app.use("/url",require('./url'));
    app.use("/hotMenu",require('./hotMenu'));
    app.use("/latestMenu",require('./latestMenu'));
    app.use("/menu",require('./menu'));
    app.use(function (req,res) {
        if(!res.headersSent){
            res.status(404).render('404');
        }
    });
};