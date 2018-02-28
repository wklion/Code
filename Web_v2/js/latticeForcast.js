/**
 * Created by Administrator on 2015/10/9.
 */
function initChartTable(){
    if($("#latticeForcast").html() == ""){
        var contentForcast = '<div>'+
            '<div class="latticeInfoTitle" style="margin-top: -1px;"><span>格点位置</span></div>'+
            '<div id="latticeInfoBase" class="latticeInfoBase"></div>'+
            '</div>'+
            '<div>'+
            '<div class="latticeInfoTitle" style="margin-top: -1px;"><span>天气概况</span></div>'+
            '<div id="weatherDescription" class="latticeInfoBase">无</div>'+
            '</div>'+
            '<div>'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticeTem.png"/><span>温度</span></div>'+
            '<canvas id="temperature" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="temperatureTime" class="latticeTime"></div>'+
            '</div>'+
            '<div>'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticePre.png"/><span>降水</span></div>'+
            '<canvas id="precipitation" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="precipitationTime" class="latticeTime"></div>'+
            '</div>'+
            '<div>'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticeWin.png"/><span>风向风速</span></div>'+
            '<canvas id="windSpeed" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="windSpeedTime" class="latticeTime"></div>'+
            '</div>'+
            '<div id="divRH" style="display: none">'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticeTem.png"/><span>相对湿度</span></div>'+
            '<canvas id="rh" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="rhTime" class="latticeTime"></div>'+
            '</div>'+
            '<div id="divTCC" style="display: none">'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticePre.png"/><span>云量</span></div>'+
            '<canvas id="tcc" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="tccTime" class="latticeTime"></div>'+
            '</div>'+
            '<div id="divVIS" style="display: none">'+
            '<div class="latticeInfoTitle"><img src="imgs/lattice/latticeWin.png"/><span>能见度</span></div>'+
            '<canvas id="vis" height="100" width="670" style="margin-top: 5px;"></canvas>'+
            '<div id="visTime" class="latticeTime"></div>'+
            '</div>'+
            '<div><span id="spanMore" style="float: right;margin: 10px 30px 0px;cursor:pointer">更多...</span></div>';
            var contentPrecipitation ='<div class="latticeInfoTitle"><span>要素</span></div>'+
            '<div id="latticeTable" style="width: 100%;height: 182px;"></div>';
        $("#latticeForcast").html(contentForcast);
        $("#latticePrecipitation").html(contentPrecipitation);
    }
    if(true)
    {
        $("#latticeForcast").css("display", "block");
        $("#latticePrecipitation").css("display", "block");
    }
    else
    {
        $("#latticeForcast").css("display", "none");
        $("#latticePrecipitation").css("display", "none");
    }

    //点击更多
    $("#spanMore").click(function(){
        var content = $("#spanMore").html();
        if(content == "更多...") {
            $("#divRH").css("display", "block");
            $("#divTCC").css("display", "block");
            $("#divVIS").css("display", "block");
            $("#spanMore").html("收起...");
        }
        else{
            $("#divRH").css("display", "none");
            $("#divTCC").css("display", "none");
            $("#divVIS").css("display", "none");
            $("#spanMore").html("更多...");
        }
    });
}

//更新图表
function updateChartTable(items, dateTime){
    if(items == null || items.length == 0)
        return;

    updateChart("forcastForm", items, dateTime, ["2t","r3"]);
    updateTable(items, dateTime);
    /*updateChart("temperature", "line", items, dateTime, "2t");
    updateChart("precipitation", "column", items, dateTime, "r3");
    updateChart("windSpeed", "line", items, dateTime, "ws3");
    updateChart("rh", "Line", items, dateTime, "rh");
    updateChart("tcc", "Line", items, dateTime, "tcc");
    updateChart("vis", "Line", items, dateTime, "vis");*/
}

//更新定位信息
function updateLocationInfo(lon, lat, province, city, county){
    //格点位置信息
    var latticeInfoBaseStr = '<span>经度：</span>'+Math.round(lon*100.0)/100.0+'<span>纬度：</span>'+Math.round(lat*100.0)/100.0+'<span>省份：</span>'+province+'<span>城市：</span>'+city+'<span>地点：</span>'+county;
    $("#latticeInfoBase").html(latticeInfoBaseStr);
}

//更新天气概况
function updateWeatherDescription(items, hourSpan3, hourSpan12, hourSpan24){
    var temp = getValueFromForecastData(items, "2t", hourSpan3);
    var r3 = getValueFromForecastData(items, "r3", hourSpan3);
    var rh = getValueFromForecastData(items, "rh", hourSpan3);
    var tcc = getValueFromForecastData(items, "tcc", hourSpan3)*10;
    var vis = getValueFromForecastData(items, "vis", hourSpan3);
    var wd3 = getWDName(getValueFromForecastData(items, "wd3", hourSpan3));
    var ws3 = getWSName(getValueFromForecastData(items, "ws3", hourSpan3));
    var w12 = getWeatherName(getValueFromForecastData(items, "w", hourSpan12));
    var w24 = getWeatherName(getValueFromForecastData(items, "w", hourSpan24));
    var tmin = getValueFromForecastData(items, "tmin", hourSpan24);
    var tmax = getValueFromForecastData(items, "tmax", hourSpan24);
    var r24 = Math.round(getValueFromForecastData(items, "r12", hourSpan12)+getValueFromForecastData(items, "r12", hourSpan24)*10)/10.0;
    var air = getValueFromForecastData(items, "air", hourSpan24);
    var wd = getWDName(getValueFromForecastData(items, "wd", hourSpan24));
    var ws = getWSName(getValueFromForecastData(items, "ws", hourSpan24));
    var result = "未来3小时气温"+temp+"℃，降水"+r3+"mm，"+wd3+ws3+"，相对湿度"+rh+"%，云量"+tcc+"%；<br>"+
        "未来24小时"+(w12==w24?w12:(w12+"转"+w24))+"，降水"+r24+"mm，"+wd+ws+"，气温"+tmin+"-"+tmax+"℃。";
    $("#weatherDescription").html("<span>"+result+"</span>");
}

//更新统计图
function updateChart(chartId, items, dateTime, elements){
    var chartData = getChartDataFromForecastData(items, elements, dateTime);
    if(chartData != null){
        var lineChartData = {
            labels : chartData.labels,
            datasets : chartData.data
        };
        displayHighCharts(lineChartData);
        //绘制图表
        function displayHighCharts(datas) {
            var elementStr1 = "温度";
            var elementUnits1 = '温度 (°C)';
            var elementStr2 = "降水";
            var elementUnits2 = '降水 (mm)';
            var colors = ['#f7a35c', '#7CB5EB', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
            Highcharts.setOptions({
                lang: {
                    loading: '',
                    printChart:'打印',
                    downloadJPEG: '',
                    downloadPDF: '导出 PDF',
                    downloadPNG: '导出 PNG',
                    downloadSVG: ''
        }
            });

            $('#'+chartId).highcharts({
                chart:{
                    backgroundColor:'rgba(255,255,255,0.8)',
                    borderRadius: 0,
                    zoomType: 'xy',
                    panning: true,
                    height: 240,
                    width: 600
                },
                title: {
                    text: "精细化预报",
                    x:10,
                    align:'left',
                    margin:5,
                    style:{fontSize:"16px"}
                },
                subtitle:{
                    text:null
                },
                xAxis: {
                    categories: datas.labels[0]
                },
                yAxis: [{
                    title: {
                        text: elementUnits1,
                        style: {
                            color: colors[0]
                        }
                    }
                    },{
                    title: {
                        text: elementUnits2,
                        style: {
                            color: colors[1]
                        }
                    },
                    opposite: true
                    }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'left',
                    verticalAlign: 'left',
                    x: 120,
                    borderWidth: 0
                },
                plotOptions: {
                    column: {
                        color:colors[1]
                    },
                    spline: {
                        color:colors[0]
                    }
                },
                series: [{
                    name: elementStr2,
                    type: 'column',
                    yAxis: 1,
                    data: datas.datasets[1],
                    tooltip: {
                        valueSuffix: ' mm'
                    }
                }, {
                    name: elementStr1,
                    type: 'spline',
                    data: datas.datasets[0],
                    tooltip: {
                        valueSuffix: '°C'
                    }
                }]
            });
        }

       /* //Chart赋值
        if(chartType == "Line")
            new Chart(document.getElementById(chartId).getContext("2d")).Line(lineChartData, {pointDot : false});
        else if(chartType == "Bar")
            new Chart(document.getElementById(chartId).getContext("2d")).Bar(lineChartData);
        var hourSpans = getHourSpansFromForecastData(items, element);
        $("#"+chartId+"Time").html(updateChartTime(dateTime, hourSpans));*/
    }
}

//预报统计图日期
function updateChartTime(dateTime, hourSpans){
    var time = dateTime.getTime();
    var widthTotal = 613;
    var delta = widthTotal/hourSpans.length;
    var content = "";
    var last = 0;
    for(var i=0;i<hourSpans.length;i++)
    {
        var timeCurrent = time + hourSpans[i] * 60 * 60 * 1000; //value以小时为单位
        var dateCurrent = new Date();
        dateCurrent.setTime(timeCurrent);
        var day = dateCurrent.getDate();

        if(i == hourSpans.length - 1){
            var month = dateCurrent.getMonth()+1;
            var str = (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2);
            content += '<div style="width: '+delta*(i-last)+'px;">'+str+'</div>';
        }
        else{
            var timeNext = time + hourSpans[i+1] * 60 * 60 * 1000; //value以小时为单位
            var dateNext = new Date();
            dateNext.setTime(timeNext);
            var dayNext = dateNext.getDate();
            if(day != dayNext){
                var month = dateCurrent.getMonth()+1;
                var str = (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2);
                content += '<div style="width: '+delta*(i-last)+'px;">'+str+'</div>';
                last = i;
            }
        }
    }
    return content;
}

//更新要素表格
function updateTable(items, dateTime){
    var hourSpan = 6; //3小时降水为最小时效间隔
    var hourSpanTotal = 72; //最长七天，这里写死基本上没问题
    var hourSpanGroup = 24; //24小时一段（按天统计）
    var hourSpanCount = hourSpanTotal/hourSpan;
    var days = hourSpanTotal/24;
    var time = dateTime.getTime();
    var startHour = dateTime.getHours();

    var contentHtml = "";
    contentHtml += '<table class="latticeTable"><tr class="tableHeader"><td rowspan="2" style="width: 100px">预报要素</td>';
    for(var i=0;i<days;i++){
        var dayTemp = new Date();
        var timeTemp = time+(i+(startHour>=20?1:0))*1000*3600*24;
        dayTemp.setTime(timeTemp);
        var year = dayTemp.getFullYear();
        var month = dayTemp.getMonth()+1;
        var day = dayTemp.getDate();
        var strDate = year + "-" + (Array(2).join(0) + month).slice(-2) + "-" + (Array(2).join(0) + day).slice(-2);
        contentHtml += '<td colspan="8">'+strDate+'</td>';
    }

    contentHtml += '</tr><tr class="tableHeader">';
    for(var i=0;i<days;i++){
        var count = hourSpanGroup/hourSpan;
        for(var j=0;j<count; j++)
        {
            var dayTemp = new Date();
            var timeTemp = time+(i*count+j)*hourSpan*1000*3600;
            dayTemp.setTime(timeTemp);
            var hour = dayTemp.getHours();
            var minute = dayTemp.getMinutes();
            var strDate = (Array(2).join(0) + hour).slice(-2) + ":" + (Array(2).join(0) + minute).slice(-2);
            contentHtml += '<td colspan="2">'+strDate+'</td>';
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">3小时降水(mm)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 3;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var hourSpan = (i*count+j+1)*statisticHours;
            if(hourSpan<=72) {
                var v = getValueFromForecastData(items, "r3", hourSpan);
                contentHtml += '<td>' + v + '</td>';
            }
            else{
                if(hourSpan%6==0) {
                    var v = getValueFromForecastData(items, "r3", hourSpan);
                    contentHtml += '<td colspan="2">' + v + '</td>';
                }
            }
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">6小时降水(mm)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 6;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var v = getStatisticValue(items, "r3", (i*count+j)*statisticHours, (i*count+j+1)*statisticHours, 0);
            contentHtml += '<td colspan="2">'+v+'</td>';
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">12小时降水(mm)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 12;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var v = getStatisticValue(items, "r3", (i*count+j)*statisticHours, (i*count+j+1)*statisticHours, 0);
            contentHtml += '<td colspan="4">'+v+'</td>';
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">24小时降水(mm)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 24;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var v = getStatisticValue(items, "r3", (i*count+j)*statisticHours, (i*count+j+1)*statisticHours, 0);
            contentHtml += '<td colspan="8">'+v+'</td>';
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">日最高温(℃)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 24;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var v = getStatisticValue(items, "2t", (i*count+j)*statisticHours, (i*count+j+1)*statisticHours, 1);
            contentHtml += '<td colspan="8">'+v+'</td>';
        }
    }

    contentHtml += '</tr><tr><td class="tableHeader">日最低温(℃)</td>';
    for(var i=0;i<days;i++){
        var statisticHours = 24;//统计时长
        var count = hourSpanGroup/statisticHours;
        for(var j=0;j<count; j++){
            var v = getStatisticValue(items, "2t", (i*count+j)*statisticHours, (i*count+j+1)*statisticHours, 2);
            contentHtml += '<td colspan="8">'+v+'</td>';
        }
    }

    contentHtml += '</tr></table>';
    $("#latticeTable").html(contentHtml);

    //获取统计值
    function getStatisticValue(items, element, startHourSpan, endHourSpan, statisticMethod){
        var result = null;
        for(var key in items){
            var item = items[key];
            if(item.element != element)
                continue;
            if(startHourSpan<item.hourSpan && item.hourSpan<=endHourSpan){
                var v = item.datas[0];
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
}

//从预报数据中获取图表数据
function getValueFromForecastData(items, element, hourSpan){
    var result = null;
    for(var key in items) {
        var item = items[key];
        if (item.element == element && item.hourSpan == hourSpan) {
            result = item.datas[0];
        }
    }
    return result;
}

//从预报数据中获取图表数据
function getChartDataFromForecastData(items, elements, dateTime){
    var time = dateTime.getTime();
    var chartData = null;
    var labels1 = [];
    var labels2 = [];
    var datas1 = [];
    var datas2 = [];
    for(var key in items){
        var item = items[key];
        if(item.element == elements[0]){
            datas1.push(item.datas[0]);
            var timeNew = time + item.hourSpan * 60 * 60 * 1000; //value以小时为单位
            var dateNew = new Date();
            dateNew.setTime(timeNew);
            var hour = dateNew.getHours();
            var minutes = dateNew.getMinutes();
            labels1.push((Array(2).join(0) + hour).slice(-2) + ":" + (Array(2).join(0) + minutes).slice(-2));
        }else if(item.element == elements[1]){
            datas2.push(item.datas[0]);
            var timeNew = time + item.hourSpan * 60 * 60 * 1000; //value以小时为单位
            var dateNew = new Date();
            dateNew.setTime(timeNew);
            var hour = dateNew.getHours();
            var minutes = dateNew.getMinutes();
            labels2.push((Array(2).join(0) + hour).slice(-2) + ":" + (Array(2).join(0) + minutes).slice(-2));
        }else{

        }
    }
    if(datas1.length > 0&&datas2.length > 0)
        chartData = {labels:[labels1,labels2], data:[datas1,datas2]};
    return chartData;
}

function getHourSpansFromForecastData(items, element){
    var hourSpans = [];
    for(var key in items){
        var item = items[key];
        if(item.element == element){
            hourSpans.push(item.hourSpan);
        }
    }
    return hourSpans;
}

function getWDName(value){
    var name = "";
    if(value != null) {
        switch (value) {
            case 1:
                name = "东北风";
                break;
            case 2:
                name = "东风";
                break;
            case 3:
                name = "东南风"
                break;
            case 4:
                name = "南风";
                break;
            case 5:
                name = "西南风"
                break;
            case 6:
                name = "西风";
                break;
            case 7:
                name = "西北风"
                break;
            case 8:
                name = "北风";
                break;
            case 9:
                name = "旋转不定";
                break;
        }
    }
    return name;
}

function getWSName(value){
    var name = "";
    if(value != null) {
        switch (value) {
            case 0:
                name = "<3级";
                break;
            case 1:
                name = "3-4级";
                break;
            case 2:
                name = "4-5级";
                break;
            case 3:
                name = "5-6级";
                break;
            case 4:
                name = "6-7级";
                break;
            case 5:
                name = "7-8级"
                break;
            case 6:
                name = "8-9级";
                break;
            case 7:
                name = "9-10级";
                break;
            case 8:
                name = "10-11级";
                break;
            case 9:
                name = "11-12级";
                break;
        }
    }
    return name;
}

function getWeatherName(value){
    var name = "";
    if(value != null) {
        switch (value) {
            case 0:
                name = "晴";
                break;
            case 1:
                name = "多云";
                break;
            case 2:
                name = "阴";
                break;
            case 3:
                name = "阵雨";
                break;
            case 4:
                name = "雷阵雨";
                break;
            case 7:
                name = "小雨";
                break;
            case 21:
                name = "小到中雨";
                break;
            case 8:
                name = "中雨";
                break;
            case 22:
                name = "中到大雨";
                break;
            case 9:
                name = "大雨";
                break;
            case 23:
                name = "大到暴雨";
                break;
            case 10:
                name = "暴雨";
                break;
            case 24:
                name = "暴雨到大暴雨";
                break;
            case 11:
                name = "大暴雨";
                break;
            case 25:
                name = "大暴雨到特大暴雨";
                break;
            case 12:
                name = "特大暴雨";
                break;
            case 5:
                name = "冰雹";
                break;
            case 6:
                name = "雨夹雪";
                break;
            case 13:
                name = "阵雪";
                break;
            case 14:
                name = "小雪";
                break;
            case 26:
                name = "小到中雪";
                break;
            case 15:
                name = "中雪";
                break;
            case 27:
                name = "中到大雪";
                break;
            case 16:
                name = "大雪";
                break;
            case 28:
                name = "大到暴雪";
                break;
            case 17:
                name = "暴雪";
                break;
            case 19:
                name = "冻雨";
                break;
            case 18:
                name = "雾";
                break;
            case 53:
                name = "霾";
                break;
            case 29:
                name = "浮尘";
                break;
            case 30:
                name = "扬沙";
                break;
            case 21:
                name = "沙尘暴";
                break;
            case 31:
                name = "强沙尘暴";
                break;
        }
    }
    return name;
}
