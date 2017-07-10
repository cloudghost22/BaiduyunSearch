$('#homePage').on("click", function () {
    var searchValue = $('#search-value').text();
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "1", filter: '9', sort: '1'}
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('.weui-cells a').remove();
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<a class=\'weui-cell weui-cell_access\' href=\'/result/?kw="+searchValue+"&view=" + msg[i].ID + "\' target=\'_blank\'><div class=\'weui-cell__bd\'><p>" + msg[i].title + "</p></div><div class=\'weui-cell__ft\'></div></a>";
                $('.weui-cells').append(str);
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
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: (pageNum * 1 - 1), filter: '9', sort: '1'}
    })
        .done(function (msg) {
            // console.log(msg[0]);
            $('.weui-cells a').remove();
            for (var i = 0; i < msg.length - 1; i++) {
                var str = "<a class=\'weui-cell weui-cell_access\' href=\'/result/?kw="+searchValue+"&view=" + msg[i].ID + "\' target=\'_blank\'><div class=\'weui-cell__bd\'><p>" + msg[i].title + "</p></div><div class=\'weui-cell__ft\'></div></a>";
                $('.weui-cells').append(str);
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
    var pageNum = $('#pageNumber').text();
    var totalResult = $('#totalResult').text();
    var filterValue = $('[filter-click = 1]').attr('filter-value');
    var sortValue = $('[sort-click = 1]').attr('sort-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: pageNum * 1 + 1, filter: '9', sort: '1'}
    })
        .done(function (msg) {
            if (msg.length > 1) {
                $('.weui-cells a').remove();
                for (var i = 0; i < msg.length - 1; i++) {
                    var str = "<a class=\'weui-cell weui-cell_access\' href=\'/result/?kw="+searchValue+"&view=" + msg[i].ID + "\' target=\'_blank\'><div class=\'weui-cell__bd\'><p>" + msg[i].title + "</p></div><div class=\'weui-cell__ft\'></div></a>";
                    $('.weui-cells').append(str);
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