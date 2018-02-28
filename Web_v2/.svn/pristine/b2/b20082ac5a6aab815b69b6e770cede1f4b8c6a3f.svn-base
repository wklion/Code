/**
 * Created by Administrator on 2015/12/21.
 */
function ZDYBPageClass(){
    this.myDateSelecter = null;
    this.time = false;//关联_时效
    this.station = false;//关联_站点
    this.hours = false;//关联_12小时
    this.notEmpty = false;//关联_非空
    this.stationList = [];//城镇预报站点集合
    this.xzStationList = [];//乡镇站点集合
    this.elementData = [];//预报制作配置
    this.elements = [];
    this.yubaoyaosu = null;
    this.endTime = null;
    this.zdybTownNum = null;
    this.refreshTime = false;
    this.layerPlot = null;
    this.windowWidth = null;
    this.areaName = null;
    this.refreshTime = false;
    this.allElements = {};

    this.xzData = null;
    var t = this;

    this.renderMenu = function(){
        var htmlStr = "<div id='div_datetime' style='padding-left:10px;height: 40px;'>"
            +"<div id='dateSelect' style='margin: 10px 0px 0px 0px;float: left;width: 140px;height: 26px;'></div>" +
            "<div id='zdybTimeTypeDiv' class='zdybTimeTypeDiv'><input type='radio' name='zdybtime' checked='true' style='height: 18px;'><span class='zdybTimeType'>全部</span>" +
            "<input type='radio' name='zdybtime' style='height: 18px;'><span class='zdybTimeType'>早晨</span>" +
            "<input type='radio' name='zdybtime' style='height: 18px;'><span class='zdybTimeType'>上午</span>" +
            "<input type='radio' name='zdybtime' style='height: 18px;'><span class='zdybTimeType'>下午</span></div></div>"
            +"<div id='zdybProductTypePanel' class=''></div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        t.myDateSelecter = new DateSelecter(2,2,"yyyy-mm-dd");
        t.myDateSelecter.intervalMinutes = 60*24; //24小时
        $("#dateSelect").html(t.myDateSelecter.div);
        $("#dateSelect").find("input").css("width","90px").css("color","white");

        //添加弹出选择要素框
        if($("body").find(".zdybElementChange").length == 0){
            $(".body").append("<ul id='zdybElementChange' class='zdybElementChange'></ul>");
        }

        //时间类别选择
        $("#zdybTimeTypeDiv").find("input").click(function(){
            var name = $(this).next().html();
            var list = $("#zdybProductTypePanel").find("div.dis_menu_body_item");
            if(name == "全部"){
                $("#zdybProductTypePanel").find("div.dis_menu_body_item").css("display","block");
            }
            else if(name == "早晨"){
                for(var i=0;i<list.length;i++){
                    if($(list[i]).attr("elementId")=="-1"){
                        continue;
                    }
                    var publishTime = t.elementData[parseInt($(list[i]).attr("elementId"))].publishTime;
                    if(publishTime>=0&&publishTime<8){
                        $(list[i]).css("display","block");
                    }
                    else{
                        $(list[i]).css("display","none");
                    }
                }
            }
            else if(name == "上午"){
                for(var i=0;i<list.length;i++){
                    if($(list[i]).attr("elementId")=="-1"){
                        continue;
                    }
                    var publishTime = t.elementData[parseInt($(list[i]).attr("elementId"))].publishTime;
                    if(publishTime>=8&&publishTime<12){
                        $(list[i]).css("display","block");
                    }
                    else{
                        $(list[i]).css("display","none");
                    }
                }
            }
            else if(name == "下午"){
                for(var i=0;i<list.length;i++){
                    if($(list[i]).attr("elementId")=="-1"){
                        continue;
                    }
                    var publishTime = t.elementData[parseInt($(list[i]).attr("elementId"))].publishTime;
                    if(publishTime>=12&&publishTime<24){
                        $(list[i]).css("display","block");
                    }
                    else{
                        $(list[i]).css("display","none");
                    }
                }
            }
        });
        $.ajax({
            type: 'post',
            url: gridServiceUrl + "services/ForecastfineService/getZDYBElement",
            data: null,
            dataType: 'json',
            error: function () {
                alertModal('获取输出类型错误!');
            },
            success: function (data) {
                for(var i=0;i<data.length;i++){
                    t.allElements[data[i].code] = data[i];
                }
            }
        });
        //获取所有产品
        GDYB.GridProductClass.init(function(){
            if(GDYB.GridProductClass.currentUserDepart.departCode.length == 2){
                t.areaName = "qutai";
            }
            else{
                t.areaName = "shitai";
            }
            getZDYBPublishTime();
        });

        //时间选择事件
        t.myDateSelecter.input.change(function(){
            $("#zdybProductTypePanel").find(".productActive").click();
            getAllProductNum();
            //getZDYBPublishTime();
        });
        //时间选择事件
        t.myDateSelecter.leftBtn.click(function(){
            $("#zdybProductTypePanel").find(".productActive").click();;
            getAllProductNum();
            //getZDYBPublishTime();
        });
        //时间选择事件
        t.myDateSelecter.rightBtn.click(function(){
            $("#zdybProductTypePanel").find(".productActive").click();;
            getAllProductNum();
            //getZDYBPublishTime();
        });

        //添加右侧表格/预览div
        if($("#workspace_div").find("#ZDYBDiv").length == 0){
            $("#workspace_div").append("<div id='ZDYBDiv' style='background-color: rgb(240,240,240);left:66px;right:358px;top: 10px;bottom: 0px;position: absolute;'><div id='ZDYBAllContent'>" +
                "<div style='height: 30px;line-height: 30px;background-color: #4C9ED9;margin-top: 1px;'><span id='zdybTitle' style='font-weight: bold;position: absolute;left: 50%;margin-left: -140px;'></span><span id='zdybTimeCountdown' style='color: red;float: right'>00小时26分钟10秒</span><span id='zdybTimeCountdownTitle' style='float: right;font-size: 12;'>注意：距上网截止时间还剩</span></div>" +
                "<div id='zdybCityChangeDiv' flag='false' class='zdybCityChangeDiv'></div>" +
                "<div class='zdybPreviewOptions'>" +
                "<div id='zdybShowTableControl'>" +
                "<div id='zdybCity' class='zdybCityDiv'></div>" +
                "<div id='zdybShowChange' class='zdybPreviewClass' style='display: block;' name='zdybPreviewButton'>预览报文</div>" +
                "<div class='zdybRelationClass' flag='false' style='display: block;' name='station'>站点关联</div>" +
                "<div class='zdybRelationClass' flag='false' style='display: block;' name='time'>时效关联</div>" +
                "</div>" +
                "<div style='float: right;' id='refreshzdyb' class='zdybRelationClass'>刷新</div>"+
                "<div id='zdybPreviewControl' style='display: none;'></div>" +
                "</div>"+
                "<div id='zdybShowTableDiv'style='width: 100%;'>" +
                "<div id='ZDYBTableDiv'style='width: 100%;'>" +
                "<div style='float: left;width: 222px;height: 43px;'>" +
                "<table id='ZDYBHeaderLeft' class='ZDYBLeftTitleTable'></table>" +
                "</div>" +
                "<div id='zdybHeaderdiv' style='position: absolute;left: 222px;right: 17px;height: 43px;overflow: hidden;'>" +
                "<table id='ZDYBHeaderTable' class='ZDYBTitleTable'></table>" +
                "</div>" +
                "<div id='zdybColumndiv' style='position: absolute;top: 104px;bottom: 10px;width: 222px;overflow: hidden;border-bottom:rgb(200,200,200) solid 1px;'>" +
                "<table id='ZDYBColumnTable' class='ZDYBLeftTable'></table>" +
                "</div>" +
                "<div id='zdybMaindiv' style='overflow: hidden;position: absolute;top:104px;left: 222px;right: 17px;bottom: 10px;'>" +
                "<table class='ZDYBTable' border='1'></table>" +
                "</div>" +
                "<div id='scrollY' style='position: absolute;right: 0px;width: 17px;top: 61px;bottom: 17px;overflow: auto;' onscroll='fnScroll()'><div id='scrollYDiv'style='width: 1px;'></div></div>"+
                "<div id='scrollX' style='position: absolute;bottom: 0px;height: 17px;left: 0px;right: 17px;overflow: auto;' onscroll='fnScroll()'><div id='scrollXDiv'style='height: 1px;'></div></div>"+
                "</div>"+
                "</div>" +
                "<div id='zdybPreviewDiv' style='width: 100%;display: none;overflow: auto;background-color: #FFFFFF;position: absolute;top: 61px;bottom: 10px;'>" +
                "</div>" +
                "</div>" +
                "</div>");
        }

        $("#map_div").css("display","none");
        //计算表格宽度
        var width = document.body.offsetWidth;
        t.windowWidth = width;
        //$("#ZDYBDiv").css("width",parseInt(width)-415);//左侧面板宽度415px
        /*$("#zdybHeaderdiv").css("width",parseInt(width)-637);
        $("#zdybMaindiv").css("width",parseInt(width)-637);
        $("#divFiles").css("width",parseInt(width)-415);
        $("#zdybColumndiv").css("max-height",parseInt($("#ZDYBDiv").css("height"))-104);//标题加操作栏加表头90px
        $("#zdybMaindiv").css("max-height",parseInt($("#ZDYBDiv").css("height"))-104);//标题加操作栏加表头90px
        $("#divFiles").css("max-height",parseInt($("#ZDYBDiv").css("height"))-31);//标题30px
        $("#zdybPreviewDiv").css("max-height",parseInt($("#ZDYBDiv").css("height"))-61);//标题加操作栏60px*/
        //预览点击事件
        $("#zdybShowChange").click(function(){
            if($(this).attr("name")=="zdybPreviewButton"){
                //判断预报是否有雪
                var list = $(".ZDYBTable").find("td");
                var listInput = $(".ZDYBTable").find("input");
                var listSnow = new Array();
                var listTempmin = [];
                var listTempmax = [];
                var listLength = list.length;
                for(var i=0;i<listLength;i++){
                    if($(list[i]).html().indexOf("雪")!=-1){
                        listSnow.push(list[i]);
                    }
                }
                for(var i=0;i<listInput.length;i++){
                    if(parseFloat($(listInput[i]).val())<0){
                        listTempmin.push(listInput[i]);
                    }
                    if(parseFloat($(listInput[i]).val())>40){
                        listTempmax.push(listInput[i]);
                    }
                }
                var textShow = "";
                for(var i=0;i<listSnow.length;i++){
                    if(i==2){
                        textShow += "\n...\n";
                        break;
                    }
                    textShow += "\n";
                    textShow += t.stationList[parseInt($(listSnow[i]).attr("cols"))].StationName + "站";
                    textShow += $(listSnow).parent().attr("shixiao") + "小时预报:" +$(listSnow).html();
                }
                if(listSnow.length>0){
                    textShow += "共" + listSnow.length + "站次预报包含雪\n";
                }
                for(var i=0;i<listTempmin.length;i++){
                    if(i==2){
                        textShow += "\n...\n";
                        break;
                    }
                    textShow += "\n";
                    textShow += t.stationList[parseInt($(listTempmin[i]).parent().attr("cols"))].StationName + "站";
                    textShow += $(listTempmin).parent().parent().attr("shixiao") + "小时预报:" +$(listTempmin).val()+"°C";
                }
                if(listTempmin.length>0){
                    textShow += "共" + listTempmin.length + "站次预报低于0°C\n";
                }
                for(var i=0;i<listTempmax.length;i++){
                    if(i==2){
                        textShow += "\n...\n";
                        break;
                    }
                    textShow += "\n";
                    textShow += t.stationList[parseInt($(listTempmax[i]).parent().attr("cols"))].StationName + "站";
                    textShow += $(listTempmax).parent().parent().attr("shixiao") + "小时预报:" +$(listTempmax).val()+"°C";
                }
                if(listTempmax.length>0){
                    textShow += "共" + listTempmax.length + "站次预报高于40°C\n";
                }
                if(textShow != ""){
                    confirmModal(textShow,function(){
                        zdybTableToData();
                        $("#ZDYBTableDiv").css("display","none");
                        hideZDYBTableButton();
                        $(this).attr("name","zdybTableButton");
                        $(this).html("返回表格");
                        $("#zdybPreviewControl").css("display","block");
                        $("#zdybPreviewDiv").css("display","block");
                    });
                }
                else{
                    zdybTableToData();
                    $("#ZDYBTableDiv").css("display","none");
                    hideZDYBTableButton();
                    $(this).attr("name","zdybTableButton");
                    $(this).html("返回表格");
                    $("#zdybPreviewControl").css("display","block");
                    $("#zdybPreviewDiv").css("display","block");
                }
            }
            //返回表格
            else if($(this).attr("name")=="zdybTableButton"){
                $("#zdybPreviewControl").css("display","none");
                $("#zdybPreviewDiv").css("display","none");
                $("#ZDYBTableDiv").css("display","");
                $("#zdybEditText").css("display","none");
                showZDYBTableButton();
                $(this).attr("name","zdybPreviewButton");
                $(this).html("预览报文");
            }
        });

        //关联点击事件
        $("#zdybShowTableControl").find(".zdybRelationClass").click(function(){
            if($(this).attr("flag")=="false"){
                $(this).attr("flag","true");
                $(this).css("background-color","rgb(246,135,30)");
                t[$(this).attr("name")] = true;
            }
            else{
                $(this).attr("flag","false");
                $(this).css("background-color","");
                t[$(this).attr("name")] = false;
            }
        });

        $("#refreshzdyb").click(function(){
            $("#zdybProductTypePanel").find(".productActive").click();
        });

        //城市跳转
        $("#zdybCity").hover(function(){
            $(this).attr("flag","true");
            $("#zdybCityChangeDiv").css("display","block");
        },function(){
            $(this).attr("flag","false");
            setTimeout(function(){
                if($("#zdybCityChangeDiv").attr("flag")=="false"&&$("#zdybCity").attr("flag")=="false"){
                    $("#zdybCityChangeDiv").css("display","none");
                }
            },200);
        });
        //城市跳转下拉框
        $("#zdybCityChangeDiv").hover(function(){
            $(this).attr("flag","true");
        },function(){
            $(this).attr("flag","false");
            $(this).css("display","none");
        });

        //点击生成格点报
        $("#btnExportMicaps").click(function() {
            if(GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 2){
                alertModal("只有区台才可以生成格点报");
                return;
            }
            $("#div_modal_confirm_content").html("是否（重新）生成格点报？");
            $("#div_modal_confirm").modal();
            $("#div_modal_confirm").find("a").unbind();
            $("#div_modal_confirm").find("a").click(function(){
                if(typeof(this.id) != "undefined") {
                    if (this.id == "btn_ok") {
                        var elements = "r12,tmax,tmin,wmax,w,air,r3,2t,10uv,rh,tcc,vis"; //暂时写死
                        var activeNode = $("#zdybProductTypePanel").find("div.productActive");
                        if(activeNode.length > 0){
                            var makeTimeHour = $(activeNode[0]).attr("flag");
                            var today = $("#dateSelect").find("input").val();
                            var makeTime = today.substr(0, 10) + " " + makeTimeHour + ":00:00";
                            GDYB.GridProductClass.exportToMicaps(function(){
                                displayGridFiles(makeTimeHour);
                            },"cty", elements, makeTime);
                        }
                    }
                }
            });
        });
    };

    //格点预报时间与站点预报时间对应关系，add by zouwei
    function getGridTimeFromStationTime(makeTimeStation){
        var year = parseInt(makeTimeStation.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
        var month = parseInt(makeTimeStation.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
        var day = parseInt(makeTimeStation.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
        var hour = parseInt(makeTimeStation.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
        var minutes = 0;
        var seconds = 0;

        var hourGrid = hour;
        hourGrid = t.nowElement.gdybPublishTime;
        var makeTimeGrid = new Date();
        makeTimeGrid.setFullYear(year,month - 1,day);
        makeTimeGrid.setHours(hourGrid, minutes, seconds, 0);
        return makeTimeGrid.format("yyyy-MM-dd hh:mm:ss");
    }


    //初始化表格
    function initZDYBTable(list){
        $(".ZDYBTable").html("");
        $(".ZDYBTable").css("width",list.length*101+1);//单元格宽度101px
        $("#ZDYBHeaderTable").css("width",list.length*101+1);//单元格宽度101px

        //获取制作时间
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4));
        var date = nowDate.getDate();
        nowDate.setDate(nowDate.getDate()+1);
        var date1 = nowDate.getDate();
        var yubaoTime = mosaicTime(parseInt(t.nowElement.forecastTime)+8);
        var contentObj = {};
        var contentObjColumn = "";
        var contentHtml = "";
        contentObj[0] = '<tr >';
        contentObj[1] = '<tr >';
        var city = null;
        var cityStationNum = 0;
        $("#zdybCityChangeDiv").html("");
        if(list.length!=0){
            city = list[0].AreaName;
            $("#zdybCity").html(city);
        }
        var i;
        for(i=0;i<list.length;i++) {
            if(list[i].AreaName==city){
                cityStationNum ++;
            }
            else{
                contentObj[0] +='<td colspan="'+cityStationNum+'">'+city+'</td>'
                $("#zdybCityChangeDiv").append("<div class='zdybCityChange' num='"+(i-cityStationNum)+"'>"+city+"</div>");
                city = list[i].AreaName;
                cityStationNum = 1;
            }
            contentObj[1] += '<td  value="' + list[i].StationNum + '" name="' + list[i].StationName + '" Longitude="'+list[i].Longitude+'" hHeight="'+list[i].Height+'" Latitude="'+list[i].Latitude+'">' + list[i].StationName.substr(0,5) + list[i].StationNum + '</td>';
        }
        if(list.length!=0){
            contentObj[0] +='<td colspan="'+cityStationNum+'">'+city+'</td>'
            $("#zdybCityChangeDiv").append("<div class='zdybCityChange' num='"+(i-cityStationNum)+"'>"+city+"</div>");
        }
        contentObj[0] +="</tr>";
        contentObj[1] +="</tr>";
        $("#ZDYBHeaderLeft").html("<tr><td style='width: 120px;'>预报时效</td><td style='width: 102px;'>预报要素</td></tr>");
        $("#ZDYBHeaderTable").html(contentObj[0]+contentObj[1]);
        $(".zdybCityChange").click(function(){
            $("#zdybCity").html($(this).html());
            $("#zdybCity").attr("num",$(this).attr("num"));
            zdybChangeCity(this);
        });
        $("#zdybCity").click(function(){
            zdybChangeCity(this);
        });
        var colorNum = 1;
        var colorClass = "zdybWeather1";
        for(var i=0;i< t.elements.length;i++){
            if(i!=0&&(t.elements[i].element!=t.elements[i-1].element)){
                colorNum++;
                if(colorNum>3){
                    colorNum = 1;
                }
                colorClass = "zdybWeather"+colorNum;
            }
            contentObj[t.elements[i].element+"_"+t.elements[i].hourSpan] = '<tr class="zdybtr'+(i+1)+' '+colorClass+'" shixiao="'+ t.elements[i].hourSpan+'" element="'+t.elements[i].element+'" rows="'+(i+1)+'">';
            contentObjColumn += '<tr class="zdybtr'+(i+1)+'" shixiao="'+ t.elements[i].hourSpan+'" element="'+t.elements[i].element+'" rows="'+(i+1)+'">';
            if(i% t.yubaoyaosu == 0){
                contentObjColumn += '<td style="width: 120px;" rowspan="'+ t.yubaoyaosu+'">'+(i/t.yubaoyaosu+1)*24+'小时<br>'+date+'日'+yubaoTime+'时~'+date1+'日'+yubaoTime+'时</td>';
                date = date1;
                nowDate.setDate(nowDate.getDate()+1);
                date1 = nowDate.getDate();
            }
            var  re=/[\u4E00-\u9FA5]/g;
            var num = t.elements[i].elementName.match(re).length;
            if(((t.elements[i].elementName.length-num)+2*num)>15){
                t.elements[i].elementName = t.elements[i].elementName.substr(0,8);
            }
            contentObjColumn += '<td class="zdybType" style="width: 102px;">'+t.elements[i].elementName+'</td></tr>';
        }
        $("#ZDYBColumnTable").html(contentObjColumn);
        var wOUt = parseInt($("#zdybMaindiv").css("width"));
        var wIn = parseInt($(".ZDYBTable").css("width"));
        var hOUt = parseInt($("#zdybColumndiv").css("height"));
        var hIn = parseInt($("#ZDYBColumnTable").css("height"));
        var hZDYBDiv = parseInt($("#ZDYBDiv").css("height"));
        if((hIn>hOUt&&wIn>(wOUt-17))||(wIn>wOUt&&hIn>(hZDYBDiv-77))){
            $("#zdybHeaderdiv").css("right","17px");
            $("#zdybMaindiv").css("right","17px");
            $("#zdybColumndiv").css("bottom","17px");
            $("#zdybMaindiv").css("bottom","17px");
            $("#scrollXDiv").css("display","block");
            $("#scrollYDiv").css("display","block");
            $("#scrollY").css("right","0px");
            $("#scrollY").css("bottom","17px");
            $("#scrollX").css("bottom","0px");
            $("#scrollX").css("right","17px");
        }
        else if(hIn>hOUt&&wIn<(wOUt-17)){
            $("#zdybHeaderdiv").css("right","17px");
            $("#zdybMaindiv").css("right","17px");
            $("#zdybColumndiv").css("bottom","10px");
            $("#zdybMaindiv").css("bottom","10px");
            $("#scrollYDiv").css("display","block");
            $("#scrollXDiv").css("display","none");
            $("#scrollY").css("right",wOUt-wIn);
            $("#scrollY").css("bottom","10px");
        }
        else if(wIn>wOUt&&hIn<(hZDYBDiv-77)){
            $("#zdybHeaderdiv").css("right","0px");
            $("#zdybMaindiv").css("right","0px");
            $("#zdybColumndiv").css("bottom","17px");
            $("#zdybMaindiv").css("bottom","17px");
            $("#scrollXDiv").css("display","block");
            $("#scrollYDiv").css("display","none");
            $("#scrollX").css("bottom",hOUt-hIn);
            $("#scrollX").css("right","0px");
        }
        else{
            $("#zdybHeaderdiv").css("right","0px");
            $("#zdybMaindiv").css("right","0px");
            $("#zdybColumndiv").css("bottom","10px");
            $("#zdybMaindiv").css("bottom","10px");
            $("#scrollXDiv").css("display","none");
            $("#scrollYDiv").css("display","none");
        }
        $("#scrollYDiv").css("height",hIn+43);
        $("#scrollXDiv").css("width",wIn+222);
        var data = t.nowData;
        if(typeof (data) != "undefined"){
            for(var i=0;i<data.items.length;i++){
                var elementStr = t.allElements[data.items[i].element].input;
                if( elementStr=="1") {
                    for(var j=0;j<data.items[i].datas.length;j++) {
                        //可输入
                        contentObj[data.items[i].element +"_"+ data.items[i].hourSpan] += '<td class="zdybElement zdybElement' + j + '" cols="' + j + '" value="' + getelementValue(data.items[i].datas[j]) + '" type="' + data.items[i].element + '"><input disabled="disabled" type="text" class="zdybTemp" value="' + getelementName(data.items[i].element, data.items[i].datas[j]) + '"></td>';
                    }
                }
                else{
                    for(var j=0;j<data.items[i].datas.length;j++) {
                        //其他不可输入
                        contentObj[data.items[i].element +"_"+ data.items[i].hourSpan] += '<td class="zdybElement zdybElement' + j + '" cols="' + j + '" value="' + getelementValue(data.items[i].datas[j]) + '" type="' + data.items[i].element + '">' + getelementName(data.items[i].element, data.items[i].datas[j]) + '</td>';
                    }
                }
                if(data.items[i].datas.length>0){
                    contentObj[data.items[i].element+"_"+data.items[i].hourSpan] += "</tr>";
                }
            }
            for(var obj in contentObj){
                if((contentObj[obj].indexOf("cols")==-1)&&obj!="0"&&obj!="1"){
                    if(t.allElements[obj.split("_")[0]].input=="1"){
                        for(var j=0;j<data.stationNums.length;j++) {
                            //温度可输入
                            contentObj[obj] += '<td class="zdybElement zdybElement' + j + '" cols="' + j + '" type="' + obj.split("_")[0] + '" value="999.9"><input disabled="disabled" type="text" class="zdybTemp" value=""></td>';
                        }
                    }
                    else{
                        for(var j=0;j<data.stationNums.length;j++) {
                            //其他不可输入
                            contentObj[obj] += '<td class="zdybElement zdybElement' + j + '" cols="' + j + '" value="999.9" type="'+obj.split("_")[0]+'"></td>';
                        }
                    }
                    contentObj[obj] += "</tr>";
                }
            }
            for(var i=0;i< t.elements.length;i++){
                contentHtml += contentObj[t.elements[i].element+"_"+ t.elements[i].hourSpan];
            }
            $(".ZDYBTable").html(contentHtml);
            $("td.zdybElement").css("height",$("td.zdybType").css("height"));
            getZDYBForecastNum();//获取已上网报文数量
            //温度输入响应事件
            $(".zdybElement").change(function(){
                checkZDYBValue(this);
            });
            $(".zdybElement").bind('keydown', function (e) {
                $(".zdybElementChange").css("display","none");
            });

            //弹出框事件
            //addZDYBElementClick();

        }
        //点击非表格时 隐藏弹出框
        $(document).click(function(e){
            if($(e.target).hasClass("zdybElement")||$(e.target).hasClass("zdybTemp")){
                return;
            }
            $(".zdybElementChange").css("display","none");
        });
    }
    //表格转数据
    function zdybTableToData(){
        var listElement = $("#zdybMaindiv").find("tr");
        var items = [];
        for(var i=0;i<listElement.length;i++){
            var element = $(listElement[i]).attr("element")
            var obj = {"element":element,"hourSpan":parseInt($(listElement[i]).attr("shixiao"))};
            var datas = [];
            var list = $(listElement[i]).find("td");
            for(var j=0;j<list.length;j++){
                if($(list[j]).attr("value")=="999.9"){
                    datas.push(-9999);
                }
                else{
                    datas.push(parseFloat($(list[j]).attr("value")).toFixed(1));
                }

            }
            obj.datas = datas;
            items.push(obj);
        }
        t.nowData.items = items;
        t.xzData = {};
        for(var i=0;i<t.nowData.items.length;i++){
            t.xzData[t.nowData.items[i].element+"_"+t.nowData.items[i].hourSpan] = t.nowData.items[i].datas;
        }
        zdybDoAllPreview();
        /*if($("#zdybMaindiv").find(".zdybTableSelected").length != 0){
         var result = confirm("站点预报已修改，是否订正格点");
         if(result == false){
         return;
         }
         station2grid();
         }*/
    }

    //弹出选项框
    function addZDYBElementClick(){
        $(".zdybElement").click(function(event){
            var obj = this;
            var contentHtml = "";
            switch(t.allElements[$(this).attr("type")].element){
                case "w":
                    contentHtml += '<li value="00">晴</li>'+
                        '<li value="1">多云</li>'+
                        '<li value="2">阴</li>'+
                        '<li value="3">阵雨</li>'+
                        '<li value="4">雷阵雨</li>'+
                        '<li value="7">小雨</li>'+
                        '<li value="21">小到中雨</li>'+
                        '<li value="8">中雨</li>'+
                        '<li value="22">中到大雨</li>'+
                        '<li value="9">大雨</li>'+
                        '<li value="23">大到暴雨</li>'+
                        '<li value="10">暴雨</li>'+
                        '<li value="24">暴雨到大暴雨</li>'+
                        '<li value="11">大暴雨</li>'+
                        '<li value="25">大暴雨到特大暴雨</li>'+
                        '<li value="12">特大暴雨</li>'+
                        '<li value="5">冰雹</li>'+
                        '<li value="6">雨夹雪</li>'+
                        '<li value="13">阵雪</li>'+
                        '<li value="14">小雪</li>'+
                        '<li value="26">小到中雪</li>'+
                        '<li value="15">中雪</li>'+
                        '<li value="27">中到大雪</li>'+
                        '<li value="16">大雪</li>'+
                        '<li value="28">大到暴雪</li>'+
                        '<li value="17">暴雪</li>'+
                        '<li value="19">冻雨</li>'+
                        '<li value="18">雾</li>'+
                        '<li value="53">霾</li>'+
                        '<li value="29">浮尘</li>'+
                        '<li value="30">扬沙</li>'+
                        '<li value="20">沙尘暴</li>'+
                        '<li value="31">强沙尘暴</li>';
                    break;
                case "wmax":
                    if($(this).attr("type") == "wd"){
                        contentHtml += '<li value="1">东北风</li>'+
                            '<li value="2">东风</li>'+
                            '<li value="3">东南风</li>'+
                            '<li value="4">南风</li>'+
                            '<li value="5">西南风</li>'+
                            '<li value="6">西风</li>'+
                            '<li value="7">西北风</li>'+
                            '<li value="8">北风</li>'+
                            '<li value="9">旋转不定</li>';
                    }
                    else{
                        contentHtml += '<li value="0"><3级</li>'+
                            '<li value="1">3-4级</li>'+
                            '<li value="2">4-5级</li>'+
                            '<li value="3">5-6级</li>'+
                            '<li value="4">6-7级</li>'+
                            '<li value="5">7-8级</li>'+
                            '<li value="6">8-9级</li>'+
                            '<li value="7">9-10级</li>'+
                            '<li value="8">10-11级</li>'+
                            '<li value="9">11-12级</li>';
                    }
                    break;
                case  "10uv":
                    if($(this).attr("type") == "wd"){
                        contentHtml += '<li value="1">东北风</li>'+
                            '<li value="2">东风</li>'+
                            '<li value="3">东南风</li>'+
                            '<li value="4">南风</li>'+
                            '<li value="5">西南风</li>'+
                            '<li value="6">西风</li>'+
                            '<li value="7">西北风</li>'+
                            '<li value="8">北风</li>'+
                            '<li value="9">旋转不定</li>';
                    }
                    else{
                        contentHtml += '<li value="0"><3级</li>'+
                            '<li value="1">3-4级</li>'+
                            '<li value="2">4-5级</li>'+
                            '<li value="3">5-6级</li>'+
                            '<li value="4">6-7级</li>'+
                            '<li value="5">7-8级</li>'+
                            '<li value="6">8-9级</li>'+
                            '<li value="7">9-10级</li>'+
                            '<li value="8">10-11级</li>'+
                            '<li value="9">11-12级</li>';
                    }
                    break;
                case  "tmin":
                    var max = 50;
                    var num = parseInt($(obj).attr("cols"));
                    var list = $(".zdybElement"+num);
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).parent().attr("element")=="tmax"&&$(obj).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                            if($(list[i]).find("input").val()!=""){
                                max = Math.floor($(list[i]).find("input").val());
                            }
                            break;
                        }
                    }
                    for(var i=-20;i<max+1;i++){
                        contentHtml += '<li value="'+i+'">'+i+'</li>'
                    }
                    break;
                case  "tmax":
                    var min = -20;
                    var num = parseInt($(obj).attr("cols"));
                    var list = $(".zdybElement"+num);
                    for(var i=0;i<list.length;i++) {
                        if($(list[i]).parent().attr("element")=="tmin"&&$(obj).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                            if($(list[i]).find("input").val()!=""){
                                min = Math.ceil($(list[i]).find("input").val());
                            }
                            break;
                        }
                    }
                    for(var i=min;i<46;i++){
                        contentHtml += '<li value="'+i+'">'+i+'</li>'
                    }
                    break;
                case  "2t":
                    if($(this).attr("type").indexOf("tmin")!="-1"){
                        var max = 50;
                        var num = parseInt($(obj).attr("cols"));
                        var list = $(".zdybElement"+num);
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).parent().attr("element").indexOf("tmax")!="-1"&&$(obj).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                                if($(list[i]).find("input").val()!=""){
                                    max = Math.floor($(list[i]).find("input").val());
                                }
                                break;
                            }
                        }
                        for(var i=-20;i<max+1;i++){
                            contentHtml += '<li value="'+i+'">'+i+'</li>'
                        }
                    }
                    else{
                        var min = -20;
                        var num = parseInt($(obj).attr("cols"));
                        var list = $(".zdybElement"+num);
                        for(var i=0;i<list.length;i++) {
                            if($(list[i]).parent().attr("element").indexOf("tmin")!="-1"&&$(obj).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                                if($(list[i]).find("input").val()!=""){
                                    min = Math.ceil($(list[i]).find("input").val());
                                }
                                break;
                            }
                        }
                        for(var i=min;i<46;i++){
                            contentHtml += '<li value="'+i+'">'+i+'</li>'
                        }
                    }
                    break;
                case "air":
                    contentHtml += '<li value="1">1</li>'+
                        '<li value="2">2</li>'+
                        '<li value="3">3</li>'+
                        '<li value="4">4</li>'+
                        '<li value="5">5</li>'+
                        '<li value="6">6</li>';
                    break;
                case "vis":
                    contentHtml += '<li value="0"><1</li>'+
                        '<li value="1">1</li>'+
                        '<li value="2">2</li>'+
                        '<li value="3">3</li>'+
                        '<li value="4">4</li>'+
                        '<li value="5">5</li>'+
                        '<li value="6">6</li>'+
                        '<li value="7">7</li>'+
                        '<li value="8">8</li>'+
                        '<li value="9">9</li>'+
                        '<li value="10">10</li>'+
                        '<li value="11">11</li>'+
                        '<li value="12">12</li>'+
                        '<li value="13">13</li>'+
                        '<li value="14">14</li>'+
                        '<li value="15">15</li>'+
                        '<li value="16">16</li>'+
                        '<li value="17">17</li>'+
                        '<li value="18">18</li>'+
                        '<li value="19">19</li>'+
                        '<li value="20">20</li>'+
                        '<li value="21">>20</li>';
                    break;
                default :

                    break;
            }
            $(".zdybElementChange").html(contentHtml);
            //动态设置弹出选择框位置
            $(".zdybElementChange").css("left",this.getBoundingClientRect().left);
            if(((parseInt($("#ZDYBDiv").css("height"))+60)-this.getBoundingClientRect().top)>(parseInt($(".zdybElementChange").css("height"))+parseInt($(this).css("height")))){
                $(".zdybElementChange").css("top",this.getBoundingClientRect().top+parseInt($(this).css("height")));
            }
            else{
                $(".zdybElementChange").css("top",this.getBoundingClientRect().top-parseInt($(".zdybElementChange").css("height")));
            }
            $(".zdybElementChange").css("display","block");

            var selectStr = "";
            if($(obj).attr("type").indexOf("t")!=-1 && $(obj).find("input").val()!=""){
                selectStr = $(obj).find("input").val();
            }
            else if($(obj).html()!=""){
                selectStr = $(obj).html()
            }
            var list = $(".zdybElementChange").find("li");
            for(var i=0;i<list.length;i++){
                if(selectStr==$(list[i]).html()){
                    $(list[i]).css("background-color","rgb(249,158,27)");
                    //list[i].scrollIntoView();滚动条方法
                    if(i>5){
                        document.getElementById('zdybElementChange').scrollTop=(i-5)*20;
                    }
                    else{
                        document.getElementById('zdybElementChange').scrollTop=0;
                    }
                    break;
                }
            }
            addZDYBElementChangeClick(obj);
        });
    }
    //弹出框点击事件
    function addZDYBElementChangeClick(obj){
        $(".zdybElementChange").find("li").click(function(){
            if($(obj).attr("type").indexOf("t")!=-1){
                $(obj).find("input").val($(this).html());
                $(obj).attr("value",$(this).attr("value"));
                $(obj).addClass("zdybTableSelected");
            }
            else{
                $(obj).html($(this).html());
                $(obj).attr("value",$(this).attr("value"));
                $(obj).addClass("zdybTableSelected");
            }
            relationElement(obj,this);
        });
    }

    //温度输入值检测
    function checkZDYBValue(td){
        if($(td).attr("type").indexOf("tm")!=-1){
            var obj = $(td).find("input")[0];
            var list = obj.value.match(/^-?\d+\.?\d*$/);
            if(list == null){
                obj.value = $(td).attr("value")=="999.9"?"":$(td).attr("value");
                alertModal("输入温度不符合规范");

            }
            else{
                var f = parseFloat(obj.value);
                if(f<-20||f>50){
                    obj.value = $(td).attr("value")=="999.9"?"":$(td).attr("value");
                    alertModal("输入温度超出-20到50范围");
                    $(".zdybElementChange").css("display","none");
                    return;
                }
                var type = $(td).attr("type");
                if(type == "tmin"){
                    var num = parseInt($(td).attr("cols"));
                    var list = $(".zdybElement"+num);
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).parent().attr("element")=="tmax"&&$(td).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                            if(f>parseFloat($(list[i]).find("input").val())){
                                obj.value = $(td).attr("value")=="999.9"?"":$(td).attr("value");
                                alertModal("输入温度超过高温");
                                $(".zdybElementChange").css("display","none");
                                return;
                            }
                            break;
                        }
                    }
                }
                else if(type == "tmax"){
                    var num = parseInt($(td).attr("cols"));
                    var list = $(".zdybElement"+num);
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).parent().attr("element")=="tmin"&&$(td).parent().attr("shixiao")==$(list[i]).parent().attr("shixiao")){
                            if(f<parseFloat($(list[i]).find("input").val())){
                                obj.value = $(td).attr("value")=="999.9"?"":$(td).attr("value");
                                alertModal("输入温度小于低温");
                                $(".zdybElementChange").css("display","none");
                                return;
                            }
                            break;
                        }
                    }
                }
                if(obj.value.indexOf(".")!=-1){
                    var a = obj.value;
                    obj.value = parseFloat(obj.value).toFixed(1);
                    if(a.split(".").length==2&&a.split(".")[1].length>1){
                        alertModal("小数位数不能超过1位");
                        $(".zdybElementChange").css("display","none");
                    }
                }
                $(obj).parent().addClass("zdybTableSelected");
            }
            $(obj).parent().attr("value",obj.value);
        }
        relationElement(td,td);
    }

    //获取预报制作时间和制作要素
    function getZDYBPublishTime(){
        $.ajax({
            type: 'post',
            url: gridServiceUrl+"services/ForecastfineService/getZDYBPublishTime",
            data: {'para': '{"depart":"%'+ t.areaName+'%","areaCode":"%'+GDYB.GridProductClass.currentUserDepart.departCode+',%"}'},
            dataType: 'json',
            error: function () {
                alertModal('获取制作时间出错!');
            },
            success: function (data) {
                t.elementData = data;
                for(var i=0;i< t.elementData.length;i++){
                    if(GDYB.GridProductClass.currentUserDepart.departCode.length == 2){
                        t.elementData[i].gdybPublishTime = t.elementData[i].gdybPublishTime.split(",")[0];
                        t.elementData[i].endTime = t.elementData[i].endTime.split(",")[0];
                        t.elementData[i].gdybType = t.elementData[i].gdybType.split(",")[0];
                        t.elementData[i].makeTime = t.elementData[i].makeTime.split(",")[0];
                    }
                    else{
                        t.elementData[i].gdybPublishTime = t.elementData[i].gdybPublishTime.split(",")[1];
                        t.elementData[i].endTime = t.elementData[i].endTime.split(",")[1];
                        t.elementData[i].gdybType = t.elementData[i].gdybType.split(",")[1];
                        t.elementData[i].makeTime = t.elementData[i].makeTime.split(",")[1];
                    }
                }
                var contentProduct = '';
                var productName = "";
                for(var i=0;i<data.length;i++){
                    if(productName != data[i].type){
                        productName = data[i].type;
                        if(i!=0){
                            contentProduct += '</div>';
                        }
                        contentProduct += '<div class="dis_menu_head" >'+data[i].productName+'</div>' +
                            '<div class="dis_menu_body">';
                    }
                    contentProduct += '<div class="dis_menu_body_item" href="#" elementId="'+i+'">' + data[i].name + '</div>';
                }
                contentProduct += '</div>';
                $("#zdybProductTypePanel").html(contentProduct);
                getAllProductNum();
                $("#zdybProductTypePanel").find("div.dis_menu_body_item").click(function(){
                    $("#zdybProductTypePanel").find("div.dis_menu_body_item").css("background-color","");
                    $("#zdybProductTypePanel").find("div.productActive").removeClass("productActive");
                    $(this).addClass("productActive");
                    $("#ZDYBAllContent").css("display","block");
                    $("#gdybProduct").css("display","none");
                    initZDYBProduct(this);
                });
                $("#zdybProductTypePanel div.dis_menu_head").click(function() {
                    if ($(this).hasClass("dis_current")) {
                        $(this).removeClass("dis_current").next("div.dis_menu_body").slideToggle(300);
                    } else {
                        $(this).addClass("dis_current").next("div.dis_menu_body").slideToggle(300).slideUp("slow");
                    }
                });
                getServiceTime(0);
            }
        });
    }

    //初始化产品template
    function initZDYBProduct(obj){
        var elementId = parseInt($(obj).attr("elementId"));
        t.nowElement = t.elementData[elementId];
        getServiceTime(1);
        var nowTime = $("#dateSelect").find("input").val();
        var time = nowTime.substr(0,4)+"年"+nowTime.substr(5,2)+"月"+nowTime.substr(8,2)+"日";
        $("#zdybTitle").html(GDYB.GridProductClass.currentUserDepart.departName+"气象台"+time+t.nowElement.name+"制作");//标题

        var groupList = t.nowElement.ui.split(";");
        t.elements = []; //赋值之前要置空，否则会累加，by zouwei
        for (var groupKey in groupList) {
            var rowList = groupList[groupKey].split(",");
            t.yubaoyaosu = rowList.length;
            for (var rowKey in rowList) {
                var row = rowList[rowKey].split(" ");
                t.elements.push({element: row[0], hourSpan: row[1], elementName: row[2]});
            }
        }
        $.ajax({
            type: 'post',
            url: gridServiceUrl + "services/ForecastfineService/getZDYBOutType",
            data: null,
            dataType: 'json',
            error: function () {
                alertModal('获取输出类型错误!');
            },
            success: function (data) {
                var list = [];
                var outType = [];
                if (t.nowElement.outType != null && t.nowElement.outType != "") {
                    list = t.nowElement.outType.split(",");
                }
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (list[i] == data[j].type.toString()) {
                            outType.push(data[j]);
                        }
                    }
                }
                var content = "";
                if (outType.length > 1) {
                    content += "<div class='zdybUpdateDiv' type='all'>全部上网</div>";
                }
                for (var i = 0; i < outType.length; i++) {
                    content += "<div class='zdybPreviewClass' type='" + outType[i].type + "'>" + outType[i].name + "</div>";
                }
                for (var i = outType.length - 1; i >= 0; i--) {
                    content += "<div class='zdybUpdateDiv zdybUpdateOne' name='" + outType[i].name + "' type='" + outType[i].type + "'>" + outType[i].name + "上网</div>";
                }
                content += "<div id='zdybShowNum' style='float: left;color: blue;line-height: 29px;font-size: 12px;'></div>";
                content += "<div id='zdybEditText' style='float: right;height: 29px;line-height: 29px;font-size: 12px;display: none;'><input id='zdybGuideCheck' type='checkbox' > 编辑文本</div>";

                $("#zdybPreviewControl").html(content);
                //动态添加预览div
                $("#zdybPreviewDiv").html("");
                for(var i=0;i<outType.length;i++){
                    $("#zdybPreviewDiv").append("<div id='zdybPreviewDiv"+outType[i].type+"' class='zdybPreview'></div>");
                }

                //预览控制div点击事件
                $("#zdybPreviewControl").find("div").click(function () {
                    if ($(this).hasClass("zdybPreviewClass")) {
                        $("#zdybPreviewDiv"+$(this).attr("type")).parent().find(".zdybPreview").css("display","none");
                        $("#zdybPreviewDiv"+$(this).attr("type")).css("display","block");
                        $("#zdybPreviewControl").find(".zdybPreviewClass").css("background-color","");
                        $(this).css("background-color","rgb(246,135,30)");
                    }
                    zdybAllProductTemplate(this);
                });
                //编辑文本
                $("#zdybGuideCheck").click(function(){
                    if(this.checked == true){
                        $(".zdybGruideTable").find("td").css("border","rgb(200,200,200) solid 1px");
                        $("#zdybGruideTextArea").removeAttr("disabled");
                        $(".zdybGruideTable").find(".zdybTemp").removeAttr("disabled");
                        $("#zdybGruideTextArea").css("border-color","");
                        $("#zdybGruideTextArea").css("box-shadow","");
                    }
                    else{
                        $(".zdybGruideTable").find("td").css("border","");
                        $("#zdybGruideTextArea").attr("disabled","disabled");
                        $(".zdybGruideTable").find(".zdybTemp").attr("disabled","disabled");
                        $("#zdybGruideTextArea").css("border-color","#ffffff");
                        $("#zdybGruideTextArea").css("box-shadow","none");
                    }
                });
            }
        });
        grid2station();
    }

    //格点转站点
    function grid2station(){
        var url=gridServiceUrl+"services/GridService/grid2station";
        var arrayElement = [];
        for(var i in t.elements){
            var element = t.elements[i];
            for(var j = 0; j<arrayElement.length; j++){
                if(arrayElement[j].name == element.element){
                    break;
                }
            }
            if(j==arrayElement.length){
                var elementHourSpans = {name:element.element,element:t.allElements[element.element].element,hourSpan:t.allElements[element.element].hourSpan,statistic:t.allElements[element.element].statistic, hourSpans:[Number(element.hourSpan)]};
                arrayElement.push(elementHourSpans);
            }
            else{
                arrayElement[j].hourSpans.push(Number(element.hourSpan));
            }
        }
        var strElements = JSON.stringify(arrayElement);

        var stationMakeTime = $("#dateSelect").find("input").val()+" "+mosaicTime(t.nowElement.publishTime)+":00:00";
        var gridMakeTime = getGridTimeFromStationTime(stationMakeTime);

        var postType = "p";
//        if(t.nowElement.postType == "r")
//            postType = t.nowElement.postType;

        $.ajax({
            type:"POST",
            data:{"para":"{departCode:'" + GDYB.GridProductClass.currentUserDepart.departCode + "',productId:'"+ t.nowElement.id+"',type:'"+ t.nowElement.gdybType+"',stationType:'"+t.nowElement.stationType+"',makeTime:'"+gridMakeTime+"',elements:"+ strElements + ",postType:" + postType + "}"},
            url:url,
            dataType:"json",
            success:function(data) {
                t.nowData = data;
                t.xzData = {};
                for(var i=0;i<t.nowData.items.length;i++){
                    t.xzData[t.nowData.items[i].element+"_"+t.nowData.items[i].hourSpan] = t.nowData.items[i].datas;
                }
                $.ajax({
                    type: 'post',
                    url: gridServiceUrl + "services/ForecastfineService/getUserStationNew",
                    data: {'para': '{"departCode":"' + GDYB.GridProductClass.currentUserDepart.departCode + '%","id":' + t.nowElement.id + ',"type":"' + t.nowElement.stationType + '"}'},
                    dataType: 'json',
                    error: function () {
                        alertModal('获取站点错误!');
                    },
                    success: function (data) {
                        t.stationList = data;
                        if(t.nowElement.showTable!=0) {
                            $("#zdybPreviewControl").css("display","none");
                            $("#zdybPreviewDiv").css("display","none");
                            $("#zdybShowTableControl").css("display","block");
                            $("#zdybShowTableDiv").css("display","block");
                            if($("#zdybShowChange").attr("name")=="zdybTableButton"){
                                $("#zdybShowChange").click();
                            }
                            initZDYBTable(data);
                        }
                        else{
                            $("#zdybShowTableControl").css("display","none");
                            $("#zdybShowTableDiv").css("display","none");
                            $("#zdybPreviewControl").css("display","block");
                            $("#zdybPreviewDiv").css("display","block");
                            zdybDoAllPreview();
                        }
                    }
                });
            }
        });
    }

    //获取服务器时间
    function getServiceTime(num){
        $.ajax({
            type: 'post',
            url: gridServiceUrl+"services/ForecastfineService/getServiceTime",
            data: null,
            dataType: 'text',
            error: function () {
                alertModal('获取服务器时间错误!');
            },
            success: function (data) {
                if(num==0){
                    var nowTime = $("#dateSelect").find("input").val();
                    var nowDate =  new Date(data.substr(5,2)+" "+data.substr(8,2)+","+data.substr(0,4)+data.substr(10,9));
                    var endDate;
                    var time = data.substr(11,8);
                    var list = $($("#zdybProductTypePanel").find("div.dis_menu_body")[0]).find("div.dis_menu_body_item");
                    var allPast = true;
                    var endtime = "";

                    for(var i=0;i<list.length;i++){
                        if(GDYB.GridProductClass.currentUserDepart.departCode.length == 2){
                            endtime = t.elementData[parseInt($(list[i]).attr("elementId"))].endTime.toString().split(",")[0];
                        }
                        else{
                            endtime = t.elementData[parseInt($(list[i]).attr("elementId"))].endTime.toString().split(",")[1];
                        }
                        if(time< endtime){
                            endDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+endtime);
                            $(list[i]).click();
                            allPast = false;
                            break;
                        }
                    }
                    if(allPast&&list.length!=0){
                        if(GDYB.GridProductClass.currentUserDepart.departCode.length == 2){
                            endtime = t.elementData[parseInt($(list[list.length-1]).attr("elementId"))].endTime.toString().split(",")[0];
                        }
                        else{
                            endtime = t.elementData[parseInt($(list[list.length-1]).attr("elementId"))].endTime.toString().split(",")[1];
                        }
                        endDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+endtime);
                        $(list[list.length-1]).click();
                    }
                    /*endDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+t.elementData[parseInt($(list[0]).attr("elementId"))].endTime);
                     $(list[0]).click()*/

                    t.endTime = (endDate.getTime()-nowDate.getTime())/1000;
                    if(!t.refreshTime){
                        refreshEndTime();
                    }
                    t.refreshTime = true;
                }
                else{
                    var nowTime = $("#dateSelect").find("input").val();
                    var nowDate =  new Date(data.substr(5,2)+" "+data.substr(8,2)+","+data.substr(0,4)+data.substr(10,9));
                    var endTime = "";
                    endtime = t.nowElement.endTime;
                    var endDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ endtime);
                    t.endTime = (endDate.getTime()-nowDate.getTime())/1000;
                }
            }
        });
    }

    //产品预览 上网点击事件
    function zdybAllProductTemplate(obj){
        if ($(obj).hasClass("zdybPreviewClass")) {
            if ($(obj).attr("type") == "1") {
                zdybPreviewTown($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "2") {
                zdybPreviewGuide($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "3") {
                zdybPreviewCountry($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "4") {
                zdybPreviewAir($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "5") {
                zdybPreviewSeaFine($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "6") {
                zdybPreviewSea($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "7") {
                zdybPreviewCoast($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "8") {
                zdybPreviewBigCity($(obj).attr("type"));
            }
            else if ($(obj).attr("type") == "9") {
                zdybPreviewRainfall($(obj).attr("type"));
            }
        }
        else if ($(obj).hasClass("zdybUpdateDiv")) {
            if ($(obj).attr("type") == "1") {
                zdybUploadTown(obj);
            }
            else if ($(obj).attr("type") == "2") {
                zdybUploadGuide(obj);
            }
            else if ($(obj).attr("type") == "3") {
                zdybUploadCountry(obj);
            }
            else if ($(obj).attr("type") == "4") {
                zdybUploadAir(obj);
            }
            else if ($(obj).attr("type") == "5") {
                zdybUploadSeaFine(obj);
            }
            else if ($(obj).attr("type") == "6") {
                zdybUploadSea(obj);
            }
            else if ($(obj).attr("type") == "7") {
                zdybUploadCoast(obj);
            }
            else if ($(obj).attr("type") == "8") {
                zdybUploadBigCity(obj);
            }
            else if ($(obj).attr("type") == "9") {
                zdybUploadRainfall(obj);
            }
            else if ($(obj).attr("type") == "all") {
                $(obj).parent().find(".zdybUpdateOne").click();
            }
        }
    }

    //初始预览所有产品，方便全部提交
    function zdybDoAllPreview(){
        var list = $("#zdybPreviewControl").find(".zdybPreviewClass");
        if(list.length>0){
            $($("#zdybPreviewControl").find(".zdybPreviewClass")[0]).click();
            if(list.length>1){
                for(var i=1;i<list.length;i++){
                    zdybAllProductTemplate(list[i]);
                }
            }
        }
    }

    //时间倒计时
    function refreshEndTime(){
        if(t.endTime>0){
            var hours = parseInt(t.endTime/60/60);
            var minutes = parseInt(t.endTime/60)%60;
            var seconds = t.endTime%60;
            $("#zdybTimeCountdown").html(hours+"小时"+minutes+"分钟"+seconds+"秒");
            $("#zdybTimeCountdownTitle").html("注意：距上网截止时间还剩");
            t.endTime--;
        }
        else{
            $("#zdybTimeCountdown").html("注意：该时次预报已过规定的上网截止时间");
            $("#zdybTimeCountdownTitle").html("");
        }
        setTimeout(function(){
            if(t.refreshTime == true){
                refreshEndTime();
            }
        },1000);
    }

    //关联赋值
    function relationElement(obj,data){
        //选择了时效没有选择站点
        if(t.time == true&& t.station==false){
            var num = parseInt($(obj).attr("cols"));
            var list = $(".zdybElement"+num);
            for(var i=0;i<list.length;i++){
                if((parseInt($(list[i]).parent().attr("shixiao"))%24)==(parseInt($(obj).parent().attr("shixiao"))%24)&&$(list[i]).parent().attr("element")==$(obj).parent().attr("element")&&parseInt($(list[i]).parent().attr("rows"))>parseInt($(obj).parent().attr("rows"))){
                    if($(obj).find("input").length == 0){
                        $(list[i]).html($(data).html());
                        $(list[i]).attr("value",$(data).attr("value"));
                        $(list[i]).addClass("zdybTableSelected");
                    }
                    else{
                        if($(data).find("input").length==0){
                            $(list[i]).find("input").val($(data).html());
                        }
                        else{
                            $(list[i]).find("input").val($(data).find("input").val());
                        }
                        $(list[i]).attr("value", $(data).attr("value"));
                        $(list[i]).addClass("zdybTableSelected");
                    }
                }
            }
        }
        else if(t.time == false&& t.station==true){
            var list = $(obj).parent().find(".zdybElement");
            for(var i=0;i<list.length;i++){
                if (parseInt($(list[i]).attr("cols")) >=parseInt($(obj).attr("cols"))){
                    if($(obj).find("input").length == 0){
                        $(list[i]).html($(data).html());
                        $(list[i]).attr("value",$(data).attr("value"));
                        $(list[i]).addClass("zdybTableSelected");
                    }
                    else{
                        if($(data).find("input").length==0){
                            $(list[i]).find("input").val($(data).html());
                        }
                        else{
                            $(list[i]).find("input").val($(data).find("input").val());
                        }
                        $(list[i]).attr("value", $(data).attr("value"));
                        $(list[i]).addClass("zdybTableSelected");
                    }
                }
            }
        }
        else if(t.time == true&& t.station==true){
            var listAll = $(obj).parent().find(".zdybElement");
            var num = parseInt($(obj).attr("cols"));
            var list = $(".zdybElement"+num);
            for(var i=0;i<list.length;i++){
                if((parseInt($(list[i]).parent().attr("shixiao"))%24)==(parseInt($(obj).parent().attr("shixiao"))%24)&&$(list[i]).parent().attr("element")==$(obj).parent().attr("element")&&parseInt($(list[i]).parent().attr("rows"))>parseInt($(obj).parent().attr("rows"))){
                    var listRows = $(list[i]).parent().find(".zdybElement");
                    for(var k=0;k<listRows.length;k++){
                        listAll.push(listRows[k]);
                    }
                }
            }
            for(var i=0;i<listAll.length;i++){
                if (parseInt($(listAll[i]).attr("cols")) >=parseInt($(obj).attr("cols"))){
                    if($(obj).find("input").length == 0){
                        $(listAll[i]).html($(data).html());
                        $(listAll[i]).attr("value",$(data).attr("value"));
                        $(listAll[i]).addClass("zdybTableSelected");
                    }
                    else{
                        if($(data).find("input").length==0){
                            $(listAll[i]).find("input").val($(data).html());
                        }
                        else{
                            $(listAll[i]).find("input").val($(data).find("input").val());
                        }
                        $(listAll[i]).attr("value", $(data).attr("value"));
                        $(listAll[i]).addClass("zdybTableSelected");
                    }
                }
            }
        }
    }

    //空气污染格式化
    function getAirValue(value){
        var name = 999.9;
        if(typeof(value)!="undefined"&& value!=-9999){
            name = "06"+parseInt(value);
        }
        return name;
    }

    //天气代码格式化
    function getelementValue(value,j){
        var name = 999.9;
        if(typeof (j)!="undefined"){
            if(typeof(value)!="undefined"&& value[j]!=-9999&&value[j]!="-9999"){
                if(t.nowElement.productName == "城镇预报"){
                    name = parseFloat(Math.round(value[j])).toFixed(1);
                }
                else{
                    name = parseFloat(value[j]).toFixed(1);
                }
            }
        }
        else{
            if(typeof(value)!="undefined"&& value!=-9999&&value!="-9999"){
                name = parseFloat(value).toFixed(1);
            }
        }
        return name;
    }

    //沿岸天气预报格式化
    function getelementValueInt(element,value,j){
        var name = 999.9;
        if(typeof(value)!="undefined"&& value[j]!=-9999){
            switch (element){
                case "wd":
                    name = getWDDegree(parseInt(value[j]));
                    break;
                case "vis":
                    name = getVisibilityName(parseInt(value[j]));
                    break;
                default :
                    name = value[j];
                    break;
            }
        }
        if(name == "")
            name = 999.9;
        return name;
    }

    //海洋精细化预报转码
    function getSeaElementName(element,value,num){
        var name = "";
        if(typeof (value)!="undefined") {
            switch (element) {
                case "w":
                    name = getWeatherName(parseInt(value[num]));
                    break;
                case "wd":
                    name = getWDName(parseInt(value[num]));
                    break;
                case "ws":
                    name = getWSName(parseInt(value[num]));
                    break;
                case "r12":
                    name = getPrecipitationName(parseFloat(value[num]));
                    break;
                case "vis":
                    name = getVisibilityName(parseInt(value[num]));
                    break;
                default :
                    if(value[num]!=-9999){
                        name = parseFloat(value[num]).toFixed(1);
                    }
                    else{
                        name = "";
                    }
                    break;
            }
        }
        if(name === ""){
            name = "999.9";
        }
        return name;
    }

    //天气代码转文字
    function getelementName(element,value){
        var name = "";
        switch (element){
            case "w":
                name = getWeatherName(parseInt(value));
                break;
            case "wd":
                name = getWDName(parseInt(value));
                break;
            case "ws":
                name = getWSName(parseInt(value));
                break;
            case "vis":
                name = getVisibilityName(parseInt(value));
                break;
            case "air":
                if(value!=-9999){
                    name = parseInt(value);
                }
                else{
                    name = "";
                }
                break;
            default :
                if(value!=-9999){
                    if(t.nowElement.productName == "城镇预报"&&(element == "tmin"||element == "tmax"||element == "2t")){
                        name = parseFloat(Math.round(value)).toFixed(1);
                    }
                    else{
                        name = parseFloat(value).toFixed(1);
                    }
                }
                else{
                    name = "";
                }
        }
        return name;
    }

    //天气代码转文字1
    function getelementName1(element,value,j){
        var name = "";
        if(typeof (value)!="undefined"){
            value = value[j];
            switch (element){
                case "w":
                    name = getWeatherName(parseInt(value));
                    break;
                case "wd":
                    name = getWDName(parseInt(value));
                    break;
                case "ws":
                    name = getWSName(parseInt(value));
                    break;
                default :
                    if(value!=-9999){
                        name = Math.round(value);
                    }
                    else{
                        name = "";
                    }
            }
        }
        return name;
    }
    //风向转码
    function getWDName(value){
        var name = "";
        switch (value){
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
        return name;
    }
    //风向转码
    function getWDDegree(value){
        var name = "";
        switch (value){
            case 1:
                name = "45";
                break;
            case 2:
                name = "90";
                break;
            case 3:
                name = "135"
                break;
            case 4:
                name = "180";
                break;
            case 5:
                name = "225"
                break;
            case 6:
                name = "270";
                break;
            case 7:
                name = "315"
                break;
            case 8:
                name = "0";
                break;
            case 9:
                name = "999";
                break;
        }
        return name;
    }
    //风速转码
    function getWSName(value){
        var name = "";
        switch (value){
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
        return name;
    }
    //天气转码
    function getWeatherName(value){
        var name = "";
        switch (value){
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
            case 20:
                name = "沙尘暴";
                break;
            case 31:
                name = "强沙尘暴";
                break;
        }
        return name;
    }
    //降水转码
    function getPrecipitationName(value){
        var name = "";
        if(value==0){
            name = "0";
        }
        else if(value == -9999){
            name = "999.9";
        }
        else if(value>0&&value<5){
            name = "0.1-4.9";
        }
        else{
            var integer = Math.floor(value).toString();
            if(integer.substring(integer.length-1)<5){
                name = integer.substr(0,integer.length-1)+"0-"+integer.substr(0,integer.length-1)+"4.9";
            }
            else{
                name = integer.substr(0,integer.length-1)+"5-"+integer.substr(0,integer.length-1)+"9.9";
            }
        }
        return name;
    }
    //能见度转码
    function getVisibilityName(value){
        var name = "";
        switch (value){
            case 0:
                name = "<1";
                break;
            case 21:
                name = ">20";
                break;
            case -9999:
                name = "";
                break;
            default :
                name = value;
                break;
        }
        return name;
    }

    function mosaicTime(time){
        if(time.toString().length == 1){
            time = "0"+time;
        }
        return time;
    }

    //格式化报文输出
    function formatForecast(value,length){
        var num = length-value.length;
        if(num>0){
            for(var i=0;i<num;i++){
                value = " "+value;
            }
        }
        return value;
    }

    //切换城市
    function zdybChangeCity(obj){
        var num = parseInt($(obj).attr("num"));
        var left = parseInt($(".ZDYBTable").find("td").css("width"))*num;
        $('#zdybMaindiv').scrollLeft(left);
    }
    //显示城市选择按钮
    function showZDYBTableButton(){
        $("#zdybCity").css("display","");
        $("#zdybShowTableControl").find(".zdybRelationClass").css("display","");
    }

    //隐藏城市选择按钮
    function hideZDYBTableButton(){
        $("#zdybCity").css("display","none");
        $("#zdybShowTableControl").find(".zdybRelationClass").css("display","none");
    }

    //获取上网预报数量
    function getZDYBForecastNum(){
        var nowTime = $("#dateSelect").find("input").val();
        var time = nowTime.substr(8,2)+ t.nowElement.zdybHour;
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var forecastTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-"+(Array(2).join(0)+t.nowElement.hourSpanTotal).slice(-3)+t.nowElement.hourSpan;
        var productAreaName = "";
        /*if(t.areaName == "qutai"){
         productAreaName = "区台";
         }
         else{
         productAreaName = "市台";
         }*/
        var productName1 = productAreaName+"/"+t.nowElement.productName+"/"+"精细化报文";
        var productName2 = productAreaName+"/"+t.nowElement.productName+"/"+"指导预报";
        if(t.nowElement.productName != "城镇预报"){
            return;
        }
        var param = '{"productName1":"'+productName1+'","productName2":"'+productName2+'","time":"'+time+'","time1":"'+makeTime+'","time2":"'+forecastTime+'","ds1":"'+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast+'","ds2":"'+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+'"}';
        $.ajax({
            type: 'post',
            url: gridServiceUrl+"services/ForecastfineService/zdybForecastNum",
            data: {'para': param},
            dataType: 'json',
            error: function () {
                alertModal('获取预报员错误!');
            },
            success: function (data) {
                t.zdybTownNum = data[0];
                $("#zdybShowNum").html("（该时次已上网的预报：城镇预报"+data[0]+"份，指导预报"+data[1]+"份）");
            }
        });
    }

    //获取所有产品上传状态
    function getAllProductNum(){
        var data = t.elementData;
        $.ajax({
            type: 'post',
            url: gridServiceUrl + "services/ForecastfineService/getZDYBOutType",
            data: null,
            dataType: 'json',
            error: function () {
                alertModal('获取输出类型错误!');
            },
            success: function (list) {
                var outTypeObj = {};
                for(var i=0;i<list.length;i++){
                    outTypeObj[list[i].type] = list[i].name;
                }
                var nameList = [];
                var productAreaName = "";
                /*if(t.areaName == "qutai"){
                 productAreaName = "区台";
                 }
                 else{
                 productAreaName = "市台";
                 }*/
                for(var i=0;i<data.length;i++){
                    var outlist = data[i].outType.split(",");
                    var list = [];
                    var nowTime = $("#dateSelect").find("input").val();
                    var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+data[i].makeTime);
                    nowDate.setHours(nowDate.getHours()-8);
                    for(var j=0;j<outlist.length;j++){
                        if(outlist[j]=="1"){
                            var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
                            var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+data[i].forecastTime+"00-"+(Array(2).join(0)+data[i].hourSpanTotal).slice(-3)+ data[i].hourSpan;
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = "Z_SEVP_C_" + GDYB.GridProductClass.currentUserDepart.codeOfTownForecast + "_" + makeTime + ".*?_P_RFFC-SPCC-" + time + ".TXT";
                            list.push(obj);
                        }
                        else if(outlist[j]=="2"){
                            var time = nowTime.substr(8,2)+data[i].zdybHour;
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast + "DY" + time + ".ENN";
                            list.push(obj);
                        }
                        else if(outlist[j]=="3"){
                            var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"00";
                            var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+data[i].forecastTime+"00-"+(Array(2).join(0)+data[i].hourSpanTotal).slice(-3)+ data[i].hourSpan;
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = "Z_SEVP_C_"+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+"_"+makeTime+"_P_RFFC-GXXZ-"+time+".TXT";
                            list.push(obj);
                        }
                        else if(outlist[j]=="4"){
                            var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
                            var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+data[i].forecastTime+"00-"+(Array(2).join(0)+data[i].hourSpanTotal).slice(-3)+ data[i].hourSpan;
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = "Z_SEVP_C_" + GDYB.GridProductClass.currentUserDepart.codeOfTownForecast + "_" + makeTime  + "00_P_RFFC-GXKQ-" + time + ".TXT";
                            list.push(obj);
                        }
                        else if(outlist[j]=="5"){
                            var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+mosaicTime(parseInt(data[i].forecastTime)+8);
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            if(t.areaName == "qutai"){
                                obj.name = "HYZD";
                            }
                            else{
                                obj.name = "HYJX";
                            }
                            obj.name += yubaoTime;
                            if(t.areaName == "qutai"){
                                obj.name += ".TXT";
                            }
                            else{
                                obj.name += ".F"+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast;
                            }
                            list.push(obj);
                        }
                        else if(outlist[j]=="6"){
                            var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+mosaicTime(data[i].publishTime);
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = "HY"+yubaoTime;
                            obj.name += ".F"+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast;
                            list.push(obj);
                        }
                        else if(outlist[j]=="7"){
                            var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+data[i].forecastTime;
                            for(var k=0;k<3;k++){
                                var obj = {};
                                obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                                obj.name = "SEVP_GXMA_ROFC_SFER_EME_AGX_L89_P9_"+yubaoTime+"00"+(Array(2).join(0)+(k+1)*24).slice(-3)+"00.MIC";
                                list.push(obj);
                            }
                        }
                        else {
                            var obj = {};
                            obj.productName = productAreaName+"/"+data[i].productName+"/"+outTypeObj[outlist[j]];
                            obj.name = "test.TXT";
                            list.push(obj);
                        }
                    }
                    nameList.push(list);
                }
                var nameListStr = JSON.stringify(nameList)
                var param = '{"nameList":'+nameListStr+'}';
                $.ajax({
                    type: 'post',
                    url: gridServiceUrl + "services/ForecastfineService/getAllProductNum",
                    data: {'para': param},
                    dataType: 'json',
                    error: function () {
                        alertModal('获取输出类型错误!');
                    },
                    success: function (data) {
                        var list = $("#zdybProductTypePanel").find("div.dis_menu_body_item");
                        for(var i=0;i<data.length;i++){
                            if(data[i]==1&&($(list[i]).find("span").length==0)){
                                $(list[i]).append("<span title='已上网' class='zdybProductIsSubmit'>√</span>");
                            }
                        }
                    }
                });
            }
        });
    }

    //城镇预报预览
    function zdybPreviewTown(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = (Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+ t.nowElement.forecastTime;
        var numString = t.zdybTownNum;
        var modify = "";
        if(numString!=0){
            numString = String.fromCharCode(numString+64);
            modify = "CC"+numString;
        }
        var contentHtml = "";
        contentHtml += '<div>ZCZC</div>';
        contentHtml += '<div>FSCI50 '+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+' '+makeTime+" "+modify+'</div>';
        contentHtml += '<div>'+time+'时'+GDYB.GridProductClass.currentUserDepart.departName+'气象台预报产品</div>';
        contentHtml += '<div>SPCC '+time+'</div>';
        contentHtml += '<div>'+t.stationList.length+'</div>';
        var yubaoshixiaoObject = {};
        for(var i=0;i< t.elements.length;i++){
            yubaoshixiaoObject[t.elements[i].hourSpan] = 1;
        }
        var yubaoshixiao = 0;
        for(var hourSpan in yubaoshixiaoObject){
            yubaoshixiao++;
        }
        var hourSpan = parseInt(t.nowElement.hourSpan);
        var hourSpanTotal = parseInt(t.nowElement.hourSpanTotal);
        var stationLength = t.stationList.length;
        for(var j=0;j<stationLength;j++){
            var Longitude = t.stationList[j].Longitude.toFixed(2);
            var Latitude = t.stationList[j].Latitude.toFixed(2);
            var hHeight = (t.stationList[j].Height==999999?0:t.stationList[j].Height).toFixed(1);
            contentHtml += '<table class="zdybPreviewTable"><tr><td>'+t.nowData.stationNums[j]+' '+Longitude+' '+Latitude+' '+hHeight+' '+yubaoshixiao+' 21</td></tr></table><table class="zdybPreviewTable">';
            for(var i= hourSpan;i<= hourSpanTotal;){
                contentHtml += '<tr><td>'+i+'</td><td>999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9 999.9</td>' +
                    '<td>'+ getelementValue(t.xzData["tmax_"+i],j)+'</td><td>'+getelementValue(t.xzData["tmin_"+i],j)+'</td><td>999.9</td><td>999.9</td>'+
                    '<td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>'+getelementValue(t.xzData["w_"+i],j)+'</td><td>'+getelementValue(t.xzData["wd_"+i],j)+'</td><td>'+getelementValue(t.xzData["ws_"+i],j)+'</td></tr>';
                i += parseInt(t.nowElement.hourSpan);
            }
            contentHtml += '</table>';
        }
        contentHtml += '<table class="zdybPreviewTable"><tr><td>NNNN</td></tr></table>';
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //指导预报预览
    function zdybPreviewGuide(typeNum){
        $("#zdybEditText").css("display","");
        var nowTime = $("#dateSelect").find("input").val();
        var time = nowTime.substr(0,4)+"年"+nowTime.substr(5,2)+"月"+nowTime.substr(8,2)+"日"+mosaicTime(t.nowElement.publishTime);
        var contentHtml = "<div id='zdybGuideTitle' style='width: 100%;padding-left: 300px;'>"+GDYB.GridProductClass.currentUserDepart.departName+"气象台"+time+"天气预报</div>";
        contentHtml += "<div style='padding: 10px;'>一、天气形势和趋势预报</div>";
        contentHtml += "<div id='zdybGuideTrendDetail'><textarea id='zdybGruideTextArea' style='width: 751px;margin-left: 10px;background-color: #fff;border-color: #FFFFFF;box-shadow:none;' disabled='disabled'></textarea></div>";
        contentHtml += "<div style='padding: 10px;'>二、分县要素预报</div>";
        contentHtml += "<div id='zdybGuideElementDetail'>";
        var staionLength = t.stationList.length;
        var hourSpanTotal = parseInt(t.nowElement.hourSpanTotal);
        for(var i= 24;i<= hourSpanTotal;){
            contentHtml += '<div style="padding-left: 350px;">'+(i-24)+'--'+i+'小时预报</div>'
            contentHtml += '<table class="zdybGruideTable"><tr><td>县市</td><td>天气</td><td>风向风速</td><td>最低气温</td><td>最高气温</td></tr>'
            for(var j=0;j<staionLength;j++){
                contentHtml += '<tr><td>'+t.stationList[j].StationName+'</td>';
                if(getelementValue(t.xzData["w_"+(i-12)],j)==getelementValue(t.xzData["w_"+i],j)){
                    contentHtml += '<td><input class="zdybTemp" disabled="disabled" value="'+getelementName1("w", t.xzData["w_"+i],j)+'"></td>';
                }
                else{
                    contentHtml += '<td><input class="zdybTemp" disabled="disabled" value="'+getelementName1("w", t.xzData["w_"+(i-12)],j)+'转'+getelementName1("w", t.xzData["w_"+i],j)+'"></td>';
                }
                contentHtml += '<td><input class="zdybTemp" disabled="disabled" value="'+getelementName1("wd", t.xzData["wd_"+i],j)+getelementName1("ws", t.xzData["ws_"+i],j)+'"></td>';
                contentHtml += '<td><input class="zdybTemp" disabled="disabled" value="'+getelementName1("tmin", t.xzData["tmin_"+i],j)+'"></td>';
                contentHtml += '<td><input class="zdybTemp" disabled="disabled" value="'+getelementName1("tmax", t.xzData["tmax_"+i],j)+'"></td>';
            }
            contentHtml += "</table>";
            i += 24;
        }
        contentHtml += "</div>";

        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
        if( $("#zdybGuideCheck")[0].checked == true){
            $("#zdybGruideTextArea").removeAttr("disabled");
            $(".zdybGruideTable").find(".zdybTemp").removeAttr("disabled");
            $(".zdybGruideTable").find("td").css("border","rgb(200,200,200) solid 1px");
            $("#zdybGruideTextArea").css("border-color","").css("box-shadow","");
        }
    }

    //乡镇预报预览
    function zdybPreviewCountry(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"00";
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-16812";
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime;
        var name = "Z_SEVP_C_"+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+"_"+makeTime+"_P_RFFC-GXXZ-"+yubaoTime+".TXT";
        var productAreaName = "";
        /*if(t.areaName == "qutai"){
         productAreaName = "区台";
         }
         else{
         productAreaName = "市台";
         }*/
        var productName = productAreaName+"/"+t.nowElement.productName+"/"+"乡镇报文";
        var param = '{"name":"'+name+'","productName":"'+productName+'"}';
        $.ajax({
            type: 'post',
            url: gridServiceUrl + "services/ForecastfineService/getCountryNum",
            data: {'para': param},
            dataType: 'text',
            error: function () {
                alertModal('错误!');
            },
            success: function (data) {
                var flag = "";
                if(data == null){
                    if(t.endTime<0){
                        flag = "RRA";
                    }
                    else{
                        flag = "CCA";
                    }
                }
                else if(data == "-1"){
                    if(t.endTime<0){
                        flag = "RRA";
                    }
                }
                else if(data.indexOf("CC")!=-1){
                    if(t.endTime<0){
                        flag = "RRA"
                    }
                    else{
                        var fileNum = data.split("CC")[1];
                        flag = "CC"+String.fromCharCode(fileNum.charCodeAt()+1);
                    }
                }
                else if(data.indexOf("RR")!=-1){
                    var fileNum = data.split("RR")[1];
                    flag = "RR"+String.fromCharCode(fileNum.charCodeAt()+1);
                }
                var yubaoshixiaoObject = {};
                for(var i=0;i< t.elements.length;i++){
                    yubaoshixiaoObject[t.elements[i].hourSpan] = 1;
                }
                var yubaoshixiao = 0;
                for(var hourSpan in yubaoshixiaoObject){
                    yubaoshixiao++;
                }
                if(typeof (t.nowData) != "undefined"){

                    var contentHtml = "";
                    contentHtml += '<div>XZZD</div>';
                    contentHtml += '<div>XZJXYB '+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+' '+flag+'</div>';
                    if(t.areaName == "qutai"){
                        contentHtml += '<div>QTZD</div>';
                        contentHtml += '<div>XZYB '+time+'</div>';
                    }
                    else{
                        contentHtml += '<div>STZD</div>';
                        contentHtml += '<div>'+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast+'YB '+time+'</div>';
                    }
                    contentHtml += '<div>'+t.nowData.stationNums.length+'</div>';
                    contentHtml += "<div id='xzybPreviewDetail'>";
                    var stationnum = 100;
                    if(t.nowData.stationNums.length<100){
                        stationnum = t.nowData.stationNums.length;
                    }
                    for(var j=0;j< stationnum;j++){
                        var Longitude = t.stationList[j].Longitude.toFixed(2);
                        var Latitude = t.stationList[j].Latitude.toFixed(2);
                        var hHeight = (t.stationList[j].Height==999999?0:t.stationList[j].Height).toFixed(1);
                        contentHtml += '<div>'+t.nowData.stationNums[j]+' '+ Longitude+' '+ Latitude+' '+ hHeight+' '+yubaoshixiao+' 21</div><table class="zdybPreviewTable">';
                        for(var k=3;k<169;){
                            contentHtml += '<tr><td>'+k+'</td><td>'+getelementValue(t.xzData["temp3_"+k],j)+'</td><td>'+getelementValue(t.xzData["rh3_"+k],j)+'</td><td>'+getelementValue(t.xzData["wd3_"+k],j)+'</td><td>'+getelementValue(t.xzData["ws3_"+k],j)+'</td><td>999.9</td><td>'+getelementValue(t.xzData["r3_"+k],j)+'</td><td>999.9 99.9 999.9 999.9</td>';
                            if(k%24==0){
                                contentHtml +='<td>'+getelementValue(t.xzData["tmax_"+k],j)+'</td><td>'+getelementValue(t.xzData["tmin_"+k],j)+'</td><td>'+getelementValue(t.xzData["rhmax_"+k],j)+'</td><td>'+getelementValue(t.xzData["rhmin_"+k],j)+'</td><td>'+getelementValue(t.xzData["r24_"+k],j)+'</td>';
                            }
                            else{
                                contentHtml +='<td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td>';
                            }
                            if(k%12==0){
                                contentHtml +='<td>'+getelementValue(t.xzData["r12_"+k],j)+'</td><td>999.9</td><td>999.9</td><td>'+getelementValue(t.xzData["w_"+k],j)+'</td><td>'+getelementValue(t.xzData["wd_"+k],j)+'</td><td>'+getelementValue(t.xzData["ws_"+k],j)+'</td>';
                            }
                            else{
                                contentHtml +='<td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td>';
                            }
                            if(k<48){
                                k += 3;
                            }
                            else if(k<72){
                                k += 6;
                            }
                            else{
                                k += 12;
                            }
                        }
                        contentHtml += "</tr>";
                        contentHtml += '</table>';
                    }
                    if(t.nowData.stationNums.length<100){
                        contentHtml += '<table class="zdybPreviewTable"><tr><td>NNNN</td></tr></table>';
                    }
                    contentHtml += '</div>';
                    var pageNum = 0;
                    if(t.nowData.stationNums.length>100){
                        pageNum = Math.ceil(t.nowData.stationNums.length/100);
                        contentHtml += "<div >";
                        for(var i=0;i<pageNum;i++){
                            if(i==0){
                                contentHtml += "<div class='xzybPageDiv' style='background-color: rgb(76,158,217);'>"+(i+1)+"</div>"
                            }
                            else{
                                contentHtml += "<div class='xzybPageDiv'>"+(i+1)+"</div>"
                            }
                        }
                        contentHtml += "<div style='float: left;height: 26px;line-height: 26px;margin: 7px;'>共"+pageNum+"页</div>"
                        contentHtml += "</div>";

                    }
                    $("#zdybPreviewDiv"+typeNum).html(contentHtml);
                    $(".xzybPageDiv").click(function(){
                        $(".xzybPageDiv").css("background-color","");
                        $(this).css("background-color","rgb(76,158,217)");
                        $("#xzybPreviewDetail").html("");
                        var numTotal = parseInt($(".xzybPageDiv").eq($(".xzybPageDiv").length-1).html());
                        var num = parseInt($(this).html());
                        var contentHtml = "";
                        var numMax = 0;
                        if(num<numTotal){
                            numMax = num*100;
                        }
                        else{
                            numMax = t.nowData.stationNums.length;
                        }
                        for(var j=((num-1)*100);j<numMax;j++){
                            contentHtml += '<div>'+t.nowData.stationNums[j]+'</div><table class="zdybPreviewTable">';
                            for(var k=3;k<169;){
                                contentHtml += '<tr><td>'+k+'</td><td>999.9</td><td>99.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>99.9</td><td>999.9</td><td>999.9</td>';
                                if(k%24==0){
                                    contentHtml +='<td>'+getelementValue(t.xzData["tmax_"+k],j)+'</td><td>'+getelementValue(t.xzData["tmin_"+k],j)+'</td><td>'+getelementValue(t.xzData["rhmax_"+k],j)+'</td><td>'+getelementValue(t.xzData["rhmin_"+k],j)+'</td><td>'+getelementValue(t.xzData["r24_"+k],j)+'</td>';
                                }
                                else{
                                    contentHtml +='<td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td>';
                                }
                                if(k%12==0){
                                    contentHtml +='<td>'+getelementValue(t.xzData["r12_"+k],j)+'</td><td>999.9</td><td>999.9</td><td>'+getelementValue(t.xzData["w_"+k],j)+'</td><td>'+getelementValue(t.xzData["wd_"+k],j)+'</td><td>'+getelementValue(t.xzData["ws_"+k],j)+'</td>';
                                }
                                else{
                                    contentHtml +='<td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td><td>999.9</td>';
                                }
                                if(k<48){
                                    k += 3;
                                }
                                else if(k<72){
                                    k += 6;
                                }
                                else{
                                    k += 12;
                                }
                            }
                            contentHtml += "</tr>";
                            contentHtml += '</table>';
                        }
                        if(num == numTotal){
                            contentHtml += '<table class="zdybPreviewTable"><tr><td>NNNN</td></tr></table>';
                        }
                        $("#xzybPreviewDetail").html(contentHtml);
                    });
                }
            }
        });
    }

    //空气污染预览
    function zdybPreviewAir(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime;
        var contentHtml = "";
        if(t.areaName == "qutai"){
            contentHtml = "<div>KQZD "+yubaoTime+"</div>";
        }
        else{
            contentHtml = "<div>KQWR "+yubaoTime+"</div>";
        }
        contentHtml += "<div>"+t.nowData.stationNums.length+"</div>";
        var exist = false;
        for(var i=0;i<t.nowData.stationNums.length;i++){
            contentHtml += "<div>"+t.nowData.stationNums[i]+" ";
            for(var j=0;j< t.elements.length;j++){
                for(var k=0;k< t.nowData.items.length;k++){
                    if(parseInt(t.elements[j].hourSpan) == t.nowData.items[k].hourSpan){
                        contentHtml += getAirValue(t.nowData.items[j].datas[i])+" ";
                        exist = true;
                        break;
                    }
                }
                if(!exist){
                    contentHtml += getAirValue()+" ";
                }
            }
            contentHtml +="</div>";
        }
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);

    }

    //海洋精细化预报预览
    function zdybPreviewSeaFine(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+mosaicTime(parseInt(t.nowElement.forecastTime)+8);
        var contentHtml = "";
        if(t.areaName == "qutai"){
            contentHtml = "<table class='zdybPreviewTable'><tr><td>JXZD "+yubaoTime+"</td></tr></table>";
        }
        else{
            contentHtml = "<table class='zdybPreviewTable'><tr><td>JXYB "+yubaoTime+"</td></tr></table>";
        }
        var type = "";
        for(var i=0;i<t.stationList.length;i++){
            if(t.stationList[i].HYJXHType!=type){
                type = t.stationList[i].HYJXHType;
                contentHtml += "<table class='zdybPreviewTable'><tr><td>"+type+"</td></tr></table>";
            }
            contentHtml += "<table class='zdybPreviewTable'><tr><td>"+t.stationList[i].StationName+"</td></tr></table><table class='zdybPreviewTable'>";
            for(var j= parseInt(t.nowElement.hourSpan);j<= parseInt(t.nowElement.hourSpanTotal);){
                contentHtml +="<tr><td>"+j+"</td>" +
                    "<td>"+ getSeaElementName("w",t.xzData["w_"+j],i) +"</td>" +
                    "<td>"+ getSeaElementName("r12",t.xzData["r12_"+j],i) +"</td>" +
                    "<td>"+ getSeaElementName("2t",t.xzData["tmin12_"+j],i) +"-"+getSeaElementName("2t",t.xzData["tmax12_"+j],i)+"</td>" +
                    "<td>"+ getSeaElementName("wd",t.xzData["wd_"+j],i) +"</td>" +
                    "<td>"+ getSeaElementName("ws",t.xzData["ws_"+j],i) +"</td>" +
                    "<td>"+ getSeaElementName("vis",t.xzData["vis_"+j],i) +"</td></tr>"
                j += parseInt(t.nowElement.hourSpan);
            }
            contentHtml +="</table>";
        }
        contentHtml +="<table class='zdybPreviewTable'><tr><td>NNNN</td></tr></table>";
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //市海洋预报预览
    function zdybPreviewSea(typeNum){
        var contentHtml = "<table class='zdybPreviewTable'><tr><td>"+t.stationList[0].AreaName+"气象台海洋预报</td></tr></table><table class='zdybPreviewTable'>";
        for(var j= parseInt(t.nowElement.hourSpan);j<= parseInt(t.nowElement.hourSpanTotal);){
            contentHtml +="<tr><td>"+j+"</td>" +
                "<td>"+ getSeaElementName("w",t.xzData["w_"+j],0) +"</td>" +
                "<td>"+ getSeaElementName("wd",t.xzData["wd_"+j],0) +"</td>" +
                "<td>"+ getSeaElementName("ws",t.xzData["ws_"+j],0) +"</td>" +
                "<td>"+ getSeaElementName("vis",t.xzData["vis_"+j],0) +"</td></tr>"
            j += parseInt(t.nowElement.hourSpan);
        }
        contentHtml +="</table>";
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //沿岸天气预报预览
    function zdybPreviewCoast(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var contentHtml = "";
        for(var i=24;i<=72;){
            var time = nowTime.substr(2,2)+"年"+nowTime.substr(5,2)+"月"+nowTime.substr(8,2)+"日"+ (parseInt(t.nowElement.forecastTime)+8)+"时"+i+"小时广西自治区气象台沿岸海区预报";
            var name = parseInt(nowTime.substr(2,2))+" "+parseInt(nowTime.substr(5,2))+" "+parseInt(nowTime.substr(8,2))+" "+(parseInt(t.nowElement.forecastTime)+8)+" "+i+" "+ t.stationList.length;
            if(i==24){
                contentHtml += "<div><table class='zdybPreviewTable'>";
            }
            else{
                contentHtml += "<div><table class='zdybPreviewTable' style='margin-top: 50px;'>";
            }
            contentHtml +="<tr><td>diamond 8 "+time+"</td></tr></table><table class='zdybPreviewTable'>";
            contentHtml += "<table class='zdybPreviewTable'><tr><td>"+name+"</td></tr></table><table class='zdybPreviewTable'>";
            for(var j=0;j< t.stationList.length;j++){
                contentHtml +="<tr><td>"+ t.stationList[j].StationNum+"</td><td>"+ t.stationList[j].Longitude+"</td><td>"+ t.stationList[j].Latitude+"</td><td>"+ t.stationList[j].Height+"</td>" +
                    "<td>"+ getelementValueInt("w",t.xzData["w_"+(i-12)],j) +"</td>" +
                    "<td>"+ getelementValueInt("wd",t.xzData["wd_"+(i-12)],j) +"</td>" +
                    "<td>"+ getelementValueInt("ws",t.xzData["ws_"+(i-12)],j) +"</td>" +
                    "<td>"+ getelementValueInt("vis",t.xzData["vis_"+(i-12)],j) +"</td>"+
                    "<td>"+ getelementValueInt("vis",t.xzData["vis_"+i],j) +"</td>" +
                    "<td>"+ getelementValueInt("w",t.xzData["w_"+i],j) +"</td>" +
                    "<td>"+ getelementValueInt("wd",t.xzData["wd_"+i],j) +"</td>" +
                    "<td>"+ getelementValueInt("ws",t.xzData["ws_"+i],j) +"</td></tr>"
                i += 24;
            }
            contentHtml +="</table></div>";
        }
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //大城市精细化预报预览
    function zdybPreviewBigCity(typeNum){
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = (Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+ t.nowElement.forecastTime;
        var yubaoshixiao = t.nowElement.ui.split(";")[0].split(",").length;
        var contentHtml = "";
        contentHtml += '<div>ZCZC</div>';
        contentHtml += '<div>FSCI50 BENN '+makeTime+'</div>';
        contentHtml += '<div>'+time+'时广西'+GDYB.GridProductClass.currentUserDepart.departName+'6小时精细化预报</div>';
        contentHtml += '<div>SPCC6H '+time+'</div>';
        contentHtml += '<div>6</div>';
        contentHtml += '<div>621 622 623 624 625 626</div>';
        contentHtml += '<div>'+t.stationList.length+'</div>';
        for(var j=0;j<t.stationList.length;j++){
            var Longitude = t.stationList[j].Longitude.toFixed(2);
            var Latitude = t.stationList[j].Latitude.toFixed(2);
            var hHeight = (t.stationList[j].Height==999999?0:t.stationList[j].Height).toFixed(1);
            contentHtml += '<table class="zdybPreviewTable"><tr><td>'+t.nowData.stationNums[j]+' '+Longitude+' '+Latitude+' '+hHeight+' '+yubaoshixiao+'</td></tr></table><table class="zdybPreviewTable">';
            for(var i= parseInt(t.nowElement.hourSpan);i<= parseInt(t.nowElement.hourSpanTotal);){
                contentHtml += '<tr><td>'+i+'</td><td>'+ getelementValue(t.xzData["w_"+i],j)+'</td><td>'+ getelementValue(t.xzData["tmax6_"+i],j)+'</td><td>'+ getelementValue(t.xzData["tmin6_"+i],j)+'</td>' +
                    '<td>'+ getelementValue(t.xzData["r6_"+i],j)+'</td><td>'+ getelementValue(t.xzData["wd6_"+i],j)+'</td><td>'+ getelementValue(t.xzData["ws6_"+i],j)+'</td></tr>';
                i += parseInt(t.nowElement.hourSpan);
            }
            contentHtml += '</table>';
        }
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //雨量预报预览
    function zdybPreviewRainfall(typeNum){
        var exist = false;
        var contentHtml = "";
        for(var i=0;i<t.nowData.stationNums.length;i++){
            contentHtml += "<div>"+t.nowData.stationNums[i]+" ";
            for(var j=0;j< t.elements.length;j++){
                for(var k=0;k< t.nowData.items.length;k++){
                    if(parseInt(t.elements[j].hourSpan) == t.nowData.items[k].hourSpan){
                        if(typeof(t.nowData.items[j].datas[i])!="undefined"&& t.nowData.items[j].datas[i]!=-9999){
                            contentHtml += Math.round(t.nowData.items[j].datas[i])+" ";
                        }
                        else{
                            contentHtml += "9999 ";
                        }
                        exist = true;
                        break;
                    }
                }
                if(!exist){
                    contentHtml += "9999 ";
                }
            }
            contentHtml +="</div>";
        }
        $("#zdybPreviewDiv"+typeNum).html(contentHtml);
    }

    //城镇预报上网
    function zdybUploadTown(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-"+(Array(2).join(0)+t.nowElement.hourSpanTotal).slice(-3)+ t.nowElement.hourSpan;
        var content = "";
        var listDiv = $("#zdybPreviewDiv"+typeNum).find("div");
        var listTable = $("#zdybPreviewDiv"+typeNum).find("table");
        for(var i =0;i<listDiv.length;i++){
            content +=$(listDiv[i]).html()+"\r\n";
        }
        for(var i=0;i<listTable.length;i++){
            var listTr = $(listTable[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    if(k==0){
                        content += formatForecast($(listTd[k]).html(),3)+ " ";
                    }
                    else if(k<listTd.length-3){
                        content += formatForecast($(listTd[k]).html(),5)+ " ";
                    }
                    else{
                        content += $(listTd[k]).html()+" ";
                    }
                }
                content += "\r\n";
            }
        }
        var name = "Z_SEVP_C_" + GDYB.GridProductClass.currentUserDepart.codeOfTownForecast + "_" + makeTime + (Array(2).join(0)+ t.zdybTownNum).slice(-2) + "_P_RFFC-SPCC-" + time + ".TXT";
        zdybUploadTemplate($(obj).attr("name"),name,content,getZDYBForecastNum)
    }

    //指导预报上网
    function zdybUploadGuide(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var time = nowTime.substr(8,2)+t.nowElement.zdybHour;
        var content = "";
        var listDiv = $("#zdybPreviewDiv"+typeNum).find("div");
        var listTable = $("#zdybPreviewDiv"+typeNum).find("table");
        content += $(listDiv[0]).html()+"\r\n"+$(listDiv[1]).html()+"\r\n"+$(listDiv[2]).find("textarea").val()+"\r\n"+$(listDiv[3]).html()+"\r\n";
        for(var i=0;i<listTable.length;i++){
            content += $(listDiv[i+5]).html()+"\r\n";
            var listTr = $(listTable[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    if($(listTd[k]).find("input").length==0){
                        content += $(listTd[k]).html()+"\t";
                    }
                    else{
                        content += $(listTd[k]).find("input").val()+"\t";
                    }
                }
                content += "\r\n";
            }
        }
        var name = GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast + "DY" + time+ ".ENN";
        zdybUploadTemplate($(obj).attr("name"),name,content,getZDYBForecastNum)
    }

    //乡镇预报上网
    function zdybUploadCountry(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+"00";
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-"+(Array(2).join(0)+t.nowElement.hourSpanTotal).slice(-3)+ t.nowElement.hourSpan;
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-16812";
        var name = "Z_SEVP_C_"+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+"_"+makeTime+"_P_RFFC-GXXZ-"+yubaoTime+".TXT";
        var productAreaName = "";
        /*if(t.areaName == "qutai"){
         productAreaName = "区台";
         }
         else{
         productAreaName = "市台";
         }*/
        var productName = productAreaName+"/"+t.nowElement.productName+"/"+"乡镇报文";
        var param = '{"name":"'+name+'","productName":"'+productName+'"}';
        var yubaoshixiaoObject = {};
        for(var i=0;i< t.elements.length;i++){
            yubaoshixiaoObject[t.elements[i].hourSpan] = 1;
        }
        var yubaoshixiao = 0;
        for(var hourSpan in yubaoshixiaoObject){
            yubaoshixiao++;
        }
        var content = "";
        $.ajax({
            type: 'post',
            url: gridServiceUrl + "services/ForecastfineService/getCountryNum",
            data: {'para': param},
            dataType: 'text',
            error: function () {
                alertModal('错误!');
            },
            success: function (data) {

                var flag = "";
                if (data == null) {
                    if (t.endTime < 0) {
                        flag = "RRA";
                    }
                    else {
                        flag = "CCA";
                    }
                }
                else if (data == "-1") {
                    if (t.endTime < 0) {
                        flag = "RRA";
                    }
                }
                else if (data.indexOf("CC") != -1) {
                    if (t.endTime < 0) {
                        flag = "RRA"
                    }
                    else {
                        var fileNum = data.split("CC")[1];
                        flag = "CC" + String.fromCharCode(fileNum.charCodeAt() + 1);
                    }
                }
                else if (data.indexOf("RR") != -1) {
                    var fileNum = data.split("RR")[1];
                    flag = "RR" + String.fromCharCode(fileNum.charCodeAt() + 1);
                }
                content += 'XZZD\r\n';
                content += 'XZJXYB '+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+' '+flag+'\r\n';
                if(t.areaName == "qutai"){
                    content += 'QTZD\r\n';
                    content += 'XZYB '+time+'\r\n';
                }
                else{
                    content += 'STZD\r\n';
                    content += GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast+'YB '+time+'\r\n';
                }
                content += t.stationList.length+'\r\n';
                for(var j=0;j< t.stationList.length;j++){
                    var Longitude = t.stationList[j].Longitude.toFixed(2);
                    var Latitude = t.stationList[j].Latitude.toFixed(2);
                    var hHeight = (t.stationList[j].Height==999999?0:t.stationList[j].Height).toFixed(1);
                    content += t.stationList[j].StationNum+' '+ Longitude+' '+ Latitude+' '+ hHeight+' '+yubaoshixiao+' 21\r\n';
                    for(var k=3;k<169;){
                        content += formatForecast(k.toString(),3)+' '+formatForecast(getelementValue(t.xzData["temp3_"+k],j))+' '+formatForecast(getelementValue(t.xzData["rh3_"+k],j))+' '+formatForecast(getelementValue(t.xzData["wd3_"+k],j))+' '+formatForecast(getelementValue(t.xzData["ws3_"+k],j))+' 999.9 '+formatForecast(getelementValue(t.xzData["r3_"+k],j))+' 999.9 99.9 999.9 999.9 ';
                        if(k%24==0){
                            content +=formatForecast(getelementValue(t.xzData["tmax_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["tmin_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["rhmax_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["rhmin_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["r24_"+k],j),5)+' ';
                        }
                        else{
                            content +='999.9 999.9 999.9 999.9 999.9 ';
                        }
                        if(k%12==0){
                            content +=formatForecast(getelementValue(t.xzData["r12_"+k],j),5)+' 999.9 999.9 '+formatForecast(getelementValue(t.xzData["w_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["wd_"+k],j),5)+' '+formatForecast(getelementValue(t.xzData["ws_"+k],j),5)+'\r\n';
                        }
                        else{
                            content +='999.9 999.9 999.9 999.9 999.9 999.9\r\n';
                        }
                        if(k<48){
                            k += 3;
                        }
                        else if(k<72){
                            k += 6;
                        }
                        else{
                            k += 12;
                        }
                    }
                }
                content += "NNNN";
                var name = "Z_SEVP_C_"+GDYB.GridProductClass.currentUserDepart.codeOfTownForecast+"_"+makeTime+"_P_RFFC-GXXZ-"+time+".TXT";
                zdybUploadTemplate($(obj).attr("name"),name,content)
            }
        });
    }

    //空气污染预报上网
    function zdybUploadAir(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-"+(Array(2).join(0)+t.nowElement.hourSpanTotal).slice(-3)+ t.nowElement.hourSpan;
        var content = "";
        var listDiv = $("#zdybPreviewDiv"+typeNum).find("div");
        for(var i=0;i<listDiv.length;i++){
            content += $(listDiv[i]).html()+"\r\n";
        }
        var name = "Z_SEVP_C_" + GDYB.GridProductClass.currentUserDepart.codeOfTownForecast + "_" + makeTime  + "00_P_RFFC-GXKQ-" + time + ".TXT";
        zdybUploadTemplate($(obj).attr("name"),name,content)
    }
    //海洋精细化预报上网
    function zdybUploadSeaFine(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+mosaicTime(parseInt(t.nowElement.forecastTime)+8);
        var content = "";
        var listTable = $("#zdybPreviewDiv"+typeNum).find("table");
        for(var i=0;i<listTable.length;i++){
            var listTr = $(listTable[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    content += $(listTd[k]).html()+"   ";
                }
                content += "\r\n";
            }
        }
        var name = "";
        if(t.areaName == "qutai"){
            name += "HYZD";
        }
        else{
            name += "HYJX";
        }
        name += yubaoTime;
        if(t.areaName == "qutai"){
            name += ".TXT";
        }
        else{
            name += ".F"+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast;
        }

        zdybUploadTemplate($(obj).attr("name"),name,content)
    }
    //市海洋预报上网
    function zdybUploadSea(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+mosaicTime(t.nowElement.publishTime);
        var content = "";
        var listTable = $("#zdybPreviewDiv"+typeNum).find("table");
        for(var i=0;i<listTable.length;i++){
            var listTr = $(listTable[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    content += $(listTd[k]).html()+"   ";
                }
                content += "\r\n";
            }
        }
        var name = "HY"+yubaoTime;
        name += ".F"+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast;
        zdybUploadTemplate($(obj).attr("name"),name,content)
    }

    //沿岸天气预报上网
    function zdybUploadCoast(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var yubaoTime = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime;
        var listDiv = $("#zdybPreviewDiv"+typeNum).find("div");
        for(var i=0;i<listDiv.length;i++){
            var content = "";
            var listTr = $(listDiv[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    content += $(listTd[k]).html()+" ";
                }
                content += "\r\n";
            }
            var name = "SEVP_GXMA_ROFC_SFER_EME_AGX_L89_P9_"+yubaoTime+"00"+(Array(2).join(0)+(i+1)*24).slice(-3)+"00.MIC";

            zdybUploadTemplate($(obj).attr("name"),name,content)
        }
    }

    //大城镇预报上网
    function zdybUploadBigCity(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var nowDate = new Date(nowTime.substr(5,2)+" "+nowTime.substr(8,2)+","+nowTime.substr(0,4)+" "+ t.nowElement.makeTime);
        nowDate.setHours(nowDate.getHours()-8);
        var makeTime = nowDate.getFullYear()+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+(Array(2).join(0)+nowDate.getDate()).slice(-2)+(Array(2).join(0)+nowDate.getHours()).slice(-2)+(Array(2).join(0)+nowDate.getMinutes()).slice(-2);
        var time = nowTime.substr(0,4)+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+"00-"+(Array(2).join(0)+t.nowElement.hourSpanTotal).slice(-3)+ (Array(2).join(0)+t.nowElement.hourSpan).slice(-2);
        var content = "";
        var listDiv = $("#zdybPreviewDiv"+typeNum).find("div");
        var listTable = $("#zdybPreviewDiv"+typeNum).find("table");
        for(var i =0;i<listDiv.length;i++){
            content +=$(listDiv[i]).html()+"\r\n";
        }
        for(var i=0;i<listTable.length;i++){
            var listTr = $(listTable[i]).find("tr");
            for(var j=0;j<listTr.length;j++){
                var listTd = $(listTr[j]).find("td");
                for(var k=0;k<listTd.length;k++){
                    if(k==0){
                        content += formatForecast($(listTd[k]).html(),3)+" ";
                    }
                    else{
                        content += formatForecast($(listTd[k]).html(),5)+" ";
                    }
                }
                content += "\r\n";
            }
        }
        var name = "Z_SEVP_C_BENN_" + makeTime + "00_P_RFFC-SPCC6H-" + time + ".TXT";
        zdybUploadTemplate($(obj).attr("name"),name,content)
    }
    //雨量预报上网
    function zdybUploadRainfall(obj){
        var typeNum = $(obj).attr("type");
        var nowTime = $("#dateSelect").find("input").val();
        var content = "";
        var list = $("#zdybPreviewDiv"+typeNum).find("div");
        for(var i=0;i<list.length;i++){
            content += $(list[i]).html()+"\r\n";
        }
        var name = "M"+nowTime.substr(5,2)+nowTime.substr(8,2)+t.nowElement.forecastTime+".F"+GDYB.GridProductClass.currentUserDepart.codeOfGuidanceForecast;
        zdybUploadTemplate($(obj).attr("name"),name,content)
    }

    //上传模板
    function zdybUploadTemplate(productName,name,content,func){
        if(GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 4)
            return;
        var productNameStr = "";
        /*if(t.areaName == "qutai"){
         productNameStr += "区台/";
         }
         else{
         productNameStr += "市台/";
         }*/
        productNameStr += t.nowElement.productName+"/"+productName
        var param = '{"productName":"'+productNameStr+'","name":"'+name+'","data":"'+content+'"}';
        $.ajax({
            type: 'post',
            url: gridServiceUrl+"services/ForecastfineService/ForecastToTXT",
            data: {'para': param},
            dataType: 'text',
            error: function () {
                alertModal('上传'+productName+'错误!');
            },
            success: function (data) {
                getAllProductNum();
                if(typeof (func)!="undefined"){
                    eval(func());
                }
                else{
                    $("#zdybShowNum").html("");
                }
                alertModal('上传'+productName+'成功');
                $("#zdybProductTypePanel").find(".productActive").click();
            }
        });
    }

    //反订格点
    function station2grid(){
        var listElement = $("#zdybMaindiv").find("tr");
        var items = [];
        for(var i=0;i<listElement.length;i++){
            var obj = {"element":$(listElement[i]).attr("element"),"hour":parseInt($(listElement[i]).attr("shixiao")),"gdybElement":t.allElements[$(listElement[i]).attr("element")].element,"hourSpan":t.allElements[$(listElement[i]).attr("element")].hourSpan,"statistic":t.allElements[$(listElement[i]).attr("element")].statistic};
            var datas = [];
            var stationNums = [];
            var list = $(listElement[i]).find(".zdybTableSelected");
            for(var j=0;j<list.length;j++){
                if($(list[j]).attr("value")=="999.9"){
                    datas.push(-9999);
                }
                else{
                    datas.push($(list[j]).attr("value"));
                }
                stationNums.push(t.nowData.stationNums[parseInt($(list[j]).attr("cols"))]);
            }
            if(list.length != 0){
                obj.datas = datas;
                obj.stationNums = stationNums;
                items.push(obj);
            }
        }
        var strItems = JSON.stringify(items);
        var stationMakeTime = $("#dateSelect").find("input").val()+" "+mosaicTime(t.nowElement.publishTime)+":00:00";
        var gridMakeTime = getGridTimeFromStationTime(stationMakeTime);
        $.ajax({
            type: 'post',
            url: gridServiceUrl+"services/GridService/station2grid",
            data:{"para":"{type:'"+ t.nowElement.gdybType+"',makeTime:'"+gridMakeTime+"',items:"+strItems+"}"},
            dataType: 'text',
            error: function () {
                alertModal('订正格点错误!');
            },
            success: function (data) {

            }
        });
    }

}
//鼠标滚动事件
function fnScroll () {
    $('#zdybHeaderdiv').scrollLeft($('#scrollX').scrollLeft());
    $('#zdybMaindiv').scrollLeft($('#scrollX').scrollLeft());
    $('#zdybColumndiv').scrollTop($('#scrollY').scrollTop());
    $('#zdybMaindiv').scrollTop($('#scrollY').scrollTop());
}

ZDYBPageClass.prototype = new PageBase();