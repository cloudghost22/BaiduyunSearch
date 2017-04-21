/**
 * Created by lwy on 2017-04-21.
 */
module.exports = function (app) {
/*    app.get("/",function (req,res) {
        res.redirect("/main");
    });*/
    app.use("/",require('./main'));
    app.use("/result",require('./result'));
    app.use("/main",require('./main'));
    app.use(function (req,res) {
        if(!res.headersSent){
            res.status(404).render('404');
        }
    });
};