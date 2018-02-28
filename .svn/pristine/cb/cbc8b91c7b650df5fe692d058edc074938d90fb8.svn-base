/*
* AWX云图数据类
* by zouwei, 2015-08-25
* */
function AWXDataClass() {
    this.datasetGrid = null;            //格点数据集
    this.layerFillRangeColor = null;    //填色图层
    this.currentElement = null;         //当前要素
    this.currentDateTime = null;        //当前时间
    this.layerVector = null;            //矢量图层，用于MCS等

    this.display=function(recall, element, datetime){
        this.currentElement = element;
        this.currentDateTime = datetime;
        var map = GDYB.Page.curPage.map;
        this.addLayer(map);
        if(element == "FY2E_mcs" || element == "Himawari-8_mcs")
            this.addMCS(recall, map);
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
            if(this.currentElement == "PRE")
                items = heatMap_Rain24Styles;
            this.layerFillRangeColor.items = items;
            this.layerFillRangeColor.isShowGridline = false;
            this.layerFillRangeColor.isShowLabel = false;
            pMap.addLayers([this.layerFillRangeColor]);
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
            var url=dataSericeUrl+"services/AWXService/getGrid";
            $.ajax({
                data:{"para":"{element:'"+ t.currentElement + "',datetime:'"+ t.currentDateTime + "'}"},
                url:url,
                dataType:"json",
                success:function(data){
                    var datasetGrid = null;
                    try
                    {
                        var dvalues = data.dvalues;
                        if(dvalues != null && dvalues.length > 0)
                        {
                            datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols);
                            datasetGrid.noDataValue = data.noDataValue;
                            var grid = [];
                            for(var i=0;i<data.rows;i++){
                                var nIndexLine = data.cols*i;
                                for(var j=0;j<data.cols;j++){
                                    var nIndex = nIndexLine + j;
                                    grid.push(dvalues[nIndex]);
                                }
                            }
                            datasetGrid.grid = grid;
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

    this.addMCS = function(recall, pMap){
        var t = this;
        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");
        var url=dataSericeUrl+"services/AWXService/getMCS";
        //t.currentDateTime = "2016-06-15 15:15:00"
        $.ajax({
            data:{"para":"{element:'"+ t.currentElement + "',level:'"+ t.currentLevel + "',datetime:'"+ t.currentDateTime + "'}"},
            url:url,
            dataType:"json",
            success:function(data){
                try
                {
                    if(typeof(data) != "undefined") {
                        var result = GDYB.FeatureUtilityClass.getRecordsetFromJson(data);
                        var features = [];
                        var len = result.features.length;
                        for (var i = 0; i < len; i++) {
                            var feature = result.features[i];
                            var style = {
                                fill: false,
                                strokeColor: "#ff0000",
                                strokeWidth: 2.0
                            };
                            if(feature.attributes["值"] == 211){
                                style = {
                                    fill: false,
                                    strokeColor: "#0000ff",
                                    strokeWidth: 2.0
                                };
                            }
                            else if(feature.attributes["值"] == 221){
                                style = {
                                    fill: false,
                                    strokeColor: "#00ff00",
                                    strokeWidth: 2.0
                                };
                            }
                            else if(feature.attributes["值"] == 241){
                                style = {
                                    fill: false,
                                    strokeColor: "#ff0000",
                                    strokeWidth: 2.0
                                };
                            }
                            feature.style = style;
                            features.push(feature);
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
                if(typeof (data) == "undefined")
                    recall&&recall([]);
                else
                    recall&&recall(data.features);
                //recall&&recall();
            },
            error: function (e) {
                $("#div_progress").css("display", "none");
            },
            type:"POST"
        });
    };

    this.clearMCS = function(){
        if(this.layerVector != null)
            this.layerVector.removeAllFeatures();
    }

    this.getAWXData = function(recall, element, datetime){
        var url=dataSericeUrl+"services/AWXService/getMCS";
        //t.currentDateTime = "2016-06-15 15:15:00"
        $.ajax({
            type:"POST",
            data: {"para": "{element:'" + element + "',level:'0',datetime:'" + datetime + "'}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(typeof (data) == "undefined")
                    recall([]);
                else
                    recall(data.features);
            }
        });
    }
}