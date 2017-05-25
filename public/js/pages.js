$('#homePage').on("click", function () {
    var searchValue = $('#search-value').text();
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1"}
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
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

$('#prePage').on("click", function () {
    var searchValue = $('#search-value').text();
    var pageNum = $('#pageNumber').text();
    var filterValue = $('[data-click = 1]').attr('data-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: (pageNum * 1 - 1),filter:filterValue}
    })
        .done(function (msg) {
            console.log(msg[0]);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                $('#resultList tbody').append(str);
            }
            if ((pageNum * 1 - 1) == 1) {
                $('#prePage').attr('data-value', '0');
                $('#nextPage').attr('data-value', '2');
                $('#prePage').css("display", 'none');
                $('#homePage').css("display", 'none');
                $('#pageNumber').text('1');
            } else {
                $('#prePage').attr('data-value', '' + (pageNum * 1 - 2) + '');
                $('#nextPage').attr('data-value', '' + pageNum * 1 + '');
                $('#pageNumber').text('' + (pageNum * 1 - 1) + '');
            }
        });
});

$('#nextPage').on("click", function () {
    var searchValue = $('#search-value').text();
    var filterValue = $('[data-click = 1]').attr('data-value');
    var pageNum = $('#pageNumber').text();
    var totalResult = $('#totalResult').text();
    // if (Math.ceil(totalResult * 1 / 15) > pageNum) {
        $.ajax({
            method: "GET",
            url: "/pages",
            data: {search: searchValue, idx: pageNum * 1 + 1,filter:filterValue}
        })
            .done(function (msg) {
                console.log(msg);
                if(msg.length > 0){
                    $('#resultList tbody').remove();
                    $('#resultList').append('<tbody></tbody>');
                    for (var i = 0; i < msg.length; i++) {
                        var str = "<tr><td><a class=\'text\' href=\"/result/?view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                        str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
                        str += "<td class=\'center aligned\'>" + msg[i].category + "</td>";
                        str += "<td class=\'center aligned\'>" + msg[i].size + "</td></tr>";
                        $('#resultList tbody').append(str);
                    }
                    $('#prePage').attr('data-value', '' + pageNum * 1 + '');
                    $('#nextPage').attr('data-value', '' + (pageNum * 1 + 2) + '');
                    $('#pageNumber').text('' + (pageNum * 1 + 1) + '');
                    $('#prePage').css("display", '');
                    $('#homePage').css("display", '');
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

$('.filterSpan').on('mouseenter', function () {
    $(this).css({"background-color": "#CCCCCC", "color": "white"});
});

$('.filterSpan').on('mouseleave', function () {
    if($(this).attr('data-click') == 0){
        console.log('in');
        $(this).css({"background-color": "", "color": "black"});
    }
});

$('.logo-img,.logomin-img').on('mouseenter',function () {
    $(this).css('cursor','pointer')
});
$('.logo-img,.logomin-img').on('click',function () {
   window.location.href = '/';
});

$('.filterSpan').on('click', function () {
    $(this).css({"background-color": "#CCCCCC", "color": "white"});
    $(this).siblings().css({"background-color": "", "color": "black"});
    $(this).siblings().attr('data-click','0');
    $(this).attr('data-click','1');
    var searchValue = $('#search-value').text();
    var filterValue = $(this).attr('data-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1", filter: filterValue}
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?view=" + msg[i].ID + "\" target=\'_blank\'>" + msg[i].title + "</a></td>";
                str += "<td class=\'center aligned\'>" + msg[i].username + "</td>";
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

$('#addFav').on('click',function () {
    alert('请按 Ctrl + D 键收藏本网站，感谢你的关注！')
});