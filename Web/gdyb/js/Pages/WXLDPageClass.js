/*
* 卫星雷达资料页面
* by zouwei, 2015-09-15
* */
function WXLDPageClass(){
    this.myDateSelecter = null;
    //渲染左侧菜单区域里的按钮
    this.renderMenu = function(){
        var htmlStr = "<div id='div_type' class=''><div class='title1'>要素</div>"
            +"<div id='div_Radar'>"
            +"<div class='title2'>雷达</div>"
            +"<div class='btn_line'><button id='swan_2dcrmosaic'>三维拼图</button><button id='swan_2det'>回波顶高</button><button id='swan_2dcr'>组合反射率</button></div>"
            +"<div class='btn_line'><button id='swan_2dvil'>液态含水量</button><button id='swan_2dppi0'>基本反射率0.5</button><button id='swan_2dppi1'>基本反射率1.5</button></div></div>"
            +"<div id='div_Cloud'>"
            +"<div class='title2'>云图</div>"
            +"<div class='btn_line'><button id='fy2_ir1'>IR1</button><button id='fy2_ir2'>IR2</button><button id='fy2_ir3'>IR3</button></div>"
            +"<div class='btn_line'><button id='fy2_ir4'>IR4</button><button id='fy2_vis'>VIS</button></div></div></div>"
            +"<div id='div_datetime'>"
            +"<div class='title1'>时间</div>"
            +"<div id='dateSelect'></div>"
            +"</div>";
        $("#menu_bd").html(htmlStr);
        var t = this;
        t.myDateSelecter = new DateSelecter(0);
        $("#dateSelect").append(t.myDateSelecter.div);

        //点击雷达
        $("#div_Radar").find("button").click(function(){
            t.myDateSelecter.intervalMinutes = 6; //6分钟一次
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#div_Radar").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;

            btnElementActive.removeClass("active");
            $(this).addClass("active");
            displayRadar();
        });

        function displayRadar(){
            var btnRadarElement = $("#div_Radar").find("button.active");
            var element = btnRadarElement.attr("id");
            var level = 0; //仰角
            var datetime = t.myDateSelecter.getCurrentTime(false);
            GDYB.RadarDataClass.displayRadarData(null, element, level, datetime);
        };

//        //点击AWX云图
//        $("#div_Cloud").find("button").click(function(){
//            if($(this).hasClass("disabled"))
//                return;
//            var btnElementActive = $("#div_Cloud").find("button.active");
//            if(btnElementActive.attr("id") == this.id)
//                return;
//
//            btnElementActive.removeClass("active");
//            $(this).addClass("active");
//            displayAWX();
//        });
//
//        function displayAWX(){
//            var btnCloudElement = $("#div_Cloud").find("button.active");
//            var element = btnCloudElement.attr("id");
//            var datetime = t.myDateSelecter.getCurrentTime(false);
//            GDYB.AWXDataClass.displayRadarData(null, element, datetime);
//        };

        //点击Micaps第13类云图
        $("#div_Cloud").find("button").click(function(){
            t.myDateSelecter.intervalMinutes = 60; //1小时一次
            t.myDateSelecter.setCurrentTime(t.myDateSelecter.getCurrentTimeClock()); //置为整点
            if($(this).hasClass("disabled"))
                return;
            var btnElementActive = $("#div_Cloud").find("button.active");
            if(btnElementActive.attr("id") == this.id)
                return;

            btnElementActive.removeClass("active");
            $(this).addClass("active");
            displayMicaps(this.id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
        });

        function displayMicaps(element, level, datetime, hourspan){
            GDYB.MicapsDataClass.displayMicapsData(null, element, level, datetime, hourspan);
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
        t.myDateSelecter.input.change(function(){
            onChangeDateTime();
        });

        function onChangeDateTime(){
            //雷达
            var btnElementActive = $("#div_Radar").find("button.active");
            if(btnElementActive.length > 0){
                displayRadar();
            }
            //云图
            btnElementActive = $("#div_Cloud").find("button.active");
            if(btnElementActive.length > 0){
                displayMicaps(btnElementActive[0].id, 1000, t.myDateSelecter.getCurrentTime(false), 0);
            }
        }
    };
}
WXLDPageClass.prototype = new PageBase();