/*
* 网格预报检验
* by zouwei, 2015-11-26
* */
function GridCheckDataClass() {
    this.datasetGrid = null;            //格点数据集
    this.layerFillRangeColor = null;    //填色图层

    this.display=function(recall, startTime, endTime, forecastHour, hourSpan, element, type, productType){
        var map = GDYB.Page.curPage.map;
        this.addLayer(map);
        this.addGrid(recall, startTime, endTime, forecastHour, hourSpan, element, type, productType);
    };

    this.addLayer = function(map){
        if(this.layerFillRangeColor == null) {
            this.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer(
                "GridCheck",
                {
                    "radius": 40,
                    "featureWeight": "value",
                    "featureRadius": "geoRadius"
                }
            );
            var items = heatMap_CheckDevia;
            this.layerFillRangeColor.items = items;
            this.layerFillRangeColor.isSmooth = true;
            this.layerFillRangeColor.isAlwaySmooth = true;
            this.layerFillRangeColor.isShowGridline = false;
            this.layerFillRangeColor.isShowLabel = true;
            this.layerFillRangeColor.isWind = false;
            map.addLayers([this.layerFillRangeColor]);
        }
    };

    this.addGrid = function(recall, startTime, endTime, forecastHour, hourSpan, element, type, productType){
        var t = this;

        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");

        getGrid(function(datasetGrid){
            {
                t.datasetGrid = datasetGrid;
                if(t.layerFillRangeColor != null)
                    t.layerFillRangeColor.setDatasetGrid(datasetGrid);
                recall&&recall();
            }
        },null);

        function getGrid(recall){
            var t1 = new Date().getTime();
            var url=dataSericeUrl+"services/GridCheckService/getData";
            $.ajax({
                data:{"para":"{startTime:'"+ startTime + "',endTime:'"+ endTime + "',forecastHour:"+ forecastHour + ",hourSpan:"+ hourSpan + ",element:'"+ element + "',type:'"+ type + "',productType:'"+ productType + "'}"},
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

    this.clearRadarData = function(name){
        if(this.layerFillRangeColor != null)
            this.layerFillRangeColor.setDatasetGrid(null);
    }
}