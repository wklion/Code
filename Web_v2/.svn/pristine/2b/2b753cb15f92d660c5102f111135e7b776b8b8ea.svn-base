/**
 * Created by Administrator on 2016/5/17.
 */
var qdlytUrl = {"Himawari-8_ir1":"/Satellite/Himawari-8/IR1/H08_B13_R020_time.AWX_bounds.png",
    "Himawari-8_ir3":"/Satellite/Himawari-8/IR3/H08_B03_R010_time.AWX_bounds.png",
    "Himawari-8_vis":"/Satellite/Himawari-8/VIS/H08_B09_R020_time.AWX_bounds.png",
    "Himawari-8_mcs":"D:/output/jsons/MCS/Himawari-8/H08_B13_R020_time.js",
    FY2E_ir1:"/Satellite/Image/IR1/ANI_IR1_R04_time_FY2E.AWX_bounds.png",
    FY2E_ir3:"/Satellite/Image/IR3/ANI_IR3_R04_time_FY2E.AWX_bounds.png",
    FY2E_vis:"/Satellite/Image/VIS/ANI_VIS_R04_time_FY2E.AWX_bounds.png",
    FY2E_mcs:"D:/output/jsons/MCS/FY2E/ANI_IR1_R04_time_FY2E.js",
    /*FY2E_amv_ir1:"/Satellite/Image/AWV/ANI_VIS_R04_time_FY2E.AWX_ANI_IR1_R04_time_FY2E_bounds.png",
    FY2E_amv_ir3:"/Satellite/Image/AWV/ANI_VIS_R04_time_FY2E.AWX_ANI_IR1_R04_time_FY2E_bounds.png",*/
    FY2E_clc:"/Satellite/Image/CLC/CLC_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_tpw:"/Satellite/Image/TPW/TPW_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_1:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_3:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_6:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_pre_24:"/Satellite/Image/PRE/PRE_resolution_OTG_time_FY2E.AWX_bounds.png",
    FY2E_uth:"/Satellite/Image/UTH/UTH_MLT_OTG_time_FY2E.AWX_bounds.png",
    FY2E_tbb:"/Satellite/Image/TBB/TBB_IR1_OTG_time_FY2E.AWX_bounds.png"
};
var qdlytBounds = {"Himawari-8_ir1":[88,30,112,45],
    "Himawari-8_ir3":[88,30,112,45],
    "Himawari-8_vis":[88,30,112,45],
    "Himawari-8_mcs":[88,30,112,45],
    FY2E_ir1:[50,-4,145,61],
    FY2E_ir3:[50,-4,145,61],
    FY2E_vis:[50,-4,145,61],
    FY2E_amv_ir1:[50,-4,145,61],
    FY2E_amv_ir3:[50,-4,145,61],
    FY2E_clc:[27,-60,147,60],
    FY2E_tpw:[27,-60,147,60],
    FY2E_pre_1:[37,0,137,50],
    FY2E_pre_3:[37,0,137,50],
    FY2E_pre_6:[37,0,137,50],
    FY2E_pre_24:[37,0,137,50],
    FY2E_uth:[27,-60,147,60],
    FY2E_tbb:[27,-60,147,60]
};

function QDLYTPageClass(){
    this.layerPlot = null;
    this.realTime = true;
    this.num = 0;
    this.layer = null;
    var t = this;
    this.keyDown = false;

    this.renderMenu = function() {
        var htmlStr = "<div style='padding-top: 15px;'>"
            +"<div id='satelliteDiv' class='btn_line1'>"
                +"<div id='satelliteType' style='margin: 5px 0px 0px 10px;' class='btn_line5'><div class='qdlTitleBar'>卫星：</div><div class='qdlContentDiv'><button id='FY2E'>风云2E</button><button id='FY2G' style='display: none'>风云2G</button><button id='Himawari-8' class='active'>葵花</button></div></div><div style='clear: both;'></div>"
                +"<div id='satelliteProduct' style='margin: 5px 0px 0px 10px;' class='btn_line5'><div class='qdlTitleBar'>通道：</div><div class='qdlContentDiv'><button id='ir1' class='active'>红外</button><button id='ir3'>水汽</button><button id='vis' >可见光</button><button id='mcs' >MCS</button></div></div><div style='clear: both;'></div>"
                +"<div id='satelliteNumerical' style='margin: 5px 0px 0px 10px;' class='btn_line5'><div class='qdlTitleBar'>产品：</div>"
                +"<div class='qdlContentDiv'><button id='clc' >CLC</button><!--<button id='amv_ir1'>AMV_IR1</button><button id='amv_ir3'>AMV_IR3</button>--><button id='tpw'>TPW</button>"
                +"<button id='pre_1' flag='001'>PRE_1</button><button id='pre_3' flag='003'>PRE_3</button><button id='pre_6' flag='006'>PRE_6</button><button id='pre_24' flag='024'>PRE_24</button>"
                +"<button id='uth'>UTH</button><button id='tbb'>TBB</button></div></div><div style='clear: both;'></div>"
            +"</div>"
            +"<div style='padding-top: 10px;'>"
                +"<div id='timeChoose' class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='margin-left: 15px;line-height: 22px;'></span></div>"
                +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 65px;'>6H</div><div class='rhjcHourSpan' style='width: 65px;'>12H</div><div class='rhjcHourSpan' style='width: 65px;'>24H</div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime' style='margin-left: 10px;'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>累加</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 20px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
                +"<div id='timeListDiv' class='timeListDiv' style='top: 380px;'></div>"
            +"</div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change'>强天气</div><div name='yjqs' class='menu_change' style='margin-top: 5px;'>雷达</div><div id='messageNum_yjqs' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div name='dqqs' class='menu_change active' style='margin-top: 5px;'>云图</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>融合监测</div>");
        this.myDateSelecter1 = new DateSelecter(0,0); //最小视图为天
        //this.myDateSelecter1.setCurrentTime("2017-06-27 07:00:00"); //演示用
        this.myDateSelecter1.changeHours(-6*60);
        this.myDateSelecter1.intervalMinutes = 60*1; //12小时
        this.myDateSelecter2 = new DateSelecter(0,0); //最小视图为天
        //this.myDateSelecter2.setCurrentTime("2017-06-27 09:00:00"); //演示用
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
//        this.myDateSelecter1.changeHours(min-min%6);
//        this.myDateSelecter2.changeHours(min-min%6);

        this.layer = null;
        this.animation = false;

        //选项卡切换
        $(".menu_changeDiv").find(".menu_change").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#messageDivs").hide();
            $(".menu_changeDiv").find(".active").removeClass("active");
            $(this).addClass("active");
            if ($(this).html() == "强天气") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLSKPage;
                GDYB.QDLSKPage.active();
            }
            else if ($(this).html() == "雷达") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLLDPage;
                GDYB.QDLLDPage.active();
            }
            else if ($(this).html() == "云图") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLYTPage;
                GDYB.QDLYTPage.active();
            }
            else if ($(this).html() == "融合监测") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLRHJCPage;
                GDYB.QDLRHJCPage.active();
            }
        });

        $("#query_action").find(".rhjcQueryTime").click(function(){
            if($(this).html() == "查询"){
                t.animation = false;
                if($("#hourRadio")[0].checked) {
                    getSatelliteTimes();
                }else{
                    alertModal("当前为实时");
                }
            }else if($(this).html() == "动画"){
                if($("#hourRadio")[0].checked) {
                    if($("#timeListDiv").find("div").length>0){
                        $(this).html("停止");
                        if(!t.animation){
                            t.animation = true;
                            animationShiKuang();
                        }
                    }else{
                        alertModal("无查询结果");
                    }
                }else{
                    alertModal("当前为实时");
                }
            }else if($(this).html() == "停止"){
                $(this).html("动画");
                t.animation = false;
            }else if($(this).html() == "累加"){

            }else{}
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
            refreshTitleDiv();
        });
        //通道点击
        $("#satelliteProduct").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#satelliteProduct").find("button.active").removeClass("active");
            $("#satelliteNumerical").find("button.active").removeClass("active");
            GDYB.Legend.update(null);
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
            refreshTitleDiv();
        });
        //二级产品点击
        $("#satelliteNumerical").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#satelliteProduct").find("button.active").removeClass("active");
            $("#satelliteNumerical").find("button.active").removeClass("active");
            if(this.id == "clc"){
                GDYB.Legend.update(heatMap_CLCStyles);
                $("#div_legend_items").find("div").css("width","100px");
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
            }
            else{
                GDYB.Legend.update(heatMap_SatellitePro);
                var list = $("#div_legend_items").find("div");
                for(var i=0;i<list.length;i++){
                    $(list[i]).attr("title",$(list[i]).html());
                }
                $("#div_legend_items").find("div").html("").css(
                    {width:"3px",
                    height:"20px",
                    padding:"0px",
                    border:"none"}
                );
            }
            $(this).addClass("active");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            if($("#hourRadio")[0].checked){
                $("#query_action").find("div").eq(0).click();
            }
            else{
                    getNewSatellite(0);
            }
            refreshTitleDiv();
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
            setTimeout(function(){
                refreshTitleDiv();
            },500);
        });
        $("#hourRadio").click(function(){
            t.realTime = false;
            $("#nowTime").html("");
            clearSatelliteLayer();
            GDYB.AWXDataClass.clearMCS();
            refreshTitleDiv();
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
        getNewSatellite(0);

        setTimeout(function(){
            GDYB.Page.curPage.map.zoomToExtent(new WeatherMap.Bounds(91,32,109,43));
            refreshTitleDiv();
        },500);
    };
    //动画
    function animationShiKuang(){
        if ($("#timeListDiv").find("div.active").prev().length != 0) {
            $("#timeListDiv").find("div.active").prev().click();
        }
        else{
            $("#timeListDiv").find("div").eq($("#timeListDiv").find("div").length-1).click();
        }
        setTimeout(function(){
            if(t.animation == true)
                animationShiKuang();
        },$("#animationSelect").val()*300);
    }
    //加载标题
    function refreshTitleDiv(){
        var titleHtml = "";
        $("#map_QDLtitle_div").css("display","block");
        var timeSelecter = $("#timeChoose input[type='radio']:checked").attr("id");//判断是实时还是时段
        var timeHtml = "";
        if(timeSelecter=="timeRadio"){
            timeHtml = $("#nowTime").html();
        }else{
            if($("#timeListDiv div").hasClass("active")){//时段查询后列表中选择时刻
                var h = $("#timeListDiv div.active").html();
                timeHtml = h.substr(0,4)+"年"+h.substr(5,2)+"月"+ h.substr(8,2)+"日"+h.substr(11,2)+"时"+h.substr(14,2)+"分";
            }else{//时段查询后列表中未选择时刻（点击查询按钮触发）
                timeHtml = "";
            }
        }
        var st = $("#satelliteType button.active").html();
        if($("#satelliteProduct button").hasClass("active")){
            var sp = $("#satelliteProduct button.active").html();
            titleHtml += ("<p>"+timeHtml+"&nbsp;&nbsp;"+ st +" "+ sp +"</p>");
        }else{
            var sn = $("#satelliteNumerical button.active").html();
            titleHtml += ("<p>"+timeHtml+"&nbsp;&nbsp;"+ st +" "+ sn +"</p>");
        }
        $("#map_QDLtitle_div").html(titleHtml);
    }

    if(!this.keyDown){
        this.keyDown = true;
        $(document).keydown(function (event) {
            if(GDYB.Page.curPage != GDYB.QDLYTPage)
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
                else
                    return;
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
//         t.layer = new WeatherMap.Layer.Image(
//         "Satellite",
//         SatelliteParam.url,
//         SatelliteParam.bounds ,
//         options
//         );
//         t.layer.setOpacity(0.7);
//         GDYB.Page.curPage.map.addLayer(t.layer);

        if(t.layer == null || t.layer.map == null){
            t.layer = new WeatherMap.Layer.Image(
                "Satellite",
                SatelliteParam.url,
                SatelliteParam.bounds,
                options
            );
            t.layer.setOpacity(0.7);
//            t.layer.transparentColors = t.colors;
            GDYB.Page.curPage.map.addLayer(t.layer);
        }
        else{
            t.layer.url = SatelliteParam.url;
            t.layer.extent = SatelliteParam.bounds;
            t.layer.maxExtent = SatelliteParam.bounds;
            t.layer.orgImageData = null;
            t.layer.memoryImg = null;
            t.layer.redraw();
        }
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
            var url = imgCachePath;
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
                if(data.length == 0){
                    alertModal("该时段无数据");
                    return;
                }
                var content = "";
                cacheImgs(data);
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
                    refreshTitleDiv();
                });
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-06-19
     * @return:
     * @description:缓存雷达图片
     */
    function cacheImgs(dates){
        var size = dates.length;
        var arr =[];
        for(var i=0;i<size;i++){
            var radarParam = getSatelliteParam(dates[i]);
            arr.push(radarParam.url);
        }
        console.log("共"+size+"图片!开始缓存!");
        if(size<1){
            return;
        }
        $('canvas.process').css("display","block");
        $('canvas.process').text(0+"%");
        drawProcess(200);
        $.imgpreload(arr,{
            each:function(e){
                e[e.length-1].crossOrigin="anonymous";
                var proSize = parseInt(e.length*100/size);
                $('canvas.process').text(proSize+"%");
                drawProcess(200);
            },
            all:function(){
                $('canvas.process').css("display","none");
                console.log("所有加载完毕!");
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
            var hourSpan = "";
            if($("#satelliteType").find("button.active").attr("id") == "Himawari-8"){
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%10,0,0);
                hourSpan = 10;
            }
            else{
                hourSpan = 15;
                nowDate.setHours(nowDate.getHours()+8);
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%15,0,0);
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
                    if(hourSpan == 10){}
                    else
                        nowDate.setHours(nowDate.getHours()-8);
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    //displaySatellite(nowDate.getTime());
                    displaySatellite(data);
                    refreshTitleDiv();
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
        // 轮询刷新数据
        setTimeout(function () {
            if (t.realTime && GDYB.Page.curPage == GDYB.QDLYTPage)
                getNewSatellite(0);
        }, 1000*60*5);
    }

    function clearSatelliteLayer(){
//        var SatelliteList = GDYB.Page.curPage.map.getLayersByName("Satellite");
//        if(SatelliteList){
//            for(var i=0;i<SatelliteList.length;i++){
//                GDYB.Page.curPage.map.removeLayer(SatelliteList[i]);
//                SatelliteList[i].destroy();
//            }
//        }
    }

    function clearElement(obj){

    }

    function clearAllElement(){

    }
//获取最新mcs
    function getMCS(times,num){
        if(typeof(times) == "undefined"){
            var nowDate = new Date();
            if($("#satelliteType").find("button.active").attr("id") == "Himawari-8"){
                nowDate.setHours(nowDate.getHours()-8);
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%10,0,0);
            }
            else{
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%15,0,0);
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
                    var hourSpan = 15;
                if(typeof (num) == "undefined")
                    getMCS(nowDate.getTime()-hourSpan*60*1000,1);
                else if(num<10)
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
QDLYTPageClass.prototype = new PageBase();