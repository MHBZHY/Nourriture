/**
 * Created by 小雪花儿1234 on 2016/7/12.
 */
var URL = '../../..';
$(function(){
    $("input#give").click(function(){
        $.ajax({
            type: "post",
            async: false,
            url: URL+"/login",
            data: {
                name:$("#name").val(),
                password:$("#password").val(),
                admin:1
            },
            // timeout: 1000,
            success: function (datas) {
                window.location.href="shop.html";
            },
            error: function () {
            }
        });

    })
})