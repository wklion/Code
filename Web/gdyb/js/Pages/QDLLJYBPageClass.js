/**
 * Created by Administrator on 2016/5/11.
 */


function QDLLJYBPageClass(){
    var t = this;
    this.currentType = null;
    this.currentElement = null;
    this.currentHourSpan = 2;
    this.datasetGrid = null; //格点数据
    this.datasetGridInfos = null; //格点产品信息
    this.layerFillRangeColor = null; //格点图层
    this.layerLuoqu = null;    //落区图层
    this.drawLuoqu = null;     //画落区
    this.areas = null; //行政区划
    this.layerArea = null; //地区图层
    this.isMaking = false; //是否正在制作预警，制作过程中，不在更新地图，以免覆盖
    this.currentIntervalID = null;
    this.layerPlot = null;
    this.bbLayer = null;
    this.runFlag = true;
    this.yubaoshixiaoTools = null;
    this.layerSignal = null; //预警信号图层
    this.micapsDataClassSteam = null;//水汽
    this.micapsDataClassInstable = null;//不稳定条件
    this.micapsDataClassUplift = null;//抬升条件
    this.micapsDataClassSpecial = null;//特殊层
    this.micapsDataClassHour = null;//1小时预报
    this.drawPoint = null;//画点
    this.drawLayer = null;//画点图层
    this.iconLayer = null;//显示图标图层
    this.color = {radar_mcr:[],radar_mvil:[],grapes_3km_cr:[],physic:[]};
    this.departNames = [];
    t.time = 24;
    t.alertAreasLayer=null;
    this.hailFeatures=[];
    this.lzModel = ["physic_CAPE","physic_CIN","physic_K","physic_LI","physic_RH","physic_DIV","physic_THESE","physic_Q"];
    this.hdModel = ["physic_CAPE","physic_CIN"];
    this.newRaderDataTime = null;

    this.renderMenu = function() {
        var htmlStr = ""
            +"<div id='backgroundDiv' style='margin:0;'>"
                +"<div id='qtq'>"
                    +"<div class='btn_line3 menuDiv_bottom1' style='margin-top:15px;'>"
                        + "<div class='qdlTitleBar'>实况：</div>"
                        +"<div class='qdlContentDiv'><button id='ljyb_sk' class='active'>强天气</button><button id='radar_mcr'>35dBZ</button><button id='swan_titan'>TITAN</button><button id='swan_trec'>TREC</button><button id='Himawari-8_mcs' >MCS</button></div>"
                        +"<div style='clear:both;'></div>"
                        +"<div class='qdlTitleBar'>短强：</div>"
                        +"<div class='qdlContentDiv'><button id='micaps_qpe'>QPE</button><button id='micaps_qpf'>QPF</button><button id='grapes_3km_cr'>1H反射率</button><div style='clear:both;'></div></div>"
                        +"<div class='qdlTitleBar'>冰雹：</div>"
                        +"<div class='qdlContentDiv'><button id='bb' >冰雹预警</button><button id='cr' >CR</button></div><div style='clear:both;'></div>"
                    +"</div><div style='clear:both;'></div>"
                    +"<div class='btn_line3' style='margin-top:10px;'>"
                        +"<div class='qdlTitleBar'>时间：</div>"
                        +"<div id='dateSelect' style='margin: 5px 0px 5px 15px;height: 26px;float:left;'><div style='clear:both;'></div></div>"
                    +"</div>"
                +"</div>"
                +"<div id='yubaoshixiao' class='' style='display:none;'></div>"
            +"</div>"
            +"<div id='xbyjForecastDiv' style='display: none;height: 100%;min-height: 830px;'>"
                +"<div style='width:95%;height: 30px;'><div id='div_YuBaoYuan' style='float: left;'><span style='float: left;line-height: 27px;margin-left: 10px;width: 60px;'>预报员：</span><div id='forecastor' class='menuDropDown' name='model' ><input class='inputYuBaoyuan' type='text'><div id='selectYuBaoYuan' class='selectYuBaoYuan'></div></div></div>"
                +"<div id='div_QianFaRen' style='margin-left: 15px;float: left;'><span style='float: left;line-height: 27px;'>签发人：</span><div id='issueor' class='menuDropDown' name='model' ><input class='inputYuBaoyuan' type='text'><div id='selectQianFaRen' class='selectYuBaoYuan'></div></div></div></div>"
                +"<div id='divIcon'>"
                    +"<span style='font-size: 14px;margin: 6px 0px 0px 10px;line-height: 21px;'>绘图：</span><img name='leibao' src='imgs/leibao.png' style='margin-left: 15px;cursor: pointer;'><img name='bingbao' src='imgs/bingbao.png' style='margin-left: 15px;cursor: pointer;'>"
                +"</div>"
                +"<div id='divElement' style='padding-top: 6px;'>"
                    +"<span style='font-size: 14px;margin-left: 10px;line-height: 21px;'>类型：</span><button id='stsp' class='active' value='2' style='margin-left: 15px'>雷暴</button><button id='ts' value='1' style='margin-left: 15px;'>短时强降水</button><button id='tsgh' value='3' style='margin-left: 15px;'>雷暴大风或冰雹</button>"
                +"</div>"
                +"<div id='divGridDistance' style='padding-top: 6px;'>"
                    +"<span style='font-size: 14px;margin-left: 10px;line-height: 21px;'>格距：</span><button  class='active' style='margin-left: 15px'>0.5</button><button style='margin-left: 10px;'>0.25</button><button style='margin-left: 15px;'>0.125</button>"
                +"</div>"
                +"<div style='padding-top: 10px;'>"
                    +"<textarea id='txtContent' style='width: 300px;height: 120px;margin-left: 20px;padding: 10px;background-color: rgb(1,46,76);border: 1px solid rgb(49,202,255);color:white;'></textarea>"
                    +"<button id='btnNew' style='margin-left: 85px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);'>创建预警</button><button id='btnPan' style='margin-left: 30px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);'>地图平移</button>"
                    +"<div style='margin-top: 10px;'><button id='btnCancel' style='margin-left: 85px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>放弃编辑</button><button id='btnSave' style='margin-left: 30px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>发布预警</button></div>"
                +"</div>"
                +"<div style='position:absolute;bottom:0px;width:100%;height: calc(100% - 320px);'>"
                    +"<div class='title1'>近期预警 <span class='moreForecast'>更多</span></div>"
                    +"<div id='divProductsOfRecent24H' style='min-height:120px;color: white;width: 300px;border: 1px solid rgb(49,202,255);margin: 10px 0px 0px 20px;overflow: auto;padding: 2px;max-height: calc(100% - 195px);'></div>"
                    +"<div id='divContent' style='width: 300px;max-height: 110px;overflow: auto; margin: 10px 0px 0px 20px;padding-bottom: 10px;color:white;'></div>"
                    +"<div style='margin: 10px 10px 0px 20px;padding: 10px 0px;border-top: 1px solid rgb(225, 225, 225);position: absolute;bottom: 0px;'><span id='divRead' title='已读'></span><span id='divUnread' title='未读' style='color: rgb(230,230,230);'></span></div>"
                +"</div>"
            +"</div>"
            +"<div id='yjxhForecastDiv' style='display: none;height: 100%;min-height: 900px;'>"
                +"<div id='yjxh_divElement' style='padding-top: 10px;'>"
                    +"<span style='font-size: 14px;margin-left: 20px;line-height: 21px;'>类型：</span><button id='ts' value='2' class='active' style='margin-left: 15px'>雷电</button><button id='hail' value='3' style='margin-left: 10px;'>冰雹</button>"
                    +"<img src='imgs/WarningIcon/雷电黄色.jpg' style='width: 60px;margin-right: 19px;float: right;'>"
                +"</div>"
                +"<div id='yjxh_divLevel' style='padding-top: 10px;'>"
                    +"<span style='font-size: 14px;margin-left: 20px;line-height: 21px;'>级别：</span><button value='1' class='active' style='margin-left: 15px'>黄色</button><button value='2' style='margin-left: 10px;'>橙色</button><button value='3' style='margin-left: 10px;'>红色</button>"
                +"</div>"
                +"<div style='padding-top: 10px;'>"
                    +"<textarea id='yjxh_txtContent' style='width: 300px;height: 155px;margin-left: 20px;margin-top: 10px;padding: 10px;background-color: rgb(1,46,76);border: 1px solid rgb(49,202,255);color:white;'></textarea>"
                    +"<button id='yjxh_btnNew' style='margin-left: 85px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>创建预警</button><button id='yjxh_btnSave' style='margin-left: 30px;width: 75px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>发布预警</button>"
                +"</div>"
                +"<div style='position:absolute;bottom:0px;width:100%;height: calc(100% - 300px);'>"
                    +"<div class='title1'>近期预警 <span class='moreForecast'>更多</span></div>"
                    +"<div id='yjxh_divProductsOfRecent24H' style='min-height:120px;color: white;width: 300px;border: 1px solid rgb(49,202,255);margin: 10px 0px 0px 20px;overflow: auto;padding: 2px;max-height: calc(100% - 195px);font-size:12px;'></div>"
                    +"<div id='yjxh_divContent' style='width: 300px;max-height: 110px;overflow: auto; margin: 10px 0px 0px 20px;padding-bottom: 10px;color:white;'></div>"
                    +"<div style='margin: 10px 10px 0px 20px;padding: 10px 0px;border-top: 1px solid rgb(225, 225, 225);position: absolute;bottom: 0px;'><span id='yjxh_divRead' title='已读'></span><span id='yjxh_divUnread' title='未读' style='color: rgb(230,230,230);'></span></div>"
                /*+"<div style='width: 300px;height: 230px;overflow: auto; margin-left:20px;'>"
                        +"<div id='yjxh_divMessage'></div>"
                    +"</div>"
                    +"<div class='chatDiv' style='width: 300px;position: absolute;bottom: 0px; margin-left:20px;'>"
                        +"<input id='yjxh_chat' placeholder='发表评论' class='chatInput' type='text'>"
                        +"<button style='background-color: rgb(62,183,46);color: #ffffff;width: 69px;height: 29px;margin-bottom: 10px;border-radius: 3px;'>发表</button>"
                    +"</div>"*/
                +"</div>"
            +"</div>"
            +"</div>";

        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change active'>背景场</div><div name='xbyj' class='menu_change'>现报预警</div><div id='messageNum_xbyj' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div id='messageNum_yjxh' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div>");

        t.myDateSelecter = new DateSelecter(0,1);
        t.myDateSelecter.intervalMinutes = 6; //6分钟
        $("#dateSelect").html(t.myDateSelecter.div);
        var nowDate = new Date();
        var min = nowDate.getMinutes();
        t.myDateSelecter.changeHours(min-min%6);
        $("#dateSelect").find("input").css("border","1px solid #31CAFF").css("box-shadow","none").css("color","#31CAFF");

        t.micapsDataClassSteam = new MicapsDataClass();
        t.micapsDataClassInstable = new MicapsDataClass();
        t.micapsDataClassUplift = new MicapsDataClass();
        t.micapsDataClassSpecial = new MicapsDataClass();
        t.micapsDataClassHour = new MicapsDataClass();

        showMessageNum("messageNum_ljyb");

        var iconcallbacks = {
            click: function(currentFeature){
                confirmModal("是否删除",function(){
                    t.iconLayer.removeFeatures([currentFeature])
                });
            }
        };

        $("#forecastor").hover(null,function(){
            $("#selectYuBaoYuan").css("display","none");
        });

        $("#forecastor").click(function(){
            $("#selectYuBaoYuan").css("display","block");
        });

        $("#issueor").hover(null,function(){
            $("#selectQianFaRen").css("display","none");
        });

        $("#issueor").click(function(){
            $("#selectQianFaRen").css("display","block");
        });
        $("#selectYuBaoYuan").html("");
        $("#selectQianFaRen").html("");
        var userName = GDYB.GridProductClass.currentUserName;
        if (userName == null){
            alertModal("请注意，您尚未登录！");
        }
        else{
            var param = '{"userName":'+userName+'}';
            $.ajax({
                type: 'post',
                url: userServiceUrl + "services/UserService/getForecastor",
                data: {'para': param},
                dataType: 'text',
                error: function () {
                    alertModal('获取预报员错误!');
                },
                success: function (data) {
                    if(data == "[]"){
                        alertModal("未查询到预报员");
                    }
                    else{
                        var forecastors = jQuery.parseJSON(data);
                        for(var key in forecastors){
                            var forecastor = forecastors[key];
                            $("#selectYuBaoYuan").append("<div>" + forecastor.name + "</div>");
                        }
                        $("#selectYuBaoYuan").find("div").click(function(){
                            $("#forecastor").find("input").val($(this).html());
                            $("#selectYuBaoYuan").find("div").css("background-color","");
                            $("#selectYuBaoYuan").find("div").css("color","");
                            $(this).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                        });
                        $("#forecastor").find("input").val($("#selectYuBaoYuan").find("div").eq(0).html());
                        $("#selectYuBaoYuan").find("div").eq(0).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                    }
                }
            });

            $.ajax({
                type: 'post',
                url: userServiceUrl + "services/UserService/getIssuer",
                data: {'para': param},
                dataType: 'text',
                error: function () {
                    alertModal('获取签发人错误!');
                },
                success: function (data) {
                    if(data == "[]"){
                        alertModal("未查询到签发人");
                    }
                    else{
                        var issuers = jQuery.parseJSON(data);
                        for(var key in issuers){
                            var issuer = issuers[key];
                            $("#selectQianFaRen").append("<div>" + issuer.name + "</div>");
                        }
                        $("#selectQianFaRen").find("div").click(function(){
                            $("#issueor").find("input").val($(this).html());
                            $("#selectQianFaRen").find("div").css("background-color","");
                            $("#selectQianFaRen").find("div").css("color","");
                            $(this).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                        });
                        $("#issueor").find("input").val($("#selectQianFaRen").find("div").eq(0).html());
                        $("#selectQianFaRen").find("div").eq(0).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                    }
                }
            });
        }

        //绘制雷暴、冰雹等图标
        var map = GDYB.Page.curPage.map;
        t.drawLayer = new WeatherMap.Layer.Vector("drawLayer");
        t.iconLayer = new WeatherMap.Layer.Vector("iconLayer",{renderers: ["Canvas"]});
        map.addLayers([t.drawLayer, t.iconLayer]);
        var selectFeature = new WeatherMap.Control.SelectFeature(t.iconLayer,
            {
                callbacks: iconcallbacks
            });
        selectFeature.id = "iconSelect";
        map.addControl(selectFeature);
        selectFeature.activate();
        //画点
        t.drawPoint = new WeatherMap.Control.DrawFeature(t.drawLayer, WeatherMap.Handler.Point, { multi: true});
        t.drawPoint.events.on({"featureadded": drawPointCompleted});
        map.addControl(t.drawPoint);
        $("#divIcon").find("img").click(function(){
            $("#divIcon").find(".imgActive").removeClass("imgActive");
            $(this).addClass("imgActive");
            stopDragMap();
            t.drawPoint.activate();
        });

        $("#chat").keydown(function(event){
            if (event.keyCode == 13) {
                var message = "";
                var productId = $("#divProductsOfRecent24H").find("div.active").attr("id");
                var productName = "xbyj";
                var updateTime = GDYB.Chat.getNowTimes();
                var content = $(this).val();
                var departName = GDYB.GridProductClass.currentUserDepart.departName;
                var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
                var userName = GDYB.GridProductClass.currentUserName;
                var showName = "null";
                message = '{"productId":"'+productId+'","productName":"'+productName+'","updateTime":"'+updateTime+'","content":"'+content+'","departName":"'+departName+'","departCode":"'+departCode+'","userName":"'+userName+'","showName":"'+showName+'"}';
                GDYB.Chat.sendMessage(message);
            }
        });
        $(".chatDiv").find("button").click(function(){
            var message = "";
            if(t.currentType == "signal"){
                var productId = $("#yjxh_divProductsOfRecent24H").find("div.active").attr("id");
                var productName = "yjxh";
            }
            else{
                var productId = $("#divProductsOfRecent24H").find("div.active").attr("id");
                var productName = "xbyj";
            }
            var updateTime = GDYB.Chat.getNowTimes();
            var content = $(this).prev().val();
            var departName = GDYB.GridProductClass.currentUserDepart.departName;
            var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
            var userName = GDYB.GridProductClass.currentUserName;
            var showName = "null";
            message = '{"productId":"'+productId+'","productName":"'+productName+'","updateTime":"'+updateTime+'","content":"'+content+'","departName":"'+departName+'","departCode":"'+departCode+'","userName":"'+userName+'","showName":"'+showName+'"}';
            GDYB.Chat.sendMessage(message);
        });
        $("#yjxh_chat").keydown(function(event){
            if (event.keyCode == 13) {
                var message = "";
                var productId = $("#yjxh_divProductsOfRecent24H").find("div.active").attr("id");
                var productName = "yjxh";
                var updateTime = GDYB.Chat.getNowTimes();
                var content = $(this).val();
                var departName = GDYB.GridProductClass.currentUserDepart.departName;
                var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
                var userName = GDYB.GridProductClass.currentUserName;
                var showName = "null";
                message = '{"productId":"'+productId+'","productName":"'+productName+'","updateTime":"'+updateTime+'","content":"'+content+'","departName":"'+departName+'","departCode":"'+departCode+'","userName":"'+userName+'","showName":"'+showName+'"}';
                GDYB.Chat.sendMessage(message);
            }
        });

        //预报时效
        this.yubaoshixiaoTools = new YuBaoshixiaoTools($("#yubaoshixiao"), this.myDateSelecter.getCurrentTimeReal());
        t.yubaoshixiaoTools.numbers = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72];
        t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
        regesterYuBaoShiXiaoEvent();

        $("#qtq").find("button").click(function(){
            var radarName = this.id;
            if($(this).hasClass("active")){
                $(this).removeClass("active");
                if(this.id == "ljyb_sk"){
                    t.layerPlot.removeAllFeatures();
                }
                else if(this.id == "radar_mcr" || this.id == "radar_mvil"||this.id == "micaps_qpe"||this.id == "micaps_qpf"){
                    clearRadarLayer(this.id);
                    hiddenLegend(radarName);
                }
                else if(this.id == "swan_titan" || this.id == "swan_trec"){
                    GDYB.RadarDataClass.clearRadarData(this.id);
                }
                else if(this.id == "Himawari-8_mcs"){
                    GDYB.AWXDataClass.clearMCS();
                }
                else if(this.id == "grapes_3km_cr"){
                    t.yubaoshixiaoTools.numbers = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72];
                    t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
                    regesterYuBaoShiXiaoEvent();
                    displayPhysic();
                    clearPhysic(this);
                }
                else if(this.id==="bb"){//清除
                    t.bbLayer.removeFeatures(t.hailFeatures);
                }
            }
            else{
                $(this).addClass("active");
                addLegend(radarName);
                if(this.id == "radar_mcr" || this.id == "radar_mvil"||this.id == "micaps_qpe"||this.id == "micaps_qpf"){
                    getNewRadar(this.id,0);
                    //displayRadar(this.id,t.myDateSelecter.getCurrentTimeReal().getTime()+ parseInt(t.myDateSelecter.getCurrentTime().split(":")[1])*60000);
                }
                else if(this.id == "ljyb_sk"){
                    getNewShiKuang();
                }
                else if(this.id == "swan_titan" || this.id == "swan_trec"){
                    getRadarData(this.id);
                }
                else if(this.id == "Himawari-8_mcs"){
                    getMCS();
                }
                else if(this.id == "grapes_3km_cr"){
                    t.yubaoshixiaoTools.numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];
                    t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
                    regesterYuBaoShiXiaoEvent();
                    getTimeOfLastData(displayGrapes);
                }
                else if(this.id==="bb"){
                    getBB();
                }
            }
        });

        $(".menu_changeDiv").find(".menu_change").click(function(){
            if($(this).hasClass("active"))
            return;
            $("#messageDivs").hide();
            $(".menu_changeDiv").find(".active").removeClass("active");
            $(this).addClass("active");
            if(t.layerArea != null)
                t.layerArea.removeAllFeatures();
            if($(this).html() == "背景场"){
                $("#backgroundDiv").css("display","block");
                $("#xbyjForecastDiv").css("display","none");
                $("#yjxhForecastDiv").css("display","none");
            }
            else if($(this).html() == "现报预警"){
                $("#backgroundDiv").css("display","none");
                $("#xbyjForecastDiv").css("display","block");
                $("#yjxhForecastDiv").css("display","none");
                t.currentType = "nowcast";
                if(t.layerSignal != null)
                    t.layerSignal.clearMarkers();
                init();
            }
            else{
                if(t.layerFillRangeColor != null){
                    map.removeLayer(t.layerFillRangeColor);
                    t.layerFillRangeColor = null;
                }
                $("#backgroundDiv").css("display","none");
                $("#xbyjForecastDiv").css("display","none");
                $("#yjxhForecastDiv").css("display","block");
                t.currentType = "signal";
                init();
            }
        });

        $(".moreForecast").click(function(){
            t.time += 48;
            queryProductsRecent24H();
        });

        t.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", {renderers: ["Plot"]});
        t.layerPlot.style = {
            fill : false
        };
        t.layerPlot.renderer.styles = plotStyles_rhjc;
        t.layerPlot.renderer.plotWidth = 0;
        t.layerPlot.renderer.plotHeight = 0;
        GDYB.Page.curPage.map.addLayers([t.layerPlot]);
        t.bbLayer = new WeatherMap.Layer.Vector("冰雹", {renderers: ["Plot"]});
        t.bbLayer.style = {fill : false};
        t.bbLayer.renderer.styles = plotStyles_rhjc;
        t.bbLayer.renderer.plotWidth = 0;
        t.bbLayer.renderer.plotHeight = 0;
        GDYB.Page.curPage.map.addLayers([t.bbLayer]);
        //plotStyles_rhjc[0].visible = false;

        //注册时效点击事件
        function regesterYuBaoShiXiaoEvent(){
            $("#yubaoshixiao").find("td").click(function () {
                displayPhysic();
                displayGrapes();
            });
        }
        //获取雷达数据最后一个文件的名称转时间格式
        function getTimeOfLastData(recall){
            var fileUrl = "T:/grapes_3km/cr";
            var url= gsDataService + "services/DBService/getLastFileName";
            $.ajax({
                data: {"para": "{url:'"+fileUrl+"'}"},
                url: url,
                dataType: "text",
                type: "POST",
                success: function (data) {
                    if(typeof(data) != "undefined" && data.length>0)
                    {
                        t.newRaderDataTime = "20"+data.substr(0,2)+"-"+data.substr(2,2)+"-"+data.substr(4,2)+" "+data.substr(6,2)+":00:00";
                        recall&&recall();
                    }
                },
                error: function(e){
                    alertModal("获取雷达数据出错："+ e.statusText);
                }
            });
        }

        function displayGrapes(){
            var hourspan = 3;
            if($("#yubaoshixiao").find("td.active").length == 0){
                hourspan = t.yubaoshixiaoTools.numbers[0];
                $("#yubaoshixiao").find("#" + t.yubaoshixiaoTools.numbers[0] + "h").addClass("active");
            }
            else{
                hourspan = $("#yubaoshixiao").find("td.active").html();
            }
            t.micapsDataClassHour.displayMicapsData(null, "grapes_3km_cr", 1000, t.newRaderDataTime/*"2016-05-16 08:00:00"*/, hourspan);
        }

        //点击物理量
        $("#physicDiv").find("button").click(function(){
            //t.myDateSelecter.setIntervalMinutes(60*6); //6小时一次
            if($(this).hasClass("disabled"))
                return;
            if($(this).hasClass("active")){
                clearPhysic(this);
                $(this).removeClass("active");
                hiddenLegend("physic");
                return;
            }
            var btnElementActive = $(this).parent().find("button.active");
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            displayPhysic(this);
            /*if(this.id == "physic_pw" || this.id == "physic_ki" || this.id == "physic_li" || this.id == "physic_cape" || this.id == "physic_H0C" || this.id == "physic_H20C"){
                $("#physicHeight").find("button").addClass("disabled");
            }
            else{
                $("#physicHeight").find("button.disabled").removeClass("disabled");
            }*/
            //updateTitle(this.textContent, 1000, t.myDateSelecter.getCurrentTime(false));
        });
        $("#model_type button").on("click",function(){
            $("#model_type button").removeClass("active");
            $(this).addClass("active");
            //禁用或不禁用
            var id = this.id;
            if(id===""){//所有不禁用
                $("#physicDiv button").removeClass("disabled");
            }
            else{
                var model =[];
                if(id==="lz"){
                    model = t.lzModel;
                }
                else{
                    model = t.hdModel;
                }
                //先全部禁用
                $("#physicDiv button").addClass("disabled");
                var size = model.length;
                for(var i=0;i<size;i++){
                    var modelName = model[i];
                    $("#"+modelName).removeClass("disabled");
                }
            }
            displayPhysic();
        });
        //高度选择
        $("#physicHeight").find("button").click(function(){
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#physicHeight").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            displayPhysic();
        });
        //时间选择事件
        t.myDateSelecter.input.change(function(){
            displayPhysic();
            $("#qtq").find("button.active").removeClass("active").click();
        });
        //时间选择事件
        t.myDateSelecter.leftBtn.click(function(){
            displayPhysic();
            $("#qtq").find("button.active").removeClass("active").click();
        });
        //时间选择事件
        t.myDateSelecter.rightBtn.click(function(){
            displayPhysic();
            $("#qtq").find("button.active").removeClass("active").click();
        });

        getNewShiKuang();

        //点击要素类型
        $("#divElement").find("button").click(function() {
            if ($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#divElement").find("button.active");
            if (btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            $(this).addClass("active");

            t.currentElement = {name:this.id, caption:this.innerHTML, value:parseInt(this.value)};
        });
        //预警信号点击类型
        $("#yjxh_divElement").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#yjxh_divElement").find("button.active").removeClass("active");
            $(this).addClass("active");
            if(this.id == "ts"){
                $("#yjxh_divLevel").find("button").eq(0).css("display","");
                $("#yjxh_divLevel").find("button").eq(0).click();
            }
            else{
                $("#yjxh_divLevel").find("button").eq(0).css("display","none");
                $("#yjxh_divLevel").find("button").eq(1).click();
            }
            showWarningImg();
            t.currentElement = {name:this.id, caption:this.innerHTML, value:parseInt(this.value)};
            //convertToText();

            $("#yjxh_txtContent").html("");
            startSelectStation();
        });
        //预警信号级别
        $("#yjxh_divLevel").find("button").click(function() {
            if ($(this).hasClass("active"))
                return;
            $("#yjxh_divLevel").find("button.active").removeClass("active");
            $(this).addClass("active");
            showWarningImg();
            //convertToText();

            $("#yjxh_txtContent").html("");
            startSelectStation();
        });

        //格点间距
        $("#divGridDistance").find("button").click(function(){
            if ($(this).hasClass("active"))
                return;
            var btnElementActive = $("#divGridDistance").find("button.active");
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            var map = GDYB.Page.curPage.map;
            if(t.isMaking){
                if($(this).html() == "0.5")
                    map.zoomTo(map.getZoom()>7?map.getZoom():7);
                else if($(this).html() == "0.25")
                    map.zoomTo(map.getZoom()>10?map.getZoom():10);
                else if($(this).html() == "0.125")
                    map.zoomTo(map.getZoom()>12?map.getZoom():12);
                $("#btnNew").click();
            }
        });

        //点击（预警信号）创建预警
        $("#yjxh_btnNew").click(function(){
            if(GDYB.GridProductClass.currentUserDepart == null){
                alertModal("请登录");
                return;
            }

            t.isMaking = true;
            startSelectStation();
        });

        function startSelectStation(){
            t.isMaking = true;
            t.editAction = 1;
            t.areaCodes = {2:{data:[],remark:""}};
            stopDrawLuoqu();
            if(t.layerFillRangeColor != null)
                t.layerFillRangeColor.setDatasetGrid(null);
            t.datasetGrid = null;
            if(t.layerSignal != null)
                t.layerSignal.clearMarkers();

            //添加地区图层
            if(t.layerArea == null){
                var map = GDYB.Page.curPage.map;
                t.layerArea = new WeatherMap.Layer.Vector("layerArea", {renderers: ["Canvas2"]});
                t.layerArea.style = {
                    strokeColor: "#a548ca",
                    strokeWidth: 2.0,
                    fillColor: "#0000ff",
                    fillOpacity: "0"
                };
                map.addLayers([t.layerArea]);

                t.selectFeature = new WeatherMap.Control.SelectFeature(t.layerArea,
                    {
                        callbacks: callbacks
                    });
                t.selectFeature.id = "stationSelect";
                map.addControl(t.selectFeature);
                t.selectFeature.activate();
            }
            GDYB.Page.curPage.map.setLayerIndex(t.layerArea,99);

            //下载市州、区县边界
            if(t.areas == null || t.areas.length == 0) {
                downAreas(function () {
                    showAreas();
                }, GDYB.GridProductClass.currentUserDepart.departCode.substr(0, 2), "cnty");
            }
            else{
                //恢复初始状态
                for (var key in t.areas) {
                    var feature = t.areas[key];
                    feature.style = {
                        strokeColor: "#a548ca",
                        strokeWidth: 2.0,
                        fillColor: "#0000ff",
                        fillOpacity: "0"
                    };
                    feature.attributes["value"] = 0;
                }
                t.layerArea.redraw();

                showAreas();
            }
        }

        function showAreas(){
            if(t.areas == null || t.areas.length == 0)
                return;
            if(t.layerArea == null){
                var map = GDYB.Page.curPage.map;
                t.layerArea = new WeatherMap.Layer.Vector("layerArea", {renderers: ["Canvas2"]});
                t.layerArea.style = {
                    strokeColor: "#a548ca",
                    strokeWidth: 2.0,
                    fillColor: "#0000ff",
                    fillOpacity: "0"
                };
                map.addLayers([t.layerArea]);

                t.selectFeature = new WeatherMap.Control.SelectFeature(t.layerArea,
                    {
                        callbacks: callbacks
                    });
                t.selectFeature.id = "stationSelect";
                map.addControl(t.selectFeature);
                t.selectFeature.activate();
            }

            t.layerArea.removeAllFeatures();
            var features = [];
            for(var key in t.areas)
                features.push(t.areas[key]);
            t.layerArea.addFeatures(features);
        };

        var callbacks={
            over: function(currentFeature){
            },

            click: function(currentFeature){
                if(!t.isMaking)
                    return;
                var color = null;
                for(var key in heatMap_CalamityStyles){
                    var style = heatMap_CalamityStyles[key];
                    if(style.start == t.currentElement.value){
                        color = style.startColor;
                        break;
                    }
                }
                if(color != null) {
                    currentFeature.style = {
                        strokeColor: "#a548ca",
                        strokeWidth: 2.0,
                        fillColor: "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")",
                        fillOpacity: "0.5"
                    };
                    currentFeature.attributes["value"] = t.currentElement.value;
                    t.layerArea.redraw();
                    if (t.areaCodes != null) {
                        var level = $("#yjxh_divLevel").find("button.active")[0].value;
                        var i=0;
                        for(i;i<t.areaCodes[t.currentHourSpan].data.length;i++){
                            if(t.areaCodes[t.currentHourSpan].data[i].code == currentFeature.attributes["CODE"]){
                                t.areaCodes[t.currentHourSpan].data[i].value = t.currentElement.value;
                                t.areaCodes[t.currentHourSpan].data[i].level = level;
                                break;
                            }
                        }
                        if(i>=t.areaCodes[t.currentHourSpan].data.length)
                            t.areaCodes[t.currentHourSpan].data.push({code:currentFeature.attributes["CODE"], value:t.currentElement.value, level:level});
                    }
                    if(t.layerSignal != null){
                        //t.layerSignal.clearMarkers();
                        var stationX = currentFeature.attributes["X"];
                        var stationY = currentFeature.attributes["Y"];
                        var size = new WeatherMap.Size(70,60);
                        var offset = new WeatherMap.Pixel(-(size.w/2), -size.h);
                        //var icon = new WeatherMap.Icon('imgs/marker.png', size, offset);
                        var icon = new WeatherMap.Icon($("#yjxh_divElement").find("img")[0].src, size, offset);
                        t.layerSignal.addMarker(new WeatherMap.Marker(new WeatherMap.LonLat(stationX,stationY),icon));
                    }
                    convertToText();
                }
            },
            out:function(currentFeature){
            }
        };

        //点击创建预警
        $("#btnNew").click(function(){
            if(GDYB.GridProductClass.currentUserDepart == null){
                alertModal("请登录");
                return;
            }

            t.isMaking = true;
            t.editAction = 0;
            var map = GDYB.Page.curPage.map;
            //添加落区图层
            if(t.layerLuoqu == null)
            {
                t.layerLuoqu = new WeatherMap.Layer.Vector("Luoqu");
                t.layerLuoqu.style = {
                    strokeColor: "#ff0000",
                    strokeWidth: 2.0,
                    fillColor: "#ff0000",
                    fillOpacity: "0"
                };
                map.addLayers([t.layerLuoqu]);
                t.drawLuoqu = new WeatherMap.Control.DrawFeature(t.layerLuoqu, WeatherMap.Handler.PolygonFree);
                map.addControl(t.drawLuoqu);
                t.drawLuoqu.events.on({"featureadded": drawCompleted});
            }
            t.layerLuoqu.removeAllFeatures();
            t.datasetGrid = null;
            t.datasetGrid = createDatasetGrid();
            t.layerFillRangeColor.setDatasetGrid(t.datasetGrid);
            startDrawLuoqu();

            //下载市州、区县边界
//            if(t.areas == null || t.areas.length == 0)
//                downAreas(null);
            if(t.areas == null || t.areas.length == 0) {
                downAreas(null, GDYB.GridProductClass.currentUserDepart.departCode.substr(0, 2), "cty");
            }
        });

        $("#btnPan").click(function(){
            var map = GDYB.Page.curPage.map;
            for(var i =0; i < map.events.listeners.mousemove.length; i++) {
                var handler = map.events.listeners.mousemove[i];
                if(handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag"){
                    handler.obj.active = true;
                }
            }

            for(var i=0;i< map.controls.length;i++) {
                if(map.controls[i].displayClass == "smControlDrawFeature"){
                    map.controls[i].deactivate();
                }
            }
        });

        $("#btnCancel").click(function(){
            if(t.layerFillRangeColor != null)
                t.layerFillRangeColor.setDatasetGrid(null);
            t.iconLayer.removeAllFeatures();
        });
//        function downAreas(recall){
//            t.areas = [];
//            var areaCodes = [6201, 6202, 6203, 6204, 6205, 6206, 6207, 6208, 6209, 6210, 6211, 6212, 6229, 6230];
//            var i=0;
//            function addGeoRegion(){
//                if(i>= areaCodes.length){
//                    recall&&recall();
//                    return;
//                }
//                getGeoRegion(function(){
//                    addGeoRegion();
//                }, areaCodes[i++]);
//            };
//            addGeoRegion();
//        }

        function downAreas(recall, areaCode, level){
            t.areas = [];
            var url=gridServiceUrl+"services/AdminDivisionService/getDivisionInfos";
            $.ajax({
                data: {"para": "{areaCode:'"+areaCode+"',level:'"+level+"'}"},
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if(typeof(data) != "undefined" && data.length>0)
                    {
                        for(var key in data)
                        {
                            var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(JSON.parse(data[key]));
                            feature.geometry.calculateBounds();
                            t.areas.push(feature);
                        }
                        recall&&recall();
                    }
                },
                error: function(e){
                    alertModal("获取行政区划边界失败："+ e.statusText);
                }
            });
        }

        //提交预警
        $("#btnSave").click(function(){
//            t.isMaking = false;
//            stopDrawLuoqu();
//            saveGridProduct(function(bsuccess){
//                if(bsuccess){
//                    alert("提交成功");
//                    queryProductsRecent24H();
//                }
//                else
//                    alert("提交失败");
//            }, t.datasetGrid);

            save();
        });

        $("#yjxh_btnSave").click(function(){
            save();
        });

        function save(){
            if(GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 4)
                return;
            t.isMaking = false;
            stopDrawLuoqu();

            var datasetGrid = null;
            var strAreaCodes = "";
            if(t.datasetGrid != null){
                datasetGrid = t.datasetGrid;
            }
            else if(t.areaCodes != null)
            {
                datasetGrid = createDatasetGrid();
                var areaCode = t.areaCodes[t.currentHourSpan];
                for(var key in areaCode.data){
                    strAreaCodes += areaCode.data[key].code+",";
                }
                if(strAreaCodes.length > 0)
                    strAreaCodes = strAreaCodes.substr(0, strAreaCodes.length-1);
            }

            var strElementAndLevel = "";
            var content = "";
            if(t.currentType == "nowcast")
                content = $("#txtContent").val();
            else if(t.currentType == "signal"){
                content = $("#yjxh_txtContent").val();
                content = content.replace(/\n/g, "\\n");
                strElementAndLevel = $("#yjxh_divElement").find("button.active")[0].innerHTML + " " + $("#yjxh_divLevel").find("button.active")[0].innerHTML;
            }

            var date = new Date();
            var makeTime = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
            saveGridProduct(function(bsuccess){
                if(bsuccess){
                    getNewCalamityGridInfos();
//                    queryProductsRecent();
                    queryProductsRecent24H();
                    if(t.currentType == "nowcast"){
                        canvas2Image(function(images){
                            if(images.length == 2) {
                                var name = "p_"+GDYB.GridProductClass.currentUserDepart.departCode+"_nowcast_"+date.getFullYear().toString().substr(2,2)+".*?.pdf";
                                var url = gridServiceUrl+"services/ForecastfineService/getForecastNum";
                                $.ajax({
                                    data: {"para": "{name:'"+name+"'}"},
                                    url: url,
                                    dataType: "json",
                                    success: function (data) {
                                        var num = 1;
                                        if(data != null)
                                            num = data;
                                        num++;
                                        var element = t.currentType;
                                        var version = "p";
                                        var type = GDYB.GridProductClass.currentUserDepart.departCode;
                                        var level = 1000;
                                        var yyMMddHHmm = (date.getFullYear() - 2000) + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + (Array(2).join(0) + date.getDate()).slice(-2) + (Array(2).join(0) + date.getHours()).slice(-2) + (Array(2).join(0) + date.getMinutes()).slice(-2);
                                        var yyMMddHH = (date.getFullYear() - 2000) + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + (Array(2).join(0) + date.getDate()).slice(-2) + (Array(2).join(0) + date.getHours()).slice(-2);
                                        var productName = getGridDatasetName(type, level, element, yyMMddHHmm, version, yyMMddHH, 24,num);
                                        var forecastor = $("#forecastor").find("input").val();
                                        var issueor = $("#issueor").find("input").val();
                                        if(forecastor == "" || issueor == ""){
                                            alertModal("请选择预报员和签发人");
                                            return;
                                        }
                                        var areaName = GDYB.GridProductClass.currentUserDepart.departName;
                                        var time = date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
                                        saveArchive(productName, content, images,forecastor,issueor,num,areaName,time);
                                        var url = gridServiceUrl+"services/ForecastfineService/insertArchiveProduct";
                                        $.ajax({
                                            type: "POST",
                                            data: {"para": "{gridProductId:"+bsuccess+",fileName:'"+productName+"'}"},
                                            url: url,
                                            dataType: "json",
                                            success: function (data) {

                                            }
                                        });
                                    },
                                    error:function(data){
                                    },
                                    type: "POST"
                                });
                            }
                        });
                    }
                    if(t.currentType == "signal"){
                        t.layerArea.removeAllFeatures();
                    }
                }
                else
                    alertModal("提交失败");
            }, makeTime, makeTime, 24, datasetGrid, content, strAreaCodes, strElementAndLevel);
        }

        function drawCompleted() {
            if (t.layerLuoqu.features.length > 0) {
                var feature = t.layerLuoqu.features[0];
                var geoRegion = feature.geometry;
                var dvalue = t.currentElement.value;
                if(dvalue != t.datasetGrid.noDataValue){
                    GDYB.GridProductClass.fillRegion(t.datasetGrid, geoRegion, dvalue, 0, t.currentElement.name, false);
                    t.layerFillRangeColor.refresh();

                    convertToText();
                }
                t.layerLuoqu.removeAllFeatures();
            }
            var areaLine = GDYB.GDYBPage.line;
            GDYB.GridProductClass.ridGridBeyondBounds(t.datasetGrid,areaLine);
            t.layerFillRangeColor.refresh();
        }

        function convertToText(){
            var strContent = "";
            if(t.areas != null && t.areas.length > 0) {
                if(t.editAction == 0){
                    var elements = [{name:"stsp", caption:"短时强降水",value:1},
                        {name:"ts", caption:"雷暴",value:2},
                        {name:"tsgh", caption:"雷暴大风或冰雹",value:3} ];
                    for (var keyOfElement in elements) {
                        var strArea = "";
                        for (var key in t.areas) {
                            var feature = t.areas[key];
                            if (GDYB.GridProductClass.contain(t.datasetGrid, feature.geometry, elements[keyOfElement].value))
                                strArea += feature.attributes["NAME"] + "、";
                        }
                        if (strArea.length > 0) {
                            strArea = strArea.substr(0, strArea.length - 1);
                            if (strContent.length > 0)
                                strContent += "，"
                            strContent += strArea + "等地将出现" + elements[keyOfElement].caption;
                        }
                    }
                    var date = new Date();
                    var maketime =  date.getFullYear() + "年" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+date.getDate()).slice(-2) + "日" + (Array(2).join(0)+date.getHours()).slice(-2) + "时" + (Array(2).join(0)+date.getMinutes()).slice(-2)+"分";
                    strContent = GDYB.GridProductClass.currentUserDepart.departName + maketime + "发布临近预报：预计未来2小时，"+strContent+"。请注意防范。";
                    $("#txtContent").val(strContent);
                }
                else{
                    var elements = [{name:"ts", caption:"雷电",value:2},
                        {name:"hail", caption:"冰雹",value:3} ];
                    for (var keyOfElement in elements) {
                        var strArea = "";
                        for (var key in t.areas) {
                            var feature = t.areas[key];
                            if(typeof(feature.attributes["value"]) != "undefined" && feature.attributes["value"] == elements[keyOfElement].value)
                                strArea += feature.attributes["NAME"] + "、";
                        }
                        if (strArea.length > 0) {
                            strArea = strArea.substr(0, strArea.length - 1);
                            if (strContent.length > 0)
                                strContent += "，"
                            strContent += strArea + "等地将出现" + elements[keyOfElement].caption+"天气";
                        }
                    }
                    var date = new Date();
                    var maketime =  date.getFullYear() + "年" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+date.getDate()).slice(-2) + "日" + (Array(2).join(0)+date.getHours()).slice(-2) + "时" + (Array(2).join(0)+date.getMinutes()).slice(-2)+"分";
                    var element = $("#yjxh_divElement").find("button.active")[0].innerHTML;
                    var level = $("#yjxh_divLevel").find("button.active")[0].innerHTML;
                    strContent = GDYB.GridProductClass.currentUserDepart.departName + maketime + "发布"+element+level+"预警：预计未来2小时，"+strContent+"。";


                    var measures = {
                        ts:{
                            1:"1.政府及相关部门按照职责做好防雷工作；\n2.密切关注天气，尽量避免户外活动。",
                            2:"1.政府及相关部门按照职责落实防雷应急措施；\n2.人员应当留在室内，并关好门窗；\n3.户外人员应当躲入有防雷设施的建筑物或者汽车内；\n4.切断危险电源，不要在树下、电杆下、塔吊下避雨；\n5.在空旷场地不要打伞，不要把农具、羽毛球拍、高尔夫球杆等扛在肩上。",
                            3:"1.政府及相关部门按照职责做好防雷应急抢险工作；\n2.人员应当尽量躲入有防雷设施的建筑物或者汽车内，并关好门窗；\n3.切勿接触天线、水管、铁丝网、金属门窗、建筑物外墙，远离电线等带电设备和其他类似金属装置；\n4.尽量不要使用无防雷装置或者防雷装置不完备的电视、电话等电器；\n5.密切注意雷电预警信息的发布。"
                    },
                        hail:{
                            2:"1.政府及相关部门按照职责做好防冰雹的应急工作；\n2.气象部门做好人工防雹作业准备并择机进行作业；\n3.户外行人立即到安全的地方暂避；\n4.驱赶家禽、牲畜进入有顶蓬的场所，妥善保护易受冰雹袭击的汽车等室外物品或者设备；\n5.注意防御冰雹天气伴随的雷电灾害。",
                            3:"1.政府及相关部门按照职责做好防冰雹的应急和抢险工作；\n2.气象部门适时开展人工防雹作业；\n3.户外行人立即到安全的地方暂避；\n4.驱赶家禽、牲畜进入有顶蓬的场所，妥善保护易受冰雹袭击的汽车等室外物品或者设备；\n5.注意防御冰雹天气伴随的雷电灾害。"
                        }};
                    element = $("#yjxh_divElement").find("button.active")[0].id;
                    level = $("#yjxh_divLevel").find("button.active")[0].value;
                    var strMeasures = measures[element][level];
                    strContent+="\n防范措施：\n"+strMeasures;

                    $("#yjxh_txtContent").val(strContent);
                }
            }
        }

        function createDatasetGrid(){
            var left = 92;
            var top = 43;
            var right = 109;
            var bottom = 32;
            var gridDis = parseFloat($("#divGridDistance").find("button.active").html());
            var rows = (top-bottom)/gridDis;
            var cols = (right-left)/gridDis;
            var defaultValue = 0;
            var datasetGrid = new WeatherMap.DatasetGrid(left, top, right, bottom, rows, cols);
            datasetGrid.noDataValue = -9999;
            var grid = [];
            for(var i=0;i<rows;i++){
				for(var j=0;j<cols;j++){
					grid.push(defaultValue);
				}
			}
            datasetGrid.grid = grid;
            datasetGrid.dMin = defaultValue;
            datasetGrid.dMax = defaultValue;
            return datasetGrid;
        }

        function getGeoRegion(recall, areaCode){
            var url=gridServiceUrl+"services/AdminDivisionService/getDivisionInfo";
            $.ajax({
                data: {"para": "{areaCode:'"+areaCode+"'}"},
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if(typeof(data) != "undefined")
                    {
                        var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(data);
                        feature.geometry.calculateBounds();
                        t.areas.push(feature);
                        recall&&recall();
                    }
                },
                error: function(e){
                    alertModal("获取行政区划边界失败："+ e.statusText);
                }
            });
        }

        function queryProductsRecent24H(){
            var date = new Date();
            var maketimeEnd = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
            var time = date.getTime();
            time -= t.time*60*60*1000;
            date.setTime(time);
            var maketimeStart = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
            getCalamityGridInfos(function(data){
                if(typeof(data) != "undefined" && data.length > 0) {

                    //判断是否有新预警
                    var newID = false;
                    if(t.datasetGridInfos == null || t.datasetGridInfos.length == 0){
                        newID = true;
                    }
                    else {
                        for (var key in data) {
                            var i = 0;
                            for (i; i < t.datasetGridInfos.length; i++) {
                                if (data[key].id == t.datasetGridInfos[i].id)
                                    break;
                            }
                            if (i >= t.datasetGridInfos.length) {
                                newID = true;
                                break;
                            }
                        }
                    }

                    t.datasetGridInfos = data;
                    var html = "";
                    var divProductsOfRecent24H = null;
                    if(t.currentType == "nowcast")
                        divProductsOfRecent24H = $("#divProductsOfRecent24H");
                    else if(t.currentType == "signal")
                        divProductsOfRecent24H = $("#yjxh_divProductsOfRecent24H");
                    var indexId = divProductsOfRecent24H.find(".active").attr("id");
                    for (var key in t.datasetGridInfos) {
                        var info = t.datasetGridInfos[key];
                        var strElementTypeAndLevel = "";
                        if(t.currentType == "signal"){
                            var elementTypeAndLevels = info.nwpmodelTime.split(" ");
                            strElementTypeAndLevel = elementTypeAndLevels[0] + elementTypeAndLevels[1] +"预警";
                        }
                        var strMakeTime = info.makeTime.substr(5, 11);
                        /*if (parseInt(key) == 0)
                            html += "<div id='" + info.id + "' class='active' style='cursor: pointer;background-color:#da5'>" + strMakeTime + " " + info.forecaster + "发布"+strElementTypeAndLevel+"</div>"; //选中第一个
                        else{*/
							if(divProductsOfRecent24H != null && divProductsOfRecent24H.find("div[id="+info.id+"]").length!=0 && divProductsOfRecent24H.find("div[id="+info.id+"]").find("span").length!=0)
								html += "<div id='" + info.id + "' style='cursor: pointer;line-height: 25px;padding-left: 10px;'>" + strMakeTime + " " + info.forecaster + "发布"+strElementTypeAndLevel  +"<span style='color: white;border-radius: 100%;background-color: red;float: right;display: inline-block;height: 18px;width: 18px;text-align: center;line-height: 18px;' >"+ divProductsOfRecent24H.find("div[id="+info.id+"]").find("span").html()+"</span>" + "<img style='float:right;margin-right:5px' src='imgs/messageIcon.png' /></div>"
							else
								html += "<div id='" + info.id + "' style='cursor: pointer;line-height: 25px;padding-left: 10px;'>" + strMakeTime + " " + info.forecaster + "发布"+strElementTypeAndLevel   + "<img style='float:right;margin-right:5px' src='imgs/messageIcon.png' />"+"</div>";
						/*}*/
                            
                    }

                    if (html == "") {
                        $(".chatDiv").css("display", "none");
                    }
                    else {
                        $(".chatDiv").css("display", "");
                    }

                    if(t.currentType == "nowcast") {
                        $("#divProductsOfRecent24H").html(html);
                        $("#divProductsOfRecent24H").find("div").click(function () {
                            $("#divProductsOfRecent24H").find("div").css("background-color", "");
                            $("#divProductsOfRecent24H").find("div.active").removeClass("active");
                            $(this).css("background-color", "rgb(49,202,255)").addClass("active");
                            var id = this.id;
                            displayProduct(id);
                            displayStatus(id, true);
                            displayMessage(id);
                        });
                        $("#divProductsOfRecent24H").find("img").click(function () {
                            var id = $(this).parent()[0].id;
                            GDYB.Chat.productId = id;
                            GDYB.Chat.productName = t.currentType;
                            displayMessage(id);
                            $(this).parent().find("span").remove();
                            $(this).css("margin-right","25px");
                            $("#messageDivs").show();
                        });
                        $("#divProductsOfRecent24H").find("div").dblclick(function () {
                            var url = gridServiceUrl+"services/ForecastfineService/getArchiveProduct";
                            $.ajax({
                                type: "POST",
                                data: {"para": "{productId:"+parseInt($(this).attr("id"))+"}"},
                                url: url,
                                dataType: "json",
                                success: function (data) {
                                    if(data != null) {
                                        $("#pdf_modal_confirm_content").html("<iframe src='"+host+":8181/products/archive/"+data[0].fileName+".pdf' id='gnmxPdf' scrolling='no' style='position: absolute;z-index:99;background-color: #ffffff'  frameborder='0' width='100%' height='100%'></iframe>");
                                        $("#pdf_modal_confirm").modal();
                                    }
                                },
                                error: function (data) {
                                }
                            });
                        });
                    }
                    else if(t.currentType == "signal"){
                        $("#yjxh_divProductsOfRecent24H").html(html);
                        $("#yjxh_divProductsOfRecent24H").find("div").click(function () {
                            $("#yjxh_divProductsOfRecent24H").find("div").css("background-color", "");
                            $("#yjxh_divProductsOfRecent24H").find("div.active").removeClass("active");
                            $(this).css("background-color", "rgb(49,202,255)").addClass("active");
                            var id = this.id;
                            displayProduct(id);
                            displayStatus(id, true);
                        });
                        $("#yjxh_divProductsOfRecent24H").find("img").click(function () {
                            var id = $(this).parent()[0].id;
                            GDYB.Chat.productId = id;
                            GDYB.Chat.productName = t.currentType;
                            displayMessage(id);
                            $(this).parent().find("span").remove();
                            $(this).css("margin-right","25px");
                            $("#messageDivs").show();
                        });
                    }

                    if(divProductsOfRecent24H.find("div[id="+indexId+"]").length!=0){
                        displayProduct(indexId, false);//显示选中那个
                        divProductsOfRecent24H.find("div[id="+indexId+"]").addClass("active").css("background-color", "rgb(49,202,255)");
                    }
                    else{
                        displayProduct(t.datasetGridInfos[0].id, false); //显示第一个
                        divProductsOfRecent24H.find("div").eq(0).addClass("active").css("background-color", "rgb(49,202,255)");
                    }

                    if(newID)
                        $('#alertAudio')[0].play();
                }
            }, t.currentType, maketimeStart, maketimeEnd);
        };

        function getCalamityGridInfos(recall, element, maketimeStart, maketimeEnd){
            var url=gridServiceUrl+"services/GridService/getCalamityGridInfos";
            $.ajax({
                data: {"para": "{element:'"+element+"',maketimeStart:'" + maketimeStart + "',maketimeEnd:'" + maketimeEnd + "'}"},
                url: url,
                dataType: "json",
                success: function (data) {
                        recall&&recall(data);
                },
                type: "POST"
            });
        }

        function displayProduct(id){
            for(var key in t.datasetGridInfos){
                var info = t.datasetGridInfos[key];
                if(info.id == id){
                    if(info.element == "nowcast"){
                        $(".messageTitle").find("div").html("临近预报");
                    }else{
                        $(".messageTitle").find("div").html("预警信号");
                    }
                    $(".messageTitle").find("span").html(info.forecaster+info.forecastTime )
                    if(t.currentType == "nowcast"){
                        $("#divContent").html(info.remark);
                        var height = 310-parseInt($("#divContent").css("height"));
                        //$("#divMessage").parent().css("height",height+"px");
                        if(!t.isMaking) //正在制作预警时，不再地图上显示
                            getGrid(info.element, info.type, info.level, info.hourSpan, info.makeTime, info.version, info.forecastTime);
                    }
                    else if(t.currentType == "signal") {
                        $("#yjxh_divContent").html(info.remark);
                        var height = 350-parseInt($("#yjxh_divContent").css("height"));
                        $("#yjxh_divMessage").parent().css("height",height+"px");
                        if (!t.isMaking) //正在制作预警时，不再地图上显示
                        {
                            var areaCodes = info.nwpmodel.split(",");
                            var strElementAndLevel = info.nwpmodelTime.split(" ");
                            var element = strElementAndLevel[0];
                            var level = strElementAndLevel[1];
                            if (t.areas == null || t.areas.length == 0) {
                                downAreas(function () {
                                    updateLayerSignal(areaCodes, element, level);
                                }, GDYB.GridProductClass.currentUserDepart.departCode.substr(0, 2), "cnty");
                            }
                            else
                                updateLayerSignal(areaCodes, element, level);
                        }
                    }
                    break;
                }
            }
            displayStatus(id, false);
        }

        function updateLayerSignal(areaCodes, type, level) {
            if (t.layerSignal == null){
                t.layerSignal = new WeatherMap.Layer.Markers("layerSignal");
                GDYB.Page.curPage.map.addLayers([t.layerSignal]);
            }

            t.layerSignal.clearMarkers();
            for (var key in t.areas) {
                var feature = t.areas[key];
                var code = feature.attributes["CODE"];
                if(areaCodes.indexOf(code)>=0){
                    var stationX = feature.attributes["X"];
                    var stationY = feature.attributes["Y"];
                    var src = "imgs/WarningIcon/"+type+level+".jpg";
                    var size = new WeatherMap.Size(70,60);
                    var offset = new WeatherMap.Pixel(-(size.w/2), -size.h);
                    var icon = new WeatherMap.Icon(src, size, offset);
                    t.layerSignal.addMarker(new WeatherMap.Marker(new WeatherMap.LonLat(stationX,stationY),icon));
                }
            }
        }

        function displayMessage(id){
            var url=gridServiceUrl+"services/GridService/getProductSendInfo";
            $.ajax({
                data: {"para": "{productId:'" + id + "'}"},
                url: gridServiceUrl+"services/ForecastfineService/getForecastMessage",
                dataType: "json",
                type: "POST",
                success: function (data) {
                    var content = "";
                    for(var i=0;i<data.length;i++){
                        var className = "messageDetail";
                        var style = "margin-left: 20px;"
                        data[i].departName = data[i].departName.split("气象台")[0];
                        data[i].content = data[i].content.replace("000001","\n");
                        if(data[i].departCode == GDYB.GridProductClass.currentUserDepart.departCode){
                            className = "messageDetailMe";
                            style  = "text-align: right;margin-right: 20px;"
                            data[i].departName = "";
                        }
                        content += "<div style='margin-top: 5px;float: left;width: 100%;'>" +
                            "<div style='"+style+"color: rgb(128,128,128);'>"+ data[i].departName +" <span style='color: rgb(164,137,138);'>"+data[i].updateTime.split("-")[1]+"-"+data[i].updateTime.split("-")[2] + "</span></div>" +
                            "<div class='"+className+"'>"+data[i].content+"</div>" +
                            "</div>";
                    }
                    $("#divMessage").html(content);
                    $("#divMessage")[0].scrollTop = $("#divMessage")[0].scrollHeight;
                },
                error: function(e){

                }
            });
        }

        function displayStatus(id, needToUpdateStatus){
            var url=gridServiceUrl+"services/GridService/getProductSendInfo";
            $.ajax({
                data: {"para": "{productId:'"+id+"'}"},
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    t.departNames = ["兰州中心","兰州","嘉峪关","金昌","白银","天水","武威","张掖","平凉","酒泉","庆阳","定西","陇南","临夏","甘南"];
                    if(typeof(data) != "undefined")
                    {
                        var html = "";
                        var htmlW = "";
                        var read = false;
                        for(var key in data){
                            var info  = data[key];
                            /*html+="<div>"+info.receiveTime + " " + info.receiveDepartName + "（已读）</div>";*/
                            var departName = info.receiveDepartName.split("气象台")[0];
                            html = departName +" " +html;
                            htmlW = "<span>"+departName +"</span>" +htmlW;
                            t.departNames.splice(t.departNames.indexOf(departName),1)
                            if(info.receiveDepartCode == GDYB.GridProductClass.currentUserDepart.departCode)
                                read= true;
                        }
                        var unreadHtml = "";
                        var unreadHtmlW = "";
                        for(var i=0;i< t.departNames.length;i++){
                            unreadHtml += t.departNames[i] + " "
                            unreadHtmlW += "<span>"+t.departNames[i] + "(未读)</span>"
                        }
                        if(t.currentType == "nowcast"){
                            $("#divRead").html(html);
                            $("#divUnread").html(unreadHtml);
                            $("#divReadW").html(htmlW);
                            $("#divUnreadW").html(unreadHtmlW);
                            $(".messageUL").find("span").click(function(){
                                $("#chatText").val($("#chatText").val()+$(this).html().split("(")[0]+"、");
                            })
                        }
                        else if(t.currentType == "signal"){
                            $("#yjxh_divRead").html(html);
                            $("#yjxh_divUnread").html(unreadHtml);
                            $("#divReadW").html(htmlW);
                            $("#divUnreadW").html(unreadHtmlW);
                            $(".messageUL").find("span").click(function(){
                                $("#chatText").val($("#chatText").val()+$(this).html().split("(")[0]+"、");
                            })
                        }
                        //设置为已读
                        if(!read && needToUpdateStatus)
                            setStatus(id);
                    }
                },
                error: function(e){
                    alertModal("获取产品发送状态错误："+ e.statusText);
                }
            });
        }

        function setStatus(id){
            var info = null;
            for(var key in t.datasetGridInfos) {
                info = t.datasetGridInfos[key];
                if (info.id == id)
                    break;
            }
            if(info == null)
                return;

            var date = new Date();
            var receiveTime = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
            var remark = "";
            var url=gridServiceUrl+"services/GridService/saveProductSendInfo";
            $.ajax({
                data: {"para": "{productId:"+info.id+",sendFrom:'"+info.departCode+"',receiveDepartCode:'"+GDYB.GridProductClass.currentUserDepart.departCode
                    +"',receiveDepartName:'"+GDYB.GridProductClass.currentUserDepart.departName+"',receiveTime:'"+receiveTime+"',status:1,remark:'"+remark+"'}"},
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if(typeof(data) == "undefined" || !data)
                        alertModal("更新产品接收状态错误");
                    else{
                        displayStatus(id, false);
                        getNewCalamityGridInfos();
                    }
                },
                error: function(e){
                    alertModal("更新产品接收状态错误："+ e.statusText);
                }
            });
        }

        function getGrid(element, type, level, hourspan, maketime, version, datetime){
            GDYB.GridProductClass.getGrid(function(datasetGrid){
                if(t.layerFillRangeColor != null) {
                    t.layerFillRangeColor.setDatasetGrid(datasetGrid);
                    t.layerFillRangeColor.refresh();
                   /* var map = GDYB.Page.curPage.map;
                    if(datasetGrid.deltaX == 0.5){
                        map.zoomTo(map.getZoom()>7?map.getZoom():7);
                    }
                    else if(datasetGrid.deltaX == 0.25){
                        map.zoomTo(map.getZoom()>10?map.getZoom():10);
                    }
                    else if(datasetGrid.deltaX == 0.125){
                        map.zoomTo(map.getZoom()>12?map.getZoom():12);
                    }*/
                }
            }, element, type, level, hourspan, maketime, version, datetime, false);
        }

        function init(){
            t.isMaking = false;
            if(GDYB.GridProductClass.currentUserDepart == null)
                GDYB.GridProductClass.init();
            t.areas = null;
            if(t.currentType == "nowcast") {
                t.currentElement = {name: "stsp", caption: "雷暴", value: 2};
                //添加格点图层
                if (t.layerFillRangeColor == null) {
                    t.layerFillRangeColor = new WeatherMap.Layer.FillRangeColorLayer("layerFillRangeColor");
                    GDYB.Page.curPage.map.addLayers([t.layerFillRangeColor]);
                    t.layerFillRangeColor.isShowLabel = false;
                    t.layerFillRangeColor.isAlwaySmooth = false;
                    t.layerFillRangeColor.isSmooth = false;
                    t.layerFillRangeColor.items = heatMap_CalamityStyles;
                    t.layerFillRangeColor.alpha = 175;
                    GDYB.Legend3.update(t.layerFillRangeColor.items);
                    $("#div_legend_items3").find("div").css("width", "110px");
                }
            }
            else if(t.currentType == "signal"){
                t.currentElement = {name: "ts", caption: "雷电", value: 2};
                GDYB.Legend3.update(null);
                if(t.layerSignal == null)
                {
                    t.layerSignal = new WeatherMap.Layer.Markers("layerSignal",{renderers: ["Canvas2"]});
                    GDYB.Page.curPage.map.addLayers([t.layerSignal]);
                }
            }

            if(t.currentIntervalID != null){
                clearInterval(t.currentIntervalID);
                t.currentIntervalID = null;
            }
            queryProductsRecent24H();
            //轮询
            t.currentIntervalID = setInterval(function(){
                if(GDYB.Page.curPage != GDYB.QDLLJYBPage){
                    clearInterval(t.currentIntervalID);
                    return;
                }
                queryProductsRecent24H();
            }, 1000*10);
        }

        t.layerFillRangeColor = null;
        t.layerLuoqu = null;
        t.drawLuoqu = null;
    };

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
                    recall&&recall(data);
                }
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

    //获取最新实况
    function getNewShiKuang(){
        var time = t.myDateSelecter.getNowTime()+".000";
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
        var time = "";
        if(name==="micaps_qpe"||name==="micaps_qpf"){
            time = nowDate.getFullYear() + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + (Array(2).join(0)+nowDate.getDate()).slice(-2) + (Array(2).join(0)+nowDate.getHours()).slice(-2) +(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        }
        else{
            time = nowDate.getFullYear() + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + (Array(2).join(0)+nowDate.getDate()).slice(-2) + (Array(2).join(0)+nowDate.getHours()).slice(-2) +(Array(2).join(0)+nowDate.getMinutes()).slice(-2) +(Array(2).join(0)+0).slice(-2);
        }
        var url = imgCacheUrl;
        var bounds = null;
        var boundsList = qdlldBounds[name];
        bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
        var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
        url += qdlldUrl[name];
        url = url.replace("time",time).replace("time",time).replace("bounds",boundsStr);
        return {url:url,bounds:bounds};
    }

    //最新雷达 无数据则往前推四次
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
        if(num<6){
            var radarParam = getRadarParam(name,times);
            getUrlExists(radarParam.url,function(exist) {
                if (!exist) {
                    num++;
                    getNewRadar(name,num,times-6*60*1000);
                }
                else{
                    var nowDate = new Date(times)
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    displayRadar(name,times);
                }
            });
        }
    }

    //查询最新titan和trec
    function getRadarData(id,times,num){
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
                    getRadarData(id,nowDate.getTime()-6*60*1000,1);
                else if(num<10)
                    getRadarData(id,nowDate.getTime()-6*60*1000,num+1);
                return;
            }
            else{
                GDYB.RadarDataClass.displayRadarData(null, id, 0, time);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, id, 0, time);
    }

    //清除雷达图层
    function clearRadarLayer(name){
        var radarList = GDYB.Page.curPage.map.getLayersByName(name);
        if(radarList){
            for(var i=0;i<radarList.length;i++){
                GDYB.Page.curPage.map.removeLayer(radarList[i]);
            }
        }
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

    function clearElement(obj){

    }

    function clearAllElement(){

    }

    function displayPhysic(obj){
        if($("#yubaoshixiao").find("td.active").length == 0){
            hourspan = t.yubaoshixiaoTools.numbers[0];
            $("#yubaoshixiao").find("#" + t.yubaoshixiaoTools.numbers[0] + "h").addClass("active");
        }
        else{
            hourspan = $("#yubaoshixiao").find("td.active").html();
        }
        if(typeof (obj) != "undefined"){
            displayPhysicDetail(obj);
        }
        else{
            var list = $("#physicDiv").find("button.active");
            for(var i=0;i<list.length;i++){
                displayPhysicDetail(list[i]);
            }
        }
    }

    function displayPhysicDetail(obj){
        var model_type = $("#model_type button.active")[0].id;
        var id = obj.length>0?obj[0].id:obj.id;
        var newID = model_type==""?obj.id:model_type+"_"+obj.id;
        if($(obj).parent().attr("name") == "steam"){
            t.micapsDataClassSteam.displayMicapsData(function(){addLegend("physic");}, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if($(obj).parent().attr("name") == "instable"){
            t.micapsDataClassInstable.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if($(obj).parent().attr("name") == "uplift"){
            t.micapsDataClassUplift.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if($(obj).parent().attr("name") == "special"){
            t.micapsDataClassSpecial.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
    }

    function clearPhysic(obj){
        if($(obj).parent().attr("name") == "steam"){
            t.micapsDataClassSteam.layerFillRangeColor.setDatasetGrid(null);
            t.micapsDataClassSteam.layerFillRangeColor.refresh();
        }
        else if($(obj).parent().attr("name") == "instable"){
            t.micapsDataClassInstable.layerContour.removeAllFeatures();
        }
        else if($(obj).parent().attr("name") == "uplift"){
            t.micapsDataClassUplift.layerContour.removeAllFeatures();
        }
        else if($(obj).parent().attr("name") == "special"){
            t.micapsDataClassSpecial.layerContour.removeAllFeatures();
        }
        else if(obj.id == "grapes_3km_cr"){
            t.micapsDataClassHour.layerFillRangeColor.setDatasetGrid(null);
            t.micapsDataClassHour.layerFillRangeColor.refresh();
        }
    }
//    function saveGridProduct(recall, datasetGrid){
//        if(datasetGrid == null)
//            return;
//        if(GDYB.GridProductClass.currentUserName == null)
//            return;
//
//        var id = -1;
//        var subjective = 1;
//        var nwpModel = "";
//        var nwpModelTime = "";
//        var element = "nowcast"; //强对流要素名固定为：nowcast
//        var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
//        var userName = GDYB.GridProductClass.currentUserName;
//        var forecaster = GDYB.GridProductClass.currentUserDepart.departName;
//        var issuer = GDYB.GridProductClass.currentUserDepart.departName;
//        var hourSpan = 24;
//        var totalHourSpan = 24;
//        var version = "p";
//        var date = new Date();
//        var makeTime = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":00";
//        var forecastTime = makeTime;
//        var type = GDYB.GridProductClass.currentType;
//        var level = 1000;
//        var remark = $("#txtContent").val();
//
//        GDYB.GridProductClass.saveGridProductCommon(recall,datasetGrid,id,departCode,type,element,forecastTime,hourSpan,totalHourSpan,level,version,nwpModel,nwpModelTime,userName,forecaster,issuer,makeTime,subjective,remark);
//    }

    function saveGridProduct(recall, makeTime, forecastTime, hourSpan, datasetGrid, content, areaCodes, strElementAndLevel){
        if(datasetGrid == null)
            return;
        if(GDYB.GridProductClass.currentUserName == null)
            return;

        var id = -1;
        var subjective = 1;
        var nwpModel = areaCodes; //用这个字段来存吧
        var nwpModelTime = strElementAndLevel; //用这个字段保证预警信号类型和级别
        var element = t.currentType; //类型：临近预报-nowcast；预警信号-signal
        var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
        var userName = GDYB.GridProductClass.currentUserName;
        var forecaster = GDYB.GridProductClass.currentUserDepart.departName;
        var issuer = GDYB.GridProductClass.currentUserDepart.departName;
        var totalHourSpan = 24;
        var version = "p";
        var type = GDYB.GridProductClass.currentType;
        var level = 1000;
        var remark = content;//$("#yjqs_txtContent").val();

        GDYB.GridProductClass.saveGridProductCommon(recall,datasetGrid,id,departCode,type,element,forecastTime,hourSpan,totalHourSpan,level,version,nwpModel,nwpModelTime,userName,forecaster,issuer,makeTime,subjective,remark);
    }

    //启用绘制落区
    function startDrawLuoqu(){
        t.layerLuoqu.removeAllFeatures();
        t.drawLuoqu.activate();
        stopDragMap();
    }

    //禁用绘制落区
    function stopDrawLuoqu(){
        startDragMap();
        if(t.drawLuoqu != null)
            t.drawLuoqu.deactivate();
        if(t.layerLuoqu != null)
            t.layerLuoqu.removeAllFeatures();
    }

    //禁用地图拖拽
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

    //启用地图拖拽
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

    function showWarningImg(){
        var type = $("#yjxh_divElement").find("button.active").html();
        var color = $("#yjxh_divLevel").find("button.active").html();
        $("#yjxh_divElement").find("img").attr("src","imgs/WarningIcon/"+type+color+".jpg");
    }

    function drawPointCompleted(event) {
        var type = $("#divIcon").find(".imgActive").attr("name");
        var geometry = event.feature.geometry;
        t.drawLayer.removeAllFeatures();
        var geoVector = new WeatherMap.Feature.Vector(geometry);
        geoVector.style = {
            externalGraphic:'imgs/qdl/'+type+'.png',
            graphicWidth: 12,
            graphicHeight:12
        };
        t.iconLayer.addFeatures([geoVector]);
    }

    function getGridDatasetName(type, level, element, maketime, version, date, hour,num)
    {
        return "p_" + type + "_" + element + "_" + maketime + "_" + version + "_" + date + "_" + (Array(3).join(0)+hour).slice(-3) + "_" + level + "_" + num;
    }

    function saveArchive(productName, content, images,forecastor,issueor,num,areaName,time){
        var url=  archiveService + "services/ArchiveService/createProduct";
        $.ajax({
            data: {"para": "{templateName:'nowcast.ftl',productName:'" + productName + ".doc',forecastor:'"+forecastor+"',issueor:'"+issueor+"',num:'"+num+"',areaName:'"+areaName+"',time:'"+time+"',content:'" + content + "',img_real:'"+images[0]+"',img_forecast:'"+images[1]+"'}"},
            url: url,
            dataType: "json",
            success: function (data) {
                if(data)
                    alertModal("文档生成成功");
                else
                    alertModal("文档生成失败");
            },
            error:function(data){
            },
            type: "POST"
        });
    }

    function canvas2Image(callback){
        var images = [];
        var productLayers = [t.layerFillRangeColor, t.layerArea,t.layerSignal];
        //测试地图输出图片
        var map = GDYB.Page.curPage.map;
        var size = map.getCurrentSize();
        var productName = $(".menu_changeDiv").find(".active").attr("name");
        var memCanvas = document.createElement("canvas");
        memCanvas.width = size.w;
        memCanvas.height = size.h;
        memCanvas.style.width = size.w+"px";
        memCanvas.style.height = size.h+"px";
        var memContext = memCanvas.getContext("2d");
        for(var i = 0; i<map.layers.length; i++){
            var flag = false;
            for(var j=0;j<productLayers.length;j++){
                if(productLayers[j] != null && productLayers[j].id == map.layers[i].id){
                    flag = true;
                    break;
                }
            }
            if(flag)
                continue;
            if(typeof(map.layers[i].canvasContext) != "undefined") {
                var layerCanvas = map.layers[i].canvasContext.canvas;
                memContext.drawImage(layerCanvas, 0, 0, layerCanvas.width-20, layerCanvas.height-20);
            }
            else if(typeof(map.layers[i].renderer.canvas) != "undefined"){
                var layerCanvas = map.layers[i].renderer.canvas.canvas;
                memContext.drawImage(layerCanvas, 0, 0, layerCanvas.width-20, layerCanvas.height-20);
            }
        }
        addCanvasBorder(memContext,memCanvas.width,memCanvas.height);
        addCanvasTitle(memContext,"强天气实况");
        var image1 = memCanvas.toDataURL("image/png");
        images.push(image1.split(",")[1]);

        var memCanvasProduct = document.createElement("canvas");
        memCanvasProduct.width = size.w;
        memCanvasProduct.height = size.h;
        memCanvasProduct.border
        memCanvasProduct.style.width = size.w+"px";
        memCanvasProduct.style.height = size.h+"px";
        var memContextProduct = memCanvasProduct.getContext("2d");
        for(var i = 0; i<map.layers.length; i++){
            var flag = false;
            for(var j=0;j<productLayers.length;j++){
                if(productLayers[j] != null && productLayers[j].id == map.layers[i].id){
                    flag = true;
                    break;
                }
            }

            if(map.layers[i].id.indexOf("LocalTiledCache") != -1 || map.layers[i].id.indexOf("TianDiTu") != -1)
                flag = true;
            if(!flag)
                continue;
            if(typeof(map.layers[i].canvasContext) != "undefined") {
                var layerCanvas = map.layers[i].canvasContext.canvas;
                memContextProduct.drawImage(layerCanvas, 0, 0, layerCanvas.width-20, layerCanvas.height-20);
            }
            else if(typeof(map.layers[i].renderer) != "undefined" && typeof(map.layers[i].renderer.canvas) != "undefined"){
                var layerCanvas = map.layers[i].renderer.canvas.canvas;
                memContextProduct.drawImage(layerCanvas, 0, 0, layerCanvas.width-20, layerCanvas.height-20);
            }
        }
        drawCanvas($("#div_legend"),function(legendCanvas){
            memContextProduct.drawImage(legendCanvas, 15, memCanvasProduct.height-44, legendCanvas.width, legendCanvas.height);
            addCanvasBorder(memContextProduct,memCanvasProduct.width,memCanvasProduct.height);
            addCanvasTitle(memContextProduct,"0到2小时临近预报");
            var image2 = memCanvasProduct.toDataURL("image/png");
            images.push(image2.split(",")[1]);
            callback(images);
        });
    }

    function addCanvasBorder(context,width,height){
        context.beginPath();
        context.rect(0, 0, width-8, height-8);
        context.lineWidth = 4;
        context.strokeStyle = 'rgb(144,144,144)';
        context.stroke();
        context.beginPath();
        context.rect(4, 4, width-12, height-12);
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(74,74,74)';
        context.stroke();
        context.beginPath();
        context.rect(8, 8, width-20, height-20);
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(36,36,36)';
        context.stroke();
    }

    function addCanvasTitle(context,content){
        var size = GDYB.Page.curPage.map.getCurrentSize();
        context.font = '28px Microsoft YaHei bold';
        context.fillText(content,size.w/2-content.length*12,50);
    }

    function drawCanvas($div,callback){
        //截取对应的html将其转换成画布再输出图片
        if($div.length > 0){
            html2canvas($div, {
                //height: $div.outerHeight()+20,
                height: $div.height(),
                width:$div.width(),
                allowTaint: false,
                taintTest: false,
                onrendered: function(canvas)
                {
                    if(typeof callback =="function"){
                        callback(canvas);
                    }
                }
            });
        }
    }

    //添加图例
    function addLegend(radarName){
        var heatMapStyle;
        var colors;
        var legend;
        if(radarName == "radar_mcr"){
            heatMapStyle = heatMap_MCRStyles;
            colors = [{r:0,g:172,b:164},{r:192,g:192,b:254},{r:122,g:114,b:238},{r:30,g:38,b:208},{r:166,g:254,b:168},{r:0,g:234,b:0},{r:16,g:146,b:26}];
            legend = GDYB.Legend;
        }
        else if(radarName == "radar_mvil"){
            heatMapStyle = heatMap_MCRStyles;
            colors = [];
            legend = GDYB.Legend;
        }
        else if(radarName == "micaps_qpe"){
            heatMapStyle = heatMap_QPEStyles;
            colors = [];
            legend = GDYB.Legend;
        }
        else if(radarName == "micaps_qpf"){
            heatMapStyle = heatMap_QPFStyles;
            colors = [];
            legend = GDYB.Legend;
        }
        else if(radarName == "grapes_3km_cr"){
            heatMapStyle = heatMap_RadarStyles;
            colors = [];
            legend = GDYB.Legend1;
        }
        else if(radarName == "physic"){
            heatMapStyle = heatMap_TempStyles;
            colors = [];
            legend = GDYB.Legend2;
        }
        else{
            var heatMapStyle = null;
        }
        if(heatMapStyle != null){
            if (t.color[radarName] && t.color[radarName].length == 0)
                t.color[radarName] = colors;
            legend.update(heatMapStyle);
            if(radarName == "radar_mcr")
                return;
            //注册点击事件
            $("#"+legend.name).find("div").click(function(){
                colors = [];
                var layer;
                if(radarName == "radar_mcr"){
                    colors = [{r:0,g:172,b:164},{r:192,g:192,b:254},{r:122,g:114,b:238},{r:30,g:38,b:208},{r:166,g:254,b:168},{r:0,g:234,b:0},{r:16,g:146,b:26}];
                }
                if(radarName == "grapes_3km_cr"){
                    layer = t.micapsDataClassHour.layerFillRangeColor;
                }
                else if(radarName == "physic"){
                    layer = t.micapsDataClassSteam.layerFillRangeColor;
                }
                else{
                    layer = GDYB.Page.curPage.map.getLayersByName(radarName)[0];
                }
                if(layer == null)
                    return;
                var styles = heatMapStyle;
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
        var legend = null;
        if(this.id == "radar_mcr" || this.id == "radar_mvil"){
            legend = GDYB.Legend;
        }
        else if(radarName == "grapes_3km_cr"){
            legend = GDYB.Legend1;
        }
        else if(radarName == "physic"){
            legend = GDYB.Legend2;
        }
        if(legend != null)
            legend.update(null);
    }
    /**
     * @author:wangkun
     * @date:2017-06-13
     * @param:
     * @return:
     * @description:获取冰雹,半小时内
     */
    function getBB(){
        t.bbLayer.removeAllFeatures();
        var url= gsDataService + "services/DBService/getBB";
        var date = t.myDateSelecter.getCurrentTime();
        date = date.replace(/-/g,"");
        t.hailFeatures = [];
        $.ajax({
            type: "POST",
            data: {"para": "{datetime:'"+date+"'}"},
            url: url,
            dataType: "json",
            error:function(){
                console.log("获取冰雹失败!");
            },
            success:function(data){
                if(typeof(data)==="undefined"){
                    return;
                }
                var size = data.length;
                for(var i=0;i<size;i++){
                    var item = data[i];
                    var level = item.level;
                    var point = new WeatherMap.Geometry.Point(item.lon,item.lat);
                    var pointVector = new WeatherMap.Feature.Vector(point, {"冰雹":level});
                    t.hailFeatures.push(pointVector);
                }
                t.bbLayer.addFeatures(t.hailFeatures);
            }
        });
    }
}
QDLLJYBPageClass.prototype = new PageBase();