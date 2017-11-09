var mysql = require('mysql');
let Sphinx = require('sphinxapi');
let q = require('q');
let sSearch = require('../db/dbHelper').sphinxSearch;
let config = require("../config/default");
//chinase words cut
let Segment = require('segment');
let segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

const sphinx = new Sphinx({
    host: 'localhost', // default sphinx host
    port: 9312 // default sphinx TCP port
});

let sphinxSearch = function (str,idx=1,filter=9,sort=1,getNumber=0,recommand=0) {
    let deferred = q.defer();
    //set the match mode
    //sphinx.SetMatchMode(Sphinx.SPH_MATCH_ANY);
    //set the type filter
    sphinx.ResetFilters();
    if(filter!= 9){
        sphinx.SetFilter('category',[filter*1],false);
    }
    //set the order by collomn
    if(sort){
        sphinx.SetSortMode(Sphinx.SPH_SORT_ATTR_DESC, 'feed_time');
    }else {
        sphinx.SetSortMode(Sphinx.SPH_SORT_RELEVANCE);
    }
    //set the fetch recoders number
    idx = idx - 1;
    let offset;
    if(getNumber>0){
        offset = idx * getNumber;
        sphinx.SetLimits(offset,getNumber);
    }else {
        offset = idx * config.pageNumber;
        sphinx.SetLimits(offset,config.pageNumber);
    }

    //  console.log('sphinx:'+sphinx);
    sphinx.Query(convertQueryStr(str,recommand),(err,result)=>{
        if(err) throw err;
        // console.log('sphinx result:'+result);
        // console.log(result.matches.length);
        if(result.matches.length > 0 && result.total_found >0){
            sSearch(getIdsFromResult(result))
                .then(res=>{
                    res.total = result.total_found;
                    deferred.resolve(res);
                });
        }
        else if(result.matches.length == 0 && result.total_found >0){
            deferred.resolve('finish');
        }
        else{
            deferred.resolve('zero');
        }

    });
    return deferred.promise;
};

let getIdsFromResult = function(result = {}) {
    if (typeof(result)== 'Object') {
        throw new TypeError('Result must be an object');
    } else if (!result.hasOwnProperty('matches')) {
        return [];
    }
    return result.matches.map(match => match && match.id)
        // .filter(id => {typeof (id) == 'Number'});
};

let convertQueryStr = function (queryString,recommand) {
    let qs = queryString.trim().substr(0, 30);
    // let qString = qs.replace(/[:：\s,，。./]/g, "|").split('|');
    // console.log(qString);
    //let qString = qs.replace(/[:：\s,，。./]/g, "|");
   // console.time('fenci');
    let qString = segment.doSegment(qs,{
        simple: true,
        stripPunctuation: true
    });
    //console.timeEnd('fenci');

    let qStringArr = '';
    if(!recommand){
        for (let i of qString) {
            if (i) {
                qStringArr += (qStringArr.length > 0 ? ' ' : '') + i;
            }
        }
    }else {
        if(qString.length > 3){
            qStringArr = qString[2]+ ' ' + qString[3];
        }else {
            for (let i of qString) {
                if (i) {
                    qStringArr += (qStringArr.length > 0 ? ' ' : '') + i;
                }
            }
        }
    }

    console.log('分词结果：'+qStringArr);
    return qStringArr;
};

module.exports.sphinxSearch = sphinxSearch;