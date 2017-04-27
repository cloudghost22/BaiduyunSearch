$('#homePage').on("click", function () {
    var searchValue = $('#search-value').text();
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "0"}
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?view=$" + msg[i].shareid + "\" target=\'_blank\'>" + msg[i].title + "</a></td>></tr>";
                $('#resultList tbody').append(str);
            }
            $('#pageNum').text('1');
            $('#prePage').attr('data-value', '1');
            $('#nextPage').attr('data-value', '2');
            $('#prePage').attr('disabled', true);
            $('#homePage').attr('disabled', true);
        });
});

$('#prePage').on("click", function () {
    var searchValue = $('#search-value').text();
    var pageNum = $('#pageNumber').text();
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: (pageNum*1-2)}
    })
        .done(function (msg) {
            console.log(msg[0]);
            $('#resultList tbody').remove();
            $('#resultList').append('<tbody></tbody>');
            for (var i = 0; i < msg.length; i++) {
                var str = "<tr><td><a class=\'text\' href=\"/result/?view=$" + msg[i].shareid + "\" target=\'_blank\'>" + msg[i].title + "</a></td>></tr>";
                $('#resultList tbody').append(str);
            }
            if ((pageNum * 1 - 1) == 1) {
                $('#prePage').attr('data-value', '1');
                $('#nextPage').attr('data-value', '2');
                $('#prePage').attr('disabled', true);
                $('#homePage').attr('disabled', true);
                $('#pageNumber').text('1');
            } else {
                $('#prePage').attr('data-value', '' + (pageNum * 1 - 2) + '');
                $('#nextPage').attr('data-value', '' + pageNum * 1 + '');
                $('#pageNumber').text(''+(pageNum * 1-1)+'');
            }
        });
});

$('#nextPage').on("click", function () {
    var searchValue = $('#search-value').text();
    var idx = $('#nextPage').attr('data-value');
    var pageNum = $('#pageNumber').text();
    var totalResult = $('#totalResult').text();
    if (Math.round(totalResult * 1 / 15) > idx) {
        $.ajax({
            method: "GET",
            url: "/pages",
            data: {search: searchValue, idx: pageNum*1}
        })
            .done(function (msg) {
                $('#resultList tbody').remove();
                $('#resultList').append('<tbody></tbody>');
                for (var i = 0; i < msg.length; i++) {
                    var str = "<tr><td><a class=\'text\' href=\"/result/?view=" + msg[i].shareid + "\" target=\'_blank\'>" + msg[i].title + "</a></td>></tr>";
                    $('#resultList tbody').append(str);
                }
                $('#prePage').attr('data-value', '' + pageNum * 1 + '');
                $('#nextPage').attr('data-value', '' + (pageNum * 1 + 2) + '');
                $('#pageNumber').text(''+(pageNum * 1+1)+'');
                $('#prePage').attr('disabled', false);
                $('#homePage').attr('disabled', false);
            });
    }
    else {
        alert('后面没有了');
        return;
    }

});

$('#searchBtn').on("click", function () {
    var sValue = $('#searchValue').val();
    var trimValue = $.trim(sValue);
    if (trimValue.length == 0) {
        alert('请输入搜索的内容！');
        return;
    }
    else {
        $('#search-value').text(sValue);
    }
});

