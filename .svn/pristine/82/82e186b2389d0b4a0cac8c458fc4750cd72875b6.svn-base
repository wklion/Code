
function ZHJCLDPageClass(){
    this.layerPlot = null;
    this.realTime = true;
    this.num = 0;
    this.layer = null;
    this.animation = false;
    var t = this;
    this.keyDown = false;


    this.renderMenu = function() {
        var htmlStr = "<div style='padding-top: 15px;'>"
            +"<div>"
                +"<div class='title1'>拼图</div>"
                +"<div id='puzzle' class='btn_line3 menuDiv_bottom1' style='margin-left: 13px;'><button id='radar_mcr' class='active'>组合反射率</button><button id='radar_mtop'>回波顶高</button><button id='swan_trec'>TREC</button>"
                +"<button id='swan_titan'>TITAN</button><button id='radar_mvil' >液态含水量</button>"
                +"<div id='cappiDiv' class='btn_line6'><button id='cappi'  style='width:65px;'>CAPPI&nbsp;:</button><button>0.5</button><button  >1.0</button><button  >1.5</button><button  >2.0</button><button  >2.5</button><button  >3.0</button><button  >3.5</button></div>"
                +"<div id='equalTempRDiv'><button id='equalTempR' style='width:65px;' >特殊层&nbsp;:</button><button flag='0' style='width:45px;'  >0℃</button><button flag='-10' style='width:45px;'  >-10℃</button><button flag='-20' style='width:45px;'  >-20℃</button><button flag='-30' style='width:45px;' >-30℃</button></div>"
                +"</div>"
            +"</div>"
            +"<div>"/*
                +"<div class='title1'>单站</div>"
                +"<div id='station' class='menuDiv_bottom1' style='font-size: 12px;'><div style='height: 40px;margin: 5px 0px 0px 19px;' class='btn_line4'><span style='float: left;'>雷达站：</span><div id='radarArea' style='margin-left: 48px;'><button id='radar_lanzhou'>兰州</button><button id='radar_tianshui'>天水</button><button id='radar_jiayuguan' >嘉峪关</button><button id='radar_guyuan' >固原</button><button id='radar_baoji' >宝鸡</button><button id='radar_guangyuan' >广元</button><button id='radar_hanzhong' >汉中</button></div></div>"
                +"<div style='height: 22px;margin: 5px 0px 0px 19px;'><span style='display: inline-block;width: 48px;'>产品：</span><button id='radar_r'>基本反射率</button><button id='radar_v'>径向速度</button></div>"
                +"<div style='height: 22px;margin: 5px 0px 0px 19px;' class='btn_line5'><span style='display: inline-block;width: 48px;'>仰角：</span><button flag='1'>0.5</button><button flag='2'>1.5</button><button flag='3'>2.4</button><button flag='4'>3.4</button><button flag='5'>4.3</button><button flag='6'>5.3</button><button flag='7'>6.7</button></div></div>"
            +"</div>"*/
            +"<div style='padding-top: 10px;'>"
                +"<div class='btn_line3' ><input id='timeRadio' type='radio' checked='true' name='rhjcQueryRadio' style='margin: -3px 5px 0px 17px;outline: none;'><label for='timeRadio' style='display: inline-block;cursor: pointer;color:#4DB8D7;'>实时</label><span id='nowTime' style='color: red;margin-left: 15px;line-height: 22px;'></span></div>"
                +"<div id='hourSpan' class='btn_line3' style='height: 30px;'><input id='hourRadio' type='radio' name='rhjcQueryRadio' style='margin: 4px 5px 0px 17px;outline: none;float: left;'><label for='hourRadio' style='float: left;margin-right: 10px;line-height: 22px;cursor: pointer;color:#4DB8D7;'>时段</label><div class='rhjcHourSpan' style='width: 60px;'>1H</div><div class='rhjcHourSpan' style='width: 60px;'>3H</div><div class='rhjcHourSpan' style='width: 60px;'>6H</div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>从：</span><div id='dateSelect1' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
                +"<div class='btn_line3' style='width: 100%;height: 34px;'><span style='float: left;margin-left: 39px;'>到：</span><div id='dateSelect2' class='dateSelect' style='float: left;width: 191px;height: 26px;'></div></div>"
            +"<div id='query_action' class='btn_line3' style='height: 30px;'><div class='rhjcQueryTime'>查询</div><div class='rhjcQueryTime'>动画</div><div class='rhjcQueryTime'>停止</div><select id='animationSelect' style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 10px;background-color: #03425e;color: white;border: 1px solid rgb(49, 202, 255);'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div>"
                /*+"<div id='ytfButton'>"
                +"<div  style='margin-left:25%;margin-top:3px;padding: 0px 20px 10px 10px;'><input style='float: left;width: 50px;height: 22px;padding: 2px;margin-left: 10px;' type='text' id='zldfValue' value='' />&nbsp;&nbsp;<div class='rhjcQueryTime'>回波过滤</div></div>"
                +"</div>"*/
                +"<div id='timeListDiv' class='timeListDiv' style='top: 380px;'></div>"
            +"</div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        this.myDateSelecter1 = new DateSelecter(0,0); //最小视图为天
        this.myDateSelecter1.changeHours(-1*60);
        this.myDateSelecter1.intervalMinutes = 60*1; //12小时
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

        $("#query_action").find(".rhjcQueryTime").click(function(){
            if($(this).html() == "查询"){
                t.animation = false;
                if($("#hourRadio")[0].checked)
                    getRadarTimes();
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

        if(!this.keyDown){
            this.keyDown = true;
            $(document).keydown(function (event) {
                if(GDYB.Page.curPage != GDYB.ZHJCLDPage)
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
            /*
             * author:dx
             * */
            if($(this).parent(0).attr("id")=='equalTempRDiv' || $(this).parent(0).attr("id")=='cappiDiv'){
                if($(this).attr("id")=='equalTempR'||this.id=='cappi'){
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
        });
        $("#hourRadio").click(function(){
            t.realTime = false;
            $("#nowTime").html("");
            clearAllElement();
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

        GDYB.Legend.update(heatMap_MCRStyles);
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
            t.layer.transparentColors = colors;
            t.layer.redraw();
        });

        getNewRadar(0);
    }

    function displayRadar(times){
        var radarParam = getRadarParam(times);
        var options = {useCanvas:true,isBaseLayer:false};
        t.layer = new WeatherMap.Layer.Image(
            "radar",
            radarParam.url,
            radarParam.bounds ,
            options
        );
        t.layer.setOpacity(0.7);
        clearRadarLayer();
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
        /*
        else{
            var list = $("#station").find("button.active");
            var boundsList = qdlldBounds[$(list[0]).attr("id")];
            bounds= new WeatherMap.Bounds(boundsList[0],boundsList[1],boundsList[2],boundsList[3]);
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[$(list[0]).attr("id")];
            if($(list[1]).attr("id") == "radar_r"){
                var product = "R";
            }
            else{
                var product = "V";
            }
            product += $(list[2]).attr("flag");
            url = url.replace("time",time).replace("bounds",boundsStr).replace("product",product);
        }
        */
        return {url:url,bounds:bounds};
    }

    //获取带time的雷达物理盘地址
    function getRadarUrl(){
        var url = "D:/Tomcats/apache-tomcat-gdyb-dataservice/webapps/cache";
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
        /*
        else{
            var list = $("#station").find("button.active");
            var boundsList = qdlldBounds[$(list[0]).attr("id")];
            var boundsStr = boundsList[0]+"_"+boundsList[1]+"_"+boundsList[2]+"_"+boundsList[3];
            url += qdlldUrl[$(list[0]).attr("id")];
            if($(list[1]).attr("id") == "radar_r"){
                var product = "R";
            }
            else{
                var product = "V";
            }
            product += $(list[2]).attr("flag");
            url = url.replace("bounds",boundsStr).replace("product",product);
        }
        */
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
                var content = "";
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
                });
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
                    $("#nowTime").html(nowDate.getFullYear()+ "年" + (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) + "月" + (Array(2).join(0)+nowDate.getDate()).slice(-2) + "日" + (Array(2).join(0)+nowDate.getHours()).slice(-2)+ "时" +(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"分");
                    displayRadar(times);
                }
            });
        }
    }

    function clearRadarLayer(){
        var radarList = GDYB.Page.curPage.map.getLayersByName("radar");
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
        },$("#animationSelect").val()*1000);
    }

    function clearElement(obj){

    }

    function clearAllElement(){
        clearRadarLayer();
        GDYB.RadarDataClass.clearRadarData("swan_titan");
        GDYB.RadarDataClass.clearRadarData("swan_trec");
    }

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
                else /*if(num<4)*/
                    getRadarData(nowDate.getTime()-6*60*1000,num+1);
                return;
            }
            else{
                GDYB.RadarDataClass.displayRadarData(null, $("#puzzle").find("button.active").attr("id"), 0, time);
                $("#nowTime").html(nowDate.getFullYear() +"年"+ (Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2) +"月"+ (Array(2).join(0)+nowDate.getDate()).slice(-2) +"日"+ (Array(2).join(0)+nowDate.getHours()).slice(-2) +"时"+ (Array(2).join(0)+nowDate.getMinutes()).slice(-2) +"分")
            }
        }, $("#puzzle").find("button.active").attr("id"), 0, time);
    }
}
ZHJCLDPageClass.prototype = new PageBase();