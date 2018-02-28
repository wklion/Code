/*
* 实况资料页面
* by zouwei, 2015-05-10
* */
function SKZLPageClass(){
    this.myDateSelecter = null;

    //渲染左侧菜单区域里的按钮
    this.renderMenu = function(){
        var htmlStr = "<div id='div_type' class=''><div class='title1'>要素</div>"
            +"<div id='div_Station'>"
            +"<div class='title2'>自动站</div>"
            +"<div class='btn_line'><button  id='rain_1h'>1小时雨量</button><button  id='rain_3h'>3小时雨量</button><button  id='rain_6h'>6小时雨量</button></div>"
            +"<div class='btn_line'><button  id='rain_12h'>12小时雨量</button><button  id='rain_24h'>24小时雨量</button><button  id='rain_08hToNow'>08到当前雨量</button></div>"
            +"<div class='btn_line'><button  id='rain_20hToNow'>20到当前雨量</button><button  id='maxTemp_20hToNow'>20到当前高温</button><button  id='minTemp_20hToNow'>20到当前低温</button></div>"
            +"<div class='btn_line'><button  id='temp_1h'>1小时高温</button><button  id='maxTemp_24h'>24小时高温</button><button  id='minTemp_24h'>24小时低温</button></div>"
            +"<div class='btn_line'><button  id='maxWS_1h'>小时极大风速</button><button  id='rh_1h'>小时相对湿度</button><button  id='vis_1h'>1小时能见度</button></div>"
            +"<div class='btn_line'><button  id='splash'>闪电分布</button></div>"
            +"</div>"
            +"<div id='div_WeatherMap'>"
            +"<div class='title2'>天气图</div>"
            +"<div class='btn_line2'><button  id='surface_plot' data='surface_plot,surface_p0'>地面天气图</button><button  id='high_plot' data='high_plot,high_height'>高空天气图</button></div></div>"
            +"<div id='div_Physic'>"
            +"<div class='title2'>物理量</div>"
            +"<div class='btn_line'><button id='physic_ki'>K指数</button><button id='physic_li'>抬升指数</button><button id='physic_si'>沙氏指数</button></div>"
            +"<div class='btn_line'><button id='physic_cape'>CAPE</button><button id='physic_vor'>涡度</button><button id='physic_div'>散度</button></div></div>"
            +"</div>"
            +"<div id='div_type' class=''><div class='title1'>层次</div>"
            +"<div class='btn_line1'><button>1000</button><button>925</button><button>850</button></div>"
            +"<div class='btn_line1'><button>700</button><button>500</button><button>200</button></div></div>"
            +"<div id='div_datetime'>"
            +"<div class='title1'>时间</div>"
            +"<div id='dateSelect'></div></div>"
            +"<div id='div_display' class=''><div class='title1'>显示</div>"
            +"<div class='btn_line1'><button id='buttonDisplayPlot' style='outline:none;margin:2px;'>填值</button><button id='buttonDisplayFill' style='outline:none;margin:2px;'>填色</button><button id='buttonDisplayContour' style='outline:none; margin:2px;'>等值线</button><button id='buttonDisplayIsoSurface' style='outline:none; margin:2px;'>色斑图</button></div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);

        var t = this;
        t.myDateSelecter = new DateSelecter();
        $("#dateSelect").append(t.myDateSelecter.div);

        var m_micapsDataClass = new Object(); //图层集合

        //点击自动站
        $("#div_Station").find("button").click(function(){
            t.myDateSelecter.setIntervalMinutes(60); //1小时一次
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#div_Station").find("button.active");
            if(btnElementActive.attr("id") == this.id)
            {
                GDYB.TextDataClass.clearData();
                btnElementActive.removeClass("active");
                return;
            }

            btnElementActive.removeClass("active");
            $(this).addClass("active");

            displayTextData(this.textContent, this.id, t.myDateSelecter.getCurrentTime(false));
        });

        function displayTextData(elementName, element, datetime){
            GDYB.TextDataClass.displayTextData(function(){
                if(GDYB.TextDataClass.layerPlot.features.length == 0) //如果（当前时次）没有数据，就倒推上一时次
                {
                    if(datetime == t.myDateSelecter.getNowTime(false)) //判断是否当前时次
                    {
                        t.myDateSelecter.changeHours(-1);
                        var dtLast = t.myDateSelecter.getCurrentTime(false);
                        GDYB.TextDataClass.displayTextData(function(){
                            if(GDYB.TextDataClass.layerPlot.features.length == 0) {
//                                alert("无数据");
                                alertFuc("无数据");
                            }
                            updateButtonStatus();
                            updateTitle(elementName, null, dtLast);
                        }, element, dtLast);
                    }
                    else
                    {
//                        alert("无数据");
                        updateButtonStatus();
                        updateTitle(elementName, null, datetime);
                        alertFuc("无数据");
                    }
                }
                else
                {
                    updateButtonStatus();
                    updateTitle(elementName, null, datetime);
                }
            }, element, datetime);
        };

       //点击天气图
        $("#div_WeatherMap").find("button").click(function(){
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#div_WeatherMap").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;

            btnElementActive.removeClass("active");
            $(this).addClass("active");

            displayMicaps(this.id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
        });

        function displayMicaps(element, level, datetime, hourspan){
            GDYB.MicapsDataClass.displayMicapsData(null, element, level, datetime, hourspan);
        };

        //点击物理量
        $("#div_Physic").find("button").click(function(){
            t.myDateSelecter.setIntervalMinutes(60*6); //6小时一次
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#div_Physic").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;

            btnElementActive.removeClass("active");
            $(this).addClass("active");

            displayMicaps(this.id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
            updateTitle(this.textContent, 1000, t.myDateSelecter.getCurrentTime(false));
        });

        //填值显隐
        $("#buttonDisplayPlot").click(function(){
            if($("#buttonDisplayPlot").hasClass("disabled"))
                return;
            if(GDYB.TextDataClass.layerPlot==null || GDYB.TextDataClass.layerPlot.visibility)
                $("#buttonDisplayPlot").removeClass("active");
            else
                $("#buttonDisplayPlot").addClass("active");
            GDYB.TextDataClass.layerPlot.setVisibility(!GDYB.TextDataClass.layerPlot.visibility);
        });
        //填色显隐
        $("#buttonDisplayFill").click(function(){
            if($("#buttonDisplayFill").hasClass("disabled"))
                return;
            if(GDYB.TextDataClass.layerFillRangeColor == null || GDYB.TextDataClass.layerFillRangeColor.visibility)
                $("#buttonDisplayFill").removeClass("active");
            else
                $("#buttonDisplayFill").addClass("active");
            GDYB.TextDataClass.layerFillRangeColor.setVisibility(!GDYB.TextDataClass.layerFillRangeColor.visibility);
            if(GDYB.TextDataClass.layerFillRangeColor.visibility && GDYB.TextDataClass.layerFillRangeColor.grid.length == 0) //可见，但无要素，请求一下
                GDYB.TextDataClass.addGrid(null, GDYB.Page.curPage.map);
        });
        //等值线
        $("#buttonDisplayContour").click(function(){
            if($("#buttonDisplayContour").hasClass("disabled"))
                return;
            if(GDYB.TextDataClass.layerContour == null || GDYB.TextDataClass.layerContour.visibility)
                $("#buttonDisplayContour").removeClass("active");
            else
                $("#buttonDisplayContour").addClass("active");
            GDYB.TextDataClass.layerContour.setVisibility(!GDYB.TextDataClass.layerContour.visibility);
            if(GDYB.TextDataClass.layerContour.visibility && GDYB.TextDataClass.layerContour.features.length == 0) //可见，但无要素，请求一下
                GDYB.TextDataClass.addContour(null, GDYB.Page.curPage.map);
        });
        //色斑图
        $("#buttonDisplayIsoSurface").click(function(){
            if($("#buttonDisplayIsoSurface").hasClass("disabled"))
                return;
            if(GDYB.TextDataClass.layerPolygon == null || GDYB.TextDataClass.layerPolygon.visibility)
                $("#buttonDisplayIsoSurface").removeClass("active");
            else
                $("#buttonDisplayIsoSurface").addClass("active");
            GDYB.TextDataClass.layerPolygon.setVisibility(!GDYB.TextDataClass.layerPolygon.visibility);
            if(GDYB.TextDataClass.layerPolygon.visibility && GDYB.TextDataClass.layerPolygon.features.length == 0) //可见，但无要素，请求一下
                GDYB.TextDataClass.drawDengzhimian(null, GDYB.Page.curPage.map);
        });

        function updateButtonStatus()
        {
            if(GDYB.TextDataClass.layerPlot==null || !GDYB.TextDataClass.layerPlot.visibility || GDYB.TextDataClass.layerPlot.features.length == 0)
                $("#buttonDisplayPlot").removeClass("active");
            else
                $("#buttonDisplayPlot").addClass("active");
            if(GDYB.TextDataClass.layerContour == null || !GDYB.TextDataClass.layerContour.visibility || GDYB.TextDataClass.layerContour.features.length == 0)
                $("#buttonDisplayContour").removeClass("active");
            else
                $("#buttonDisplayContour").addClass("active");
            if(GDYB.TextDataClass.layerPolygon == null || !GDYB.TextDataClass.layerPolygon.visibility || GDYB.TextDataClass.layerPolygon.features.length == 0)
                $("#buttonDisplayIsoSurface").removeClass("active");
            else
                $("#buttonDisplayIsoSurface").addClass("active");
        }

        function updateTitle(elementName, level, datetime)
        {
            var levelName = level == null || level == "1000" ?"" : level + "百帕";
            $("#map_title_div").html("<span style='padding: 5px'>" + datetime + " "+ levelName + elementName + "</span>");
			$("#map_title_div").css("display", "block");
        };

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

        function onChangeDateTime(){
            //自动站
            var btnElementActive = $("#div_Station").find("button.active");
            if(btnElementActive.length > 0){
                displayTextData(btnElementActive[0].textContent, btnElementActive[0].id, t.myDateSelecter.getCurrentTime(false));
            }
            //天气图
            btnElementActive = $("#div_WeatherMap").find("button.active");
            if(btnElementActive.length > 0){
                displayMicaps(btnElementActive[0].id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
            }
            //物理量
            btnElementActive = $("#div_Physic").find("button.active");
            if(btnElementActive.length > 0){
                displayMicaps(btnElementActive[0].id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
            }
        }
    };
}
SKZLPageClass.prototype = new PageBase();