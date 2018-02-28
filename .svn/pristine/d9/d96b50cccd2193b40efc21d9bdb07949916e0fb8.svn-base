/**
 * Created by zouwei on 2016/3/4.
 */
function DisplayPageClass(){
    this.myDateSelecter = null;
    this.currentPosition = {lon:103.8,lat:36.1};
    this.numbers = [12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240];
    this.hourSpan = null;
    this.conditionMark = "normal";//要素选择是否是功能按钮
    var t = this;

    this.renderMenu = function() {
        var vectorLayer = new WeatherMap.Layer.Vector("Vector Layer");//初始化图层
        GDYB.Page.curPage.map.addLayer(vectorLayer);
        t.areasLayer = new WeatherMap.Layer.Vector("Areas Layer", {renderers: ["Canvas2"]});//地区图层
        t.areasLayer.style = {
            fillOpacity: "0"
        };
        GDYB.Page.curPage.map.addLayer(t.areasLayer);
        var boundLayer = new WeatherMap.Layer.Vector("Bound Layer");//新建边界图层
        GDYB.Page.curPage.map.addLayer(boundLayer);
        t.newInitBound(boundLayer,t.areasLayer);


        t.myDateSelecter = new DateSelecter(2,2);
        t.myDateSelecter.intervalMinutes = 60*24; //24小时
        $("#dateSelect").html(this.myDateSelecter.div);
        t.showTimeSlide();//添加底部时间进度条
        t.hourSpan = t.numbers[0];

        $("#dateSelect").find("img").css("display","none");
        $("#dateSelect").find("input").css("border","none").css("box-shadow","none").css("color","white").css("width","80px").css("height","27px");

        $("#zoomIn").click(function(){
            GDYB.Page.curPage.map.zoomIn();
        });
        $("#zoomOut").click(function(){
            GDYB.Page.curPage.map.zoomOut();
        });

        //右键菜单
        var strHtml = '';
        strHtml +='<div id="panelHost">'
            +'<div id="zoom" class="">'
            +'<div id="zoomIn" class="zoomTip" title="放大" data-toggle="tooltip" data-placement="left">+</div>'
            +'<div id="zoomOut" class="zoomTip" title="缩小" data-toggle="tooltip" data-placement="left">-</div>'
            +'<div id="viewEntire" class="zoomTip" title="全图" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-zhuye"></i></div>'
            +'</div>'
            +'<div id="elementDiv" class="">'
            +'<div class="listMenu page1" value="r12" title="日降水量" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-jiangshuiliang"></i></div>'
            +'<div class="listMenu page1" value="tmax" title="日最高温" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-wendumax"></i></div>'
            +'<div class="listMenu page1" value="tmin" title="日最低温" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-wendumin"></i></div>'
            +'<div class="listMenu page1" value="wmax" title="日最大风" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-dafeng"></i></div>'
            +'<div class="listMenu page1" value="w" title="天气" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-tianqi"></i></div>'
            +'<div class="listMenu page1" value="r3" title="降水量" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-shui"></i></div>'
            +'<div class="listMenu page1" value="2t" title="气温" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-qiwen"></i></div>'
            +'<div class="listMenu page1" value="10uv" title="风" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-feng"></i></div>'
            +'<div class="listMenu page1" value="tcc" title="云量" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-yun"></i></div>'
            +'<div class="listMenu page1" value="vis" title="能见度" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-nengjiandu"></i></div>'
            +'<div class="listMenu page2 hide" value="rh" title="相对湿度" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-shidu"></i></div>'
            +'<div class="listMenu page2 hide" value="pph" title="相态" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-xiangtai"></i></div>'
            +'<div class="listMenu page2 hide" value="fog" title="雾" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-tq-wu"></i></div>'
            +'<div class="listMenu page2 hide" value="hz" title="霾" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-tq-mai"></i></div>'
            +'<div class="listMenu page2 hide" value="sand" title="沙尘" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-tq-shachenbao"></i></div>'
            +'<div class="listMenu page2 hide" value="rat" title="短时强降水" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-duanshiqiangjiangshui"></i></div>'
            +'<div class="listMenu page2 hide" value="hail" title="冰雹" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-tq-bingbao"></i></div>'
            +'<div class="listMenu page2 hide" value="ssm" title="雷暴" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-leibao"></i></div>'
            +'<div class="listMenu page2 hide" value="smg" title="雷暴大风" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-leibaodafeng"></i></div>'
            +'<div class="listMenu page2 hide" value="air" title="空气污染等级" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-wuran"></i></div>'
            +'<div id="turnToPage" class="listMenu page1" value="" title="更多" data-toggle="tooltip" data-placement="left"><i class="iconfont icon-diandiandian"></i></div>'
            +'<div id="addList" style="">'
            +'<div id="traffic" title="专题预报" data-toggle="tooltip" data-placement="top" class="addListMenu"><i class="iconfont icon-jiaotong"></i></div>'
            +'<div id="travel" title="旅游路线" data-toggle="tooltip" data-placement="top" class="addListMenu"><i class="iconfont icon-lvyou"></i></div>'
            //+'<div id="roads" title="路段天气" data-toggle="tooltip" data-placement="top" class="addListMenu"><i class="iconfont icon-flag_fill"></i></div>'
            +'<div id="scenicArea" title="旅游景区" data-toggle="tooltip" data-placement="top" class="addListMenu"><i class="iconfont icon-flag_fill"></i></div>'
            +'</div>'
            +'</div>'
            +'</div>';
        $("#rightPanel").html(strHtml);

        $("#zoomIn").click(function(){
            GDYB.Page.curPage.map.zoomIn();
        });
        $("#zoomOut").click(function(){
            GDYB.Page.curPage.map.zoomOut();
        });
        $("#zoom3Into div").click(function(){
            var vl = GDYB.Page.curPage.map.getLayersByName("vectorLine");
            if(vl.length == 0) return;
            var lineVector = vl[0].features[0];
            var x = parseFloat((lineVector.geometry.bounds.right + lineVector.geometry.bounds.left)/2);
            var y = parseFloat((lineVector.geometry.bounds.top + lineVector.geometry.bounds.bottom)/2);
            var zoomSet = parseInt($(this).attr("flag"));
            GDYB.Page.curPage.map.setCenter(new WeatherMap.LonLat(x, y), zoomSet)
        });
        //切换要素
        $("#turnToPage").click(function(){
            if($(this).hasClass("page1")){
                $(this).removeClass("page1").addClass("page2");
                $("#elementDiv").find(".page1").addClass("hide");
                $("#elementDiv").find(".page2").removeClass("hide");
            } else {
                $(this).removeClass("page2").addClass("page1");
                $("#elementDiv").find(".page2").addClass("hide");
                $("#elementDiv").find(".page1").removeClass("hide");
            }
        });
        //全图功能
        $("#viewEntire").click(function(){
            var map = GDYB.Page.curPage.map;
            var mapDivWidth = ($("#map_div").css("width").split("p"))[0];
            var mapDivHeight = ($("#map_div").css("height").split("p"))[0];
            var mapWidth;
            var mapHeight;
            var scales = map.baseLayer.scales;
            var dpi = getDPI()[0];
            var zoomInt = 6;
            for(var i=12;i>1;i--){
                mapWidth = parseInt((111*(108.7-92.3)*1000*100/2.54*dpi)/(1/scales[i]));
                mapHeight = parseInt((108*(42.8-32.6)*1000*100/2.54*dpi)/(1/scales[i]));
                if(mapWidth<mapDivWidth && mapHeight<mapDivHeight){
                    zoomInt = i;
                    break;
                }
            }
            map.setCenter(new WeatherMap.LonLat(100.5, 37.7), zoomInt);

            //获取计算机dpi
            function getDPI() {
                var arrDPI = [];
                if (window.screen.deviceXDPI) {
                    arrDPI[0] = window.screen.deviceXDPI;
                    arrDPI[1] = window.screen.deviceYDPI;
                }
                else {
                    var tmpNode = document.createElement("DIV");
                    tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
                    document.body.appendChild(tmpNode);
                    arrDPI[0] = parseInt(tmpNode.offsetWidth);
                    arrDPI[1] = parseInt(tmpNode.offsetHeight);
                    tmpNode.parentNode.removeChild(tmpNode);
                }
                return arrDPI;
            }
        });

        //登录
        $("#login").find("a").click(function(){
            if(this.id == "a_exit"){
                window.location.href="index.html";
            }
            else{
                $("#span_user")[0].innerHTML = "";
                $.cookie('password', '', { expires: -1 });      //如果退出，不记录密码
                $.cookie("rmbUser", 'false', { expire: -1 });   //如果退出，不记录密码
                $("#a_exit").css("display","block");
                $("#a_signout").css("display","none");
                $("#span_user").css("display","none");
            }
        });

        var userName = $.cookie("userName");
        var password = $.cookie("password");
        if (userName != null && password != null) {
            if(typeof($("#span_user")[0]) != "undefined" && typeof($("#a_exit")[0]) != "undefined"){
                $("#span_user")[0].innerHTML = $.cookie("showName");
                $("#span_user").css("display","");
                $("#a_exit").css("display","none");
                $("#a_signout").css("display","block");
            }
        }
        else{
            if(typeof($("#a_exit")[0]) != "undefined"){
                $("#a_exit").css("display","block");
                $("#a_signout").css("display","none");
            }
        }

        $("#user_img").click(function(){
            if($("#user_hid").is(":hidden")){
                $("#user_hid").slideDown();
            }
            else{
                $("#user_hid").css("display","none");
            }
        });

        //添加导航栏提示
        $(function () {
            options={
                delay: { show: 0, hide: 100 },
                trigger:'hover'
            };
            $("[data-toggle='tooltip']").tooltip(options);
        });

        //改变制作时间
        this.myDateSelecter.input.change(function(){
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.showTimeSlide();
            onChangeDateTime();
        });

        //改变制作时次
        $("#selectMakeTime").change(function() {
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.showTimeSlide();
            onChangeDateTime();
        });

        //改变产品类型
        $("#selectProductType").change(function() {
            initProductType();
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.showTimeSlide();
            onChangeDateTime();
            hidChartDiv();
        });

        //改变要素

        //_功能要素
        $("#addList").find(".addListMenu").click(function(){
            $(".chartDiv").hide();//隐藏图表
            t.clearStreamLayerDate();//清除格点图层
            $(".windowInfo").remove();//清除标记div
            $(".windowInfoJQ").remove();//清除标记div
            vectorLayer.removeAllFeatures();//清除标记
            clearWeatherColor();//清除填色
            if(GDYB.GridProductClass.layerMarkers != null)
                GDYB.GridProductClass.layerMarkers.clearMarkers();
            $(GDYB.Page.curPage.baseLayer.div).css("filter","brightness(1)");
            if($(this).hasClass("active"))
                return;
            $("#elementDiv").find(".listMenu").removeClass("active");
            $("#addList").find(".addListMenu").removeClass("active");
            $(this).addClass("active");
            var elementId = $(this).attr("id");
            if(elementId=="traffic"){
                t.conditionMark = "traffic";
                $("#windowPlay").hide();
                $("#windowTraff").show();
                $("#windowScenicArea").hide();
                t.selectFeature.activate();
                creatTrafficTable();
            }else if(elementId=="travel"){
                t.conditionMark = "travel";
                $("#windowPlay").show();
                $("#windowTraff").hide();
                $("#windowScenicArea").hide();
                clearTraffFeature();//清除专题预报交通区域图层
            }else if(elementId=="roads"){
                t.conditionMark = "roads";
                $("#windowTraff").hide();
                $("#windowPlay").hide();
                $("#windowScenicArea").hide();
                clearTraffFeature();//清除专题预报交通区域图层
            }else if(elementId=="scenicArea"){
                t.conditionMark = "scenicArea";
                $("#windowTraff").hide();
                $("#windowPlay").hide();
                $("#windowScenicArea").show();
                clearTraffFeature();//清除专题预报交通区域图层
                getStationForecast(getForecastRecall, [5]);
            }
            else{}
        });
        //_天气要素
        $("#elementDiv").find(".listMenu").click(function() {
            if($(this).attr("id") == "turnToPage"){
                return;
            }
            $(".chartDiv").show();//显示图表
            $("#windowPlay").hide();//隐藏旅游路线div
            $("#windowTraff").hide();//隐藏专题预报交通区域div
            $("#windowScenicArea").hide();//隐藏景区级别选择div
            $(".windowInfo").remove();//清除标记div
            $(".windowInfoJQ").remove();//清除标记div
            clearTraffFeature();//清除专题预报交通区域图层
            vectorLayer.removeAllFeatures();//清除标记
            clearWeatherColor();//清除填色
            if(GDYB.GridProductClass.layerMarkers != null)
                GDYB.GridProductClass.layerMarkers.clearMarkers();
            $(GDYB.Page.curPage.baseLayer.div).css("filter","brightness(1)");
            if($(this).hasClass("active"))
                return;
            $("#elementDiv").find(".listMenu").removeClass("active");
            $("#addList").find(".addListMenu").removeClass("active");
            $(this).addClass("active");
            var element = $(this).attr("value");
            t.numbers = GDYB.GDYBPage.getHourSpan(element);
            t.hourSpan = t.numbers[0];
            if($("#playpause").attr("flag")=="playing"){
                $("#playpause").click();
            }
            t.showTimeSlide();//重新加载底部进度条
            onChangeDateTime();//改变时间事件
            hidChartDiv();//收起图表
            t.conditionMark = "normal";//标记条件要素
        });

        //鼠标点击事件
        var map = t.map;
        map.events.register("click", map, function(event){
            var mark = t.conditionMark;
            //功能点击事件
            if(mark=="traffic"){
                return;
            }else if(mark=="travel"){
                if(GDYB.GridProductClass.layerMarkers != null)
                    GDYB.GridProductClass.layerMarkers.clearMarkers();
                if(!editSwitch) return;//不可编辑
                var lonLat = this.getLonLatFromPixel(event.xy);
                var arrayPoint = [];
                arrayPoint.push({x:lonLat.lon,y:lonLat.lat});
                var pointFeature = addPoints(lonLat);//生成点
                var pointFeatures = [];
                pointFeatures.push(pointFeature);
                addPointsLine("test");//生成线
                //获取天气情况
                t.displayWeatherAsLonLat(arrayPoint, pointFeatures, new Date(), getLYWeather);
            }else if(mark=="roads"){
                alertModal("功能未完成");
            }else if(mark=="scenicArea"){
                return;//无地图点击事件
            }else{
                t.currentPosition = this.getLonLatFromPixel(event.xy);
                if(GDYB.GridProductClass.layerMarkers == null){
                    GDYB.GridProductClass.layerMarkers = new WeatherMap.Layer.Markers("layerMarkers");
                    GDYB.Page.curPage.map.addLayers([GDYB.GridProductClass.layerMarkers]);
                }
                GDYB.GridProductClass.layerMarkers.clearMarkers();
                var size = new WeatherMap.Size(25,30);
                var offset = new WeatherMap.Pixel(-(size.w/2), -size.h);
                var icon = new WeatherMap.Icon('imgs/marker.png', size, offset);
                GDYB.GridProductClass.layerMarkers.addMarker(new WeatherMap.Marker(new WeatherMap.LonLat(t.currentPosition.lon,t.currentPosition.lat),icon));
                t.displayGridValueSerial(); //时间改变，同时更新图表
                t.displayWeatherDescription(); //天气概况
            }
        });

        //清除填色
        function clearWeatherColor(){
            if(GDYB.GridProductClass.layerFillRangeColor != null)
                GDYB.GridProductClass.layerFillRangeColor.setDatasetGrid(null);
            if(t.layerFillRangeColor != null)
                t.layerFillRangeColor.setDatasetGrid(null);
        }

        //生成点
        function addPoints(lonLat){
            var geometry = new WeatherMap.Geometry.Point(lonLat.lon,lonLat.lat);
            var pointFeature = new WeatherMap.Feature.Vector(geometry);
            pointFeature.id = (lonLat.lon+lonLat.lat).toString();
            var styleTest = {
                externalGraphic: "imgs/timger.gif",
                pointRadius: 100,
                graphicYOffset: -140,
                graphicOpacity: 0.8
            };
            pointFeature.style = styleTest;
            vectorLayer.addFeatures([pointFeature]);
            return pointFeature;
        }

        //生成点
        function addPointsJQ(lonLat){
            var geometry = new WeatherMap.Geometry.Point(lonLat.lon,lonLat.lat);
            var pointFeature = new WeatherMap.Feature.Vector(geometry);
            pointFeature.id = (lonLat.lon+lonLat.lat).toString();
            var styleTest = {
                externalGraphic: "imgs/winBottom.png",
                pointRadius: 25,
                graphicOpacity: 0.5
            };
            pointFeature.style = styleTest;
            vectorLayer.addFeatures([pointFeature]);
            return pointFeature;
        }

        //生成线
        function addPointsLine(){
            if(vectorLayer.getFeatureById("test")!=null){
                vectorLayer.removeFeatures([vectorLayer.getFeatureById("test")]);
            }
            var features = vectorLayer.features;//获取点的数组
            var pointList = [];
            for(var i=0;i<features.length;i++){
                pointList.push(features[i].geometry);
            }
            var line = new WeatherMap.Geometry.LineString(pointList);
            var lineFeature = new WeatherMap.Feature.Vector(line);
            lineFeature.id = "test";
            lineFeature.style = {
                strokeColor:"rgb(15,50,220)",
                strokeWidth:3,
                strokeOpacity:0.5
            };
            vectorLayer.addFeatures([lineFeature]);
        }

        //功能菜单
        var saveState = false;//是否有未保存的路线
        var editSwitch = false;//旅游路线是否可编辑(默认false)
        var lines = [
            {code:1,title:"甘肃丝绸之路精品旅游线",points:[1,104.92,33.40,2,105.72,34.58,3,104.62,35.58,4,103.84,36.06,5,100.45,38.92,6,98.29,39.77,7,94.66,40.14],creattime:"2017-5-10"},
            {code:2,title:"环青海湖自行车赛线路",points:[1,101.41,36.67,2,101.43,37.46,3,100.23,38.18,4,100.13,37.33,5,99.61,36.99,6,100.12,36.64,7,101.42,36.05,8,101.76,36.62,9,102.38,36.48,10,103.22,35.57,11,103.38,35.42,12,104.63,35.59,13,105.69,34.57,14,106.21,34.99,15,106.67,35.54,16,105.92,36.91,17,105.18,37.47,18,106.21,38.49],creattime:"2017-8-22"},
            {code:3,title:"甘肃南部草原风光旅游线",points:[1,103.84,36.06,2,103.21,35.60,3,102.52,35.20,4,103.36,34.69,5,102.49,34.59,6,102.07,34.00],creattime:"2017-5-11"},
            {code:4,title:"甘肃黄河风情旅游线",points:[1,103.84,36.06,2,104.14,36.55,3,104.06,37.18],creattime:"2017-5-11"},
            {code:5,title:"甘肃东部古迹寻迹旅游线",points:[1,103.84,36.06,2,105.73,34.58,3,106.67,35.54,4,107.64,35.71],creattime:"2017-5-12"},
            {code:6,title:"甘肃南部自然生态旅游线",points:[1,103.84,36.06,2,104.47,34.85,3,104.39,34.05,4,104.93,33.39],creattime:"2017-5-13"}];//路线test

        var cElement = $("#addList").children("div").length;
        $("#addList").css("width",(40*cElement+45)+"px");

        var $windowHtml = $('<div id="windowPlay" class="panel panel-default windowPlay">'
            +'<div class="panel-heading" onmousedown="dragPanel(document.getElementById(\'windowPlay\'),event)" style="height: 32px;line-height: 32px;padding: 0;padding-left: 12px;opacity: 0.9;">路线名称<i class="iconHide iconfont icon-shangsanjiao"></i></div>'
            +'<div class="tableHead"><table style="width: 95%;max-width: 100%;height: 32px;line-height: 32px;margin: 1px 0 -1px 15px;"><thead><td width="40">编号</td><td width="180">旅游路线</td><td width="120">创建时间</td><td>操作</td><i id="addLine" class="iconfont icon-jia" title="添加旅游路线"></i><div id="addWindow"><span style="color: #fff;">路线名称</span><input/><span style="color: #ddd;">(请在地图上创建路线并保存)</span><button id="saveLine">保存路线</button></div></thead></table></div>'
            +'<div class="panel-body" style="height: 80%; overflow: auto;padding: 0;">'
            +'<table id="playTable" class="table"></table>'
            +'</div>'
            +'</div>').appendTo($("body"));
        $windowHtml.find(".iconHide").click(function(){
            if($(this).hasClass("icon-xiasanjiao")){
                $(this).removeClass("icon-xiasanjiao").addClass("icon-shangsanjiao");
                $("#windowPlay").animate({height:"320px"});
                $(".tableHead,.panel-body").show();
            }else{
                $(this).removeClass("icon-shangsanjiao").addClass("icon-xiasanjiao");
                $("#windowPlay").animate({height:"32px"});
                $(".tableHead,.panel-body").hide();
            }
        });
        var $windowHtml1 = $('<div id="windowTraff" class="panel panel-default windowTraff">'
            +'<div class="panel-heading" onmousedown="dragPanel(document.getElementById(\'windowTraff\'),event)" style="height: 32px;line-height: 32px;padding: 0;padding-left: 12px;opacity: 0.9;">所选区域<i id="makeWord" title="生成报文" class="iconfont icon-wendang"></i><i class="iconHide iconfont icon-shangsanjiao"></i></div>'
            +'<div class="tableHead"><table style="width: 95%;max-width: 100%;height: 32px;line-height: 32px;"><thead><td>地区</td><td>代表站</td><td>删除</td></thead></table></div>'
            +'<div class="panel-body" style="height: 83%; overflow: auto;padding: 0;">'
            +'<table id="traffTable" class="table"></table>'
            +'</div>'
            +'</div>').appendTo($("body"));
        $windowHtml1.find(".iconHide").click(function(){
            if($(this).hasClass("icon-xiasanjiao")){
                $(this).removeClass("icon-xiasanjiao").addClass("icon-shangsanjiao");
                $("#windowTraff").animate({height:"380"});
                $(".tableHead,.panel-body").show();
            }else{
                $(this).removeClass("icon-shangsanjiao").addClass("icon-xiasanjiao");
                $("#windowTraff").animate({height:"32px"});
                $(".tableHead,.panel-body").hide();
            }
        });
        var $windowHtml = $('<div id="windowScenicArea" class="panel panel-default windowScenicArea">'
            +'<div class="panel-heading" onmousedown="dragPanel(document.getElementById(\'windowScenicArea\'),event)" style="height: 32px;line-height: 32px;padding: 0;padding-left: 12px;opacity: 0.9;">景区级别选择<i class="iconHide iconfont icon-shangsanjiao"></i></div>'
            +'<div class="tableHead"></div>'
            +'<div class="panel-body" style="height: 80%; overflow: auto;padding: 0;">'
            +'<div class="scenicCheck">'
            +'<input type="checkbox" id="checkbox1" value="5" checked/>5A级<label for="checkbox1"></label>'
            +'</div><div class="scenicCheck">'
            +'<input type="checkbox" id="checkbox2" value="4"/>4A级<label for="checkbox2"></label>'
            +'</div><div class="scenicCheck">'
            +'<input type="checkbox" id="checkbox3" value="3"/>3A级<label for="checkbox3"></label>'
            +'</div><div class="scenicCheck">'
            +'<input type="checkbox" id="checkbox4" value="2"/>2A级<label for="checkbox4"></label>'
            +'</div><div class="scenicCheck">'
            +'<input type="checkbox" id="checkbox5" value="1"/>1A级<label for="checkbox5"></label>'
            +'</div>'
            +'</div>'
            +'</div>').appendTo($("body"));
        $windowHtml.find(".iconHide").click(function(){
            if($(this).hasClass("icon-xiasanjiao")){
                $(this).removeClass("icon-xiasanjiao").addClass("icon-shangsanjiao");
                $("#windowScenicArea").animate({height:"210px"});
                $(".tableHead,.panel-body").show();
            }else{
                $(this).removeClass("icon-shangsanjiao").addClass("icon-xiasanjiao");
                $("#windowScenicArea").animate({height:"32px"});
                $(".tableHead,.panel-body").hide();
            }
        });
        var tableHtml = '';
        for(var i=0;i<lines.length;i++){
            tableHtml += '<tr flag="'+lines[i].code+'"><td width="50px" style="text-align: center;">'+lines[i].code+'</td><td class="titleText" width="180">'+lines[i].title+'</td><td width="120">'+lines[i].creattime+'</td><td class="handleIcon"><i title="修改" class="iconfont icon-qianbi"></i>&nbsp;/&nbsp;<i title="删除" class="iconfont icon-shanchu"></i></td></tr>'
        }
        $("#playTable").html(tableHtml);

        $("#playTable").find("tr").click(function(){
            var qianbi = $(this).find("td i:eq(0)").hasClass("icon-qianbi");
            if(saveState&&qianbi){
                alertModal("路线未保存");
                return;
            }
            $(this).parent().find("tr").removeClass("active");
            $(this).addClass("active");
            showLine($(this).attr("flag"));
        });
        //显示旅游线路
        function showLine(flag){
            $(".windowInfo").remove();//清除标记div
            vectorLayer.removeAllFeatures();//清除标记
            var code = "";
            var title = "";
            var points = [];
            var creattime = "";
            for(i=0;i<lines.length;i++){
                if(lines[i].code==flag){
                    code = lines[i].code;
                    title = lines[i].title;
                    points = lines[i].points;
                    creattime = lines[i].creattime;
                }
            }
            var pointFeatures = [];
            var arrayPoint = [];
            for(i=1;i<points.length;i++){
                var lonLat = {lon:points[i],lat:points[i+1]};
                i+=2;
                var pointFeature = addPoints(lonLat);
                pointFeatures.push(pointFeature);
                arrayPoint.push({x:lonLat.lon,y:lonLat.lat});
            }
            t.displayWeatherAsLonLat(arrayPoint, pointFeatures, new Date(), getLYWeather);
            addPointsLine();
        }
        //添加旅游路线
        $("#addLine").click(function(){
            if($("#addWindow").css("display")=="block") $("#addWindow").hide();
            else {
                $("#addWindow").show();
                $("#addWindow").find("input:text").val("请填写路线").select();
            }
            var bs = parseInt($(this).css("transform"));
            if($("#addWindow").css("display")=="block") bs=-45;
            else bs=0;
            $(this).animate({borderSpacing:bs}, {step: function(now,fx) {
                $(this).css('-webkit-transform','rotate('+now+'deg)');
                $(this).css('-moz-transform','rotate('+now+'deg)');
                $(this).css('-ms-transform','rotate('+now+'deg)');
                $(this).css('-o-transform','rotate('+now+'deg)');
                $(this).css('transform','rotate('+now+'deg)');
            },duration:'slow' },'linear');
        });

        //修改旅游路线事件
        $(".handleIcon").find("i:eq(0)").click(function(){
            var $this_parents = $(this).parent().parent();//当前<tr>
            var $targetTd = $this_parents.find("td:eq(1)");//当前<tr>中title栏中的<td>对象
            var obj_text = $this_parents.find("input:text");//title栏中
            var lineNum = parseInt($this_parents.find("td:eq(0)").html());
            if(!saveState||$(this).hasClass("icon-baocun")){
                if(!obj_text.length){
                    $(this).removeClass("icon-qianbi").addClass("icon-baocun");
                    $targetTd.html("<input type='text' value='"+$targetTd.html()+"'>");
                    $this_parents.find("td:eq(1)").find("input:text").select();
                    saveState = true;
                    editSwitch = true;
                }
                else {
                    $(this).removeClass("icon-baocun").addClass("icon-qianbi");
                    $targetTd.html(obj_text.val());
                    saveState = false;
                    editSwitch = false;
                }
            }else{
                //无效操作
            }
        });
        //确认删除旅游路线的模态窗
        $(".handleIcon").find("i:eq(1)").click(function(){
            if(!saveState){
                var $this_parents = $(this).parent().parent();
                var lineTitle = $this_parents.find("td:eq(1)").html();
                var lineNum = $this_parents.find("td:eq(0)").html();
                $("#div_modal_confirm_content").html("确认删除【"+ lineTitle +"】");
                $("#div_modal_confirm").modal();
                $("#div_modal_confirm").find("a").unbind();
                $("#div_modal_confirm").find("a").click(function(){
                    if(typeof(this.id) != "undefined"){
                        if(this.id == "btn_ok") {
                            $this_parents.remove();//表格中移除
                        }
                    }
                })
            }else{
                //无效操作
            }
        });

        //专题预报生成报文
        $("#makeWord").click(function(){
            //获取区域站站点坐标
            var stationLonLats = [];
            for(var i in stations){
                stationLonLats.push({Lon:stations[i].attributes.STATIONX,Lat:stations[i].attributes.STATIONY,stationName:stations[i].attributes.STATIONNAM});
            }
            //根据区域站坐标查询温度降水天气
            var arrayPoint = [];
            var stationNames = [];
                for(var i in stationLonLats){
                arrayPoint.push({x:stationLonLats[i].Lon,y:stationLonLats[i].Lat});
                stationNames.push(stationLonLats[i].stationName);
            }
            t.displayWeatherAsLonLat(arrayPoint, null, new Date(), writeData);

            //制作报文导出word文件
            function writeData(dataImtes){
                var datetime = (new Date).format("yyyyMMdd");
                var timeCon = (new Date).format("yyyyMMdd_hhmm");
                var productName = timeCon + "预报表格";
                var title = "区域站天气情况预报表格【" + datetime +"】";
                //添加word文档表述内容content
                var staHTML = "";
                for(var i in stations){
                    staHTML += stations[i].attributes.STATIONNAM+" ";
                }
                var content = staHTML+"的天气情况";
                var stationList = [];
                for(var i in stations){
                    stationList.push({
                        station : stations[i].attributes.STATIONNAM,//区域站名
                        t1 : dateNumFormat(1),//时间：第一天
                        tmin1 : getStatisticValue(dataImtes,i,"tmin",0,24,1)+" ℃",//最低气温
                        tmax1 : getStatisticValue(dataImtes,i,"tmax",0,24,2)+" ℃",//最高气温
                        rain1 : getStatisticValue(dataImtes,i,"r3",0,24,0)+" mm",//降水
                        t2 : dateNumFormat(2),
                        tmin2 : getStatisticValue(dataImtes,i,"tmin",24,48,1)+" ℃",
                        tmax2 : getStatisticValue(dataImtes,i,"tmax",24,48,2)+" ℃",
                        rain2 : getStatisticValue(dataImtes,i,"r3",24,48,0)+" mm",
                        t3 : dateNumFormat(3),
                        tmin3 : getStatisticValue(dataImtes,i,"tmin",48,72,1)+" ℃",
                        tmax3 : getStatisticValue(dataImtes,i,"tmax",48,72,2)+" ℃",
                        rain3 : getStatisticValue(dataImtes,i,"r3",48,72,0)+" mm",
                        t4 : dateNumFormat(4),
                        tmin4 : getStatisticValue(dataImtes,i,"tmin",72,96,1)+" ℃",
                        tmax4 : getStatisticValue(dataImtes,i,"tmax",72,96,2)+" ℃",
                        rain4 : getStatisticValue(dataImtes,i,"r3",72,96,0)+" mm",
                        t5 : dateNumFormat(5),
                        tmin5 : getStatisticValue(dataImtes,i,"tmin",96,120,1)+" ℃",
                        tmax5 : getStatisticValue(dataImtes,i,"tmax",96,120,2)+" ℃",
                        rain5 : getStatisticValue(dataImtes,i,"r3",96,120,0)+" mm"
                    });
                }
                saveArchive(productName, title, content, datetime, stationList);
            }
            //格式化时间(根据距今num天数)
            function dateNumFormat(num){
                var timeSet = t.myDateSelecter.getCurrentTimeReal();
                timeSet.setTime(timeSet.getTime()+24*(num-1)*60*60*1000);
                return timeSet.format("yyyy-MM-dd");
            }
            //获取统计值
            function getStatisticValue(items, stationIndex, element, startHourSpan, endHourSpan, statisticMethod){
                var result = null;
                for(var key in items){
                    var item = items[key];
                    if(item.element != element)
                        continue;
                    if(startHourSpan<item.hourSpan && item.hourSpan<=endHourSpan){
                        var v = item.datas[stationIndex];
                        if(result == null)
                            result = v;
                        else {
                            if (statisticMethod == 0) //累加
                                result += v;
                            else if (statisticMethod == 1) //最大
                            {
                                if(v>result)
                                    result=v;
                            }
                            else if (statisticMethod == 2) //最小
                                if(v<result)
                                    result=v;
                        }
                    }
                }
                if(result != null)
                    result = Math.round(result*10.0)/10.0;
                return result;
            }
        });

        $("#windowScenicArea .scenicCheck input[type=checkbox]").click(function(){
            $(".windowInfoJQ").remove();//清除标记div
            vectorLayer.removeAllFeatures();//清除标记
            var stationLevel = [];
            $("#windowScenicArea .scenicCheck input[type=checkbox]:checked").each(function(){
                stationLevel.push($(this).val());
            });
            getStationForecast(getForecastRecall, stationLevel);
        });

        //展示景区天气
        function  getForecastRecall(para, stationLevel){
            var arrayPoint = [];
            var pointFeatures = [];
            var paraSize = para.length;
            var stationLevelSize = stationLevel.length;
            for(var i=0;i<paraSize;i++){
                for(var j=0;j<stationLevelSize;j++){
                    if(para[i].ZoomLevel == (stationLevel[j])){
                        var p = para[i];
                        var LonLat = {lon:p.Longitude,lat:p.Latitude};
                        arrayPoint.push({x:p.Longitude,y:p.Latitude,stationNum:p.StationNum,stationName:p.StationName,zoomLevel:p.ZoomLevel});
                        var pointFeature = addPointsJQ(LonLat);//生成点
                        pointFeatures.push(pointFeature);
                    }
                }
            }
            t.displayWeatherAsLonLat(arrayPoint, pointFeatures, new Date(), getJQWeather);
        }

        //初始化参数
        initProductType();
        //初始化制作时间和预报时间
        var dateNow = new Date();
        if(GDYB.GridProductClass.currentMakeTime == null) {
            dateNow.setMinutes(0);
            dateNow.setSeconds(0);
        }
        else{
            var curTimeStr = GDYB.GridProductClass.currentMakeTime;
            var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
            var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
            var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
            var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
            var minutes = 0;
            var seconds = 0;
            dateNow.setFullYear(year,month - 1,day);
            dateNow.setHours(hour, minutes, seconds, 0);
        }
        if(dateNow.getHours()>5 && dateNow.getHours()<=16)
            $("#selectMakeTime").val(5);
        else
            $("#selectMakeTime").val(16);
        var makeTimeHour = $("#selectMakeTime").val();
        setForecastTime(dateNow, makeTimeHour);

        //清除交通功能图层feature
        function clearTraffFeature(){
            var features = t.areasLayer.features;
            for(var i in features){
                features[i].style = {fillOpacity: "0"};//清除专题预报交通图层颜色
            }
            t.selectFeature.deactivate();//清除专题预报交通地图选择功能
            t.areasLayer.redraw();//刷新图层
            stations = [];
        }

        //获取旅游出行天气面板
        function getLYWeather(dataImtes,arrayPoint,pointFeatures){
            if(!dataImtes){
                alertModal("没有查询到数据");
                return;
            }
            //选择旅游日次
            var options = '';
            for(i=1;i<11;i++){
                options += '<option value="'+ i +'">'+ i +'</option>';
            }
            map = t.map;
            var infos = [];
            var lonLats = [];
            for(var i in arrayPoint){
                var currentHourSpan = 24*(parseInt(i)+1); //默认第1个点为第1天、第2个点为第2天，以此类推
                if(currentHourSpan > 240)
                    currentHourSpan =240;
                var lonLat = {lon:arrayPoint[i].x, lat:arrayPoint[i].y};
                var pixel = map.getPixelFromLonLat(lonLat);//屏幕坐标
//                var dateNow = new DateSelecter();
//                var dateNowFormat = dateNow.getNowTime().substr(0,10);//获取当前时间年-月-日
                var dateNow = new Date();
                var time = dateNow.getTime();
                time += (currentHourSpan-24)*60*60*1000;
                dateNow.setTime(time);
                var dateNowFormat = dateNow.getFullYear() + "-" + (Array(2).join(0)+(dateNow.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+dateNow.getDate()).slice(-2);
                if(!dataImtes){
                    var $info = $('<div class="windowInfo" style="position:absolute;top:'+(pixel.y-60)+'px;left:'+(pixel.x+1)+'px;">'
                        +'<div class="closeIcon">x</div>'
                        +'<div class="showDateDiv">无数据</div>'
                        +'</div>').appendTo($("body"));
                    $info[0].feature = pointFeatures[i];
                    $info.find(".closeIcon").click(function(){
                        $(this).parent().remove();
                        vectorLayer.removeFeatures(($(this).parent())[0].feature);
                        addPointsLine();
                    });
                    return;
                }
                var datas = dataImtes;
                var tminLine = "";//最低温地
                var tmaxLine = "";//最高温度
                var wLine = 0;//天气：默认“晴”
                var temporary = new Date();
                var temHour = temporary.getHours();
//                var forcaHour = 12;
//                if(temHour<8||temHour>20)
//                    forcaHour=24;
                for(var ite in dataImtes){
                    if(dataImtes[ite].element=="tmin"&&dataImtes[ite].hourSpan==currentHourSpan)
                        tminLine = dataImtes[ite].datas[i];
                    else if(dataImtes[ite].element=="tmax"&&dataImtes[ite].hourSpan==currentHourSpan)
                        tmaxLine = dataImtes[ite].datas[i];
                    else if(dataImtes[ite].element=="w"&&dataImtes[ite].hourSpan==currentHourSpan)
                        wLine = dataImtes[ite].datas[i];
                    else{

                    }
                }
                var opa = "block";//判断是否在屏幕内(默认)
                if(pixel.y>document.body.clientHeight||pixel.x>document.body.clientWidth-120){
                    opa = "none";
                }
                var param = getWeatherName(wLine);//天气转码 转换颜色
                var $info = $('<div class="windowInfo" style="position:absolute;top:'+(pixel.y-60)+'px;left:'+(pixel.x+2)+'px;display: '+ opa +'">'
                    +'<div class="closeIcon">x</div>'
                    +'<div class="showDateDiv">'+ dateNowFormat +'</div>'
                    +'<div class="weatherForcastDiv" style="color: '+ param[0].fontColor +';">'+ param[0].name +'<i class="iconfont icon-tq-'+ param[0].mark +'" style="position: absolute;top: 10px;right: 20px;font-size: 32px;"></i></div>'
                    +'<div class="tempratureDiv" style="margin: 5px;">'+ tminLine +' ~ '+ tmaxLine +' ℃</div>'
                    +'<div style="margin-top: 5px;margin-left: 5px;">第<select class="dataSelecter">'+ options +'</select>日</div>'
                    +'</div>').appendTo($("body"));
                $info[0].feature = pointFeatures[i];
                $info.find(".closeIcon").click(function(){
                    if(!saveState){
                        alertModal("请点击编辑");
                    }else{
                        $(this).parent().remove();
                        vectorLayer.removeFeatures(($(this).parent())[0].feature);
                        addPointsLine();
                    }
                });
                $info.find(".dataSelecter")[0].selectedIndex = (currentHourSpan-24)/24;
                $info.find(".dataSelecter").change(function(){
                    var addDate = parseInt($(this).val()-1);
                    var dateNew = new Date();
                    dateNew.setDate(dateNew.getDate()+addDate);
                    var yearNew = dateNew.getFullYear();
                    var mouthNew = (dateNew.getMonth()+1).toString().length>1?(dateNew.getMonth()+1):("0"+(dateNew.getMonth()+1));
                    var dayNew = dateNew.getDate().toString().length>1?dateNew.getDate():("0"+dateNew.getDate());
                    var dateStr = yearNew +'-'+ mouthNew +'-'+ dayNew;
                    var tminLine = "";
                    var tmaxLine = "";
                    var wLine = 0;
                    var temHour = (new Date()).getHours();
                    var forcaHour = 12;
                    if(temHour<8||temHour>20) forcaHour=24;
                    for(var ite in datas){
                        if(datas[ite].element=="tmin"&&datas[ite].hourSpan==24*(addDate+1)) tminLine = datas[ite].datas[i];
                        else if(datas[ite].element=="tmax"&&datas[ite].hourSpan==24*(addDate+1)) tmaxLine = datas[ite].datas[i];
                        else if(datas[ite].element=="w"&&datas[ite].hourSpan==24*addDate+forcaHour) wLine = datas[ite].datas[i];
                        else{}
                    }
                    var param = getWeatherName(wLine);//天气转码 转换颜色
                    $thispp = $(this).parent().parent();
                    $thispp.find(".showDateDiv").html(dateStr);
                    $thispp.find(".weatherForcastDiv").css("color",param[0].fontColor).html(param[0].name+'<i class="iconfont icon-tq-'+ param[0].mark +'" style="position: absolute;top: 10px;right: 20px;font-size: 32px;"></i>');
                    $thispp.find(".tempratureDiv").html(tminLine +' ~ '+ tmaxLine +' ℃');
                });
                infos.push($info);
                lonLats.push(lonLat);
            }
            map.events.register("move", map, function(event){
                for(var i in infos){
                    var $info = infos[i];
                    var lonLat = lonLats[i];
                    var pixel = map.getPixelFromLonLat(lonLat);
                    if(pixel.y>document.body.clientHeight||pixel.x>document.body.clientWidth-120){
                        $info.hide();
                    }else{
                        $info.show();
                        $info.css("top",pixel.y-60);
                        $info.css("left",pixel.x+2);
                    }
                }
            });
        }

        //获取景区天气面板
        function getJQWeather(dataImtes,arrayPoint,pointFeatures){
            if(!dataImtes){
                alertModal("没有查询到数据");
                return;
            }
            var options = '';
            for(i=1;i<11;i++){
                options += '<option value="'+ i +'">'+ i +'</option>';
            }
            map = t.map;
            var infos = [];
            var lonLats = [];
            for(var i in arrayPoint){
                var currentHourSpan = 24;
                var lonLat = {lon:arrayPoint[i].x, lat:arrayPoint[i].y};
                var pixel = map.getPixelFromLonLat(lonLat);//屏幕坐标
                var dateNow = new Date();
                var time = dateNow.getTime();
                time += (currentHourSpan-24)*60*60*1000;
                dateNow.setTime(time);
                var scenicAreaName = arrayPoint[i].stationName;
                var areaLevel = arrayPoint[i].zoomLevel;
                areaLevel = turnToLevel(areaLevel);
                function turnToLevel(l){
                    var start = "";
                    for(var i=1;i<=l;i++){
                        start += "★";
                    }
                    return start;
                }
                var dateNowFormat = dateNow.getFullYear() + "-" + (Array(2).join(0)+(dateNow.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+dateNow.getDate()).slice(-2);
                if(!dataImtes){
                    var $info = $('<div class="windowInfoJQ" style="position:absolute;top:'+(pixel.y-63)+'px;left:'+(pixel.x-80)+'px;">'
                        +'<div class="showDateDiv">无数据</div>'
                        +'</div>').appendTo($("body"));
                    $info[0].feature = pointFeatures[i];
                    $info.find(".closeIcon").click(function(){
                        $(this).parent().remove();
                        vectorLayer.removeFeatures(($(this).parent())[0].feature);
                    });
                    return;
                }
                var datas = dataImtes;
                var tminLine = "";//最低温地
                var tmaxLine = "";//最高温度
                var wLine = 0;//天气：默认“晴”
                var temporary = new Date();
                for(var ite in dataImtes){
                    if(dataImtes[ite].element=="tmin"&&dataImtes[ite].hourSpan==currentHourSpan)
                        tminLine = dataImtes[ite].datas[i];
                    else if(dataImtes[ite].element=="tmax"&&dataImtes[ite].hourSpan==currentHourSpan)
                        tmaxLine = dataImtes[ite].datas[i];
                    else if(dataImtes[ite].element=="w"&&dataImtes[ite].hourSpan==currentHourSpan)
                        wLine = dataImtes[ite].datas[i];
                    else{

                    }
                }
                var opa = "block";//判断是否在屏幕内(默认)
                if(pixel.y>document.body.clientHeight-65||pixel.x>document.body.clientWidth-100){
                    opa = "none";
                }
                var param = getWeatherName(wLine);//天气转码 转换颜色
                var $info = $('<div class="windowInfoJQ" style="position:absolute;top:'+(pixel.y-63)+'px;left:'+(pixel.x-80)+'px;display: '+ opa +'">'
                    +'<div class="areaNameDiv">'+ scenicAreaName +'</div>'
                    +'<div class="showDateDiv">'+ dateNowFormat +'</div>'
                    +'<div class="weatherForcastDiv" style="color: '+ param[0].fontColor +';">'+ param[0].name +'<i class="iconfont icon-tq-'+ param[0].mark +'" style="position: absolute;top: 40px;right: 12px;font-size: 32px;"></i></div>'
                    +'<div class="tempratureDiv">'+ tminLine +' ~ '+ tmaxLine +' ℃</div>'
                    +'<div>第<select class="dataSelecter">'+ options +'</select>日</div>'
                    +'<div class="areaLevel">'+ areaLevel +'</div>'
                    +'</div>').appendTo($("body"));
                $info[0].feature = pointFeatures[i];
                $info.find(".dataSelecter")[0].selectedIndex = (currentHourSpan-24)/24;
                $info.find(".dataSelecter").change(function(){
                    var addDate = parseInt($(this).val()-1);
                    var dateNew = new Date();
                    dateNew.setDate(dateNew.getDate()+addDate);
                    var yearNew = dateNew.getFullYear();
                    var mouthNew = (dateNew.getMonth()+1).toString().length>1?(dateNew.getMonth()+1):("0"+(dateNew.getMonth()+1));
                    var dayNew = dateNew.getDate().toString().length>1?dateNew.getDate():("0"+dateNew.getDate());
                    var dateStr = yearNew +'-'+ mouthNew +'-'+ dayNew;
                    var tminLine = "";
                    var tmaxLine = "";
                    var wLine = 0;
                    var temHour = (new Date()).getHours();
                    var forcaHour = 12;
                    if(temHour<8||temHour>20) forcaHour=24;
                    for(var ite in datas){
                        if(datas[ite].element=="tmin"&&datas[ite].hourSpan==24*(addDate+1)) tminLine = datas[ite].datas[i];
                        else if(datas[ite].element=="tmax"&&datas[ite].hourSpan==24*(addDate+1)) tmaxLine = datas[ite].datas[i];
                        else if(datas[ite].element=="w"&&datas[ite].hourSpan==24*addDate+forcaHour) wLine = datas[ite].datas[i];
                        else{}
                    }
                    var param = getWeatherName(wLine);//天气转码 转换颜色
                    $thispp = $(this).parent().parent();
                    $thispp.find(".showDateDiv").html(dateStr);
                    $thispp.find(".weatherForcastDiv").css("color",param[0].fontColor).html(param[0].name+'<i class="iconfont icon-tq-'+ param[0].mark +'" style="position: absolute;top: 40px;right: 12px;font-size: 32px;"></i>');
                    $thispp.find(".tempratureDiv").html(tminLine +' ~ '+ tmaxLine +' ℃');
                });
                infos.push($info);
                lonLats.push(lonLat);
            }
            map.events.register("move", map, function(event){
                for(var i in infos){
                    var $info = infos[i];
                    var lonLat = lonLats[i];
                    var pixel = map.getPixelFromLonLat(lonLat);
                    if(pixel.y>document.body.clientHeight-75||pixel.x>document.body.clientWidth-120){
                        $info.hide();
                    }else{
                        $info.show();
                        $info.css("top",pixel.y-63);
                        $info.css("left",pixel.x-80);
                    }
                }
            });
        }

    };
    //专题预报交通出行功能
    var stations = [];//所选预报地区
    var callbacks = {
        over: function (currentFeature) {
        },
        click: function (currentFeature) {
            currentFeature.style = {
                fillColor: "#33a3dc",
                fillOpacity: "0.5"
            };
            t.areasLayer.redraw();//图层刷新
            if(stations.indexOf(currentFeature)>=0){
                alertModal("区域已被选中");
                return;
            }
            stations.push(currentFeature);
            creatTrafficTable();
        }
    };
    function creatTrafficTable(){
        var tableHtml = '';
        for(var k in stations) {
            tableHtml += '<tr flag="'+ stations[k].attributes.STATIONCOD +'" style="text-align: center;"><td width="75">' + stations[k].attributes.STATIONNAM + '</td><td width="95">' + stations[k].attributes.STATIONCOD + '</td><td class="delStation" style="cursor: pointer;">x</td></tr>';
        }
        $("#traffTable").html(tableHtml);
        $(".delStation").click(function(){
            var flag = $(this).parent().attr("flag");
            for(var k in stations) {
                if(stations[k].attributes.STATIONCOD==flag){
                    stations[k].style = {fillOpacity: "0"};
                    t.areasLayer.redraw();
                    stations.splice(k,1);
                }
            }
            creatTrafficTable();
        });
    }
    //区域边界初始化
    t.newInitBound = function(testLayer,areasLayer){
        var para = {};
        para.areaCode = "62";
        para.level = "cty";
        para = JSON.stringify(para); //对象转换为json
        t.areas = [];
        var url= gridServiceUrl+"services/AdminDivisionService/getDivisionInfos";
        $.ajax({
            data: {"para": para},
            url: url,
            dataType: "json",
            type: "POST",
            success: function (data) {
                if(typeof(data) != "undefined") {
                    // var areaDatas = eval("("+data+")");//转换为json对象
                    var areaDatas =[];
                    for( var k =0;k<data.length;k++){
                        var objData = $.parseJSON(data[k]);
                        areaDatas.push(objData);
                    }
                    var len = areaDatas.length;
                    var lineVectors = [];
                    for(var i = 0; i<len ; i++){
                        var areaData = areaDatas[i];
                        var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(areaData);
                        feature.geometry.calculateBounds();
                        feature.style = {
                            lable:areaData.fieldValues[3],
                            fill: false,
                            strokeColor: "#000000",
                            strokeWidth: 1.5
                        };
                        lineVectors.push(feature);
                    }
                    testLayer.addFeatures(lineVectors);

                    for(var key in data){
                        var areasFeatrue = GDYB.FeatureUtilityClass.getFeatureFromJson(JSON.parse(data[key]));
                        areasFeatrue.geometry.calculateBounds();
                        t.areas.push(areasFeatrue);
                    }
                    areasLayer.addFeatures(t.areas);
                    t.selectFeature = new WeatherMap.Control.SelectFeature(areasLayer,
                        {
                            callbacks: callbacks
                        });
                    t.selectFeature.id = "stationSelect";
                    t.map.addControl(t.selectFeature);
                }
            },
            error: function(e){
                alertModal("获取用户所在地区失败："+ e.statusText);
            }
        });
    };

    //word产品生成
    function saveArchive(productName, title, content, datetime, stationList){
        var url = archiveService + "services/ArchiveService/createProduct";
        $.ajax({
            data: {"para": "{templateName:'traff.ftl',productName:'" + productName + ".doc',title:'"+ title +"',content:'"+ content +"',datetime:'"+ datetime +"',stationList:"+ JSON.stringify(stationList) +"}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(data){
                    alertModal("文档生成成功");
                    wordDownload(productName);
                }
                else
                    alertModal("文档生成失败");
            },
            error:function(data){
            },
            type: "POST"
        });
    }

    //word产品下载
    function wordDownload(pn){
        window.location.href="http://172.23.2.237:8080/products/archive/"+ pn +".doc";
    }

    //获取景区站点
    function getStationForecast(recall, stationLevel){
        var para = {};
        para.Type = 6;
        para = JSON.stringify(para); //对象转换为json
        var url= "http://172.23.2.237:8080/WMGridService/services/ForecastfineService/getStationForecast";
        $.ajax({
            data: {"para": para},
            url: url,
            dataType: "json",
            type: "POST",
            success: function (stations) {
                if(stations != null && stations.length > 0){
                    recall&&recall(stations, stationLevel);
                }
            }
        });
    }

    //展示格点产品
    this.displayGridProduct = function(t){
        initProductType();
        var t = typeof(t)=="undefined"?this:t;
        var type = GDYB.GridProductClass.currentType;
        var element = $("#elementDiv").find($(".active")).attr("value");
        var elementName = $("#elementDiv").find($(".active")).attr("data-original-title");
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var version = GDYB.GridProductClass.currentVersion;
        var datetime = t.myDateSelecter.getCurrentTime(false);
        var hourspan = t.hourSpan;
        var fromModel;
        var level = 1000;
        if(type == null || element == null || hourspan == null)
            return;

        //获取上一次时效
        var i=0;
        var hourspans = GDYB.GDYBPage.getHourSpan(element);
        for(i; i<hourspans.length; i++){
            if(hourspans[i] == hourspan)
                break;
        }
        var hourspanLast = 0;
        if(i>0)
            hourspanLast = hourspans[i-1];

        if(GDYB.GridProductClass.datasetGridInfos == null && GDYB.GridProductClass.datasetGridInfos.length > 0)
            GDYB.GridProductClass.getGridInfo(null, type, element, datetime);
        GDYB.GridProductClass.displayGridProduct(function(){
        }, type, level, element, maketime, version, datetime, hourspan, fromModel, elementName, hourspanLast);
    };

    function initProductType(){
        var strProductType = $("#selectProductType").val();
        var arrayProductType = strProductType.split('_');
        GDYB.GridProductClass.currentType = arrayProductType[0];
        GDYB.GridProductClass.currentVersion = arrayProductType[1];
    }

    //根据制作时间，设置预报时间
    function setForecastTime(datetime, makeTimeHour){
        if(typeof(datetime) == "undefined")
            datetime = t.myDateSelecter.getCurrentTimeReal();
        if(typeof(makeTimeHour) == "undefined")
            makeTimeHour = $("#selectMakeTime").val();
        if(GDYB.GridProductClass.currentType == "prvn"){
            if(makeTimeHour == 5)
                datetime.setHours(8);
            else
                datetime.setHours(20);
        }
        else if(GDYB.GridProductClass.currentType == "cty" || GDYB.GridProductClass.currentType == "cnty"){
            if(makeTimeHour == 5 || makeTimeHour == 10)
                datetime.setHours(8);
            else
                datetime.setHours(20);
        }
        t.myDateSelecter.setCurrentTime(datetime.format("yyyy-MM-dd hh:mm:ss"));

        datetime.setHours(makeTimeHour);
        GDYB.GridProductClass.currentMakeTime = datetime.format("yyyy-MM-dd hh:mm:ss");
        GDYB.GridProductClass.currentDateTime = t.myDateSelecter.getCurrentTime(false);
    }

    function onChangeDateTime(){
        t.displayGridValueSerial(); //时间改变，同时更新图表
        t.displayWeatherDescription(); //天气概况

        if($("#elementDiv").find($(".active")).attr("value")=="10uv"||$("#elementDiv").find($(".active")).attr("value")=="wmax"){
            t.clearStreamLayerDate();
            t.displayStream();
            $(GDYB.Page.curPage.baseLayer.div).css("filter","brightness(0.4)");
        }else{
            t.clearStreamLayerDate();
            t.displayGridProduct();
            $(GDYB.Page.curPage.baseLayer.div).css("filter","brightness(1)");
        }
    }

    //展示趋势图
    this.displayGridValueSerial = function(){
        var t = this;
        if(typeof(t.currentPosition)=="undefined")
            return;
        var arrayPoint = [];
        arrayPoint.push({x:t.currentPosition.lon,y:t.currentPosition.lat});
        var strPoints = JSON.stringify(arrayPoint);

        var arrayElement = [];
        arrayElement.push({name:"2t", element:"2t",hourSpans:JSON.stringify(this.getHourSpan("2t"))});
        arrayElement.push({name:"r3", element:"r3",hourSpans:JSON.stringify(this.getHourSpan("r3"))});
        arrayElement.push({name:"wd3", element:"10uv",hourSpans:JSON.stringify(this.getHourSpan("10uv"))});
        arrayElement.push({name:"ws3", element:"10uv",hourSpans:JSON.stringify(this.getHourSpan("10uv"))});
        /*arrayElement.push({name:"rh", element:"rh",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("rh"))});
        arrayElement.push({name:"tcc", element:"tcc",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("tcc"))});
        arrayElement.push({name:"vis", element:"vis",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("vis"))});*/
        var strElements = JSON.stringify(arrayElement);

        var url = gridServiceUrl+"services/GridService/grid2points"; //格点转任意点
        $.ajax({
            data: {"para": "{type:'" + GDYB.GridProductClass.currentType + "',makeTime:'" + GDYB.GridProductClass.currentMakeTime
            + "',version:'" + GDYB.GridProductClass.currentVersion + "',elements:" + strElements + ",points:" + strPoints + "}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(data != null && data.items != null && data.items.length > 0)
                {
                    updateChartTable(data.items, t.myDateSelecter.getCurrentTimeReal());
                }
            },
            error:function(e){

            },
            type: "POST"
        });
        showChartDiv();
    };
    //趋势图读取时次
    this.getHourSpan = function(element){
        var hourspans = null;
        if(element == "r12" || element == "w" || element == "air" || element == "wmax"){
            hourspans = [12,24,36,48,60,72];
        }
        else if(element == "tmax" || element == "tmin"){
            hourspans = [24,48,72];
        }
        else{
            hourspans = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72];
        }
        return hourspans;
    };

    //展示天气概况
    this.displayWeatherDescription = function(){
        var t = this;
        if(typeof(t.currentPosition)=="undefined")
            return;
        var arrayPoint = [];
        arrayPoint.push({x:t.currentPosition.lon,y:t.currentPosition.lat});
        var strPoints = JSON.stringify(arrayPoint);

        var dateNow = new Date();
        var timeNow = dateNow.getTime();
        var dateStartForecast = t.myDateSelecter.getCurrentTimeReal();
        var timeStartForecast = dateStartForecast.getTime();
        if(timeNow > timeStartForecast) {
            var hourOffset = (timeNow - timeStartForecast) / 1000 / 3600;
            if(hourOffset < 72) { //超过三天的预报，看未来3小时预报已没啥意义了
                var hourSpan3 = 3 + Math.floor(hourOffset/3)*3;
                var hourSpan12 = 12 + Math.floor(hourOffset/12)*12;
                var hourSpan24 = 24 + Math.floor(hourOffset/24)*24;

                var arrayElement = [];
                arrayElement.push({name: "2t", element:"2t", hourSpans: [hourSpan3]});
                arrayElement.push({name: "r3", element:"r3", hourSpans: [hourSpan3]});
                arrayElement.push({name: "wd3", element:"10uv", hourSpans: [hourSpan3]});
                arrayElement.push({name: "ws3", element:"10uv", hourSpans: [hourSpan3]});
                arrayElement.push({name: "rh", element:"rh", hourSpans: [hourSpan3]});
                arrayElement.push({name: "tcc", element:"tcc", hourSpans: [hourSpan3]});
                arrayElement.push({name: "vis", element:"vis", hourSpans: [hourSpan3]});
                arrayElement.push({name: "w", element:"w", hourSpans: [hourSpan12, hourSpan24]});
                arrayElement.push({name: "r12", element:"r12", hourSpans: [hourSpan12, hourSpan24]});
                arrayElement.push({name: "wd", element:"wmax", hourSpans: [hourSpan24]});
                arrayElement.push({name: "ws", element:"wmax", hourSpans: [hourSpan24]});
                arrayElement.push({name: "tmin", element:"tmin", hourSpans: [hourSpan24]});
                arrayElement.push({name: "tmax", element:"tmax", hourSpans: [hourSpan24]});
                arrayElement.push({name: "air", element:"air", hourSpans: [hourSpan24]});
                arrayElement.push({name: "pph", element:"pph", hourSpans: [hourSpan3]});
                arrayElement.push({name: "fog", element:"fog", hourSpans: [hourSpan3]});
                arrayElement.push({name: "hz", element:"hz", hourSpans: [hourSpan3]});
                arrayElement.push({name: "sand", element:"sand", hourSpans: [hourSpan3]});
                arrayElement.push({name: "rat", element:"rat", hourSpans: [hourSpan3]});
                arrayElement.push({name: "hail", element:"hail", hourSpans: [hourSpan3]});
                arrayElement.push({name: "ssm", element:"ssm", hourSpans: [hourSpan3]});
                arrayElement.push({name: "smg", element:"smg", hourSpans: [hourSpan3]});
                var strElements = JSON.stringify(arrayElement);

                var url = gridServiceUrl + "services/GridService/grid2points"; //格点转任意点
                $.ajax({
                    data: {"para": "{type:'" + GDYB.GridProductClass.currentType + "',makeTime:'" + GDYB.GridProductClass.currentMakeTime
                    + "',version:'" + GDYB.GridProductClass.currentVersion + "',elements:" + strElements + ",points:" + strPoints + "}"},
                    url: url,
                    dataType: "json",
                    success: function (data) {
                        if (data != null && data.items != null &&  data.items.length > 0) {
                            updateWeatherDescription(data.items, hourSpan3, hourSpan12, hourSpan24);
                        }
                    },
                    error: function (e) {

                    },
                    type: "POST"
                });
            }
            else{
                $("#weatherDescription").html("无");
            }
        }
        else{
            $("#weatherDescription").html("无");
        }
    };
    /**
     * @author dinlerkey
     * 2017-5-10
     * @description 根据坐标、时间获取坐标天气情况
     */
    this.displayWeatherAsLonLat = function(arrayPoint,pointFeatures,currentTime,callback){
        if(typeof(arrayPoint)=="undefined" || arrayPoint.length==0)
            return;
        /*var forecastTime = currentTime.format("yyyy-MM-dd hh:mm:ss");
        var cutTime = parseInt(forecastTime.substr(11,2));
        if(cutTime>=0&&cutTime<8){
            currentTime.setDate(currentTime.getDate()-1);
            currentTime.setHours(16, 0, 0, 0);
            forecastTime = currentTime.format("yyyy-MM-dd hh:mm:ss");
        }
        else if(cutTime>=8&&cutTime<20){
            currentTime.setHours(5, 0, 0, 0);
            forecastTime = currentTime.format("yyyy-MM-dd hh:mm:ss");
        }
        else{
            currentTime.setHours(16, 0, 0, 0);
            forecastTime = currentTime.format("yyyy-MM-dd hh:mm:ss");
        }*/
        var strPoints = JSON.stringify(arrayPoint);
        var arrayElement = [];
        arrayElement.push({name: "w", element:"w", hourSpans: [12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240]});
        arrayElement.push({name: "tmin", element:"tmin", hourSpans: [24,48,72,96,120,144,168,192,216,240]});
        arrayElement.push({name: "tmax", element:"tmax", hourSpans: [24,48,72,96,120,144,168,192,216,240]});
        arrayElement.push({name: "r3", element:"r3", hourSpans: [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]});
        var strElements = JSON.stringify(arrayElement);

        var url = gridServiceUrl + "services/GridService/grid2points"; //格点转任意点
        $.ajax({
            data: {"para": "{type:'" + GDYB.GridProductClass.currentType + "',makeTime:'" + GDYB.GridProductClass.currentMakeTime
            + "',version:'" + GDYB.GridProductClass.currentVersion + "',elements:" + strElements + ",points:" + strPoints + "}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if (data != null && data.items != null &&  data.items.length > 0) {
                    callback(data.items,arrayPoint,pointFeatures);
                }else{
                    callback(false);
                }
            },
            error: function (e) {

            },
            type: "POST"
        });

    };

    /**
     * @author dinlerkey
     * 2017-4-11
     * @description 底部时间滑动条
     */
    this.showTimeSlide = function(){
        var myDate = t.myDateSelecter.getCurrentTimeReal();
        myDate.setHours(0);
        var weekday = ["周日","周一","周二","周三","周四","周五","周六"];
        var dateList = [];
        for(var i=0;i<240;i++){
            var year = myDate.getFullYear();
            var mon = (myDate.getMonth()+1).toString().length>1?(myDate.getMonth()+1):("0"+(myDate.getMonth()+1));
            var day = myDate.getDate().toString().length>1?myDate.getDate():("0"+myDate.getDate());
            var dayOfWeek = weekday[parseInt(myDate.getDay())];
            var hour = myDate.getHours().toString().length>1?myDate.getHours():("0"+myDate.getHours());
            dateList.push(year+"/"+mon+"/"+day+"/"+dayOfWeek+"/"+hour+":00");
            myDate.setHours(myDate.getHours()+1);
        }
        var makeTime = $("#selectMakeTime").val();
        timeSlide("progress-bar",0.5/(t.numbers[0]),dateList,makeTime,showMap,null);
    };

    function showMap(folderName,b){
        var year = folderName.toString().split("/")[0];
        var mon = folderName.toString().split("/")[1];
        var day = folderName.toString().split("/")[2];
        var hour = folderName.toString().split("/")[4].substr(0,2);
        var minutes = 0;
        var seconds = 0;
        var myDate = new Date();
        myDate.setFullYear(year,mon-1,day);
        myDate.setHours(hour, minutes, seconds, 0);
        var datetime = t.myDateSelecter.getCurrentTimeReal(false);
        var difTimeHour = (myDate.getTime() - datetime.getTime())/3600000;
        t.hourSpan = (Math.floor(difTimeHour/ t.numbers[0])+1)* t.numbers[0];
        if(difTimeHour% t.numbers[0]==0){
            b = true;
        }
        if(b){
            if($("#elementDiv").find($(".active")).attr("value")=="10uv"||$("#elementDiv").find($(".active")).attr("value")=="wmax"){
                t.clearStreamLayerDate();
                t.displayStream();
            }else{
                t.clearStreamLayerDate();
                t.displayGridProduct();
            }
        }
    }

    /**
     * @author dinlerkey
     * 2017-4-11
     * @description 风场动画
     */
    this.layerFillRangeColor = null; //填色图层
    this.layerStream = null; //流场图层

    //清除图层
    this.clearStreamLayerDate = function(){
        if(t.layerStream != null)
            t.layerStream.visibility = false;
    };

    this.displayStream = function(){
        if(this.layerStream == null){
            this.layerStream = new WeatherMap.Layer.StreamLayer("layerStream");
            this.layerStream.resolution = 2;
            GDYB.Page.curPage.map.addLayer(this.layerStream);
        }else{
            if(this.layerStream.visibility == false){
                this.layerStream.visibility = true;
            }
        }
        if(this.layerFillRangeColor == null){
            this.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer(
                "layerFillRangeColor",
                {
                    "radius":40,
                    "featureWeight":"value",
                    "featureRadius":"geoRadius"
                }
            );
            GDYB.Page.curPage.map.addLayers([this.layerFillRangeColor]);
            this.layerFillRangeColor.alpha = 50;
            this.layerFillRangeColor.isAlwaySmooth = true;
            this.layerFillRangeColor.isSmooth = true;
            this.layerFillRangeColor.isShowLabel = false;
            this.layerFillRangeColor.items = heatMap_10uvStyles;
        }
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var datetime = t.myDateSelecter.getCurrentTime(false);
        var element = $("#elementDiv").find($(".active")).attr("value");
        var houspan = t.hourSpan;
        //this.addGrid(null, '2013-01-01 01:00:00');
        this.addStream(null, "prvn", maketime, datetime, element, houspan);
    };

    //加载流场
    //type：类型，prvn-省台预报，bj-中央台预报,ec-欧洲中心，japan-日本预报，等等
    //maketime：制作时间
    //datetime：预报时间
    //hourspan：预报时效
    this.addStream = function(recall, type, maketime, datetime, element, hourspan){
        var t = this;
        var level = 1000;
        var version = "p";
        var url = gridServiceUrl + "services/GridService/getUV";
        $.ajax({
            url: url,
            data:{"para":"{element:'"+ element + "',type:'"+ type + "',level:'"+ level + "',hourspan:"+ hourspan + ",maketime:'" + maketime + "',version:'" + version + "',datetime:'"+ datetime + "'}"},
            dataType: "json",
            success: function (data) {
                if(typeof(data) != "undefined") {
                    var dvalues = data.dvalues;
                    if (dvalues != null && dvalues.length > 0) {
                        var dimensionsUV = 2; //维度，UV风场有两维
                        var dimensionsWS = 1; //维度，风速场有一维
                        var dMin = 9999;
                        var dMax = -9999;
                        var dgUV = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols, dimensionsUV); //u、v
                        dgUV.noDataValue = data.noDataValue;
                        var dgWS = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols, dimensionsWS); //风速
                        dgWS.noDataValue = data.noDataValue;
                        var gridUV = [];
                        var gridWS = [];
                        for (var i = 0; i < data.rows; i++) {
                            var nIndexLine = data.cols * i * dimensionsUV;
                            for (var j = 0; j < data.cols; j++) {
                                var nIndex = nIndexLine + j * dimensionsUV;
                                gridUV.push(Math.round(dvalues[nIndex+1])); //风速在前
                                gridUV.push(Math.round(dvalues[nIndex]));   //风向在后

                                var ws = Math.sqrt(dvalues[nIndex]*dvalues[nIndex]+dvalues[nIndex + 1]*dvalues[nIndex + 1]);
                                gridWS.push(ws);
                                if (ws != 9999 && ws != -9999) {
                                    if (ws < dMin)
                                        dMin = ws;
                                    if (ws > dMax)
                                        dMax = ws;
                                }
                            }
                        }
                        dgUV.grid = gridUV;
                        //dgUV.dMin = dMin;
                        //dgUV.dMax = dMax;
                        t.layerStream.setDatasetGrid(dgUV);

                        dgWS.grid = gridWS;
                        dgWS.dMin = dMin;
                        dgWS.dMax = dMax;
                        t.layerFillRangeColor.setDatasetGrid(dgWS);
                    }
                }
            },
            error: function(e) {
            },
            type: "POST"
        });
    };

    function getWeatherName(value){
        var nameAndMark = [];
        switch (value){
            case 0:
                name = "晴";
                mark = "qing";
                fontColor = "#fff";
                break;
            case 1:
                name = "多云";
                mark = "duoyun";
                fontColor = "#eee";
                break;
            case 2:
                name = "阴";
                mark = "yin";
                fontColor = "#eee";
                break;
            case 3:
                name = "阵雨";
                mark = "zhenyu";
                fontColor = "#f75";
                break;
            case 4:
                name = "雷阵雨";
                mark = "leizhenyu";
                fontColor = "#f75";
                break;
            case 7:
                name = "小雨";
                mark = "yu";
                fontColor = "#f75";
                break;
            case 21:
                name = "小到中雨";
                mark = "yu";
                fontColor = "#f75";
                break;
            case 8:
                name = "中雨";
                mark = "yu";
                fontColor = "#f75";
                break;
            case 22:
                name = "中到大雨";
                mark = "yu";
                fontColor = "#f00";
                break;
            case 9:
                name = "大雨";
                mark = "yu";
                fontColor = "#f00";
                break;
            case 23:
                name = "大到暴雨";
                mark = "yu";
                fontColor = "#830";
                break;
            case 10:
                name = "暴雨";
                mark = "yu";
                fontColor = "#830";
                break;
            case 24:
                name = "暴雨到大暴雨";
                mark = "yu";
                fontColor = "#733";
                break;
            case 11:
                name = "大暴雨";
                mark = "yu";
                fontColor = "#733";
                break;
            case 25:
                name = "大暴雨到特大暴雨";
                mark = "yu";
                fontColor = "#521";
                break;
            case 12:
                name = "特大暴雨";
                mark = "yu";
                fontColor = "#521";
                break;
            case 5:
                name = "冰雹";
                mark = "bingbao";
                fontColor = "#09d";
                break;
            case 6:
                name = "雨夹雪";
                mark = "yujiaxue";
                fontColor = "#7aa";
                break;
            case 13:
                name = "阵雪";
                mark = "xue";
                fontColor = "#3ad";
                break;
            case 14:
                name = "小雪";
                mark = "xue";
                fontColor = "#3ad";
                break;
            case 26:
                name = "小到中雪";
                mark = "xue";
                fontColor = "#3ad";
                break;
            case 15:
                name = "中雪";
                mark = "xue";
                fontColor = "#3ad";
                break;
            case 27:
                name = "中到大雪";
                mark = "daxue";
                fontColor = "#27a";
                break;
            case 16:
                name = "大雪";
                mark = "daxue";
                fontColor = "#27a";
                break;
            case 28:
                name = "大到暴雪";
                mark = "daxue";
                fontColor = "#157";
                break;
            case 17:
                name = "暴雪";
                mark = "daxue";
                fontColor = "#157";
                break;
            case 19:
                name = "冻雨";
                mark = "dongyu";
                fontColor = "#089";
                break;
            case 18:
                name = "雾";
                mark = "wu";
                fontColor = "#7b1";
                break;
            case 53:
                name = "霾";
                mark = "mai";
                fontColor = "#dc7";
                break;
            case 29:
                name = "浮尘";
                mark = "fuchen";
                fontColor = "#fb7";
                break;
            case 30:
                name = "扬沙";
                mark = "yangsha";
                fontColor = "#b64";
                break;
            case 20:
                name = "沙尘暴";
                mark = "shachenbao";
                fontColor = "#fa1";
                break;
            case 31:
                name = "强沙尘暴";
                mark = "shachenbao";
                fontColor = "#851";
                break;
        }
        nameAndMark.push({name:name,mark:mark,fontColor:fontColor});
        return nameAndMark;
    }

    this.CLASS_NAME = "DisplayPageClass";
}

DisplayPageClass.prototype = new PageBase();