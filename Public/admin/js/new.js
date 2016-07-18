/**
 * Created by 小雪花儿1234 on 2016/7/9.
 */
var URL = '../../..';

$(function () {
    $("button#forbid1").click(function () {
        var check=$("input.checkbox");


        $.each(check, function (index, value) {
            if(value.checked){
                $(value).parent().parent().addClass("disable");
                var name1=$($($(value).parent()).siblings()[0]).html();
                $.ajax({

                    type: "post",
                    async: false,
                    url: URL+"/admin_del",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:1
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})
$(function () {
    $("button#forbid2").click(function () {
        var check=$("input.checkbox");
        $.each(check, function (index, value) {
            if(value.checked){
                $(value).parent().parent().addClass("disable");
                $.ajax({
                    type: "post",
                    async: false,
                    url: URL+"/admin_del",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:0
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})
$(function () {
    $("button#forbid3").click(function () {
        var check=$("input.checkbox");
        $.each(check, function (index, value) {
            if(value.checked){
                $(value).parent().parent().addClass("disable");
                $.ajax({
                    type: "post",
                    async: false,
                    url: URL+"/admin_del",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:2,
                        menuType:$($($(value).parent()).siblings()[3]).html(),
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})
$(function(){
    $("button#abolish1").click(function(){
        var check=$("input.checkbox");
        $.each(check,function(index,value){
            if(value.checked){
                $(value).parent().parent().removeClass("disable");
                $.ajax({
                    type: "post",
                    async: false,
                    url: URL+"/admin_act",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:1
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})
$(function(){
    $("button#abolish2").click(function(){
        var check=$("input.checkbox");
        $.each(check,function(index,value){
            if(value.checked){
                $(value).parent().parent().removeClass("disable");
                $.ajax({
                    type: "post",
                    async: false,
                    url: URL+"/admin_act",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:0
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})
$(function(){
    $("button#abolish3").click(function(){
        var check=$("input.checkbox");
        $.each(check,function(index,value){
            if(value.checked){
                $(value).parent().parent().removeClass("disable");
                var hehe = $($($(value).parent()).siblings()[3]).html();
                $.ajax({
                    type: "post",
                    async: false,
                    url: URL+"/admin_act",
                    data: {
                        id: $($($(value).parent()).siblings()[0]).html(),
                        type:2,
                        menuType:$($($(value).parent()).siblings()[3]).html()
                    },
                    timeout: 1000,
                    success: function (dates) {
                    },
                    error: function () {
                    }
                });
            }
        })
    })
})

$(function(){
    $("button#search1").click(function(){
        $.ajax({
            type: "post",
            async: false,
            url: URL+"/shop",
            data: {
                name:$("#kw").val()
            },
            // timeout: 1000,
            success: function (datas) {
                var name=datas.name;
                var id=datas.id;
                var description=datas.description;
                var latitude=datas.latitude;
                var longitude=datas.longitude;
                var ads=datas.ads;
                var se=confirm("商店名称:"+name+"\n"+"商店编号:"+id+"\n"+"商店描述："+description+"\n"
                               +"商店经度："+longitude+"\n"+"商店纬度："+latitude+"\n"+"商店公告："+ads+"\n")
                if(se==true){

                }else{

                }
            },
            error: function () {
            }
        });

    })
})

$(function(){
    $("button#search2").click(function(){
        $.ajax({
            type: "post",
            async: false,
            url: URL+"/user",
            data: {
                name:$("#kw").val()
            },
            // timeout: 1000,
            success: function (datas) {
                var name=datas.name;
                var id=datas.id;
                var sex=datas.sex;
                var latitude=datas.latitude;
                var longitude=datas.longitude;
                var se=confirm("用户名称:"+name+"\n"+"用户编号:"+id+"\n"+"用户性别："+sex+"\n"
                    +"用户经度："+longitude+"\n"+"用户纬度"+latitude+"\n")
                if(se==true){

                }else{

                }
            },
            error: function () {
            }
        });

    })
})

$(function(){
    $("button#search3").click(function(){
        $.ajax({
            type: "post",
            async: false,
            url: URL+"/menu",
            data: {
                name:$("#kw").val()
            },
            // timeout: 1000,
            success: function (datas) {
                var name=datas.name;
                var id=datas.id;
                var description=datas.description;
                var price=datas.price;
                var se=confirm("菜品名称:"+name+"\n"+"菜品编号:"+id+"\n"+"菜品描述："+description+"\n"
                    +"菜品价格"+price+"\n")
                if(se==true){

                }else{

                }
            },
            error: function () {
            }
        });

    })
})