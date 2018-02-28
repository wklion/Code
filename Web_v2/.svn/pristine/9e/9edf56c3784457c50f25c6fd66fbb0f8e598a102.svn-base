/**
 * Created by dinlerkey on 2017/05/12.
 */
function GDJYPageClass() {
    this.notMap = true;
    this.areaDatas = [];
    this.station = {};
    var t = this;
    t.areas = [];
    this.layerPlot = null;
    t.commonTime1 = "";
    t.commonTime2 = "";
    t.gridCheckDataClass = null;
    t.hs = [24,48,72];

    this.renderMenu = function(){
        $("#menu").hide();

        $("#map_div").css("display","none");
        var time1 = "";
        var time2 = "";
        var timeLevel = "";
        var dataPattern = "";

        var options = '';
        //var optionElements = {CMA:"中央台指导",bj:"中央台格点",prvn:"省台格点",SNWFD:"城镇预报",ECMOS:"本地MOS1",OPS:"本地OPS",ec:"EC-thin",ECMOS2:"本地MOS2",t639:"T639",germany:"德国"};
        var optionElements = {CMA:"中央台指导",bj:"中央台格点",grid_prvn:"省台格点（格点对格点）",prvn:"省台格点",SNWFD:"城镇预报",ECMOS:"本地MOS1",OPS:"本地OPS",ec:"EC-thin",t639:"T639"};
        for(i=0;i<100;i++){
            options += '<option value="'+ (i+1) +'">'+ (i+1) +'天</option>';
        }
        if($("#workspace_div").find(".GDJYDiv").length == 0){
            $("#workspace_div").append('<div class="GDJYDiv">'
                +'<div class="JY_Legend" style="height:130px;">'
                +'<div id="JY_Condition"><span style="float: left;line-height: 30px;">条件：</span><div id="dateSelect1" style="margin:0px 10px;float: left;height: 28px;"></div><span style="float: left;line-height: 30px;">到</span><div id="dateSelect2" style="float: left;height: 28px;margin:0px 10px;"></div><span style="float: left;line-height: 30px;">时次</span><select id="jyTimePar" style="width: 60px;float: left;    height: 28px;border: none;"><option value="08">08</option><option value="20">20</option></select>'
                +'<span style="float: left;line-height: 30px;">地区</span><select id="jyArea" style="width: 80px;height: 28px;border: none;float: left;"><option value="all">全省</option></select>'
                +'<span style="float: left;line-height: 30px;">站点</span><select id="jyStation" style="width: 80px;height: 28px;border: none;float: left;"><option value="all">全部</option></select>'
                +'<span style="float: left;line-height: 30px;">图表时效</span><select id="jyHours" style="width: 80px;height: 28px;border: none;float: left;"><option value="72">72</option><option value="168">168</option><option value="240">240</option></select>'
                +'<span style="float: left;line-height: 30px;">地图时效</span><select id="jyHourSpan" style="width: 80px;height: 28px;border: none;float: left;"><option value="24">24</option><option value="48">48</option><option value="72">72</option><option value="96">96</option><option value="120">120</option><option value="144">144</option><option value="168">168</option></select></div>'
                +'<div id="JY_Show" class="jyElementDiv"><div class="leftTitle">显示：</div><span id="showTable" class="jyElements active">图表</span><span id="showMap" class="jyElements">地图</span></div>'
                +'<div id="JY_Element" class="jyElementDiv"><div class="leftTitle">要素：</div><span id="r12" class="jyElements">日降水</span><span id="10uv" class="jyElements">风</span><span id="2t" class="jyElements">气温</span><span id="tmax" class="jyElements active">日最高温</span><span id="tmin" class="jyElements">日最低温</span></div>'
                +'<div id="JY_Type" class="jyElementDiv" style="display:none;"><div class="leftTitle">类型：</div><div><span value="cma" class="jyElements">中央台指导</span><span value="bj" class="jyElements">中央台格点</span><span value="grid_prvn" class="jyElements">省台格点（格点对格点）</span><span value="prvn" class="jyElements active">省台格点</span></div><div style="padding-left: 42px;"><span value="snwfd"  class="jyElements">城镇预报</span><span value="ECMOS"  class="jyElements">本地MOS1</span><span value="OPS"  class="jyElements">本地OPS</span><span value="ec" class="jyElements">EC-thin</span><span value="t639" class="jyElements">T639</span></div></div>'
                +'<div id="JY_Level" class="jyElementDiv" style="display:none;"><div class="leftTitle">级别：</div><span value="01" class="jyElements active">≥0.1mm</span><span value="10" class="jyElements">≥10mm</span><span value="25" class="jyElements">≥25mm</span><span value="50" class="jyElements">≥50mm</span><span value="100" class="jyElements">≥100mm</span></div>'
                +'<div id="JY_Method" class="jyElementDiv"><div class="leftTitle">方法：</div>'
                +'<span class="jySwitch jyJiang" style="display: none;"><span class="jyElements" value="barometer">晴雨</span><span class="jyElements" value="ts">TS评分</span><span class="jyElements" value="freeRate">空报率</span><span class="jyElements" value="missRate">漏报率</span><span class="jyElements" value="deviation">预报偏差</span></span>'
                +'<span class="jySwitch jyFeng" style="display: none;"><span class="jyElements">风向预报评分</span><span class="jyElements">风速预报评分</span><span class="jyElements">风向预报准确率</span><span class="jyElements">风速预报准确率</span></span>'
                +'<span class="jySwitch jyWen" style="display: none;"><span value="devia" class="jyElements">平均绝对误差</span><span value="deviaSq" class="jyElements">均方根误差</span><span value="correct1" class="jyElements">≤1℃准确率</span><span value="correct2" class="jyElements">≤2℃准确率</span></span>'
                +'<span class="jySwitch jyWenMax" ><span value="devia" class="jyElements active">平均绝对误差</span><span value="deviaSq" class="jyElements">均方根误差</span><span value="correct1" class="jyElements">≤1℃准确率</span><span value="correct2" class="jyElements">≤2℃准确率</span></span>'
                +'<span class="jySwitch jyWenMin" style="display: none;"><span value="devia" class="jyElements">平均绝对误差</span><span value="deviaSq" class="jyElements">均方根误差</span><span value="correct1" class="jyElements">≤1℃准确率</span><span value="correct2" class="jyElements">≤2℃准确率</span></span>'
                +'</div>'
                +'</div>'
                +'<div id="jyTable" ><div style="text-align: center;font-size: 22px;margin-top: 20px;"><span id="chartTitle" style="display: block"></span></div>'
                +'<div id="ybjyChart" style="position: absolute;"></div>'
                +'<div style="font-size: 16px;margin-top: 275px;margin-left: 60px;padding-left: 20px;"><span>检验结果说明：</span><span id="span_result" style="color: #f00;">推荐初试场为实况</span></div>'
                +'<table class="ybjyTable" style="margin: 10px auto;width: '+ (document.body.clientWidth-240) +'px"></table></div>'
                +'<div class="jyContent">'
                +'<div id="singleStationChart" class="singleStationChart"></div>'
                +'<div id="jyMap" class="jyMap" ></div>'
                +'</div>'
                +'<div id="div_mapTitle" style="position: absolute;display: none;top: 142px;width: 100%;float: center;text-align: center;font-size: 22px;z-index: 5;text-align: center;"></div>'
                +'<div id="div_legend" style="position: absolute;display: block;bottom: 1px;width: 100%;float: left;;z-index: 5;text-align: center;left:31%;">'
                +'<div style="float: left;display: inline-block;">'
                    +'<div id="div_legend_itemsJy" class="div_legend_items" style="height: 30px;"></div>'
                +'</div>'
                +'</div>'
                +'</div>');
            $("#jyMap").css("top",parseInt($(".JY_Legend").css("height"))+12);
            t.myDateSelecter1 = new DateSelecter(2,2);
            t.myDateSelecter1.intervalMinutes = 60*24; //24小时
            this.myDateSelecter1.changeHours(-11*24*60);
            $("#dateSelect1").html(t.myDateSelecter1.div);
            $("#dateSelect1").find("input").css({"width":"83px", border: "1px solid #e8e9eb", height: "28px","padding-left":"5px"});
            $("#dateSelect1").find("img").css("display","none");
            t.myDateSelecter2 = new DateSelecter(2,2);
            t.myDateSelecter2.intervalMinutes = 60*24; //24小时
            this.myDateSelecter2.changeHours(-1*24*60);
            $("#dateSelect2").html(t.myDateSelecter2.div);
            $("#dateSelect2").find("input").css({"width":"83px", border: "1px solid #e8e9eb", height: "28px","padding-left":"5px"});
            $("#dateSelect2").find("img").css("display","none");

            $("#jyTimePar").val(20);

            t.legend = new Legend("div_legend_itemsJy");

            var navigatnion = new WeatherMap.Control.Navigation();
            navigatnion.handleRightClicks = true; //响应右键双击缩小
            var map = new WeatherMap.Map(options.id||"jyMap",{controls:[
                navigatnion,
                new WeatherMap.Control.Zoom()],projection: "EPSG:4326"});
            GDYB.Page.curPage.map = map;
            map.addControl(new WeatherMap.Control.MousePosition());
            var layer = new WeatherMap.Layer.LocalTiledCacheLayerWhiteMap();
            map.addLayers([layer]);
            this.baseLayer = layer;
            var mapDivHeight = ($("#jyMap").css("height").split("p"))[0];
            var mapHeight;
            var zoomLevel;
            var scales = map.baseLayer.scales;
            var dpi = getDPI()[0];
            for(var i=12;i>2;i--){
                mapHeight = parseInt((108*(42.8-32.6)*1000*100/2.54*dpi)/(1/scales[i]));
                if(mapHeight<mapDivHeight){
                    zoomLevel = i;
                    break;
                }
            }
            map.setCenter(new WeatherMap.LonLat(100.5, 37.7), zoomLevel);
            t.areaLayer = new WeatherMap.Layer.Vector("Vector Layer", {renderers: ["Canvas2"]});//初始化图层
            map.addLayer(t.areaLayer);

            //实例化填图
            if(t.layerPlot == null) {
                t.layerPlot = new WeatherMap.Layer.Vector("layerPlot", {renderers: ["Plot"]});
                t.selectFeature = new WeatherMap.Control.SelectFeature(t.layerPlot, { 
                    onSelect: function(currentFeature){
                        t.featureSelected(currentFeature);
                    }, 
                    callbacks: null, 
                    hover: true 
                });
                t.layerPlot.renderer.plotWidth = 0;
                t.layerPlot.renderer.plotHeight = 0;
                map.addLayers([t.layerPlot]);
                map.addControl(t.selectFeature);

            }
            t.layerPlot.style = {
                pointRadius: 5.0
            };
            t.layerPlot.renderer.styles = [
                {
                    field:"val",
                    type:"label",
                    visible:"true",
                    offsetX: 0,
                    offsetY: 4,
                    rotationField:null,
                    decimal:1,
                    noDataValue:0.0,
                    style: {
                        labelAlign:"mb",
                        fontWeight:"bold",
                        fontFamily:"Arial",
                        fontColor:"rgb(0, 0, 0)",
                        fontSize:"16px",
                        fill: false,
                        stroke: false
                    },
                    symbols:null
                }
            ];
        }

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

        //$("#jyInterval").find("option")[9].selected = true;
        $(".jyContent").css("display","none");
        //显示方式切换
        $("#JY_Show").find("span").click(function(){
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            if(this.id == "showTable"){
                $(".jyContent").css("display","none");
                $("#jyTable").css("display","");
                $("#JY_Type").css("display","none");
                $("#div_mapTitle").css("display", "none");
            }
            else{
                $(".jyContent").css("display","");
                $("#jyTable").css("display","none");
                $("#JY_Type").css("display","block");
                $("#div_mapTitle").css("display", "block");
                t.displayCheckInfoSta();
                t.initSingleStationDataChart();
                t.getAllTypeData();
            }
        });

        //要素切换
        $("#JY_Element").find("span").click(function(){
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            if(this.id == "r12")
                $("#JY_Level").css("display","block");
            else
                $("#JY_Level").css("display","none");
            var num = $(this).index()-1;
            $("#JY_Method").find(".jySwitch").hide();
            $("#JY_Method").find(".jySwitch").eq(num).show();
            $("#JY_Method").find(".jySwitch").eq(num).find("span").eq(0).click();
        });
        t.myDateSelecter1.input.change(function(){
            $("#JY_Method").find(".active").click();
        });
        t.myDateSelecter2.input.change(function(){
            $("#JY_Method").find(".active").click();
        });

        //降水级别切换
        $("#JY_Level").find("span").click(function(){
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            $(".jySwitch").find(".active").click();
        });

        //产品（模式）类型切换
        $("#JY_Type").find("span").click(function(){
            //$(this).siblings().removeClass("active");
            $("#JY_Type").find("span").removeClass("active"); //分成上下两个DIV，就只能这样
            $(this).addClass("active");
            if($("#JY_Show").find(".active").attr("id") == "showMap")
                t.displayCheckInfoSta();
        });

        //计算数据方法切换
        $(".jySwitch").find("span").click(function(){
            var startDate = t.myDateSelecter1.getCurrentTimeReal();
            var endDate = t.myDateSelecter2.getCurrentTimeReal();
            var startTime = startDate.getFullYear()%1000 + (Array(2).join(0)+(startDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+startDate.getDate()).slice(-2)
            var endTime = endDate.getFullYear()%1000 + (Array(2).join(0)+(endDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+endDate.getDate()).slice(-2)
            time1 = startDate.getFullYear()+"-"+(Array(2).join(0)+(startDate.getMonth()+1)).slice(-2)+"-"+(Array(2).join(0)+startDate.getDate()).slice(-2);
            time2 = endDate.getFullYear()+"-"+(Array(2).join(0)+(endDate.getMonth()+1)).slice(-2)+"-"+(Array(2).join(0)+endDate.getDate()).slice(-2);
            timeLevel = $("#jyTimePar").val();
            /*
            dataPattern = $(this).html();
            var element = $("#JY_Element").find(".active").html();
            $("#chartTitle").html(t.commonTime1 +'到'+ t.commonTime2 +' '+ timeLevel +'时 甘肃省' + element +  dataPattern +'检验');
            */
            $(this).siblings().removeClass("active");
            $(this).parent().siblings().find("span").removeClass("active");
            $(this).addClass("active");
            var type = $(this).attr("value");
            if($("#JY_Element").find(".active").attr("id") == "r12" && type!= "barometer")
                type = type+$("#JY_Level").find(".active").attr("value");
            t.gdjyDataUpdate(startTime,endTime,timeLevel,$("#JY_Element").find(".active").attr("id"),type, t.updateJYChartTable);

            if($("#JY_Show").find(".active").attr("id") == "showMap")
                t.displayCheckInfoSta();
        });
        $("#jyInterval").change(function(){
            $(".jySwitch").find(".active").click();
        });
        $("#jyTimePar").change(function(){
            $(".jySwitch").find(".active").click();
        });
        $("#jyHours").change(function(){
            $(".jySwitch").find(".active").click();
        });
        $("#jyHourSpan").change(function(){
            $(".jySwitch").find(".active").click();
        });
        setTimeout(function(){
            $(".jySwitch").find(".active").click();
        },0);
        t.getStation();
        var para = {};
        para.areaCode = "62";
        para.level = "cnty";
        para = JSON.stringify(para); //对象转换为json
        var url= gridServiceUrl+"services/AdminDivisionService/getDivisionInfos";
        $.ajax({
            data: {"para": para},
            url: url,
            dataType: "json",
            type: "POST",
            success: function (area) {
                for( var k =0;k<area.length;k++){
                    var objData = JSON.parse(area[k]);
                    t.areaDatas.push(objData);
                }
                var para = {};
                para.Type = 6;
                para = JSON.stringify(para); //对象转换为json
                var url= gridServiceUrl+"services/ForecastfineService/getStationForecast";
                $.ajax({
                    data: {"para": para},
                    url: url,
                    dataType: "json",
                    type: "POST",
                    success: function (stations) {
                        for(var i=0;i<stations.length;i++){
                            t.station[stations[i].AreaCode] = stations[i].StationNum;
                        }

                        var pointVectors = [];
                        for(var i=0;i<stations.length;i++){
                            var point = new WeatherMap.Geometry.Point(parseFloat(stations[i].Longitude),parseFloat(stations[i].Latitude));
                            pointVector = new WeatherMap.Feature.Vector(point, {stationNum:stations[i].StationNum, val:0});
                            pointVectors.push(pointVector);
                        }
                        t.layerPlot.addFeatures(pointVectors);
                    }
                });
            }
        });
        //展示趋势图
        this.gdjyDataUpdate = function(startTime,endTime,forecastHour,element,type,callbak){
            var url= gridServiceUrl + "services/ForecastfineService/getGridCheck";
            $.ajax({
                type: "POST",
                data: {"para": "{startTime:'" + startTime + "',endTime:'" + endTime + "',forecastHour:" + forecastHour + ",element:'" + element + "',type:'" + type + "'}"},
                url: url,
                dataType: "json",
                success: function (data) {
                    if(data.length == 0){
                        return;
                    }
                    var scale = (type=="devia" || type=="deviaSq" || type.indexOf("deviation")>=0)?1.0:100.0; //除了平均误差和均方差，其他都*100转换为百分数
                    var labels = t.getHourSpan(element);
                    //var value = {prvn:[],ec:[],t639:[],CMA:[],ECMOS:[],OPS:[]};
                    //var value = {CMA:[],prvn:[],city:[],ECMOS:[],OPS:[],ec:[],ECMOS2:[],t639:[],garmany:[]};
                    var value = {};
                    for(var key in optionElements){
                        value[key]=[];
                    }
                    var obj = {};
                    for(var i=0;i<data.length;i++){
                        var ele = data[i].productType+"_"+data[i].hourspan;
                        if(typeof(obj[ele]) == "undefined"){
                            obj[ele] = [data[i].value];
                        }
                        else{
                            obj[ele].push(data[i].value);
                        }
                    }
                    //更新标题
                    var dataSort = $.extend(true,[],data);
                    // 按时间倒序
                    dataSort = dataSort.sort((a, b)=> {
                        return a.forecastTime - b.forecastTime;
                    });
                    t.commonTime1 = dataSort[0].forecastTime;
                    t.commonTime2 = dataSort[dataSort.length-1].forecastTime;
                    var timeStrFormat = "20yy-MM-dd hh 时";
                    t.commonTime1 = timeStrFormat.replace("yy",t.commonTime1.substr(0,2)).replace("MM",t.commonTime1.substr(2,2)).replace("dd",t.commonTime1.substr(4,2)).replace("hh",t.commonTime1.substr(6,2));
                    t.commonTime2 = timeStrFormat.replace("yy",t.commonTime2.substr(0,2)).replace("MM",t.commonTime2.substr(2,2)).replace("dd",t.commonTime2.substr(4,2)).replace("hh",t.commonTime2.substr(6,2));
                    var elementNow = $("#JY_Element").find(".active").html();
                    $("#chartTitle").html(t.commonTime1 +' 到 '+ t.commonTime2 +' '+'甘肃省' + elementNow +  dataPattern +'检验');

                    for(var i=0;i<labels.length;i++){
                        for(var e in optionElements){
                            if(typeof(obj[e+"_"+labels[i]]) == "undefined"){
                                value[e].push(-999);
                            }
                            else{
                                var avg = 0;
                                var miss = 0;
                                for(var j=0;j<obj[e+"_"+labels[i]].length;j++){
                                    if(obj[e+"_"+labels[i]][j] == -999)
                                        miss++;
                                    else
                                        avg += obj[e+"_"+labels[i]][j];
                                }
                                value[e].push(parseFloat((avg/(obj[e+"_"+labels[i]].length-miss)*scale).toFixed(2)));
                            }
                        }
                    }
                    callbak(value);
                },
                error:function(e){

                }
            });
        };

        //更新图表
        this.updateJYChartTable = function(items){//参数(返回的数组,预报时间,预报模式)
            if(!items){
                $("#ybjyChart").html("无数据");
                $("#ybjyTable").html("无数据");
                return;
            }
            t.updateResult(items); //这个放前面，因为updateJYChart会把items中无效值改为0
            t.updateJYTable(items);
            t.updateJYChart(items);
        };

        //更新结论
        this.updateResult = function(items){
            var method = $(".jySwitch").find(".active").attr("value");
            var maxobj = {productType:"省台订正", val:-999};
            for(var productType in items){
                var item = items[productType];
                var sum = 0;
                var count = 0;
                for(var i in item){
                    if(item[i] != -999){
                        sum+=item[i];
                        count++
                    }
                }
                if(count>0){
                    var avg = sum/count;
                    if(method=="devia" || method=="deviaSq" || method=="freeRate" || method=="missRate" || method=="deviation"){
                        if(avg < maxobj.val || maxobj.val == -999){
                            maxobj.productType = optionElements[productType];
                            maxobj.val = avg;
                        }
                    }
                    else{
                        if(avg > maxobj.val || maxobj.val == -999){
                            maxobj.productType = optionElements[productType];
                            maxobj.val = avg;
                        }
                    }
                }
            }
            $("#span_result").html("推荐初始场为"+maxobj.productType);
        };

        //更新统计图
        this.updateJYChart = function(items){
            var labels = t.getHourSpan($("#JY_Element").find(".active").attr("id"));
            var colors = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9',
                '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
            var lineChartData = {
                labels: labels,
                datasets: []
            };
            var num = 0;
            for(var ele in items){
                for(var i=0;i<items[ele].length;i++){
                    if(items[ele][i] == -999)
                        items[ele][i] = 0;
                }
                lineChartData.datasets.push({
                    //name: ele,
                    name:  optionElements[ele],
                    type: 'column',
                    data: items[ele]
                });
                num++;
            }
            displayHighCharts(lineChartData);
            t.selectFeature.activate();
            //绘制图表
            function displayHighCharts(datas) {
                var elementUnits = '单位';
                Highcharts.setOptions({
                    lang: {
                        loading: '...',
                        printChart:'打印',
                        downloadJPEG: '',
                        downloadPDF: '导出 PDF',
                        downloadPNG: '导出 PNG',
                        downloadSVG: ''
                    },
                    colors : colors
                });

                $('#ybjyChart').highcharts({
                    chart: {
                        backgroundColor:'rgba(236,239,244,1)',
                        borderRadius: 0,
                        zoomType: 'xy',
                        panning: true,
                        height: 250,
                        width: (document.body.clientWidth-60),
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: datas.labels
                    },
                    yAxis: [{
                        title: {
                            text: elementUnits,
                            style: {
                                color: colors[0]
                            }
                        }
                    }],
                    tooltip: {
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            dataLabels:{ enabled:true},
                            pointPadding: 0.30,
                            borderWidth: 0
                        }
                    },
                    series: lineChartData.datasets
                });
            }
        };

        //更新表格
        this.updateJYTable = function(items){
            var hourSpans = t.getHourSpan($("#JY_Element").find(".active").attr("id"));
            var contentHtml = '';
            contentHtml += '<tr><td width="80">模式</td>';
            for(var i=0;i<hourSpans.length;i++){
                contentHtml += '<td>'+hourSpans[i]+'</td>';
            }
            contentHtml +='</tr>';
            for(var ele in items){
                contentHtml += '<tr><td>'+optionElements[ele]+'</td>';
                for(var i=0;i<items[ele].length;i++){
                    var value = items[ele][i]==-999?"无数据":items[ele][i];
                    contentHtml += '<td>'+ value +'</td>';
                }
                contentHtml += '</tr>';
            }

            $(".ybjyTable").html(contentHtml);
        };

        //获取时效
        this.getHourSpan = function(element){
            var hourspans = null;
            var hours = parseInt($("#jyHours").val());
            if(hours==72){
                if(element == "r12" || element == "w" || element == "air" || element == "wmax"){
                    hourspans = [12,24,36,48,60,72];
                }
                else if(element == "tmax" || element == "tmin"){
                    hourspans = [24,48,72];
                }
                else{
                    hourspans = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72];
                }
            }
            else if(hours == 168){
                if(element == "r12" || element == "w" || element == "air" || element == "wmax"){
                    hourspans = [12,24,36,48,60,72,84,96,108,120,132,144,156,168];
                }
                else if(element == "tmax" || element == "tmin"){
                    hourspans = [24,48,72,96,120,144,168];
                }
                else{
                    hourspans = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168];
                }
            }
            else{
                if(element == "r12" || element == "w" || element == "air" || element == "wmax"){
                    hourspans = [12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240];
                }
                else if(element == "tmax" || element == "tmin"){
                    hourspans = [24,48,72,96,120,144,168,192,216,240];
                }
                else{
                    hourspans = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240];
                }
            }
            return hourspans;
        };

        //add by zouwei，用网格展示绝对平均误差
        this.displayCheckInfoGrid = function(){
            var startDate = t.myDateSelecter1.getCurrentTimeReal();
            var endDate = t.myDateSelecter2.getCurrentTimeReal();
            var startTime = startDate.getFullYear()%1000 + (Array(2).join(0)+(startDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+startDate.getDate()).slice(-2);
            var endTime = endDate.getFullYear()%1000 + (Array(2).join(0)+(endDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+endDate.getDate()).slice(-2);
            var element = $("#JY_Element").find(".active").attr("id");
            var type = "devia";
            var productType = $("#JY_Type").find(".active").attr("value");
            var forecastHour = $("#jyTimePar").val();
            var hourSpan = parseInt($("#jyHourSpan").val());
            if(t.layerPlot != null)
                t.layerPlot.setVisibility(false);
            if(t.gridCheckDataClass == null)
                t.gridCheckDataClass = new GridCheckDataClass();
            t.gridCheckDataClass.display(null, startTime, endTime, forecastHour, hourSpan, element, type, productType);
            var elementCaption = $("#JY_Element").find(".active").html();

            //更新标题
            var startTime = startDate.getFullYear() + "-" + (Array(2).join(0)+(startDate.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+startDate.getDate()).slice(-2) + " " + forecastHour+"时";
            var endTime = endDate.getFullYear() + "-" + (Array(2).join(0)+(endDate.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+endDate.getDate()).slice(-2) + " " + forecastHour+"时";
            $("#div_mapTitle").html(startTime +' 到 '+ endTime +' 甘肃省' + elementCaption +  '平均绝对误差');

            //更新图例
            t.legend.update(t.gridCheckDataClass.layerFillRangeColor.items);
        };

        this.displayCheckInfoSta = function(){
            var startDate = t.myDateSelecter1.getCurrentTimeReal();
            var endDate = t.myDateSelecter2.getCurrentTimeReal();
            var startTime = startDate.getFullYear()%1000 + (Array(2).join(0)+(startDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+startDate.getDate()).slice(-2);
            var endTime = endDate.getFullYear()%1000 + (Array(2).join(0)+(endDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+endDate.getDate()).slice(-2);
            var element = $("#JY_Element").find(".active").attr("id");
            var type = "devia";
            var productType = $("#JY_Type").find(".active").attr("value");
            var forecastHour = $("#jyTimePar").val();
            var hourSpan = parseInt($("#jyHourSpan").val());

            //add by zouwei, 2017-11-26
            if(productType == "grid_prvn"){
                this.displayCheckInfoGrid();
                return;
            }
            if(t.layerPlot != null)
                t.layerPlot.setVisibility(true);
            if(t.gridCheckDataClass != null)
                t.gridCheckDataClass.layerFillRangeColor.setDatasetGrid(null);

            /*
            $("#div_mapTitle").html(time1 +'到'+ time2 +' '+ timeLevel +'时 ' + $("#JY_Type").find(".active").html() + $("#JY_Element").find(".active").html() +  dataPattern +'检验');
            */
            var url= gridServiceUrl + "services/ForecastfineService/getGridCheckSta";
            $.ajax({
                type: "POST",
                data: {"para": "{startTime:'" + startTime + "',endTime:'" + endTime + "',forecastHour:" + forecastHour + ",element:'" + element + "',type:'" + type + "',productType:'" + productType +"'}"},
                url: url,
                dataType: "json",
                success: function (data) {
                    if(data.length == 0)
                        return;
                    var obj = {};
                    var value = {};
                    var abs = $("#JY_Method").find(".active").attr("value") == "devia";
                    for(var i=0;i<data.length;i++){
                        if(typeof(obj[data[i].stationNum]) == "undefined"){
                            obj[data[i].stationNum] = [];
                        }
                        if(hourSpan != data[i].hourspan)
                            continue;
                        obj[data[i].stationNum].push(abs?Math.abs(data[i].value):data[i].value);
                    }

                    //更新标题
                    var dataSort = $.extend(true,[],data);
                    // 按时间倒序
                    dataSort = dataSort.sort((a, b)=> {
                        return a.forecastTime - b.forecastTime;
                    });
                    t.commonTime1 = dataSort[0].forecastTime;
                    t.commonTime2 = dataSort[dataSort.length-1].forecastTime;
                    var timeStrFormat = "20yy-MM-dd hh 时";
                    t.commonTime1 = timeStrFormat.replace("yy",t.commonTime1.substr(0,2)).replace("MM",t.commonTime1.substr(2,2)).replace("dd",t.commonTime1.substr(4,2)).replace("hh",t.commonTime1.substr(6,2));
                    t.commonTime2 = timeStrFormat.replace("yy",t.commonTime2.substr(0,2)).replace("MM",t.commonTime2.substr(2,2)).replace("dd",t.commonTime2.substr(4,2)).replace("hh",t.commonTime2.substr(6,2));
                    var elementNow = $("#JY_Element").find(".active").html();
                    $("#div_mapTitle").html(t.commonTime1 +' 到 '+ t.commonTime2 +' '+'甘肃省' + elementNow +  dataPattern +'检验');

                    if($("#JY_Method").find(".active").attr("value") == "devia"){
                        for(var ele in obj){
                            var avg = 0;
                            for(var i=0;i<obj[ele].length;i++){
                                //avg += Math.abs(obj[ele][i]);
                                avg += obj[ele][i];
                            }
                            value[ele] = avg/obj[ele].length;
                        }
                    }
                    else if($("#JY_Method").find(".active").attr("value") == "deviaSq"){
                        for(var ele in obj){
                            var avg = 0;
                            for(var i=0;i<obj[ele].length;i++){
                                avg += Math.abs(obj[ele][i]);
                            }
                            value[ele] = Math.sqrt(avg/obj[ele].length);
                        }
                    }
                    else if($("#JY_Method").find(".active").attr("value") == "correct1"){
                        for(var ele in obj){
                            var avg = 0;
                            for(var i=0;i<obj[ele].length;i++){
                                if(Math.abs(obj[ele][i])<=1)
                                    avg++;
                            }
                            value[ele] = avg/obj[ele].length*100;
                        }
                    }
                    else if($("#JY_Method").find(".active").attr("value") == "correct2"){
                        for(var ele in obj){
                            var avg = 0;
                            for(var i=0;i<obj[ele].length;i++){
                                if(Math.abs(obj[ele][i])<=2)
                                    avg++;
                            }
                            value[ele] = avg/obj[ele].length*100;
                        }
                    }

                    var style = heatMap_CheckDevia;
                    if($("#JY_Method").find(".active").attr("value") == "correct1" || $("#JY_Method").find(".active").attr("value") == "correct2")
                        style = heatMap_CheckTS;

                    //填值
                    var noDataValue = "";
                    var points = t.layerPlot.features;
                    for(var i in points){
                        points[i].attributes["val"] = noDataValue;
                        for(var stationNum in value){
                            if(points[i].attributes["stationNum"] == stationNum){
                                points[i].attributes["val"] = value[stationNum];
                                break;
                            }
                        }

                        if(points[i].attributes["val"] == noDataValue) //隐藏无值的站点
                        {
                            points[i].style = {
                                pointRadius:0,
                                fill:false,
                                stroke: false
                            };
                        }
                        else{
                            for(var j=0;j<style.length;j++){
                                if(points[i].attributes["val"]>=style[j].start && points[i].attributes["val"]<style[j].end || j==(style.length-1) && points[i].attributes["val"]==style[j].end){
                                    var color = "rgb("+style[j].startColor.red+","+style[j].startColor.green+","+style[j].startColor.blue+")";
                                    points[i].style = {
                                        pointRadius:t.layerPlot.style.pointRadius,
                                        fill:true,
                                        strokeWidth: 0.2,
                                        strokeColor: '#000000',
                                        fillColor: color
                                    };
                                    break;
                                }
                            }
                        }
                    }
                    t.layerPlot.redraw();

//                    //填色
//                    for(var i=0;i<t.areaDatas.length;i++){
//                        if(t.station[t.areaDatas[i].fieldValues[4]] == undefined)
//                            t.areaDatas[i]["value"] = -999;
//                        else if(value[t.station[t.areaDatas[i].fieldValues[4]]] == undefined)
//                            t.areaDatas[i]["value"] = -999;
//                        else
//                            t.areaDatas[i]["value"] = value[t.station[t.areaDatas[i].fieldValues[4]]];
//                    }
//
//                    for(var i=0;i<t.areaDatas.length;i++){
//                        var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(t.areaDatas[i]);
//                        feature.geometry.calculateBounds();
//                        var color = "rgb(255,255,255)";
//                        for(var j=0;j<style.length;j++){
//                            if(t.areaDatas[i].value>=style[j].start && t.areaDatas[i].value<style[j].end || j==(style.length-1) && t.areaDatas[i].value==style[j].end){
//                                var color = "rgb("+style[j].startColor.red+","+style[j].startColor.green+","+style[j].startColor.blue+")";
//                                break;
//                            }
//                        }
//                        feature.style = {
//                            strokeColor: "#a548ca",
//                            strokeWidth: 2.0,
//                            fillColor: color,
//                            fillOpacity: "1"
//                        };
//                        t.areas.push(feature);
//                    }
//                    t.areaLayer.removeAllFeatures();
//                    t.areaLayer.addFeatures(t.areas);
                    t.legend.update(style);
                }
            });
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:初始化单站数据
             */
            this.initSingleStationDataChart = function(){
                if(t.SingleStationDataChart){
                    return;
                }
                var html = "<div class='stationInfo'><div>站点：</div><div id='stationInfo-name'>兰州</div></div>";
                html += "<div id='chartLegend' class='chartLegendDiv'></div>";
                t.hs.forEach(item=>{
                    html += "<div id='chart"+item+"' class='item'></div>";
                });
                $("#singleStationChart").html(html);
                t.SingleStationDataChart = true;
            }
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:在图表上显示单站数据
             */
            this.displaySingleStationDataOnChart = function(hsItem,datas){
                var colors = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9',
                '#f15c80', '#e4d354', '#2b908f', '#f45b5b'];
                var html = "";
                colors.forEach((item,index)=>{
                    html+="<button style='background-color:"+colors[index]+"'></button><span>"+datas.labels[index]+"</span>"
                });
                $("#chartLegend").html(html);
                $('#chart'+hsItem).highcharts({
                    chart: {
                        backgroundColor:'rgba(236,239,244,1)',
                        borderRadius: 0,
                        zoomType: 'xy',
                        panning: true,
                        type: 'column'
                    },
                    title: {
                        text: ""
                    },
                    subtitle: {
                        text: hsItem+"小时"
                    },
                    xAxis: {
                        visible:false,
                        categories: datas.labels
                    },
                    
                    yAxis: [{
                        title: {
                            text: "",
                            style: {
                                color: colors[0]
                            }
                        }
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            dataLabels:{ enabled:true},
                            pointPadding: 0.30,
                            borderWidth: 0
                        }
                    },
                    credits: {  
                        enabled:false  
                    },
                    series: datas.datasets
                });
            }
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:地图单点选中
             */
            this.featureSelected = function(currentFeature){
                var stationNum = currentFeature.attributes.stationNum;
                t.filterDataByStationNum(stationNum);
            };
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:获取所有类型数据
             */
            this.getAllTypeData = function(){
                var startTime = startDate.getFullYear()%1000 + (Array(2).join(0)+(startDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+startDate.getDate()).slice(-2);
                var endTime = endDate.getFullYear()%1000 + (Array(2).join(0)+(endDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+endDate.getDate()).slice(-2);
                var type = "devia";
                var element = $("#JY_Element").find(".active").attr("id");
                var forecastHour = $("#jyTimePar").val();
                var param = {
                    startTime:startTime,
                    endTime:endTime,
                    forecastHour:forecastHour,
                    element:element,
                    type:type,
                    productType:"%"
                };
                param = JSON.stringify(param);
                var url= gridServiceUrl + "services/ForecastfineService/getGridCheckSta";
                $.ajax({
                    type: "POST",
                    data:{"para":param},
                    url:url,
                    dataType: "json",
                    success:function(data){
                        t.sortData(data);
                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            }
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:整理数据
             */
            this.sortData = function(data){
                //按站统计
                var mapStation = new Map();
                var types = new MyArray();
                data.forEach(item=>{
                    var sn = item.stationNum;
                    var type = item.productType;
                    var obj = mapStation.get(sn);
                    if(!types.contain(type)){
                        types.push(type);
                    }
                    //站点
                    if(obj==undefined){
                        mapStation.set(sn,[]);
                    }
                    var objs = mapStation.get(sn);
                    objs.push(item);
                    mapStation.set(sn,objs);
                });
                t.resultMap = [];
                var typeSize = types.length;
                //按时效统计
                mapStation.forEach((snItem,key)=>{
                    t.hs.forEach(hsItem=>{
                        //新建一个存放累加
                        var tempResultArray = createEmpyArray(typeSize);
                        snItem.forEach(itemC=>{
                            var curHS = itemC.hourspan;
                            if(curHS != hsItem){
                                return;
                            }
                            var type = itemC.productType;
                            var val = itemC.value;
                            val = Math.abs(val);
                            var index = types.indexOf(type);
                            var oldVal = tempResultArray[index];
                            if(oldVal == -9999){
                                tempResultArray[index] = val;
                            }
                            else{
                                var avg = (oldVal+val)/2;
                                tempResultArray[index] = avg;
                            }
                        });
                        t.resultMap.push({
                            stationNum:key,
                            types:types,
                            hourspan:hsItem,
                            datas:tempResultArray
                        });
                    });
                    
                });
                t.filterDataByStationNum("52889");
                function createEmpyArray(size){
                    var newArray = new MyArray(size);
                    for(var i=0;i<size;i++){
                        newArray[i] = -9999;
                    }
                    return newArray;
                }
            }
            /**
             * @author:wangkun
             * @date:2017-11-30
             * @modifyDate:
             * @return:
             * @description:通过站点过滤
             */
            this.filterDataByStationNum = function(stationNum){
                if(t.resultMap==undefined){
                    alert("数据还未准备好!");
                    return;
                }
                if(t.stationData==undefined){
                    alert("站点数据还未准备好!");
                    return;
                }
                var stationItem = t.stationData.find(item=>{
                    return item.StationNum == stationNum;
                });
                if(stationItem!=undefined||stationItem!=null){
                    $("#stationInfo-name").html(stationItem.StationName);
                }
                t.resultMap.forEach(item=>{
                    var sn = item.stationNum;
                    if(sn != stationNum){
                        return;
                    }
                    var hs = item.hourspan;
                    var types = item.types;
                    var ds = [];
                    item.datas.forEach((itemD,index)=>{
                        var newVal = itemD.toFixed(1);
                        newVal = parseFloat(newVal);
                        if(newVal === -9999){
                            newVal = 0;
                        }
                        ds.push({
                            data : [newVal],
                            name : types[index],
                            type : "column"
                        });
                    }); 
                    var datas = {
                        labels:types,
                        datasets:ds
                    };
                    t.displaySingleStationDataOnChart(hs,datas);
                });
            }
        }
    }
    this.getStation = function(){
        var param = {
            Type:1
        };
        param = JSON.stringify(param);
        var url= gridServiceUrl + "services/ForecastfineService/getStation";
        $.ajax({
            type: "POST",
            data:{"para":param},
            url:url,
            dataType: "json",
            success:function(data){
                t.stationData = data;
            },
            error:function(e){
                console.log(e);
            }
        });
    }
}

GDJYPageClass.prototype = new PageBase();