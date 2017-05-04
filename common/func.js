/**
 * Created by linweiyun on 2017/4/27.
 */

let parseShare = function (json) {

    let tempJson = {};
    let cate = new Map();
    // cate.set(1, '视频').set(2, '音乐').set(3, '图片').set(4, '文档').set(6, '其他');
    cate.set(1, '视频').set(2, '音乐').set(3, '图片').set(4, '文档').set(5,'应用').set(6, '其他').set(7, '下载文件');
    let idx = json[0].category;
    tempJson.title = json[0].title;
    tempJson.username = json[0].username;
    tempJson.sharetime = timeStamp2String(json[0].feed_time);
    tempJson.category = cate.get(idx);
    tempJson.size = json[0].isdir == 0 ? bit2Size(json[0].size) : '--';
    tempJson.shareid = json[0].shareid;
    tempJson.uk = json[0].uk;
    // console.log(tempJson);
    return tempJson;
};

let timeStamp2String = function (time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    return year + "-" + month + "-" + date;
};

let bit2Size = function (size) {
    let len = size.toString().length;
    // console.log(len);
    if (len >= 10) {
        return Math.round(parseFloat(size*1 / 1024 / 1024 / 1024) * 10) / 10 + 'G';
    } else if (len >= 7) {
        return Math.round(parseFloat(size*1 / 1024 / 1024) * 10) / 10 + 'MB';
    } else if (len >= 4) {
        return Math.round(parseFloat(size*1 / 1024) * 10) / 10 + 'KB';
    } else {
        return Math.round(parseFloat(size*1) * 10) / 10 + 'B';
    }
};

let parseAllShare = function (jsonArr) {
    let parseJsonArr = [];
    for(let i=0;i<jsonArr.length;i++){
        parseJsonArr[i] = parseShareOne(jsonArr[i]);
        // console.log(parseJsonArr[i]);
    }
    return parseJsonArr;
};

let parseShareOne = function (json,flag=0) {
    let tempJson = {};
    let cate = new Map();
    cate.set(1, '视频').set(2, '音乐').set(3, '图片').set(4, '文档').set(5,'应用').set(6, '其他').set(7, '下载文件');
    let idx = json.category;
    tempJson.ID = json.ID;
    tempJson.title = json.title;
    tempJson.category = cate.get(idx);
    tempJson.size = json.isdir == 0 ? bit2Size(json.size) : '--';
    tempJson.username = json.username;
    if(flag){
        tempJson.shareid = json.shareid;
        tempJson.uk = json.uk;
        tempJson.sharetime = timeStamp2String(json.feed_time);
    }
    return tempJson;
};

module.exports.parseShare = parseShare;
module.exports.parseAllShare = parseAllShare;