/*
* 预报时效工具
* by zouwei, 2015-05-10
* */
//添加信息框拖拽
var winInfoDrag;
document.onmouseup=function(){
    if(!winInfoDrag)return;
    document.all?winInfoDrag.releaseCapture():window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
    winInfoDrag="";
};
document.onmousemove=function (d){
    if(!winInfoDrag)return;
    if(!d)d=event;
    $(winInfoDrag).css("left",(d.clientX-b)+"px");
    //a.style.top=(d.clientY-c)+"px";
    $(winInfoDrag).css("top",(d.clientY-c)+"px");
};
function dragPanel(o,e){
    if(e.button == 2)
        return;
    if(e.srcElement.type == "textarea")
        return;
    winInfoDrag=o;
    document.all?winInfoDrag.setCapture():window.captureEvents(Event.MOUSEMOVE);
    var left = $(winInfoDrag).css("left");
    var top = $(winInfoDrag).css("top");
    b=e.clientX-parseInt(left);
    c=e.clientY-parseInt(top);
};

function YuBaoshixiaoTools(div, startDate, type){//div:容器
    this.div = div;
    this.type = type;
    this.hourSpan;
    //数字数组
    this.numbers = [12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240];
    //创建dom元素
    this.createDom = function(date){
        var t = this;
        this.div.html("");
        if(typeof(this.type)=="undefined" || this.type==0) {
            //var title = $("<div>预报时效</div>").addClass("title1").appendTo(this.div);

            //显示日期
            if (typeof(date) != "undefined") {
                var t = this;
                var div = $("<div>").attr("style", "float:left;margin-top:5px").appendTo(this.div);
                var tb = $("<table border=1 cellPadding=0 cellSpacing=0>").addClass("yubaoshixiao_table_day");
                var tdHeight = 28;
                var delta = this.numbers[0];
                if(delta == 12)
                    tdHeight = 38;
                else if(delta == 24)
                    tdHeight = 48;
                var startHour = date.getHours();
                var timeNum = this.numbers.length;
                if (startHour < 12) {
                    var curTr = $("<tr>").appendTo(tb);
                    var day = date.getDay();
                    day = getWeek(day);
                    var td = $("<td>").attr("height", tdHeight).html(date.getDate() + "日 " + day).appendTo(curTr);
                    timeNum--;
                }
                if(delta == 12)
                    timeNum--;
                for (var i = 0; i < timeNum; i++) {
                    if (i == 0 || this.numbers[i - 1] % 24 == 0) {
                        var curTr = $("<tr>").appendTo(tb);
                        date = date.addDays(1);
                        var day = date.getDay();
                        day = getWeek(day);
                        var heightValue = tdHeight;
                        if(delta != 12 && delta != 24)
                            heightValue = tdHeight * 2;
                        var td = $("<td>").attr("height", heightValue).html(date.getDate() + "日 " + day).appendTo(curTr);
                    }
                }
            }

            var div = $("<div>").attr("style", "margin-top:5px;padding-right: 5px;").appendTo(this.div);
            var tb = $("<table id='table_yubaoshixiao' tabindex='2' border=1 cellPadding=0 cellSpacing=0>")
                .addClass("yubaoshixiao_table").appendTo(div);
            var d;
            for (var i = 0; i < this.numbers.length; i++) {
                var delta = this.numbers[i] - (i == 0 ? 0 : this.numbers[i - 1]);
                var colspan = delta > 12 ? 12 : delta;
                //var tdWidth = delta > 12 ? 12 * 20 : delta * 20;
                d = this.numbers[1] - this.numbers[0];
                if(delta > 12)
                    tdWidth = 240;
                else if(delta == 12)
                    tdWidth = 120;
                else
                    tdWidth = delta * 20;
                if (this.numbers[i] % 12 == delta || delta == 12 && this.numbers[i] % 24 == 12 || delta == 24) {
                    var curTr = $("<tr>").appendTo(tb);
                }
                var td = $("<td>").attr("id", this.numbers[i] + "h").attr("colspan", colspan).css("width", tdWidth).html(this.numbers[i]).appendTo(curTr).click(function () {
//                if($(this).hasClass("disabled"))
//                    return;
                    $(".yubaoshixiao_table").find("td.active").removeClass("active");
                    $(this).addClass("active");
                    t.clickHandle($(this).html());
                });
                if (delta == 24)
                    td.css("height", "40px");
                else if(delta == 12)
                    td.css("height", "30px");
            }
            if(d == 1)
                $("#yubaoshixiao table").css("border-spacing","8px 8px").find("td").css("padding","0");
            $("#yubaoshixiao table td").css("color","#4DB8D7");
        }
        else if(this.type == 1){
            var div = $("<div>").attr("style", "").appendTo(this.div);
            var tb = $("<table id='table_yubaoshixiao' tabindex='2' border=1 cellPadding=0 cellSpacing=0>")
                .addClass("yubaoshixiao_table").appendTo(div);
            var maxCols = 20; //一排最多放20项
            var rows = Math.ceil(this.numbers.length/maxCols);
            var cols = (this.numbers.length<maxCols)?this.numbers.length:maxCols;
            var totalWidth = parseInt($("#"+this.div[0].id).css("width"))-2;
            var tdWidth = totalWidth/cols;
            for (var i = 0; i < this.numbers.length; i++) {
                if (i%maxCols==0) {
                    var curTr = $("<tr>").appendTo(tb);
                }
                var td = $("<td>").attr("id", this.numbers[i] + "h").css("width", tdWidth).html(this.numbers[i]).appendTo(curTr).click(function () {
                    if($(this).hasClass("disabled"))
                        return;
                    $(".yubaoshixiao_table").find("td.active").removeClass("active");
                    $(this).addClass("active");
                    t.clickHandle($(this).html());
                });
            }
        }
    };

    //点击事件
    this.clickHandle = function(number){
        this.hourSpan = number;
    };

    function getWeek(day) {
        if (day == 0)
            day = "周日";
        else if (day == 1)
            day = "周一";
        else if (day == 2)
            day = "周二";
        else if (day == 3)
            day = "周三";
        else if (day == 4)
            day = "周四";
        else if (day == 5)
            day = "周五";
        else if (day == 6)
            day = "周六";
        return day;
    }

    this.createDom(startDate);
}