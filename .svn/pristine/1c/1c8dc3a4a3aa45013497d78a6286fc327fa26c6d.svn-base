/**
 * Created by Administrator on 2016/5/17.
 *
 * border: 1px solid rgb(204, 225, 246);color: rgb(0, 40, 129);float: left;font-size: 14px;height: 30px;line-height: 30px;text-align: center;
 */
function ZHJCSKPageClass(){
    this.layerPlot = null;
    this.stationPlot = null;
    this.realTime = true;
    this.runFlag = true;
    this.animation = false;
    this.keyDown = false;
    this.station_country = null;
    this.station_town= null;
    var t = this;
    this.myDateSelecter1 = null;
    this.myDateSelecter2 = null;
    var stationLayer = null;
    this.renderMenu = function() {
         var htmlStr = "<div style='padding-top: 15px;'>"
            +"<div id='zhjcElement' class='menuDiv_bottom1'>"
                    +"<div id='ysElement'><div style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px;' id='ys_jiangs' class='rhjcHourSpan active' flag='0'>降水</div><div style='margin: 0px 5px 0px 20px;' id='ys_qiw' class='rhjcHourSpan active' flag='1'>气温</div><div style='margin: 0px 5px 0px 20px;' id='ys_gaow' class='rhjcHourSpan active' flag='2'>最高温</div><div style='margin: 0px 5px 0px 20px;' id='ys_diw' class='rhjcHourSpan active' flag='3'>最低温</div></div>"
                    +"<div style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px;' id='ys_feng' class='rhjcHourSpan active'flag='4'>风</div><div style='margin: 0px 5px 0px 20px;' id='ys_jdfeng' class='rhjcHourSpan active'flag='5'>极大风</div><div style='margin: 0px 5px 0px 20px;' id='ys_shid' class='rhjcHourSpan active'flag='6'>湿度</div><div style='margin: 0px 5px 0px 20px;' id='ys_qiy' class='rhjcHourSpan active' flag='7'>气压</div></div></div>"
                    +"<div id='stationType' style='height: 22px;margin: 5px 0px 0px 10px;float: left;width: 140px;'><div style='margin: 0px 5px' id='benz' class='rhjcHourSpan active'>本站</div><div style='margin: 0px 5px 0px 20px;' id='quyz' class='rhjcHourSpan'>区域站</div></div>"
                    +"<div id='timeType' style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px' id='timeHour' class='rhjcHourSpan active'>小时</div><div style='margin: 0px 5px 0px 20px;' id='time10Min' class='rhjcHourSpan'>10分钟</div></div>"
            +"</div>"
            +"<div id='skElement' class='menuDiv_bottom1'>"
                +"<div style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px 0px 5px;' id='rhjc_wu' class='rhjcHourSpan' flag='6'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/wu.png'>雾</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_shuangd' class='rhjcHourSpan ' flag='7'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/shuangd.png'>霜冻</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_yangs' class='rhjcHourSpan ' flag='8'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/yangs.png'>扬沙</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_fuc' class='rhjcHourSpan ' flag='9'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/fuc.png'>浮尘</div></div>"
                +"<div style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px 0px 5px;' id='rhjc_hanc' class='rhjcHourSpan' flag='10'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/hanc.png'>寒潮</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_baox' class='rhjcHourSpan ' flag='11'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/baox.png'>暴雪</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_wum' class='rhjcHourSpan ' flag='12'><img style='width:15px;margin: -3px 2px 0px -8px;' src='imgs/zhjc/mai.png'>霾</div><div style='margin: 0px 5px 0px 20px;' id='rhjc_gaow' class='rhjcHourSpan ' flag='13'><img style='width:15px;margin: -3px 2px 0px 0px;' src='imgs/zhjc/gaow.png'>高温</div></div>"
                +"<div style='height: 22px;margin: 5px 0px 0px 10px;'><div style='margin: 0px 5px 0px 5px;' id='rhjc_shacb' class='rhjcHourSpan' flag='14'>沙尘暴</div></div>"
            +"</div>"
            +"<div style='padding-top: 10px;'>"
            +"<div class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='color: red;margin-left: 15px;line-height: 22px;'></span></div>"
            +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 60px;'>6H</div><div class='rhjcHourSpan' style='width: 60px;'>12H</div><div class='rhjcHourSpan' style='width: 60px;'>24H</div></div>"
            +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>停止</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 10px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
             +"<div id='timeListDiv' class='timeListDiv' style='top:360px;'></div>"
            +"</div>"

            +"</div>";
        $("#menu_bd").html(htmlStr);
        this.myDateSelecter1 = new DateSelecter(1,1); //最小视图为天
        this.myDateSelecter1.changeHours(-6*60);
        this.myDateSelecter1.intervalMinutes = 60*24; //12小时
        this.myDateSelecter2 = new DateSelecter(1,1); //最小视图为天
        this.myDateSelecter2.intervalMinutes = 60*24; //12小时
        $("#dateSelect1").append(this.myDateSelecter1.div);
        $("#dateSelect2").append(this.myDateSelecter2.div);
        $("#dateSelect1").find("input").css("width","191px");
        $("#dateSelect2").find("input").css("width","191px");
        $("#dateSelect1").find("img").css("display","none");
        $("#dateSelect2").find("img").css("display","none");
        $("#dateSelect1").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");
        $("#dateSelect2").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");

        this.myPanel_YSTJ = new Panel_YSTJ($("#map_div"));//统计面板
        this.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", {renderers: ["Plot"]});//气象灾害综合填图
        this.stationPlot = new WeatherMap.Layer.Vector("stationPlot", {renderers: ["Plot"]});//气象要素综合填图
        stationLayer = new WeatherMap.Layer.Vector("stationLayer",{renderers: ["Canvas"]});//站点图层
        this.layerPlot.style = {
            fill : false
        };
        this.stationPlot.style = {
            fill : false
        };
        //气象灾害图层样
        this.layerPlot.renderer.styles = plotStyles_rhjc;
        this.layerPlot.renderer.plotWidth = 0;
        this.layerPlot.renderer.plotHeight = 0;
        //气象要素图层样
        this.stationPlot.renderer.styles = plotStyles_zhjc;
        this.stationPlot.renderer.plotWidth = 20;
        this.stationPlot.renderer.plotHeight = 20;

        GDYB.Page.curPage.map.addLayers([this.layerPlot]);
        GDYB.Page.curPage.map.addLayers([this.stationPlot]);
        GDYB.Page.curPage.map.addLayer(stationLayer);
        GDYB.Legend.update(null);

        //站点点击显示5日数据图表
        var callbacks = {
            click: function(currentFeature){
                var date = new Date();
                var ObservTimesEnd = dateToTimeStation(date);
                var month = date.getMonth();
                var year = date.getFullYear();
                var monthOld = null;
                date.setDate(date.getDate()-5);
                var ObservTimesStart = dateToTimeStation(date);
                date.setHours(date.getHours()+4);
                var time = dateToTimeStation(date);
                if($("#timeType").find(".active").attr("id") == "timeHour"){
                    var tableName = "HIS_HOUR_";
                    ObservTimesStart = ObservTimesStart.substr(0,ObservTimesStart.length-2);
                    ObservTimesEnd = ObservTimesEnd.substr(0,ObservTimesEnd.length-2);
                }
                else{
                    var tableName = "HIS_REALDATA_";
                }
                if(month != date.getMonth()){
                    monthOld = date.getMonth();
                    getOneStationDetail(tableName+time.substr(0,6),ObservTimesStart,ObservTimesEnd,currentFeature.attributes.StaID,function(dataOld){
                        getOneStationDetail(tableName+ObservTimesEnd.substr(0,6),ObservTimesStart,ObservTimesEnd,currentFeature.attributes.StaID,function(data){
                            Array.prototype.push.apply(data, dataOld);
                            displayStationChart(data,currentFeature)
                        });
                    });
                }
                else{
                    getOneStationDetail(tableName+ObservTimesEnd.substr(0,6),ObservTimesStart,ObservTimesEnd,currentFeature.attributes.StaID,function(data){
                        displayStationChart(data,currentFeature)
                    });
                }
            }
        };
        var selectFeature = new WeatherMap.Control.SelectFeature(stationLayer, {
            callbacks: callbacks
        });
        GDYB.Page.curPage.map.addControl(selectFeature);
        selectFeature.activate();

        //气象灾害点击事件
        $("#skElement").find(".rhjcHourSpan").click(function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
                t.layerPlot.redraw();
            }
            else{
                $(this).addClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
                t.layerPlot.redraw();
            }
            if($("#hourRadio")[0].checked) {
                $("#ysElement").find(".active").removeClass("active");
                t.stationPlot.removeAllFeatures();
                stationLayer.removeAllFeatures();
                getAllShiKuangByTimes();
            }
            else{
                getNewShiKuang();
            }
        });

        //气象要素点击事件
        $("#ysElement").find(".rhjcHourSpan").click(function(){
            if($("#hourRadio")[0].checked) {
                $("#skElement").find(".active").removeClass("active");
                $("#ysElement").find(".active").removeClass("active");
                $(this).addClass("active");
                displayControl();
                getStationShiKuangByTimes();
            }
            else{
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                    plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = false;
                    t.stationPlot.redraw();
                }
                else {
                    $(this).addClass("active");
                    plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = true;
                    t.stationPlot.redraw();
                }
                getNewStationSK();
            }
        });

        $("#stationType").find(".rhjcHourSpan").click(function(){
            if($(this).hasClass("active"))
                return;
            $(this).parent().find(".rhjcHourSpan").removeClass("active");
            $(this).addClass("active");
            if($("#timeRadio")[0].checked) {
                /*if(this.id == 'benz' && t.station_country == null){
                    getStations(getNewStationSK);
                }
                *//*else if(this.id == 'quyz' && t.station_town == null){
                    getStations(getNewStationSK);
                }*//*
                else{*/
                    getNewStationSK();
                /*}*/
            }else{
                getStationShiKuangByTimes();
            }
        });

        $("#timeType").find(".rhjcHourSpan").click(function(){
            if($(this).hasClass("active"))
                return;
            $(this).parent().find(".rhjcHourSpan").removeClass("active");
            $(this).addClass("active");
            if($("#timeRadio")[0].checked) {
                    getNewStationSK();
            }else{
                getStationShiKuangByTimes();
            }
        });

        $("#query_action").find("div").click(function(){
            if($(this).html() == "查询"){
                t.animation = false;
                if($("#hourRadio")[0].checked) {
                    if($("#skElement").find(".active").length != 0){
                        getAllShiKuangByTimes();
                    }
                    else{
                        getStationShiKuangByTimes();
                    }
                }
                else{
                    alertModal("当前为实时");
                }
            }
            else if($(this).html() == "动画"){
                if($("#hourRadio")[0].checked&&$("#timeListDiv").find("div").length>0) {
                    if(!t.animation){
                        t.animation = true;
                        animationShiKuang();
                    }
                }
            }
            else if($(this).html() == "停止"){
                t.animation = false;
            }
        });
        $("#timeRadio").click(function(){
            t.realTime = true;
            t.animation = false;
            var time = t.myDateSelecter1.getNowTime(false)+".000";
            $("#nowTime").html(t.myDateSelecter1.getNowTime(true));
            getNewShiKuang();
            getNewStationSK();
            if($("#ysElement").find(".active").length != 0){
                $("#ysElement").find(".rhjcHourSpan").addClass("active");
            }
            displayControl();
            $("#timeListDiv").html("");
            t.myPanel_YSTJ.panel.css("display","none");
            t.myPanel_YSTJ.panel.find(".ystjContent").html("");
        });
        $("#hourRadio").click(function(){
            t.realTime = false;
            t.layerPlot.removeAllFeatures();
            t.stationPlot.removeAllFeatures();
            stationLayer.removeAllFeatures();
            if($("#ysElement").find(".active").length != 0 && $("#skElement").find(".active").length != 0){
                $("#skElement").find(".active").removeClass("active");
                var obj = $("#ysElement").find(".active")[0];
                $("#ysElement").find(".active").removeClass("active");
                $(obj).addClass("active");
            }
            else if($("#ysElement").find(".active").length > 1){
                var obj = $("#ysElement").find(".active")[0];
                $("#ysElement").find(".active").removeClass("active");
                $(obj).addClass("active");
            }
            displayControl();
            $("#nowTime").html("");
        });
        $("#hourSpan").find("div").click(function(){
            if($(this).html() == "6H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-6*60);
            }
            else if($(this).html() == "12H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-12*60);
            }
            else if($(this).html() == "24H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-24*60);
            }
        });
        if(!this.keyDown){
            this.keyDown = true;
            $(document).keydown(function (event) {
                if(GDYB.Page.curPage != GDYB.ZHJCSKPage)
                    return;
                var allEles =$("#timeListDiv").children("div");
                //alert(allEles.length+"   "+allEles.eq(0));
                if($("#timeListDiv").find("div.active")) {
                    //键盘上下键控制数据
                    var offset = 0;
                    if (event.keyCode == 38) {//上
                        offset = -1;
                    }else if (event.keyCode == 40) {//下
                        offset = 1;
                    }
                    else{
                        return;
                    }
                    if($("#timeListDiv").find("div.active").length>0){
                        if(offset != 0){
                            var cEle = $("#timeListDiv").find("div.active");
                            if(offset==1){
                                if(cEle.next().length != 0){
                                    cEle.next().click();
                                }
                                return;
                            }
                            if(offset==-1){
                                if(cEle.prev().length != 0) {
                                    cEle.prev().click();
                                }
                                return;
                            }
                        }else{
                            return;
                        }
                        //$("#timeListDiv").find("div.active").removeClass("active");
                    }else{
                        if(allEles.length>0){
                            allEles.eq(0).click();
                        }
                        return;
                    }
                }
            });
        }
        getAllShiKuangRealTime();
    }

    //查询实时气象灾害
    function getAllShiKuang(time,recall){
        t.layerPlot.removeAllFeatures();
        var url= gsDataService + "services/DBService/getAllDisaster";
        $.ajax({
            data: {"para": "{ObservTimes:'"+time+"'}"},
            url: url,
            dataType: "json",
            success: function (data) {
                t.runFlag = true;
                if(data != null&&data.length != 0){
                    displayShiKuang(data);
                }
                recall&&recall(data);
            },
            error:function(data){
                if(t.runFlag){
                    alertModal("获取实况信息出错");
                }
                t.runFlag = false;
            },
            type: "POST"
        });
    }

    //获取最新气象灾害
    function getNewShiKuang(){
        var time = t.myDateSelecter1.getNowTime()+".000";
        getAllShiKuang(time,function(data){
            if(data != null && data.length == 0){
                var date = new Date();
                date.setHours(date.getHours()-1,0,0);
                time = dateToTimes(date);
                getAllShiKuang(time);
            }
            $("#nowTime").html(time.substr(0,4)+"年"+time.substr(5,2)+"月"+time.substr(8,2)+"日"+time.substr(11,2)+"时");
        });
    }

    //查询实时气象要素
    function getStationShiKuang(date,recall){
        var time = "";
        var tableName = "";
        time = dateToTimeStation(date);
        date.setHours(date.getHours()+4);
        tableName = dateToTimeStation(date);
        if($("#timeType").find(".active").attr("id") == "timeHour") {
            time = time.substr(0,time.length-2);
            tableName = "HIS_HOUR_" + tableName.substr(0, 6);
        }
        else{
            tableName = "HIS_REALDATA_"+tableName.substr(0,6);
        }
        var stationType = '5%';
        if($("#stationType").find(".active").attr("id") == "quyz"){
            stationType = 'w%';
        }
        var url= gsDataService + "services/DBService/getStationDetail";
        $.ajax({
            type: "POST",
            data: {"para": "{tableName:'"+tableName+"',ObservTimes:'"+time+"',type:'"+stationType+"'}"},
            url: url,
            dataType: "json",
            success: function (data) {
                t.runFlag = true;
                if($("#timeRadio")[0].checked) {
                    displayStationShiKuang(data);
                }
                if($("#timeType").find(".active").attr("id") == "timeHour")
                    $("#nowTime").html(time.substr(0,4)+"年"+time.substr(4,2)+"月"+time.substr(6,2)+"日"+time.substr(8,2)+"时");
                else
                    $("#nowTime").html(time.substr(0,4)+"年"+time.substr(4,2)+"月"+time.substr(6,2)+"日"+time.substr(8,2)+"时"+time.substr(10,2)+"分");
                recall&&recall(data);
            },
            error:function(data){
                if(t.runFlag){
                    alertModal("获取实况信息出错");
                }
                t.runFlag = false;
            }

        });
    }

    //获取最新气象灾害
    function getNewStationSK(){
        t.stationPlot.removeAllFeatures();
        stationLayer.removeAllFeatures();
        var date = new Date();
        getStationShiKuang(date,function(data){
            if(data != null && data.length == 0){
                var date = new Date();
                if($("#timeType").find(".active").attr("id") == "timeHour"){
                    date.setHours(date.getHours()-1,0,0);
                }
                else{
                    date.setMinutes(date.getMinutes()-10,0,0);
                }
                getStationShiKuang(date);
            }
        });
    }

    //查询时间段内实况
    function getAllShiKuangByTimes(){
        var ObservTimesStart = t.myDateSelecter1.getCurrentTime(false);
        var ObservTimesEnd = t.myDateSelecter2.getCurrentTime(false);
        var time1 = t.myDateSelecter1.getCurrentTime(true).substr(0,11)+t.myDateSelecter1.getCurrentTime(true).substr(12,3);
        var time2 = t.myDateSelecter2.getCurrentTime(true).substr(0,11)+t.myDateSelecter2.getCurrentTime(true).substr(12,3);
        t.layerPlot.removeAllFeatures();
        var url=gsDataService + "services/DBService/getAllDisasterByTimes";

        $.ajax({
            type: "POST",
            data: {"para": "{ObservTimesStart:'"+ObservTimesStart+"',ObservTimesEnd:'"+ObservTimesEnd+"',type:1}"},
            url: url,
            dataType: "json",
            success: function (data) {
                var tjObject = {"雾":[],"霜冻":[],"扬沙":[],"浮尘":[],"寒潮":[],"暴雪":[],"高温":[],"霾":[],"沙尘暴":[]};
                t.timeList = [];
                t.skData = {};
                for(var i=0;i<data.length;i++){
                    var time = data[i].ObservTimes
                    if(typeof(t.skData[time]) == "undefined"){
                        t.skData[time] = []
                        t.timeList.push(time);
                    }
                    t.skData[time].push(data[i]);
                    tjObject[data[i].EleName].push(data[i]);
                }
                t.timeList.sort();
                showQueryList();
                var contentTable = "<table border='1'  bordercolor='#969696'><tr><th>类别</th><th>站次</th><th>最强</th><th>出现时间</th></tr>";
                var contentDiv = "<div id='ystjContentDiv' style='overflow: auto;height: 60%;border: 1px solid rgb(150,150,150);padding: 10px;'>"+time1+"至"+time2+",";
                var num = 1;
                for(var obj in tjObject){
                    if(tjObject[obj].length != 0){
                        num ++;
                        var maxNum = 0;
                        var maxObj = null;
                        var index = 0;
                        contentTable += "<tr><td>"+obj+"</td><td>"+tjObject[obj].length+"</td>";
                        if(obj == "雾"|| obj == "霜冻"|| obj == "寒潮"|| obj == "暴雪" || obj == "霾" || obj == "高温" || obj == "沙尘暴" || obj == "扬沙" || obj == "浮尘"){
                            contentDiv += obj+"出现"+tjObject[obj].length+"站，分别为：";
                            for(var i=0;i<tjObject[obj].length;i++){
                                var date = new Date(tjObject[obj][i].ObservTimes);
                                contentDiv += tjObject[obj][i].area+tjObject[obj][i].StaName+date.getDate()+"日"+date.getHours()+"时"+tjObject[obj][i].Val+",";
                                if(maxNum<tjObject[obj][i].Val){
                                    maxNum = tjObject[obj][i].Val;
                                    index = i;
                                    maxObj = tjObject[obj][i];
                                }
                            }
                            contentDiv = contentDiv.substr(0,contentDiv.length-1);
                            contentDiv += "。";
                            if(maxObj == null){
                                maxObj = tjObject[obj][index];
                            }
                            var date = new Date(maxObj.ObservTimes);
                            contentTable +="<td>"+maxObj.StaName+"("+maxNum+")</td><td>"+date.getDate()+"日"+date.getHours()+"时</td></tr>";
                        }
                        else{
                            for(var i=0;i<tjObject[obj].length;i++){
                                if(maxNum<Math.abs(tjObject[obj][i].Val)){
                                    maxNum = Math.abs(tjObject[obj][i].Val);
                                    index = i;
                                    maxObj = tjObject[obj][i];
                                }
                            }
                            if(maxObj == null){
                                maxObj = tjObject[obj][index];
                            }
                            var date = new Date(maxObj.ObservTimes);
                            contentTable +="<td>"+maxObj.StaName+"("+maxNum+")</td><td>"+date.getDate()+"日"+date.getHours()+"时</td></tr>";
                        }
                    }
                }
                contentTable += "</table>";
                contentDiv += "</div>";
                if(data.length!=0){
                    contentTable = contentTable.replace(/undefined/g,"");
                    contentDiv = contentDiv.replace(/undefined/g,"");
                    t.myPanel_YSTJ.panel.find("#ptitle").html("综合监测天气实况统计分析");
                    t.myPanel_YSTJ.panel.find(".ystjContent").html(contentTable+contentDiv);

                    $("#ystjContentDiv").css("height",222-num*21);
                }
                else{
                    t.myPanel_YSTJ.panel.find("#ptitle").html("综合监测天气实况统计分析");
                    t.myPanel_YSTJ.panel.find(".ystjContent").html("");
                }
                t.myPanel_YSTJ.panel.css("display","block");
            },
            error:function(data){
                alertModal("获取实况信息出错");
            }
        });
    }

    //查询时间段内气象要素
    function getStationShiKuangByTimes() {
        var stationType = '5%';
        if($("#stationType").find(".active").attr("id") == "quyz"){
            stationType = 'w%';
        }
        var ObservTimesStart =getStationsTime(t.myDateSelecter1.getCurrentTime(false));
        var ObservTimesEnd = getStationsTime(t.myDateSelecter2.getCurrentTime(false));
        var date1= t.myDateSelecter1.getCurrentTimeReal();
        var date2= t.myDateSelecter2.getCurrentTimeReal();
        date2.setHours(date2.getHours()+4);
        var tableName = dateToTimeStation(date2);
        if($("#timeType").find(".active").attr("id") == "timeHour") {
            tableName = "HIS_HOUR_" + tableName.substr(0, 6);
        }
        else{
            ObservTimesStart += "00";
            ObservTimesEnd += "00";
            tableName = "HIS_REALDATA_"+tableName.substr(0,6);
        }
        t.stationPlot.removeAllFeatures();
        t.layerPlot.removeAllFeatures();
        stationLayer.removeAllFeatures();
        $("#timeListDiv").html("");
        var url = gsDataService + "services/DBService/getStationDetailByTimes";
        $.ajax({
            type: "POST",
            data: {"para": "{ObservTimesStart:'" + ObservTimesStart + "',ObservTimesEnd:'" + ObservTimesEnd + "',tableName:'" + tableName + "',type:"+stationType+"}"},
            url: url,
            dataType: "json",
            success: function (data) {
                t.timeList = [];
                t.ysData = {};
                var stationCollect = {};
                for(var i=0;i<data.length;i++){
                    var time = new Date(stationDateFormat(data[i].ObservTimes)).getTime();
                    if(typeof(t.ysData[time]) == "undefined"){
                        t.ysData[time] = []
                        t.timeList.push(time);
                    }
                    t.ysData[time].push(data[i]);
                    if(typeof(stationCollect[data[i].StationNum]) == "undefined"){
                        stationCollect[data[i].StationNum] = [];
                    }
                    stationCollect[data[i].StationNum].push(data[i]);

                }
                t.timeList.sort();
                showStationQueryList();

                //处理气象要素查询数据
                var allstationData = [];
                var element = $("#ysElement").find(".active").attr("id")
                if(element == 'ys_jiangs'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var Precipitation = 0;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].Precipitation != null)
                                Precipitation += StationDatas[i].Precipitation;
                        }
                        var stationData = {'降水时段':Precipitation,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_qiw'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var MaxTemp = StationDatas[0].MaxTemp;
                        var MinTemp = StationDatas[0].MinTemp;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].MaxTemp>MaxTemp)
                                MaxTemp = StationDatas[i].MaxTemp;
                            if(StationDatas[i].MinTemp<MinTemp)
                                MinTemp = StationDatas[i].MinTemp;
                        }
                        var stationData = {"高温时段":MaxTemp,"低温时段":MinTemp,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_gaow'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var MaxTemp = StationDatas[0].MaxTemp;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].MaxTemp>MaxTemp)
                                MaxTemp = StationDatas[i].MaxTemp;
                        }
                        var stationData = {"高温时段":MaxTemp,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_diw'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var MinTemp = StationDatas[0].MinTemp;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].MinTemp<MinTemp)
                                MinTemp = StationDatas[i].MinTemp;
                        }
                        var stationData = {"低温时段":MinTemp,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_feng' || element == 'ys_jdfeng'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var MaxWindD = StationDatas[0].MaxWindD;
                        var MaxWindV = StationDatas[0].MaxWindV;
                        var ExMaxWindD = StationDatas[0].ExMaxWindD;
                        var ExMaxWindV = StationDatas[0].ExMaxWindV;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].MaxWindV>MaxWindV){
                                MaxWindV = StationDatas[i].MaxWindV;
                                MaxWindD = StationDatas[i].MaxWindD;
                            }
                            if(StationDatas[i].ExMaxWindV>ExMaxWindV){
                                ExMaxWindV = StationDatas[i].ExMaxWindV;
                                ExMaxWindD = StationDatas[i].ExMaxWindD;
                            }
                        }
                        var stationData = {"最大风时段":getWindLevel(MaxWindV),"最大风向时段":MaxWindD,"极大风时段":getWindLevel(ExMaxWindV),"最大风向时段":ExMaxWindD,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_shid'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var RelHumidity = StationDatas[0].RelHumidity;
                        var MinRelHumidity = StationDatas[0].MinRelHumidity;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].RelHumidity>RelHumidity)
                                RelHumidity = StationDatas[i].RelHumidity;
                            if(StationDatas[i].MinRelHumidity<MinRelHumidity)
                                MinRelHumidity = StationDatas[i].MinRelHumidity;
                        }
                        var stationData = {"最大湿度时段":RelHumidity,"最小湿度时段":MinRelHumidity,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                else if(element == 'ys_qiy'){
                    for(var StaID in stationCollect){
                        var StationDatas = stationCollect[StaID];
                        var MaxPSta = StationDatas[0].MaxPSta;
                        var MinPSta = StationDatas[0].MinPSta;
                        for(var i = 0;i< StationDatas.length;i++){
                            if(StationDatas[i].MaxPSta>MaxPSta)
                                MaxPSta = StationDatas[i].MaxPSta;
                            if(StationDatas[i].MinPSta<MinPSta)
                                MinPSta = StationDatas[i].MinPSta;
                        }
                        var stationData = {"最大气压时段":MaxPSta,"最小气压时段":MinPSta,Lon:StationDatas[0].Lon,Lat:StationDatas[0].Lat};
                        allstationData.push(stationData);
                    }
                }
                displayStationShiDuan(allstationData);
            }
        });
    }
    function displayControl(){
        $("#ysElement").find(".rhjcHourSpan").each(function(){
            if($(this).hasClass("active")){
                plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = true;
            }else{
                plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = false;
            }
        });
        $("#skElement").find(".rhjcHourSpan").each(function(){
            if($(this).hasClass("active")){
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
            }else{
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
            }
        });
    }

    function stationDateFormat(ObservTimes){
        //2016-08-03 08:00:00.000//2016 08 02 12
        if($("#timeType").find(".active").attr("id") == "timeHour"){
            var time = ObservTimes.substr(0,4)+"-"+ObservTimes.substr(4,2)+"-"+ObservTimes.substr(6,2)+" "+ObservTimes.substr(8,2)+":00:00.000";
        }
        else{
            var time = ObservTimes.substr(0,4)+"-"+ObservTimes.substr(4,2)+"-"+ObservTimes.substr(6,2)+" "+ObservTimes.substr(8,2)+":"+ObservTimes.substr(10,2)+":00.000";
        }
        return  time;
    }
    function displayShiKuang(data){
        t.layerPlot.removeAllFeatures();
        var pointVectors = [];
        var Station = "";
        var attribute = {};
        var pointVector = null;
        for(var i=0;i<data.length;i++){
            if(typeof (data[i].LvlID) != "undefined"){
                if(typeof (data[i].StaID)=="undefined" ){
                    attribute = {};
                    var point = new WeatherMap.Geometry.Point(parseFloat(data[i].Lon),parseFloat(data[i].Lat));
                    attribute[data[i].EleName] = parseInt(data[i].LvlID);
                    pointVector = new WeatherMap.Feature.Vector(point, attribute);
                    pointVectors.push(pointVector);
                }
                if(data[i].StaID != Station){
                    Station = data[i].StaID;
                    attribute = {};
                    var point = new WeatherMap.Geometry.Point(parseFloat(data[i].Lon),parseFloat(data[i].Lat));
                    attribute[data[i].EleName] = parseInt(data[i].LvlID);
                    pointVector = new WeatherMap.Feature.Vector(point, attribute);
                    pointVectors.push(pointVector);
                }
                else{
                    pointVector.attributes[data[i].EleName]= parseInt(data[i].LvlID);
                }
            }
        }
        t.layerPlot.addFeatures(pointVectors);
    }

    //展示实况
    function displayStationShiKuang(data){
        t.stationPlot.removeAllFeatures();
        var pointVectors = [];
        var attribute = {};
        var pointVector = null;
        if(stationLayer.features.length == 0){
            var stationList = [];
            if($("#stationType").find(".active").attr("id") == "benz"){
                var stations = t.station_country;var stations = t.station_country;
                for(var i=0;i<stations.length;i++){
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon,stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point,stations[i],{
                        fillColor:"black",
                        pointRadius: 2
                    });
                    stationList.push(stationVector)
                }
                stationLayer.addFeatures(stationList);
            }
            /*else
                var stations = t.station_town;
            for(var i=0;i<stations.length;i++){
                var point = new WeatherMap.Geometry.Point(stations[i].Lon,stations[i].Lat);
                var stationVector = new WeatherMap.Feature.Vector(point,stations[i],{
                    fillColor:"black",
                    pointRadius: 2
                });
                stationList.push(stationVector)
            }
            stationLayer.addFeatures(stationList);*/
        }

        for(var i=0;i<data.length;i++){
            attribute = {};
            var point = new WeatherMap.Geometry.Point(data[i].Lon,data[i].Lat);
            attribute["风"] = getWindLevel(data[i].WindVelocity);
            attribute["风向"] = data[i].WindDirect;
            attribute["极大风"] = getWindLevel(data[i].WindVelocity10);
            attribute["极大风向"] = data[i].WindDirect10;
            attribute["气温"] = data[i].DryBulTemp;
            attribute["最高温"] = data[i].MaxTemp;
            attribute["最低温"] = data[i].MinTemp;
            attribute["湿度"] = data[i].RelHumidity?data[i].RelHumidity:0;
            attribute["降水"] = data[i].Precipitation?data[i].Precipitation:0;
            attribute["气压"] = data[i].StationPress?data[i].StationPress:0;
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        }
        t.stationPlot.addFeatures(pointVectors);
    }

    //展示查询气象要素数据
    function displayStationShiDuan(data){
        t.stationPlot.removeAllFeatures();
        var pointVectors = [];
        var pointVector = null;
        if(stationLayer.features.length == 0){
            if($("#stationType").find(".active").attr("id") == "benz"){
                var stations = t.station_country;
                for(var i=0;i<stations.length;i++){
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon,stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point,stations[i],{
                        fillColor:"black",
                        pointRadius: 2
                    });
                    stationLayer.addFeatures([stationVector]);
                }
            }
        }

        /*else
            var stations = t.station_town;
        for(var i=0;i<stations.length;i++){
            var point = new WeatherMap.Geometry.Point(stations[i].Lon,stations[i].Lat);
            var stationVector = new WeatherMap.Feature.Vector(point,stations[i],{
                fillColor:"black",
                pointRadius: 2
            });
            stationLayer.addFeatures([stationVector]);
        }*/
        for(var i=0;i<data.length;i++){
            var point = new WeatherMap.Geometry.Point(data[i].Lon,data[i].Lat);
            pointVector = new WeatherMap.Feature.Vector(point, data[i]);
            pointVectors.push(pointVector);
        }
        t.stationPlot.addFeatures(pointVectors);
    }

    //显示查询列表
    function showQueryList(){
        var content = "";
        var skList = $("#skElement").find(".active");
        var skIDList = [];
        for(var i=0;i<skList.length;i++){
            skIDList.push($(skList[i]).html());
        }
        for(var i=t.timeList.length-1;i>=0;i--){
            var nowDate = new Date(parseInt(t.timeList[i]));
            content += "<div>"+dateToTimes(nowDate)+"</div>";
        }

        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            var date = timesToDate($(this).html());
            displayShiKuang(t.skData[date.getTime()]);
        });
        if($("#timeListDiv").find("div").length!=0){
           /*$("#timeListDiv").find("div").eq(0).click();*/
            var allData = [];
            for(var time in t.skData){
                Array.prototype.push.apply(allData, t.skData[time]);
            }
            displayShiKuang(allData);
        }
    }

    //显示要素查询列表
    function showStationQueryList(){
        var content = "";
        var ysList = $("#ysElement").find(".active");
        var ysIDList = [];
        for(var i=0;i<ysList.length;i++){
            ysIDList.push($(ysList[i]).html());
        }
        for(var i=t.timeList.length-1;i>=0;i--){
            var nowDate = new Date(parseInt(t.timeList[i]));
            content += "<div>"+dateToTimes(nowDate)+"</div>";
        }

        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            var date = timesToDate($(this).html());
            displayStationShiKuang(t.ysData[date.getTime()]);
        });
    }

    function getAllShiKuangRealTime(){
        if(t.realTime){
            $("#nowTime").html(t.myDateSelecter1.getNowTime(true));
            getNewShiKuang();
            var name = $("#stationType").find(".active").attr("id");
            if(name == 'benz' && t.station_country == null){
                getStations(getNewStationSK);
            }
            /*else if(name == 'quyz' && t.station_town == null){
             getStations(getNewStationSK);
             }*/
            else{
                getNewStationSK();
            }

        }
        setTimeout(function(){
            if(t.realTime&&GDYB.Page.curPage == GDYB.ZHJCSKPage)
            getAllShiKuangRealTime();
        },300000);
    }

    function dateToTimes(nowDate){
        return nowDate.getFullYear()+"-"+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+"-"+(Array(2).join(0)+nowDate.getDate()).slice(-2)+" "+(Array(2).join(0)+nowDate.getHours()).slice(-2)+":"+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2)+".000";
    }

    function dateToTimeStation(nowDate){
        return nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+(nowDate.getMinutes()-nowDate.getMinutes()%10)).slice(-2);
    }

    function timeToStationHour(nowDate){
        return
    }

    function timesToDate(nowTime){
        var nowDate = new Date(parseInt(nowTime.substr(0,4)),parseInt(nowTime.substr(5,2))-1,parseInt(nowTime.substr(8,2)),parseInt(nowTime.substr(11,2)),parseInt(nowTime.substr(14,2)),parseInt(nowTime.substr(17,2)));
        return nowDate;
    }

    //动画
    function animationShiKuang(){
        if ($("#timeListDiv").find("div.active").prev().length != 0) {
            $("#timeListDiv").find("div.active").prev().click();
        }
        else{
            $("#timeListDiv").find("div").eq($("#timeListDiv").find("div").length-1).click();
        }
        setTimeout(function(){
            if(t.animation == true)
                animationShiKuang();
        },$("#animationSelect").val()*1000);
    }

    function clearElement(obj){

    }

    function clearAllElement(){

    }
    function getStations(recall){
        var stationType = '5%';
        var stationName = '本站%';
        if($("#stationType").find(".active").attr("id") == "quyz"){
            stationType = 'w%';
            stationName = '%%';
        }
        var url = gsDataService + "services/DBService/getAllStations";
        $.ajax({
            type: "POST",
            data: {"para": "{type:"+stationType+",name:"+stationName+"}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(stationType == '5%'){
                    t.station_country = data;
                }
                else{
                    t.station_town = data;
                }
                recall&&recall();
            },
            error: function () {
                alertModal("获取站点信息出错");
            }
        });
    }
//获取风速等级
    function getWindLevel(value){
        var level = 1;
        if(value<=0.3)
            level = 1;
        else if(value<=1.6)
            level = 2
        else if(value<=3.4)
            level = 3
        else if(value<=5.5)
            level = 4
        else if(value<=8.0)
            level = 5
        else if(value<=10.8)
            level = 6
        else if(value<=13.9)
            level = 7
        else if(value<=17.2)
            level = 8
        else if(value<=20.8)
            level = 9
        else if(value<=24.5)
            level = 10
        else if(value<=28.5)
            level = 11
        else if(value<=32.7)
            level = 12
        else if(value<=36.9)
            level = 13
        else if(value<=41.4)
            level = 14
        else if(value<=46.1)
            level = 15
        else if(value<=50.9)
            level = 16
        else if(value<=56.0)
            level = 17
        else if(value<=61.2)
            level = 18
        return level;
    }
    function getStationsTime(otime){
        return otime.substr(0,4)+otime.substr(5,2)+otime.substr(8,2)+otime.substr(11,2);
    }

    //获取单站5日实况数据
    function getOneStationDetail(tableName,ObservTimesStart,ObservTimesEnd,stationNum,recall){
        var url = gsDataService + "services/DBService/getOneStationDetail";
        var list;
        $.ajax({
            type: 'post',
            url: url,
            data: {"para": "{tableName:"+tableName+",ObservTimesStart:'"+ObservTimesStart+"',ObservTimesEnd:"+ObservTimesEnd+",stationNum:"+stationNum+"}"},
            dataType: 'json',
            success: function (data) {
                recall&&recall(data);
            },
            error: function () {
                alertModal("获取站点详细信息失败");
            }
        });
    }
//单站5日数据图表展示
    function displayStationChart(list,currentFeature){
        if(list.length==0)
            return;
        var lonLat = new WeatherMap.LonLat(currentFeature.attributes.Lon,currentFeature.attributes.Lat);
        var date = new Date();
        var endTime = date.getDate()+"日"+date.getHours()+"时";
        date.setDate(date.getDate()-5);
        var startTime =date.getDate()+"日"+date.getHours()+"时";
        var title = currentFeature.attributes.StaName + startTime +"到" + endTime +"实况数据";
        var contentHTML = "";
        contentHTML = "<div id='waterWindowInfo' style='font-size:12px;width: 565px;'>";
        contentHTML += "<div class='typhoonInfoTitle' style='height: 25px;border-bottom: 1px solid #e6e6e6;'><span style='line-height: 25px;margin-left: 10px;;font-weight: bold;font-size: 14px;text-align: center'>单站信息查询</span>"+
            "<span onclick='GDYB.ZHJCSKPage.closeMyInfoWin()'title='关闭' style='float: right;margin: 0px 5px 5px 0px;cursor:pointer;font-size: 20px;font-family: cursive;'>x</span></div>";
        contentHTML += '<div style="text-align: center;font-size: 16px;margin-top: 5px;">'+title+'</div>';
        contentHTML += '<div style="height: 300px;"><span class="chartScaleSpan" style="color: rgb(255,0,0)">温度</span><span class="chartScaleSpan" style="margin-top: 90px;color: rgb(51,255,0)">湿度</span><span class="chartScaleSpan" style="margin-top: 135px;color: rgb(255,0,255)">气压</span><canvas id="preChart" height="300" width="550" style="position: absolute;"></canvas>';
        contentHTML += '<canvas id="stationChart" height="300" width="550" style="position: absolute;"></canvas><span class="chartScaleSpan" style="margin-top: 90px;right: 3px;color: rgb(50, 131, 174);">降水</span></div>';
        contentHTML +='<div style="height: 50px;margin-top: 10px;"><div class="chartLegend" style="background-color: #c1d6e1;"></div><span class="chartLegendSpan">降水(mm)</span>' +
                        '<div class="chartLegend" style="background-color: rgb(255,0,0);"></div><span class="chartLegendSpan">温度(°C)</span>' +
                        '<div class="chartLegend" style="background-color: rgb(51,255,0);"></div><span class="chartLegendSpan">湿度(%)</span>' +
                        '<div class="chartLegend" style="background-color: rgb(255,0,255);"></div><span class="chartLegendSpan">气压(kPa)</span></div>';
        windowInfoXY(lonLat,contentHTML);
        var stationChartData = {
            labels : [],
            datasets : [
                {
                    fillColor : "rgba(151,187,205,0)",
                    strokeColor : "rgba(255,0,0,1)",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#fff",
                    data : []
                },
                {
                    fillColor : "rgba(151,187,205,0)",
                    strokeColor : "rgba(51,255,0,1)",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#fff",
                    data : []
                },
                {
                    fillColor : "rgba(151,187,205,0)",
                    strokeColor : "rgba(255,0,255,1)",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#fff",
                    data : []
                }
            ]
        };
        var stationBarData = {
            labels : [],
            datasets : [
                {
                    fillColor : "rgba(151,187,205, 0.6)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,0)",
                    pointStrokeColor : "#fff",
                    scaleShowLabels : false,
                    bezierCurve : false,
                    pointDot:false,
                    data : []
                }
            ]
        };
        var Precipitation = 0;
        for(var i=0;i<list.length;i++){
            if(typeof (list[i]["Precipitation"]) != "undefined")
                Precipitation += list[i]["Precipitation"];
            /*if(i != 0 && i%6 == 0) {*/
                stationBarData.datasets[0].data.push(Precipitation==0?Precipitation:Precipitation.toFixed(2));
                Precipitation = 0;
                stationBarData.labels.push(list[i].ObservTimes.substr(6, 2) + "/" + list[i].ObservTimes.substr(8, 2));
            /*}*/
            stationChartData.labels.push(list[i].ObservTimes.substr(6, 2) + "/" + list[i].ObservTimes.substr(8, 2));
            stationChartData.datasets[0].data.push(list[i]["DryBulTemp"]);
            stationChartData.datasets[1].data.push(list[i]["RelHumidity"]);
            stationChartData.datasets[2].data.push(list[i]["StationPress"]/10);

        }
        var stationChart = new Chart(document.getElementById("stationChart").getContext("2d"));
        var preChart = new Chart(document.getElementById("preChart").getContext("2d"));
        var config = {
            animation:true,
            animationEasing:"easeOutQuart",
            animationSteps:60,
            barDatasetSpacing:1,
            barShowStroke:true,
            barStrokeWidth:1,
            barValueSpacing:5,
            onAnimationComplete:null,
            scaleFontColor:"#666",
            scaleFontFamily:"'Arial'",
            scaleFontSize:12,
            scaleFontStyle:"normal",
            scaleGridLineColor:"#ffffff",
            scaleGridLineWidth:1,
            scaleLabel:"<%=value%>",
            scaleLineColor:"#ffffff",
            scaleLineWidth:1,
            scaleOverlay:false,
            scaleOverride:false,
            scaleShowGridLines:true,
            scaleShowLabels:true,
            scaleStartValue:0,
            scaleStepWidth:null,
            scaleSteps:null,
            Expand:0,
            deviationY:500
            }
        preChart.Bar(stationBarData,config);
        stationChart.Line(stationChartData);
    }

    this.closeMyInfoWin = function(){
        $("#myInfoWindow").css("display","none");
    }

    function windowInfoXY(lonLat,contentHTML){
        var pixel = GDYB.Page.curPage.map.getPixelFromLonLat(lonLat);
        $("#myInfoWin").html(contentHTML);
        var height = parseInt($("#myInfoWindow").css("height"));
        var width = $("#myInfoWindow").css("width");
        var bt = "B";
        var lr = "L";
        $(".myInfoImg").css("display","none");
        $("#myInfo"+bt+lr).css("display","block");
        $("#myInfoWindow").css("top",pixel.y);
        $("#myInfoWindow").css("left",pixel.x+68);
        $("#myInfoWindow").css("margin-top","-"+(height-12)+"px");
        $("#myInfoWindow").css("margin-left","-50px");
        /*if(pixel.y>height||((parseInt($("#accordion").css("height"))-pixel.y)<height)){
            bt = "B";
        }
        else{
            bt = "T";
        }
        if((document.body.offsetWidth-pixel.x)>(parseInt(width)-50)){
            lr = "L";
        }
        else{
            lr = "R";
        }
        $(".myInfoImg").css("display","none");
        $("#myInfo"+bt+lr).css("display","block");
        $("#myInfoWindow").css("top",pixel.y);
        $("#myInfoWindow").css("left",pixel.x);
        if(bt == "B"){
            $("#myInfoWindow").css("margin-top","-"+(height+2)+"px");
        }
        else{
            $("#myInfoWindow").css("margin-top","4px")
        }
        if(lr == "L"){
            $("#myInfoWindow").css("margin-left","-50px");
        }
        else{
            $("#myInfoWindow").css("margin-left","-"+width);
        }*/
        $("#myInfoWindow").css("display","block");
        GDYB.Page.curPage.map.events.register("move", map, function(event){
            if($("#myInfoWindow").css("display")=="block")
            {
                var pixel = GDYB.Page.curPage.map.getPixelFromLonLat(lonLat);
                $("#myInfoWindow").css("top",pixel.y);
                $("#myInfoWindow").css("left",pixel.x+68);
            }
        });
    }
}
ZHJCSKPageClass.prototype = new PageBase();