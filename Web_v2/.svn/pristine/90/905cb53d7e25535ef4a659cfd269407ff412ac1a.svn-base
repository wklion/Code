/**
 * Created by Administrator on 2016/5/17.
 */
function QDLSKPageClass() {
    this.layerPlot = null;
    this.realTime = true;
    this.runFlag = true;
    this.animation = false;
    this.keyDown = false;
    this.animatorLayer = null; //地图动画层
    var t = this;
    /** 以下内容是从ZHJCSKPageClass.js 中移植而来 */
    this.stationPlot = null;
    this.myDateSelecter1 = null;
    this.myDateSelecter2 = null;
    this.station_country = null;
    this.station_town = null;
    this.$selModel = null;
    this.audioCtl = null;
    var stationLayer = null;
    /** end */
    /**用户区域范围控制*/
    this.departCode = $.cookie("departCode");
    this.departRangeArr = [];

    this.haveNewForcast = false;
    this.isFirstAlert = 0;

    this.renderMenu = function () {
        var testStr = `
        <div id="zhjcElement">
            <div class="sk-alerm-title" data-flag="tiantu" data-status="false" style="display: block; font-size: 16px; color: #fff; cursor: pointer;margin-left:10px;"><i class="fa fa-eye-slash"></i> 综合填图</div>
            <div id="stationType" style="height: 22px;margin: 5px 0px 0px 10px;float: left;width: 150px;padding-left:10px;">
                <div style="margin: 0px 5px;" id="quyz" class="rhjcHourSpan active">
                    区域站
                </div>
                <div style="margin: 0px 5px 0px 20px;" id="benz" class="rhjcHourSpan">
                    本站
                </div>
            </div>
            <div id="timeType" style="height: 22px;margin: 5px 0px 0px 10px;padding-left:10px;">
                <div style="margin: 0px 5px;" id="time5Min" class="rhjcHourSpan active">
                    5分钟
                </div>
                <div style="margin: 0px 5px 0px 20px;" id="timeHour" class="rhjcHourSpan">
                    小时
                </div>
            </div>
            <div id="ysElement" style='padding-left:10px;'>
                <div style="height: 22px;margin: 20px 0px 0px 10px;">
                    <div style="margin: 0px 5px;" id="ys_jiangs" class="rhjcHourSpan active" flag="0">降水</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_qiw" class="rhjcHourSpan" flag="1">气温</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_gaow" class="rhjcHourSpan" flag="2">最高温</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_diw" class="rhjcHourSpan" flag="3">最低温</div>
                </div>
                <div style="height: 22px;margin: 5px 0px 0px 10px;">
                    <div style="margin: 0px 5px;" id="ys_feng" class="rhjcHourSpan" flag="4">风</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_jdfeng" class="rhjcHourSpan" flag="5">极大风</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_shid" class="rhjcHourSpan" flag="6">湿度</div>
                    <div style="margin: 0px 5px 0px 20px;" id="ys_qiy" class="rhjcHourSpan" flag="7">气压</div>
                </div>
            </div>
            <div id="skElement_copy" style='border-bottom: 1px solid #2aa5d1;padding:0 0 10px 10px;'>
                <div style="height: 22px;margin: 20px 0px 0px 10px;">
                    <div style="margin: 0px 5px 0px 5px;" id="rhjc_wu" class="rhjcHourSpan" flag="6">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/wu.png" />雾
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_shuangd" class="rhjcHourSpan " flag="7">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/shuangd.png" />霜冻
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_yangs" class="rhjcHourSpan " flag="8">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/yangs.png" />扬沙
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_fuc" class="rhjcHourSpan " flag="9">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/fuc.png" />浮尘
                    </div>
                </div>
                <div style="height: 22px;margin: 5px 0px 0px 10px;">
                    <div style="margin: 0px 5px 0px 5px;" id="rhjc_hanc" class="rhjcHourSpan" flag="10">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/hanc.png" />寒潮
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_baox" class="rhjcHourSpan " flag="11">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/baox.png" />暴雪
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_wum" class="rhjcHourSpan " flag="12">
                        <img style="width:15px;margin: -3px 2px 0px -8px;" src="imgs/zhjc/mai.png" />霾
                    </div>
                    <div style="margin: 0px 5px 0px 20px;" id="rhjc_gaow" class="rhjcHourSpan " flag="13">
                        <img style="width:15px;margin: -3px 2px 0px 0px;" src="imgs/zhjc/gaow.png" />高温
                    </div>
                </div>
                <div style="height: 22px;margin: 5px 0px 0px 10px;">
                    <div style="margin: 0px 5px 0px 5px;" id="rhjc_shacb" class="rhjcHourSpan" flag="14">
                        沙尘暴
                    </div>
                </div>
            </div>`;
        var htmlStr = ""
            + "<div style='padding-top: 15px;'>"
            + testStr
            + "<div id='skElement' style='border-bottom: 1px solid #2aa5d1;padding:0 0 10px 10px;'>"
            + "<div class='sk-alerm-title' data-flag='baojing' data-status='true' style='display: block; font-size: 16px; color: #fff; margin-top: 10px; cursor: pointer;'><i class='fa fa-eye'></i> 灾害报警</div>"
            + "<div style='height: 22px;margin: 5px 0px 0px 10px;'>"
            + "<button id='rhjc_df' class='rhjcHourSpan' flag='0'>大风</button>"
            + "<img src='./imgs/dafeng1.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span>17-25</span>"
            + "<img src='./imgs/dafeng2.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span>25-30</span>"
            + "<img src='./imgs/dafeng3.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span>>30</span>"
            + "</div>"
            + "<div style='height: 22px;margin: 5px 0px 0px 10px;'>"
            + "<button id='rhjc_dq' class='rhjcHourSpan active' flag='1'>短强</button>"
            + "<span class='el-mark' style='display: none;'><em class='icon-wrap'><i class='fa fa-circle'></i></em>&gt;5</span>"
            // + "<img src='./imgs/duanqiang1.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span class='el-mark'><em class='icon-wrap'><i class='fa fa-circle'></i></em>20-30</span>"
            // + "<img src='./imgs/duanqiang2.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span class='el-mark'><em class='icon-wrap'><i class='fa fa-circle'></i></em>30-50</span>"
            // + "<img src='./imgs/duanqiang3.png' style='margin: 0px 5px 0px 10px;'>"
            + "<span class='el-mark'><em class='icon-wrap'><i class='fa fa-circle'></i></em>&gt;50</span>"
            + "</div>"
            + "<div style='height: 22px;margin: 5px 0px 0px 10px;'><button id='rhjc_yl' class='rhjcHourSpan' flag='5'>雨量</button><img src='./imgs/yuliang1.png' style='margin: 0px 5px 0px 9px;'><span>0-10</span><img src='./imgs/yuliang2.png' style='margin: 0px 5px 0px 9px;'>10-25<img src='./imgs/yuliang3.png' style='margin: 0px 5px 0px 9px;'>25-50<img src='./imgs/yuliang4.png' style='margin: 0px 5px 0px 9px;'>>50</div>"
            + "<div style='height: 22px;margin: 5px 0px 0px 10px;'>"
            + "<button id='rhjc_bb' class='rhjcHourSpan' flag='2'>冰雹</button>"
            + "<img src='./imgs/bingbao.png' style='margin: 0px 15px 0px 12px;float: left;'>"
            + "<button id='rhjc_sd' class='rhjcHourSpan' flag='3'>闪电</button>"
            + "<img src='./imgs/shandian.png' style='margin: 0px 15px 0px 12px;float: left;'>"
            + "<button id='rhjc_5min_yl' class='rhjcHourSpan active' flag='4'>5分钟雨量</button>"
            + "<img src='./imgs/qdl/5min_yl.png' style='margin: 2px 15px 0px 12px;float: left;'>"
            + "</div>"
            + "</div>"
            + "<div style='padding-top: 10px;'>"
            + "<div id='timeChoose' class='btn_line3' >"
            + "<input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'>"
            + "<label for='timeRadio' style='display: inline-block;cursor: pointer;color: #4DB8D7;'>实时</label>"
            + "<span id='nowTime' style='margin-left: 15px;line-height: 22px;'></span>"
            + "</div>"
            + "<div id='hourSpan' class='btn_line3' style='height: 30px;'>"
            + "<input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'>"
            + "<label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color: #4DB8D7;'>时段</label>"
            + "<div class='rhjcHourSpan' style='width: 50px;'>20min</div>"
            + "<div class='rhjcHourSpan' style='width: 50px;margin-left: 8px;'>40min</div>"
            + "<div class='rhjcHourSpan' style='width: 50px;margin-left: 8px;'>3H</div>"
            + "<div class='rhjcHourSpan' style='width: 50px;margin-left: 8px;'>6H</div>"
            + "</div>"
            + "<div class='btn_line3' style='width: 100%;height: 34px;'>"
            + "<span style='float: left;margin: 0px 4px 0px 34px;'>从：</span>"
            + "<div id='dateSelect1' class='dateSelect' style='float: left;height: 26px;'></div>"
            + "</div>"
            + "<div class='btn_line3' style='width: 100%;height: 34px;'>"
            + "<span style='float: left;margin: 0px 4px 0px 34px;'>到：</span>"
            + "<div id='dateSelect2' class='dateSelect' style='float: left;height: 26px;'></div>"
            + "</div>"
            + "<div id='query_action' class='btn_line3' style='height: 30px;'>"
            + "<div class='rhjcQueryTime' style='margin-left: 10px;'>查询</div>"
            + "<div class='rhjcQueryTime'>动画</div>"
            + "<div class='rhjcQueryTime'>累加</div>"
            + "<select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 20px;background-color: #1b546d;color: white;border: 1px solid rgb(49, 202, 255);'>"
            + "<option>1</option>"
            + "<option>2</option>"
            + "<option>3</option>"
            + "<option>4</option>"
            + "<option>5</option>"
            + "</select>"
            + "</div>"
            + "<div id='timeListDiv' class='timeListDiv'></div>"
            + "</div>"
            + "</div>";

        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change active'>强天气</div><div name='yjqs' class='menu_change' style='margin-top: 5px;'>雷达</div><div id='messageNum_yjqs' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>云图</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>融合监测</div>");
        $('#timeListDiv').css({ top: '555px' });
        this.myDateSelecter1 = new DateSelecter(0, 1, 5); //最小视图为天
        //this.myDateSelecter1.setCurrentTime("2017-06-20 08:00:00"); //演示用
        this.myDateSelecter1.changeHours(-3 * 60);
        this.myDateSelecter1.intervalMinutes = 60 * 24; //12小时
        this.myDateSelecter2 = new DateSelecter(0, 1, 5); //最小视图为天
        //this.myDateSelecter2.setCurrentTime("2017-06-21 08:00:00"); //演示用
        this.myDateSelecter2.intervalMinutes = 60 * 24; //12小时
        $("#dateSelect1").append(this.myDateSelecter1.div);
        $("#dateSelect2").append(this.myDateSelecter2.div);
        $("#dateSelect1").find("input").css("width", "225px");
        $("#dateSelect2").find("input").css("width", "225px");
        $("#dateSelect1").find("img").css("display", "none");
        $("#dateSelect2").find("img").css("display", "none");
        $("#dateSelect1").find("input").css("border", "1px solid #31CAFF").css("box-shadow", "none").css("color", "#31CAFF");
        $("#dateSelect2").find("input").css("border", "1px solid #31CAFF").css("box-shadow", "none").css("color", "#31CAFF");

        this.myPanel_YSTJ = new Panel_YSTJ($("#map_div"));
        this.layerPlot = new WeatherMap.Layer.Vector("layerMicapsPlot", { renderers: ["Plot"] });
        this.stationPlot = new WeatherMap.Layer.Vector("stationPlot", { renderers: ["Plot"] });//气象要素综合填图
        stationLayer = new WeatherMap.Layer.Vector("stationLayer", { renderers: ["Canvas"] });//站点图层

        //演示：初始化不显示
        plotStyles_rhjc[1].visible = false;
        plotStyles_rhjc[3].visible = false;
        plotStyles_rhjc[4].visible = false;
        plotStyles_rhjc[5].visible = false;

        plotStyles_zhjc[0].visible = true;
        plotStyles_zhjc[1].visible = false;
        plotStyles_zhjc[2].visible = false;
        plotStyles_zhjc[3].visible = false;
        plotStyles_zhjc[4].visible = false;
        plotStyles_zhjc[5].visible = false;
        plotStyles_zhjc[6].visible = false;
        plotStyles_zhjc[7].visible = false;
        plotStyles_zhjc[8].visible = false;
        plotStyles_zhjc[9].visible = false;
        plotStyles_zhjc[10].visible = false;
        plotStyles_zhjc[11].visible = false;
        plotStyles_zhjc[12].visible = false;
        plotStyles_zhjc[13].visible = false;
        plotStyles_zhjc[14].visible = false;
        plotStyles_zhjc[15].visible = false;
        plotStyles_zhjc[16].visible = false;

        this.layerPlot.style = { fill: false };
        this.stationPlot.style = { fill: false };
        this.layerPlot.renderer.styles = plotStyles_rhjc;
        this.layerPlot.renderer.plotWidth = 0;
        this.layerPlot.renderer.plotHeight = 0;
        //气象要素图层样
        this.stationPlot.renderer.styles = plotStyles_zhjc;
        this.stationPlot.renderer.plotWidth = 0;
        this.stationPlot.renderer.plotHeight = 0;
        GDYB.Page.curPage.map.addLayers([this.layerPlot]);
        GDYB.Page.curPage.map.addLayers([this.stationPlot]);
        GDYB.Page.curPage.map.addLayer(stationLayer);
        GDYB.Legend.update(null);
        // 初始时，隐藏要素
        this.stationPlot.setVisibility(false);
        //初始化动画图层
        initAnimator();
        getAreaStation();
        getCouStation();
        function getAreaStation() {
            var stationType = 'w%';
            var stationName = '%%';
            var url = gsDataService + "services/DBService/getAllStations";
            $.ajax({
                type: "POST",
                data: { "para": "{type:" + stationType + ",name:" + stationName + "}" },
                url: url,
                dataType: "json",
                async:false,
                success: function (data) {
                    t.station_town = data;
                },
                error: function () {
                    alertModal("获取区域站点信息出错");
                }
            });
        }
        function getCouStation() {
            var stationType = '5%';
            var stationName = '%%';
            var url = gsDataService + "services/DBService/getAllStations";
            $.ajax({
                type: "POST",
                data: { "para": "{type:" + stationType + ",name:" + stationName + "}" },
                url: url,
                dataType: "json",
                async:false,
                success: function (data) {
                    t.station_country = data;
                },
                error: function () {
                    alertModal("获取国家站点信息出错");
                }
            });
        }
        //选项卡切换
        $(".menu_changeDiv").find(".menu_change").click(function (e) {
            if ($(this).hasClass("active"))
                return;
            $("#messageDivs").hide();
            $(".menu_changeDiv").find(".active").removeClass("active");
            if ($(this).html() == "强天气") {
                GDYB.Page.curPage && GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLSKPage;
                GDYB.QDLSKPage.active();
            }
            else if ($(this).html() == "雷达") {
                GDYB.Page.curPage && GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLLDPage;
                GDYB.QDLLDPage.active();
            }
            else if ($(this).html() == "云图") {
                GDYB.Page.curPage && GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLYTPage;
                GDYB.QDLYTPage.active();
            }
            else if ($(this).html() == "融合监测") {
                GDYB.Page.curPage && GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLRHJCPage;
                GDYB.QDLRHJCPage.active();
            }
        });

        //站点点击显示  数据图表
        var callbacks = {
            click: function (currentFeature) {
                var ObservTimesEnd = "";
                var ObservTimesStart = "";
                var tableName = "";
                if ($("#timeType").find(".active").attr("id") == "timeHour") {
                    var date = new Date();
                    ObservTimesEnd = dateToTimeStation(date);
                    date.setDate(date.getDate() - 1);
                    //date.setHours(date.getHours() - 2);
                    ObservTimesStart = dateToTimeStation(date);
                    tableName = "HIS_HOUR_";
                    ObservTimesStart = ObservTimesStart.substr(0, ObservTimesStart.length - 2);
                    ObservTimesEnd = ObservTimesEnd.substr(0, ObservTimesEnd.length - 2);
                } else {
                    var date = new Date();
                    ObservTimesEnd = dateToTimeStation(date);
                    date.setHours(date.getHours() - 1);
                    date.setMinutes(date.getMinutes() - 5);
                    ObservTimesStart = dateToTimeStation(date);
                    tableName = "HIS_REALDATA_";
                    //ObservTimesStart = ObservTimesStart.substr(0, ObservTimesStart.length - 2);
                    //ObservTimesEnd = ObservTimesEnd.substr(0, ObservTimesEnd.length - 2);
                }
                getOneStationDetail(tableName + ObservTimesEnd.substr(0, 6), ObservTimesStart, ObservTimesEnd, currentFeature.attributes.StaID, function (data) {
                    displayStationChart(data, currentFeature)
                });
            }
        };
        var selectFeature = new WeatherMap.Control.SelectFeature(stationLayer, {
            callbacks: callbacks
        });
        GDYB.Page.curPage.map.addControl(selectFeature);
        selectFeature.activate();

        $("#skElement").find(".rhjcHourSpan").click(function () {
            var eleName = "";
            var eleFeatures = t.animatorLayer.features;
            var featureSize = eleFeatures.length;
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
                eleName = flagToElement(parseInt($(this).attr("flag")));
                for (var i = 0; i < featureSize; i++) {
                    if (eleName == eleFeatures[i].data.EleName)
                        eleFeatures[i].style.display = "none";
                }
                if (eleName == "短时强降水") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 2].visible = false;
                }
                if (eleName == "雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = false;
                }
                if (eleName == "5分钟雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = false;
                }
                t.layerPlot.redraw();
            }
            else {
                $(this).addClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
                eleName = flagToElement(parseInt($(this).attr("flag")));
                for (var i = 0; i < featureSize; i++) {
                    if (eleName == eleFeatures[i].data.EleName)
                        eleFeatures[i].style.display = "block";
                }
                if (eleName == "短时强降水") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 2].visible = true;
                }
                if (eleName == "雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = true;
                }
                if (eleName == "5分钟雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = true;
                }
                t.layerPlot.redraw();
            }
        });

        /** 以下内容是从ZHJCSKPageClass.js 中移植而来 */
        //气象灾害点击事件
        $("#skElement_copy").find(".rhjcHourSpan").click(function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
                t.layerPlot.redraw();
            } else {
                $(this).addClass("active");
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
                t.layerPlot.redraw();
            }
            if ($("#hourRadio")[0].checked) {
                $("#ysElement").find(".active").removeClass("active");
                t.stationPlot.removeAllFeatures();
                stationLayer.removeAllFeatures();
                getAllShiKuangByTimes();
            } else {
                getNewShiKuang();
            }
        });

        //气象要素点击事件
        $("#ysElement").find(".rhjcHourSpan").click(function () {
            if ($("#hourRadio")[0].checked) {
                $("#skElement_copy").find(".active").removeClass("active");
                $("#ysElement").find(".active").removeClass("active");
                $(this).addClass("active");
                displayControl();
                getStationShiKuangByTimes();
            } else {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = false;
                    t.stationPlot.redraw();
                } else {
                    $(this).addClass("active");
                    plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = true;
                    t.stationPlot.redraw();
                }
                displayControl();
                getNewStationSK();
            }
        });

        $("#timeType").find(".rhjcHourSpan").click(function () {
            if ($(this).hasClass("active"))
                return;
            $(this).parent().find(".rhjcHourSpan").removeClass("active");
            $(this).addClass("active");
            if ($("#timeRadio")[0].checked) {
                getNewStationSK();
            } else {
                getStationShiKuangByTimes();
            }
        });

        $("#query_action").find("div").click(function () {
            if ($(this).html() == "查询" || $(this).html() == "累加") {
                t.animation = false;
                if ($("#hourRadio")[0].checked) {
                    if ($("#zhjcElement div.sk-alerm-title[data-flag='tiantu']").attr("data-status") == "false") {
                        getAllShiKuangByTimes();
                    } else {
                        t.animatorLayer.removeAllFeatures();
                        getStationShiKuangByTimes();
                    }
                    refreshTitleDiv();
                } else {
                    alertModal("当前为实时");
                }
            } else if ($(this).html() == "动画") {
                if ($("#hourRadio")[0].checked) {
                    if ($("#timeListDiv").find("div").length > 0) {
                        $(this).html("停止");
                        if (!t.animation) {
                            t.animation = true;
                            animationShiKuang();
                        }
                    } else {
                        alertModal("无查询结果");
                    }
                } else {
                    alertModal("当前为实时");
                }
            } else if ($(this).html() == "停止") {
                $(this).html("动画");
                t.animation = false;
            } else {
            }
        });
        $("#timeRadio").click(function () {
            t.realTime = true;
            t.animation = false;
            getNewStationSK();
            $("#timeListDiv").html("");
            t.myPanel_YSTJ.panel.css("display", "none");
            t.myPanel_YSTJ.panel.find(".ystjContent").html("");
            refreshTitleDiv();
        });
        $("#hourRadio").click(function () {
            t.realTime = false;
            $("#nowTime").html("");
            var nowTime = new Date();
            var nowTimeMin = Math.floor(nowTime.getMinutes()/5)*5;
            nowTime.setSeconds(0);
            nowTime.setMinutes(nowTimeMin);
            var nowTimeStr = dateToTimes(nowTime);
            t.myDateSelecter2.setCurrentTime(nowTimeStr.substr(0,nowTimeStr.length-4));
            $("#hourSpan").find("div")[0].click();
            refreshTitleDiv();
        });
        $("#hourSpan").find("div").click(function () {
            var timeText = $(this).html();
            switch (timeText) {
                case '20min':
                    t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                    t.myDateSelecter1.changeHours(-20);
                    break;
                case '40min':
                    t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                    t.myDateSelecter1.changeHours(-40);
                    break;
                case '3H':
                    t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                    t.myDateSelecter1.changeHours(-3 * 60);
                    break;
                case '6H':
                    t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                    t.myDateSelecter1.changeHours(-6 * 60);
            }
        });

        // 显示/隐藏填值图层
        $('.sk-alerm-title').click((e) => {
            $("#timeListDiv").empty();
            let flag = $(e.target).attr('data-flag');
            let status = $(e.target).attr('data-status');
            $('.sk-alerm-title').attr('data-status', 'false');
            $('.sk-alerm-title i').removeClass('fa-eye').addClass('fa-eye-slash');
            $(e.target).attr('data-status', 'true');
            $(e.target).find('i').removeClass('fa-eye-slash');
            $(e.target).find('i').addClass('fa-eye');
            t.stationPlot.setVisibility(false);
            t.layerPlot.setVisibility(false);
            if (flag == 'tiantu') {
                this.stationPlot.setVisibility(true);
                stationLayer.setVisibility(true);
                t.animatorLayer.removeAllFeatures();
                getNewStationSK();
            } else if (flag == 'baojing') {
                t.layerPlot.setVisibility(true);
                stationLayer.setVisibility(false);
            }
            refreshTitleDiv();
        });

        // 关闭报警音和提示框
        $('#alarm_modal_btn_submit').click((e) => {
            t.audioCtl.stop();
            t.$selModel.hide();
            t.animatorLayer.removeAllFeatures();
        });
        if (!this.keyDown) {
            this.keyDown = true;
            $(document).keydown(function (event) {
                if (GDYB.Page.curPage != GDYB.QDLSKPage)
                    return;
                var allEles = $("#timeListDiv").children("div");
                //alert(allEles.length+"   "+allEles.eq(0));
                if ($("#timeListDiv").find("div.active")) {
                    //键盘上下键控制数据
                    var offset = 0;
                    if (event.keyCode == 38) {//上
                        offset = -1;
                    } else if (event.keyCode == 40) {//下
                        offset = 1;
                    }
                    else
                        return;
                    if ($("#timeListDiv").find("div.active").length > 0) {
                        if (offset != 0) {
                            var cEle = $("#timeListDiv").find("div.active");
                            if (offset == 1) {
                                if (cEle.next().length != 0) {
                                    cEle.next().click();
                                }
                                return;
                            }
                            if (offset == -1) {
                                if (cEle.prev().length != 0) {
                                    cEle.prev().click();
                                }
                                return;
                            }
                        } else {
                            return;
                        }
                        //$("#timeListDiv").find("div.active").removeClass("active");
                    } else {
                        if (allEles.length > 0) {
                            allEles.eq(0).click();
                        }
                        return;
                    }
                }
            });
        }

        $("#stationType").find(".rhjcHourSpan").click(function () {
            if ($(this).hasClass("active"))
                return;
            $(this).parent().find(".rhjcHourSpan").removeClass("active");
            $(this).addClass("active");
            if ($("#timeRadio")[0].checked) {
                getNewStationSK();
            } else {
                getStationShiKuangByTimes();
            }
        });

        //初次进入页面触发一次实时点击事件
        $("#timeRadio").click();

        //加载登录用户区域范围
        loadAreaRangeData();

        $(".sk-alerm-title[data-flag='baojing']").click();

        setTimeout(function () {
            refreshTitleDiv();
        }, 500);
    };

    function loadAreaRangeData(){
        t.departRangeArr = [];
        var url = host+"/gdyb_test/data/areaRange.json";
        $.ajax({
            data:{},
            url:url,
            dataType:"json",
            type:"POST",
            success:function(datas){
                if(t.departCode.length == 2)
                    return;
                var departCodeSub = t.departCode.length == 4?t.departCode:t.departCodes.substr(0,4);
                if(datas != null) {
                    for(var i in datas){
                        if(datas[i].code == departCodeSub){
                            var areas = datas[i].area;
                            for(var a in areas){
                                t.departRangeArr.push(areas[a]);
                            }
                            break;
                        }
                    }
                }
            },
            error: function (e) {
                console.log("获取区域范围错误");
                alertModal("获取用户所在区域范围失败：" + e.statusText);
            }
        });
    }

    // 动画图层
    function initAnimator() {
        t.animatorLayer = new WeatherMap.Layer.AnimatorVector('animatorLayer', {
            rendererType: 'GlintAnimator'
        }, {
                repeat: true,
                speed: 1,
                startTime: 1,
                endTime: 1,
                frameRate: 12
            });
        t.animatorLayer.renderer.pointStyle = {
            fillColor: '#ff0000',
            pointRadius: 15,
            fillOpacity: 0.4
        };
        GDYB.Page.curPage.map.addLayer(t.animatorLayer);
    }

    /**
     * 添加动画至地图
     * @param  {Object}   attr  预警信号
     * @param  {Number}   index 索引
     */
    function addAnimator(data) {
        t.animatorLayer.removeAllFeatures();
        var style = { //点样式
            stroke: false,
            pointRadius: 0,
            outterRadius: 12
        };
        var pointFeatures = [];
        for (var i in data) {
            var contains = false;
            if (typeof (data[i].StaID) == "undefined")
                contains = true;
            for (var k in pointFeatures) {
                if (pointFeatures[k].attributes.StaID == data[i].StaID && pointFeatures[k].attributes.EleName == data[i].EleName) {
                    contains = true;
                    break;
                }
            }
            if (data[i].EleName != "短时强降水" && data[i].EleName != "冰雹") {
                contains = true;
            }
            if (contains)
                continue;
            var point = new WeatherMap.Geometry.Point(parseFloat(data[i].Lon), parseFloat(data[i].Lat));
            var pointStyle = Object.assign({}, style, { //样式
                fillColor: 'blue'
            });
            var pointFeature = new WeatherMap.Feature.Vector(point, {
                TIME: 1,
                EleName: data[i].EleName,
                Val: data[i].Val,
                StaID: data[i].StaID,
                FEATUREID: i
            }, pointStyle);
            pointFeatures.push(pointFeature);
        }

        t.animatorLayer.addFeatures(pointFeatures);
        // 更新Features缓存
        t.animatorLayer._FEATURES_ = t.animatorLayer.features;
    }

    //增加5分钟雨量显示
    function add5min_yl() {
        var pointVector = null;
        var pointVectors = [];
        var attribute = {};
        var ss = t.stationPlot.features;
        for (var i in ss) {
            var p = parseFloat(ss[i].attributes["降水"]).toFixed(1);
            var g = ss[i].geometry;
            //if (p > 5 && p < 9999.0) {
            if (p > 1.0 && p < 9999.0) {
                attribute["5分钟雨量"] = 1;
                attribute["rain5"] = p;
                var point = new WeatherMap.Geometry.Point(parseFloat(g.x), parseFloat(g.y));
                pointVector = new WeatherMap.Feature.Vector(point, attribute);
                pointVectors.push(pointVector);
            }
        }
        t.layerPlot.addFeatures(pointVectors);
        t.map.setLayerIndex(t.map.getLayersByName("layerMicapsPlot")[0], 999);//调整图层z-index
    }

    //加载标题
    function refreshTitleDiv() {
        var titleHtml = "";
        $("#map_QDLtitle_div").css("display", "block");
        var timeSelecter = $("#timeChoose input[type='radio']:checked").attr("id");//判断是实时还是时段
        var timeHtml = "";
        if (timeSelecter == "timeRadio") {
            timeHtml = $("#nowTime").html();
        } else {
            if ($("#timeListDiv div").hasClass("active")) {//时段查询后列表中选择时刻
                var h = $("#timeListDiv div.active").html();
                timeHtml = h.substr(0, 4) + "年" + h.substr(5, 2) + "月" + h.substr(8, 2) + "日&nbsp;" + h.substr(11, 2) + "时" + h.substr(14, 2) + "分";
            } else {//时段查询后列表中未选择时刻（点击查询按钮触发）
                var t1 = $("#dateSelect1 input").val();
                var t2 = $("#dateSelect2 input").val();
                timeHtml = t1.substr(0, 4) + "年" + t1.substr(5, 2) + "月" + t1.substr(8, 2) + "日&nbsp;" + t1.substr(11, 2) + "时" + t1.substr(14, 2) + "分" + " - "
                    + t2.substr(0, 4) + "年" + t2.substr(5, 2) + "月" + t2.substr(8, 2) + "日&nbsp;" + t2.substr(11, 2) + "时" + t2.substr(14, 2) + "分";
            }
        }
        if ($("#zhjcElement div.sk-alerm-title[data-flag='tiantu']").attr("data-status") == "true") {
            titleHtml += ("<p>" + timeHtml + "&nbsp;&nbsp;综合填图</p>");
        }
        if ($("#zhjcElement div.sk-alerm-title[data-flag='baojing']").attr("data-status") == "true") {
            titleHtml += ("<p>" + timeHtml + "&nbsp;&nbsp;灾害报警</p>");
        }
        $("#map_QDLtitle_div").html(titleHtml);
    }

    function flagToElement(flag) {
        elements = ["大风", "短时强降水", "冰雹", "闪电", "5分钟雨量", "雨量"];
        return elements[flag];
    }

    //过滤图层
    function featureFilter() {
        var eleName = "";
        var eleFeatures = t.animatorLayer.features;
        var featureSize = eleFeatures.length;
        $("#skElement").find(".rhjcHourSpan").each(function () {
            eleName = flagToElement(parseInt($(this).attr("flag")));
            if ($(this).hasClass("active")) {
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
                for (var i = 0; i < featureSize; i++) {
                    if (eleName == eleFeatures[i].data.EleName)
                        eleFeatures[i].style.display = "block";
                }
                if (eleName == "短时强降水") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 2].visible = true;
                }
                if (eleName == "雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = true;
                }
                if (eleName == "5分钟雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = true;
                }
            } else {
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
                for (var i = 0; i < featureSize; i++) {
                    if (eleName == eleFeatures[i].data.EleName)
                        eleFeatures[i].style.display = "none";
                }
                if (eleName == "短时强降水") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 2].visible = false;
                }
                if (eleName == "雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = false;
                }
                if (eleName == "5分钟雨量") {
                    plotStyles_rhjc[plotStyles_rhjc.length - 1].visible = false;
                }
            }
            t.layerPlot.redraw();
        });
    }

    //实时
    function getAllShiKuang(time, recall) {
        t.layerPlot.removeAllFeatures();
        var url = gsDataService + "services/DBService/getCalamity";
        $.ajax({
            data: { "para": "{ObservTimes:'" + time + "',type:1}" },
            url: url,
            dataType: "json",
            success: function (d) {
                //过滤用户区域范围数据信息
                var data = [];
                if(t.departCode.length == 2){
                    for(var i in d){
                        if(d[i].EleName != "闪电"){
                            data.push(d[i]);
                        }
                    }
                } else if (t.departCode.length == 4) {
                    for(var index in t.departRangeArr){
                        var areaCode = t.departRangeArr[index].code.toString();
                        for(var i in d){
                            if(d[i].EleName != "闪电" && d[i].TownMapCode.substr(0,4) == areaCode){
                                data.push(d[i]);
                            }
                        }
                    }
                } else {
                    for(var index in t.departRangeArr){
                        var areaCode = t.departRangeArr[index].code.toString();
                        for(var i in d){
                            if(d[i].EleName != "闪电" && d[i].TownMapCode.substr(0,4) == areaCode){
                                data.push(d[i]);
                            }
                        }
                    }
                }

                t.runFlag = true;
                if (data != null && data.length != 0) {
                    var tableData = [];
                    var nowDate = new Date();
                    var timeH = nowDate.getTime();
                    nowDate.setMinutes(nowDate.getMinutes()-5,0,0);
                    var timeL = nowDate.getTime();
                    alarm();
                    for(var i=0;i<data.length;i++){
                        if(typeof (data[i].EleName) == "undefined"){
                            data[i]["EleName"] = "雨量";
                        }
                        if(data[i].ObservTimes >= timeL && data[i].ObservTimes <= timeH){
                            tableData.push(data[i]);
                            t.haveNewForcast = true;
                        }
                    }
                    displayShiKuang(data);
                    if(t.isFirstAlert == 0){//判断是否是第一次进入页面
                        t.$selModel.show();
                        createAlarmDataTable(data);
                        t.isFirstAlert = t.isFirstAlert + 1;
                    } else {
                        if(t.haveNewForcast){//判断有无最新预报
                            t.$selModel.show();
                            createAlarmDataTable(tableData);
                            t.haveNewForcast = false;
                        } else {
                            t.audioCtl.stop();
                        }
                    }
                } else {
                    if (t.audioCtl != null)
                        t.audioCtl.stop();
                }
                recall && recall(data);
            },
            error: function (data) {
                if (t.runFlag) {
                    alertModal("获取实况信息出错");
                }
                t.runFlag = false;
            },
            type: "POST"
        });
    }

    //查询时间段内实况
    function getAllShiKuangByTimes() {
        var ObservTimesStart = t.myDateSelecter1.getCurrentTime(false);
        var ObservTimesEnd = t.myDateSelecter2.getCurrentTime(false);
        var time1 = t.myDateSelecter1.getCurrentTime(true).substr(0, 11) + t.myDateSelecter1.getCurrentTime(true).substr(12, 3);
        var time2 = t.myDateSelecter2.getCurrentTime(true).substr(0, 11) + t.myDateSelecter2.getCurrentTime(true).substr(12, 3);
        t.layerPlot.removeAllFeatures();
        var url = gsDataService + "services/DBService/getCalamityByTimes";
        $.ajax({
            data: {
                "para": JSON.stringify({
                    ObservTimesStart: ObservTimesStart,
                    ObservTimesEnd: ObservTimesEnd,
                    type: 0
                })
            },
            url: url,
            dataType: "json",
            success: function (d) {
                //过滤用户区域范围数据信息
                var data = [];
                if(t.departCode.length == 2){
                    for(var i in d){
                        if(d[i].EleName != "闪电"){
                            data.push(d[i]);
                        }
                    }
                } else if (t.departCode.length == 4) {
                    for(var index in t.departRangeArr){
                        var areaCode = t.departRangeArr[index].code.toString();
                        for(var i in d){
                            if(d[i].EleName != "闪电" && d[i].TownMapCode.substr(0,4) == areaCode){
                                data.push(d[i]);
                            }
                        }
                    }
                } else {
                    for(var index in t.departRangeArr){
                        var areaCode = t.departRangeArr[index].code.toString();
                        for(var i in d){
                            if(d[i].EleName != "闪电" && d[i].TownMapCode.substr(0,4) == areaCode){
                                data.push(d[i]);
                            }
                        }
                    }
                }

                t.timeList = [];
                t.skData = {};
                for (var i = 0; i < data.length; i++) {
                    if(typeof (data[i].EleName) == "undefined"){
                        data[i]["EleName"] = "雨量";
                    }
                    if (data[i]["EleName"] == "闪电")
                        var time = data[i].ObservTimes - (data[i].ObservTimes % 3600000);
                    else
                        var time = data[i].ObservTimes;
                    if (typeof (t.skData[time]) == "undefined") {
                        t.skData[time] = [];
                        t.timeList.push(time);
                    }
                    t.skData[time].push(data[i]);
                }
                t.timeList.sort();
                showQueryList();
                showPanel(data, time1, time2);
            },
            error: function (data) {
                alertModal("获取实况信息出错");
            },
            type: "POST"
        });
    }

    //显示实况查询数据
    function displayShiKuang(data) {
        t.layerPlot.removeAllFeatures();
        var newData = $.extend(true, {}, data);//克隆对象
        var size = data.length;
        var pointVector = null;
        var pointVectors = [];
        var attribute = {};
        var windMap = new Map();//大风集合
        var shortMap = new Map();//短强集合
        var rain1HMap = new Map();//（小时）雨量集合
        var hailMap = new Map();//冰雹集合
        var flashArr = [];//闪电数组
        for (var i = 0; i < size; i++) {
            var item = newData[i];
            var stationID = item.StaID;
            if (typeof (stationID) == "undefined") {
                flashArr.push(item);
            } else {
                var objName = item.EleName;
                if (objName === "短时强降水") {
                    var oldObj = shortMap.get(stationID);
                    if (oldObj == null) {
                        shortMap.set(stationID, item);
                    } else {
                        var oldVal = oldObj.Val;
                        var newVal = oldVal + item.Val;
                        item.Val = newVal;//更新雨量值
                        var newLevel = 1;
                        if (newVal > 30 && newVal < 50) {
                            newLevel = 2;
                        }
                        else if (newVal > 50) {
                            newLevel = 3;
                        }
                        item.LvlID = newLevel;//更新雨量等级
                        shortMap.set(stationID, item);
                    }
                }
                else if(objName === "雨量"){
                    var oldObj = rain1HMap.get(stationID);
                    if (oldObj == null) {
                        rain1HMap.set(stationID, item);
                    } else {
                        var oldVal = oldObj.Val;
                        var newVal = oldVal + item.Val;
                        item.Val = newVal;//更新雨量值
                        var newLevel = 1;
                        if (newVal > 10 && newVal < 25) {
                            newLevel = 2;
                        }
                        else if (newVal > 25 && newVal < 50) {
                            newLevel = 3;
                        }else if (newVal > 50) {
                            newLevel = 4;
                        }
                        item.LvlID = newLevel;//更新雨量等级
                        rain1HMap.set(stationID, item);
                    }
                }
                else if (objName === "大风") {
                    var oldObj = windMap.get(stationID);
                    if (oldObj == null) {
                        windMap.set(stationID, item);
                    } else {
                        var oldLevel = oldObj.LvlID;
                        var newLevel = oldLevel > item.LvlID ? oldLevel : item.LvlID;
                        item.LvlID = newLevel;//更新大风等级
                        windMap.set(stationID, item);
                    }
                } else if (objName === "冰雹") {
                    var oldObj = hailMap.get(stationID);
                    if (oldObj == null) {
                        hailMap.set(stationID, item);
                    } else {
                        var oldLevel = oldObj.LvlID;
                        var newLevel = oldLevel > item.LvlID ? oldLevel : item.LvlID;
                        item.LvlID = newLevel;//更新冰雹等级（虽然不显示等级）
                        hailMap.set(stationID, item);
                    }
                }
            }
        }
        windMap.forEach(function (item, key, obj) {
            var point = new WeatherMap.Geometry.Point(parseFloat(item.Lon), parseFloat(item.Lat));
            var eleName = item.EleName;
            attribute = {};
            attribute[eleName] = parseInt(item.LvlID);
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        });
        shortMap.forEach(function (item, key, obj) {
            var point = new WeatherMap.Geometry.Point(parseFloat(item.Lon), parseFloat(item.Lat));
            var eleName = item.EleName;
            attribute = {};
            attribute[eleName] = parseInt(item.LvlID);
            if (eleName === "短时强降水") {
                attribute["rain"] = item.Val;
            }
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        });
        rain1HMap.forEach(function (item, key, obj) {
            var point = new WeatherMap.Geometry.Point(parseFloat(item.Lon), parseFloat(item.Lat));
            var eleName = item.EleName;
            attribute = {};
            attribute[eleName] = parseInt(item.LvlID);
            if (eleName === "雨量") {
                attribute["rain1h"] = item.Val;
            }
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        });
        hailMap.forEach(function (item, key, obj) {
            var point = new WeatherMap.Geometry.Point(parseFloat(item.Lon), parseFloat(item.Lat));
            var eleName = item.EleName;
            attribute = {};
            attribute[eleName] = parseInt(item.LvlID);
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        });
        for (var i = 0; i < flashArr.length; i++) {
            attribute = {};
            var point = new WeatherMap.Geometry.Point(parseFloat(flashArr[i].Lon), parseFloat(flashArr[i].Lat));
            attribute[flashArr[i].EleName] = parseInt(flashArr[i].LvlID);
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        }
        t.layerPlot.addFeatures(pointVectors);
        if(t.isFirstAlert == 0){
            addAnimator(data);
        }
        setTimeout(function () {
            add5min_yl();
            if(t.haveNewForcast) {
                addAnimator(data);
                t.animatorLayer.animator.start();
            }
        }, 100);
        featureFilter();
    }

    //显示查询列表
    function showQueryList() {
        var content = "";
        var skList = $("#skElement").find(".active");
        var skIDList = [];
        for (var i = 0; i < skList.length; i++) {
            skIDList.push($(skList[i]).html());
        }
        for (var i = t.timeList.length - 1; i >= 0; i--) {
            var nowDate = new Date(parseInt(t.timeList[i]));
            content += "<div>" + dateToTimes(nowDate) + "</div>";
        }
        /*for(var time in t.skData){
         */
        /*var flag = false;
         for(var i=0;i< t.skData[time].length;i++){
         if($.inArray(t.skData[time][i].EleName, skIDList)!=-1){
         flag = true;
         break;
         }
         }
         if(flag){*/
        /*
         var nowDate = new Date(parseInt(time));
         content += "<div>"+dateToTimes(nowDate)+"</div>";
         */
        /*}*/
        /*
         }*/
        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            var date = timesToDate($(this).html());
            refreshTitleDiv();

            //雨量分级
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

            displayShiKuang(t.skData[date.getTime()]);
            var nowDate = new Date(parseInt(t.skData[date.getTime()][0].ObservTimes));
            var time1 = nowDate.getFullYear() + "年" + (Array(2).join(0) + (nowDate.getMonth() + 1)).slice(-2) + "月" + (Array(2).join(0) + nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0) + nowDate.getHours()).slice(-2) + "时";
            showPanel(t.skData[date.getTime()], time1, time1)
        });
        if ($("#timeListDiv").find("div").length != 0) {
            /*$("#timeListDiv").find("div").eq(0).click();*/
            var allData = [];
            for (var time in t.skData) {
                Array.prototype.push.apply(allData, t.skData[time]);
            }
            displayShiKuang(allData);
        }
    }

    //获取最新实况
    function getNewShiKuang() {
        var time = t.myDateSelecter1.getNowTime() + ".000";
        var timeH = t.myDateSelecter1.getNowTime() + ".000";
        getAllShiKuang(time, function (data) {
            var date = new Date();
            timeH = dateToTimes(date);
            if (data != null && data.length == 0) {
                date.setHours(date.getHours() - 1, 0, 0);
                time = dateToTimes(date);
                getAllShiKuang(time);
            }
            $("#nowTime").html(timeH.substr(0, 4) + "年" + timeH.substr(5, 2) + "月" + timeH.substr(8, 2) + "日&nbsp;" + timeH.substr(11, 2) + "时" + timeH.substr(14, 2) + "分");
        });
    }

    function dateToTimes(nowDate) {
        return nowDate.getFullYear() + "-" + (Array(2).join(0) + (nowDate.getMonth() + 1)).slice(-2) + "-" + (Array(2).join(0) + nowDate.getDate()).slice(-2) + " " + (Array(2).join(0) + nowDate.getHours()).slice(-2) + ":" + (Array(2).join(0) + nowDate.getMinutes()).slice(-2) + ":" + (Array(2).join(0) + nowDate.getSeconds()).slice(-2) + ".000";
    }

    function timesToDate(nowTime) {
        var nowDate = new Date(parseInt(nowTime.substr(0, 4)), parseInt(nowTime.substr(5, 2)) - 1, parseInt(nowTime.substr(8, 2)), parseInt(nowTime.substr(11, 2)), parseInt(nowTime.substr(14, 2)), parseInt(nowTime.substr(17, 2)));
        return nowDate;
    }

    //动画
    function animationShiKuang() {
        if ($("#timeListDiv").find("div.active").prev().length != 0) {
            $("#timeListDiv").find("div.active").prev().click();
        }
        else {
            $("#timeListDiv").find("div").eq($("#timeListDiv").find("div").length - 1).click();
        }
        setTimeout(function () {
            if (t.animation == true)
                animationShiKuang();
        }, $("#animationSelect").val() * 1000);
    }

    function clearElement(obj) {

    }

    function clearAllElement() {

    }

    function showPanel(data, time1, time2) {
        var tjObject = { "大风": [], "短时强降水": [], "冰雹": [], "闪电": [], "雨量":[],"5分钟雨量": [] };
        for (var i = 0; i < data.length; i++) {
            var eleName = data[i]["EleName"];
            if (eleName != "闪电" && (data[i].StaID.substr(0, 1) == "5" || data[i].StaID.substr(0, 1) == "W")) {
                var thisData = tjObject[eleName];
                if (thisData == null || thisData == undefined) {
                    continue;
                }
                thisData.push(data[i]);
            }
        }
        var contentTable = "<table border='1'  bordercolor='#969696'><tr><th>类别</th><th>站次</th><th>最强</th><th>出现时间</th></tr>";
        var contentDiv = "<div id='ystjContentDiv' style='overflow: auto;border: 1px solid rgb(150,150,150);padding: 10px;'>" + time1 + "至" + time2 + "：";
        contentDiv += "<table><thead><tr><th>要素</th><th>站点个数</th><th>时间</th><th>站点</th><th>val</th></tr></thead>";
        var num = 1;
        var showTable = false;
        for (var obj in tjObject) {
            var maxNum = 0;
            var maxObj = null;
            if (tjObject[obj].length != 0) {
                num++;
                contentTable += "<tr><td>" + obj + "</td><td>" + tjObject[obj].length + "</td>";
                if (obj == "短时强降水" || obj == "大风" || obj == "冰雹" || obj == "雨量" || obj == "5分钟雨量") {
                    contentDiv += "<tr><td rowspan='"+ (tjObject[obj].length+1) +"'>" + obj + "</td><td rowspan='"+(tjObject[obj].length+1) +"'>" + tjObject[obj].length + "个</td></tr>";
                    for (var i = 0; i < tjObject[obj].length; i++) {
                        var date = new Date(tjObject[obj][i].ObservTimes);
                        contentDiv += "<tr><td>" + date.getDate() + "日" + date.getHours() + "时</td><td>" + tjObject[obj][i].area + tjObject[obj][i].StaName + "</td><td>" + (tjObject[obj][i].Val).toFixed(1) + "</td></tr>";
                        maxObj = tjObject[obj][0];
                        if (maxNum < tjObject[obj][i].Val) {
                            maxNum = tjObject[obj][i].Val;
                            maxObj = tjObject[obj][i];
                        }
                    }
                    contentDiv = contentDiv.substr(0, contentDiv.length - 1);
                    contentDiv += "</td></tr>";
                    var date = new Date(maxObj.ObservTimes);
                    contentTable += "<td>" + maxObj.StaName + "(" + maxNum + ")</td><td>" + date.getDate() + "日" + date.getHours() + "时</td></tr>";
                    if (maxObj != null)
                        showTable = true;
                }
                else {
                    for (var i = 0; i < tjObject[obj].length; i++) {
                        if (maxNum < Math.abs(tjObject[obj][i].Val)) {
                            maxNum = Math.abs(tjObject[obj][i].Val);
                            maxObj = tjObject[obj][i];
                        }
                    }
                    var date = new Date(maxObj.ObservTimes);
                    if (obj == "闪电")
                        contentTable += "<td>(" + maxObj.Val + ")</td><td>" + date.getDate() + "日" + date.getHours() + "时</td></tr>";
                    else
                        contentTable += "<td>" + maxObj.StaName + "(" + maxNum + ")</td><td>" + date.getDate() + "日" + date.getHours() + "时</td></tr>";
                }
            }
        }
        contentTable += "</table>";
        contentDiv += "</table></div>";
        if (showTable) {
            t.myPanel_YSTJ.panel.find(".ystjContent").html(contentTable + contentDiv);
            var divWindowHeight = $(".ystjContent").css("height").split("p")[0];
            if($(".ystjContent table").length){
                var tableHeight = $(".ystjContent table").css("height").split("p")[0];
            }
            var divContentHeight = divWindowHeight - tableHeight;

            if(divContentHeight == 0)
                $("#ystjContentDiv").css("height", 222 - num * 21);
            else
                $("#ystjContentDiv").css("height",divContentHeight +"px");
        }
        else {
            t.myPanel_YSTJ.panel.find(".ystjContent").html("");
        }
        t.myPanel_YSTJ.panel.css("display", "block");
    }

    /** 以下内容是从ZHJCSKPageClass.js 中移植而来 */


    //显示查询列表
    function copy_showQueryList() {
        var content = "";
        var skList = $("#skElement_copy").find(".active");
        var skIDList = [];
        for (var i = 0; i < skList.length; i++) {
            skIDList.push($(skList[i]).html());
        }
        for (var i = t.timeList.length - 1; i >= 0; i--) {
            var nowDate = new Date(parseInt(t.timeList[i]));
            content += "<div>" + dateToTimes(nowDate) + "</div>";
        }
        /*for(var time in t.skData){
         */
        /*var flag = false;
         for(var i=0;i< t.skData[time].length;i++){
         if($.inArray(t.skData[time][i].EleName, skIDList)!=-1){
         flag = true;
         break;
         }
         }
         if(flag){*/
        /*
         var nowDate = new Date(parseInt(time));
         content += "<div>"+dateToTimes(nowDate)+"</div>";
         */
        /*}*/
        /*
         }*/
        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            var date = timesToDate($(this).html());
            getStationShiKuangByTimes();
            displayShiKuang(t.skData[date.getTime()]);
            refreshTitleDiv();
            var nowDate = new Date(parseInt(t.skData[date.getTime()][0].ObservTimes));
            var time1 = nowDate.getFullYear() + "年" + (Array(2).join(0) + (nowDate.getMonth() + 1)).slice(-2) + "月" + (Array(2).join(0) + nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0) + nowDate.getHours()).slice(-2) + "时";
            showPanel(t.skData[date.getTime()], time1, time1)
        });
        if ($("#timeListDiv").find("div").length != 0) {
            /*$("#timeListDiv").find("div").eq(0).click();*/
            var allData = [];
            for (var time in t.skData) {
                Array.prototype.push.apply(allData, t.skData[time]);
            }
            displayShiKuang(allData);
        }
    }

    //获取最新气象灾害
    function getNewStationSK() {
        t.stationPlot.removeAllFeatures();
        stationLayer.removeAllFeatures();
        //var nowTime = new Date();
        //var nowTimeMin = Math.floor(nowTime.getMinutes()/5)*5;
        //nowTime.setSeconds(0);
        //nowTime.setMinutes(nowTimeMin);
        var date = new Date();
        getStationShiKuang(date, function checkDataIsNull(data) {
            if (data == null || data.length == 0) {
                var nowTimeMin = Math.floor(date.getMinutes()/5)*5;
                date.setSeconds(0);
                date.setMinutes(nowTimeMin);
                if ($("#timeType").find(".active").attr("id") == "timeHour") {
                    date.setHours(date.getHours() - 1, 0, 0);
                }
                else {
                    date.setMinutes(date.getMinutes() - 5, 0, 0);
                }
                getStationShiKuang(date, checkDataIsNull);
            }
        });
    }

    //查询时间段内气象要素
    function getStationShiKuangByTimes() {
        var stationType = '5%';
        if ($("#stationType").find(".active").attr("id") == "quyz") {
            stationType = 'w%';
        }
        var ObservTimesStart = getStationsTimeMin(t.myDateSelecter1.getCurrentTime(false));
        var ObservTimesEnd = getStationsTimeMin(t.myDateSelecter2.getCurrentTime(false));
        var date1 = t.myDateSelecter1.getCurrentTimeReal();
        var date2 = t.myDateSelecter2.getCurrentTimeReal();
        date2.setHours(date2.getHours() + 4);
        var tableName = dateToTimeStation(date2);
        if ($("#timeType").find(".active").attr("id") == "timeHour") {
            tableName = "HIS_HOUR_" + tableName.substr(0, 6);
        }
        else {
            ObservTimesStart += "00";
            ObservTimesEnd += "00";
            tableName = "HIS_REALDATA_" + tableName.substr(0, 6);
        }
        t.stationPlot.removeAllFeatures();
        t.layerPlot.removeAllFeatures();
        stationLayer.removeAllFeatures();
        $("#timeListDiv").html("");
        $("#div_progress_title").html("正在查询，请稍等...");
        $("#div_progress").css("display", "block");
        var url = gsDataService + "services/DBService/getStationDetailByTimes";
        $.ajax({
            type: "POST",
            data: { "para": "{ObservTimesStart:'" + ObservTimesStart + "',ObservTimesEnd:'" + ObservTimesEnd + "',tableName:'" + tableName + "',type:" + stationType + "}" },
            url: url,
            dataType: "json",
            success: function (data) {
                if(data.length == 0 || data == null){
                    alertModal("该时段没有查询到数据");
                    return;
                }
                $("#div_progress").css("display", "none");
                t.timeList = [];
                t.ysData = {};
                var stationCollect = {};
                var qqqqqqq = [];
                for (var i = 0; i < data.length; i++) {
                    var time = new Date(stationDateFormat(data[i].ObservTimes)).getTime();
                    if (typeof (t.ysData[time]) == "undefined") {
                        t.ysData[time] = [];
                        t.timeList.push(time);
                    }
                    t.ysData[time].push(data[i]);
                    if (typeof (stationCollect[data[i].StationNum]) == "undefined") {
                        stationCollect[data[i].StationNum] = [];
                    }
                    stationCollect[data[i].StationNum].push(data[i]);
                    if(data[i].Precipitation != 0)
                        qqqqqqq.push(data[i]);
                }
                t.timeList.sort();
                showStationQueryList();
                //处理气象要素查询数据
                var allstationData = [];
                var element = $("#ysElement").find(".active").attr("id");
                if (element == 'ys_jiangs') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var Precipitation = 0;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].Precipitation != null && StationDatas[i].Precipitation != 0)
                                Precipitation += StationDatas[i].Precipitation;
                        }
                        var stationData = { StaID: StaID, '降水时段': Precipitation, Lon: StationDatas[0].Lon, Lat: StationDatas[0].Lat };
                        allstationData.push(stationData);
                    }
                }
                else if (element == 'ys_qiw') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var MaxTemp = StationDatas[0].MaxTemp;
                        var MinTemp = StationDatas[0].MinTemp;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].MaxTemp > MaxTemp)
                                MaxTemp = StationDatas[i].MaxTemp;
                            if (StationDatas[i].MinTemp < MinTemp)
                                MinTemp = StationDatas[i].MinTemp;
                        }
                        var stationData = {
                            "高温时段": MaxTemp,
                            "低温时段": MinTemp,
                            Lon: StationDatas[0].Lon,
                            Lat: StationDatas[0].Lat
                        };
                        allstationData.push(stationData);
                    }
                }
                else if (element == 'ys_gaow') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var MaxTemp = StationDatas[0].MaxTemp;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].MaxTemp > MaxTemp)
                                MaxTemp = StationDatas[i].MaxTemp;
                        }
                        var stationData = { StaID: StaID, "高温时段": MaxTemp, Lon: StationDatas[0].Lon, Lat: StationDatas[0].Lat };
                        allstationData.push(stationData);
                    }
                } else if (element == 'ys_diw') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var MinTemp = StationDatas[0].MinTemp;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].MinTemp < MinTemp)
                                MinTemp = StationDatas[i].MinTemp;
                        }
                        var stationData = { StaID: StaID, "低温时段": MinTemp, Lon: StationDatas[0].Lon, Lat: StationDatas[0].Lat };
                        allstationData.push(stationData);
                    }
                }
                else if (element == 'ys_feng' || element == 'ys_jdfeng') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var MaxWindD = StationDatas[0].MaxWindD;
                        var MaxWindV = StationDatas[0].MaxWindV;
                        var ExMaxWindD = StationDatas[0].ExMaxWindD;
                        var ExMaxWindV = StationDatas[0].ExMaxWindV;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].MaxWindV > MaxWindV) {
                                MaxWindV = StationDatas[i].MaxWindV;
                                MaxWindD = StationDatas[i].MaxWindD;
                            }
                            if (StationDatas[i].ExMaxWindV > ExMaxWindV) {
                                ExMaxWindV = StationDatas[i].ExMaxWindV;
                                ExMaxWindD = StationDatas[i].ExMaxWindD;
                            }
                        }
                        var stationData = {
                            StaID: StaID,
                            "最大风时段": getWindLevel(MaxWindV),
                            "最大风向时段": MaxWindD,
                            "极大风时段": getWindLevel(ExMaxWindV),
                            "最大风向时段": ExMaxWindD,
                            Lon: StationDatas[0].Lon,
                            Lat: StationDatas[0].Lat
                        };
                        allstationData.push(stationData);
                    }
                }
                else if (element == 'ys_shid') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var RelHumidity = StationDatas[0].RelHumidity;
                        var MinRelHumidity = StationDatas[0].MinRelHumidity;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].RelHumidity > RelHumidity)
                                RelHumidity = StationDatas[i].RelHumidity;
                            if (StationDatas[i].MinRelHumidity < MinRelHumidity)
                                MinRelHumidity = StationDatas[i].MinRelHumidity;
                        }
                        var stationData = {
                            StaID: StaID,
                            "最大湿度时段": RelHumidity,
                            "最小湿度时段": MinRelHumidity,
                            Lon: StationDatas[0].Lon,
                            Lat: StationDatas[0].Lat
                        };
                        allstationData.push(stationData);
                    }
                }
                else if (element == 'ys_qiy') {
                    for (var StaID in stationCollect) {
                        var StationDatas = stationCollect[StaID];
                        var MaxPSta = StationDatas[0].MaxPSta;
                        var MinPSta = StationDatas[0].MinPSta;
                        for (var i = 0; i < StationDatas.length; i++) {
                            if (StationDatas[i].MaxPSta > MaxPSta)
                                MaxPSta = StationDatas[i].MaxPSta;
                            if (StationDatas[i].MinPSta < MinPSta)
                                MinPSta = StationDatas[i].MinPSta;
                        }
                        var stationData = {
                            StaID: StaID,
                            "最大气压时段": MaxPSta,
                            "最小气压时段": MinPSta,
                            Lon: StationDatas[0].Lon,
                            Lat: StationDatas[0].Lat
                        };
                        allstationData.push(stationData);
                    }
                }
                displayStationShiDuan(allstationData);
                refreshTitleDiv();
            },
            error:function(){
                $("#div_progress").css("display", "none");
                alertModal("获取数据失败");
                console.log("获取数据失败");
            }
        });
    }

    //查询实时气象要素
    function getStationShiKuang(date, recall) {
        var time = "";
        time = dateToTimeStation(date);
        date.setHours(date.getHours() + 4);
        tableName = dateToTimeStation(date);
        date.setHours(date.getHours() - 4);
        if ($("#timeType").find(".active").attr("id") == "timeHour") {
            time = time.substr(0, time.length - 2);
            tableName = "HIS_HOUR_" + tableName.substr(0, 6);
        } else {
            tableName = "HIS_REALDATA_" + tableName.substr(0, 6);
        }
        var stationType = '5%';
        if ($("#stationType").find(".active").attr("id") == "quyz") {
            stationType = 'w%';
        }
        var url = gsDataService + "services/DBService/getStationDetail";
        $.ajax({
            type: "POST",
            data: { "para": "{tableName:'" + tableName + "',ObservTimes:'" + time + "',type:'" + stationType + "'}" },
            url: url,
            dataType: "json",
            success: function (data) {
                t.runFlag = true;
                if ($("#timeRadio")[0] && $("#timeRadio")[0].checked) {
                    displayStationShiKuang(data);
                }
                if ($("#timeType").find(".active").attr("id") == "timeHour")
                    $("#nowTime").html(time.substr(0, 4) + "年" + time.substr(4, 2) + "月" + time.substr(6, 2) + "日&nbsp;" + time.substr(8, 2) + "时");
                else
                    $("#nowTime").html(time.substr(0, 4) + "年" + time.substr(4, 2) + "月" + time.substr(6, 2) + "日&nbsp;" + time.substr(8, 2) + "时" + time.substr(10, 2) + "分");
                recall && recall(data);
                refreshTitleDiv();
            },
            error: function () {
                if (t.runFlag) {
                    alertModal("获取实况信息出错");
                }
                t.runFlag = false;
            }
        });
    }

    function createAlarmDataTable(data) {
        let $selModel = $('#alarm_modal_confirm');
        /* 表头 */
        let tHeader = ['地区', '站点', '类型', '当前值'];
        let tHeaderHtmlStr = '<thead>';
        for (let i in tHeader) {
            let tmpStr = '<th>' + tHeader[i] + '</th>';
            tHeaderHtmlStr += tmpStr;
        }
        tHeaderHtmlStr += '</thead>';
        /* 行 */
        let rowsHtmlStr = '';
        for (let i in data) {
            rowsHtmlStr += '<tr><td>' + data[i].area + '</td><td>' + data[i].StaName + '</td><td>' + data[i].EleName + '</td><td>' + data[i].Val + '</td></tr>';
        }
        /* 拼表 */
        let tabHtml = '<table id="alarmDataTable">' + tHeaderHtmlStr + rowsHtmlStr + '</table>';
        // console.log(tabHtml);
        $selModel.find('.modal-body').html(tabHtml);
    }

    function dateToTimeStation(nowDate) {
        if ($("#timeType").find(".active").attr("id") == "timeHour") {
            return nowDate.getFullYear() + (Array(2).join(0) + (nowDate.getMonth() + 1)).slice(-2) + (Array(2).join(0) + nowDate.getDate()).slice(-2) + (Array(2).join(0) + nowDate.getHours()).slice(-2) + (Array(2).join(0) + (nowDate.getMinutes() - nowDate.getMinutes() % 10)).slice(-2);
        } else {
            return nowDate.getFullYear() + (Array(2).join(0) + (nowDate.getMonth() + 1)).slice(-2) + (Array(2).join(0) + nowDate.getDate()).slice(-2) + (Array(2).join(0) + nowDate.getHours()).slice(-2) + (Array(2).join(0) + (nowDate.getMinutes() - nowDate.getMinutes() % 5)).slice(-2);
        }
    }

    //展示实况
    function displayStationShiKuang(data) {
        t.stationPlot.removeAllFeatures();
        var pointVectors = [];
        var attribute = {};
        var pointVector = null;
        if (stationLayer.features.length == 0) {
            var stationList = [];
            if ($("#stationType").find(".active").attr("id") == "benz") {
                var stations = t.station_country;
                for (var i = 0; i < stations.length; i++) {
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon, stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point, stations[i], {
                        fillColor: "black",
                        pointRadius: 0.5
                    });
                    stationList.push(stationVector)
                }
            }
            else {
                var stations = t.station_town;
                for (var i = 0; i < stations.length; i++) {
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon, stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point, stations[i], {
                        fillColor: "black",
                        pointRadius: 0.5
                    });
                    stationList.push(stationVector)
                }
            }
            stationLayer.addFeatures(stationList);
        }
        for (var i = 0; i < data.length; i++) {
            attribute = {};
            var point = new WeatherMap.Geometry.Point(data[i].Lon, data[i].Lat);
            attribute["风"] = getWindLevel(data[i].WindVelocity);
            attribute["风向"] = data[i].WindDirect;
            attribute["极大风"] = getWindLevel(data[i].WindVelocity10);
            attribute["极大风向"] = data[i].WindDirect10;
            attribute["气温"] = data[i].DryBulTemp;
            attribute["最高温"] = data[i].MaxTemp;
            attribute["最低温"] = data[i].MinTemp;
            attribute["湿度"] = data[i].RelHumidity ? data[i].RelHumidity : 9999.0;
            attribute["降水"] = data[i].Precipitation ? data[i].Precipitation : 9999.0;
            attribute["气压"] = data[i].StationPress ? data[i].StationPress : 9999.0;
            pointVector = new WeatherMap.Feature.Vector(point, attribute);
            pointVectors.push(pointVector);
        }
        t.stationPlot.addFeatures(pointVectors);
    }

    //获取风速等级
    function getWindLevel(value) {
        var level = 1;
        if (value <= 0.3)
            level = 1;
        else if (value <= 1.6)
            level = 2;
        else if (value <= 3.4)
            level = 3;
        else if (value <= 5.5)
            level = 4;
        else if (value <= 8.0)
            level = 5;
        else if (value <= 10.8)
            level = 6;
        else if (value <= 13.9)
            level = 7;
        else if (value <= 17.2)
            level = 8;
        else if (value <= 20.8)
            level = 9;
        else if (value <= 24.5)
            level = 10;
        else if (value <= 28.5)
            level = 11;
        else if (value <= 32.7)
            level = 12;
        else if (value <= 36.9)
            level = 13;
        else if (value <= 41.4)
            level = 14;
        else if (value <= 46.1)
            level = 15;
        else if (value <= 50.9)
            level = 16;
        else if (value <= 56.0)
            level = 17;
        else if (value <= 61.2)
            level = 18;
        return level;
    }

    //获取单站  实况数据
    function getOneStationDetail(tableName, ObservTimesStart, ObservTimesEnd, stationNum, recall) {
        var url = gsDataService + "services/DBService/getOneStationDetail";
        $.ajax({
            type: 'post',
            url: url,
            data: { "para": "{tableName:" + tableName + ",ObservTimesStart:'" + ObservTimesStart + "',ObservTimesEnd:" + ObservTimesEnd + ",stationNum:" + stationNum + "}" },
            dataType: 'json',
            success: function (data) {
                recall && recall(data);
            },
            error: function () {
                alertModal("获取站点详细信息失败");
            }
        });
    }

    //单站  数据图表展示
    function displayStationChart(list, currentFeature) {
        if (list.length == 0)
            return;
        var lonLat = new WeatherMap.LonLat(currentFeature.attributes.Lon, currentFeature.attributes.Lat);
        var endTime = list[list.length-1].ObservTimes.substr(6, 2) + "日" + list[list.length-1].ObservTimes.substr(8, 2) + "时";
        var startTime = list[0].ObservTimes.substr(6, 2) + "日" + list[0].ObservTimes.substr(8, 2) + "时";
        var title = currentFeature.attributes.StaName + startTime + "到" + endTime + "实况数据";
        var contentHTML = ""
            + "<div id='waterWindowInfo' style='font-size:12px;width: 580px;'>"
            + "<div class='typhoonInfoTitle' style='height: 25px;border-bottom: 1px solid #e6e6e6;'><span style='line-height: 25px;margin-left: 10px;;font-weight: bold;font-size: 14px;text-align: center'>单站信息查询</span>"
            + "<span class='closeBtn' title='关闭' style='float: right;margin: 0px 5px 5px 0px;cursor:pointer;font-size: 20px;font-family: cursive;'>x</span></div>"
            + "<div id='stationChartDiv' style='height: 300px;'></div>"
            + "</div>";
        windowInfoXY(lonLat, contentHTML);
        creatStationChart("stationChartDiv", list, title);

        $("span.closeBtn").click(function () {
            $("#myInfoWindow").css("display", "none");
        })
    }

    function creatStationChart(divID, data, title) {
        if (data.length == 0)
            return;
        var chartData = null;
        var labels = [];
        var data1 = [], data2 = [], data3 = [], data4 = [];
        var size = data.length;
        for (var i = 0; i < size; i++) {
            var item = data[i];
            var timeStr = item.ObservTimes;
            labels.push(timeStr.substr(6, 2) + "日" + timeStr.substr(8, 2) + "时" + (timeStr.length>10?(timeStr.substr(10, 2)+"分"):""));
            data1.push(typeof (item.Precipitation) == 'undefined' ? 0 : item.Precipitation);
            data2.push(typeof (item.DryBulTemp) == 'undefined' ? 0 : item.DryBulTemp);
            data3.push(typeof (item.RelHumidity) == 'undefined' ? 0 : item.RelHumidity);
            data4.push(typeof (item.StationPress) == 'undefined' ? 0 : item.StationPress);
        }
        if (labels.length > 0 && data1.length > 0 && data2.length > 0 && data3.length > 0 && data4.length > 0)
            chartData = { divID: divID, title: title, labels: labels, datas: [data1, data2, data3, data4], eleName: ["降水", "温度", "湿度", "气压"], eleUnit: ["降水(mm)", "温度(℃)", "湿度(%)", "气压(Pa)"] };
        if (chartData != null) {
            var lineChartData = {
                divID: chartData.divID,
                title: chartData.title,
                labels: chartData.labels,
                dataSet: chartData.datas,
                eleName: chartData.eleName,
                eleUnit: chartData.eleUnit
            };
            displayHighCharts(lineChartData);
            //绘制图表
            function displayHighCharts(lineChartData) {
                var colors = ['#7CB5EB', '#F7A35C', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
                Highcharts.setOptions({
                    lang: {
                        loading: '',
                        printChart: '打印',
                        downloadJPEG: '',
                        downloadPDF: '导出 PDF',
                        downloadPNG: '导出 PNG',
                        downloadSVG: ''
                    }
                });

                $('#' + lineChartData.divID).highcharts({
                    chart: {
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderRadius: 0,
                        zoomType: 'xy',
                        panning: true,
                        height: 300,
                        width: 580
                    },
                    title: {
                        text: lineChartData.title,
                        x: 10,
                        align: 'center',
                        margin: 5,
                        style: { fontSize: "16px" }
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: [{
                        categories: lineChartData.labels,
                        crosshair: true
                    }],
                    yAxis: [{//Precipitation 降水
                        title: {
                            text: lineChartData.eleUnit[0],
                            style: {
                                color: colors[0]
                            }
                        },
                        opposite: true
                    }, {//DryBulTemp 温度
                        title: {
                            text: lineChartData.eleUnit[1],
                            style: {
                                color: colors[1]
                            }
                        }
                    }, {//RelHumidity 湿度
                        title: {
                            text: lineChartData.eleUnit[2],
                            style: {
                                color: colors[5]
                            }
                        }
                    }, {//StationPress 气压
                        title: {
                            text: lineChartData.eleUnit[3],
                            style: {
                                color: "#010101"
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
                        verticalAlign: 'bottom',
                        x: 120,
                        borderWidth: 0
                    },
                    series: [{//Precipitation 降水
                        name: lineChartData.eleName[0],
                        type: 'column',
                        yAxis: 0,
                        data: lineChartData.dataSet[0],
                        color: colors[0],
                        tooltip: {
                            valueSuffix: 'mm'
                        }
                    }, {//DryBulTemp 温度
                        name: lineChartData.eleName[1],
                        type: 'spline',
                        yAxis: 1,
                        data: lineChartData.dataSet[1],
                        color: colors[1],
                        tooltip: {
                            valueSuffix: '℃'
                        }
                    }, {//RelHumidity 湿度
                        name: lineChartData.eleName[2],
                        type: 'spline',
                        yAxis: 2,
                        data: lineChartData.dataSet[2],
                        color: colors[5],
                        tooltip: {
                            valueSuffix: '%'
                        }
                    }, {//StationPress 气压
                        name: lineChartData.eleName[3],
                        type: 'spline',
                        yAxis: 3,
                        data: lineChartData.dataSet[3],
                        color: "#010101",
                        marker: {
                            enabled: false
                        },
                        dashStyle: 'shortdot',
                        tooltip: {
                            valueSuffix: 'Pa'
                        }
                    }]
                });
            }
        }
    }

    //查询时间段内实况
    /*function getAllShiKuangByTimes(){
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
     copy_showQueryList();
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
     */
    //显示要素查询列表
    function showStationQueryList() {
        var content = "";
        var ysList = $("#ysElement").find(".active");
        var ysIDList = [];
        for (var i = 0; i < ysList.length; i++) {
            ysIDList.push($(ysList[i]).html());
        }
        for (var i = t.timeList.length - 1; i >= 0; i--) {
            var nowDate = new Date(parseInt(t.timeList[i]));
            content += "<div>" + dateToTimes(nowDate) + "</div>";
        }

        $("#timeListDiv").html(content);
        $("#timeListDiv").find("div").click(function () {
            if ($(this).hasClass("active"))
                return;
            $("#timeListDiv").find("div.active").removeClass("active");
            $(this).addClass("active");
            var date = timesToDate($(this).html());
            displayStationShiKuang(t.ysData[date.getTime()]);
            refreshTitleDiv();
        });
    }

    function displayControl() {
        $("#ysElement").find(".rhjcHourSpan").each(function () {
            if ($(this).hasClass("active")) {
                plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = true;
            } else {
                plotStyles_zhjc[parseInt($(this).attr("flag"))].visible = false;
            }
        });
        $("#skElement").find(".rhjcHourSpan").each(function () {
            if ($(this).hasClass("active")) {
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = true;
            } else {
                plotStyles_rhjc[parseInt($(this).attr("flag"))].visible = false;
            }
        });
    }

    function getStationsTime(otime) {
        return otime.substr(0, 4) + otime.substr(5, 2) + otime.substr(8, 2) + otime.substr(11, 2);
    }

    function getStationsTimeMin(otime) {
        return otime.substr(0, 4) + otime.substr(5, 2) + otime.substr(8, 2) + otime.substr(11, 2) + otime.substr(14, 2);
    }

    //展示查询时段气象要素数据
    function displayStationShiDuan(data) {
        t.stationPlot.removeAllFeatures();
        var pointVectors = [];
        var pointVector = null;
        if (stationLayer.features.length == 0) {
            var stationList = [];
            if ($("#stationType").find(".active").attr("id") == "benz") {
                var stations = t.station_country;
                for (var i = 0; i < stations.length; i++) {
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon, stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point, stations[i], {
                        fillColor: "black",
                        pointRadius: 0.2
                    });
                    stationList.push(stationVector);
                }
            } else {
                var stations = t.station_town;//当查询的为区域站时，与国家站一起显示
                for(var i=0;i<stations.length;i++){
                    var point = new WeatherMap.Geometry.Point(stations[i].Lon,stations[i].Lat);
                    var stationVector = new WeatherMap.Feature.Vector(point, stations[i],{
                        fillColor:"black",
                        pointRadius: 0.2
                    });
                    stationList.push(stationVector);
                }
            }
            stationLayer.addFeatures(stationList);
        }

        for (var i = 0; i < data.length; i++) {
            var attribute = {};
            var point = new WeatherMap.Geometry.Point(data[i].Lon, data[i].Lat);
            if(data[i]["降水时段"] != 0){
                attribute["降水"] = data[i]["降水时段"];
                pointVector = new WeatherMap.Feature.Vector(point, attribute);
                pointVectors.push(pointVector);
            }
        }
        t.stationPlot.addFeatures(pointVectors);
    }

    function stationDateFormat(ObservTimes) {
        //2016-08-03 08:00:00.000//2016 08 02 12
        if ($("#timeType").find(".active").attr("id") == "timeHour") {
            var time = ObservTimes.substr(0, 4) + "-" + ObservTimes.substr(4, 2) + "-" + ObservTimes.substr(6, 2) + " " + ObservTimes.substr(8, 2) + ":00:00.000";
        }
        else {
            var time = ObservTimes.substr(0, 4) + "-" + ObservTimes.substr(4, 2) + "-" + ObservTimes.substr(6, 2) + " " + ObservTimes.substr(8, 2) + ":" + ObservTimes.substr(10, 2) + ":00.000";
        }
        return time;
    }

    function alarm() {
        t.audioCtl = new AudioController('audio/orange.wav');
        t.$selModel = $('#alarm_modal_confirm');
        t.audioCtl.setAttr(false, true);
        t.audioCtl.play();
    }

    function windowInfoXY(lonLat, contentHTML) {
        var pixel = GDYB.Page.curPage.map.getPixelFromLonLat(lonLat);
        $("#myInfoWin").html(contentHTML);
        var height = parseInt($("#myInfoWindow").css("height"));
        var width = $("#myInfoWindow").css("width");
        var bt = "B";
        var lr = "L";
        $(".myInfoImg").css("display", "none");
        $("#myInfo" + bt + lr).css("display", "block");
        $("#myInfoWindow").css("top", pixel.y);
        $("#myInfoWindow").css("left", pixel.x + 68);
        $("#myInfoWindow").css("margin-top", "-" + (height - 12) + "px");
        $("#myInfoWindow").css("margin-left", "-50px");
        $("#myInfoWindow").css("display", "block");
        GDYB.Page.curPage.map.events.register("move", map, function (event) {
            if ($("#myInfoWindow").css("display") == "block") {
                var pixel = GDYB.Page.curPage.map.getPixelFromLonLat(lonLat);
                $("#myInfoWindow").css("top", pixel.y);
                $("#myInfoWindow").css("left", pixel.x + 68);
            }
        });
    }

    /** end */
}
QDLSKPageClass.prototype = new PageBase();