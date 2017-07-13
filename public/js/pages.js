$('#homePage').on("click", function () {
    var searchValue = $('#search-value').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1", filter: filterValue, sort: sortValue},
        beforeSend:function () {
            $('#homePage').css("display", 'none');
            $('#prePage').css("display", 'none');
            $('#nextPage').css("display", 'none');
        }
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?kw="+searchValue+"&view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                // str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                $('#resultList tbody').append(str);
            }
            $('#pageNumber').text('1');
            $('#prePage').attr('data-value', '0');
            $('#nextPage').attr('data-value', '2');
            $('#prePage').css("display", 'none');
            $('#homePage').css("display", 'none');
            $('#nextPage').css("display", '');
        });
});

$('#prePage').on("click", function () {
    var searchValue = $('#search-value').text();
    var pageNum = $('#pageNumber').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: (pageNum * 1 - 1), filter: filterValue, sort: sortValue},
        beforeSend:function () {
            $('#homePage').css("display", 'none');
            $('#prePage').css("display", 'none');
            $('#nextPage').css("display", 'none');
        }
    })
        .done(function (msg) {
            // console.log(msg[0]);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?kw="+searchValue+"&view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                // str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                $('#resultList tbody').append(str);
            }
            if ((pageNum * 1 - 1) == 1) {
                $('#prePage').attr('data-value', '0');
                $('#nextPage').attr('data-value', '2');
                $('#prePage').css("display", 'none');
                $('#homePage').css("display", 'none');
                $('#nextPage').css("display", '');
                $('#pageNumber').text('1');
            } else {
                $('#homePage').css("display", '');
                $('#prePage').css("display", '');
                $('#nextPage').css("display", '');
                $('#prePage').attr('data-value', '' + (pageNum * 1 - 2) + '');
                $('#nextPage').attr('data-value', '' + pageNum * 1 + '');
                $('#pageNumber').text('' + (pageNum * 1 - 1) + '');
            }
        });
});

$('#nextPage').on("click", function () {
    var searchValue = $('#search-value').text();
    var pageNum = $('#pageNumber').text();
    var totalResult = $('#totalResult').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: pageNum * 1 + 1, filter: filterValue, sort: sortValue},
        beforeSend:function () {
            $('#homePage').css("display", 'none');
            $('#prePage').css("display", 'none');
            $('#nextPage').css("display", 'none');
        }
    })
        .done(function (msg) {
            if (msg.length > 1) {
                $('#resultList tbody').remove();
                $('#resultList').append('<tbody></tbody>');
                for (var i = 0; i < msg.length - 1; i++) {
                    var str = "<tr><td><a class=\'text\' href=\"/result/?kw="+searchValue+"&view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                    // str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                    str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                    str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                    $('#resultList tbody').append(str);
                }
                $('#nextPage').css("display", '');
                $('#prePage').attr('data-value', '' + pageNum * 1 + '');
                $('#nextPage').attr('data-value', '' + (pageNum * 1 + 2) + '');
                $('#pageNumber').text('' + (pageNum * 1 + 1) + '');
                $('#prePage').css("display", '');
                $('#homePage').css("display", '');
                $('#nextPage').css("display", '');
            }
            else {
                alert('后面没有了');
                return;
            }

        });
});

$('#searchBtn').on("click", function () {
    var sValue = $('#searchValue').val();
    var trimValue = $.trim(sValue);
    if (trimValue.length == 0) {
        alert('请输入搜索的内容！');
        return false;
    }
    else {
        $('#search-value').text(trimValue);
    }
});

$('.filterSpan,.sortSpan').on('mouseenter', function () {
    $(this).css({"background-color": "#CCCCCC", "color": "white"});
});

$('.filterSpan,.sortSpan').on('mouseleave', function () {
    if ($(this).attr('filter-click') == 0) {
        $(this).css({"background-color": "", "color": "black"});
    }
    if ($(this).attr('sort-click') == 0) {
        $(this).css({"background-color": "", "color": "black"});
    }
});

$('.logo-img,.logomin-img').on('mouseenter', function () {
    $(this).css('cursor', 'pointer')
});
$('.logo-img,.logomin-img').on('click', function () {
    window.location.href = '/';
});

$('.filterSpan').on('click', function () {
    $(this).css({"background-color": "#CCCCCC", "color": "white"});
    $(this).siblings().css({"background-color": "", "color": "black"});
    $(this).siblings().attr('filter-click', '0');
    $(this).attr('filter-click', '1');

    var searchValue = $('#search-value').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1", filter: filterValue, sort: sortValue},
        beforeSend:function () {
            $('.filterSpan').css("visibility","hidden");
        }
    })
        .done(function (msg) {
            $('.filterSpan').css("visibility","visible");
            $('#totalResult').text(msg[msg.length - 1].totalRecoders);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?kw="+searchValue+"&view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                // str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                $('#resultList tbody').append(str);
            }
            $('#pageNumber').text('1');
            $('#prePage').attr('data-value', '0');
            $('#nextPage').attr('data-value', '2');
            $('#prePage').css("display", 'none');
            $('#homePage').css("display", 'none');
        });
});

$('.sortSpan').on('click', function () {
    $(this).css({"background-color": "#CCCCCC", "color": "white"});
    $(this).siblings().css({"background-color": "", "color": "black"});
    $(this).siblings().attr('sort-click', '0');
    $(this).attr('sort-click', '1');
    var searchValue = $('#search-value').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1", filter: filterValue, sort: sortValue},
        beforeSend:function () {
            $('.sortSpan').css("visibility","hidden");
        }
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('.sortSpan').css("visibility","visible");
            $('#totalResult').text(msg[msg.length - 1].totalRecoders);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?kw="+searchValue+"&view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                // str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                $('#resultList tbody').append(str);
            }
            $('#pageNumber').text('1');
            $('#prePage').attr('data-value', '0');
            $('#nextPage').attr('data-value', '2');
            $('#prePage').css("display", 'none');
            $('#homePage').css("display", 'none');
        });
});

$('#addFav').on('click', function () {
    alert('请按 Ctrl + D 键收藏本网站，感谢你的关注！')
});

$('#searchValue').on('click',function () {
    $(this).select();
});

$(function () {
    var url = window.location.href;
    var menuArr = ['main','hotMenu','latestMenu','menu?type=1','menu?type=2','menu?type=3','menu?type=4','menu?type=5','menu?type=7'];
    var flag = false;
    for(var i=0;i<menuArr.length;i++){
        if(url.indexOf(menuArr[i]) > 0){
            $('.link').eq(i).css({"color":"#FFFFFF","background":"#4fc08d",'font-weight':'bold'});
            flag=true;
        }
    }
    if(!flag){
        $('.menus li .main').css({"color":"#FFFFFF","background":"#4fc08d",'font-weight':'bold'});
    }

    if(url.indexOf('latestMenu')>0 || url.indexOf('menu?type') > 0){
        var idx = url.split('=')[2];
        if(typeof(idx)=='undefined' ){
            $('#menu-pages a').css({'font-weight':'normal'});
            $('#menu-pages a').eq(0).css({"color":"#FFFFFF","background":"#4fc08d",'font-weight':'bold'});
        }else {
            $('#menu-pages a').css({'font-weight':'normal'});
            $('#menu-pages a').eq(idx-1).css({"color":"#FFFFFF","background":"#4fc08d",'font-weight':'bold'});
        }
    }
});