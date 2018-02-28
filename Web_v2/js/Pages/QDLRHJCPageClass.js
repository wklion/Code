/**
 * Created by Administrator on 2016/5/11.
 */


function QDLRHJCPageClass(){
    this.layerPlot = null;
    this.realTime = true;
    this.runFlag = true;
    this.animation = false;
    this.ldData = {};
    this.color = {radar_mcr:[],radar_mvil:[]};
    var t = this;
    this.keyDown = false;

    this.renderMenu = function() {
        var htmlStr = "<div style='padding-top: 15px;'>"
                +"<div id='skElement'><div style='height: 22px;margin: 5px 0px 0px 20px;'><div id='rhjc_df' class='rhjcHourSpan active' flag='0'>大风</div><img src='./imgs/dafeng1.png' style='margin: 0px 5px 0px 20px;;'><span>17-25</span><img src='./imgs/dafeng2.png' style='margin: 0px 5px 0px 20px;;'><span>25-30</span><img src='./imgs/dafeng3.png' style='margin: 0px 5px 0px 20px;'><span>>30</span></div>" +
                    "<div style='height: 22px;margin: 5px 0px 0px 20px;'><div id='rhjc_dq' class='rhjcHourSpan active' flag='1'>短强</div><img src='./imgs/duanqiang1.png' style='margin: 0px 5px 0px 20px;'><span>20-30</span><img src='./imgs/duanqiang2.png' style='margin: 0px 5px 0px 23px;'><span>30-50</span><img src='./imgs/duanqiang3.png' style='margin: 0px 5px 0px 23px;'><span>>50</span></div>" +
                    "<div style='height: 22px;margin: 5px 0px 0px 20px;'><div id='rhjc_yl' class='rhjcHourSpan active' flag='5'>雨量</div><img src='./imgs/yuliang1.png' style='margin: 0px 5px 0px 9px;'><span>0-10</span><img src='./imgs/yuliang2.png' style='margin: 0px 5px 0px 9px;'>10-25<img src='./imgs/yuliang3.png' style='margin: 0px 5px 0px 9px;'>25-50<img src='./imgs/yuliang4.png' style='margin: 0px 5px 0px 9px;'>>50</div>" +
                    "<div style='height: 22px;margin: 5px 0px 0px 20px;'><div id='rhjc_bb' class='rhjcHourSpan active' flag='2'>冰雹</div><img src='./imgs/bingbao.png' style='margin: 0px 15px 0px 12px;float: left;'><div id='rhjc_sd' class='rhjcHourSpan active' flag='3'>闪电</div><img src='./imgs/shandian.png' style='margin: 0px 15px 0px 12px;float: left;'><div id='rhjc_5min_yl' class='rhjcHourSpan active' flag='4'>5分钟雨量</div><img src='./imgs/qdl/5min_yl.png' style='margin: 2px 15px 0px 12px;float: left;'></div></div>"
                +"<div id='radarDiv' class='menuDiv_bottom1' style='margin-top: 10px;'>"
                    +"<button id='radar_mcr'>35dbz回波</button><button id='radar_mvil'>液态含水量</button>"
                    +"<button id='swan_titan'>TITIAN</button><button id='swan_trec'>TREC</button><button id='Himawari-8_mcs'>MCS</button>"
                +"</div>"
            +"<div style='padding-top: 10px;'>"
                +"<div id='timeChoose'  class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='margin-left: 15px;line-height: 22px;'></span></div>"
                +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 65px;'>6H</div><div class='rhjcHourSpan' style='width: 65px;'>12H</div><div class='rhjcHourSpan' style='width: 65px;'>24H</div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime' style='margin-left:10px;'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>累加</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 20px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
                +"<div id='timeListDiv' class='timeListDiv' style='top:380px;'></div>"
            +"</div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change'>强天气</div><div name='yjqs' class='menu_change' style='margin-top: 5px;'>雷达</div><div id='messageNum_yjqs' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>云图</div><div name='dqqs' class='menu_change active' style='margin-top: 5px;'>融合监测</div>");
        this.myDateSelecter1 = new DateSelecter(0,0); //最小视图为天
        this.myDateSelecter1.intervalMinutes = 60*24; //12小时
        this.myDateSelecter2 = new DateSelecter(0,0); //最小视图为天
        this.myDateSelecter2.intervalMinutes = 60*24; //12小时
        $("#dateSelect1").append(this.myDateSelecter1.div);
        $("#dateSelect2").append(this.myDateSelecter2.div);
        $("#dateSelect1").find("input").css("width","191px");
        $("#dateSelect2").find("input").css("width","191px");
        $("#dateSelect1").find("img").css("display","none");
        $("#dateSelect2").find("img").css("display","none");
        $("#dateSelect1").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");
        $("#dateSelect2").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");
        var nowDate = new Date();
        var min = nowDate.getMinutes();
        this.myDateSelecter1.changeHours(min-min%6);
        this.myDateSelecter2.changeHours(min-min%6);

        plotStyles_rhjc[0].visible = true;
        plotStyles_rhjc[1].visible = true;
        plotStyles_rhjc[2].visible = true;
        plotStyles_rhjc[3].visible = true;
        plotStyles_rhjc[4].visible = true;
        plotStyles_rhjc[5].visible = true;

        this.myPanel_YSTJ = new Panel_YSTJ($("#map_div"));
        this.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", {renderers: ["Plot"]});
        this.layerPlot.style = {
            fill : false
        };
        this.layerPlot.renderer.styles = plotStyles_rhjc;
        this.layerPlot.renderer.plotWidth = 0;
        this.layerPlot.renderer.plotHeight = 0;
        GDYB.Page.curPage.map.addLayers([this.layerPlot]);
        //实况点击事件
        $("#skElement").find(".rhjcHourSpan").click(function(){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;//控制综合填图要素显隐
                t.layerPlot.redraw();
            }
            else{
                $(this).addClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
                t.layerPlot.redraw();
            }
            /*if($("#hourRadio")[0].checked){
                showQueryList();
            }*/
            refreshTitleDiv();
        });

        //选项卡切换
        $(".menu_changeDiv").find(".menu_change").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#messageDivs").hide();
            $(".menu_changeDiv").find(".active").removeClass("active");
            $(this).addClass("active");
            if ($(this).html() == "强天气") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLSKPage;
                GDYB.QDLSKPage.active();
            }
            else if ($(this).html() == "雷达") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLLDPage;
                GDYB.QDLLDPage.active();
            }
            else if ($(this).html() == "云图") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLYTPage;
                GDYB.QDLYTPage.active();
            }
            else if ($(this).html() == "融合监测") {
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLRHJCPage;
                GDYB.QDLRHJCPage.active();
            }
        });

        if(!this.keyDown){
            this.keyDown = true;
            $(document).keydown(function (event) {
                if(GDYB.Page.curPage != GDYB.QDLRHJCPage)
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
                    else
                        return;
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

        //操作栏点击事件（查询、动画、停止）
        $("#query_action").find("div").click(function(){
            if($(this).html() == "查询"){
                t.animation = false;
                t.ldData = {};
                if($("#hourRadio")[0].checked) {
                    if($("#skElement").find("div.active").length != 0)
                        getAllShiKuangByTimes();//获取实况
                    if($("#radarDiv").find("button.active").length != 0){
                        var list = $("#radarDiv").find("button.active");
                        for(var i=0;i<list.length;i++){
                            getRadarTimes(list[i].id);
                        }
                    }
                }
                else{
                    alertModal("当前为实时!");
                }
            }else if($(this).html() == "动画"){
                if($("#hourRadio")[0].checked) {
                    if($("#timeListDiv").find("div").length>0){
                        $(this).html("停止");
                        if(!t.animation){
                            t.animation = true;
                            animationShiKuang();
                        }
                    }else{
                        alertModal("无查询结果");
                    }
                }else{
                    alertModal("当前为实时");
                }
            }else if($(this).html() == "停止"){
                $(this).html("动画");
                t.animation = false;
            }else if($(this).html() == "累加"){

            }else{}
        });
        //实时radio点击事件
        $("#timeRadio").click(function(){
            t.realTime = true;
            t.animation = false;
            clearAllElement();
            getNewShiKuang();
            if($("#radarDiv").find("button.active").length != 0){
                var radarList = $("#radarDiv").find("button.active");
                for(var i=0;i<radarList.length;i++){
                    if(radarList[i].id == "radar_mcr" || radarList[i].id == "radar_mvil"){
                        getNewRadar(radarList[i].id,0);
                    }
                    else if(radarList[i].id == "swan_titan" || radarList[i].id == "swan_trec"){
                        getRadarData(radarList[i].id);
                    }
                    else if(radarList[i].id == "Himawari-8_mcs"){
                        getMCS();
                    }
                }
            }
            $("#timeListDiv").html("");
            t.myPanel_YSTJ.panel.css("display","none");
            t.myPanel_YSTJ.panel.find(".ystjContent").html("");
            $("#radarDiv button").removeAttr("disabled").css("color","rgba(49,202,255,1)");
            setTimeout(function(){
                refreshTitleDiv();
            },500);
        });
        //时段radio点击事件
        $("#hourRadio").click(function(){
            t.realTime = false;
            clearAllElement();
            $("#nowTime").html("");
            $("#radarDiv button.active").each(function(){
                $(this).removeClass("active");
            });
            $("#radarDiv button").attr("disabled","true").css("color","rgba(125,125,125,1)");
            refreshTitleDiv();
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
        //雷达点击
        $("#radarDiv").find("button").click(function(){
            var radarName = this.id;
            if($(this).hasClass("active")){
                if(radarName == "radar_mcr" || radarName == "radar_mvil"){
                    clearRadarLayer(radarName);
                    t.ldData[radarName] = [];
                    hiddenLegend(radarName);
                }
                else if(radarName == "swan_titan" || radarName == "swan_trec"){
                    GDYB.RadarDataClass.clearRadarData(radarName);
                    t.ldData[radarName] = [];
                }
                else if(radarName == "Himawari-8_mcs"){
                    GDYB.AWXDataClass.clearMCS();
                }
                $(this).removeClass("active");
            }
            else{
                addLegend(radarName);
                $(this).addClass("active");
                if($("#timeRadio")[0].checked){
                    if(radarName == "radar_mcr" || radarName == "radar_mvil"){
                        getNewRadar(radarName,0);
                    }
                    else if(radarName == "swan_titan" || radarName == "swan_trec"){
                        getRadarData(radarName);
                    }
                    else if(radarName == "Himawari-8_mcs"){
                        getMCS();
                    }
                }
            }
            if($("#hourRadio")[0].checked){
                clearAllElement();
                $("#query_action").find("div").eq(0).click();
            }
            refreshTitleDiv();
        });
        GDYB.Legend.update(null);
        getAllShiKuangRealTime();

        setTimeout(function(){
            refreshTitleDiv();
        },500);
    };

    //加载标题
    function refreshTitleDiv(){
        var titleHtml = "";
        $("#map_QDLtitle_div").css("display","block");
        var timeSelecter = $("#timeChoose input[type='radio']:checked").attr("id");//判断是实时还是时段
        var timeHtml = "";
        if(timeSelecter=="timeRadio"){
            timeHtml = $("#nowTime").html();
        }else{
            if($("#timeListDiv div").hasClass("active")){//时段查询后列表中选择时刻
                var h = $("#timeListDiv div.active").html();
                timeHtml = h.substr(0,4)+"年"+h.substr(5,2)+"月"+ h.substr(8,2)+"日"+h.substr(11,2)+"时";
            }else{//时段查询后列表中未选择时刻（点击查询按钮触发）
                timeHtml = "";
            }
        }
        if($("#skElement .rhjcHourSpan").hasClass("active")){
            titleHtml += ("<p>"+timeHtml+"&nbsp;&nbsp;强天气</p>");
        }
        if($("#radarDiv button").hasClass("active")){
            $("#radarDiv button.active").each(function(){
                var con = $(this).html();
                titleHtml += ("<p>"+timeHtml+"&nbsp;&nbsp;"+ con +"</p>");
            });
        }
        $("#map_QDLtitle_div").html(titleHtml);
    }


    function getAllShiKuang(time,recall){
        t.layerPlot.removeAllFeatures();
        var url= gsDataService + "services/DBService/getCalamity";
        $.ajax({
            data: {"para": "{ObservTimes:'"+time+"',type:0}"},
            url: url,
            dataType: "json",
            success: function (data) {
                t.runFlag = true;
                if(data != null&&data.length != 0){
                    for(var i=0;i<data.length;i++){
                        if(typeof (data[i].EleName) == "undefined"){
                            data[i]["EleName"] = "雨量";
                        }
                    }
                    displayShiKuang(data);
                }
                recall&&recall(data);
            },
            error:function(data){
                if(t.runFlag){
                    alertModal("获取实况信息出错!");
                }
                t.runFlag = false;
            },
            type: "POST"
        });
    }

    //查询时间段内实况
    function getAllShiKuangByTimes(){
        var ObservTimesStart = t.myDateSelecter1.getCurrentTime(false);
        var ObservTimesEnd = t.myDateSelecter2.getCurrentTime(false);
        var time1 = t.myDateSelecter1.getCurrentTime(true).substr(0,11)+t.myDateSelecter1.getCurrentTime(true).substr(12,3);
        var time2 = t.myDateSelecter2.getCurrentTime(true).substr(0,11)+t.myDateSelecter2.getCurrentTime(true).substr(12,3);
        t.layerPlot.removeAllFeatures();
        var url=gsDataService + "services/DBService/getCalamityByTimes";
        $.ajax({
            data: {"para": "{ObservTimesStart:'"+ObservTimesStart+"',ObservTimesEnd:'"+ObservTimesEnd+"',type:0}"},
            url: url,
            dataType: "json",
            success: function (data) {
                t.skData = {};
                for(var i=0;i<data.length;i++){
                    if(typeof (data[i].EleName) == "undefined"){
                        data[i]["EleName"] = "雨量";
                    }
                    if(data[i]["EleName"] == "闪电")
                        var time = data[i].ObservTimes-(data[i].ObservTimes%3600000);
                    else
                        var time = data[i].ObservTimes
                    if(typeof(t.skData[time]) == "undefined"){
                        t.skData[time] = []
                    }
                    t.skData[time].push(data[i]);
                }
                showQueryList();
                showPanel(data,time1,time2);
            },
            error:function(data){
                alertModal("获取实况信息出错!");
            },
            type: "POST"
        });
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

    //显示查询列表
    function showQueryList(){
        var content = "";
        var rhData = [];
        for(var name in t.ldData){
            for(var i=0;i< t.ldData[name].length;i++){
                if($.inArray(parseInt(t.ldData[name][i]), rhData)==-1)
                    rhData.push(t.ldData[name][i]);
            }
        }
        for(var time in t.skData){
            if($.inArray(parseInt(time), rhData)==-1)
                rhData.push(parseInt(time));
        }
        rhData.sort();
        for(var i=rhData.length-1;i>=0;i--){
            var nowDate = new Date(parseInt(rhData[i]));
            content += "<div value="+rhData[i]+">"+dateToTimes(nowDate)+"</div>";
        }
        /*var content = "";
        var skList = $("#skElement").find(".active");
        var skIDList = [];
        for(var i=0;i<skList.length;i++){
            skIDList.push($(skList[i]).html());
        }
        for(var time in t.skData){
            var flag = false;
            for(var i=0;i< t.skData[time].length;i++){
                if($.inArray(t.skData[time][i].EleName, skIDList)!=-1){
                    flag = true;
                    break;
                }
            }
            if(flag){
                var nowDate = new Date(parseInt(time));
                content += "<div>"+dateToTimes(nowDate)+"</div>";
            }
        }*/
        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function(){
            if($(this).hasClass("active"))
                return;
            clearAllElement();
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            for(var time in t.skData){
                var timeSK = parseInt($(this).attr("value"))-parseInt($(this).attr("value"))%3600000
                if(parseInt(time) == timeSK){
                    displayShiKuang(t.skData[time]);
                    var nowDate = new Date(parseInt(t.skData[time][0].ObservTimes));
                    var time1 = nowDate.getFullYear()+"年"+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+"月"+(Array(2).join(0)+nowDate.getDate()).slice(-2)+"日"+(Array(2).join(0)+nowDate.getHours()).slice(-2)+"时";
                    showPanel(t.skData[time] ,time1 ,time1)
                    break;
                }
            }
            if(typeof (t.ldData["radar_mcr"])!="undefined" && $.inArray(parseInt($(this).attr("value")), t.ldData["radar_mcr"])!=-1){
                displayRadar("radar_mcr",parseInt($(this).attr("value")));
            }
            if(typeof (t.ldData["radar_mvil"])!="undefined" &&$.inArray(parseInt($(this).attr("value")), t.ldData["radar_mvil"])!=-1){
                displayRadar("radar_mvil",parseInt($(this).attr("value")));
            }
            if(typeof (t.ldData["swan_titan"])!="undefined" && $.inArray(parseInt($(this).attr("value")), t.ldData["swan_titan"])!=-1){
                var nowDate = new Date(parseInt($(this).attr("value")));
                var time = dateToTimes(nowDate);
                GDYB.RadarDataClass.displayRadarData(null, "swan_titan", 0, time.substr(0,time.length-4));
            }
            if(typeof (t.ldData["swan_trec"])!="undefined" &&$.inArray(parseInt($(this).attr("value")), t.ldData["swan_trec"])!=-1){
                var nowDate = new Date(parseInt($(this).attr("value")));
                var time = dateToTimes(nowDate);
                GDYB.RadarDataClass.displayRadarData(null, "swan_trec", 0, time.substr(0,time.length-4));
            }
            if(typeof (t.ldData["Himawari-8_mcs"])!="undefined" &&$.inArray(parseInt($(this).attr("value")), t.ldData["Himawari-8_mcs"])!=-1){
                var nowDate = new Date(parseInt($(this).attr("value")));
                nowDate.setHours(nowDate.getHours()-8);
                var time = dateToTimes(nowDate);
                GDYB.AWXDataClass.display(null, "Himawari-8_mcs",time.substr(0,time.length-4));
            }
           /* var date = timesToDate($(this).html());
            displayShiKuang(t.skData[date.getTime()]);*/
            refreshTitleDiv();
        });
        if($("#timeListDiv").find("div").length!=0){
            var allPre = {};
            var allData = [];
            for(var time in t.skData){
                var list = t.skData[time];
                for(var i=0;i< list.length;i++){
                    if(list[i].EleName == "雨量"){
                        if(typeof (allPre[list[i].StaID]) == "undefined"){
                            allPre[list[i].StaID] = list[i];
                        }
                        else{
                            allPre[list[i].StaID].Val += list[i].Val;
                        }
                    }
                    else{
                        allData.push(list[i]);
                    }
                }
            }
            for(var obj in allPre){
                if(allPre[obj].Val < 10){
                    allPre[obj]["LvlID"] = 1;
                }
                else if(allPre[obj].Val < 25){
                    allPre[obj]["LvlID"] = 2;
                }
                else if(allPre[obj].Val < 50){
                    allPre[obj]["LvlID"] = 3;
                }
                else if(allPre[obj].Val >= 50){
                    allPre[obj]["LvlID"] = 4;
                }
                allData.push(allPre[obj]);
            }
            displayShiKuang(allData);
        }
    }
    //轮询
    function getAllShiKuangRealTime(){
        if(t.realTime){
            getNewShiKuang()
        }
        setTimeout(function(){
            if(t.realTime&&GDYB.Page.curPage == GDYB.QDLRHJCPage)
                getAllShiKuangRealTime();
        },1000*60*5);
    }
    //获取最新实况
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

    //显示雷达
    function displayRadar(name,times){
        var radarParam = getRadarParam(name,times);
        var options = {useCanvas:true,isBaseLayer:false};
        t.layer = new WeatherMap.Layer.Image(
            name,
            radarParam.url,
            radarParam.bounds ,
            options
        );
        t.layer.setOpacity(0.7);
        t.layer.transparentColors = t.color[name];
        clearRadarLayer(name);
        GDYB.Page.curPage.map.addLayer(t.layer);
        //GDYB.Page.curPage.map.setLayerIndex(t.layerPlot,99);
    }

    //判断url是否存在
    function getUrlExists(url,recall) {
        $.ajax({
            type: "GET",
            async: false,
            cache: false,
            url: url,
            data: "",
            success: function() {
                recall(true);
            },
            error: function() {
                recall(false);
            }
        });

    }

    //获取雷达路径参数
    function getRadarParam(name,times){
        var nowDate = new Date(times);
        nowDate.setHours(nowDate.getHours()-8);
        var time = nowDate.getFullYear() + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + (Array(2).join(0)+nowDate.getDate()).slice(-2) + (Array(2).join(0)+nowDate.getHours()).slice(-2) +(Array(2).join(0)+nowDate.getMinutes()).slice(-2) +(Array(2).join(0)+0).slice(-2);
        var url = imgCacheUrl;
        var bounds = null;
        var boundsList = qdlldBounds[name];
        bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
        var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
        url += qdlldUrl[name];
        url = url.replace("time",time).replace("time",time).replace("bounds",boundsStr);
        return {url:url,bounds:bounds};
    }
    //获取带time的雷达地址
    function getRadarUrl(name){
        if(name == "radar_mcr" || name == "radar_mvil"){
            var url = "D:/Tomcats/apache-tomcat-gdyb-dataservice/webapps/cache";
            var boundsList = qdlldBounds[name];
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[name];
            url = url.replace("bounds",boundsStr);
        }
        else if(name == "swan_titan" || name == "swan_trec"){
            var url = qdlldUrl[name];
        }
        else{
            var url = qdlytUrl[name];
        }
        return url;
    }

    //查询雷达时间序列
    function getRadarTimes(name){
        var time1 = t.myDateSelecter1.getCurrentTime();
        var time2 = t.myDateSelecter2.getCurrentTime();
        var format = "yyyyMMddHHmmss";
        if(name == "Himawari-8_mcs"){
            format = "yyyyMMdd_HHmm";
            time1 = time1.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"_");
            time2 = time2.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"_");
            time1 = time1.substr(0,time1.length-2);
            time2 = time2.substr(0,time2.length-2);
        }
        else{
            time1 = time1.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
            time2 = time2.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
        }

        var paraUrl = getRadarUrl(name);

        //var paraUrl = "http://127.0.0.1:8080/testData/MCR/Z_OTHE_RADAMCR_time.bin_Z_OTHE_RADAMCR_time_0.0_91_32_110_43.png";
        var url=gsDataService + "services/DBService/getRadarByTimes";
        $.ajax({
            type: "POST",
            data: {"para": "{time1:'" + time1 + "',time2:'" + time2 + "',url:'" + paraUrl + "',format:'"+format+"'}"},
            url: url,
            dataType: "json",
            error:function(data){
                alertModal("查询雷达出错!");
            },
            success: function (data) {
                t.ldData[name] = data;
                showQueryList();
            }
        });
    }

    //最新雷达 无数据则往前推10次
    function getNewRadar(name,num ,time){
        var times = null;
        if(num == 0){
            clearRadarLayer(name);
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%6);
            times = nowDate.getTime();
        }
        else{
            times = time;
        }
        if(num<10){
            var radarParam = getRadarParam(name,times);
            getUrlExists(radarParam.url,function(exist) {
                if (!exist) {
                    num++;
                    getNewRadar(name,num,times-6*60*1000);
                }
                else{
                    var nowDate = new Date(times);
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    displayRadar(name,times);
                }
            });
        }
    }

    //清除雷达图层
    function clearRadarLayer(name){
        if(typeof (name) == "undefined"){
            var mcrList = GDYB.Page.curPage.map.getLayersByName("radar_mcr");
            var mvilList = GDYB.Page.curPage.map.getLayersByName("radar_mvil");
            Array.prototype.push.apply(mcrList, mvilList);
            var radarList = mcrList;
        }
        else{
            var radarList = GDYB.Page.curPage.map.getLayersByName(name);
        }
        if(radarList){
            for(var i=0;i<radarList.length;i++){
                GDYB.Page.curPage.map.removeLayer(radarList[i]);
                radarList[i].destroy();
            }
        }
    }

    function dateToTimes(nowDate){
        return nowDate.getFullYear()+"-"+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+"-"+(Array(2).join(0)+nowDate.getDate()).slice(-2)+" "+(Array(2).join(0)+nowDate.getHours()).slice(-2)+":"+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2)+".000";
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
        t.layerPlot.removeAllFeatures();
        clearRadarLayer();
        GDYB.RadarDataClass.clearRadarData("swan_titan");
        GDYB.RadarDataClass.clearRadarData("swan_trec");
        GDYB.AWXDataClass.clearMCS();
    }

    function getRadarData(name,times,num){
        if(typeof(times) == "undefined"){
            var nowDate = new Date();
            nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%6,0,0);
        }
        else
            var nowDate = new Date(times);
        var time = nowDate.getFullYear() +"-"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"-"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +" "+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +":"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
        GDYB.RadarDataClass.getRadarData(function(data){
            if(data.length == 0){
                if(typeof (num) == "undefined")
                    getRadarData(name,nowDate.getTime()-6*60*1000,1);
                else if(num<10)
                    getRadarData(name,nowDate.getTime()-6*60*1000,num+1);
                return;
            }
            else{
                GDYB.RadarDataClass.displayRadarData(null, name, 0, time);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, name, 0, time);
    }

    //获取最新时效mcs
    function getMCS(times,num){
        if(typeof(times) == "undefined"){
            var nowDate = new Date();
            nowDate.setHours(nowDate.getHours()-8);
            nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%10,0,0);
        }
        else
            var nowDate = new Date(times);
        var time = nowDate.getFullYear() +"-"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"-"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +" "+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +":"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
        GDYB.AWXDataClass.display(function(data){
            if(data.length == 0){
                if(typeof (num) == "undefined")
                    getMCS(nowDate.getTime()-10*60*1000,1);
                else if(num<10)
                    getMCS(nowDate.getTime()-10*60*1000,num+1);
                return;
            }
            else{
                nowDate.setHours(nowDate.getHours()+8);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, "Himawari-8_mcs", time);
    }

    //显示图例
    function addLegend(radarName){
        //图例
        if(radarName == "radar_mcr"){
            var heatMapStyle = heatMap_MCR35Styles;
            var colors = [{r:0,g:172,b:164},{r:192,g:192,b:254},{r:122,g:114,b:238},{r:30,g:38,b:208},{r:166,g:254,b:168},{r:0,g:234,b:0},{r:16,g:146,b:26}];
            var legend = GDYB.Legend1;
        }
        else if(radarName == "radar_mvil"){
            var heatMapStyle = heatMap_MCRStyles;
            var colors = [];
            var legend = GDYB.Legend;
        }
        else{
            var heatMapStyle = null;
        }
        if(heatMapStyle != null){
            if(t.color[radarName].length == 0)
                t.color[radarName] = colors;
            legend.update(heatMapStyle);
            //注册点击事件
            $("#"+legend.name).find("div").click(function(){
                colors = [];
                if(radarName == "radar_mcr")
                    colors = [{r:0,g:172,b:164},{r:192,g:192,b:254},{r:122,g:114,b:238},{r:30,g:38,b:208},{r:166,g:254,b:168},{r:0,g:234,b:0},{r:16,g:146,b:26}];
                var layer = GDYB.Page.curPage.map.getLayersByName(radarName)[0];
                if(layer == null)
                    return;
                var styles = legend.styles;
                var legenItemValue = Number($(this).attr("tag"));
                var bvisible = typeof(this.attributes["visible"]) == "undefined" || this.attributes["visible"].value == "true";
                if(bvisible)
                {
                    $(this).css("background-color", "rgb(255, 255, 255)");
                    $(this).attr("visible", "false");
                }
                else
                {
                    var rgb = legend.items[legenItemValue];
                    $(this).css("background-color", rgb);
                    $(this).attr("visible", "true");
                }

                for(var key in styles) {
                    var style = styles[key];
                    var value = Math.floor(style.end * 10) / 10;
                    if(value == legenItemValue)
                    {
                        style["visible"] = !bvisible;
                    }
                    if(typeof(style["visible"]) != "undefined" && !style["visible"])
                        colors.push({r:style.startColor.red,g:style.startColor.green,b:style.startColor.blue});
                }
                t.color[radarName] = colors;
                layer.transparentColors = colors;
                layer.redraw();
            });
        }
    }

    //隐藏图例
    function hiddenLegend(radarName){
        var legend;
        if(radarName == "radar_mcr"){
            legend = GDYB.Legend1;
        }
        else if(radarName == "radar_mvil"){
            legend = GDYB.Legend;
        }
        legend.update(null);
    }

    function showPanel(data ,time1 ,time2){
        var tjObject = {"大风":[],"短时强降水":[],"冰雹":[],"闪电":[],"雨量":[]};
        for(var i=0;i<data.length;i++){
            if(data[i]["EleName"] != "闪电" && data[i]["EleName"] != "雷暴" && (data[i].StaID.substr(0,1) == "5" || data[i].StaID.substr(0,1) == "W"))
                tjObject[data[i].EleName].push(data[i]);
        }
        var contentTable = "<table border='1'  bordercolor='#969696'><tr><th>类别</th><th>站次</th><th>最强</th><th>出现时间</th></tr>";
        var contentDiv = "<div id='ystjContentDiv' style='overflow: auto;height: 60%;border: 1px solid rgb(150,150,150);padding: 10px;'>"+time1+"至"+time2+",";
        var num = 1;
        var showTable = false;
        for(var obj in tjObject){
            var maxNum = 0;
            var maxObj = null;
            if(tjObject[obj].length != 0){
                num ++;
                contentTable += "<tr><td>"+obj+"</td><td>"+tjObject[obj].length+"</td>";
                if(obj == "短时强降水" || obj == "大风" || obj == "冰雹"){
                    contentDiv += obj+"出现"+tjObject[obj].length+"站，分别为：";
                    for(var i=0;i<tjObject[obj].length;i++){
                        var date = new Date(tjObject[obj][i].ObservTimes);
                        contentDiv += tjObject[obj][i].area+tjObject[obj][i].StaName+date.getDate()+"日"+date.getHours()+"时"+tjObject[obj][i].Val+",";
                        if(maxNum<tjObject[obj][i].Val){
                            maxNum = tjObject[obj][i].Val;
                            maxObj = tjObject[obj][i];
                        }
                    }
                    contentDiv = contentDiv.substr(0,contentDiv.length-1);
                    contentDiv += "。";
                    if(maxObj != null){
                        var date = new Date(maxObj.ObservTimes);
                        contentTable +="<td>"+maxObj.StaName+"("+maxNum+")</td><td>"+date.getDate()+"日"+date.getHours()+"时</td></tr>";
                    }
                    else{
                        contentTable +="<td></td><td></td></tr>";
                    }
                    showTable = true;
                }
                else{
                    for(var i=0;i<tjObject[obj].length;i++){
                        if(maxNum<Math.abs(tjObject[obj][i].Val)){
                            maxNum = Math.abs(tjObject[obj][i].Val);
                            maxObj = tjObject[obj][i];
                        }
                    }
                    var date = new Date(maxObj.ObservTimes);
                    if(obj == "闪电")
                        contentTable +="<td>("+maxObj.Val+")</td><td>"+date.getDate()+"日"+date.getHours()+"时</td></tr>";
                    else
                        contentTable +="<td>"+maxObj.StaName+"("+maxNum.toFixed(2)+")</td><td>"+date.getDate()+"日"+date.getHours()+"时</td></tr>";
                }
            }
        }
        contentTable += "</table>";
        contentDiv += "</div>";
        if(showTable){
            t.myPanel_YSTJ.panel.find(".ystjContent").html(contentTable+contentDiv);
            $("#ystjContentDiv").css("height",222-num*21);
        }
        else{
            t.myPanel_YSTJ.panel.find(".ystjContent").html("");
        }
        t.myPanel_YSTJ.panel.css("display","block");
    }
}
QDLRHJCPageClass.prototype = new PageBase();