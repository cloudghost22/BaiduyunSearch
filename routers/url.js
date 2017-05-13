/**
 * Created by linweiyun on 2017/5/13.
 */
var express = require('express');
var router = express.Router();
let viewShare = require('../db/dbHelper').viewShare;
let parseShare = require('../common/func').parseShare;

router.get('/',(req,res)=>{
    let urlStr = req.query.q;
    let type = req.query.t;
    let downloadID = Buffer.from(urlStr,'base64').toString();
    viewShare(downloadID*1 -1)
        .then((result) => {
            if (result.length > 0) {
                let parseResult = parseShare(result);
                let baiduyunShare;
                if(!type){
                    baiduyunShare = `https://pan.baidu.com/share/link?uk=${parseResult.uk}&third=0&shareid=${parseResult.shareid}`;
                }else {
                    baiduyunShare = `https://pan.baidu.com/wap/link?uk=${parseResult.uk}&third=0&shareid=${parseResult.shareid}`;
                }
                res.redirect(baiduyunShare);
            } else {
                res.render('404');
            }
        });
});

module.exports = router;