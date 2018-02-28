/**
 * @author: wangkun
 * @date:2017-12-20
 * @description 格点检验评估
 */
function GDJYPageCLass() {
    this._init_();
}

GDJYPageCLass.prototype = {
    constructor: GDJYPageCLass,
    dateSelect1: null,
    dateSelect2: null,
    JYchart: null,
    optionElements: {
        CMA: "中央台指导",
        bj: "中央台格点",
        grid_prvn: "省台格点（格点对格点）",
        prvn: "省台格点",
        SNWFD: "城镇预报",
        ECMOS: "本地MOS1",
        OPS: "本地OPS",
        ec: "EC-thin",
        t639: "T639"
    },
    _init_: function () {
        this.name = "检点检验";
    },
    renderMenu: function () {
        var me = this;
        $("#map_div").hide();
        $("#content").html(`
      <div id="jyChart_div">
        <div id="JY_Condition">
          <span>条件：</span><div id="dateSelect1"></div><span>到</span><div id="dateSelect2"></div><span>时次</span>
          <select id="jyTimePar"><option value="08">08</option><option value="20">20</option></select>
          <span>地区</span><select id="jyArea"><option value="all">全省</option></select>
          <span>站点</span><select id="jyStation"><option value="all">全部</option></select>
          <span>图表时效</span><select id="jyHours"><option value="72">72</option><option value="168">168</option><option value="240">240</option></select>
          <span>地图时效</span><select id="jyHourSpan"><option value="24">24</option><option value="48">48</option><option value="72">72</option><option value="96">96</option><option value="120">120</option><option value="144">144</option><option value="168">168</option></select>
        </div>
        <div class="overflow" id="option">
          <div class="jyElementDiv" id="display"><span class="leftTitle">显示：</span><span class="jyElements active">图表</span><span class="jyElements">地图</span></div>
          <div class="jyElementDiv" id="element"><span class="leftTitle">要素：</span><span class="jyElements" id="r12">日降水</span><span class="jyElements" id="10uv">风</span><span class="jyElements" id="2t">气温</span><span class="jyElements active" id="tmax">日最高温度</span><span class="jyElements" id="tmin">日最低温度</span></div>
          <div class="jyElementDiv" id="type"><span class="leftTitle">类型：</span><span class="jyElements">中央指导台</span><span class="jyElements">中央格点台</span><span class="jyElements">省台格点(格点对格点)</span><span class="jyElements">省台格点</span><span class="jyElements">城镇预报</span><span class="jyElements">本地MOS1</span><span class="jyElements">本地OPS</span><span class="jyElements">EC-thin</span><span class="jyElements">T639</span></div>
          <div class="jyElementDiv" id="level"><span class="leftTitle">级别：</span><span class="jyElements">≥0.1mm</span><span class="jyElements">≥10mm</span><span class="jyElements">≥25mm</span><span class="jyElements">≥50mm</span><span class="jyElements">≥100mm</span></div>
          <div class="jyElementDiv" id="method1"><span class="leftTitle">方法：</span><span class="jyElements active">晴雨</span><span class="jyElements">TS评分</span><span class="jyElements">空报率</span><span class="jyElements">漏报率</span><span class="jyElements">预报偏差</span></div>
          <div class="jyElementDiv" id="method2"><span class="leftTitle">方法：</span><span class="jyElements active">风向预报评分</span><span class="jyElements">风速预报评分</span><span class="jyElements">风向预报准确率</span><span class="jyElements">风速预报准确率</span></div>
          <div class="jyElementDiv" id="method3"><span class="leftTitle">方法：</span><span class="jyElements active" value="devia">绝对平均误差</span><span class="jyElements" value="deviaSq">均方根误差</span><span class="jyElements" value="correct1">≤1℃准确率</span><span class="jyElements" value="correct2">≤2℃准确率</span></div>
        </div>
        <div class="jyTable">
          <div class="echartsBox" id="jyChart"></div>
          <table class="ybjyTable table table-bordered"></table>
        </div>
        <div class="jyMap"> 
          <ul class="left"> 
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div class="right" id="gdjyMap">
            
          </div>
        </div>
      </div>
    `);
        me.dateSelect1 = new DateSelecter(2, 2);
        me.dateSelect1.intervalMinutes = 60 * 24; //24小时
        me.dateSelect1.changeHours(-11 * 24 * 60);
        $("#dateSelect1").html(me.dateSelect1.div);
        $("#dateSelect1").find("input").css({
            "width": "95px",
            border: "1px solid #e8e9eb",
            height: "28px",
            "padding-left": "5px"
        });
        $("#dateSelect1").find("img").css("display", "none");

        me.dateSelect2 = new DateSelecter(2, 2);
        me.dateSelect2.intervalMinutes = 60 * 24; //24小时
        me.dateSelect2.changeHours(-1 * 24 * 60);
        $("#dateSelect2").html(me.dateSelect2.div);
        $("#dateSelect2").find("input").css({
            "width": "95px",
            border: "1px solid #e8e9eb",
            height: "28px",
            "padding-left": "5px"
        });
        $("#dateSelect2").find("img").css("display", "none");

        initRes();
        initEvent();
        load();

        function initRes() {
            if(IsDEBUG){
                me.dateSelect1.setCurrentTime("2017-11-01 00:00:00");
                me.dateSelect2.setCurrentTime("2017-11-30 00:00:00");
            }
            me.JYchart = echarts.init($("#jyChart")[0]);
            var option = {
                title: {
                    text: ''
                },
                color:["#FF0000","#FFA500","#FFFF00","#008000","#00FFFF","#0000FF","#FF00FF","#FF0080","#9932CC"],
                textStyle: {
                    color: "white"
                },
                tooltip:{
                    show:true,
                },
                grid: {
                    bottom: 80
                },
                legend: {
                    data: ['中央台指导', '中央台格点', '省台格点(格点对格点)', '省台格点', '城镇预报', '本地MOS1', '本地OPS', 'EC-thin', 'T639'],
                    bottom:30,
                    textStyle:{
                        color:"white",
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: ['24', '48', '72'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: []
            };
            me.JYchart.setOption(option);
        }

        function initEvent() {
            $("#type").hide();
            $(".jyMap").hide();
            $("#method1").hide();
            $("#method2").hide();
            $("#level").hide();

            // let jyMap = new MapUtil($("#gdjyMap"));
            $("#display").find(".jyElements").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                console.log(this);
                if (this.innerHTML == "图表") {
                    $("#type").hide();
                    $(".jyTable").show();
                    $(".jyMap").hide();
                }
                if (this.innerHTML == "地图") {
                    $("#type").show();
                    $(".jyTable").hide();
                    $(".jyMap").show();
                    GDYB.mapUtil = new MapUtil($("#gdjyMap"));
                }
                if (this.innerHTML == '日降水') {
                    $("#method1").show();
                    $("#method2").hide();
                    $("#method3").hide();

                }
            });
            $("#element").find(".jyElements").on("click", function () {
                if (this.innerHTML == '日降水') {
                    $("#method1").show();
                    $("#method2").hide();
                    $("#method3").hide();
                    $("#level").show();
                }
                else if (this.innerHTML == '风') {
                    $("#method1").hide();
                    $("#method2").show();
                    $("#method3").hide();
                    $("#level").hide();
                }
                else {
                    $("#method1").hide();
                    $("#method2").hide();
                    $("#method3").show();
                    $("#level").hide();
                }
            });
            $("#option .jyElements").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                me.updateGridCheck();
            });
        }

        function load() {
            me.updateGridCheck();
        }
    },
    /**
     * @author:wangkun
     * @date:2017-12-08
     * @modifyDate:
     * @return:
     * @description:更新格点检验查询
     */
    updateGridCheck: function () {
        var me = this;
        var startDate = me.dateSelect1.getCurrentTimeReal();
        var endDate = me.dateSelect2.getCurrentTimeReal();
        var myDate1 = new MyDate();
        startDate = myDate1.convert(startDate);
        var myDate2 = new MyDate();
        endDate = myDate2.convert(endDate);
        var strStartDate = startDate.format("yyMMdd");
        var strEndDate = endDate.format("yyMMdd");
        var timeLevel = $("#jyTimePar").val();
        var type = $("#method3 span.active").attr("value");
        var element = $("#element span.active").attr("id");
        if (element == "r12" && type != "barometer")
            type = type + $("#method3 span.active").attr("value");
        var param = {
            startTime: strStartDate,
            endTime: strEndDate,
            forecastHour: timeLevel,
            element: element,
            type: type
        };
        var url = gridServiceUrl + "services/ForecastfineService/getGridCheck";
        request('POST', url, param).then(function (data) {
            var scale = (type == "devia" || type == "deviaSq" || type.indexOf("deviation") >= 0) ? 1.0 : 100.0; //除了平均误差和均方差，其他都*100转换为百分数
            var labels = me.getHourSpan(element);
            var value = {};
            for (var key in me.optionElements) {
                value[key] = [];
            }
            var obj = {};
            for (var i = 0; i < data.length; i++) {
                var ele = data[i].productType + "_" + data[i].hourspan;
                if (typeof(obj[ele]) == "undefined") {
                    obj[ele] = [data[i].value];
                }
                else {
                    obj[ele].push(data[i].value);
                }
            }
            for (var i = 0; i < labels.length; i++) {
                for (var e in me.optionElements) {
                    if (typeof(obj[e + "_" + labels[i]]) == "undefined") {
                        value[e].push(-999);
                    }
                    else {
                        var avg = 0;
                        var miss = 0;
                        for (var j = 0; j < obj[e + "_" + labels[i]].length; j++) {
                            if (obj[e + "_" + labels[i]][j] == -999 || obj[e + "_" + labels[i]][j] >1000)
                                miss++;
                            else
                                avg += obj[e + "_" + labels[i]][j];
                        }
                        value[e].push(parseFloat((avg / (obj[e + "_" + labels[i]].length - miss) * scale).toFixed(2)));
                    }
                }
            }
            me.updateJYTable(value);
            var option = me.JYchart.getOption();
            me.JYchart.clear();
            var index = 0;
            var legend = [];
            option.series = [];
            for (var ele in value) {
                var thisName = me.optionElements[ele];
                legend.push(thisName);
                for (var i = 0; i < value[ele].length; i++) {
                    if (value[ele][i] == -999)
                        value[ele][i] = 0;
                }
                option.series.push({
                    name: thisName,
                    type: "bar",
                    data: value[ele]
                });
                index++;
            }
            option.legend[0].data = legend;
            me.JYchart.setOption(option);
        });
    },
    getHourSpan: function (element) {
        var hourspans = null;
        var hours = parseInt($("#jyHours").val());
        if (hours == 72) {
            if (element == "r12" || element == "w" || element == "air" || element == "wmax") {
                hourspans = [12, 24, 36, 48, 60, 72];
            }
            else if (element == "tmax" || element == "tmin") {
                hourspans = [24, 48, 72];
            }
            else {
                hourspans = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72];
            }
        }
        else if (hours == 168) {
            if (element == "r12" || element == "w" || element == "air" || element == "wmax") {
                hourspans = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168];
            }
            else if (element == "tmax" || element == "tmin") {
                hourspans = [24, 48, 72, 96, 120, 144, 168];
            }
            else {
                hourspans = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168];
            }
        }
        else {
            if (element == "r12" || element == "w" || element == "air" || element == "wmax") {
                hourspans = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240];
            }
            else if (element == "tmax" || element == "tmin") {
                hourspans = [24, 48, 72, 96, 120, 144, 168, 192, 216, 240];
            }
            else {
                hourspans = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138, 141, 144, 147, 150, 153, 156, 159, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234, 237, 240];
            }
        }
        return hourspans;
    },
    updateJYTable: function (items) {
        var me = this;
        var element = $("#element span.active").attr("id");
        var hourSpans = me.getHourSpan(element);
        var contentHtml = '';
        contentHtml += '<tr><td width="120">模式</td>';
        for (var i = 0; i < hourSpans.length; i++) {
            contentHtml += '<td>' + hourSpans[i] + '</td>';
        }
        contentHtml += '</tr>';
        for (var ele in items) {
            contentHtml += '<tr><td>' + me.optionElements[ele] + '</td>';
            for (var i = 0; i < items[ele].length; i++) {
                var value = items[ele][i] == -999 ? "无数据" : items[ele][i];
                contentHtml += '<td>' + value + '</td>';
            }
            contentHtml += '</tr>';
        }

        $(".ybjyTable").html(contentHtml);
    },
    initEvent() {

    }
};
