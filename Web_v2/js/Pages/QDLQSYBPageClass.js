/**
 * Created by Administrator on 2016/5/11.
 */


function QDLQSYBPageClass() {
    var t = this;

    this.currentType = null; //类型：潜势预报（Potential Forecast,pf）；潜势预警（Potential Warning，pw）
    this.currentElement = null;
    this.currentHourSpan = null;
    this.datasetGrid = null; //格点数据
    this.datasetGrids = null; //格点数据集合，用于保证短期潜势的4个格点数据，形如：{6:{data:datasetgrid,remark:""}, 12:{}, 18:{}, 24:{}}
    this.datasetGridInfos = null; //格点产品信息
    this.layerFillRangeColor = null; //格点图层
    this.layerLuoqu = null;    //落区图层
    this.drawLuoqu = null;     //画落区
    this.layerArea = null; //地区图层
    this.areas = null; //行政区划
    this.areaCodes = { 6: { data: [], remark: "" }, 12: { data: [], remark: "" }, 18: { data: [], remark: "" }, 24: { data: [], remark: "" } }; //行政区划代码，用于保证短期潜势的4个区划数据，形如：{6:{data:[{code:6201, value:1},{code:6202, value:1}],remark:""}, 12:{}, 18:{}, 24:{}}
    this.selectFeature = null;
    this.isMaking = false; //是否正在制作预警，制作过程中，不在更新地图，以免覆盖
    this.currentIntervalID = null;
    this.myDateSelecter = null;
    this.myDateSelecterYJQS = null;
    this.myDateSelecterDQQS = null;
    this.micapsDataClassSteam = null;//水汽
    this.micapsDataClassInstable = null;//不稳定条件
    this.micapsDataClassUplift = null;//抬升条件
    this.micapsDataClassSpecial = null;//特殊层
    this.drawPoint = null;//画点
    this.drawLayer = null;//画点图层
    this.iconLayer = null;//显示图标图层
    this.departNames = [];
    this.color = { grapes_3km_rain: [], grapes_3km_cr: [], physic: [] };
    this.time = 24;//查询预报时间
    this.currentModel = "";//当前模式
    this.lzModel = ["physic_CAPE","physic_CIN","physic_K","physic_LI","physic_RH","physic_DIV","physic_THESE","physic_Q"];
    this.hdModel = ["physic_CAPE","physic_CIN"];
    this.newRaderDataTime = null;

    this.renderMenu = function () {
        var htmlStr = ""
            //背景场
            + "<div id='backgroundDiv'>"
            + "<div>"
            + "<div class='title1' style='font-size:16px;'>物理量：</div>"
            + "<div id='model_type' style='padding: 5px 0px 10px 10px;'><div class='qdlTitleBar'>模式选择：</div><button id='' class='active'>NECP</button><button id='lz'>GRAPES</button><button id='hd'>WARMS</button></div>"
            + "<div id='physicDiv' class='btn_line1' style='margin: 10px 0px 0px 10px'>"
            + "<div class='qdlTitleBar'>水汽：</div>"
            + "<div name='steam' class='qdlContentDiv'><button id='physic_Q' class='active'>Q</button><button id='physic_RH'>RH</button><button id='physic_FH' >FH</button>"
            + "<button id='physic_IFVQ' >IFVQ</button><button id='physic_PW'>PW</button></div>"
            + "<div class='qdlTitleBar'>能量：</div>"
            + "<div name='instable' class='qdlContentDiv'><button id='physic_A' >A</button><button id='physic_K' >K</button>"
            + "<button id='physic_LI' >LI</button><button id='physic_CIN'>CIN</button>"
            + "<button id='physic_T700-300' >T700-300</button><button id='physic_T700-500'>T700-500</button><button id='physic_CAPE' >CAPE</button><button id='physic_THESE' >THETSE</button></div>"
            + "<div class='qdlTitleBar'>动力：</div>"
            + "<div name='uplift' class='qdlContentDiv'><button id='physic_VOR' >VOR</button><button id='physic_DIV' >DIV</button></div>"
            + "<div class='qdlTitleBar'>特殊层：</div>"
            + "<div name='special' class='qdlContentDiv'><button id='physic_H-20' >-20℃</button><button id='physic_H0'>0℃</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='physicHeight' class='btn_line1' style='padding-bottom:10px;margin-left:10px;'><div class='qdlTitleBar'>层次：</div>"
            + "<div class='qdlContentDiv'><button id='qsyb_850'>850</button><button id='qsyb_700' class='active'>700</button><button id='qsyb_500' >500</button><button id='qsyb_200' >200</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "</div>"
            + "<div style='margin-left: -10px;border-bottom: 1px solid #2aa5d1;'></div>"
            + "<div id='modelContent'>"
            + "<div id='divNWPElement' style='margin: 5px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar' style='width:65px;'>GRAPES：</div>"
            + "<div id='divGRAPES_LZ' class='qdlContentDiv'>"
            + "<button id='grapes_3km_rain'>1h降水</button><button id='grapes_3h'>3h降水</button><button id='grapes_3km_cr'>雷达反射率预报</button>"
            + "</div><div style='clear:both;'></div>"
            + "<div class='qdlTitleBar'>概率预报：</div>"
            + "<div class='qdlContentDiv'>"
            + "<button id='prob_ncep_rain'>短时强降水</button><button id='prob_ncep_hail'>雷暴大风或冰雹</button>"
            + "</div><div style='clear:both;'></div>"
            + "<div class='qdlTitleBar'>客观预报：</div>"
            + "<div class='qdlContentDiv'>"
            + "<button id='kgec_ncep_ds'>短时强降水</button><button id='kgec_lb'>雷暴大风或冰雹</button>"
            + "</div><div style='clear:both;'></div>"
            + "</div>"
            + "<div style='margin: 15px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar'>时间：</div>"
            + "<div id='dateSelect' style='margin: 5px 0px 5px 15px;height: 26px;float:left;'></div><div style='clear:both;'></div></div>"
            + "<div id='yubaoshixiao' class=''></div>"
            + "</div>"
            + "</div>"
            //预警潜视
            + "<div id='yjForecastDiv' style='display: none;min-height: 830px;margin: 5px 0px 0px 10px;'>"
            + "<div id='div_QianFaRen' style='margin: 5px 0px 0px 10px;'><div class='qdlTitleBar'>签发人：</div><div id='issueor' class='menuDropDown' name='model'><input class='inputYuBaoyuan' type='text'><div id='selectQianFaRen' class='selectYuBaoYuan'></div></div><div style='clear:both;'></div></div>"
            + "<div id='yjqs_div_datetime' style='margin: 5px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar'>时次：</div>"
            + "<div class='menuDropDown' name='model' style='display: none;'><span id='yjqs_selectMakeTime'value='8'>08时</span><div id='makeTimeDiv' class='selectYuBaoYuan'><div value='8'>08时</div><div value='20'>20时</div></div></div>"
            + "<div id='yjqs_dateSelect' style='height: 26px;float: left;'></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='yjqs_divElement' style='margin: 5px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar'>类型：</div><div class='qdlContentDiv'><button id='stsp' value='2' class='active' style='height:42px;'>雷暴</button><button id='ts' value='1'>短时强降水</button><button id='tsgh' value='3'>雷暴大风或冰雹</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='yjqs_warnLevel' style='margin: 5px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar'>等级：</div><div class='qdlContentDiv'><button id='ts' value='1' class='active'>蓝色</button><button value='2'>黄色</button><button value='3'>橙色</button><button value='3'>红色</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='divGridDistance' style='margin: 5px 0px 0px 10px;'>"
            + "<div class='qdlTitleBar'>格距：</div><div class='qdlContentDiv'><button class='active'>0.5</button><button>0.25</button><button>0.125</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div style='padding-top: 10px;'>"
            + "<textarea id='yjqs_txtContent' style='width: 300px;height: 95px;margin-left: 10px;background-color: rgb(1,46,76);border: 1px solid rgb(49,202,255);color:white;'></textarea>"
            + "<textarea id='guide' style='width: 300px;height: 100px;margin-left: 10px;background-color: rgb(1,46,76);border: 1px solid rgb(49,202,255);color:white;'></textarea>"
            + "<div id='controlBtn' class='qdlContentDiv' style='width:300px;margin-left:20px'><button id='btnGridEdit'>格点编辑</button><button id='btnStationSelect'>站点选择</button><button id='btnCancel'>放弃编辑</button><button id='btnSave'>发布预警</button><button id='brush'>画刷</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div style='position:relative;top:30px;bottom:0px;width:100%;height:380px;'>"
            + "<div class='title1'>近期预警 <span class='moreForecast'>更多</span></div>"
            + "<div id='divProductsOfRecent24H_qsyb' style='min-height:100px;color: white;width: 300px;border: 1px solid rgb(49,202,255);margin: 5px 0px 0px 10px;overflow: auto;padding: 2px;max-height: calc(100% - 195px);'></div>"
            + "<div id='yjqs_divContent' style='width: 300px;max-height: 120px;overflow: auto; margin: 20px 0px 0px 10px;padding-bottom: 10px;color:white;'></div>"
            + "</div>"
            + "<div style='margin: 10px 10px 0px -5px;padding: 10px;border-top: 1px solid rgb(225, 225, 225);position: absolute;bottom: 0px;'><span id='divRead' title='已读'></span><span id='divUnread' title='未读' style='color: rgb(230,230,230);'></span></div>"
            + "</div>"
            //短期潜视
            + "<div id='qsForecastDiv' style='display: none;min-height: 600px;margin: 5px 0px 0px 10px;'>"
            + "<div id='dqqs_div_datetime' class='menuDiv_bottom' style='margin-top:5px;'>"
            + "<div style='height: 27px;'>"
            + "<div class='qdlTitleBar'>时次：</div>"
            + "<div class='menuDropDown' name='model' style='display: none'><span id='dqqs_selectMakeTime'value='8'>08时</span><div id='makeTimeDiv' class='selectYuBaoYuan'><div value='8'>08时</div><div value='20'>20时</div></div></div>"
            + "<div id='dqqs_dateSelect' style='margin-left: 13px;height: 26px;float: left;'></div>"
            + "</div>"
            + "</div>"
            + "<div style='padding: 0px 0px 5px 10px;'><div class='divIcon'>"
            + "<div class='qdlTitleBar'>绘图：</div><img name='leibao' src='imgs/leibao.png' style='margin-left: 15px;cursor: pointer;'><img name='bingbao' src='imgs/bingbao.png' style='margin-left: 15px;cursor: pointer;'>"
            + "</div>"
            + "<div id='dqqs_divHourSpan' style='padding-top: 10px;'>"
            + "<div class='qdlTitleBar'>时效：</div><div class='qdlContentDiv'><button class='active' id='btn12H' value='12'>12H</button><button id='btn24H' value='24'>24H</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='dqqs_divElement' style='padding-top: 10px;'>"
            + "<div class='qdlTitleBar'>类型：</div><div class='qdlContentDiv'><button id='stsp' value='2' class='active' style='height:42px;'>雷暴</button><button id='ts' value='1'>短时强降水</button><button id='tsgh' value='3'>雷暴大风或冰雹</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div id='dqqs_divGridDistance' style='padding-top: 10px;'>"
            + "<div class='qdlTitleBar'>格距：</div><div class='qdlContentDiv'><button  class='active'>0.5</button><button>0.25</button><button>0.125</button></div><div style='clear:both;'></div>"
            + "</div>"
            + "<div style='padding-top: 20px;'>"
            + "<textarea id='dqqs_txtContent' style='width: 300px;height: 100px;background-color: rgb(1,46,76);border: 1px solid rgb(49,202,255);color:white;'></textarea>"
            + "<div style='margin-bottom: 10px;'><button id='dqqs_btnGridEdit' style='margin-left: 80px;width: 70px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>格点编辑</button><button id='dqqs_btnStationSelect' style='margin-left: 30px;width: 70px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>站点选择</button></div>"
            + "<div style='margin-bottom: 10px;'><button id='dqqs_btnCancel' style='margin-left: 80px;width: 70px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>放弃编辑</button><button id='dqqs_btnSave' style='margin-left: 30px;width: 70px;height: 25px;background-color: rgb(228, 147, 65);color: rgb(255, 255, 255);border: 1px solid rgb(138, 141, 149);'>提交预报</button></div>"
            + "</div>"
            + "<div style='position:relative;top:30px;bottom:0px;width:90%;height: 300px;overflow: auto'>"
            + "<div class='title1'>近期预报 <span class='moreForecast'>更多</span></div>"
            + "<div id='dqqs_divProductsOfRecent48H' style='color:white;padding:5px;width: 90%;height: 250px; border: 1px solid rgb(171, 173, 179); margin: 10px 0px 0px 10px;overflow: auto'></div>"
            + "</div>"
            + "</div>"
            + "</div>";

        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change active'>背景场</div><div name='yjqs' class='menu_change' style='margin-top: 5px;'>预警潜势</div><div id='messageNum_yjqs' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>短期潜势</div>");
        t.myDateSelecter = new DateSelecter(1, 1);
        t.myDateSelecter.intervalMinutes = 60; //6小时
        $("#dateSelect").html(t.myDateSelecter.div);
        $(".datetimepicker").css({
            "margin-top": "-270px"
        });
        $("#dateSelect").find("input").css("border", "1px solid #31CAFF").css("box-shadow", "none").css("color", "#31CAFF");
        t.micapsDataClassSteam = new MicapsDataClass();
        t.micapsDataClassInstable = new MicapsDataClass();
        t.micapsDataClassUplift = new MicapsDataClass();
        t.micapsDataClassSpecial = new MicapsDataClass();

        showMessageNum("messageNum_qsyb");

        var iconcallbacks = {
            click: function (currentFeature) {
                confirmModal("是否删除", function () {
                    t.iconLayer.removeFeatures([currentFeature])
                });
            }
        };

        //签发人点击事件
        $("#issueor").hover(null, function () {
            $("#selectQianFaRen").css("display", "none");
        });

        $("#issueor").click(function () {
            $("#selectQianFaRen").css("display", "block");
        });

        $("#selectQianFaRen").html("");
        var userName = GDYB.GridProductClass.currentUserName;
        if (userName == null) {
            alertModal("请注意，您尚未登录！");
        }
        else {
            var param = '{"userName":' + userName + '}';
            $.ajax({
                type: 'post',
                url: userServiceUrl + "services/UserService/getIssuer",
                data: { 'para': param },
                dataType: 'text',
                error: function () {
                    alertModal('获取签发人错误!');
                },
                success: function (data) {
                    if (data == "[]") {
                        alertModal("未查询到签发人");
                    }
                    else {
                        var issuers = jQuery.parseJSON(data);
                        for (var key in issuers) {
                            var issuer = issuers[key];
                            $("#selectQianFaRen").append("<div>" + issuer.name + "</div>");
                        }
                        $("#selectQianFaRen").find("div").click(function () {
                            $("#issueor").find("input").val($(this).html());
                            $("#selectQianFaRen").find("div").css("background-color", "");
                            $("#selectQianFaRen").find("div").css("color", "");
                            $(this).css("background-color", "rgb(116,173,213)").css("color", "#ffffff");
                        });
                        $("#issueor").find("input").val($("#selectQianFaRen").find("div").eq(0).html());
                        $("#selectQianFaRen").find("div").eq(0).css("background-color", "rgb(116,173,213)").css("color", "#ffffff");
                    }
                }
            });
        }

        //绘制雷暴、冰雹等图标
        var map = GDYB.Page.curPage.map;
        t.drawLayer = new WeatherMap.Layer.Vector("drawLayer");
        t.iconLayer = new WeatherMap.Layer.Vector("iconLayer", { renderers: ["Canvas"] });
        map.addLayers([t.drawLayer, t.iconLayer]);
        var selectFeature = new WeatherMap.Control.SelectFeature(t.iconLayer,
            {
                callbacks: iconcallbacks
            });
        selectFeature.id = "iconSelect";
        map.addControl(selectFeature);
        selectFeature.activate();
        //画点
        t.drawPoint = new WeatherMap.Control.DrawFeature(t.drawLayer, WeatherMap.Handler.Point, { multi: true });
        t.drawPoint.events.on({ "featureadded": drawPointCompleted });
        map.addControl(t.drawPoint);
        $(".divIcon").find("img").click(function () {
            $(".divIcon").find(".imgActive").removeClass("imgActive");
            $(this).addClass("imgActive");
            stopDragMap();
            t.drawPoint.activate();
        });

        $("#chat").keydown(function (event) {
            if (event.keyCode == 13) {
                var message = "";
                var productId = $("#divProductsOfRecent24H_qsyb").find("div.active").attr("id");
                var productName = "yjqs";
                var updateTime = GDYB.Chat.getNowTimes();
                var content = $(this).val();
                var departName = GDYB.GridProductClass.currentUserDepart.departName;
                var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
                var userName = GDYB.GridProductClass.currentUserName;
                var showName = "null";
                message = '{"productId":"' + productId + '","productName":"' + productName + '","updateTime":"' + updateTime + '","content":"' + content + '","departName":"' + departName + '","departCode":"' + departCode + '","userName":"' + userName + '","showName":"' + showName + '"}';
                GDYB.Chat.sendMessage(message);
            }
        });
        $(".chatDiv").find("button").click(function () {
            var message = "";
            var productId = $("#divProductsOfRecent24H_qsyb").find("div.active").attr("id");
            var productName = "yjqs";
            var updateTime = GDYB.Chat.getNowTimes();
            var content = $(this).prev().val();
            var departName = GDYB.GridProductClass.currentUserDepart.departName;
            var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
            var userName = GDYB.GridProductClass.currentUserName;
            var showName = "null";
            message = '{"productId":"' + productId + '","productName":"' + productName + '","updateTime":"' + updateTime + '","content":"' + content + '","departName":"' + departName + '","departCode":"' + departCode + '","userName":"' + userName + '","showName":"' + showName + '"}';
            GDYB.Chat.sendMessage(message);
        });

        t.myDateSelecterYJQS = new DateSelecter(1, 1);
        t.myDateSelecterYJQS.intervalMinutes = 60 * 1; //1小时
        $("#yjqs_dateSelect").html(t.myDateSelecterYJQS.div);
        $("#yjqs_dateSelect").find("img").css("display", "none");
        $("#yjqs_dateSelect").find("input").css({ "border": "1px solid #31CAFF", "margin-top": "4px", "box-shadow": "none", "width": "120px", "color": "#31CAFF", "background-color": "rgb(3,66,94)" });

        t.myDateSelecterDQQS = new DateSelecter(1, 1);
        t.myDateSelecterDQQS.intervalMinutes = 60 * 1; //1小时
        $("#dqqs_dateSelect").html(t.myDateSelecterDQQS.div);
        $("#dqqs_dateSelect").find("img").css("display", "none");
        $("#dqqs_dateSelect").find("input").css({ "border": "1px solid #31CAFF", "margin-top": "4px", "box-shadow": "none", "width": "120px", "color": "#31CAFF", "background-color": "rgb(3,66,94)" });
        var datetime = new Date();
        if (datetime.getHours() < 12)
            datetime.setHours(8);
        else
            datetime.setHours(20);
        t.myDateSelecterDQQS.setCurrentTime(datetime.format("yyyy-MM-dd hh:00:00"));

        //需要延迟执行，等待地图完成初始化
        setTimeout(function () {
            //初始化起报时间
            getTimeOfLastData(function(){
                t.myDateSelecter.setCurrentTime(t.newRaderDataTime);
                refreshYBSX();
            });
        }, 500);

        //预报时效
        function refreshYBSX(){
            t.yubaoshixiaoTools = new YuBaoshixiaoTools($("#yubaoshixiao"), t.myDateSelecter.getCurrentTimeReal());
            t.yubaoshixiaoTools.numbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72];
            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            regesterYuBaoShiXiaoEvent();//刷新预报时效
            $("#physic_PW").click();
            $("#physic_CAPE").click();
            $("#physic_VOR").click();
            addLegend("physic");//预报提示框
        }


        $(".menu_changeDiv").find(".menu_change").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#messageDivs").hide();
            $(".menu_changeDiv").find(".active").removeClass("active");
            $(this).addClass("active");
            t.iconLayer.removeAllFeatures();
            if ($(this).html() == "背景场") {
                $("#backgroundDiv").css("display", "block");
                $("#qsForecastDiv").css("display", "none");
                $("#yjForecastDiv").css("display", "none");
            }
            else if ($(this).html() == "预警潜势") {
                cancelEdit();
                $("#backgroundDiv").css("display", "none");
                $("#yjForecastDiv").css("display", "block");
                $("#qsForecastDiv").css("display", "none");
                t.currentType = "pw";
                init();
                t.time = 24;
                $("#yjqs_dateSelect").find("input").css({"width":"150px","text-align":"center"});
            }
            else {
                cancelEdit();
                $("#backgroundDiv").css("display", "none");
                $("#yjForecastDiv").css("display", "none");
                $("#qsForecastDiv").css("display", "block");
                t.currentType = "pf";
                init();
                t.time = 24;
                $("#dqqs_dateSelect").find("input").css({"width":"150px","text-align":"center"});
            }
        });

        $(".moreForecast").click(function () {
            t.time += 48;
            queryProductsRecent();
        });

        this.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", { renderers: ["Plot"] });
        this.layerPlot.style = {
            fill: false
        };
        this.layerPlot.renderer.styles = plotStyles_rhjc;
        this.layerPlot.renderer.plotWidth = 0;
        this.layerPlot.renderer.plotHeight = 0;
        GDYB.Page.curPage.map.addLayers([this.layerPlot]);
        //plotStyles_rhjc[0].visible = false;

        //点击时次
        this.myDateSelecterYJQS.input.change(function () {
            convertToText();
        });

        //点击物理量
        $("#physicDiv").find("button").click(function () {
            //t.myDateSelecter.setIntervalMinutes(60*6); //6小时一次
            if ($(this).hasClass("disabled"))
                return;
            if ($(this).hasClass("active")) {
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
        $("#physicHeight").find("button").click(function () {
            if ($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#physicHeight").find("button.active");
            if (btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            if ($("#physicDiv").find("button.active").length == 0) {
                $("#physicDiv").find("button").eq(0).addClass("active");
            }
            $(this).addClass("active");
            displayPhysic();
        });
        //时间选择事件
        t.myDateSelecter.input.change(function () {
            if ($("#physicDiv").find("button.active").length != 0) {
                displayPhysic();
            }
            else {
                displayGrapes();
            }
        });
        //时间选择事件
        t.myDateSelecter.leftBtn.click(function () {
            if ($("#physicDiv").find("button.active").length != 0) {
                displayPhysic();
            }
            else {
                displayGrapes();
            }
        });
        //时间选择事件
        t.myDateSelecter.rightBtn.click(function () {
            if ($("#physicDiv").find("button.active").length != 0) {
                displayPhysic();
            }
            else {
                displayGrapes();
            }
        });

        $("#divGridDistance").find("button").click(function () {
            if ($(this).hasClass("active"))
                return;
            var btnElementActive = $("#divGridDistance").find("button.active");
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            var map = GDYB.Page.curPage.map;
            if (t.isMaking) {
                if ($(this).html() == "0.5")
                    map.zoomTo(map.getZoom() > 7 ? map.getZoom() : 7);
                else if ($(this).html() == "0.25")
                    map.zoomTo(map.getZoom() > 10 ? map.getZoom() : 10);
                else if ($(this).html() == "0.125")
                    map.zoomTo(map.getZoom() > 12 ? map.getZoom() : 12);
                $("#btnGridEdit").click();
            }
        });

        $("#yjqs_warnLevel").find("button").click(function () {
            $("#yjqs_warnLevel").find("button").removeClass("active");
            $(this).addClass("active");
        });

        $("#dqqs_divGridDistance").find("button").click(function () {
            if ($(this).hasClass("active"))
                return;
            var btnElementActive = $("#dqqs_divGridDistance").find("button.active");
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            var map = GDYB.Page.curPage.map;
            if (t.isMaking) {
                if ($(this).html() == "0.5")
                    map.zoomTo(map.getZoom() > 7 ? map.getZoom() : 7);
                else if ($(this).html() == "0.25")
                    map.zoomTo(map.getZoom() > 10 ? map.getZoom() : 10);
                else if ($(this).html() == "0.125")
                    map.zoomTo(map.getZoom() > 12 ? map.getZoom() : 12);
                $("#dqqs_btnGridEdit").click();
            }
        });

        //点击数值模式GRAPSE-LZ
        $("#divNWPElement").find("button").click(function () {
            if (this.id == "grapes_3km_rain" || this.id == "grapes_3km_cr") {
                t.yubaoshixiaoTools.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
            }
            else if (this.id == "prob_ncep_rain" || this.id == "prob_ncep_hail") {
                t.yubaoshixiaoTools.numbers = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];
            }
            else {
                t.yubaoshixiaoTools.numbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72];
            }
            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            regesterYuBaoShiXiaoEvent();
            if ($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#divNWPElement").find("button.active");
            if (btnElementActive.attr("id") == this.id) {
                GDYB.MicapsDataClass.layerFillRangeColor.setDatasetGrid(null);
                GDYB.MicapsDataClass.layerFillRangeColor.refresh();
                hiddenLegend(this.id);
                $(this).removeClass("active");
                return;
            }
            btnElementActive.removeClass("active");
            $(this).addClass("active");
            displayGrapes();
        });

        //（预警潜势）点击要素类型
        $("#yjqs_divElement").find("button").click(function () {
            if ($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#yjqs_divElement").find("button.active");
            if (btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            $(this).addClass("active");

            t.currentElement = { name: this.id, caption: this.innerHTML, value: parseInt(this.value) };
        });

        var callbacks = {
            over: function (currentFeature) {
            },

            click: function (currentFeature) {
                var isSelected = false;
                if (parseFloat(currentFeature.style.fillOpacity) > 0) {//已被选中，需去掉
                    isSelected = true;
                }
                var color = null;
                for (var key in heatMap_CalamityStyles) {
                    var style = heatMap_CalamityStyles[key];
                    if (style.start == t.currentElement.value) {
                        color = style.startColor;
                        break;
                    }
                }
                if (color != null) {
                    if (isSelected) {
                        currentFeature.style = {
                            strokeColor: "#a548ca",
                            strokeWidth: 2.0,
                            fillColor: "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")",
                            fillOpacity: "0"
                        };
                        currentFeature.attributes["value"] = 0;
                    }
                    else {
                        currentFeature.style = {
                            strokeColor: "#a548ca",
                            strokeWidth: 2.0,
                            fillColor: "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")",
                            fillOpacity: "0.5"
                        };
                        currentFeature.attributes["value"] = t.currentElement.value;
                    }
                    t.layerArea.redraw();
                    if (t.areaCodes != null) {
                        var code = currentFeature.attributes["CODE"];
                        if (isSelected) {
                            var dataCount = t.areaCodes[t.currentHourSpan].data.length;
                            for (var i = 0; i < dataCount; i++) {
                                var data = t.areaCodes[t.currentHourSpan].data[i];
                                if (data.code === code) {//删除
                                    t.areaCodes[t.currentHourSpan].data.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        else {
                            t.areaCodes[t.currentHourSpan].data.push({ code: code, value: t.currentElement.value });
                        }
                    }
                    convertToText();
                }
            },
            out: function (currentFeature) {
            }

        };

        //（预警潜势）点击站点选择
        $("#btnStationSelect").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null) {
                alertModal("请登录");
                return;
            }

            t.datasetGrid = null;
            t.areaCodes = { 6: { data: [], remark: "" }, 12: { data: [], remark: "" }, 18: { data: [], remark: "" }, 24: { data: [], remark: "" } };
            startSelectStation();
        });

        function startSelectStation() {
            t.isMaking = true;
            t.editAction = 1;
            stopDrawLuoqu();
            t.layerFillRangeColor.setDatasetGrid(null);
            //t.layerFillRangeColor.visibility = false;
            t.datasetGrid = null;

            //添加地区图层
            if (t.layerArea == null) {
                var map = GDYB.Page.curPage.map;
                t.layerArea = new WeatherMap.Layer.Vector("layerArea", { renderers: ["Canvas2"] });
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
            GDYB.Page.curPage.map.setLayerIndex(t.layerArea, 99);

            //下载市州、区县边界
            if (t.areas == null || t.areas.length == 0) {
                showAreas();
                //downAreas(function () {
                //    showAreas();
                //}, GDYB.GridProductClass.currentUserDepart.departCode);
            }
            else {
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

        //（预警潜势）提交预警
        $("#btnSave").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 4)
                return;
            stopDrawLuoqu();

            /*var bounds = new WeatherMap.Bounds(88.2,31.6,113.6,43.3);
            map.zoomToExtent(bounds);*/
            var datasetGrid = null;
            var strAreaCodes = "";
            if (t.datasetGrid != null) {
                datasetGrid = t.datasetGrid;
            }
            else if (t.areaCodes != null) {
                datasetGrid = createDatasetGrid();
                var areaCode = t.areaCodes[t.currentHourSpan];
                for (var key in areaCode.data) {
                    strAreaCodes += areaCode.data[key].code + " " + areaCode.data[key].value + ",";
                }
                if (strAreaCodes.length > 0)
                    strAreaCodes = strAreaCodes.substr(0, strAreaCodes.length - 1);
            }

            var date = new Date();
            var makeTime = date.getFullYear() + "-" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + date.getDate()).slice(-2) + " " + (Array(2).join(0) + date.getHours()).slice(-2) + ":" + (Array(2).join(0) + date.getMinutes()).slice(-2) + ":00";
            saveGridProduct(function (bsuccess) {
                if (bsuccess > 0) {
                    getNewCalamityGridInfos();
                    queryProductsRecent();
                    if (t.currentType == "pw") {
                        canvas2Image(function (images) {
                            if (images.length != 0) {
                                var name = "p_" + GDYB.GridProductClass.currentUserDepart.departCode + "_nowwarn_" + date.getFullYear().toString().substr(2, 2) + ".*?.pdf";
                                var url = gridServiceUrl + "services/ForecastfineService/getForecastNum";
                                $.ajax({
                                    type: "POST",
                                    data: { "para": "{name:'" + name + "'}" },
                                    url: url,
                                    dataType: "json",
                                    success: function (data) {
                                        var num = 1;
                                        if (data != null)
                                            num = data;
                                        num++;
                                        var content = $("#yjqs_txtContent").val();
                                        var element = "nowwarn";
                                        var version = "p";
                                        var type = GDYB.GridProductClass.currentUserDepart.departCode;
                                        var level = 1000;
                                        var yyMMddHHmm = (date.getFullYear() - 2000) + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + (Array(2).join(0) + date.getDate()).slice(-2) + (Array(2).join(0) + date.getHours()).slice(-2) + (Array(2).join(0) + date.getMinutes()).slice(-2);
                                        var yyMMddHH = (date.getFullYear() - 2000) + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + (Array(2).join(0) + date.getDate()).slice(-2) + (Array(2).join(0) + date.getHours()).slice(-2);
                                        var productName = getGridDatasetName(type, level, element, yyMMddHHmm, version, yyMMddHH, 24, num);
                                        var issueor = $("#issueor").find("input").val();
                                        if (issueor == "") {
                                            alertModal("请选择签发人");
                                            return;
                                        }
                                        var areaName = GDYB.GridProductClass.currentUserDepart.departName;
                                        var time = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
                                        var title = areaName + "气象台" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分发布强对流天气" + $("#yjqs_warnLevel").find(".active").html() + "预警";
                                        var guide = $("#guide").val().replace(/；/g, "<w:br />    ").replace(/;/g, "<w:br />    ");
                                        saveArchive(productName, content, images, issueor, num, areaName, time, title, guide);
                                        var url = gridServiceUrl + "services/ForecastfineService/insertArchiveProduct";
                                        $.ajax({
                                            type: "POST",
                                            data: { "para": "{gridProductId:" + bsuccess + ",fileName:'" + productName + "'}" },
                                            url: url,
                                            dataType: "json",
                                            success: function (data) {

                                            }
                                        });
                                    },
                                    error: function (data) {
                                    }
                                });
                            }
                        });
                    }
                }
                else
                    alertModal("提交失败");
            }, makeTime, makeTime, 24, datasetGrid, $("#yjqs_txtContent").val(), strAreaCodes);
        });

        //（预警潜势）点击格点编辑
        $("#btnGridEdit").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null) {
                alertModal("请登录");
                return;
            }
            $("#guide").val("1.政府及相关部门按照职责做好防范短时强降水、防雷、防大风准备工作；\r\n2. 防范短时强降水可能引发的山洪、泥石流等地质灾害；\n3.户外行人和工作人员减少户外活动，注意远离棚架广告牌等搭建物；\n4.相关水域水上作业和过往船舶采取回港规避或者绕道航行等积极应对措施，工地注意遮盖建筑物资，妥善安置易受风雨影响的室外物品。");
            t.isMaking = true;
            t.editAction = 0;

            //单元格编辑：
            //            t.datasetGrid = null;
            //            t.datasetGrid = createDatasetGrid();
            //            t.layerFillRangeColor.setDatasetGrid(t.datasetGrid);

            //落区编辑：
            var map = GDYB.Page.curPage.map;
            if (t.layerLuoqu == null) {
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
                t.drawLuoqu.events.on({ "featureadded": drawCompleted });
            }
            //            t.layerFillRangeColor.visibility = true;

            //下载市州、区县边界
            //if (t.areas == null || t.areas.length == 0) {
            //    downAreas(null, GDYB.GridProductClass.currentUserDepart.departCode);
            //}

            t.datasetGrid = null;
            t.datasetGrid = createDatasetGrid();
            t.layerFillRangeColor.setDatasetGrid(t.datasetGrid);
            if (t.layerArea != null)
                t.layerArea.removeAllFeatures();
            startDrawLuoqu();
        });

        //（预警潜势）点击放弃编辑
        $("#btnCancel").click(function () {
            cancelEdit();
        });

        //（短期潜势）点击放弃编辑
        $("#dqqs_btnCancel").click(function () {
            cancelEdit();
        });

        function cancelEdit() {
            /*if(confirm("是否放弃本次编辑？")){*/
            t.isMaking = false;
            t.datasetGrid = null;
            t.datasetGrids = null;
            //t.areaCodes = null;
            if (t.layerFillRangeColor != null)
                t.layerFillRangeColor.setDatasetGrid(null);
            if (t.layerArea != null && t.areas != null) {
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
            }
            stopDrawLuoqu();
            $("#yjqs_txtContent").val("");
            $("#dqqs_txtContent").val("");
            t.iconLayer.removeAllFeatures();
            /*  }*/
        }
        $("#brush").on("click", function () {
            var txt = $(this).text();
            if (txt === "画刷") {
                $(this).html("停止画刷");
                map.events.register("mousemove", map, brush);
                t.drawLuoqu.deactivate();
            }
            else {
                $(this).html("画刷");
                map.events.unregister("mousemove", map, brush);
                convertToText();
                showSelectCnty();
                t.drawLuoqu.activate();
            }
        });
        /**
         * @author:wangkun
         * @date:2017-06-13
         * @param:
         * @return:
         * @description:画刷
         */
        function brush(event) {
            if (event.buttons != 1) {
                    return;
            }
            var map = GDYB.Page.curPage.map;
            if (t.datasetGrid == null) {
                return;
            }
            var dg = t.datasetGrid;
            var brushSize = 2;
            if (dg != null) {
                var lonlat = map.getLonLatFromPixel(event.xy);
                var pt = dg.xyToGrid(lonlat.lon, lonlat.lat);
                if (pt != null) {
                    if (true) {
                        var radius = Math.floor((brushSize - 1) / 2);
                        var x0 = pt.x;
                        var y0 = pt.y;
                        var left = x0 - radius;
                        var right = x0 + (brushSize - radius - 1);
                        var top = y0 - radius;
                        var bottom = y0 + (brushSize - radius - 1);
                        for (var y = top; y <= bottom; y++) {
                            for (var x = left; x <= right; x++) {
                                if (y < 0 || y >= dg.rows || x < 0 || x >= dg.cols)
                                    continue;
                                dg.setValue(0, x, y, -9999);
                            }
                        }
                        t.layerFillRangeColor.refreshPart(left, bottom, right, top);
                    }
                }
            }
        }

        //（短期潜势）点击时效
        $("#dqqs_divHourSpan").find("button").click(function () {
            if ($(this).hasClass("disabled"))
                return;
            var btnHourSpanActive = $("#dqqs_divHourSpan").find("button.active");
            if (btnHourSpanActive.attr("id") == this.id)
                return;
            btnHourSpanActive.removeClass("active");
            $(this).addClass("active");

            t.currentHourSpan = this.value;
            if (t.datasetGrids != null) {
                t.datasetGrid = t.datasetGrids[t.currentHourSpan].data;
                t.layerFillRangeColor.setDatasetGrid(t.datasetGrid);
                $("#dqqs_txtContent").val(t.datasetGrids[t.currentHourSpan].remark);
            }

            if (t.layerArea != null && t.areas != null) {
                var areaCode = t.areaCodes[t.currentHourSpan];
                updateLayerArea(areaCode.data);
                $("#dqqs_txtContent").val(areaCode.remark);
            }
        });

        function updateLayerArea(areaCodes) {
            if (t.layerArea == null || t.layerArea.features.length == 0)
                showAreas();

            t.layerArea.features = [];
            for (var key in t.areas) {
                var feature = t.areas[key];
                var code = feature.attributes["CODE"];
                var dvalue = 0;
                for (var keyCode in areaCodes) {
                    if (code == areaCodes[keyCode].code) {
                        dvalue = areaCodes[keyCode].value;
                        break;
                    }
                }
                if (dvalue == 0) {
                    feature.style = {
                        strokeColor: "#a548ca",
                        strokeWidth: 2.0,
                        fillColor: "#0000ff",
                        fillOpacity: "0"
                    };
                }
                else {
                    var color = null;
                    for (var key in heatMap_CalamityStyles) {
                        var style = heatMap_CalamityStyles[key];
                        if (style.start == dvalue) {
                            color = style.startColor;
                            break;
                        }
                    }
                    if (color != null) {
                        feature.style = {
                            strokeColor: "#a548ca",
                            strokeWidth: 2.0,
                            fillColor: "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")",
                            fillOpacity: "0.5"
                        };
                    }
                    else {

                    }
                }
                feature.attributes["value"] = dvalue;
                t.layerArea.features.push(feature);
            }
            t.layerArea.redraw();
        }

        //（短期潜势）点击要素
        $("#dqqs_divElement").find("button").click(function () {
            if ($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#dqqs_divElement").find("button.active");
            if (btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            $(this).addClass("active");

            t.currentElement = { name: this.id, caption: this.innerHTML, value: parseInt(this.value) };
        });

        //（短期潜势）点击格点编辑
        $("#dqqs_btnGridEdit").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null) {
                alertModal("请登录");
                return;
            }
            t.isMaking = true;
            t.editAction = 0;

            //落区编辑：
            var map = GDYB.Page.curPage.map;
            if (t.layerLuoqu == null) {
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
                t.drawLuoqu.events.on({ "featureadded": drawCompleted });
            }

            //下载市州、区县边界
            //if (t.areas == null || t.areas.length == 0) {
            //    downAreas(null, GDYB.GridProductClass.currentUserDepart.departCode);
            //}

            t.datasetGrid = null;
            t.datasetGrids = {};
            //t.areaCodes = null; //只能保留一种方式
            for (var i = 6; i <= 24; i += 6) {
                var datasetGrid = createDatasetGrid();
                t.datasetGrids[i] = { data: datasetGrid, remark: "" };
            }
            t.datasetGrid = t.datasetGrids[t.currentHourSpan].data;
            t.layerFillRangeColor.setDatasetGrid(t.datasetGrid);
            if (t.layerArea != null)
                t.layerArea.removeAllFeatures();
            startDrawLuoqu();
        });

        //（短期潜势）点击站点选择
        $("#dqqs_btnStationSelect").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null) {
                alert("请登录");
                return;
            }

            t.areaCodes = { 6: { data: [], remark: "" }, 12: { data: [], remark: "" }, 18: { data: [], remark: "" }, 24: { data: [], remark: "" } };
            t.datasetGrids = null; //只能保留一种方式
            startSelectStation();
        });

        $("#dqqs_btnSave").click(function () {
            if (GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 4)
                return;
            stopDrawLuoqu();
            if (t.datasetGrids != null || t.areaCodes != null) {
                var hourSpan = 0;
                function saveAllGridProductRecursion() {
                    var date = new Date();
                    var makeTime = date.getFullYear() + "-" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + date.getDate()).slice(-2) + " " + (Array(2).join(0) + date.getHours()).slice(-2) + ":" + (Array(2).join(0) + date.getMinutes()).slice(-2) + ":00";
                    var datetime = t.myDateSelecterDQQS.getCurrentTimeReal();
                    var forecastTime = datetime.format("yyyy-MM-dd hh:00:00");
                    hourSpan += 12;

                    var datasetGrid = null;
                    var strAreaCodes = "";
                    var remark = "";
                    if (t.datasetGrids != null) {
                        datasetGrid = t.datasetGrids[hourSpan].data;
                        remark = t.datasetGrids[hourSpan].remark;
                    }
                    else if (t.areaCodes != null) {
                        datasetGrid = createDatasetGrid();
                        var areaCode = t.areaCodes[hourSpan];
                        for (var key in areaCode.data) {
                            strAreaCodes += areaCode.data[key].code + " " + areaCode.data[key].value + ",";
                        }
                        if (strAreaCodes.length > 0)
                            strAreaCodes = strAreaCodes.substr(0, strAreaCodes.length - 1);
                        remark = areaCode.remark;
                    }

                    saveGridProduct(function (bsuccess) {
                        if (bsuccess) {
                            if (hourSpan == 24) {
                                alert("提交成功");
                                queryProductsRecent();
                                t.isMaking = false;
                                return;
                            }
                            else {
                                saveAllGridProductRecursion();
                            }
                        } else
                            alertModal(hourSpan + "小时提交失败");
                    }, makeTime, forecastTime, hourSpan, datasetGrid, remark, strAreaCodes);
                }
                saveAllGridProductRecursion();
            }
        });

        $("#dqqs_txtContent").change(function () {
            if (t.datasetGrids != null) {
                t.datasetGrids[t.currentHourSpan].remark = $(this).val();
            }
        });
        function drawCompleted() {
            if (t.layerLuoqu.features.length > 0) {
                var feature = t.layerLuoqu.features[0];
                var geoRegion = feature.geometry;
                var dvalue = t.currentElement.value;
                if (dvalue != t.datasetGrid.noDataValue) {
                    GDYB.GridProductClass.fillRegion(t.datasetGrid, geoRegion, dvalue, 0, t.currentElement.name, false);
                    t.layerFillRangeColor.refresh();
                    convertToText();
                }
                t.layerLuoqu.removeAllFeatures();
            }
            var areaLine = GDYB.GDYBPage.line;
            GDYB.GridProductClass.ridGridBeyondBounds(t.datasetGrid,areaLine);
            t.layerFillRangeColor.refresh();
            showSelectCnty();
        }
        /**
         * @author:wangkun
         * @date:2017-06-13
         * @return:
         * @description:勾选区域
         */
        function showSelectCnty() {
            if (t.layerArea == null) {
                var map = GDYB.Page.curPage.map;
                t.layerArea = new WeatherMap.Layer.Vector("layerArea", { renderers: ["Canvas2"] });
                t.layerArea.style = {
                    strokeColor: "#a548ca",
                    strokeWidth: 2.0,
                    fillColor: "#0000ff",
                    fillOpacity: "0"
                };
                map.addLayers([t.layerArea]);
            }
            t.layerArea.removeAllFeatures();
            var selectFeature = [];
            var cntySize = t.areas.length;
            for (var i = 0; i < cntySize; i++) {
                var feature = t.areas[i];
                var b = false;
                for(var j=1;j<4;j++){//3个值，1,2,3
                    b = GDYB.GridProductClass.contain(t.datasetGrid, feature.geometry, j);
                    if (b) {
                        var color = null;
                        for (var key in heatMap_CalamityStyles) {
                            var style = heatMap_CalamityStyles[key];
                            if (style.start == j) {
                                color = style.startColor;
                                break;
                            }
                        }
                        if(color==null){
                            continue;
                        }
                        feature.style = {
                            strokeColor: "red",
                            strokeWidth: 2.0,
                            fillColor: "rgb(" + 60 + ", " + 60 + ", " + 245 + ")",
                            fillOpacity: "0.3"
                        };
                        selectFeature.push(feature);
                        break;
                    }
                }
                if(!b){
                    feature.style = {
                        strokeColor: "#a548ca",
                        strokeWidth: 2.0,
                        fillColor: "rgb(" + 255 + ", " + 255 + ", " + 255 + ")",
                        fillOpacity: "0"
                    };
                }
                
            }

            t.layerArea.addFeatures(selectFeature);
            t.areaCodes[t.currentHourSpan].data = [];
            for (var i = 0; i < selectFeature.length; i++) {
                t.areaCodes[t.currentHourSpan].data.push({ code: selectFeature[i].attributes["CODE"], value: t.currentElement.value });
            }
        }
        function showAreas() {
            if (t.areas == null || t.areas.length == 0)
                return;
            var map = GDYB.Page.curPage.map;
            if (t.layerArea == null) {
                t.layerArea = new WeatherMap.Layer.Vector("layerArea", { renderers: ["Canvas2"] });
                t.layerArea.style = {
                    strokeColor: "#a548ca",
                    strokeWidth: 2.0,
                    fillColor: "#0000ff",
                    fillOpacity: "0"
                };
                map.addLayers([t.layerArea]);
            }
            if(t.selectFeature==null){
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
            for (var key in t.areas)
                features.push(t.areas[key]);
            t.layerArea.addFeatures(features);
        }

        function downAreas(recall, areaCode) {
            t.areas = [];
            var url = gridServiceUrl + "services/AdminDivisionService/getDivisionInfos";
            $.ajax({
                data: { "para": "{areaCode:'" + areaCode + "',level:'cnty'}" },
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if (typeof (data) != "undefined" && data.length > 0) {
                        for (var key in data) {
                            var feature = GDYB.FeatureUtilityClass.getFeatureFromJson(JSON.parse(data[key]));
                            feature.geometry.calculateBounds();
                            t.areas.push(feature);
                        }
                        recall && recall();
                    }
                },
                error: function (e) {
                    alert("获取行政区划边界失败：" + e.statusText);
                }
            });
        }

        //格点单元格编辑的实现
        var map = GDYB.Page.curPage.map;
        map.events.register("click", map, function (event) {
            //            if (t.datasetGrid == null)
            //                return;
            //            if(t.editAction == 0) {
            //                var ptPixel = event.xy;
            //                var lonlat = this.getLonLatFromPixel(ptPixel);
            //                var pt = t.datasetGrid.xyToGrid(lonlat.lon, lonlat.lat);
            //                t.datasetGrid.setValue(0, pt.x, pt.y, t.currentElement.value);
            //                t.layerFillRangeColor.refresh();
            //                convertToText();
            //            }
            //            else if(e.editAction == 1){
            //
            //            }
        });
        function convertToText() {
            var elements = [{ name: "stsp", caption: "短时强降水", value: 1 },
            { name: "ts", caption: "雷暴", value: 2 },
            { name: "tsgh", caption: "雷暴大风或冰雹", value: 3 }];

            var strContent = "";
            if (t.areas != null && t.areas.length > 0) {
                if (t.editAction == 0) {
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
                }
                else if (t.editAction == 1) {
                    for (var keyOfElement in elements) {
                        var strArea = "";
                        for (var key in t.areas) {
                            var feature = t.areas[key];
                            if (typeof (feature.attributes["value"]) != "undefined" && feature.attributes["value"] == elements[keyOfElement].value)
                                strArea += feature.attributes["NAME"] + "、";
                        }
                        if (strArea.length > 0) {
                            strArea = strArea.substr(0, strArea.length - 1);
                            if (strContent.length > 0)
                                strContent += "，"
                            strContent += strArea + "等地将出现" + elements[keyOfElement].caption;
                        }
                    }
                }
            }

            if (strContent.length > 0) {
                var date = new Date();
                var maketime = date.getFullYear() + "年" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "月" + (Array(2).join(0) + date.getDate()).slice(-2) + "日" + (Array(2).join(0) + date.getHours()).slice(-2) + "时" + (Array(2).join(0) + date.getMinutes()).slice(-2) + "分";
                if (t.currentType == "pw") {
                    var forecastTimeStart = t.myDateSelecterYJQS.getCurrentTimeReal();
                    var times = forecastTimeStart.getTime();
                    times += 6 * 3600 * 1000; //+6H
                    var forecastTimeEnd = new Date();
                    forecastTimeEnd.setTime(times);
                    strContent = GDYB.GridProductClass.currentUserDepart.departName + maketime + "发布预警潜势：预计" + forecastTimeStart.getHours() + "时-" + forecastTimeEnd.getHours() + "时，" + strContent + "。请注意防范。";
                }
                else if (t.currentType == "pf")
                    strContent = GDYB.GridProductClass.currentUserDepart.departName + maketime + "发布短期潜势预报：预计未来" + (t.currentHourSpan - 6) + "-" + t.currentHourSpan + "小时，" + strContent + "。请注意防范。";
            }
            if (t.currentType == "pw")
                $("#yjqs_txtContent").val(strContent);
            else if (t.currentType == "pf") {
                $("#dqqs_txtContent").val(strContent);
                if (t.datasetGrids != null)
                    t.datasetGrids[t.currentHourSpan].remark = strContent;
                if (t.areaCodes != null)
                    t.areaCodes[t.currentHourSpan].remark = strContent;
            }
        }

        //查询近期产品
        function queryProductsRecent() {
            var element = t.currentType;
            var div = null;
            if (element == "pw")
                div = $("#divProductsOfRecent24H_qsyb");
            else if (element == "pf")
                div = $("#dqqs_divProductsOfRecent48H");
            var date = new Date();
            var maketimeEnd = date.getFullYear() + "-" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + date.getDate()).slice(-2) + " " + (Array(2).join(0) + date.getHours()).slice(-2) + ":" + (Array(2).join(0) + date.getMinutes()).slice(-2) + ":00";
            var time = date.getTime();
            time -= t.time * 60 * 60 * 1000;
            date.setTime(time);
            var maketimeStart = date.getFullYear() + "-" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + date.getDate()).slice(-2) + " " + (Array(2).join(0) + date.getHours()).slice(-2) + ":" + (Array(2).join(0) + date.getMinutes()).slice(-2) + ":00";
            getCalamityGridInfos(function (data) {
                if (typeof (data) != "undefined" && data.length > 0) {

                    //判断是否有新预警
                    var newID = false;
                    if (t.datasetGridInfos == null || t.datasetGridInfos.length == 0) {
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
                    var indexId = div.find(".active").attr("id");
                    for (var key in t.datasetGridInfos) {
                        var info = t.datasetGridInfos[key];
                        if (element == "pw")
                            html += "<div id='" + info.id + "' style='cursor: pointer;line-height: 25px;padding-left: 10px;'>" + info.forecastTime.substr(5, 11) + " " + info.forecaster + "发布" + (t.currentType == "pf" ? "(" + info.hourSpan + ")" : "") + "<img style='height:25px;float:right;margin-right:5px' src='imgs/messageIcon.png' /></div>";
                        else
                            html += "<div id='" + info.id + "' style='cursor: pointer;line-height: 25px;padding-left: 10px;'>" + info.forecastTime.substr(5, 11) + " " + info.forecaster + "发布" + (t.currentType == "pf" ? "(" + info.hourSpan + ")" : "") + "</div>";
                    }
                    div.html(html);
                    if (html == "") {
                        $("#chat").css("display", "none");
                    }
                    else {
                        $("#chat").css("display", "");
                    }
                    div.find("div").click(function () {
                        if(t.isMaking){
                            alertModal("无法查看近期预报，请点击提交预报/放弃编辑");
                            return;
                        }
                        div.find("div").css("background-color", "");
                        div.find("div.active").removeClass("active");
                        $(this).css("background-color", "rgb(49,202,255)").addClass("active");
                        $(this).find("span").remove();
                        var id = this.id;
                        displayProduct(id);
                        displayStatus(id, true);
                        displayMessage(id);
                    });
                    $("#divProductsOfRecent24H_qsyb").find("img").click(function () {
                        var id = $(this).parent()[0].id;
                        GDYB.Chat.productId = id;
                        GDYB.Chat.productName = t.currentType;
                        displayMessage(id);
                        $(this).parent().find("span").remove();
                        $(this).css("margin-right", "25px");
                        $("#messageDivs").show();
                    });
                    if (element == "pw") {
                        div.find("div").dblclick(function () {
                            var url = gridServiceUrl + "services/ForecastfineService/getArchiveProduct";
                            $.ajax({
                                type: "POST",
                                data: { "para": "{productId:" + parseInt($(this).attr("id")) + "}" },
                                url: url,
                                dataType: "json",
                                success: function (data) {
                                    if (data != null) {
                                        $("#pdf_modal_confirm_content").html("<iframe src='" + host + ":8080/products/archive/" + data[0].fileName + ".pdf' id='gnmxPdf' scrolling='no' style='position: absolute;z-index:99;background-color: #ffffff'  frameborder='0' width='100%' height='100%'></iframe>");
                                        $("#pdf_modal_confirm").modal();
                                    }
                                },
                                error: function (data) {
                                }
                            });
                        });
                    }

                    if (div.find("div[id=" + indexId + "]").length != 0) {
                        div.find("div[id=" + indexId + "]").addClass("active").css("background-color", "rgb(49,202,255)");
                        displayProduct(indexId, false);//显示选中那个
                    }
                    else {
                        div.find("div").eq(0).addClass("active").css("background-color", "rgb(49,202,255)");
                        displayProduct(t.datasetGridInfos[0].id, false); //显示第一个
                    }

                    if (newID)
                        $('#alertAudio')[0].play();
                }
            }, element, maketimeStart, maketimeEnd);
        }

        function getCalamityGridInfos(recall, element, maketimeStart, maketimeEnd) {
            var url = gridServiceUrl + "services/GridService/getCalamityGridInfos";
            $.ajax({
                data: { "para": "{element:'" + element + "',maketimeStart:'" + maketimeStart + "',maketimeEnd:'" + maketimeEnd + "'}" },
                url: url,
                dataType: "json",
                success: function (data) {
                    recall && recall(data);
                },
                type: "POST"
            });
        }

        function displayProduct(id) {
            for (var key in t.datasetGridInfos) {
                var info = t.datasetGridInfos[key];
                if (info.id == id) {
                    $(".messageTitle").find("div").html("潜势预报");
                    $("#yjqs_divContent").html(info.remark);
                    var height = 217 - parseInt($("#yjqs_divContent").css("height"));
                    $("#yjqs_divMessage").parent().css("height", height + "px");
                    if (!t.isMaking) //正在制作预警时，不再地图上显示
                    {
                        if (info.nwpmodel.length == 0) {
                            if (t.layerArea != null)
                                t.layerArea.removeAllFeatures();
                            getGrid(info.element, info.type, info.level, info.hourSpan, info.makeTime, info.version, info.forecastTime);
                        }
                        else {
                            if (t.layerFillRangeColor != null)
                                t.layerFillRangeColor.setDatasetGrid(null);
                            var areaCodes = [];
                            var strAreaCodes = info.nwpmodel.split(",");
                            for (var keyCode in strAreaCodes) {
                                var strAreaCode = strAreaCodes[keyCode].split(" ");
                                areaCodes.push({ code: strAreaCode[0], value: strAreaCode[1] });
                            }
                            //if (t.areas == null || t.areas.length == 0) {
                            //    downAreas(function () {
                            //        updateLayerArea(areaCodes);
                            //    }, GDYB.GridProductClass.currentUserDepart.departCode);
                            //}
                            //else
                            //    updateLayerArea(areaCodes);
                            updateLayerArea(areaCodes);
                        }
                    }
                    break;
                }
            }
            displayStatus(id, false);
            displayMessage(id);
        }

        function displayMessage(id) {
            var url = gridServiceUrl + "services/GridService/getProductSendInfo";
            $.ajax({
                data: { "para": "{productId:'" + id + "'}" },
                url: gridServiceUrl + "services/ForecastfineService/getForecastMessage",
                dataType: "json",
                type: "POST",
                success: function (data) {
                    var content = "";
                    for (var i = 0; i < data.length; i++) {
                        var className = "messageDetail";
                        var style = "margin-left: 20px;"
                        data[i].departName = data[i].departName.split("气象台")[0];
                        data[i].content = data[i].content.replace("000001", "\n");
                        if (data[i].departCode == GDYB.GridProductClass.currentUserDepart.departCode) {
                            className = "messageDetailMe";
                            style = "text-align: right;margin-right: 20px;"
                            data[i].departName = "";
                        }
                        content += "<div style='margin-top: 5px;float: left;width: 100%;'>" +
                            "<div style='" + style + "color: rgb(128,128,128);'>" + data[i].departName + " <span style='color: rgb(164,137,138);'>" + data[i].updateTime.split("-")[1] + "-" + data[i].updateTime.split("-")[2] + "</span></div>" +
                            "<div class='" + className + "'>" + data[i].content + "</div>" +
                            "</div>";
                    }
                    $("#divMessage").html(content);
                    $("#divMessage")[0].scrollTop = $("#divMessage")[0].scrollHeight;
                },
                error: function (e) {

                }
            });
        }

        function displayStatus(id, needToUpdateStatus) {
            var url = gridServiceUrl + "services/GridService/getProductSendInfo";
            $.ajax({
                data: { "para": "{productId:'" + id + "'}" },
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    t.departNames = ["兰州中心", "兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "张掖", "平凉", "酒泉", "庆阳", "定西", "陇南", "临夏", "甘南"];
                    if (typeof (data) != "undefined") {
                        var html = "";
                        var htmlW = "";
                        var read = false;
                        for (var key in data) {
                            var info = data[key];
                            /*html+="<div>"+info.receiveTime + " " + info.receiveDepartName + "（已读）</div>";*/
                            var departName = info.receiveDepartName.split("气象台")[0];
                            html = departName + " " + html;
                            htmlW = "<span>" + departName + "</span>" + htmlW;
                            t.departNames.splice(t.departNames.indexOf(departName), 1)
                            if (info.receiveDepartCode == GDYB.GridProductClass.currentUserDepart.departCode)
                                read = true;
                        }
                        var unreadHtml = "";
                        var unreadHtmlW = "";
                        for (var i = 0; i < t.departNames.length; i++) {
                            unreadHtml += t.departNames[i] + " "
                            unreadHtmlW += "<span>" + t.departNames[i] + "(未读)</span>"
                        }
                        $("#divRead").html(html);
                        $("#divUnread").html(unreadHtml);
                        $("#divReadW").html(htmlW);
                        $("#divUnreadW").html(unreadHtmlW);
                        $(".messageUL").find("span").click(function () {
                            $("#chatText").val($("#chatText").val() + $(this).html().split("(")[0] + "、");
                        });
                        //设置为已读
                        if (!read && needToUpdateStatus)
                            setStatus(id);
                    }
                },
                error: function (e) {
                    alert("获取产品发送状态错误：" + e.statusText);
                }
            });
        }

        function setStatus(id) {
            var info = null;
            for (var key in t.datasetGridInfos) {
                info = t.datasetGridInfos[key];
                if (info.id == id)
                    break;
            }
            if (info == null)
                return;

            var date = new Date();
            var receiveTime = date.getFullYear() + "-" + (Array(2).join(0) + (date.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + date.getDate()).slice(-2) + " " + (Array(2).join(0) + date.getHours()).slice(-2) + ":" + (Array(2).join(0) + date.getMinutes()).slice(-2) + ":" + (Array(2).join(0) + date.getSeconds()).slice(-2);
            var remark = "";
            var url = gridServiceUrl + "services/GridService/saveProductSendInfo";
            $.ajax({
                data: {
                    "para": "{productId:" + info.id + ",sendFrom:'" + info.departCode + "',receiveDepartCode:'" + GDYB.GridProductClass.currentUserDepart.departCode
                    + "',receiveDepartName:'" + GDYB.GridProductClass.currentUserDepart.departName + "',receiveTime:'" + receiveTime + "',status:1,remark:'" + remark + "'}"
                },
                url: url,
                dataType: "json",
                type: "POST",
                success: function (data) {
                    if (typeof (data) == "undefined" || !data)
                        alert("更新产品接收状态错误");
                    else {
                        displayStatus(id, false);
                        getNewCalamityGridInfos();
                    }
                },
                error: function (e) {
                    alert("更新产品接收状态错误：" + e.statusText);
                }
            });
        }

        function getGrid(element, type, level, hourspan, maketime, version, datetime) {
            GDYB.GridProductClass.getGrid(function (datasetGrid) {
                t.layerFillRangeColor.setDatasetGrid(datasetGrid);
                t.layerFillRangeColor.refresh();
                /*var map = GDYB.Page.curPage.map;
                if(datasetGrid.deltaX == 0.5){
                    map.zoomTo(map.getZoom()>7?map.getZoom():7);
                }
                else if(datasetGrid.deltaX == 0.25){
                    map.zoomTo(map.getZoom()>10?map.getZoom():10);
                }
                else if(datasetGrid.deltaX == 0.125){
                    map.zoomTo(map.getZoom()>12?map.getZoom():12);
                }*/
            }, element, type, level, hourspan, maketime, version, datetime, false);
        }

        function saveGridProduct(recall, makeTime, forecastTime, hourSpan, datasetGrid, content, areaCodes) {
            if (datasetGrid == null)
                return;
            if (GDYB.GridProductClass.currentUserName == null)
                return;

            var id = -1;
            var subjective = 1;
            var nwpModel = areaCodes; //用这个字段来存吧
            var nwpModelTime = "";
            var element = t.currentType; //类型：潜势预报（Potential Forecast,pf）；潜势预警（Potential Warning，pw）
            var departCode = GDYB.GridProductClass.currentUserDepart.departCode;
            var userName = GDYB.GridProductClass.currentUserName;
            var forecaster = GDYB.GridProductClass.currentUserDepart.departName;
            var issuer = GDYB.GridProductClass.currentUserDepart.departName;
            //var hourSpan = 24;
            var totalHourSpan = 24;
            var version = "p";
            //            var date = new Date();
            //            var makeTime = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":00";
            //            var forecastTime = typeof(forecastTime)=="undefined"?makeTime:forecastTime;
            var type = GDYB.GridProductClass.currentType;
            var level = 1000;
            var remark = content;//$("#yjqs_txtContent").val();

            GDYB.GridProductClass.saveGridProductCommon(recall, datasetGrid, id, departCode, type, element, forecastTime, hourSpan, totalHourSpan, level, version, nwpModel, nwpModelTime, userName, forecaster, issuer, makeTime, subjective, remark);
        }

        function createDatasetGrid() {
            var left = 92;
            var top = 43;
            var right = 109;
            var bottom = 32;
            var gridDis;
            if ($(".menu_changeDiv").find(".active").attr("name") == "yjqs")
                gridDis = parseFloat($("#divGridDistance").find("button.active").html());
            else
                gridDis = parseFloat($("#dqqs_divGridDistance").find("button.active").html());
            var rows = (top - bottom) / gridDis;
            var cols = (right - left) / gridDis;
            var defaultValue = 0;
            var datasetGrid = new WeatherMap.DatasetGrid(left, top, right, bottom, rows, cols);
            datasetGrid.noDataValue = -9999;
            var grid = [];
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    grid.push(defaultValue);
                }
            }
            datasetGrid.grid = grid;
            datasetGrid.dMin = defaultValue;
            datasetGrid.dMax = defaultValue;
            return datasetGrid;
        }

        function init() {
            if (GDYB.GridProductClass.currentUserDepart == null)
                GDYB.GridProductClass.init();
            t.currentElement = { name: "stsp", caption: "雷暴", value: 2 };
            t.currentHourSpan = 12;
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
                $("#div_legend_items3").find("div").css("width", "100px");
            }

            if (t.currentIntervalID != null) {
                clearInterval(t.currentIntervalID);
                t.currentIntervalID = null;
            }
            queryProductsRecent();
            //轮询
            t.currentIntervalID = setInterval(function () {
                if (GDYB.Page.curPage != GDYB.QDLQSYBPage) {
                    clearInterval(t.currentIntervalID);
                    return;
                }
                queryProductsRecent();
            }, 1000 * 10);
            //下载地区
            downAreas(null, GDYB.GridProductClass.currentUserDepart.departCode)
        }

        t.layerFillRangeColor = null;
        t.layerArea = null;
        t.layerLuoqu = null;
        t.drawLuoqu = null;
    };

    function clearElement(obj) {

    }

    function clearAllElement() {

    }

    function displayPhysic(obj) {
        if ($("#yubaoshixiao").find("td.active").length == 0) {
            hourspan = t.yubaoshixiaoTools.numbers[0];
            $("#yubaoshixiao").find("#" + t.yubaoshixiaoTools.numbers[0] + "h").addClass("active");
        }
        else {
            hourspan = $("#yubaoshixiao").find("td.active").html();
        }
        if (typeof (obj) != "undefined") {
            displayPhysicDetail(obj);
        }
        else {
            var list = $("#physicDiv").find("button.active");
            for (var i = 0; i < list.length; i++) {
                displayPhysicDetail(list[i]);
            }
        }
    }

    function displayPhysicDetail(obj) {
        var model_type = $("#model_type button.active")[0].id;
        var id = obj.length>0?obj[0].id:obj.id;
        var newID = model_type==""?id:model_type+"_"+id;
        if ($(obj).parent().attr("name") == "steam") {
            t.micapsDataClassSteam.displayMicapsData(function () { addLegend("physic") }, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if ($(obj).parent().attr("name") == "instable") {
            t.micapsDataClassInstable.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if ($(obj).parent().attr("name") == "uplift") {
            t.micapsDataClassUplift.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
        else if ($(obj).parent().attr("name") == "special") {
            t.micapsDataClassSpecial.displayMicapsData(null, newID, parseInt($("#physicHeight").find("button.active").html()), t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
        }
    }

    function clearPhysic(obj) {
        if ($(obj).parent().attr("name") == "steam") {
            t.micapsDataClassSteam.layerFillRangeColor.setDatasetGrid(null);
            t.micapsDataClassSteam.layerFillRangeColor.refresh();
        }
        else if ($(obj).parent().attr("name") == "instable") {
            t.micapsDataClassInstable.layerContour.removeAllFeatures();
        }
        else if ($(obj).parent().attr("name") == "uplift") {
            t.micapsDataClassUplift.layerContour.removeAllFeatures();
        }
        else if ($(obj).parent().attr("name") == "special") {
            t.micapsDataClassSpecial.layerContour.removeAllFeatures();
        }
    }
    function displayGrapes() {
        var hourspan = 3;
        if ($("#yubaoshixiao").find("td.active").length == 0) {
            hourspan = t.yubaoshixiaoTools.numbers[0];
            $("#yubaoshixiao").find("#" + t.yubaoshixiaoTools.numbers[0] + "h").addClass("active");
        }
        else {
            hourspan = $("#yubaoshixiao").find("td.active").html();
        }
        var name = $("#divNWPElement").find("button.active").attr("id");
        GDYB.MicapsDataClass.displayMicapsData(function () {
            addLegend(name);
            if(GDYB.MicapsDataClass.layerPlot){
                GDYB.MicapsDataClass.layerPlot.renderer.plotWidth = 0;
                GDYB.MicapsDataClass.layerPlot.renderer.plotHeight = 0;
                GDYB.MicapsDataClass.layerPlot.renderer.styles = [{
                    field:"站点值1",
                    type:"label",
                    visible:"true",
                    offsetX: 0,
                    offsetY: 8,
                    rotationField:null,
                    decimal:1,
                    noDataValue:9999.0,
                    style: {
                        fillOpacity:1.0,
                        fontFamily:"Arial",
                        fontColor:"rgb(255, 0, 0)",
                        fontSize:"14px",
                        fill: false,
                        stroke: false
                    }
                }];
                GDYB.MicapsDataClass.layerPlot.style = {pointRadius: 0.5};
                GDYB.MicapsDataClass.layerPlot.refresh();
            }
        }, name, 1000, t.myDateSelecter.getCurrentTime(false)/*"2016-05-16 08:00:00"*/, hourspan);
    }

    //注册时效点击事件
    function regesterYuBaoShiXiaoEvent() {
        $("#yubaoshixiao").find("td").click(function () {
            if ($("#physicDiv").find("button.active").length != 0) {
                displayPhysic();
            }
            else {
                displayGrapes();
            }
        });
    };

    //启用绘制落区
    function startDrawLuoqu() {
        t.layerLuoqu.removeAllFeatures();
        t.drawLuoqu.activate();
        stopDragMap();
    }

    //禁用绘制落区
    function stopDrawLuoqu() {
        startDragMap();
        if (t.drawLuoqu != null)
            t.drawLuoqu.deactivate();
        if (t.layerLuoqu != null)
            t.layerLuoqu.removeAllFeatures();
    }

    //禁用地图拖拽
    function stopDragMap() {
        var map = GDYB.Page.curPage.map;
        for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
            var handler = map.events.listeners.mousemove[i];
            if (handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag") {
                handler.obj.active = false;
            }
        }
    }

    //启用地图拖拽
    function startDragMap() {
        var map = GDYB.Page.curPage.map;
        for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
            var handler = map.events.listeners.mousemove[i];
            if (handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag") {
                handler.obj.active = true;
            }
        }
    }

    /*this.dealWithMessage = function(message){
        if(GDYB.Page.curPage != GDYB.QDLQSYBPage)
        return;
        if(message.productId == $("#divProductsOfRecent24H_qsyb").find("div.active").attr("id")){
            var content = "<div style='margin-top: 5px;border-bottom: 1px solid rgb(245,245,245);'>" +
                "<div style='color: rgb(59, 148, 255);'>"+message.departName+"<span style='color: rgb(164,137,138);margin-left: 10px;'>"+message.updateTime + "</span></div>" +
                "<div>"+message.content+"</div>" +
                "</div>"
            if($("#yjqs_divMessage").find("div").length == 0){
                $("#yjqs_divMessage").append(content);
            }
            else{
                $("#yjqs_divMessage").find("div").eq(0).before(content);
            }
        }
        else{
            var list = $("#divProductsOfRecent24H_qsyb").find("div");
            for(var i=0;i<list.length;i++){
                if(list[i].id == message.productId){
                    if($(list[i]).find("span").length == 0){
                        $(list[i]).append("<span style='color: red;' value='1'> (1)</span>");
                    }
                    else{
                        var num = parseInt($(list[i]).find("span").attr("value"))
                        $(list[i]).find("span").html("("+(num+1)+")").attr("value",num+1);
                    }
                    break;
                }
            }
        }
    }*/

    function drawLegend(context) {
        var legendDiv = document.getElementById("div_legend_items");
        var height = legendDiv.clientHeight;
        var top = $("#map")[0].clientHeight - height - 5;
        var list = $(legendDiv).find(".item");
        for (var i = 0; i < list.length; i++) {
            var width = $(list[i])[0].clientWidth;
            var left = i * width;
            context.fillStyle = $(list[i]).css("background-color");
            context.fillRect(left, top, width, height);
            context.fillStyle = 'rgb(255, 255, 255)';
            context.font = '12px Microsoft YaHei';
            context.fillText($(list[i]).html(), left + width / 2 - 5, top + height / 2 + 5);
        }
    }

    function drawPointCompleted(event) {
        var type = $(".divIcon").find(".imgActive").attr("name");
        var geometry = event.feature.geometry;
        t.drawLayer.removeAllFeatures();
        var geoVector = new WeatherMap.Feature.Vector(geometry);
        geoVector.style = {
            externalGraphic: 'imgs/qdl/' + type + '.png',
            graphicWidth: 12,
            graphicHeight: 12
        };
        t.iconLayer.addFeatures([geoVector]);
    }

    function getGridDatasetName(type, level, element, maketime, version, date, hour, num) {
        return "p_" + type + "_" + element + "_" + maketime + "_" + version + "_" + date + "_" + (Array(3).join(0) + hour).slice(-3) + "_" + level + "_" + num;
    }

    function saveArchive(productName, content, images, issueor, num, areaName, time, title, guide) {
        var url = archiveService + "services/ArchiveService/createProduct";
        $.ajax({
            data: { "para": "{templateName:'nowwarn.ftl',productName:'" + productName + ".doc',title:'" + title + "',issueor:'" + issueor + "',num:'" + num + "',areaName:'" + areaName + "',time:'" + time + "',content:'" + content + "',img:'" + images + "',guide: '" + guide + "'}" },
            url: url,
            dataType: "json",
            success: function (data) {
                if (data)
                    alert("文档生成成功");
                else
                    alert("文档生成失败");
                $("#guide").val("");
                t.isMaking = false;
            },
            error: function (data) {
            },
            type: "POST"
        });
    }

    function canvas2Image(callback) {
        var productLayers = [t.layerFillRangeColor, t.layerArea];
        //测试地图输出图片
        var map = GDYB.Page.curPage.map;
        var size = map.getCurrentSize();
        var memCanvasProduct = document.createElement("canvas");
        memCanvasProduct.width = size.w;
        memCanvasProduct.height = size.h;
        memCanvasProduct.style.width = size.w + "px";
        memCanvasProduct.style.height = size.h + "px";
        var memContextProduct = memCanvasProduct.getContext("2d");
        for (var i = 0; i < map.layers.length; i++) {
            var flag = false;
            for (var j = 0; j < productLayers.length; j++) {
                if (productLayers[j] != null && productLayers[j].id == map.layers[i].id) {
                    flag = true;
                    break;
                }
            }

            if (map.layers[i].id.indexOf("LocalTiledCache") != -1 || map.layers[i].id.indexOf("TianDiTu") != -1)
                flag = true;
            if (!flag)
                continue;
            if (typeof (map.layers[i].canvasContext) != "undefined") {
                var layerCanvas = map.layers[i].canvasContext.canvas;
                memContextProduct.drawImage(layerCanvas, 0, 0, layerCanvas.width, layerCanvas.height);
            }
            else if (typeof (map.layers[i].renderer) != "undefined" && typeof (map.layers[i].renderer.canvas) != "undefined") {
                var layerCanvas = map.layers[i].renderer.canvas.canvas;
                memContextProduct.drawImage(layerCanvas, 0, 0, layerCanvas.width, layerCanvas.height);
            }
        }
        drawCanvas($("#div_legend"), function (legendCanvas) {
            memContextProduct.drawImage(legendCanvas, 15, memCanvasProduct.height - 44, legendCanvas.width, legendCanvas.height);
            addCanvasBorder(memContextProduct, memCanvasProduct.width, memCanvasProduct.height);
            addCanvasTitle(memContextProduct, "0到6小时潜势预报");
            var image = memCanvasProduct.toDataURL("image/png");
            image = image.split(",")[1];
            callback(image);
        });
    }

    function addCanvasBorder(context, width, height) {
        context.beginPath();
        context.rect(0, 0, width - 8, height - 8);
        context.lineWidth = 4;
        context.strokeStyle = 'rgb(144,144,144)';
        context.stroke();
        context.beginPath();
        context.rect(4, 4, width - 12, height - 12);
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(74,74,74)';
        context.stroke();
        context.beginPath();
        context.rect(8, 8, width - 20, height - 20);
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(36,36,36)';
        context.stroke();
    }

    function addCanvasTitle(context, content) {
        var size = GDYB.Page.curPage.map.getCurrentSize();
        context.font = '28px Microsoft YaHei bold';
        context.fillText(content, size.w / 2 - content.length * 12, 50);
    }

    function drawCanvas($div, callback) {
        //截取对应的html将其转换成画布再输出图片
        if ($div.length > 0) {
            html2canvas($div, {
                //height: $div.outerHeight()+20,
                height: $div.height(),
                width: $div.width(),
                allowTaint: false,
                taintTest: false,
                onrendered: function (canvas) {
                    if (typeof callback == "function") {
                        callback(canvas);
                    }
                }
            });
        }
    }

    //添加图例
    function addLegend(radarName) {
        var heatMapStyle;
        var colors;
        var legend;
        if (radarName == "physic") {
            heatMapStyle = heatMap_TempStyles;
            colors = [];
            legend = GDYB.Legend2;
        }
        else if (radarName == "grapes_3km_rain") {
            heatMapStyle = heatMap_Rain24Styles;
            colors = [];
            legend = GDYB.Legend;
        }
        else if (radarName == "grapes_3km_cr") {
            heatMapStyle = heatMap_RadarStyles;
            colors = [];
            legend = GDYB.Legend;
        }
        else if (radarName == "prob_ncep_rain" || radarName == "prob_ncep_hail") {
            heatMapStyle = heatMap_RHStyles;
            colors = [];
            legend = GDYB.Legend;
        }
        else {
            var heatMapStyle = null;
        }
        if (heatMapStyle != null) {
            if (t.color[radarName] && t.color[radarName].length == 0)
                t.color[radarName] = colors;
            legend.update(heatMapStyle);
            //注册点击事件
            $("#" + legend.name).find("div").click(function () {
                colors = [];
                var layer;
                if (radarName == "physic") {
                    layer = t.micapsDataClassSteam.layerFillRangeColor;
                }
                else {
                    layer = GDYB.MicapsDataClass.layerFillRangeColor;
                }
                if (layer == null)
                    return;
                var styles = heatMapStyle;
                var legenItemValue = Number($(this).attr("tag"));
                var bvisible = typeof (this.attributes["visible"]) == "undefined" || this.attributes["visible"].value == "true";
                if (bvisible) {
                    $(this).css("background-color", "rgb(255, 255, 255)");
                    $(this).attr("visible", "false");
                }
                else {
                    var rgb = legend.items[legenItemValue];
                    $(this).css("background-color", rgb);
                    $(this).attr("visible", "true");
                }

                for (var key in styles) {
                    var style = styles[key];
                    var value = Math.floor(style.end * 10) / 10;
                    if (value == legenItemValue) {
                        style["visible"] = !bvisible;
                    }
                    if (typeof (style["visible"]) != "undefined" && !style["visible"])
                        colors.push({ r: style.startColor.red, g: style.startColor.green, b: style.startColor.blue });
                }
                t.color[radarName] = colors;
                layer.transparentColors = colors;
                layer.redraw();
            });
        }
    }

    //隐藏图例
    function hiddenLegend(radarName) {
        var legend = null;
        if (radarName == "physic") {
            legend = GDYB.Legend2;
        }
        else {
            legend = GDYB.Legend;
        }
        if (legend != null)
            legend.update(null);
    }

    //获取雷达数据最后一个文件的名称转时间格式
    function getTimeOfLastData(recall){
        var fileUrl = "U:/gfs_song/Q/850";
        var url= gsDataService + "services/DBService/getLastFileName";
        $("#div_progress_title").html("正在获取起报时间");
        $("#div_progress").css("display", "block");
        $.ajax({
            data: {"para": "{url:'"+fileUrl+"'}"},
            url: url,
            dataType: "text",
            type: "POST",
            success: function (data) {
                $("#div_progress").css("display", "none");
                if(typeof(data) != "undefined" && data.length>0)
                {
                    t.newRaderDataTime = data.substr(0,4)+"-"+data.substr(4,2)+"-"+data.substr(6,2)+" "+data.substr(8,2)+":00:00";
                    recall&&recall();
                }
            },
            error: function(e){
                $("#div_progress").css("display", "none");
                alertModal("获取雷达数据出错："+ e.statusText);
            }
        });
    }
}
QDLQSYBPageClass.prototype = new PageBase();