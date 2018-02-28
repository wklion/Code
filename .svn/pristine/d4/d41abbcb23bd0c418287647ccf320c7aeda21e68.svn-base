/*
 * Micaps数据类
 * by zouwei, 2015-08-25
 * */
function MicapsDataClass() {
    this.isInitialized = false;         //是否已初始化
    this.layerPlot = null;              //填图图层
    this.currentElement = null;         //当前要素
    this.currentLevel = null;           //当前层次
    this.currentDateTime = null;        //当前时次
    this.currentHourSpan = null;        //当前时效

    this.datasetGrid = null;            //格点数据集
    this.layerFillRangeColor = null;    //填色图层

    this.layerContour = null;           //等值线图层

    this.name = null;

    this.displayMicapsData=function(recall, element, level, datetime, hourspan){
        this.currentElement = element;
        this.currentLevel = level;
        this.currentDateTime = datetime;
        this.currentHourSpan = hourspan;

        var t = this;

        var map = GDYB.Page.curPage.map;
//        map.setCenter(new WeatherMap.LonLat(110, 35), 3); //设置可视范围
        this.addLayer(map);
        this.addData(function(){
            if(!(t.currentElement == "surface_plot" || t.currentElement == "high_plot" ||
                t.currentElement == "fy2_ir1" || t.currentElement == "fy2_ir2" || t.currentElement == "fy2_ir3"
                || t.currentElement == "fy2_ir4" || t.currentElement == "fy2_vis" || t.currentElement == "grapes_3km_cr" || t.currentElement == "grapes_3km_rain"
                || t.currentElement == "prob_ncep_rain" || t.currentElement == "prob_ncep_hail"
                || t.currentElement == "physic_Q"|| t.currentElement == "physic_RH"|| t.currentElement == "physic_FH"|| t.currentElement == "physic_IFVQ"|| t.currentElement == "physic_PW"))
                t.addContour(recall, map);
            else
                recall&&recall();
        }, map);
    };

    this.addLayer = function(pMap){
        //填图图层
        if(this.layerPlot == null) {
            this.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", {renderers: ["Plot"]});
            pMap.addLayers([this.layerPlot]);

            //对象选中事件
            var t = this;
            var callbacks = {
                renderer: null,

                over: function (currentFeature) {

                },

                click: function (currentFeature) {
                    var plotRenderer = this.layer.renderer; //this是SelectFeature
                    if (plotRenderer.listDrawnID.indexOf(currentFeature.id) >= 0)
                        return;
                    plotRenderer.drawGeometry(currentFeature.geometry, plotRenderer.features[currentFeature.id][1], currentFeature.id);
                },

                out: function (currentFeature) {
                }
            };

            var selectFeature = new WeatherMap.Control.SelectFeature(this.layerPlot,
                {
                    callbacks: callbacks
                });
            pMap.addControl(selectFeature);
            selectFeature.activate();
        }

        //填色图层
        if(this.layerFillRangeColor == null)
        {
                this.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer(
                    "layerMicapsGrid",
                    {
                        "radius": 40,
                        "featureWeight": "value",
                        "featureRadius": "geoRadius"
                    }
                );
                this.layerFillRangeColor.isSmooth = true;
                this.layerFillRangeColor.isShowGridline = false;
                this.layerFillRangeColor.isShowLabel = false;
                pMap.addLayers([this.layerFillRangeColor]);

                //等值线图层
                this.layerContour = new WeatherMap.Layer.Vector("layerContour", {renderers: ["Contour"]});
                this.layerContour.renderer.labelField = "值";
            if(t.currentElement == "physic_A"|| t.currentElement == "physic_K"|| t.currentElement == "physic_LI"|| t.currentElement == "physic_CIN"|| t.currentElement == "physic_T700-300"
                || t.currentElement == "physic_T700-500"|| t.currentElement == "physic_CAPE"|| t.currentElement == "physic_THESE"){
                this.layerContour.style = {
                    strokeColor:"red",
                    strokeWidth:"1"
                }
            }
            else if(t.currentElement == "physic_VOR"|| t.currentElement == "physic_DIV"){
                this.layerContour.style = {
                    strokeColor:"black",
                    strokeWidth:"1"
                }
            }
            else if(t.currentElement == "physic_H-20"|| t.currentElement == "physic_H0"){
                this.layerContour.style = {
                    strokeColor:"rgb(238,157,9)",
                    strokeWidth:"1"
                }
            }
                pMap.addLayers([this.layerContour]);
        }

        //图层风格设置
        if(this.currentElement == "surface_plot" || this.currentElement == "surface")
        {
            this.layerPlot.renderer.styles = plotStyles_surface;
            this.layerPlot.renderer.plotWidth = 90;
            this.layerPlot.renderer.plotHeight = 80;
        }
        else if(this.currentElement == "high_plot" || this.currentElement == "high")
        {
            this.layerPlot.renderer.styles = plotStyles_hight;
            this.layerPlot.renderer.plotWidth = 80;
            this.layerPlot.renderer.plotHeight = 70;
        }

        this.layerFillRangeColor.isShowLabel = false;
        if(this.currentElement == "fy2_ir1")
            this.layerFillRangeColor.items = heatMap_IR1Styles;
        else if(this.currentElement == "fy2_ir2")
            this.layerFillRangeColor.items = heatMap_IR2Styles;
        else if(this.currentElement == "fy2_ir3")
            this.layerFillRangeColor.items = heatMap_IR3Styles;
        else if(this.currentElement == "fy2_ir4")
            this.layerFillRangeColor.items = heatMap_IR4Styles;
        else if(this.currentElement == "fy2_vis")
            this.layerFillRangeColor.items = heatMap_FYVISStyles;
        else if(this.currentElement == "grapes_3km_rain")
            this.layerFillRangeColor.items = heatMap_Rain24Styles;
        else if(this.currentElement == "grapes_3km_cr")
            this.layerFillRangeColor.items = heatMap_RadarStyles;
        else if(this.currentElement == "prob_ncep_rain" || this.currentElement == "prob_ncep_hail")
        {
            this.layerFillRangeColor.items = heatMap_RHStyles;
            this.layerFillRangeColor.isShowLabel = true;
        }
        else
            this.layerFillRangeColor.items = heatMap_TempStyles;

        //查看栅格值
        if(!this.isInitialized) {
            this.isInitialized = true;
            var t = this;
            var bDrag = false;
            pMap.events.register("mousemove", pMap, function (event) {
                if (!bDrag && t.datasetGrid != null) {
                    if(t.currentElement == "fy2_ir1" || t.currentElement == "fy2_ir2" || t.currentElement == "fy2_ir3"
                        || t.currentElement == "fy2_ir4" || t.currentElement == "fy2_vis")
                        return;
                    $("#div_showGridValue").css("display", "block");
                    if(event.xy.x+20+100>parseInt($("#map_div").css("width"))){
                        $("#div_showGridValue").css("left", event.xy.x - 100);
                    }
                    else{
                        $("#div_showGridValue").css("left", event.xy.x + 20);
                    }
                    if(event.xy.y+20+62>parseInt($("#map_div").css("height"))){
                        $("#div_showGridValue").css("top", event.xy.y - 62);
                    }
                    else{
                        $("#div_showGridValue").css("top", event.xy.y + 20);
                    }
                    var lonlat = this.getLonLatFromPixel(event.xy);
                    var dValue = "-";
                    var pt = t.datasetGrid.xyToGrid(lonlat.lon, lonlat.lat);
                    if(pt==null){
                        return;
                    }
                    dValue = t.datasetGrid.getValue(0, pt.x, pt.y);
                    $("#div_showGridValue").html("经度：" + Math.round(lonlat.lon * 10000) / 10000 + "<br/>" +
                        "纬度：" + Math.round(lonlat.lat * 10000) / 10000 + "<br/>" +
                        "格点：" + Math.round(dValue * 10) / 10);
                }
                else {
                    $("#div_showGridValue").css("display", "none");
                }
            });

            pMap.events.register("movestart", pMap, function (event) {
                bDrag = true;
                $("#div_showGridValue").css("display", "none");
            });

            pMap.events.register("moveend", pMap, function (event) {
                bDrag = false;
            });
        }
    };

    /*
     * 添加数据
     */
    this.addData = function(recall, pMap){
        var t = this;

        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");

        if(t.currentElement == "physic_A"|| t.currentElement == "physic_K"|| t.currentElement == "lz_physic_K"
            || t.currentElement == "physic_LI" || t.currentElement == "lz_physic_LI"
            || t.currentElement == "physic_CIN" || t.currentElement == "lz_physic_CIN"|| t.currentElement == "hd_physic_CIN"
            || t.currentElement == "physic_T700-300" || t.currentElement == "physic_T700-500"
            || t.currentElement == "physic_CAPE" || t.currentElement == "lz_physic_CAPE"|| t.currentElement == "hd_physic_CAPE"
            || t.currentElement == "physic_THESE" || t.currentElement == "lz_physic_THESE"
            || t.currentElement == "physic_VOR"|| t.currentElement == "physic_DIV" || t.currentElement == "lz_physic_DIV"
            || t.currentElement == "physic_H-20"|| t.currentElement == "physic_H0"){
            $("#div_progress").css("display", "none");
            recall&&recall();
            return;
        }
        getData(function(features, datasetGrid){
            if(datasetGrid!=null){
                var dataFilter = new DataFilter();
                dataFilter.datasetgridFilter(datasetGrid,t.currentElement);
            }
            if(features != null && features.length > 0)
            {
                t.layerPlot.removeAllFeatures();
                t.layerPlot.addFeatures(features);
            }
            else{
                t.layerPlot.removeAllFeatures();
            }
            //else if(datasetGrid != null && datasetGrid.rows > 0) //为空也要赋值，清空数据
            {
                t.datasetGrid = datasetGrid;
                if(t.layerFillRangeColor != null) {
                    //根据值域，重组风格
                    if (typeof(datasetGrid) != "undefined" && datasetGrid != null && t.currentElement.substring(0, 6) == "physic") {
                        var dMin = Math.floor(datasetGrid.dMin * 10) / 10;
                        var dMax = Math.floor(datasetGrid.dMax * 10 + 1.0) / 10; //向上取十分位整
                        var items = t.layerFillRangeColor.items;
                        var dStep = (dMax - dMin) / items.length;
                        for (var i = 0; i < items.length; i++) {
                            items[i].start = dMin + dStep * i;
                            items[i].end = dMin + dStep * (i + 1);
                        }
                    }
                    t.layerFillRangeColor.setDatasetGrid(datasetGrid);
                    t.layerFillRangeColor.refresh();
                }
            }
            recall&&recall();
        },null);

        function getData(recall){
            t.layerContour.removeAllFeatures();
            var name = t.currentElement;
            var t1 = new Date().getTime();
            var url=dataSericeUrl+"services/MicapsService/getData";
            $.ajax({
                data:{"para":"{element:'"+ t.currentElement + "',level:'"+ t.currentLevel + "',hourspan:"+ t.currentHourSpan + ",datetime:'"+ t.currentDateTime + "'}"},
                url:url,
                dataType:"json",
                success:function(data){
                    if(name != t.currentElement){
                        return;
                    }
                    var features = null;
                    var datasetGrid = null;
                    try
                    {
                        if(typeof(data) != "undefined")
                        {
                            if(data.hasOwnProperty("featureUriList")) //矢量数据
                            {
                                var result = GDYB.FeatureUtilityClass.getRecordsetFromJson(data);
                                features = result.features;
                            }
                            else if(data.hasOwnProperty("dvalues")) //格点数据
                            {
                                var dvalues = data.dvalues;
                                if(dvalues != null && dvalues.length > 0)
                                {
                                    var dMin=9999;
                                    var dMax=-9999;
                                    datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols);
                                    datasetGrid.noDataValue = data.noDataValue;
                                    var grid = [];
                                    for(var i=0;i<data.rows;i++){
                                        var nIndexLine = data.cols*i;
                                        for(var j=0;j<data.cols;j++){
                                            var nIndex = nIndexLine + j;
                                            var z = dvalues[nIndex];
                                            grid.push(z);
                                            if(z != 9999 && z != -9999)
                                            {
                                                if(z < dMin)
                                                    dMin = z;
                                                if(z > dMax)
                                                    dMax = z;
                                             }
                                        }
                                    }
                                    datasetGrid.grid = grid;
                                    datasetGrid.dMin = dMin;
                                    datasetGrid.dMax = dMax;
                                }
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
                    recall&&recall(features, datasetGrid);
                },
                error: function (e) {
                    $("#div_progress").css("display", "none");
                },
                type:"POST"
            });
        }
    };

    /*
     * 添加等值线
     */
    this.addContour = function(recall, pMap) {
        $("#div_progress_title").html("正在下载数据...");
        $("#div_progress").css("display", "block");
        var t = this;
        var url = dataSericeUrl + "services/MicapsService/getContour";
        var element = t.currentElement;
        var dataFilter = new DataFilter();
        var cons = dataFilter.getFilterCondition(t.currentElement);
        $.ajax({
            url: url,
            data:{"para":"{element:'"+ t.currentElement + "',level:'"+ t.currentLevel + "',hourspan:"+ t.currentHourSpan + ",datetime:'"+ t.currentDateTime + "'}"},
            dataType: "json",
            success: function (data) {

                t.layerContour.removeAllFeatures();
				if(typeof(data) != "undefined"){
					//初始化数据
					var result = GDYB.FeatureUtilityClass.getRecordsetFromJson(data);
					var features = [];
					var len = result.features.length;
					for (var i = 0; i < len; i++) {
						var feature = result.features[i];
                        if(cons.length>0){//过滤
                            var val = parseFloat(feature.data.值);
                            if(cons[1]===">"){
                                if(val<cons[0]){
                                    continue;
                                }
                            }
                            else{
                                if(val>cons[0]){
                                    continue;
                                }
                            }
                        }
						features.push(feature);
					}
					t.layerContour.addFeatures(features);
				}
                $("#div_progress").css("display", "none");
                recall&&recall();
            },
            error: function(e) {
                recall&&recall();
            },
            type: "POST"
        });

        /*var t = this;
        if(t.layerFillRangeColor.datasetGrid == null){
            recall&&recall();
            return;
        }
        var dZValues = [];
        var dStep = 4.0;
        var element = t.currentElement;
        var type = t.currentType;
        var dStart = Math.floor(t.layerFillRangeColor.datasetGrid.dMin);
        for(var d=dStart; d<=t.layerFillRangeColor.datasetGrid.dMax; d+=dStep){
            dZValues.push(d);
        }

        t.layerContour.removeAllFeatures();
        var contour = new WeatherMap.Analysis.Contour();
        var result = contour.analysis(t.layerFillRangeColor.datasetGrid, dZValues);
        var features = [];
        if(result.length > 0){
            for(var key in result) {
                var geoline = result[key].geoline;
                var dZValue = result[key].dZValue;
                var feature = new WeatherMap.Feature.Vector(geoline);
                feature.attributes.dZValue = dZValue.toString();
                features.push(feature);
            }
        }
        t.layerContour.addFeatures(features);
        recall&&recall();*/
    }
}