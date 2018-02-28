/**
 * Created by Administrator on 2016/5/17.
 */
var qdlldUrl = {
    radar_mcr:"/pup/cr/Z_RADR_I_radar_time_P_DOR_CD_CR_40X40_460_NUL.bin_bounds.png",
    radar_mtop:"/pup/et/Z_RADR_I_radar_time_P_DOR_CD_ET_40X40_230_NUL.bin_bounds.png",
    radar_mvil:"/pup/vil/Z_RADR_I_radar_time_P_DOR_CD_VIL_40X40_230_NUL.bin_bounds.png",
    radar_ohp:"/pup/ohp/Z_RADR_I_radar_time_P_DOR_CD_OHP_20_230_NUL.bin_bounds.png",
    cappi:"/ncard/TDPRODUCT/CAPPI/Z_OTHE_RADAMOSAIC_time.bin_Z_OTHE_RADAMOSAIC_time_elevation_bounds.png",
    equalTempR:"/ncard/TDPRODUCT/EQUALTEMPR/Z_LCMO_EQUALTEMPR_Televation_time.bin_bounds.png",
    micaps_qpe:"/qpe/QPF.time.000_bounds.png",
    micaps_qpf:"/qpf/QPF.time.060_bounds.png",

    swan_titan:"P:/share/LOCAL/titan/Z_TITAN_time.bin.bz2",
    swan_trec:"P:/share/LOCAL/gd/cotrecwind/Z_TREC_time.bin.bz2",
    radar_gannan:"/RadarData/gannan/Z_RADR_I_Z9941_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_guyuan:"/RadarData/guyuan/Z_RADR_I_Z9954_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_hanzhong:"/RadarData/hanzhong/Z_RADR_I_Z9916_time_O_DOR_CB_CAP.bin_product_bounds.png",
    radar_jiayuguan:"/RadarData/jiayuguan/Z_RADR_I_Z9937_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_lanzhou:"/RadarData/lanzhou/Z_RADR_I_Z9931_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_tianshui:"/RadarData/tianshui/Z_RADR_I_Z9938_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_wudu:"/RadarData/wudu/Z_RADR_I_Z9939_time_O_DOR_CC_CAP.bin_product_bounds.png",
    radar_xifeng:"/RadarData/xifeng/Z_RADR_I_Z9934_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_xining:"/RadarData/xining/Z_RADR_I_Z9971_time_O_DOR_CD_CAP.bin_product_bounds.png",
    radar_yanan:"/RadarData/yanan/Z_RADR_I_Z9911_time_O_DOR_CB_CAP.bin_product_bounds.png",
    radar_zhangye:"/RadarData/zhangye/Z_RADR_I_Z9936_time_O_DOR_CC_CAP.bin_product_bounds.png"
};
var qdlldBounds = {radar_mcr:[91,29,110,43],
    radar_mtop:[91,29,110,43],
    radar_mvil:[91,29,110,43],
    radar_ohp:[91,29,110,43],
    cappi:[91,32,110,43],
    equalTempR:[91,29,110,43],
    micaps_qpe:[91,32,110,43],
    micaps_qpf:[91,32,110,43],

    radar_gannan_R:[118,27,124,32],
    radar_gannan_V:[118,27,124,32],
    radar_guyuan_R:[104,34,108,37],
    radar_guyuan_V:[102,32,109,38],
    radar_hanzhong_R:[102,29,111,37],
    radar_hanzhong_V:[102,29,111,37],
    radar_jiayuguan_R:[96,38,100,41],
    radar_jiayuguan_V:[96,38,100,41],
    radar_lanzhou_R:[102,34,106,37],
    radar_lanzhou_V:[102,34,106,37],
    radar_tianshui_R:[102,32,108,37],
    radar_tianshui_V:[102,32,108,37],
    radar_wudu_R:[99,29,110,38],
    radar_wudu_V:[102,31,108,36],
    radar_xifeng_R:[104,32,111,38],
    radar_xifeng_V:[104,32,111,38],
    radar_xining_R:[98,34,104,39],
    radar_xining_V:[98,34,104,39],
    radar_yanan_R:[104,32,114,40],
    radar_yanan_V:[104,32,114,40],
    radar_zhangye_R:[98,37,102,40],
    radar_zhangye_V:[98,37,102,40]
};

function QDLLDPageClass(){
    this.layerPlot = null;
    this.realTime = true;
    this.num = 0;
    this.layer = null;
    this.animation = false;
    var t = this;
    this.keyDown = false;
    this.colors = [];


    this.renderMenu = function() {
        var htmlStr = ""
            +"<div>"
                +"<div class='title1' style='font-size:16px;'>拼图</div>"
                +"<div id='puzzle' class='btn_line4 menuDiv_bottom1' style='padding-left:20px;'><div class='qdlTitleBar'>PUP：</div><div class='qdlContentDiv'><button id='radar_mcr' class='radarBtnSpan active'>CR</button><button id='radar_mtop' class='radarBtnSpan'>ET</button><button id='radar_mvil' class='radarBtnSpan'>VIL</button>"
                +"<button id='radar_ohp' class='radarBtnSpan'>OHP</button><button id='radar_hi' class='radarBtnSpan' style='/*visibility:hidden;*/display:none;'>HI</button><button id='radar_m' class='radarBtnSpan' style='/*visibility:hidden;*/display:none;'>中气旋识别</button></div><div style='clear: both;'></div>"
                +"<div class='qdlTitleBar'>SWAN：</div><div class='qdlContentDiv'><button id='swan_titan'>TITAN</button><button id='swan_trec'>TREC</button></div><div style='clear: both;'></div>"
                +"<div id='cappiDiv' class='btn_line6'><button id='cappi' style='width:65px;border:none;text-align:left;color:#4DB8D7;margin:0 4px 0 0;'>CAPPI&nbsp;:</button><button>0.5</button><button>1.0</button><button>1.5</button><button style='margin-left:71px;'>2.0</button><button>2.5</button><button>3.0</button><button style='margin-left:71px;'>3.5</button></div>"
                +"</div>"
            +"</div>"
            +"<div>"
                +"<div class='title1' style='font-size:16px;'>单站</div>"
                +"<div id='station' class='menuDiv_bottom1' style='font-size: 12px;'><div style='margin: 5px 0px 0px 10px;' class='btn_line4'><div class='qdlTitleBar'>雷达站：</div><div id='radarArea' class='qdlContentDiv'><button id='radar_lanzhou'>兰州</button><button id='radar_tianshui'>天水</button><button id='radar_jiayuguan' >嘉峪关</button><button id='radar_guyuan' >固原</button><button id='radar_gannan' >甘南</button><button id='radar_zhangye' >张掖</button><button id='radar_hanzhong'>汉中</button><button id='radar_yanan'>延安</button><button id='radar_wudu'>武都</button><button id='radar_xifeng'>西峰</button><button id='radar_xining'>西宁</button></div></div>"
                +"<div id='product' style='margin: 5px 0px 0px 10px;'><div class='qdlTitleBar'>产品：</div><div class='qdlContentDiv'><button id='radar_r' flag='R'>基本反射率</button><button id='radar_v' flag='V'>径向速度</button></div></div>"
                +"<div id='elevation' style='margin: 5px 0px 0px 10px;' class='btn_line5'><div class='qdlTitleBar'>仰角：</div><div class='qdlContentDiv'><button flag='1'>0.5</button><button flag='2'>1.5</button><button flag='3'>2.4</button><!--<button flag='4'>3.4</button><button flag='5'>4.3</button><button flag='6'>5.3</button><button flag='7'>6.7</button>--></div></div><div style='clear:both;'></div></div>"
            +"</div>"
            +"<div style='padding-top: 10px;'>"
                +"<div id='timeChoose' class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='margin-left: 15px;line-height: 22px;'></span></div>"
                +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 65px;'>1H</div><div class='rhjcHourSpan' style='width: 65px;'>3H</div><div class='rhjcHourSpan' style='width: 65px;'>6H</div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime' style='margin-left:10px;'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>累加</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 20px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
                +"<div id='timeListDiv' class='timeListDiv' style='top: 610px;'></div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        $(".menu_changeDiv").html("<div class='menu_change'>强天气</div><div name='yjqs' class='menu_change active' style='margin-top: 5px;'>雷达</div><div id='messageNum_yjqs' class='messageNum' style='margin: -75px 0px 0px 26px;'>3</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>云图</div><div name='dqqs' class='menu_change' style='margin-top: 5px;'>融合监测</div>");
        this.myDateSelecter1 = new DateSelecter(0,0); //最小视图为天
        //this.myDateSelecter1.setCurrentTime("2017-06-05 13:00:00"); //演示用
        this.myDateSelecter1.changeHours(-1*60);
        this.myDateSelecter1.intervalMinutes = 60*1; //12小时
        this.myDateSelecter2 = new DateSelecter(0,0); //最小视图为天
        //this.myDateSelecter2.setCurrentTime("2017-06-05 17:00:00"); //演示用
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

        this.layer = null;
        this.animation = false;

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

        $("#query_action").find(".rhjcQueryTime").click(function(){
            if($(this).html() == "查询"){
                t.animation = false;
                if($("#hourRadio")[0].checked) {
                    getRadarTimes();
                    refreshTitleDiv();
                }else{
                    alertModal("当前为实时");
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

        if(!this.keyDown){
            this.keyDown = true;
            $(document).keydown(function (event) {
                if(GDYB.Page.curPage != GDYB.QDLLDPage)
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


        $("#puzzle").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            if($("#puzzle").find("button.active").length != 0){
                var id = $("#puzzle").find("button.active").attr("id");
                if(id == "swan_titan" || id == "swan_trec"){
                    GDYB.RadarDataClass.clearRadarData(id);
                }
                else{
                    clearRadarLayer();
                }
                $("#puzzle").find("button.active").removeClass("active");
            }
            else{
                $("#station").find("button.active").removeClass("active");
            }
            $(this).addClass("active");
            addLegend(this.id);
            /*
             * author:dx
             * */
            var parentID = $(this).parent(0).attr("id");
            if(parentID=='equalTempRDiv' || parentID=='cappiDiv'){
                var thisID = this.id;
                if(thisID=='equalTempR'||thisID=='cappi'){
                    $(this).next().addClass("active");
                }else{
                    $(this).parent(0).children("button").eq(0).addClass("active");
                }
            }

            if($("#hourRadio")[0].checked){
                $("#timeListDiv").html("");
                clearRadarLayer();
                $("#query_action").find("div").eq(0).click();
            }
            else{
                if(this.id == "swan_titan" || this.id == "swan_trec"){
                    getRadarData();
                }
                else{
                    getNewRadar(0);
                }
            }
            refreshTitleDiv();
        });
        $("#station").find("button").click(function(){
            if($(this).hasClass("active"))
                return;
            $("#puzzle").find("button.active").removeClass("active");
            if($("#station").find("button.active").length == 0){
                if($(this).parent()[0].id == "radarArea")
                    var list = $(this).parent().parent().siblings();
                else
                    var list = $(this).parent().siblings();
                for(var i=0;i<list.length;i++){
                    $(list[i]).find("button").eq(0).addClass("active");
                }
                $(this).addClass("active");
            }
            else{
                $(this).parent().find("button.active").removeClass("active");
                $(this).addClass("active");
            }
            if($("#hourRadio")[0].checked){
                $("#timeListDiv").html("");
                clearRadarLayer();
                $("#query_action").find("div").eq(0).click();
            }
            else{
                getNewRadar(0);
            }
            refreshTitleDiv();
        });

        $("#timeRadio").click(function(){
            t.realTime = true;
            t.animation = false;
            if($("#puzzle").find("button.active").length != 0 && ($("#puzzle").find("button.active").attr("id") == "swan_titan" || $("#puzzle").find("button.active").attr("id") == "swan_trec")){
                getRadarData();
            }
            else{
                getNewRadar(0);
            }
            $("#timeListDiv").html("");
            setTimeout(function(){
                refreshTitleDiv();
            },500);
        });
        $("#hourRadio").click(function(){
            t.realTime = false;
            $("#nowTime").html("");
            clearAllElement();
            refreshTitleDiv();
        });

        $("#hourSpan").find("div").click(function(){
            if($(this).html() == "1H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-1*60);
            }
            else if($(this).html() == "3H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-3*60);
            }
            else if($(this).html() == "6H"){
                t.myDateSelecter1.setCurrentTime(t.myDateSelecter2.getCurrentTime(false));
                t.myDateSelecter1.changeHours(-6*60);
            }
        });
        addLegend("radar_mcr");
        getNewRadar(0);

        setTimeout(function(){
            refreshTitleDiv();
        },500);
    };

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
                timeHtml = "";
            }
        }
        if ($("#puzzle button").hasClass("active")) {
            var pintu = "";
            var pintuD = "";
            if ($("#cappi").hasClass("active")) {
                pintu = $("#cappi").html();
                pintuD = $("#cappiDiv button[id!='cappi'].active").html();
                titleHtml = ("<p>" + timeHtml + "&nbsp;&nbsp;" + pintu + pintuD +"</p>");
            } else if ($("#equalTempR").hasClass("active")){
                pintu = $("#equalTempR").html();
                pintuD = $("#equalTempRDiv button[id!='equalTempR'].active").html();
                titleHtml = ("<p>" + timeHtml + "&nbsp;&nbsp;" + pintu + pintuD +"</p>");
            } else {
                pintu = $("#puzzle button.active").html();
                titleHtml = ("<p>" + timeHtml + "&nbsp;&nbsp;" + pintu + "</p>");
            }
        }
        if ($("#radarArea button").hasClass("active")) {
            var station = $("#radarArea button.active").html();
            var product = $("#product button.active").html();
            var elevation = $("#elevation button.active").html();
            titleHtml = ("<p>" + timeHtml + "&nbsp;&nbsp;" + station + "&nbsp;&nbsp;" + product + "&nbsp;&nbsp;" + elevation + "</p>");
        }
        $("#map_QDLtitle_div").html(titleHtml);
    }
    /**
     * @author:wangkun
     * @date:2017-06-19
     * @return:
     * @description:
     */
    function displayRadar(times,id){
        var radarParam = getRadarParam(times);
        var options = {useCanvas:true,isBaseLayer:false};

        if(t.layer == null || t.layer.map == null){
            t.layer = new WeatherMap.Layer.Image(
                "radar",
                radarParam.url,
                radarParam.bounds,
                options
            );
            t.layer.setOpacity(0.9);
            t.layer.transparentColors = t.colors;
            GDYB.Page.curPage.map.addLayer(t.layer);
        }
        else{
            t.layer.url = radarParam.url;
            t.layer.extent = radarParam.bounds;
            t.layer.maxExtent = radarParam.bounds;
            t.layer.orgImageData = null;
            t.layer.memoryImg = null;
            t.layer.redraw();
        }
        //特殊处理,过滤雷达颜色
        if(id === "radar_mcr"){
            $("#div_legend_items div[tag='10']").click();
        }
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
    //获取雷达参数
    function getRadarParam(times){
        var nowDate = new Date(times);
        nowDate.setHours(nowDate.getHours()-8);
        var time = nowDate.getFullYear() + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + (Array(2).join(0)+nowDate.getDate()).slice(-2) + (Array(2).join(0)+nowDate.getHours()).slice(-2) +(Array(2).join(0)+nowDate.getMinutes()).slice(-2) +(Array(2).join(0)+0).slice(-2);
        var url = imgCacheUrl;
        var bounds = null;
        if($("#puzzle").find("button.active").length != 0){
            var boundsList = qdlldBounds[$("#puzzle").find("button.active").attr("id")];
            bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[$("#puzzle").find("button.active").attr("id")];
            url = url.replace("time",time).replace("time",time).replace("bounds",boundsStr);
            if($("#puzzle").find("button.active").attr("id") == 'cappi'){
                url = url.replace("elevation",$("#puzzle").find("button.active").eq(1).html());
            }
            if($("#puzzle").find("button.active").attr("id") == 'equalTempR'){
               var elestr = $("#puzzle").find("button.active").eq(1).attr("flag");
                url = url.replace("elevation",elestr).replace("elevation",elestr).replace("elevation",elestr);
            }
        }
        else{
            var list = $("#station").find("button.active");
            var boundsList = qdlldBounds[$(list[0]).attr("id")+"_"+$(list[1]).attr("flag")];
            bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[$(list[0]).attr("id")];
            var flag = $(list[1]).attr("flag");
            var product = flag+$(list[2]).attr("flag");
            url = url.replace("time",time).replace("bounds",boundsStr).replace("product",product);
        }
        return {url:url,bounds:bounds};
    }

    //获取带time的雷达物理盘地址
    function getRadarUrl(){
        var url = imgCachePath;
        var bounds = null;
        if($("#puzzle").find("button.active").length != 0){
            var id = $("#puzzle").find("button.active").attr("id");
            if(id == "swan_titan" || id == "swan_trec"){
                url = qdlldUrl[id];
            }
            else{
                var boundsList = qdlldBounds[$("#puzzle").find("button.active").attr("id")];
                var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
                url += qdlldUrl[$("#puzzle").find("button.active").attr("id")];
                url = url.replace("bounds",boundsStr);
                if($("#puzzle").find("button.active").attr("id") == 'cappi'){
                    url = url.replace("elevation",$("#puzzle").find("button.active").eq(1).html());
                }
                if($("#puzzle").find("button.active").attr("id") == 'equalTempR'){
                    var elestr = $("#puzzle").find("button.active").eq(1).attr("flag");
                    url = url.replace("elevation",elestr).replace("elevation",elestr).replace("elevation",elestr);
                }
            }
        }
        else{
            var list = $("#station").find("button.active");
            var boundsList = qdlldBounds[$(list[0]).attr("id")+"_"+$(list[1]).attr("flag")];
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[$(list[0]).attr("id")];
            var flag = $(list[1]).attr("flag");
            var product = flag+$(list[2]).attr("flag");
            url = url.replace("bounds",boundsStr).replace("product",product);
        }
        return url;
    }

    //查询雷达时间序列
    function getRadarTimes(){
        var time1 = t.myDateSelecter1.getCurrentTime();
        var time2 = t.myDateSelecter2.getCurrentTime();
        time1 = time1.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
        time2 = time2.replace(/-/g,"").replace(/:/g,"").replace(/\ /g ,"");
        var paraUrl = getRadarUrl();
        //var paraUrl = "http://127.0.0.1:8080/testData/MCR/Z_OTHE_RADAMCR_time.bin_Z_OTHE_RADAMCR_time_0.0_91_32_110_43.png";
        var url=gsDataService + "services/DBService/getRadarByTimes";
        $.ajax({
            type: "POST",
            data: {"para": "{time1:'" + time1 + "',time2:'" + time2 + "',url:'" + paraUrl + "',format:'yyyyMMddHHmmss'}"},
            url: url,
            dataType: "json",
            error:function(data){
                alertModal("查询雷达出错");
            },
            success: function (data) {
                if(data.length == 0){
                    alertModal("该时段无数据");
                    return;
                }
                var content = "";
                cacheImgs(data);
                for(var i=data.length-1;i>=0;i--){
                    var date  = new Date(data[i]);
                    content += "<div value="+data[i]+">"+date.getFullYear()+ "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2)+ ":" +(Array(2).join(0)+date.getMinutes()).slice(-2) + ":"+(Array(2).join(0)+0).slice(-2)+"</div>";
                }
                $("#timeListDiv").html(content);
                $("#timeListDiv").find("div").click(function(){
                    if($(this).hasClass("active"))
                        return;
                    $("#timeListDiv").find("div.active").removeClass("active");
                    $(this).addClass("active");
                    if($("#puzzle").find("button.active").length != 0 && ($("#puzzle").find("button.active").attr("id") == "swan_titan" || $("#puzzle").find("button.active").attr("id") == "swan_trec")){
                        var nowDate = new Date(parseInt($(this).attr("value")));
                        var time = nowDate.getFullYear() +"-"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"-"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +" "+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +":"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
                        GDYB.RadarDataClass.displayRadarData(null, $("#puzzle").find("button.active").attr("id"), 0, time);
                    }
                    else{
                        displayRadar(parseInt($(this).attr("value")));
                    }
                    refreshTitleDiv();
                });
            }
        });
    }
    /**
     * @author:wangkun
     * @date:2017-06-19
     * @return:
     * @description:缓存雷达图片
     */
    function cacheImgs(dates){
        var size = dates.length;
        var arr =[];
        for(var i=0;i<size;i++){
            var radarParam = getRadarParam(dates[i]);
            arr.push(radarParam.url);
        }
        console.log("共"+size+"图片!开始缓存!");
        if(size<1){
            return;
        }
        $('canvas.process').css("display","block");
        $('canvas.process').text(0+"%");
        drawProcess(200);
        $.imgpreload(arr,{
            each:function(e){
                e[e.length-1].crossOrigin="anonymous";
                var proSize = parseInt(e.length*100/size);
                $('canvas.process').text(proSize+"%");
                drawProcess(200);
            },
            all:function(){
                $('canvas.process').css("display","none");
                console.log("所有加载完毕!");
                if($("#timeListDiv").find("div").length!=0){
                    $("#timeListDiv").find("div").eq(0).click();
                }
            }
        });
    }
    //最新雷达 无数据则往前推四次
    function getNewRadar(num ,time){
        var times = null;
        if(num == 0){
            clearRadarLayer();
            var nowDate = new Date();
            if($("#puzzle").find("button.active").length != 0){
                nowDate.setMinutes(nowDate.getMinutes()-nowDate.getMinutes()%6);
            }
            else{
                nowDate.setMinutes(nowDate.getMinutes()-10);
            }

            times = nowDate.getTime();
        }
        else{
            times = time;
        }
        if(num<10){
            var radarParam = getRadarParam(times);
            getUrlExists(radarParam.url,function(exist) {
                if (!exist) {
                    num++;
                    if($("#puzzle").find("button.active").length != 0){
                        getNewRadar(num,times-6*60*1000);
                    }
                    else{
                        getNewRadar(num,times-1*60*1000);
                    }
                }
                else{
                    var nowDate = new Date(times)
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日&nbsp;" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    var findBtn = $("#puzzle").find("button.active");
                    var id = findBtn.length>0?findBtn[0].id:null;
                    displayRadar(times,id);
                }
            });
        }
        // 轮询刷新数据
        setTimeout(function () {
            if (t.realTime && GDYB.Page.curPage == GDYB.QDLLDPage)
                getNewRadar(0);
        }, 1000*60*5);
    }

    function clearRadarLayer(layerName){
        var radarList = GDYB.Page.curPage.map.getLayersByName(typeof(layerName)=="undefined"?"radar":layerName);
        if(radarList){
            for(var i=0;i<radarList.length;i++){
                GDYB.Page.curPage.map.removeLayer(radarList[i]);
                radarList[i].destroy();
            }
        }
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
        },$("#animationSelect").val()*300);
    }

    function clearElement(obj){

    }

    function clearAllElement(){
        clearRadarLayer();
        GDYB.RadarDataClass.clearRadarData("swan_titan");
        GDYB.RadarDataClass.clearRadarData("swan_trec");
    }
    //查询最新titan和trec
    function getRadarData(times,num){
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
                    getRadarData(nowDate.getTime()-6*60*1000,1);
                else if(num<10)
                    getRadarData(nowDate.getTime()-6*60*1000,num+1);
                return;
            }
            else{
                GDYB.RadarDataClass.displayRadarData(null, $("#puzzle").find("button.active").attr("id"), 0, time);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日&nbsp;"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, $("#puzzle").find("button.active").attr("id"), 0, time);
    }

    //添加图例
    function addLegend(radarName){
        var heatMap = null;
        if(radarName == "radar_mtop"){
            heatMap = heatMap_MCRTopStyles;
        }
        else{
            heatMap = heatMap_MCRStyles;
        }
        GDYB.Legend.update(heatMap);
        //注册点击事件
        $("#div_legend_items").find("div").click(function(){
            if(t.layer == null)
                return;
            var styles = GDYB.Legend.styles;
            var legenItemValue = Number($(this).attr("tag"));
            var bvisible = typeof(this.attributes["visible"]) == "undefined" || this.attributes["visible"].value == "true";
            if(bvisible)
            {
                $(this).css("background-color", "rgb(255, 255, 255)");
                $(this).attr("visible", "false");
            }
            else
            {
                var rgb = GDYB.Legend.items[legenItemValue];
                $(this).css("background-color", rgb);
                $(this).attr("visible", "true");
            }

            var colors = [];
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
            t.colors = colors;
            t.layer.transparentColors = colors;
            t.layer.redraw();
        });
    }
}
QDLLDPageClass.prototype = new PageBase();