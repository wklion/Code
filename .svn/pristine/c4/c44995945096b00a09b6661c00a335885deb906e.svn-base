/*
 * 格点预报页面
 * by zouwei, 2015-05-10
 * */
function GDYBPageClass(){
    this.className = "GDYBPageClass";
    this.myPanel_FXDZ = null;
    this.myPanel_QSDZ = null;
    this.myPanel_QHDZ = null;
    this.myPanel_LQDZ = null;
    this.myPanel_Tools = null;
    this.myDateSelecter = null;
    this.yubaoshixiaoTools = null;
    this.productType = "prvn"; //当前产品类型：PRVN-省/区级产品（Province）；CTY：市级产品(City)；CNTY：县级产品（County）
    this.polygonVector = null;
    this.lineVector = null;
    this.registerKeyDown = false;
    var t = this;

    //渲染左侧菜单区域里的按钮
    this.renderMenu = function(){
        var htmlStr = "<div id='menu_top' style='margin-bottom: 10px;'>"
                +"<div id='div_datetime' class='menuDiv_bottom' style='margin-top:5px;height: 35px;'>"
                    +"<div style='height: 27px;margin-left: 5px;'><span style='font-size: 14px;float: left;line-height: 31px;'>时间：</span><div class='menuDropDown' name='model'><span id='selectMakeTime'value='5'>05时</span>" +
                    "<div id='makeTimeDiv' class='selectYuBaoYuan'><div value='05'>05时</div><!--<div value='10'>10时</div>--><div value='16'>16时</div></div></div><div id='dateSelect' style='margin-left: 0px;height: 26px;float: left;'></div></div></div>"
                +"<div id='div_forecastSetting' style='min-height: 30px;height: 35px;' class='menuDiv_bottom'>"
                    +"<div id='div_Port' style='float: left;margin-left: 5px;'><span style='font-size: 14px;float: left;line-height: 31px;'>类型：</span><div id='dutyType' class='menuDropDown' name='model' style='width:84px;'><span >请选择</span>"
                        +"<div id='selectPort' class='selectPort'><div>关键岗</div><div>值班岗</div><div>全部</div><div>首席岗</div></div>"
                    +"</div></div>"
                    +"<div id='div_YuBaoYuan' style='float: left;margin-left: 5px;'><span style='font-size: 14px;float: left;line-height: 31px;margin-left: 5px;'>预报员：</span><div id='forecastor' class='menuDropDown' name='model' ><span>杨晓军</span><div id='selectYuBaoYuan' class='selectYuBaoYuan'></div></div><!--<select id='selectYuBaoYuan' style='width:70px;height:25px;line-height:25px;font-size: 12px;margin-left: 5px;display: none;'></select>--></div>"
                    +"<div id='div_QianFaRen' style='margin-left: 5px;float: left;display: none;'><span style='font-size: 14px;float: left;line-height: 31px;margin-left: 5px'>签发人：</span><div id='issueor' class='menuDropDown' name='model' ><span></span><div id='selectQianFaRen' class='selectYuBaoYuan'></div></div><!--<select id='selectQianFaRen' style='background-color:rgba(225, 225, 235, 0);width:70px;height:25px;line-height:25px;font-size: 12px;display: none;'></select>--></div></div>"
                +"<div id='menuDropDownDiv' class='menuDiv_bottom' style='min-height: 27px;width: 100%;'>"
                    +"<div style='height: 27px;margin-left: 5px;float: left;'><span style='font-size: 14px;float: left;line-height: 31px;'>要素：</span><div id='nowElement' class='menuDropDown' name='element' style='width:84px;'>日降水量</div>"
                    +"</div>"
                    +"<div style='float: left;margin-left: 5px;'><span style='font-size: 14px;float: left;line-height: 31px;margin-left: 5px;width: 56px;'>模式：</span><div id='gridSource' class='menuDropDown' name='model' >未知</div>"
                    +"</div>"
                    +"<div id='div_element' class='gdybElement' flag='false'>"
                        +"<button id='r12' style='margin-left: 0px;'>日降水量</button><button id='tmax' style='margin-left: 0px;'>日最高温</button><button id='tmin' style='margin-left: 0px;'>日最低温</button>"
                        +"<button id='wmax' style='margin-left: 0px;'>日最大风</button><button id='w' style='margin-left: 0px;'>天气</button><button id='air' style='margin-left: 0px;'>空气污染</button>"
                        +"<button id='r3' style='margin-left: 0px;'>降水量</button><button id='2t' style='margin-left: 0px;'>气温</button><button id='10uv' style='margin-left: 0px;'>风</button>"
                        +"<button id='rh' style='margin-left: 0px;'>相对湿度</button><button id='tcc' style='margin-left: 0px;'>云量</button><button id='vis' style='margin-left: 0px;'>能见度</button><button id='pph' style='margin-left: 0px;'>相态</button></div>"
                    +"<div class='gdybmodel' flag='false'><div id='ec'>EC-Thin</div><div id='ger'>Germany</div><div id='japan'>Japan</div><div id='t639'>T639</div><div id='bj'>中央台</div><div id='prvn'>省台指导</div><div id='cty'>市台订正</div></div>"
                +"</div>"
            +"</div>";
        var htmlTime = "<div id='yubaoshixiao' class=''>"
            +"</div>"
            +"<div id='yubaoshixiaoshuoming' class='menuDiv_bottom' style='margin:10px 0px 0px 5px;height: 28px;color: #FFFFFF;'>"
            +"<div style='background: -webkit-gradient(linear, left top, left bottom, from(rgba(247,147,30,1.0)), to(rgba(247,147,30,1.0)));background: linear-gradient(to bottom,rgba(247,147,30,1.0) 0,rgba(247,147,30,1.0) 100%);border:none;'/><span>已打开</span>"
            +"<div style='background: -webkit-gradient(linear, left top, left bottom, from(rgba(156,74,229, 1.0)), to(rgba(156,74,229, 1.0)));background: linear-gradient(to bottom,rgba(156,74,229, 1.0) 0,rgba(156,74,229, 1.0) 100%);border:none;'/><span>已修改</span>"
            +"<div style='background: -webkit-gradient(linear, left top, left bottom, from(rgba(57, 181, 74, 1.0)), to(rgba(57, 181, 74, 1.0)));background: linear-gradient(to bottom,rgba(57, 181, 74, 1.0) 0,rgba(57, 181, 74, 1.0) 100%);border:none;'/><span>已提交</span>"
            +"<div /><span>无数据</span></span>"
            +"</div>"
            +"<div style='height: 33px;'><div id='btnDown' style='outline: none;margin-left:62px;' class='menuDataUpdate'><span style='float: left;margin: -2px 0px 0px 5px;'>↓</span>下载初始场</div>"
            +"<div id='btnSave' style='outline: none' class='menuDataUpdate'><span style='float: left;margin: -2px 0px 0px 5px;'>↑</span>提交预报</div></div>";
        var htmlShow = "<div style='padding-top: 4px;' class='menuDiv_bottom showstyle'><span style='font-size: 12px;'>显示方式：</span>"
            +"<button id='buttonDisplayPlot' >填值</button><button id='buttonDisplayFill'>填色</button><button id='buttonDisplayContour'>等值线</button><button id='buttonDisplayIsoSurface'>色斑图</button>"
            +"<button id='btnHideMap' >遮罩</button><button id='btnPlay'>动画</button></div>"
            +"<div class='menuDiv_bottom showstyle'><span style='font-size: 12px;'>站点显隐：</span>"
            +"<button id='buttonDisplayNationStation'>国家站</button><button id='buttonDisplayLocalStation'>区域站</button><button id='buttonDisplayTown'>乡镇点</button><button id='buttonDisplayHighStation'>高山站</button>"
            +"<button id='buttonDisplayFocus'>关注区</button></div>";

        $("#menu_bd").html(htmlStr);
        $("#menu_timePanel").html(htmlTime);
        $("#menu_showType_bd").html(htmlShow);
        //$("#menu_top").css("min-height",(parseInt($("#menu_bd").css("height"))-75));
        this.myDateSelecter = new DateSelecter(2, 2); //最小视图为天
        this.myDateSelecter.intervalMinutes = 60*24; //24小时
        $("#dateSelect").append(this.myDateSelecter.div);
        $("#dateSelect").find("img").css("display","none");
        $("#dateSelect").find("input").css("border","none").css("margin-top","4px").css("box-shadow","none").css("color","#31CAFF");
        //预报时效
        this.yubaoshixiaoTools = new YuBaoshixiaoTools($("#yubaoshixiao"), this.myDateSelecter.getCurrentTimeReal());

        $("#panelToolsContainer").css("display","block");
        //显示格点订正工具箱
        $("#panelToolsContainer").css("display","block");
        this.myPanel_Tools = new Panel_Tools($("#panelToolsContainer"));

        //默认初始化

        $("#nowElement").click(function(){
            $("#div_element").css("display","block");
            $(".gdybmodel").css("display","none");
        });
        $("#menuDropDownDiv").hover(null,function(){
            if($("#div_element").attr("flag")=="false"){
                $("#div_element").css("display","none");
            }
            if($(".gdybmodel").attr("flag")=="false"){
                $(".gdybmodel").css("display","none");
            }
        });

        $("#div_element").hover(function(){
            $(this).attr("flag","true");
        },function(){
            $(this).attr("flag","false");
        });
        $(".gdybmodel").hover(function(){
            $(this).attr("flag","true");
        },function(){
            $(this).attr("flag","false");
        });
        /*$("#div_display").hover(function(){
            $(this).attr("flag","true");
        },function(){
            $(this).attr("flag","false");
        });*/

        //选择值班类型（开始下载数据）
        $("#selectPort").find("div").click(function(){
            $("#dutyType").find("span").html($(this).html());
            $("#selectPort").find("div").css("background-color","");
            $("#selectPort").find("div").css("color","");
            $(this).css("background-color","rgb(116,173,213)");
            $(this).css("color","#ffffff");
            /*if($(this).html() == ""){
                GDYB.GridProductClass.currentPost = null;
                GDYB.GridProductClass.currentVersion = null;
                return;
            }
            else */if($(this).html() == "关键岗"){
                GDYB.GridProductClass.currentPost = {min:0, max:72, des:"前三天", name:$("#selectPort").val() }; //左开右闭
                GDYB.GridProductClass.currentVersion = "r";
                $("#div_YuBaoYuan").css("display", "block");
                //$("#div_YuBaoYuan").css("float", "none");
                $("#div_QianFaRen").css("display", "none");
            }
            else if($(this).html() == "值班岗")
            {
                GDYB.GridProductClass.currentPost = {min:72, max:240, des:"后四天", name:$("#selectPort").val() }; //左开右闭
                GDYB.GridProductClass.currentVersion = "r";
                $("#div_YuBaoYuan").css("display", "block");
                //$("#div_YuBaoYuan").css("float", "none");
                $("#div_QianFaRen").css("display", "none");
            }
            else if($(this).html() == "全部")
            {
                GDYB.GridProductClass.currentPost = {min:0, max:240, des:"全部", name:$("#selectPort").val() }; //左开右闭
                GDYB.GridProductClass.currentVersion = "r";
                $("#div_YuBaoYuan").css("display", "block");
                //$("#div_YuBaoYuan").css("float", "none");
                $("#div_QianFaRen").css("display", "none");
            }
            else if($(this).html() == "首席岗")
            {
                GDYB.GridProductClass.currentPost = {min:0, max:240, des:"全部", name:$("#selectPort").val() }; //左开右闭
                GDYB.GridProductClass.currentVersion = "p";
                $("#div_YuBaoYuan").css("display", "none");
                //$("#div_YuBaoYuan").css("float", "none");
                $("#div_QianFaRen").css("display", "block");
            }

            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            regesterYuBaoShiXiaoEvent(); //由于createDom重构了页面，需要重新注册事件，否则无法响应事件
            GDYB.GridProductClass.dataCache.initInfos();
//            //下载全部要素
//            GDYB.GridProductClass.dataCache = null; //销毁内存，否则崩溃
//            GDYB.GridProductClass.datasetGridInfos = [];
//            downAllElement(function(){
//                {
//					if(GDYB.GridProductClass.currentType == "prvn" && $("#selectMakeTime").val() == 16 || GDYB.GridProductClass.currentType == "cty" && $("#selectMakeTime").val() == 10){
//						callLast(function(){
//							//打开第一个要素
//							var btnElementActive = $("#div_element").find("button.active");
//							var element = "r12";
//							if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//								element = btnElementActive.attr("id");
//							$("#div_element").find("button.active").removeClass("active");
//							$("#div_element").find("#"+element).addClass("active");
//
//							GDYB.GridProductClass.getGridInfo(function(){
//								checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//							}, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//						});
//					}
//                    else{
//						//打开第一个要素
//						var btnElementActive = $("#div_element").find("button.active");
//						var element = "r12";
//						if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//							element = btnElementActive.attr("id");
//						$("#div_element").find("button.active").removeClass("active");
//						$("#div_element").find("#"+element).addClass("active");
//
//						GDYB.GridProductClass.getGridInfo(function(){
//							checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//						}, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//					}
//                }
//            });
        });

        $("#dutyType").hover(null,function(){
            $("#selectPort").css("display","none");
        });
        $("#dutyType").click(function(){
            $("#selectPort").css("display","block");
        });

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

        $("#gridSource").click(function(){
            $(".gdybmodel").css("display","block");
            $("#div_element").css("display","none");
        });

        $("#selectMakeTime").parent().hover(null,function(){
            $("#makeTimeDiv").css("display","none");
        });
        $("#selectMakeTime").parent().click(function(){
            $("#makeTimeDiv").css("display","block");
        });

        $(".gdybmodel").find("div").click(function(){
            if(this.id=="prvn"||this.id=="cty"){
                var id = this.id;
                var typeModel = GDYB.GridProductClass.currentType;
                var element = GDYB.GridProductClass.currentElement;
                var forecastTime = GDYB.GridProductClass.currentDateTime;
                var url=gridServiceUrl+"services/GridService/getGridProductLastDate";
                $.ajax({
                    data:{"para":"{element:'"+ element + "',type:'" + typeModel + "',forecastTime:'" + forecastTime + "'}"},
                    url:url,
                    dataType:"text",
                    success:function(data){
                        if(typeof(data) == "undefined" || data == null || data == ""){
                            alertModal("没有找到上一期");
                            return;
                        }
                        $("#div_modal_content").html("是否调入"+(id == "prvn"?"省台指导":"市台订正")+"预报：" + data);
                        $("#div_modal").modal();
                        $("#div_modal").find("a").unbind();
                        $("#div_modal").find("a").click(function(){
                            if(typeof(this.id) != "undefined"){
                                if(this.id == "btn_ok")
                                {
                                    if($("#inputCurrentElementCurrentHourspan")[0].checked)
                                        GDYB.GridProductClass.callModel(typeModel, data, "p");
                                    else if($("#inputCurrentElementAllHourspan")[0].checked)
                                        GDYB.GDYBPage.callModels(typeModel, data, "p");
                                    else if($("#inputAllElementAllHourspan")[0].checked)
                                        GDYB.GDYBPage.callModelsAll(typeModel, null, data, "p");
                                }
                            }
                        });
                    },
                    error: function (e) {
                        alertModal("没有找到上一期");
                    },
                    type:"POST"
                });
            }
            else{
                var typeModel = this.id;
                var element = GDYB.GridProductClass.currentElement;
                var url=gridServiceUrl+"services/GridService/getNWPModelLastDate";
                $.ajax({
                    data:{"para":"{element:'"+ element + "',type:'"+typeModel + "'}"},
                    url:url,
                    dataType:"text",
                    success:function(data){
                        $("#div_modal_content").html("是否调入模式数据（" + data + "）");
                        $("#div_modal").modal();
                        $("#div_modal").find("a").unbind();
                        $("#div_modal").find("a").click(function(){
                            if(typeof(this.id) != "undefined"){
                                if(this.id == "btn_ok")
                                {
                                    if($("#inputCurrentElementCurrentHourspan")[0].checked)
                                        GDYB.GridProductClass.callModel(typeModel, data, "p");
                                    else if($("#inputCurrentElementAllHourspan")[0].checked)
                                        GDYB.GDYBPage.callModels(typeModel, data, "p");
                                    else if($("#inputAllElementAllHourspan")[0].checked)
                                        GDYB.GDYBPage.callModelsAll(typeModel, data, "p");
                                }
                            }
                        });
                    },
                    error: function (e) {
                        alertModal("没有找到数值模式");
                    },
                    type:"POST"
                });
            }
        });

        //点击要素
        $("#div_element").find("button").click(function(){
            if($(this).hasClass("disabled")) //无效按钮，直接返回
                return;
            $("#nowElement").html($(this).html());
            var btnElementActive = $("#div_element").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;
            btnElementActive.removeClass("active");
            $(this).addClass("active");

            if(GDYB.GridProductClass.dataCache == null) //未下载（缓存），不允许显示和编辑
                return;

            var elementSrc = btnElementActive.attr("id");
            var element = this.id;
            openElement(element, elementSrc);
        });

        //打开要素
        function openElement(element, elementSrc){
            //检查合理性
            var reasonable = true;
            var elementSrc = elementSrc;
            for(var key in CrossRelation){
                var relation = CrossRelation[key];
                if(relation.target == element){
                    reasonable = relation.reasonable;
                    if(!reasonable){
                        elementSrc = relation.src;
                        break;
                    }
                }
            }

            //交叉订正
            var datetime = t.myDateSelecter.getCurrentTime(false);
            var bNeedCrossCorrection = false;
            if(GDYB.GridProductClass.dataCache != null && !reasonable)
            {
                if (elementSrc == "r12" && element == "r3") {
                    $("#div_modal_confirm_content").html("日降水量已修改，是否订正降水量？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined"){
                            if(this.id == "btn_ok")
                            {
                                bNeedCrossCorrection = true;
                                var elementTarget = "r3";
                                var elementNameTarget = "降水量";
                                var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheTarget == null) {
                                    GDYB.GridProductClass.getGrids([function () {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);
                                    }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                }
                                else {
                                    var cc = new CrossCorrection();
                                    cc.cal(function(){
                                        //打破合理性
                                        for (var key in CrossRelation) {
                                            var relation = CrossRelation[key];
                                            if (relation.src == "r3" && relation.target != "r12") //relation.target == "r12"避免嵌套循环
                                            {
                                                relation.reasonable = false;
                                            }
                                        }
                                        SwitchElement();
                                    }, elementSrc, elementTarget);
                                }
                            }
                        }
                    });
                }

                if ((elementSrc == "tmax" || elementSrc == "tmin")  && element == "2t") {
                    $("#div_modal_confirm_content").html("日最高/低已修改，是否订正气温？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                bNeedCrossCorrection = true;
                                var elementAnother = elementSrc == "tmax" ? "tmin" : "tmax";
                                var elementNameAnother = elementAnother == "tmax" ? "日最高气温" : "日最低气温";
                                var elementTarget = element;
                                var dataCacheAnother = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheAnother == null) {
                                    GDYB.GridProductClass.getGrids([crossCorrection_2t], elementAnother, elementNameAnother, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementAnother), datetime);
                                }
                                else {
                                    crossCorrection_2t();
                                }

                                function crossCorrection_2t() {
                                    var elementTarget = "2t";
                                    var elementNameTarget = "气温";
                                    var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                    if (dataCacheTarget == null) {
                                        GDYB.GridProductClass.getGrids([function () {
                                            var cc = new CrossCorrection();
                                            cc.cal(SwitchElement, elementSrc, elementTarget);
                                        }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                    }
                                    else {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);
                                    }
                                };
                            }
                        }
                    });
                }

                if (elementSrc == "wmax" && element == "10uv") {
                    $("#div_modal_confirm_content").html("日最大风已修改，是否订正风？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                bNeedCrossCorrection = true;
                                var elementTarget = "10uv";
                                var elementNameTarget = "风";
                                var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheTarget == null) {
                                    GDYB.GridProductClass.getGrids([function () {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);
                                    }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                }
                                else {
                                    var cc = new CrossCorrection();
                                    cc.cal(SwitchElement, elementSrc, elementTarget);
                                }
                            }
                        }
                    });
                }

                if (elementSrc == "10uv"  && element == "wmax") {
                    $("#div_modal_confirm_content").html("风已修改，是否订正日最大风？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                bNeedCrossCorrection = true;
                                var elementTarget = "wmax";
                                var elementNameTarget = "日最大风";
                                var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheTarget == null) {
                                    GDYB.GridProductClass.getGrids([function () {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);
                                    }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                }
                                else {
                                    var cc = new CrossCorrection();
                                    cc.cal(SwitchElement, elementSrc, elementTarget);
                                }
                            }
                        }
                    });
                }

                if (elementSrc == "r3"  && element == "r12") {
                    $("#div_modal_confirm_content").html("降水量已修改，是否订正日降水量？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                bNeedCrossCorrection = true;
                                var elementTarget = "r12";
                                var elementNameTarget = "日降水量";
                                var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheTarget == null) {
                                    GDYB.GridProductClass.getGrids([function () {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);

                                        //打破合理性
                                        for(var key in CrossRelation){
                                            var relation = CrossRelation[key];
                                            if(relation.src == "r12" && relation.target == "w"){
                                                relation.reasonable = false;
                                            }
                                        }
                                    }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                }
                                else {
                                    var cc = new CrossCorrection();
                                    cc.cal(SwitchElement, elementSrc, elementTarget);

                                    //打破合理性
                                    for(var key in CrossRelation){
                                        var relation = CrossRelation[key];
                                        if(relation.src == "r12" && relation.target == "w"){
                                            relation.reasonable = false;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

              if (elementSrc == "r3"  && element == "tcc") {
                $("#div_modal_confirm_content").html("降水量已修改，是否订正云量？");
                $("#div_modal_confirm").modal();
                $("#div_modal_confirm").find("a").unbind();
                $("#div_modal_confirm").find("a").click(function(){
                    if(typeof(this.id) != "undefined") {
                        if (this.id == "btn_ok") {
                            bNeedCrossCorrection = true;
                            var elementTarget = "tcc";
                            var elementNameTarget = "云量";
                            var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                            if (dataCacheTarget == null) {
                                GDYB.GridProductClass.getGrids([function () {
                                    var cc = new CrossCorrection();
                                    cc.cal(SwitchElement, elementSrc, elementTarget);
                                }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                            }
                            else {
                                var cc = new CrossCorrection();
                                cc.cal(SwitchElement, elementSrc, elementTarget);
                            }
                        }
                    }
                });
            }

                if (elementSrc == "2t"  && (element == "tmax" || element == "tmin")) {
                    $("#div_modal_confirm_content").html("气温已修改，是否订正日最高/低气温？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                bNeedCrossCorrection = true;
                                var elementTarget = "tmax";
                                var elementTargetName = "日最高气温";
                                var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                if (dataCacheTarget == null) {
                                    GDYB.GridProductClass.getGrids([crossCorrection_tmax_tmin], elementTarget, elementTargetName, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementAnother), datetime);
                                }
                                else {
                                    crossCorrection_tmax_tmin();
                                }

                                function crossCorrection_tmax_tmin() {
                                    var elementTarget = "tmin";
                                    var elementNameTarget = "日最低气温";
                                    var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                    if (dataCacheTarget == null) {
                                        GDYB.GridProductClass.getGrids([function () {
                                            var cc = new CrossCorrection();
                                            cc.cal(SwitchElement, elementSrc, elementTarget);
                                        }], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                    }
                                    else {
                                        var cc = new CrossCorrection();
                                        cc.cal(SwitchElement, elementSrc, elementTarget);
                                    }
                                };
                            }
                        }
                    });
                }

                if((elementSrc == "tcc" || elementSrc == "r12") && element=="w"){
                    var elementSrcName = "";
                    if(elementSrc == "tcc")
                        elementSrcName = "云量";
                    else if(elementSrc == "r12")
                        elementSrcName = "日降水量";
                    $("#div_modal_confirm_content").html(elementSrcName+"已修改，是否订正天气现象？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function(){
                        if(typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                var maketime = GDYB.GridProductClass.currentMakeTime;
                                var version = GDYB.GridProductClass.currentVersion;
                                var dataCache = GDYB.GridProductClass.dataCache;
                                var currentDateTime = datetime;
                                var dataCacheTCC = dataCache.getData(maketime, version, currentDateTime, "tcc");
                                if (dataCacheTCC == null)
                                    alertModal("请先下载云量。");
                                else {
                                    var dataCacheR12 = dataCache.getData(maketime, version, currentDateTime, "r12");
                                    if (dataCacheR12 == null)
                                        alertModal("请先下载日降水量。");
                                    else {
                                        bNeedCrossCorrection = true;
                                        var elementTarget = "w";
                                        var elementNameTarget = "天气现象";
                                        var dataCacheTarget = GDYB.GridProductClass.dataCache.getData(GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion, datetime, elementTarget);
                                        if (dataCacheTarget == null) {
                                            GDYB.GridProductClass.getGrids([correctWeather], elementTarget, elementNameTarget, GDYB.GridProductClass.currentType, "1000", t.getHourSpan(elementTarget), datetime);
                                        }
                                        else {
                                            correctWeather();
                                        }

                                        function correctWeather() {
                                            var cc = new CrossCorrection();
                                            cc.cal(SwitchElement, elementSrc, elementTarget);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if((elementSrc == "r3" || elementSrc == "2t") && element=="pph") {
                    var elementSrcName = "";
                    if(elementSrc == "r3")
                        elementSrcName = "3小时降水量";
                    else if(elementSrc == "2t")
                        elementSrcName = "3小时气温";
                    $("#div_modal_confirm_content").html(elementSrcName+"已修改，是否订正相态？");
                    $("#div_modal_confirm").modal();
                    $("#div_modal_confirm").find("a").unbind();
                    $("#div_modal_confirm").find("a").click(function() {
                        if (typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                var cc = new CrossCorrection();
                                cc.cal(SwitchElement, elementSrc, element);
                            }
                        }
                    });
                }
            }

            if(!bNeedCrossCorrection)
                SwitchElement();

            function SwitchElement(){
                //切换时效面板
                t.yubaoshixiaoTools.numbers = t.getHourSpan(element);
                t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
                regesterYuBaoShiXiaoEvent();

                if(GDYB.GridProductClass.currentPost == null) //只适用于格点预报，不适用于数值模式，所以写在GDYBPageClass中判断
                    return;

//                if(GDYB.GridProductClass.currentType == "prvn" && GDYB.GridProductClass.currentPost.name == "首席岗"){
//                    GDYB.GridProductClass.getGridInfo(function () {
//                        callRInfo(checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false)), element);
//                    }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                }
//                else
                {
                    //先查询格点产品信息
                    GDYB.GridProductClass.getGridInfo(function () {
                        checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                    }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                }
            };
        }

        //全部时效一次性请求过来，放到缓存中
        function cache(recall, element, elementName, hourspans){
            var date = t.myDateSelecter.getCurrentTime(false);
            var type = t.productType;
            var level = 1000;
            var recalls = [];
            if(recall != null) {
                recalls.push(t.updateHourSpanStatus);
                recalls.push(recall);
            }
            GDYB.GridProductClass.cache(recalls, type, GDYB.GridProductClass.currentMakeTime, date, element, elementName, level, hourspans);
        };

        //下载全部要素
        function downAllElement(recall){
            var elements = [];
            var elementNames = [];
            var buttons = $("#div_element").find("button");
            for(var key in buttons){
                if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
                {
                    elements.push(buttons[key].id);
                    elementNames.push(buttons[key].innerHTML);
                }
            }

            //递归请求
            var nIndex = -1;
            down();
            function down(){
                nIndex++;
                if(nIndex >= elements.length) //全部请求完成
                {
                    //下载全部产品信息
                    GDYB.GridProductClass.getGridInfos(function(){
                        t.updateElementStatus();
                    }, GDYB.GridProductClass.currentUserDepart.departCode, GDYB.GridProductClass.currentType, t.myDateSelecter.getCurrentTime(false), GDYB.GridProductClass.currentVersion, elements);

                    recall&&recall();
                    return;
                }
                var element = elements[nIndex];
                var elementName = elementNames[nIndex];
                var hourspans = t.getHourSpan(element);
                var date = t.myDateSelecter.getCurrentTime(false);
                var type = GDYB.GridProductClass.currentType;
                var maketime = GDYB.GridProductClass.currentMakeTime;
                var level = 1000;
                var recalls = [];
                recalls.push(down);
                GDYB.GridProductClass.cache(recalls, type, maketime, date, element, elementName, level, hourspans);
            }
        };

        //提交全部要素
        function saveAllElement(){
            var elements = [];
            var elementNames = [];
            var buttons = $("#div_element").find("button");
            for(var key in buttons){
                if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
                {
                    elements.push(buttons[key].id);
                    elementNames.push(buttons[key].innerHTML);
                }
            }

            var nIndex = -1;
            var messages = "";
            save();

            //递归请求
            function save(message){
                nIndex++;
                if("undefined" != typeof(message))
                    messages+=message+"\r\n";
                if(nIndex >= elements.length)
                {
                    alertModal(messages);
                    return;
                }

                var forecaster = $("#forecastor").find("span").html();
                var issuer = $("#issueror").find("span").html();
                var element = elements[nIndex];
                //var elementName = elementNames[nIndex];
                var hourspans = t.getHourSpan(element);
                var type = GDYB.GridProductClass.currentType;
                GDYB.GridProductClass.saveGridProducts(save, type, userName, forecaster, issuer, element, hourspans);
            }
        };

        //（市台，05和16时）调入区台指导产品（仅数据为空的时效）
        function callPRVN(recall){
            var maketime =  GDYB.GridProductClass.currentMakeTime;
            var version = GDYB.GridProductClass.currentVersion;
            var forecattime = t.myDateSelecter.getCurrentTime(false);
            if(GDYB.GridProductClass.currentType != "cty")
                return;
            var elements = [];
            var buttons = $("#div_element").find("button");
            for(var key in buttons){
                if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
                {
                    var element = buttons[key].id;
                    var elementName = buttons[key].innerHTML;
                    var dataCache = GDYB.GridProductClass.dataCache.getData(maketime, version, forecattime, element);
                    var hourspans = t.getHourSpan(element);
                    if(dataCache == null){
                        elements.push({element:element, elementName:elementName, hourSpans:hourspans});
                    }
                    else{
                        var hourspansLost = [];
                        for(var hKey in hourspans){
                            var hourspan = hourspans[hKey];
                            if(typeof(dataCache[hourspan]) == "undefined" || dataCache[hourspan].data == null)
                                hourspansLost.push(hourspan);
                        }
                        if(hourspansLost.length != 0)
                            elements.push({element:element, elementName:elementName, hourSpans:hourspansLost});
                    }
                }
            }

            //递归请求
            var nIndex = -1;
            down();
            function down(){
                nIndex++;
                if(nIndex >= elements.length)
                {
                    recall&&recall();
                    return;
                }
                var e = elements[nIndex];
                var element = e.element;
                var elementName = e.elementName;
                var hourspans = e.hourSpans;
                var date = t.myDateSelecter.getCurrentTime(false);
                var type = "prvn";
                var level = 1000;
                var recalls = [];
                recalls.push(down);
                GDYB.GridProductClass.cache(recalls, type, maketime, date, element, elementName, level, hourspans);
            }
        };

        //调入（同一次预报的）上一期预报（仅数据为空的时效）
        //区台:16点，调入10点预报
        //市台:10点，调入05点预报
        function callLast(recall){
            //计算（同一次预报的）上一期时间
            var type = GDYB.GridProductClass.currentType;
            var maketime =  GDYB.GridProductClass.currentMakeTime;

            var year = parseInt(maketime.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/, "$1"));
            var month = parseInt(maketime.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/, "$1"));
            var day = parseInt(maketime.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/, "$1"));
            var hour = parseInt(maketime.replace(/\d*-\d*-\d* (\d*):\d*:\d*/, "$1"));
            var makeHour = hour;
            var lastHour = -1;
            if(type == "prvn"){
                if(makeHour == 16)
                    lastHour = 10;
                else{
                    recall&&recall();
                    return;
                }
            }
            else if(type == "cty"){
                if(makeHour == 10)
                    lastHour = 5;
                else{
                    recall&&recall();
                    return;
                }
            }
            var makeTimeLast = year + "-" + (Array(2).join(0)+month).slice(-2) + "-" + (Array(2).join(0)+day).slice(-2) + " " + (Array(2).join(0)+lastHour).slice(-2)+ ":00:00";

            //获取无数据的要素和时次
            var version = GDYB.GridProductClass.currentVersion;
            var forecattime = t.myDateSelecter.getCurrentTime(false);
            var elements = [];
            var buttons = $("#div_element").find("button");
            for(var key in buttons){
                if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
                {
                    var element = buttons[key].id;
                    var elementName = buttons[key].innerHTML;
                    var dataCache = GDYB.GridProductClass.dataCache.getData(maketime, version, forecattime, element);
                    var hourspans = t.getHourSpan(element);
                    if(dataCache == null){
                        elements.push({element:element, elementName:elementName, hourSpans:hourspans});
                    }
                    else{
                        var hourspansLost = [];
                        for(var hKey in hourspans){
                            var hourspan = hourspans[hKey];
                            if(typeof(dataCache[hourspan]) == "undefined" || dataCache[hourspan].data == null)
                                hourspansLost.push(hourspan);
                        }
                        if(hourspansLost.length != 0)
                            elements.push({element:element, elementName:elementName, hourSpans:hourspansLost});
                    }
                }
            }

            //递归请求
            var nIndex = -1;
            down();
            function down(){
                nIndex++;
                if(nIndex >= elements.length)
                {
                    recall&&recall();
                    return;
                }
                var e = elements[nIndex];
                var element = e.element;
                var elementName = e.elementName;
                var hourspans = e.hourSpans;
                var level = 1000;

                var recalls = [];
                recalls.push(down);
                GDYB.GridProductClass.cache(recalls, type, makeTimeLast, forecattime, element, elementName, level, hourspans, "p"); //这里必须是审核发布版
            }
        };

//        //调入订正产品（待审核）
//        function callR(recall){
//            var maketime =  GDYB.GridProductClass.currentMakeTime;
//            var version = GDYB.GridProductClass.currentVersion;
//            var forecattime = t.myDateSelecter.getCurrentTime(false);
//            if(version != "p")
//                return;
//            var elements = [];
//            var buttons = $("#div_element").find("button");
//            for(var key in buttons){
//                if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
//                {
//                    var element = buttons[key].id;
//                    var elementName = buttons[key].innerHTML;
//                    var dataCache = GDYB.GridProductClass.dataCache.getData(maketime, version, forecattime, element);
//                    var hourspans = t.getHourSpan(element);
//                    if(dataCache == null){
//                        elements.push({element:element, elementName:elementName, hourSpans:hourspans});
//                    }
//                    else{
//                        var hourspansLost = [];
//                        for(var hKey in hourspans){
//                            var hourspan = hourspans[hKey];
//                            if(typeof(dataCache[hourspan]) == "undefined" || dataCache[hourspan].data == null)
//                                hourspansLost.push(hourspan);
//                        }
//                        if(hourspansLost.length != 0)
//                            elements.push({element:element, elementName:elementName, hourSpans:hourspansLost});
//                    }
//                }
//            }
//
//            var nIndex = -1;
//            down();
//
//            //递归请求
//            function down(){
//                nIndex++;
//                if(nIndex >= elements.length)
//                {
//                    recall&&recall();
//                    return;
//                }
//                var e = elements[nIndex];
//                var element = e.element;
//                var elementName = e.elementName;
//                var hourspans = e.hourSpans;
//                var date = t.myDateSelecter.getCurrentTime(false);
//                var type = GDYB.GridProductClass.currentType;
//                var maketime = GDYB.GridProductClass.currentMakeTime;
//                var level = 1000;
//                var recalls = [];
//                recalls.push(down);
//                GDYB.GridProductClass.cache(recalls, type, maketime, date, element, elementName, level, hourspans, "r");
//            }
//        };
//
//        //调入订正产品（待审核）信息
//        function callRInfo(recall, element){
//            var gridinfos = GDYB.GridProductClass.getGridInfosFromCache(GDYB.GridProductClass.currentType, element, GDYB.GridProductClass.currentDateTime);
//            var hourspans = t.getHourSpan(element);
//            if(gridinfos.length != hourspans.length){
//                GDYB.GridProductClass.getGridInfo(function(){
//                    recall&&recall();
//                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false), "r");
//            }
//        }

        //点击动画
        var play;
        $("#btnPlay").click(function(){
            if($("#btnPlay").hasClass("active"))
            {
                $("#btnPlay").removeClass("active")
                $("#btnPlay").html("播放");
                clearInterval(play);
            }
            else
            {
                $("#btnPlay").addClass("active")
                $("#btnPlay").html("停止");
                var nIndex = 0;
                var hourspans = t.yubaoshixiaoTools.numbers;
                play = setInterval(function(){
                    $("#yubaoshixiao").find("td").removeClass("active");
                    if(nIndex >= hourspans.length)
                        nIndex = 0;
                    var hourspan = hourspans[nIndex++];
                    t.yubaoshixiaoTools.hourSpan = hourspan;
                    $("#yubaoshixiao").find("#"+hourspan+"h").addClass("active");
                    t.displayGridProduct();
                },500);
            }
        });

        if(!t.registerKeyDown){
            t.registerKeyDown = true;
            //键盘按键事件，实现上翻、下翻
            $(document).keydown(function (event) {
                if(typeof(GDYB.Page.curPage.className) == "undefined" || GDYB.Page.curPage.className != t.className)
                    return;
                if(document.activeElement.id == "table_yubaoshixiao"){  //时效上下翻
                    var offset = 0;
                    if(event.keyCode == 37 || event.keyCode == 38)  //左上
                        offset = -1;
                    else if(event.keyCode == 39 || event.keyCode == 40) //右下
                        offset = 1;

                    if(offset != 0){
                        var hourspans = t.yubaoshixiaoTools.numbers;
                        var hourSpan = t.yubaoshixiaoTools.hourSpan;
                        var nIndex = -1;
                        for(var hKey in hourspans){
                            if(hourspans[hKey] == hourSpan){
                                nIndex = Number(hKey);
                                break;
                            }
                        }
                        nIndex += offset
                        if(nIndex >= hourspans.length)
                            nIndex = 0;
                        else if(nIndex < 0)
                            nIndex = hourspans.length - 1;
                        hourSpan = hourspans[nIndex];
                        $("#table_yubaoshixiao").find("td").removeClass("active");
                        t.yubaoshixiaoTools.hourSpan = hourSpan;
                        $("#table_yubaoshixiao").find("#"+hourSpan+"h").addClass("active");
                        t.displayGridProduct();
                    }
                }
                else if(document.activeElement.parentNode.parentNode.id == "div_element"){ //要素上下翻
                    var offset = 0;
                    if(event.keyCode == 37 || event.keyCode == 38)  //左上
                        offset = -1;
                    else if(event.keyCode == 39 || event.keyCode == 40) //右下
                        offset = 1;
                    if(offset != 0){
                        var nIndex = -1;
                        var btnElementActive = $("#div_element").find("button.active");
                        var id = btnElementActive.attr("id");
                        var btns = $("#div_element").find("button");
                        for(var i=0; i<btns.length; i++)
                            if(id == btns[i].id){
                                nIndex = i;
                                break;
                            }
                        nIndex += offset;
                        if(nIndex >= btns.length)
                            nIndex = 0;
                        else if(nIndex < 0)
                            nIndex = btns.length - 1;
                        var btn = btns[nIndex];
                        btnElementActive.removeClass("active");
                        $("#"+btn.id).addClass("active");
                        openElement(btn.id, id);
                    }
                }
            });
        }

        //点击下载
        $("#btnDown").click(function(){
            if(GDYB.GridProductClass.currentPost == null){
                alertModal("请选择值班类型。");
                return;
            }
            $("#div_progress_title").html("正在下载[日降水]要素...");
            $("#div_progress").css("display", "block");
            GDYB.GridProductClass.dataCache.clearFile(function(){
                GDYB.GridProductClass.dataCache = null; //销毁内存，否则崩溃
                GDYB.GridProductClass.datasetGridInfos = [];
                downAllElement(function(){
                    {
                        if(GDYB.GridProductClass.currentType == "prvn") {
                            /*if($("#selectMakeTime").attr("value") == 16){
                                callLast(function(){
                                 //打开第一个要素
                                 var btnElementActive = $("#div_element").find("button.active");
                                 var element = "r12";
                                 if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
                                 element = btnElementActive.attr("id");
                                 $("#div_element").find("button.active").removeClass("active");
                                 $("#div_element").find("#" + element).addClass("active");

                                 GDYB.GridProductClass.getGridInfo(function () {
                                 checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                 }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                 });
                            }
                            else{*/
                                //打开第一个要素
                                var btnElementActive = $("#div_element").find("button.active");
                                var element = "r12";
                                if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
                                    element = btnElementActive.attr("id");
                                $("#div_element").find("button.active").removeClass("active");
                                $("#div_element").find("#" + element).addClass("active");

                                GDYB.GridProductClass.getGridInfo(function () {
                                    GDYB.GDYBPage.updateHourSpanStatus();
                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                           /* }*/
                        }
                        else
                        {
                            if($("#selectMakeTime").attr("value") == 5 || $("#selectMakeTime").attr("value") == 16){
                                callPRVN(function(){
                                    //打开第一个要素
                                    var btnElementActive = $("#div_element").find("button.active");
                                    var element = "r12";
                                    if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
                                        element = btnElementActive.attr("id");
                                    $("#div_element").find("button.active").removeClass("active");
                                    $("#div_element").find("#"+element).addClass("active");

                                    GDYB.GridProductClass.getGridInfo(function(){
                                        GDYB.GDYBPage.updateHourSpanStatus();
                                        checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                    }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                });
                            }
                            else if($("#selectMakeTime").attr("value") == 10){
                                /*callLast(function(){
                                 //打开第一个要素
                                 var btnElementActive = $("#div_element").find("button.active");
                                 var element = "r12";
                                 if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
                                 element = btnElementActive.attr("id");
                                 $("#div_element").find("button.active").removeClass("active");
                                 $("#div_element").find("#"+element).addClass("active");

                                 GDYB.GridProductClass.getGridInfo(function(){
                                 checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                 }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                 });
                            }
                            else{*/
                                //打开第一个要素
                                var btnElementActive = $("#div_element").find("button.active");
                                var element = "r12";
                                if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
                                    element = btnElementActive.attr("id");
                                $("#div_element").find("button.active").removeClass("active");
                                $("#div_element").find("#"+element).addClass("active");

                                GDYB.GridProductClass.getGridInfo(function(){
                                    GDYB.GDYBPage.updateHourSpanStatus();
                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
                                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
                            }
                        }
                    }
                });
            });

        });

        //点击保存
        $("#btnSave").click(function(){
            if(GDYB.GridProductClass.currentUserDepart == null || GDYB.GridProductClass.currentUserDepart.departCode.length > 4)
                return;
            var userName = GDYB.GridProductClass.currentUserName;
            if (userName != null && userName != "") {
                var range =GDYB.GridProductClass.currentPost;
                if(range != null) {
                    $("#span_SaveTheElementAllHourSpan")[0].innerHTML = "该要素所有时效"+"("+GDYB.GridProductClass.currentPost.des+")";
                    $("#span_SaveAllElementAllHourSpan")[0].innerHTML = "全部要素所有时效"+"("+GDYB.GridProductClass.currentPost.des+")";
                    $("#div_modal_SaveGrid").modal();
                    $("#div_modal_SaveGrid").find("a").unbind();
                    $("#div_modal_SaveGrid").find("a").click(function () {
                        if (typeof(this.id) != "undefined") {
                            if (this.id == "btn_ok") {
                                var forecaster = $("#forecastor").find("span").html();
                                var issuer = $("#issueror").find("span").html();
                                if ($("#saveCurrentElementCurrentHourspan")[0].checked)
                                    GDYB.GridProductClass.saveGridProduct(t.productType, userName, forecaster, issuer);
                                else if ($("#saveCurrentElementAllHourspan")[0].checked)
                                    GDYB.GridProductClass.saveGridProducts(function(message){
                                        alertModal(message);
                                    }, t.productType, userName, forecaster, issuer, GDYB.GridProductClass.currentElement, t.getHourSpan(GDYB.GridProductClass.currentElement));
                                else if($("#saveCurrentAllElementAllHourspan"[0].checked)){
                                    saveAllElement();
                                }
                            }
                        }
                    });
                }
                else
                    alertModal("请选择值班类型");
            }
            else{
                alertModal("未登录");
            }
        });

        $("#btnHideMap").click(function(){
            var testLayer = GDYB.Page.curPage.map.getLayer("mapCoverLayer");
            if($("#btnHideMap").hasClass("active"))
            {
                $("#btnHideMap").removeClass("active")
//                $("#btnHideMap").html("隐藏周边地图");
                testLayer.removeFeatures([t.polygonVector]);
            }
            else{
                $("#btnHideMap").addClass("active")
//                $("#btnHideMap").html("显示周边地图");
                testLayer.removeFeatures([t.lineVector]);
                testLayer.addFeatures([t.polygonVector]);
                testLayer.addFeatures([t.lineVector]);
            }
        });

        //生成格点报
        $("#btnExportMicaps").click(function(){
            var userName = GDYB.GridProductClass.currentUserName;
            if(userName == null)
            {
                alertModal("未登录");
                return;
            }
            confirmModal("是否生成格点报？",function(){
                var elements = "";
                var doms = $("#div_element").find("button");
                for(var i=0; i<doms.length; i++)
                    elements+=doms[i].id+",";
                if(elements.length > 0){
                    elements = elements.substr(0, elements.length-1);
                    GDYB.GridProductClass.exportToMicaps(null, GDYB.GridProductClass.currentType, elements, GDYB.GridProductClass.currentMakeTime);
                }
            });

        });

        //请求并检查时效
        function checkHourSpan(recall, type, element, datetime){
            var hourspans = t.yubaoshixiaoTools.numbers;
            var btnElement = $("#div_element").find("button.active");
            var element = btnElement.attr("id");
            var elementName = btnElement[0].innerHTML;
            cache(recall, element, elementName, hourspans);
        };

        //填值显隐
        $("#buttonDisplayPlot").click(function(){
            if($("#buttonDisplayPlot").hasClass("active")){
                $("#buttonDisplayPlot").removeClass("active");
                GDYB.GridProductClass.layerFillRangeColor.isShowLabel = false;
            }
            else{
                $("#buttonDisplayPlot").addClass("active");
                GDYB.GridProductClass.layerFillRangeColor.isShowLabel = true;
            }
            GDYB.GridProductClass.layerFillRangeColor.refresh();
        });
        //填色显隐
        $("#buttonDisplayFill").click(function(){
            if($("#buttonDisplayFill").hasClass("disabled"))
                return;
            if(GDYB.GridProductClass.layerFillRangeColor == null || GDYB.GridProductClass.layerFillRangeColor.visibility)
                $("#buttonDisplayFill").removeClass("active");
            else
                $("#buttonDisplayFill").addClass("active");
            GDYB.GridProductClass.layerFillRangeColor.setVisibility(!GDYB.GridProductClass.layerFillRangeColor.visibility);
            if(GDYB.GridProductClass.layerFillRangeColor.visibility && GDYB.GridProductClass.layerFillRangeColor.grid.length == 0) //可见，但无要素，请求一下
                GDYB.GridProductClass.addGrid(null, GDYB.Page.curPage.map);
        });
        //等值线
        $("#buttonDisplayContour").click(function(){
            if($("#buttonDisplayContour").hasClass("disabled"))
                return;
            if(GDYB.GridProductClass.layerContour == null || GDYB.GridProductClass.layerContour.visibility)
                $("#buttonDisplayContour").removeClass("active");
            else
                $("#buttonDisplayContour").addClass("active");
            GDYB.GridProductClass.layerContour.setVisibility(!GDYB.GridProductClass.layerContour.visibility);
            if(GDYB.GridProductClass.layerContour.visibility && GDYB.GridProductClass.layerContour.features.length == 0) //可见，但无要素，请求一下
                GDYB.GridProductClass.addContour(null, GDYB.Page.curPage.map);
        });
        //色斑图
        $("#buttonDisplayIsoSurface").click(function(){
            if($("#buttonDisplayIsoSurface").hasClass("disabled"))
                return;

            if($("#buttonDisplayIsoSurface").hasClass("active")){
                $("#buttonDisplayIsoSurface").removeClass("active");
                GDYB.GridProductClass.layerFillRangeColor.isSmooth = true;
                GDYB.GridProductClass.layerFillRangeColor.refresh();
            }
            else{
                $("#buttonDisplayIsoSurface").addClass("active");
                GDYB.GridProductClass.layerFillRangeColor.isSmooth = false;
                GDYB.GridProductClass.layerFillRangeColor.refresh();
            }
        });

        //国家站显示
        $("#buttonDisplayNationStation").click(function(){
            if($("#buttonDisplayNationStation").hasClass("active")){
                $("#buttonDisplayNationStation").removeClass("active");
                GDYB.GridProductClass.layerPlotNationStation.removeAllFeatures();
                GDYB.GridProductClass.layerPlotNationStation.visibility = false;
            }
            else{
                GDYB.GridProductClass.showStation(function(){
                    if(GDYB.GridProductClass.layerPlotNationStation != null && GDYB.GridProductClass.layerPlotNationStation.visibility && GDYB.GridProductClass.layerPlotNationStation.features.length > 0){
                        $("#buttonDisplayNationStation").addClass("active");
                    }
                }, 1);
            }
        });

        //区域站显示
        $("#buttonDisplayLocalStation").click(function(){
            if($("#buttonDisplayLocalStation").hasClass("active")){
                $("#buttonDisplayLocalStation").removeClass("active");
                GDYB.GridProductClass.layerPlotLocalStation.removeAllFeatures();
                GDYB.GridProductClass.layerPlotLocalStation.visibility = false;
            }
            else{
                GDYB.GridProductClass.showStation(function(){
                    if(GDYB.GridProductClass.layerPlotLocalStation != null && GDYB.GridProductClass.layerPlotLocalStation.visibility && GDYB.GridProductClass.layerPlotLocalStation.features.length > 0){
                        $("#buttonDisplayLocalStation").addClass("active");
                    }
                }, 2);
            }
        });

        //乡镇显示
        $("#buttonDisplayTown").click(function(){
            if($("#buttonDisplayTown").hasClass("active")){
                $("#buttonDisplayTown").removeClass("active");
                GDYB.GridProductClass.layerPlotTown.removeAllFeatures();
                GDYB.GridProductClass.layerPlotTown.visibility = false;
            }
            else{
                GDYB.GridProductClass.showStationForecast(function(){
                    if(GDYB.GridProductClass.layerPlotTown != null && GDYB.GridProductClass.layerPlotTown.visibility && GDYB.GridProductClass.layerPlotTown.features.length > 0){
                        $("#buttonDisplayTown").addClass("active");
                    }
                }, 4);
            }
        });

        //高山站显示
        $("#buttonDisplayHighStation").click(function(){
            if($("#buttonDisplayHighStation").hasClass("active")){
                $("#buttonDisplayHighStation").removeClass("active");
                GDYB.GridProductClass.layerPlotHighStaion.removeAllFeatures();
                GDYB.GridProductClass.layerPlotHighStaion.visibility = false;
            }
            else{
                GDYB.GridProductClass.showStation(function(){
                    if(GDYB.GridProductClass.layerPlotHighStaion != null && GDYB.GridProductClass.layerPlotHighStaion.visibility && GDYB.GridProductClass.layerPlotHighStaion.features.length > 0){
                        $("#buttonDisplayHighStation").addClass("active");
                    }
                }, -1, 2000);
            }
        });

        //海洋站
        $("#buttonDisplaySeaStation").click(function(){
            if($("#buttonDisplaySeaStation").hasClass("active")){
                $("#buttonDisplaySeaStation").removeClass("active");
                GDYB.GridProductClass.layerPlotSeaStaion.removeAllFeatures();
                GDYB.GridProductClass.layerPlotSeaStaion.visibility = false;
                GDYB.GridProductClass.layerSeaLanes.removeAllFeatures();
                GDYB.GridProductClass.layerSeaLanes.visibility = false;
            }
            else{
                GDYB.GridProductClass.showStationForecast(function(){
                    if(GDYB.GridProductClass.layerPlotSeaStaion != null && GDYB.GridProductClass.layerPlotSeaStaion.visibility && GDYB.GridProductClass.layerPlotSeaStaion.features.length > 0){
                        $("#buttonDisplaySeaStation").addClass("active");
                    }
                }, 5);
                GDYB.GridProductClass.showSeaLanes();
            }
        });

        //添加关注区域，一次添加一个
        $("#buttonAddFocus").click(function(){
            GDYB.GridProductClass.layerFocusArea.visibility = true;
            $("#buttonDisplayFocus").addClass("active");
            openFocusArea();

            GDYB.GridProductClass.drawFocusArea.activate();
            GDYB.GridProductClass.drawLuoqu.deactivate();     //关闭绘制落区
            GDYB.GridProductClass.drawFreePath.deactivate();  //关闭风向订正
            stopDragMap();
            alertModal("请在地图上绘制关注区域");


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
        });

        //显示关注区域
        $("#buttonDisplayFocus").click(function(){
            if($("#buttonDisplayFocus").hasClass("active"))
            {
                GDYB.GridProductClass.layerFocusArea.removeAllFeatures();
                $(this).removeClass("active");
                GDYB.GridProductClass.layerFocusArea.visibility = false;
            }
            else
            {
                openFocusArea();
            }
        });

        function openFocusArea(){
            GDYB.GridProductClass.layerFocusArea.visibility = true;
            GDYB.GridProductClass.showFocusArea(function(){
                if(GDYB.GridProductClass.layerFocusArea != null && GDYB.GridProductClass.layerFocusArea.visibility && GDYB.GridProductClass.layerFocusArea.features.length > 0){
                    $("#buttonDisplayFocus").addClass("active");
                }
            });
        }

        //初始化默认值
        //$("#ec").addClass("active");
        $("#prvn").addClass("active");
        $("#r12").addClass("active");

        $("#selectYuBaoYuan").html("");
        $("#selectQianFaRen").html("");
        var userName = GDYB.GridProductClass.currentUserName;
        if (userName == null){
            alertModal("请注意，您尚未登录！");
        }
        else
        {
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
                            $("#forecastor").find("span").html($(this).html());
                            $("#selectYuBaoYuan").find("div").css("background-color","");
                            $("#selectYuBaoYuan").find("div").css("color","");
                            $(this).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                        });
                        $("#forecastor").find("span").html($("#selectYuBaoYuan").find("div").eq(0).html());
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
                            $("#issueor").find("span").html($(this).html());
                            $("#selectQianFaRen").find("div").css("background-color","");
                            $("#selectQianFaRen").find("div").css("color","");
                            $(this).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                        });
                        $("#issueor").find("span").html($("#selectQianFaRen").find("div").eq(0).html());
                        $("#selectQianFaRen").find("div").eq(0).css("background-color","rgb(116,173,213)").css("color","#ffffff");
                    }
                }
            });
        }

        $("#buttonDisplayPlot").addClass("disabled");
        $("#buttonDisplayFill").addClass("disabled");
        $("#buttonDisplayContour").addClass("disabled");
        $("#buttonDisplayIsoSurface").addClass("disabled");

        $(".datetimepicker").css({
            "margin-top":"0px"
        });

        //点击上翻
        t.myDateSelecter.leftBtn.click(function(){
            onChangeDateTime();
        });

        //点击下翻
        t.myDateSelecter.rightBtn.click(function(){
            onChangeDateTime();
        });

        //点击时次
        this.myDateSelecter.input.change(function(){
            onChangeDateTime();
        });

        regesterYuBaoShiXiaoEvent();

        //注册时效点击事件
        function regesterYuBaoShiXiaoEvent(){
            $("#yubaoshixiao").find("td").click(function () {
                if(typeof(this.id) != "undefined" && this.id != "")
                    if(GDYB.GridProductClass.currentPost == null) //只适用于格点预报，不适用于数值模式，所以写在GDYBPageClass中判断
                        return;
                t.displayGridProduct();
            });

            //屏蔽预报时效右键菜单，增加自定义菜单
            var divtable = document.getElementById ('yubaoshixiao');
            var tds = $(divtable).find("td");
            for(var key in tds){
                var td = tds[key];
                td.oncontextmenu = function (event)
                {
                    if(this.localName == "td"){
                        hourspanHover = this.innerHTML;
                        $("#divContextMenu").css("display", "block");
                        $("#divContextMenu").css("top", event.pageY+"px");
                        $("#divContextMenu").css("left", event.pageX+"px");
                    }
                    return false;
                };
            }
        };

        function onChangeDateTime(){
            setForecastTime();
            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            regesterYuBaoShiXiaoEvent(); //由于createDom重构了页面，需要重新注册事件，否则无法响应事件

            if(GDYB.GridProductClass.currentPost == null) //只适用于格点预报，不适用于数值模式，所以写在GDYBPageClass中判断
                return;

//            //下载全部要素
//            GDYB.GridProductClass.dataCache = null; //销毁内存，否则崩溃
//            GDYB.GridProductClass.datasetGridInfos = [];
//            downAllElement(function(){
//                {
//                    if(GDYB.GridProductClass.currentType == "prvn") {
//                        if($("#selectMakeTime").val() == 16){
//                            callLast(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#" + element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function () {
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else{
//                            //打开第一个要素
//                            var btnElementActive = $("#div_element").find("button.active");
//                            var element = "r12";
//                            if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                element = btnElementActive.attr("id");
//                            $("#div_element").find("button.active").removeClass("active");
//                            $("#div_element").find("#" + element).addClass("active");
//
//                            GDYB.GridProductClass.getGridInfo(function () {
//                                checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                        }
//                    }
//                    else
//                    {
//                        if($("#selectMakeTime").val() == 5 || $("#selectMakeTime").val() == 16){
//                            callPRVN(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#"+element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function(){
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else if($("#selectMakeTime").val() == 10){
//                            callLast(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#"+element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function(){
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else{
//                            //打开第一个要素
//                            var btnElementActive = $("#div_element").find("button.active");
//                            var element = "r12";
//                            if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                element = btnElementActive.attr("id");
//                            $("#div_element").find("button.active").removeClass("active");
//                            $("#div_element").find("#"+element).addClass("active");
//
//                            GDYB.GridProductClass.getGridInfo(function(){
//                                checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                        }
//                    }
//                }
//            });
        };

        //点击制作时间
        $("#makeTimeDiv").find("div").click(function(){
            $("#selectMakeTime").html($(this).html()).attr("value",$(this).attr("value"));
            var datetime = t.myDateSelecter.getCurrentTimeReal();
            var makeTimeHour = $("#selectMakeTime").attr("value");

            setForecastTime(datetime, makeTimeHour);
            t.yubaoshixiaoTools.createDom(t.myDateSelecter.getCurrentTimeReal());
            regesterYuBaoShiXiaoEvent(); //由于createDom重构了页面，需要重新注册事件，否则无法响应事件
            GDYB.GridProductClass.dataCache.initInfos();
            if(GDYB.GridProductClass.currentPost == null) //只适用于格点预报，不适用于数值模式，所以写在GDYBPageClass中判断
                return;

//            //下载全部要素
//            GDYB.GridProductClass.dataCache = null; //销毁内存，否则崩溃
//            GDYB.GridProductClass.datasetGridInfos = [];
//            downAllElement(function(){
//                {
//                    if(GDYB.GridProductClass.currentType == "prvn") {
//                        if($("#selectMakeTime").val() == 16){
//                            callLast(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#" + element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function () {
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else{
//                            //打开第一个要素
//                            var btnElementActive = $("#div_element").find("button.active");
//                            var element = "r12";
//                            if (typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                element = btnElementActive.attr("id");
//                            $("#div_element").find("button.active").removeClass("active");
//                            $("#div_element").find("#" + element).addClass("active");
//
//                            GDYB.GridProductClass.getGridInfo(function () {
//                                checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            }, GDYB.GridProductClass.currentUserDepart.departCode, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                        }
//                    }
//                    else
//                    {
//                        if($("#selectMakeTime").val() == 5 || $("#selectMakeTime").val() == 16){
//                            callPRVN(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#"+element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function(){
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else if($("#selectMakeTime").val() == 10){
//                            callLast(function(){
//                                //打开第一个要素
//                                var btnElementActive = $("#div_element").find("button.active");
//                                var element = "r12";
//                                if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                    element = btnElementActive.attr("id");
//                                $("#div_element").find("button.active").removeClass("active");
//                                $("#div_element").find("#"+element).addClass("active");
//
//                                GDYB.GridProductClass.getGridInfo(function(){
//                                    checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                                }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            });
//                        }
//                        else{
//                            //打开第一个要素
//                            var btnElementActive = $("#div_element").find("button.active");
//                            var element = "r12";
//                            if(typeof(btnElementActive) != "undefined" && btnElementActive != null)
//                                element = btnElementActive.attr("id");
//                            $("#div_element").find("button.active").removeClass("active");
//                            $("#div_element").find("#"+element).addClass("active");
//
//                            GDYB.GridProductClass.getGridInfo(function(){
//                                checkHourSpan(t.displayGridProduct, t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                            }, GDYB.GridProductClass.currentUserDepart.departCode ,t.productType, element, t.myDateSelecter.getCurrentTime(false));
//                        }
//                    }
//                }
//            });
        });

        //根据制作时间，设置预报时间
        function setForecastTime(datetime, makeTimeHour){
            if(typeof(datetime) == "undefined")
                datetime = t.myDateSelecter.getCurrentTimeReal();
            if(typeof(makeTimeHour) == "undefined")
                makeTimeHour = $("#selectMakeTime").attr("value");
            if(GDYB.GridProductClass.currentType == "prvn"){
                if(makeTimeHour == 5)
                    datetime.setHours(8);
                else
                    datetime.setHours(20);
            }
            else if(GDYB.GridProductClass.currentType == "cty" || GDYB.GridProductClass.currentType == "cnty"){
                if(makeTimeHour == 5 || makeTimeHour == 10)
                    datetime.setHours(8);
                else
                    datetime.setHours(20);
            }
            t.myDateSelecter.setCurrentTime(datetime.format("yyyy-MM-dd hh:mm:ss"));

            datetime.setHours(makeTimeHour);
            GDYB.GridProductClass.currentMakeTime = datetime.format("yyyy-MM-dd hh:mm:ss");
            GDYB.GridProductClass.currentDateTime = t.myDateSelecter.getCurrentTime(false);
        }

        //GridProductClass初始化
        GDYB.GridProductClass.init(function(){

            if(GDYB.GridProductClass.currentType == "prvn")
            {
                $("#div_Port").css("display", "block");
                $("#div_YuBaoYuan").css("display", "block");
                //$("#div_YuBaoYuan").css("float", "none");
                $("#div_QianFaRen").css("display", "none");
            }
            else
            {
                GDYB.GridProductClass.currentPost = {min:0, max:240, des:"全部", name:"首席岗" }; //左开右闭，市台默认就是首席岗，直接审核，并且制作全部时效数据
                GDYB.GridProductClass.currentVersion = "p";
                $("#div_Port").css("display", "none");
//                $("#div_YuBaoYuan").css("margin-left", "40px");
                $("#div_QianFaRen").css("display", "block");
            }

            //初始化制作时间和预报时间
            var dateNow = new Date();
			dateNow.setMinutes(0);
            dateNow.setSeconds(0);
//            if(GDYB.GridProductClass.currentMakeTime != null){
//                var curTimeStr = GDYB.GridProductClass.currentMakeTime;
//                var year = parseInt(curTimeStr.replace(/(\d*)-\d*-\d* \d*:\d*:\d*/,"$1"));
//                var month = parseInt(curTimeStr.replace(/\d*-(\d*)-\d* \d*:\d*:\d*/,"$1"));
//                var day = parseInt(curTimeStr.replace(/\d*-\d*-(\d*) \d*:\d*:\d*/,"$1"));
//                var hour = parseInt(curTimeStr.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1"));
//                var minutes = 0;
//                var seconds = 0;
//                dateNow.setFullYear(year,month - 1,day);
//                dateNow.setHours(hour, minutes, seconds, 0);
//                if(GDYB.GridProductClass.currentPost != null)
//                    $("#selectPort").val(GDYB.GridProductClass.currentPost.des);
//            }
            if(dateNow.getHours()<=5){
                $("#selectMakeTime").attr("value","5");
                $("#selectMakeTime").html("05时");
            }
            /*else if(dateNow.getHours() <= 10){
                $("#selectMakeTime").attr("value","10");
                $("#selectMakeTime").html("10时");
            }*/
            else{
                $("#selectMakeTime").attr("value","16");
                $("#selectMakeTime").html("16时");
            }

            var makeTimeHour = $("#selectMakeTime").attr("value");
            setForecastTime(dateNow, makeTimeHour);

            if(GDYB.GridProductClass.currentType == "prvn" && GDYB.GridProductClass.currentPost == null)
                alertModal("请选择值班类型");

            if(GDYB.GridProductClass.currentType == "prvn") {
                if(GDYB.GridProductClass.currentPost != null){ //第二次切换到该页面，打开显示上次的数据
                    var element = GDYB.GridProductClass.currentElement;
                    $("#div_element").find("button.active").removeClass("active");
                    $("#div_element").find("#"+element).addClass("active");
                    openElement(element, null);
                }
            }
            else{
//                //下载全部要素
//                downAllElement(function () {
//                    if($("#selectMakeTime").val() == 5 || $("#selectMakeTime").val() == 16){
//                        callPRVN(function(){
//                            //打开第一个要素或上次选择的要素
//                            var element = GDYB.GridProductClass.currentElement==null?"r12":GDYB.GridProductClass.currentElement;
//                            $("#div_element").find("button.active").removeClass("active");
//                            $("#div_element").find("#"+element).addClass("active");
//                            openElement(element, null);
//                        });
//                    }
//                    else{
//                        //打开第一个要素或上次选择的要素
//                        var element = GDYB.GridProductClass.currentElement==null?"r12":GDYB.GridProductClass.currentElement;
//                        $("#div_element").find("button.active").removeClass("active");
//                        $("#div_element").find("#"+element).addClass("active");
//                        openElement(element, null);
//                    }
//                });
            }
        });
    };

    /*
     * 如果格点产品存在，则直接打开；
     * 如果格点产品没有，点击调入模式才能打开
     * 外部需要调用（SideWrapper.js）
     * */
    this.displayGridProduct = function(fromModel)
    {
        //var btnModel = $("#div_model").find("button.active");
        //var btnType = $("#div_type").find("button.active");
        var btnElement = $("#div_element").find("button.active");
        //var model = btnModel.attr("id");
        var type = t.productType;//btnType.attr("id");
        var element = btnElement.attr("id");
        var elementName = btnElement[0].innerHTML;
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var version = GDYB.GridProductClass.currentVersion;
        var datetime = t.myDateSelecter.getCurrentTime(false);
        var hourSpan = t.yubaoshixiaoTools.hourSpan;
        var level = 1000;
        if(type == null || element == null || hourSpan == null)
            return;

        if(GDYB.GridProductClass.dataCache == null) //未下载（缓存），不允许显示和编辑
            return;

        if(GDYB.GridProductClass.datasetGridInfos == null && GDYB.GridProductClass.datasetGridInfos.length > 0)
            GDYB.GridProductClass.getGridInfo(null, type, element, datetime);

        //获取上一次效
        var hourspan = t.yubaoshixiaoTools.hourSpan;
        var i=0;
        for(i; i<t.yubaoshixiaoTools.numbers.length; i++){
            if(t.yubaoshixiaoTools.numbers[i] == hourspan)
                break;
        }
        var hourspanLast = 0;
        if(i>0)
            hourspanLast = t.yubaoshixiaoTools.numbers[i-1];

        $("#buttonDisplayPlot").addClass("disabled");
        $("#buttonDisplayFill").addClass("disabled");
        $("#buttonDisplayContour").addClass("disabled");
        $("#buttonDisplayIsoSurface ").addClass("disabled");
        GDYB.GridProductClass.displayGridProduct(function(){

            //显示等值线
            if (GDYB.GridProductClass.layerContour.visibility) {
                GDYB.GridProductClass.addContour(function () {
                    if (GDYB.GridProductClass.layerContour.visibility) {
                        if (GDYB.GridProductClass.layerContour.features.length == 0) {
                            $("#buttonDisplayContour").removeClass("active");
                            $("#buttonDisplayContour").addClass("disabled");
                        }
                        else {
                            $("#buttonDisplayContour").removeClass("disabled");
                            $("#buttonDisplayContour").addClass("active");
                        }
                    }
                    else {
                        $("#buttonDisplayContour").removeClass("disabled");
                    }
                }, GDYB.Page.curPage.map);
            }
            else {
                $("#buttonDisplayContour").removeClass("disabled");
            }

            if(GDYB.GridProductClass.layerFillRangeColor.visibility)
            {
                if(GDYB.GridProductClass.layerFillRangeColor.grid != null &&
                    GDYB.GridProductClass.layerFillRangeColor.grid.length == 0)
                {
                    $("#buttonDisplayPlot").removeClass("active");
                    $("#buttonDisplayPlot").addClass("disabled");
                    $("#buttonDisplayFill").removeClass("active");
                    $("#buttonDisplayFill").addClass("disabled");
                }
                else
                {
                    $("#buttonDisplayPlot").removeClass("disabled");
                    $("#buttonDisplayPlot").addClass("active");
                    $("#buttonDisplayFill").removeClass("disabled");
                    $("#buttonDisplayFill").addClass("active");
                }
            }
            else
            {
                $("#buttonDisplayPlot").removeClass("disabled");
                $("#buttonDisplayFill").removeClass("disabled");
            }

            if(GDYB.GridProductClass.layerFillRangeColor != null){
                if(GDYB.GridProductClass.layerFillRangeColor.visibility){
                    if (GDYB.GridProductClass.layerFillRangeColor.datasetGrid == null || GDYB.GridProductClass.layerFillRangeColor.datasetGrid.grid == null) {
                        $("#buttonDisplayIsoSurface").removeClass("active");
                        $("#buttonDisplayIsoSurface").addClass("disabled");
                    }
                    else {
                        if(GDYB.GridProductClass.layerFillRangeColor.isSmooth){
                            $("#buttonDisplayIsoSurface").removeClass("disabled");
                            $("#buttonDisplayIsoSurface").removeClass("active");
                        }
                        else {
                            $("#buttonDisplayIsoSurface").removeClass("disabled");
                            $("#buttonDisplayIsoSurface").addClass("active");
                        }
                    }
                }
                else{
                    $("#buttonDisplayIsoSurface").removeClass("disabled");
                }
            }
        }, type, level, element, maketime, version, datetime, hourspan, fromModel, elementName, hourspanLast);
    }

    this.bindBtnEvents = function(){
        var t = this;
        //创建可拖拽面板
        $("#fx").click(function(){
            if(!t.myPanel_FXDZ){
                t.myPanel_FXDZ = new Panel_FXDZ($("#map_div"));
            }
            else{
                t.myPanel_FXDZ.show();
            }
        });
        $("#qs").click(function(){
            if(!t.myPanel_QSDZ){
                t.myPanel_QSDZ = new Panel_QSDZ($("#map_div"));
            }
            else{
                t.myPanel_QSDZ.show();
            }
            //t.myPanel_QSDZ.initChart();
        });
        $("#qh").click(function(){
            if(!t.myPanel_QHDZ){
                t.myPanel_QHDZ = new Panel_QHDZ($("#map_div"));
            }
            else{
                t.myPanel_QHDZ.show();
            }
        });
        $("#lq").click(function(){
            if(!t.myPanel_LQDZ){
                t.myPanel_LQDZ = new Panel_LQDZ($("#map_div"));
            }
            else{
                t.myPanel_LQDZ.show();
            }
        });
    };

    //更新时效状态
    this.updateHourSpanStatus = function(){
        var hourspans = t.yubaoshixiaoTools.numbers;
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var date = t.myDateSelecter.getCurrentTime(false);
        var version = GDYB.GridProductClass.currentVersion;
        var btnElement = $("#div_element").find("button.active");
        var element = btnElement.attr("id");

        var bContain = false;
        var dataCaches = GDYB.GridProductClass.dataCache.getData(maketime, version, date, element);
        if(dataCaches != null){
            for(var i=0; i<hourspans.length; i++){
                var hourspan = hourspans[i];
                var dataCache = dataCaches[hourspan];
                if(dataCache == null || dataCache.data == null || dataCache.status == -1) { //无数据
                    $("#yubaoshixiao").find("#" + hourspan + "h").addClass("disabled");
                }
                else{
                    $("#yubaoshixiao").find("#" + hourspan + "h").removeClass("disabled");

                    if(dataCache.status == 1){ //已修改
                        $("#yubaoshixiao").find("#"+hourspan+"h").addClass("modified");
                        $("#yubaoshixiao").find("#" + hourspan + "h").removeClass("disabled"); //如果复制过来，可能从无到有
                    }
                    else if(dataCache.status == 2){ //已提交
                        $("#yubaoshixiao").find("#"+hourspan+"h").addClass("saved");
                    }
                    else if(dataCache.status == 4){ //已（提交并）主观订正
                        $("#yubaoshixiao").find("#"+hourspan+"h").addClass("subjective");
                    }
                }
                if(hourspan == t.yubaoshixiaoTools.hourSpan)
                    bContain = true;
            }
        }
        if(!bContain)
        {
            t.yubaoshixiaoTools.hourSpan = hourspans[0];
        }
        $("#yubaoshixiao").find("#"+t.yubaoshixiaoTools.hourSpan+"h").addClass("active");
    };

    //更新要素按钮（提交）状态：下载和提交时更新
    this.updateElementStatus = function(){
        var t = this;
        var btns = $("#div_element").find("button");
        //var element = btnElement.attr("id");
        for(var i=0;i<$(btns).length;i++){
            var btn =  btns[i];
            var element = $(btn).attr("id");
            //获取产品状态（判断是否已提交）
            try {
                var type = GDYB.GridProductClass.currentType;
                var maketime = GDYB.GridProductClass.currentMakeTime;
                var version = GDYB.GridProductClass.currentVersion;
                var datetime = GDYB.GridProductClass.currentDateTime;
                var hourSpans = t.getHourSpan(element);
                var saved = true;
                var dataCaches = GDYB.GridProductClass.dataCache.getData(maketime, version, datetime, element);
                if(dataCaches != null){
                    for (var j = 0; j < hourSpans.length; j++) {
                        var hourSpan = hourSpans[j];
                        if(GDYB.GridProductClass.currentPost.min <=hourSpan && hourSpan<=GDYB.GridProductClass.currentPost.max){
                            var gridinfo = GDYB.GridProductClass.getGridInfoFromCache(type, element, datetime, hourSpan);
                            var dataCache = dataCaches[hourSpan];
                            if(gridinfo == null || typeof(gridinfo.userName) == "undefined" || gridinfo.userName == "" || dataCache == null || dataCache.data == null){
                                saved = false;
                                break;
                            }
                        }
                    }
                    $(btn).removeClass("saved");
                    if (saved)
                        $(btn).addClass("saved");
                }
            }
            catch(err)
            {
                alert(err.message);
            }
        }
    };

    /*
     * 调入数值模式（该要素所有时效）
     * */
    this.callModels = function(modelType, maketime, version){
        var btnElement = $("#div_element").find("button.active");
        var element = btnElement.attr("id");
        var elementName = btnElement[0].innerHTML;
        var hourspans = t.getHourSpan(element);
        var level = 1000;
        var type = t.productType;
        var datetime = GDYB.GridProductClass.currentDateTime;
        var recalls = [];
        recalls.push(this.updateHourSpanStatus);
        recalls.push(this.displayGridProduct);
        GDYB.GridProductClass.callModels(recalls, type, maketime, version, datetime, element, elementName, level, hourspans, modelType);
    };

    /*
    * 调入数值模式（全部要素所有时效）
    * modelType：模式类型
    * defaultSchemes：初始场缺省方案（如果defaultSchemes有值，以它为准）
    * */
    this.callModelsAll = function(modelType, defaultSchemes, maketime, version){
        var elements = [];
        var elementNames = [];
        var buttons = $("#div_element").find("button");
        for(var key in buttons){
            if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
            {
                elements.push(buttons[key].id);
                elementNames.push(buttons[key].innerHTML);
            }
        }

        //递归请求
        var nIndex = -1;
        callModels();
        function callModels(){
            nIndex++;
            if(nIndex >= elements.length)
            {
                return;
            }
            var element = elements[nIndex];
            var elementName = elementNames[nIndex];
            var hourspans = t.getHourSpan(element);
            var datetime = GDYB.GridProductClass.currentDateTime;
            var level = 1000;
            var type = t.productType;
            var recalls = [];
            recalls.push(callModels);

            //匹配要素-模式方案
            if(typeof(defaultSchemes) != "undefined" && defaultSchemes != null && defaultSchemes.length > 0){
                var makeTime = GDYB.GridProductClass.currentMakeTime.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1")+":"+GDYB.GridProductClass.currentMakeTime.replace(/\d*-\d*-\d* \d*:(\d*):\d*/,"$1");
                for(var key in defaultSchemes){
                    var scheme = defaultSchemes[key];
                    if(scheme.type == GDYB.GridProductClass.currentType && scheme.makeTime == makeTime && scheme.element == GDYB.GridProductClass.currentElement){
                        modelType = scheme.model;
                        break;
                    }
                }
            }

            GDYB.GridProductClass.callModels(recalls, type, maketime, version, datetime, element, elementName, level, hourspans, modelType);
        }
    };

    this.getHourSpan = function(element){
        var hourspans = null;
        if(element == "r12" || element == "w" || element == "air" || element == "wmax"){
            hourspans = [12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240];
        }
        else if(element == "tmax" || element == "tmin"){
            hourspans = [24,48,72,96,120,144,168,192,216,240];
        }
        else{
            hourspans = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240];
        }
        return hourspans;
    };
}

GDYBPageClass.prototype = new PageBase();
