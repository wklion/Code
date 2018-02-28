

function ZHJCYTPageClass(){
    this.layerPlot = null;
    this.realTime = true;
    this.num = 0;
    this.layer = null;
    var t = this;
    this.keyDown = false;

    this.renderMenu = function() {
        var htmlStr = "<div style='padding-top: 15px;'>"
            +"<div id='satelliteDiv' class='btn_line1'>"
                +"<div id='satelliteType' style='height: 22px;margin: 5px 0px 0px 19px;font-size: 12px;' ><span>卫星：</span><button id='FY2E' >风云2E</button><button id='FY2G'>风云2G</button><button id='Himawari-8' class='active'>葵花</button></div>"
                +"<div id='satelliteProduct' style='height: 22px;margin: 5px 0px 0px 19px;font-size: 12px;' ><span>通道：</span><button id='ir1' class='active'>红外</button><button id='ir3'>水汽</button><button id='vis' >可见光</button><button id='mcs' >MCS</button></div>"
                +"<div id='satelliteNumerical' style='height: 70px;margin: 5px 0px 0px 19px;font-size: 12px;' ><span style='float: left;margin-top: 2px;'>产品：</span>"
                +"<div style='float: left;width: 255px;'><button id='clc' >CLC</button><button id='amv_ir1'>AMV_IR1</button><button id='amv_ir3'>AMV_IR3</button><button id='tpw'>TPW</button>"
                +"<button id='pre_1' flag='001'>PRE_1</button><button id='pre_3' flag='003'>PRE_3</button><button id='pre_6' flag='006'>PRE_6</button><button id='pre_24' flag='024'>PRE_24</button>"
                +"<button id='uth'>UTH</button><button id='tbb'>TBB</button></div></div>"
            +"</div>"
            +"<div style='padding-top: 10px;'>"
                +"<div class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='color: red;margin-left: 15px;line-height: 22px;'></span></div>"
                +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 60px;'>6H</div><div class='rhjcHourSpan' style='width: 60px;'>12H</div><div class='rhjcHourSpan' style='width: 60px;'>24H</div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>停止</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 10px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
               /* +"<div id='ytfButton'  style='top: 316px;text-align:center'>"
            +"<div  style='margin-left:25%;margin-top:3px;padding: 0px 20px 10px 10px;'><input style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 10px;' type='text' id='zytfValue' value='' />&nbsp;&nbsp;<div class='rhjcQueryTime'>TBB过滤</div></div>"
                +"</div>"*/
                +"<div id='timeListDiv' class='timeListDiv' style='top: 328px;'></div>"
            +"</div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        this.myDateSelecter1 = new DateSelecter(0,0); //最小视图为天
        this.myDateSelecter1.changeHours(-6*60);
        this.myDateSelecter1.intervalMinutes = 60*1; //12小时
        this.myDateSelecter2 = new DateSelecter(0,0); //最小视图为天
        this.myDateSelecter2.intervalMinutes = 60*24; //12小时
        $("#dateSelect1").append(this.myDateSelecter1.div);
        $("#dateSelect2").append(this.myDateSelecter2.div);
        $("#dateSelect1").find("input").css("width","191px");
        $("#dateSelect2").find("input").css("width","191px");
        $("#dateSelect1").find("img").css("display","none");
        $("#dateSelect2").find("img").css("display","none");
        $("#dateSelect1").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");
        $("#dateSelect2").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");
        var nowDate = new Date();
        var min = nowDate.getMinutes();
        this.myDateSelecter1.changeHours(min-min%6);
        this.myDateSelecter2.changeHours(min-min%6);

        $("#query_action").find(".rhjcQueryTime").click(function(){
            if($(this).html() == "查询"){
                if($("#hourRadio")[0].checked)
                    getSatelliteTimes();
                else{
                    alertModal("当前为实时");
                }
            }
            else if($(this).html() == "动画"){

            }
            else if($(this).html() == "停止"){

            }
        });
        //卫星类型点击
        $("#satelliteType").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#satelliteType").find("button.active").removeClass("active");
            $(this).addClass("active");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            if($("#hourRadio")[0].checked){
                $("#query_action").find("div").eq(0).click();
            }
            else{
                if($("#satelliteProduct").find("button.active").attr("id")!="mcs")
                    getNewSatellite(0);
                else
                    getMCS();
            }
        });
        //通道点击
        $("#satelliteProduct").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#satelliteProduct").find("button.active").removeClass("active");
            $("#satelliteNumerical").find("button.active").removeClass("active");
            $(this).addClass("active");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            if($("#hourRadio")[0].checked){
                $("#query_action").find("div").eq(0).click();
            }
            else{
                if($("#satelliteProduct").find("button.active").attr("id")!="mcs")
                    getNewSatellite(0);
                else
                    getMCS();
            }
        });
        //二级产品点击
        $("#satelliteNumerical").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#satelliteProduct").find("button.active").removeClass("active");
            $("#satelliteNumerical").find("button.active").removeClass("active");
            $(this).addClass("active");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            if($("#hourRadio")[0].checked){
                $("#query_action").find("div").eq(0).click();
            }
            else{
                    getNewSatellite(0);
            }
        });

        $("#timeRadio").click(function(){
            t.realTime = true;
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            if($("#satelliteProduct").find("button.active").attr("id")!="mcs")
                getNewSatellite(0);
            else
                getMCS();
            $("#timeListDiv").html("");
        });
        $("#hourRadio").click(function(){
            t.realTime = false;
            $("#nowTime").html("");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
        });

        $("#hourSpan").find("div").click(function(){
            if($(this).html() == "6H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-6*60);
            }
            else if($(this).html() == "12H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-12*60);
            }
            else if($(this).html() == "24H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-24*60);
            }
        });

        GDYB.Legend.update(null);
        //注册点击事件
        $("#div_legend_items").find("div").click(function(){
            if(t.layer == null)
                return;
            var styles = GDYB.Legend.styles;
            var legenItemValue = Number($(this).attr("tag"));
            var bvisible = typeof(this.attributes["visible"]) == "undefined" || this.attributes["visible"].value == "true";
            if(bvisible)
            {
                $(this).css("background-color", "rgb(255, 255, 255)");
                $(this).attr("visible", "false");
            }
            else
            {
                var rgb = GDYB.Legend.items[legenItemValue];
                $(this).css("background-color", rgb);
                $(this).attr("visible", "true");
            }

            var colors = [];
            for(var key in styles) {
                var style = styles[key];
                var value = Math.floor(style.end * 10) / 10;
                if(value == legenItemValue)
                {
                    style["visible"] = !bvisible;
                }
                if(typeof(style["visible"]) != "undefined" && !style["visible"])
                    colors.push({r:style.startColor.red,g:style.startColor.green,b:style.startColor.blue});
            }
            t.layer.transparentColors = colors;
            t.layer.redraw();
        });
        getMCS();
    }

    if(!this.keyDown){
        this.keyDown = true;
        $(document).keydown(function (event) {
            if(GDYB.Page.curPage != GDYB.ZHJCYTPage)
                return;
            var allEles =$("#timeListDiv").children("div");
            //alert(allEles.length+"   "+allEles.eq(0));
            if($("#timeListDiv").find("div.active")) {
                //键盘上下键控制数据
                var offset = 0;
                if (event.keyCode == 38) {//上
                    offset = -1;
                }else if (event.keyCode == 40) {//下
                    offset = 1;
                }
                if($("#timeListDiv").find("div.active").length>0){
                    if(offset != 0){
                        var cEle = $("#timeListDiv").find("div.active");
                        if(offset==1){
                            if(cEle.next().length != 0){
                                cEle.next().click();
                            }
                            return;
                        }
                        if(offset==-1){
                            if(cEle.prev().length != 0) {
                                cEle.prev().click();
                            }
                            return;
                        }
                    }else{
                        return;
                    }
                    //$("#timeListDiv").find("div.active").removeClass("active");
                }else{
                    if(allEles.length>0){
                        allEles.eq(0).click();
                    }
                    return;
                }
            }
        });
    }


    function displaySatellite(times){
        clearSatelliteLayer();
         var SatelliteParam = getSatelliteParam(times);
         var options = {useCanvas:true,isBaseLayer:false};
         t.layer = new WeatherMap.Layer.Image(
         "Satellite",
         SatelliteParam.url,
         SatelliteParam.bounds ,
         options
         );
         t.layer.setOpacity(0.7);
         GDYB.Page.curPage.map.addLayer(t.layer);
    }

   /* //判断url是否存在
    function getUrlExists(url,recall) {
        $.ajax({
            type: "GET",
            async: false,
            cache: false,
            url: url,
            data: "",
            success: function() {
                recall(true);
            },
            error: function() {
                recall(false);
            }
        });

    }*/

    function getSatelliteParam(times){
        var nowDate = new Date(times);
        nowDate.setHours(nowDate.getHours()-8);
        var time = nowDate.getFullYear() + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "_" + (Array(2).join(0)+nowDate.getHours()).slice(-2) +(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var url = imgCacheUrl;
        var list = $("#satelliteDiv").find("button.active");
        var boundsList = qdlytBounds[$(list[0]).attr("id")+"_"+$(list[1]).attr("id")];
        var bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
        var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
        url += qdlytUrl[$(list[0]).attr("id")+"_"+$(list[1]).attr("id")];
        url = url.replace("time",time).replace("time",time).replace("bounds",boundsStr);
        if($(list[1]).attr("id") == "pre_1" || $(list[1]).attr("id") == "pre_3" || $(list[1]).attr("id") == "pre_6" || $(list[1]).attr("id") == "pre_24"){
            var resolution = $(list[1]).attr("flag");
            url = url.replace("resolution",resolution).replace("resolution",resolution);
        }
        return {url:url,bounds:bounds};
    }

    //获取带time的云图地址
    function getSatelliteUrl(){
        if($("#satelliteProduct").find("button.active").attr("id") != "mcs"){
            var url = "D:/Tomcats/apache-tomcat-gdyb-dataservice/webapps/cache";
            var list = $("#satelliteDiv").find("button.active");
            var boundsList = qdlytBounds[$(list[0]).attr("id")+"_"+$(list[1]).attr("id")];
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlytUrl[$(list[0]).attr("id")+"_"+$(list[1]).attr("id")];
            url = url.replace("bounds",boundsStr);
            if($(list[1]).attr("id") == "pre_1" || $(list[1]).attr("id") == "pre_3" || $(list[1]).attr("id") == "pre_6" || $(list[1]).attr("id") == "pre_24"){
                var resolution = $(list[1]).attr("flag");
                url = url.replace("resolution",resolution).replace("resolution",resolution);
            }
        }
        else {
            var url = qdlytUrl[$("#satelliteType").find("button.active").attr("id")+"_"+$("#satelliteProduct").find("button.active").attr("id")];
        }
        return url;
    }

    //云图时段查询
    function getSatelliteTimes(){
        var time1 = t.myDateSelecter1.getCurrentTime();
        var time2 = t.myDateSelecter2.getCurrentTime();
        time1 = time1.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
        time2 = time2.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
        time1 = time1.substr(0,8)+"_"+time1.substr(8,4);
        time2 = time2.substr(0,8)+"_"+time2.substr(8,4);
        var paraUrl = getSatelliteUrl();
        //var paraUrl = "http://127.0.0.1:8080/testData/Himawari-8/IR1/H08_B13_R020_time.AWX_H08_B13_R020_time_70_10_150_60.png";
        var url=gsDataService + "services/DBService/getRadarByTimes";
        $.ajax({
            type: "POST",
            data: {"para": "{time1:'" + time1 + "',time2:'" + time2 + "',url:'" + paraUrl + "',format:'yyyyMMdd_HHmm'}"},
            url: url,
            dataType: "json",
            error:function(data){
                alertModal("查询云图出错");
            },
            success: function (data) {
                var content = "";
                for(var i=data.length-1;i>=0;i--){
                    var date  = new Date(data[i]);
                    content += "<div value="+data[i]+">"+date.getFullYear()+ "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2)+ ":" +(Array(2).join(0)+date.getMinutes()).slice(-2) + ":"+(Array(2).join(0)+0).slice(-2)+"</div>";
                }
                $("#timeListDiv").html(content);
                $("#timeListDiv").find("div").click(function(){
                    if($(this).hasClass("active"))
                        return;
                    $("#timeListDiv").find("div.active").removeClass("active");
                    $(this).addClass("active");
                    if($("#satelliteProduct").find("button.active").attr("id") == "mcs"){
                        var nowDate = new Date(parseInt($(this).attr("value")));
                        if($("#satelliteType").find("button.active").attr("id") == "Himawari-8")
                            nowDate.setHours(nowDate.getHours()-8);
                        var time = nowDate.getFullYear() +"-"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"-"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +" "+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +":"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
                        GDYB.AWXDataClass.display(null, $("#satelliteType").find("button.active").attr("id")+"_mcs",time);
                    }
                    else{
                        displaySatellite(parseInt($(this).attr("value")));
                    }
                });
                if($("#timeListDiv").find("div").length!=0){
                    $("#timeListDiv").find("div").eq(0).click();
                }
            }
        });
    }

    //最新云图 无数据则往前推四次
    function getNewSatellite(num ,time){
        var times = null;
        if(num == 0){
            clearSatelliteLayer();
            var nowDate = new Date();
            if($("#satelliteType").find("button.active").attr("id") == "Himawari-8"){
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%10,0,0);
                var hourSpan = 10;
            }
            else{
                var hourSpan = 30;
                nowDate.setHours(nowDate.getHours()+8);
                if(nowDate.getMinutes() > 45)
                    nowDate.setMinutes(45,0,0);
                else
                    nowDate.setMinutes(15,0,0);
            }
            times = nowDate.getTime();
        }
        else{
            times = time;
        }
        var paraUrl = getSatelliteUrl();
        var url=gsDataService + "services/DBService/getSatteliteByTimes";
        $.ajax({
            type: "POST",
            data: {"para": "{time:" + times + ",hourSpan:" + hourSpan + ",url:'" + paraUrl + "'}"},
            url: url,
            dataType: "json",
            error: function (data) {
                alertModal("查询云图出错");
            },
            success: function (data) {
                if(typeof (data) != "undefined"){
                    var nowDate = new Date(data);
                    nowDate.setHours(nowDate.getHours()-8);
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    displaySatellite(data);
                }
            }
        });

        /*if(num<3){
            var SatelliteParam = getSatelliteParam(times);
            getUrlExists(SatelliteParam.url,function(exist) {
                if (!exist) {
                    if($("#satelliteType").find("button.active").attr("id") == "Himawari-8")
                        var hourSpan = 10;
                    else
                        var hourSpan = 30;
                    num++;
                    getNewSatellite(num,times-hourSpan*60*1000);
                }
                else{
                    var nowDate = new Date(times)
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    displaySatellite(times);
                }
            });
        }*/
    }

    function clearSatelliteLayer(){
        var SatelliteList = GDYB.Page.curPage.map.getLayersByName("Satellite");
        if(SatelliteList){
            for(var i=0;i<SatelliteList.length;i++){
                GDYB.Page.curPage.map.removeLayer(SatelliteList[i]);
                SatelliteList[i].destroy();
            }
        }
    }

    function clearElement(obj){

    }

    function clearAllElement(){

    }

    function getMCS(times,num){
        if(typeof(times) == "undefined"){
            var nowDate = new Date();
            if($("#satelliteType").find("button.active").attr("id") == "Himawari-8"){
                nowDate.setHours(nowDate.getHours()-8);
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%10,0,0);
            }
            else{
                if(nowDate.getMinutes() > 45)
                    nowDate.setMinutes(45,0,0);
                else
                    nowDate.setMinutes(15,0,0);
            }
        }
        else{
            var nowDate = new Date(times);
        }
        var time = nowDate.getFullYear() +"-"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"-"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +" "+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +":"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
        GDYB.AWXDataClass.display(function(data){
            if(data.length == 0){
                if($("#satelliteType").find("button.active").attr("id") == "Himawari-8")
                    var hourSpan = 10;
                else
                    var hourSpan = 30;
                if(typeof (num) == "undefined")
                    getMCS(nowDate.getTime()-hourSpan*60*1000,1);
                else/* if(num<4)*/
                    getMCS(nowDate.getTime()-hourSpan*60*1000,num+1);
                return;
            }
            else{
                if($("#satelliteType").find("button.active").attr("id") == "Himawari-8")
                    nowDate.setHours(nowDate.getHours()+8);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, $("#satelliteType").find("button.active").attr("id")+"_mcs", time);
    }
}
ZHJCYTPageClass.prototype = new PageBase();