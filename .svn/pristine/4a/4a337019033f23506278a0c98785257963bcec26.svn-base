/*
* SWAN雷达数据类
* by zouwei, 2015-08-25
* */
function RadarDataClass() {
    this.datasetGrid = null;            //格点数据集
    this.layerFillRangeColor = null;    //填色图层
    this.currentElement = null;         //当前要素
    this.currentLevel = null;           //当前仰角
    this.currentDateTime = null;        //当前时间
    this.layerVector = null;            //矢量图层，用于TITAN、TREC等

    this.displayRadarData=function(recall, element, level, datetime){
        this.currentElement = element;
        this.currentLevel = level;
        this.currentDateTime = datetime;
        var map = GDYB.Page.curPage.map;
        this.addLayer(map);
        if(element == "swan_titan")
            this.addVector(recall, map);
        else
            this.addGrid(recall, map);
    };

    this.addLayer = function(pMap){
        if(this.layerFillRangeColor == null) {
            this.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer(
                "RadarMap",
                {
                    "radius": 40,
                    "featureWeight": "value",
                    "featureRadius": "geoRadius"
                }
            );
            var items = heatMap_RadarStyles;
            this.layerFillRangeColor.items = items;
            this.layerFillRangeColor.isSmooth = true;
            this.layerFillRangeColor.isAlwaySmooth = true;
            this.layerFillRangeColor.isShowGridline = false;
            this.layerFillRangeColor.isShowLabel = false;
            pMap.addLayers([this.layerFillRangeColor]);
        }

        if(this.currentElement == "swan_trec"){
            this.layerFillRangeColor.items = heatMap_10uvStyles;
            this.layerFillRangeColor.isWind = true;
            this.layerFillRangeColor.isShowFillColor = false;
			this.layerFillRangeColor.isShowAll = true;
        }
        else{
            this.layerFillRangeColor.items = heatMap_RadarStyles;
            this.layerFillRangeColor.isWind = false;
        }

        if(this.layerVector == null){
            this.layerVector = new WeatherMap.Layer.Vector("layerVector", {renderers: ["Canvas"]});
            this.layerVector.style = {
                fillColor: "#ff0000",
                strokeColor: "#ff0000",
                strokeWidth: 1.0,
                pointRadius:2
            };
            pMap.addLayers([this.layerVector]);
        }
    };

    this.addGrid = function(recall, pMap){
        var t = this;

        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");

        getGrid(function(datasetGrid){
            //if(datasetGrid != null && datasetGrid.rows > 0)  //为空也要赋值，清空数据
            {
                t.datasetGrid = datasetGrid;
                if(t.layerFillRangeColor != null)
                    t.layerFillRangeColor.setDatasetGrid(datasetGrid);
                recall&&recall();
            }
        },null);

        function getGrid(recall){
            var t1 = new Date().getTime();
            var url=dataSericeUrl+"services/SwanRadarService/getGrid";
            $.ajax({
                data:{"para":"{element:'"+ t.currentElement + "',level:'"+ t.currentLevel + "',datetime:'"+ t.currentDateTime + "'}"},
                url:url,
                dataType:"json",
                success:function(data){
                    var datasetGrid = null;
                    try
                    {
                        if(typeof(data) != "undefined")
                        {
                            var dvalues = data.dvalues;
                            if(dvalues != null && dvalues.length > 0)
                            {
                                var bWind = t.currentElement == "swan_trec";
                                var dimensions = bWind? 2 : 1; //维度，风场有两维
                                datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols, bWind?2:1);
                                datasetGrid.noDataValue = data.noDataValue;
                                var grid = [];
                                for(var i=0;i<data.rows;i++){
                                    var nIndexLine = data.cols * i * dimensions;
                                    for(var j=0;j<data.cols;j++){
                                        var nIndex = nIndexLine + j * dimensions;
                                        if (bWind){
                                            grid.push(dvalues[nIndex+1]); //风速在前
                                            grid.push(dvalues[nIndex]);   //风向在后
                                        }
                                        else
                                            grid.push(dvalues[nIndex]);
                                    }
                                }
                                datasetGrid.grid = grid;
                            }
                        }
                        else
                        {
                            alertFuc("无数据");
                        }
                    }
                    catch (err)
                    {
                        alert(err.description);
                    }
                    $("#div_progress").css("display", "none");
                    recall&&recall(datasetGrid);
                },
                error: function (e) {
                    $("#div_progress").css("display", "none");
                },
                type:"POST"
            });
        }
    };

    this.addVector = function(recall, pMap){
        var t = this;
        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");
        var url=dataSericeUrl+"services/SwanRadarService/getVector";
        $.ajax({
            data:{"para":"{element:'"+ t.currentElement + "',level:'"+ t.currentLevel + "',datetime:'"+ t.currentDateTime + "'}"},
            url:url,
            dataType:"json",
            success:function(data){
                try
                {
                    if(data.length > 0) {
                        var features = [];
                        var ptsTemp = [];
                        for (var key in data) {
                            var jgeo = data[key];
                            var geo = null;
                            var style = null;
                            if (jgeo.type == "POINT") {
                                geo = new WeatherMap.Geometry.Point(jgeo.point.x, jgeo.point.y);
                                ptsTemp.push(new WeatherMap.Geometry.Point(jgeo.point.x, jgeo.point.y));
                            }
                            else if (jgeo.type == "LINE") {
                                var pointArray = new Array();
                                var pt = null;
                                for (var keyOfPoint in jgeo.points) {
                                    pt = jgeo.points[keyOfPoint];
                                    pointArray.push(new WeatherMap.Geometry.Point(pt.x, pt.y));
                                }
                                geo = new WeatherMap.Geometry.LineString(pointArray);
                                geo.calculateBounds();
                            }
                            if(jgeo.fields["ForecastMinute"] == 0){
                                style =  {
                                    pointRadius:2,
                                    fillColor: "rgb(255,134,53)",
                                    strokeColor: "rgb(255,134,53)",
                                    strokeWidth: 2.0
                                };
                            }
                            else if(jgeo.fields["ForecastMinute"] == 30){
                                style =  {
                                    pointRadius:2,
                                    fillColor: "rgb(255,0,0)",
                                    strokeColor: "rgb(255,0,0)",
                                    strokeWidth: 2.0
                                };
                            }
                            else if(jgeo.fields["ForecastMinute"] == 60){
                                style =  {
                                    pointRadius:2,
                                    fillColor: "rgb(3,91,81)",
                                    strokeColor: "rgb(3,91,81)",
                                    strokeWidth: 2.0
                                };
                            }
                            if(geo != null) {
                                var feature = new WeatherMap.Feature.Vector(geo, null, style);
                                features.push(feature);
                            }
                        }
                        t.layerVector.removeAllFeatures();
                        t.layerVector.addFeatures(features);
                    }
                    else{
                        t.layerVector.removeAllFeatures();
                    }
                }
                catch (err)
                {
                    alert(err.description);
                }
                $("#div_progress").css("display", "none");
                recall&&recall();
            },
            error: function (e) {
                $("#div_progress").css("display", "none");
            },
            type:"POST"
        });
    };

    this.clearRadarData = function(name){
        if(name == "swan_titan"){
            if(this.layerVector != null)
                this.layerVector.removeAllFeatures();
        }
        else{
            if(this.layerFillRangeColor != null)
                this.layerFillRangeColor.setDatasetGrid(null);
        }
    }

    this.getRadarData = function(recall, element, level, datetime){
        if(element == "swan_titan"){
            var url=dataSericeUrl+"services/SwanRadarService/getVector";
            $.ajax({
                type:"POST",
                data: {"para": "{element:'" + element + "',level:'" + level + "',datetime:'" + datetime + "'}"},
                url: url,
                dataType: "json",
                success: function (data) {
                    recall(data);
                }
            });
        }
        else{
            var url=dataSericeUrl+"services/SwanRadarService/getGrid";
            $.ajax({
                type:"POST",
                data: {"para": "{element:'" + element + "',level:'" + level + "',datetime:'" + datetime + "'}"},
                url: url,
                dataType: "json",
                success: function (data) {
                    if(typeof (data) == "undefined")
                        recall([]);
                    else
                        recall(data.dvalues);
                }
            });
        }
    }
}