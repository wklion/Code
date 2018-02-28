/**
 * Created by Administrator on 2016/5/10.
 */
/**
 * @author zj
 * 2016-5-10
 * @description 格点展示页面
 */

function GDZSPageClass(){
    var t= this;
    this.renderMenu = function(){
        $("#menu").css("display","none");
        $("#map_div").css("right","711px").css("bottom","230px").css("top","66px");
        $("#latticeForcast").css("display","block");
        $("#latticePrecipitation").css("display","block");
        $("#mapTool_div").css("display","block");
        t.myDateSelecter = new DateSelecter(2, 2); //最小视图为天
        t.myDateSelecter.intervalMinutes = 60*24; //24小时
        $("#dateSelect").html(this.myDateSelecter.div);
        t.yubaoshixiaoTools = new YuBaoshixiaoTools($("#divHourSpan"), t.myDateSelecter.getCurrentTimeReal(), 1);
        t.yubaoshixiaoTools.hourSpan = t.yubaoshixiaoTools.numbers[0];
        regesterYuBaoShiXiaoEvent(); //由于createDom重构了页面，需要重新注册事件，否则无法响应事件
        $("#divHourSpan").find("#"+t.yubaoshixiaoTools.hourSpan+"h").addClass("active");

        $("#latticeControl").css("display","block");
        $("#latticeControl").click(function(){
            displayChart(this);
        });
        $("#latticeTableControl").css("display","block");
        $("#latticeTableControl").click(function(){
            displayTableChart(this);
        });

        //初始化参数
        initProductType();
        GDYB.GridProductClass.isBrowseMode = true;

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
        if(dateNow.getHours()<10)
            $("#selectMakeTime").val(5);
        else if(dateNow.getHours() < 16)
            $("#selectMakeTime").val(10);
        else
            $("#selectMakeTime").val(16);
        var makeTimeHour = $("#selectMakeTime").val();
        setForecastTime(dateNow, makeTimeHour);

        //改变制作时间
        this.myDateSelecter.input.change(function(){
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            onChangeDateTime();
        });

        //点击上翻
        t.myDateSelecter.leftBtn.click(function(){
            onChangeDateTime();
        });

        //点击下翻
        t.myDateSelecter.rightBtn.click(function(){
            onChangeDateTime();
        });

        //改变制作时次
        $("#selectMakeTime").change(function() {
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            onChangeDateTime();
        });

        //改变产品类型
        $("#selectProductType").change(function() {
            initProductType();
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").val();
            setForecastTime(datetime, makeTimeHour);
            t.displayGridProduct();
            t.displayGridValueSerial(); //产品类型改变，同时更新图表
            t.displayWeatherDescription(); //天气概况
        });

        //改变要素
        $("#selectElement").change(function() {
            var element = $("#selectElement").val();
            t.yubaoshixiaoTools.numbers = GDYB.GDYBPage.getHourSpan(element);
            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            t.yubaoshixiaoTools.hourSpan = t.yubaoshixiaoTools.numbers[0];
            $("#divHourSpan").find("#"+t.yubaoshixiaoTools.hourSpan+"h").addClass("active");
            regesterYuBaoShiXiaoEvent(); //由于createDom重构了页面，需要重新注册事件，否则无法响应事件
            var heightMapTool = parseInt($("#divTool").css("height")) + parseInt($("#divHourSpan").css("height"))+2;
            $("#map_div").css("top", (heightMapTool+10)+"px");
            GDYB.Page.curPage.map.updateSize();

            t.displayGridProduct();
        });

        //注册时效点击事件
        function regesterYuBaoShiXiaoEvent(){
            $("#divHourSpan").find("td").click(function () {
                if(typeof(this.id) != "undefined" && this.id != "")
                    t.displayGridProduct();
            });
        };

        function initProductType(){
            var strProductType = $("#selectProductType").val();
            var arrayProductType = strProductType.split('_');
            GDYB.GridProductClass.currentType = arrayProductType[0];
            GDYB.GridProductClass.currentVersion = arrayProductType[1];
        }

        function onChangeDateTime(){
            t.displayGridProduct();
            t.displayGridValueSerial(); //时间改变，同时更新图表
            t.displayWeatherDescription(); //天气概况
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

        //鼠标点击事件
        var map= t.map;
        map.events.register("click", map, function(event){
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

            t.displayGridLocation();
            t.displayGridValueSerial();
            t.displayWeatherDescription(); //天气概况
        });

        //键盘按键事件，实现上翻、下翻
        $(document).keydown(function (event) {
            if(document.activeElement.id == "table_yubaoshixiao"){  //时效上下翻
                var offset = 0;
                if(event.keyCode == 37 || event.keyCode == 38)  //左上
                    offset = -1;
                else if(event.keyCode == 39 || event.keyCode == 40) //右下
                    offset = 1;

                if(offset != 0){
                    var hourspans = t.yubaoshixiaoTools.numbers;
                    var hourSpan = t.yubaoshixiaoTools.hourSpan;
                    var nIndex = -1;
                    for(var hKey in hourspans){
                        if(hourspans[hKey] == hourSpan){
                            nIndex = Number(hKey);
                            break;
                        }
                    }
                    nIndex += offset
                    if(nIndex >= hourspans.length)
                        nIndex = 0;
                    else if(nIndex < 0)
                        nIndex = hourspans.length - 1;
                    hourSpan = hourspans[nIndex];
                    $("#table_yubaoshixiao").find("td").removeClass("active");
                    t.yubaoshixiaoTools.hourSpan = hourSpan;
                    $("#table_yubaoshixiao").find("#"+hourSpan+"h").addClass("active");
                    t.displayGridProduct();
                }
            }
        });

        initChartTable(); //初始化图表
        t.displayGridValueSerial(); //更新图表
        this.displayGridLocation(); //显示定位信息
        setTimeout(function(){
            t.displayGridProduct(t);
        }, 1000); //显示格点产品
        t.displayWeatherDescription(); //天气概况
    }

    //展示格点产品
    this.displayGridProduct = function(t){
        var t = typeof(t)=="undefined"?this:t;
        var type = GDYB.GridProductClass.currentType;
        var element = $("#selectElement").val();
        var elementName = $("#selectElement").find("option:selected").text();
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var version = GDYB.GridProductClass.currentVersion;
        var datetime = t.myDateSelecter.getCurrentTime(false);
        var hourspan = t.yubaoshixiaoTools.hourSpan;
        var fromModel;
        var level = 1000;
        if(type == null || element == null || hourspan == null)
            return;

        //获取上一次效
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

    //显示当前位置
    this.displayGridLocation = function(){
        var t = this;
		if(typeof(t.currentPosition)=="undefined")
			return;
        var url=gridServiceUrl+"services/AdminDivisionService/getLocationInfo"; //格点转任意点
        $.ajax({
            data: {"para": "{x:"+ t.currentPosition.lon + ",y:" + t.currentPosition.lat +"}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(data != null)
                {
                    updateLocationInfo(t.currentPosition.lon, t.currentPosition.lat, data.province_name, data.city_name, data.county_name);
                }
            },
            error:function(e){

            },
            type: "POST"
        });
    };

    //展示趋势图
    this.displayGridValueSerial = function(){
        var t = this;
		if(typeof(t.currentPosition)=="undefined")
			return;
        var arrayPoint = [];
        arrayPoint.push({x:t.currentPosition.lon,y:t.currentPosition.lat});
        var strPoints = JSON.stringify(arrayPoint);

        var arrayElement = [];
         arrayElement.push({name:"2t", element:"2t",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("2t"))});
        arrayElement.push({name:"r3", element:"r3",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("r3"))});
        arrayElement.push({name:"wd3", element:"10uv",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("10uv"))});
        arrayElement.push({name:"ws3", element:"10uv",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("10uv"))});
        arrayElement.push({name:"rh", element:"rh",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("rh"))});
        arrayElement.push({name:"tcc", element:"tcc",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("tcc"))});
        arrayElement.push({name:"vis", element:"vis",hourSpans:JSON.stringify(GDYB.GDYBPage.getHourSpan("vis"))});
        var strElements = JSON.stringify(arrayElement);

        var url=gridServiceUrl+"services/GridService/grid2points"; //格点转任意点
        $.ajax({
            data: {"para": "{type:'"+ GDYB.GridProductClass.currentType + "',makeTime:'" + GDYB.GridProductClass.currentMakeTime
                + "',version:'" + GDYB.GridProductClass.currentVersion + "',elements:"+ strElements + ",points:" + strPoints +"}"},
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

    //注册时效点击事件
    function regesterYuBaoShiXiaoEvent(){
        $("#divHourSpan").find("td").click(function () {
            if(typeof(this.id) != "undefined" && this.id != "")
                t.displayGridProduct();
        });
    };

    //图表显隐
    function displayChart(obj) {
        if ($(obj).attr("title") == "隐藏") {
            $("#latticeForcast").css("display", "none");
            $("#map_div").css("right", "8px");
            $("#mapTool_div").css("right", "8px");
            GDYB.Page.curPage.map.updateSize();
            $(obj).attr("title", "显示图表").html("<");
        }
        else {
            $("#latticeForcast").css("display", "block");
            $("#map_div").css("right", "711px");
            $("#mapTool_div").css("right", "711px");
            GDYB.Page.curPage.map.updateSize();
            $(obj).attr("title", "隐藏").html(">");
        }
    }
    function displayTableChart(obj) {
        if ($(obj).attr("title") == "隐藏") {
            $("#latticePrecipitation").css("display", "none");
            $("#map_div").css("bottom", "5px");
            $("#latticeForcast").css("bottom", "5px");
            GDYB.Page.curPage.map.updateSize();
            $(obj).attr("title", "显示图表").html("显示").css("bottom","5px");
        }
        else{
            $("#latticePrecipitation").css("display", "block");
            $("#map_div").css("bottom", "230px");
            $("#latticeForcast").css("bottom", "230px");
            GDYB.Page.curPage.map.updateSize();
            $(obj).attr("title", "隐藏").html("隐藏").css("bottom","219px");
        }
    }
}


GDZSPageClass.prototype = new PageBase();
