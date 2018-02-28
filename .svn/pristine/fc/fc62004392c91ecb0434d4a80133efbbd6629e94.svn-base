/**
 * SideWrapper.js 左侧竖条响应代码
 * Created by zouwei on 2015-10-3.
 */
function SideWrapper(){
    this.activeButton = "";
    var t = this;

    //设置当前按钮，设置模式来源及模式时间
    this.setActive = function(activeButton, nwpModelTime){
        t.activeButton = activeButton;
        if(typeof(activeButton) == "undefined" || activeButton == "" || activeButton == "undefined")
            $("#nav_bg_slider").css("display","none");
        else{
            var btn = $("#"+t.activeButton)[0];
            if(typeof(btn) != "undefined") {
                $("#nav_bg_slider").css("top", btn.offsetTop);
                $("#nav_bg_slider").css("display", "block");
                $("#" + activeButton).attr("title", nwpModelTime);
            }
        }
    };

    //注册事件
    this.register = function(){
        $("#sideWrapper").find("li").click(function(){
            $("#dmapTools .qxfxTools").css("display","none");
            if(this.id == "menu_weather" || this.activeButton == this.id)
                return;
            if(this.id == "InitialField"){
                $("#div_modal_content").html("是否重新调入初始场");
                $("#div_modal").modal();
                $("#div_modal").find("a").unbind();
                $("#div_modal").find("a").click(function(){
                    if(typeof(this.id) != "undefined"){
                        if(this.id == "btn_ok")
                        {
                            var url=gridServiceUrl+"services/GridService/getGridDefaultSchemes";
                            $.ajax({
                                data:{"para":"{}"},
                                url:url,
                                dataType:"json",
                                success:function(data){
                                    var defaultSchemes = data;
                                    var modelType = null;
                                    if($("#inputCurrentElementCurrentHourspan")[0].checked) {
                                        modelType = getModelByElement();
                                        if(modelType == null)
                                            alertModal("初始场默认方案中没有该要素的配置");
                                        else
                                            GDYB.GridProductClass.callModel(modelType, GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion);
                                    }
                                    else if($("#inputCurrentElementAllHourspan")[0].checked)
                                    {
                                        modelType = getModelByElement();
                                        if(modelType == null)
                                            alertModal("初始场默认方案中没有该要素的配置");
                                        else
                                            GDYB.GDYBPage.callModels(modelType, GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion);
                                    }
                                    else if($("#inputAllElementAllHourspan")[0].checked)
                                        GDYB.GDYBPage.callModelsAll(modelType, defaultSchemes, GDYB.GridProductClass.currentMakeTime, GDYB.GridProductClass.currentVersion);

                                    //匹配要素-模式方案
                                    function getModelByElement(){
                                        var modelType = null;
                                        if(typeof(defaultSchemes) != "undefined" && defaultSchemes.length > 0){
                                            var makeTime = GDYB.GridProductClass.currentMakeTime.replace(/\d*-\d*-\d* (\d*):\d*:\d*/,"$1")+":"+GDYB.GridProductClass.currentMakeTime.replace(/\d*-\d*-\d* \d*:(\d*):\d*/,"$1");
                                            for(var key in defaultSchemes){
                                                var scheme = defaultSchemes[key];
                                                if(scheme.type == GDYB.GridProductClass.currentType && scheme.makeTime == makeTime && scheme.element == GDYB.GridProductClass.currentElement){
                                                    modelType = scheme.model;
                                                    break;
                                                }
                                            }
                                        }
                                        return modelType;
                                    }
                                },
                                error: function (e) {
                                    alertModal("获取初始场默认方案错误");
                                },
                                type:"POST"
                            });
                        }
                    }
                });
            }
//            else if(this.id == "last") //调入上一期预报，与调入数值模式不同的是：服务端在处理时必须要早于当前预报时间，因为格点产品会提前生成，而模式不会
//            {
//                var typeModel = GDYB.GridProductClass.currentType;
//                var element = GDYB.GridProductClass.currentElement;
//                var forecastTime = GDYB.GridProductClass.currentDateTime;
//                var url=gridServiceUrl+"services/GridService/getGridProductLastDate";
//                $.ajax({
//                    data:{"para":"{element:'"+ element + "',type:'" + typeModel + "',forecastTime:'" + forecastTime + "'}"},
//                    url:url,
//                    dataType:"text",
//                    success:function(data){
//                        if(data == ""){
//                            alert("没有找到上一期");
//                            return;
//                        }
//                        $("#div_modal_content").html("是否调入上一期预报（" + data + "）");
//                        $("#div_modal").modal();
//                        $("#div_modal").find("a").unbind();
//                        $("#div_modal").find("a").click(function(){
//                            if(typeof(this.id) != "undefined"){
//                                if(this.id == "btn_ok")
//                                {
//                                    if($("#inputCurrentElementCurrentHourspan")[0].checked)
//                                        GDYB.GridProductClass.callModel(typeModel);
//                                    else if($("#inputCurrentElementAllHourspan")[0].checked)
//                                        GDYB.GDYBPage.callModels(typeModel);
//                                    else if($("#inputAllElementAllHourspan")[0].checked)
//                                        GDYB.GDYBPage.callModelsAll(typeModel);
//                                }
//                            }
//                        });
//                    },
//                    error: function (e) {
//                        alert("没有找到上一期");
//                    },
//                    type:"POST"
//                });
//            }
            else if(this.id == "prvn" || this.id == "cty") //调入格点产品，与调入模式不同的是，格点产品制作时间与预报时间不同
            {
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
                        $("#div_modal_content").html("是否调入"+(id == "prvn"?"区台指导":"市台订正")+"预报：" + data);
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
            else if(this.id == "ec" || this.id == "gp" || this.id == "japan" || this.id == "t639" || this.id == "bj") //调入模式
            {
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

            else if(this.id=="zdybsz"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZDYBSZPageClass;
                GDYB.ZDYBSZPageClass.active();
            }

            else if(this.id=="qygl"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.XTGLPage;
                GDYB.XTGLPage.active();
            }
            else if(this.id == "zddr"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZDGLPage;
                GDYB.ZDGLPage.active();
            }
            else if(this.id=="zdyb"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZDYBPage;
                GDYB.ZDYBPage.active();
            }
            else if(this.id=="gdzs"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.GDZSPage;
                GDYB.GDZSPage.active();
                //window.open(host+":8080/gsgdyb/display.html");
            }
            else if(this.id == "qdl_sk"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLSKPage;
                GDYB.QDLSKPage.active();
            }
            else if(this.id == "qdl_ld"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLLDPage;
                GDYB.QDLLDPage.active();
            }
            else if(this.id == "qdl_yt"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLYTPage;
                GDYB.QDLYTPage.active();
            }

            else if(this.id == "menu_tqsk"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZHJCSKPage;
                GDYB.ZHJCSKPage.active();
            }
            else if(this.id == "menu_ld"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZHJCLDPage;
                GDYB.ZHJCLDPage.active();
            }
            else if(this.id == "menu_yt"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.ZHJCYTPage;
                GDYB.ZHJCYTPage.active();
            }

            else if(this.id == "qdl_rhjc"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLRHJCPage;
                GDYB.QDLRHJCPage.active();
            }
            else if(this.id == "qdl_ljyb"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLLJYBPage;
                GDYB.QDLLJYBPage.active();
            }
            else if(this.id == "qdl_qsyb"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLQSYBPage;
                GDYB.QDLQSYBPage.active();
            }
            else if(this.id == "qdl_gnmx"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLGNMXPage;
                GDYB.QDLGNMXPage.active();
            }
            else if(this.id == "gdjy"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.GDJYPage;
                GDYB.GDJYPage.active();
            }
            else if(this.id == "qdl_yjxh"){
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.YJXHPage;
                GDYB.YJXHPage.active();
            }
            else if(this.id == "qdl_qxfx"){
                $("#dmapTools .qxfxTools").css("display","block");
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                GDYB.Page.curPage = GDYB.QDLQXFXPage;
                GDYB.QDLQXFXPage.active();
            }
            else //数据浏览
            {
                $("#"+t.activeButton).removeClass("active");
                $(this).addClass("active");
                t.activeButton = this.id;
                if(t.activeButton == "menu_skzl")
                {
                    GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                    GDYB.Page.curPage = GDYB.SKZLPage;
                    GDYB.SKZLPage.active();
                }
                else if(t.activeButton == "menu_wxld")
                {
                    GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                    GDYB.Page.curPage = GDYB.WXLDPage;
                    GDYB.WXLDPage.active();
                }
                else if(t.activeButton == "menu_szms")
                {
                    GDYB.Page.curPage&&GDYB.Page.curPage.destroy();
                    GDYB.Page.curPage = GDYB.SZMSPage;
                    GDYB.SZMSPage.active();
                }
            }
        });

        $("#sideWrapper").find("li").hover(function(){
            if(this.id == "menu_weather")
                return;
            $("#nav_bg_slider").css("display","block");
            $("#nav_bg_slider").css("top", this.offsetTop);
        });

        $("#sideWrapper").mouseleave(function(){
            if(t.activeButton == "")
                $("#nav_bg_slider").css("display","none");
            else
                $("#nav_bg_slider").css("top", $("#"+t.activeButton)[0].offsetTop);
        });
    };
}