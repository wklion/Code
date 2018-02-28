/*
 * 趋势订正
 * by zouwei 2015-05-10
 * */
function Panel_QSDZ(div){
    var stationX = 0.0; //代表站经度
    var stationY = 0.0; //代表站纬度
    var hourSpans = []; //时效数组
    var gridValues = []; //格点值数组

    this.div = div;

	this.hide = function(){
        this.panel.css({"display":"none"});

        //退出时，移除区划和绘制的落区
        if(GDYB.GridProductClass.layerMarkers != null)
            GDYB.GridProductClass.layerMarkers.clearMarkers();
        if(GDYB.GridProductClass.layerClimaticRegion != null)
            GDYB.GridProductClass.layerClimaticRegion.removeAllFeatures();
        if(GDYB.GridProductClass.layerLuoqu != null)
            GDYB.GridProductClass.layerLuoqu.removeAllFeatures();
        if(GDYB.GridProductClass.layerLuoquCenter != null)
            GDYB.GridProductClass.layerLuoquCenter.removeAllFeatures();
    };

    this.createPanelDom = function(){
        this.panel = $("<div id=\"Panel_QSDZ\" class=\"dragPanel\">"
            +"<div class=\"title\"><span>趋势订正</span><a class=\"closeBtn\">×</a></div>"
            +"<div class=\"body\">"
            +"<div id='divLeft' style='float:left'>"
            +"<div id='divElement_QS' style='display: none'><span>选择要素：</span><select id='selectElement_QS' style='width:100px;height:25px;line-height:25px;margin-top:5px;'><option>风速</option><option>风向</option></select></div>"
            +"<div><span>区划类型：</span><select id='selectClimaticRegionType_QS' style='width:100px;height:25px;line-height:25px;margin-top:5px;'><option>无</option></select></div>"
            +"<div><span>选择区域：</span><select id='selectClimaticRegionItem_QS' style='width:100px;height:25px;line-height:25px;margin-top:5px;'><option>无</option></select></div>"
            +"<div id='divStation'><span>代表站点：</span><input  id='inputStation' type='text' style='width:100px;margin-top:5px;' value='南宁（59134）'/></div>"
            +"<div id='divTool' style='float:right;margin-right: 0px;margin-top: 10px;'>"
            +"<button id='btnDrawLuoqu' style='width: 80px'>绘制区域</button><button id='btnApply_QS' style='width: 80px;margin-left: 10px'>应用</button>"
            +"</div>"
            +"</div>"
            +"<div id='divRight' style='float: left'>"
//            +"<div id='divTable_QS'  style='margin-left: 20px;'>"
//            +"</div>"
            +"<div id='divChart' style='width:100%'>"
            +"<canvas id='canvas'></canvas>"
            +"</div>"
            +"</div>"
            +"</div>"
            +"</div>")
            .appendTo(this.div);
        //var canvas = document.getElementById("canvas");
        //cavas.width = $("#divChart").width;
        //GDYB.ChartClass.displayChart();
    };
    var t = this;
    t.init();
    t.panel.css({
        "width":"100%",
        "bottom":"0px",
        "left":"0px"
    });

    var widthParent = parseInt($("#Panel_QSDZ").css("width"));
    var widthLeft = parseInt($("#divLeft").css("width"));
    $("#divRight").css("width", widthParent-widthLeft - 25);

    //refreshChart();
    //$("#inputStation").change(this.refreshChart);

    if(GDYB.GridProductClass.currentElement == "wmax" || GDYB.GridProductClass.currentElement == "10uv"){
        $("#divElement_QS").css("display", "block");
    }
    else{
        $("#divElement_QS").css("display", "none");
    }

    initType();
    function initType(){
        $("#selectClimaticRegionType_QS").empty();
        var url=gridServiceUrl+"services/ClimaticRegionService/getClimaticRegionTypes";
        $.ajax({
            data: {"para": "{}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(data.length > 0)
                {
                    for(var i=0; i<data.length; i++)
                    {
                        $("#selectClimaticRegionType_QS").append("<option value='" + data[i].datasetName + "'>" + data[i].typeName + "</option>");
                    }
                    fillClimaticRegionItem(data[0].datasetName);
                }
            },
            type: "POST"
        });
    }

    $("#selectClimaticRegionType_QS").change(function(){
        fillClimaticRegionItem($(this).val());
    });

    function fillClimaticRegionItem(datasetName){
        $("#selectClimaticRegionItem_QS").empty();
        var url=gridServiceUrl+"services/ClimaticRegionService/getClimaticRegionItemNames";
        $.ajax({
            data: {"para": "{datasetname:'" + datasetName + "'}"},
            url: url,
            dataType: "json",
            success: function (data) {
                for(var i=0; i<data.length; i++)
                {
                    $("#selectClimaticRegionItem_QS").append("<option value='" + data[i].regionId + "'>" + data[i].regionName + "</option>");
                }
                if(data.length > 0)
                {
                    t.refreshClimaticRegionItem(datasetName, data[0].regionId);
                }
            },
            type: "POST"
        });
    }

    $("#selectClimaticRegionItem_QS").change(function(){
        t.refreshClimaticRegionItem($("#selectClimaticRegionType_QS").val(), $(this).val());
    });

    //刷新数据
    this.refreshClimaticRegionItem =  function(datasetName, regionId)
    {
        showClimaticRegionItem(datasetName, regionId);
    }

    //显示气候区划
    function showClimaticRegionItem(datasetName, regionId)
    {
        var url=gridServiceUrl+"services/ClimaticRegionService/getClimaticRegionItem";
        $.ajax({
            data: {"para": "{datasetName:'" + datasetName+ "',regionId:" + regionId + "}"},
            url: url,
            dataType: "json",
            success: function (data) {
                var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(data);
                var fAttributes = feature.attributes;
                fAttributes["FEATUREID"] = regionId;//fAttributes["SMID"];

                stationX = Number(fAttributes["STATIONX"]);
                stationY = Number(fAttributes["STATIONY"]);

                //显示代表站
                $("#inputStation").val(fAttributes["STATIONNAM"] + "("+fAttributes["STATIONCOD"]+")"); //SHP文件字段名有长度限制吗，最后一个E都放不下

                GDYB.GridProductClass.layerMarkers.clearMarkers();
                var size = new WeatherMap.Size(25,30);
                var offset = new WeatherMap.Pixel(-(size.w/2), -size.h);
                var icon = new WeatherMap.Icon('imgs/marker.png', size, offset);
                GDYB.GridProductClass.layerMarkers.addMarker(new WeatherMap.Marker(new WeatherMap.LonLat(stationX,stationY),icon));

                //气候区划
                GDYB.GridProductClass.layerClimaticRegion.removeAllFeatures();
                feature.style = {
                    strokeColor: "#a548ca",
                    strokeWidth: 2.0,
                    //fillColor: "#90fa64",
                    fillColor: "#FF0000",
                    fillOpacity: "0.3",
                    fill:false
                };
                var features = [];
                features.push(feature);
                GDYB.GridProductClass.layerClimaticRegion.addFeatures(features);
                GDYB.Page.curPage.map.setLayerIndex(GDYB.GridProductClass.layerClimaticRegion,99);

                refreshChart(); //必须要让该线程结束，也即stationX、stationY变化后，才能刷新地图，否则stationX、stationY会匹配错误

                if(GDYB.GridProductClass.layerLuoqu != null)
                    GDYB.GridProductClass.layerLuoqu.removeAllFeatures(); //移除落区
                if(GDYB.GridProductClass.layerLuoquCenter != null)
                    GDYB.GridProductClass.layerLuoquCenter.removeAllFeatures(); //移除落区中心点
            },
            type: "POST"
        });
    }

    //初始化（刷新）图表
    function refreshChart(){
        hourSpans = [];
        gridValues = [];

        var c = document.getElementById("canvas");
        //c.width = document.getElementById("divChart").clientWidth-document.getElementById("divLeft").clientWidth;
        c.width = parseInt($("#divRight").css("width"));

        var isWindDirection = (GDYB.GridProductClass.currentElement == "wmax" || GDYB.GridProductClass.currentElement == "10uv") && $("#selectElement_QS").val() == "风向";

        var x = stationX;
        var y = stationY;
        var strLabels = [];
        var dValues = [];
        var dValuesData = {};
        var dataCache = GDYB.GridProductClass.dataCache;
        var xnum = 0;
        var ynum = 0;
        function getEachData(hourSpan){
            dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, GDYB.GridProductClass.currentDateTime, GDYB.GridProductClass.currentElement,hourSpan,function(data){
                var datasetGrid = data.data;
                var cell = datasetGrid.xyToGrid(x, y);
                var val = isWindDirection?datasetGrid.getValue(1, cell.x, cell.y):datasetGrid.getValue(0, cell.x, cell.y);
                if(val == datasetGrid.noDataValue) //如果是无效值，暂时用0表示。
                    val = 0;
                //dValues.push(val);
                dValuesData[hourSpan] = val;
                xnum ++;
                if(xnum == ynum){
                    for(var i=0;i<hourSpans.length;i++){
                        dValues.push(dValuesData[hourSpans[i]]);
                    }
                    GDYB.ChartClass.lineChartData = {
                        labels : strLabels,
                        datasets : [
                            {
                                fillColor : "rgba(255,200,150,0.5)",
                                strokeColor : "rgba(243,150,0,1)",
                                pointColor : "rgba(243,150,0,1)",
                                pointStrokeColor : "#fff",
                                data : dValues
                            }
                        ]

                    };
                    GDYB.ChartClass.displayChart();
                }
            })
        }
        var elementData = dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, GDYB.GridProductClass.currentDateTime, GDYB.GridProductClass.currentElement);
        for(var key in elementData)
        {
            ynum++;
            strLabels.push(key + "h");
            hourSpans.push(key);
            getEachData(key);
        }
    }

    //绘制区域
    $("#btnDrawLuoqu").click(function(){
        GDYB.GridProductClass.currentGridValueDown = GDYB.GridProductClass.datasetGrid.noDataValue;
        GDYB.GridProductClass.currentGridValueUp = GDYB.GridProductClass.datasetGrid.noDataValue;
        startDrawLuoqu();
        isDrawing = true;

        function startDrawLuoqu(){
            GDYB.GridProductClass.layerLuoqu.removeAllFeatures();
            GDYB.GridProductClass.layerLuoquCenter.removeAllFeatures();
            GDYB.GridProductClass.drawLuoqu.activate();
            GDYB.GridProductClass.drawFreePath.deactivate();
            stopDragMap();

            function stopDragMap()
            {
                var map = GDYB.Page.curPage.map;
                for(var i =0; i < map.events.listeners.mousemove.length; i++) {
                    var handler = map.events.listeners.mousemove[i];
                    if(handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag")
                    {
                        handler.obj.active = false;
                    }
                }
            }
        }
    });

    $("#div_element").find("button").click(function(){
        if(GDYB.GridProductClass.currentElement == "wmax" || GDYB.GridProductClass.currentElement == "10uv"){
            $("#divElement_QS").css("display", "block");
        }
        else{
            $("#divElement_QS").css("display", "none");
        }

        if(t.panel.css("display") != "none")
            refreshChart();
    });

    $("#selectElement_QS").change(function(){
        refreshChart();
    });

    //落区绘制完成
    var isDrawing = false;
    GDYB.GridProductClass.drawLuoqu.events.on({"featureadded": drawCompleted});
    function drawCompleted() {
        if(isDrawing){
            isDrawing = false;
            addLuoquCenter();
            stopDrawLuoqu();

            //添加落区中心点
            function addLuoquCenter(){
                var feature = GDYB.GridProductClass.layerLuoqu.features[0];
                var bounds = feature.geometry.bounds;
                var centerLonLat = {x:bounds.left + (bounds.right - bounds.left)/2, y:bounds.bottom+(bounds.top - bounds.bottom)/2};
                var pointCenter = new WeatherMap.Geometry.Point(centerLonLat.x, centerLonLat.y);
                var featureCenter = new WeatherMap.Feature.Vector(pointCenter);
                GDYB.GridProductClass.layerLuoquCenter.addFeatures([featureCenter]);

                GDYB.GridProductClass.layerClimaticRegion.removeAllFeatures(); //移除气候区划
                stationX = centerLonLat.x;
                stationY = centerLonLat.y;
                refreshChart();
            }

            function stopDrawLuoqu(){
                startDragMap();
                if(GDYB.GridProductClass.drawLuoqu != null)
                    GDYB.GridProductClass.drawLuoqu.deactivate();

                function startDragMap()
                {
                    var map = GDYB.Page.curPage.map;
                    for(var i =0; i < map.events.listeners.mousemove.length; i++) {
                        var handler = map.events.listeners.mousemove[i];
                        if(handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag")
                        {
                            handler.obj.active = true;
                        }
                    }
                }
            }
        }
    };

    //落区中心点移动
    GDYB.GridProductClass.dragFeature.onComplete = function(feature, pixel){
        if(feature != null && feature.geometry.CLASS_NAME == "WeatherMap.Geometry.Point") {
            stationX = feature.geometry.x;
            stationY = feature.geometry.y;
            refreshChart();
        }
    };

    //点击应用
    $("#btnApply_QS").click(function(){
        if(GDYB.ChartClass.lineChartData == null)
            return;

        var geo = null;
        if(GDYB.GridProductClass.layerLuoqu != null && GDYB.GridProductClass.layerLuoqu.features.length != 0)
            geo = GDYB.GridProductClass.layerLuoqu.features[0].geometry;
        else if(GDYB.GridProductClass.layerClimaticRegion != null && GDYB.GridProductClass.layerClimaticRegion.features.length != 0)
            geo = GDYB.GridProductClass.layerClimaticRegion.features[0].geometry;
         if(geo == null)
        {
            $("#div_modal_confirm_content").html("请选择或者绘制区域。");
            $("#div_modal_confirm").modal();
            $("#div_modal_confirm").find("a").unbind();
            return;
        }

        var isWindDirection = (GDYB.GridProductClass.currentElement == "wmax" || GDYB.GridProductClass.currentElement == "10uv") && $("#selectElement_QS").val() == "风向";

        //var method = 2; //固定增量方式订正，无法解决基准格点值为0的情况，无法除以0，比如降水为0，订正为10，无法知道增加的百分比为多少
        var method = isWindDirection?0:1; //由于上面的问题，只能统一加减值
        var datas = GDYB.ChartClass.lineChartData.datasets[0].data;
        //var increment = [];
        for(var i=0; i<datas.length; i++)
        {
            //increment.push((datas[i]-gridValues[i])/gridValues[i]); //如果格点值为0怎么办？
            //increment.push(datas[i]-gridValues[i]); //由于上面的问题，只能统一加减值
            qsdzSetValue(i);
        }
        var num = 0;
        function qsdzSetValue(i){
            var hourSpan = hourSpans[i];
            GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, GDYB.GridProductClass.currentDateTime, GDYB.GridProductClass.currentElement, hourSpan, function(hourSpanData){
                if(hourSpanData != null && hourSpanData.data != null){
                    var datasetGrid = hourSpanData.data;
                    var x = stationX;
                    var y = stationY;
                    var cell = datasetGrid.xyToGrid(x, y);
                    var valSrc = isWindDirection?datasetGrid.getValue(1, cell.x, cell.y) : datasetGrid.getValue(0, cell.x, cell.y);
                    var increment = datas[i]-valSrc;
                    if(increment != 0) {
                        GDYB.GridProductClass.fillRegion(datasetGrid, geo, isWindDirection?datas[i]:increment, method, GDYB.GridProductClass.currentElement, isWindDirection);
                        GDYB.GridProductClass.dataCache.setDataStatus(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, GDYB.GridProductClass.currentDateTime, GDYB.GridProductClass.currentElement, hourSpan, 1, datasetGrid); //更新已修改状态
                    }
                }
                num++;
                if(num == datas.length){
                    GDYB.GridProductClass.layerFillRangeColor.refresh();
                    GDYB.GridProductClass.dataCache.clearMem();
                }
            });
        }
    });
}

Panel_QSDZ.prototype = new DragPanelBase();