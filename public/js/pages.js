$('#homePage').on("click",function () {
    var searchValue = $('#search-value').text();
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: "0"}
    })
        .done(function (msg) {
            //console.log("Data Saved: " + msg);
            $('#resultList tr').remove();
            for(var i=0;i<msg.length;i++){
                var str="<tr><td><a class=\'text\' href=\"/result/?view=$"+msg[i].shareid+"\" target=\'_blank\'>"+msg[i].title+"</a></td>></tr>";
                $('#resultList').append(str);
            }
            $('#nextPage').attr('data-value','0');
            $('#prePage').attr('data-value','1');

        });
});

$('#prePage').on("click",function () {
    var searchValue = $('#search-value').text();
    var idx = $('#prePage').attr('data-value');
    var nextIdx = $('#nextPage').attr('data-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data: {search: searchValue, idx: idx}
    })
        .done(function (msg) {
            $('#resultList tr').remove();
            for(var i=0;i<msg.length;i++){
                var str="<tr><td><a class=\'text\' href=\"/result/?view=$"+msg[i].shareid+"\" target=\'_blank\'>"+msg[i].title+"</a></td>></tr>";
                $('#resultList').append(str);
            }
            if(idx>=0){
                $('#prePage').attr('data-value',''+(idx*1-1)+'');
            }
            if(nextIdx>0){
                $('#nextPage').attr('data-value',''+(nextIdx*1-1)+'');
            }
        });
});

$('#nextPage').on("click",function () {
    var searchValue = $('#search-value').text();
    var idx = $('#nextPage').attr('data-value');
    var preIdx = $('#prePage').attr('data-value');
    $.ajax({
        method: "GET",
        url: "/pages",
        data:  {search: searchValue, idx: idx}
    })
        .done(function (msg) {
            $('#resultList tr').remove();
            for(var i=0;i<msg.length;i++){
                var str="<tr><td><a class=\'text\' href=\"/result/?view=$"+msg[i].shareid+"\" target=\'_blank\'>"+msg[i].title+"</a></td>></tr>";
                $('#resultList').append(str);
            }
            if(idx>0){
                $('#nextPage').attr('data-value',''+(idx*1+1)+'');
            }
            if(preIdx>=0){
                $('#prePage').attr('data-value',''+(preIdx*1+1)+'');
            }
        });
});

$('#searchBtn').on("click",function () {
    var sValue = $('#searchValue').val();
    if(sValue){
        $('#search-value').text(sValue);
    }
});