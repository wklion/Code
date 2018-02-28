/**
 * creatby dinlerkey on 2017/4/13
 * */

function timeSlide(name,time,list,mt,func,func2){
    this.name = name;
    this.lineWidth = null;
    this.nodeNum = list.length;
    this.params = list;
    this.makeTime = mt;
    this.func = func;
    this.func2 = func2;
    this.baseWidth = null;
    this.nodeWidthList = [0,0];
    this.nodeTimeList = [0,0];
    this.nowNodeNum = 1;
    this.time = time*1000;
    this.nowFlag = null;
    var t = this;
    initTimeSlide();

    //初始化底部进度条
    function initTimeSlide(){
        $("#progress-bar").html(''
            +'<div id="timeSlider" class="progress-line">'
            +'<div id="timeControl" class="avbl"></div>'
            +'</div>'
            +'<div id="timecode" class="timecode" title="当地时间" style="margin-left: 21px;">'
            +'<div id="timecode-box" class="box"></div>'
            +'<img class="loader loader-path" width="19" height="8">'
            +'</div>'
            +'<div id="playpause" class="iconfont icon-kaishi"></div>'
            +'<div id="calendar"></div>'
        );
        $(".progress-line").css("width", (document.body.clientWidth)*0.875);
        t.lineWidth = $(".progress-line").css("width").split("p")[0];
        t.baseWidth = t.lineWidth/(t.nodeNum);
        for(var i=1;i<t.nodeNum;i++){
            t.nodeWidthList[i+1] = t.baseWidth*i;
        }

        //添加日期标记
        var contentHtml = "";
        for(var i=0;i<t.nodeNum;i++){
            if(i%24==0){
                if(i/24!=10){
                    var leftMark = t.baseWidth*i;
                    var flagNum = i/24+1;
                    var timeMark = t.params[i].toString().split("/")[3]+" "+t.params[i].toString().split("/")[2];//#周五 15#
                    contentHtml +='<div style="left: '+leftMark+'px;width: '+ (t.baseWidth*24-1)+'px;" flag="'+flagNum+'">'+ timeMark +'</div>';
                }
            }
        }
        $("#calendar").html(contentHtml);

        //添加进度条节点，i标记（当前时间）
        contentHtml = '';
        var nowTime = new Date();
        var nowMonth = (nowTime.getMonth()+1).toString().length>1?(nowTime.getMonth()+1):("0"+(nowTime.getMonth()+1));
        var nowDay = nowTime.getDate().toString().length>1?nowTime.getDate():("0"+nowTime.getDate());
        var nowHour = nowTime.getHours().toString().length>1?nowTime.getHours():("0"+nowTime.getHours());
        var timeCodeMark = null;
        if(t.nowFlag==null){
            var j;
            if(t.makeTime==5){
                t.nowFlag = 9;
                j = 8;
            }
            else if(t.makeTime==16){
                t.nowFlag = 21;
                j = 20;
            }
            timeCodeMark = t.params[j].toString().split("/")[3]+" "+t.params[j].toString().split("/")[2]+" - "+t.params[j].toString().split("/")[4];
        }
        for(var i=0;i< t.nodeNum;i++){
            var left = t.baseWidth*i;
            var flag = i+1;
            var monMark = t.params[i].toString().split("/")[1];
            var dayMark = t.params[i].toString().split("/")[2];
            var titleMark = t.params[i].toString().split("/")[4];
            contentHtml += '<div class="subParam" style="left: '+left+'px;width: '+baseWidth+'px;" flag="'+flag+'" title="'+titleMark+'">';
            contentHtml += '<div class="timecode ghost-timecode" flag="'+flag+'"><div class="box">'+titleMark+'</div></div></div>';
            if(monMark.substr(0,2)==nowMonth&&dayMark.substr(0,2)==nowDay&&titleMark.substr(0,2)==nowHour){
                contentHtml += '<i style="left: '+left+'px"></i>';
                timeCodeMark = t.params[i].toString().split("/")[3]+" "+t.params[i].toString().split("/")[2]+" - "+t.params[i].toString().split("/")[4];
                t.nowFlag = flag;
            }
        }

        $("#timeControl").append('<div id="timeLine" style="width: '+t.nodeWidthList[t.nowFlag]+'px;"></div>');
        $("#timecode").css("left",t.nodeWidthList[t.nowFlag]+'px');
        $("#timecode-box").html(timeCodeMark);
        $("#timeControl").append(contentHtml);
        $("#timeControl").find(".subParam[flag="+t.nowFlag+"]").addClass("active");

        $(".subParam").click(function(){
            timeNodeClick($(this));
        });

        $(".subParam").hover(function(){
            showTimeNode($(this));
        },function(){
            hideTimeNode($(this));
        });

        //动画播放按钮切换
        $("#playpause").click(function(){
            var $this = $(this);
            if($this.attr("flag")=="playing"){
                t.animateStop();
                $this.attr("flag","pausing");
                $this.attr("class","iconfont icon-kaishi");
                $this.attr("title","播放");
            }
            else{
                t.animatePlay();
                $this.attr("flag","playing");
                $this.attr("class","iconfont icon-zanting");
                $this.attr("title","暂停");
            }
        });
    }

    //动画开始方法
    this.animateStart = function(num,b){
        var width = t.nodeWidthList[num];
        var time;
        if(!b){
            time = t.time;
        }
        else{
            time = b;
        }
        $("#timeLine").animate({width:width},time,"linear",function(){
            if(num<t.nodeNum){
                realizationFunc(num);
                t.nowFlag = num+1;
                t.animateStart(num+1);
            }
            else{
                setTimeout(function(){
                    initTimeSlide();
                },time);
            }
        });
        $("#timecode").animate({left:width},time,"linear",function(){
            changeMarkFunc(num);
        });
    };
    //动画停止方法
    this.animateStop = function(){
        $("#timeLine").stop();
        $("#timecode").stop();
    };
    //动画播放方法
    this.animatePlay = function(){
        t.nowNodeNum = t.nowFlag+1;
        $("#timeLine").stop();
        $("#timecode").stop();
        if($("#timeLine").css("width")=="0px"){
            t.animateStart(t.nowNodeNum+1);
        }
        else if($("#timeLine").css("width")==t.lineWidth+"px"){
            $("#timeLine").css("width","0px");
            $("#timecode").css("left","0px");
            //realizationFunc(1);
            t.animateStart(2);
        }
        else{
            t.animateStart(t.nowNodeNum);
        }

    };

    //进度条节点触发方法，参数this
    function timeNodeClick($this){
        var num = parseInt($this.attr("flag"));
        t.nowFlag = num;
        t.animateMove(t.nowFlag,200);
        if(t.nowNodeNum == num){
            return;
        }
        realizationFunc(num,true);
        if(num<t.nodeNum){
            t.nowNodeNum = num;
        }
        else{
            t.nowNodeNum = 1;
        }
        if($("#playpause").attr("flag")=="playing"){
            t.animatePlay();
        }
    }

    //进度条节点点击滑动效果
    this.animateMove = function(num,b){
        var width = t.nodeWidthList[num];
        var time;
        if(!b){
            time = t.time;
        }
        else{
            time = b;
        }
        $("#timeLine").animate({width:width},time,"linear");
        $("#timecode").animate({left:width},time,"linear",function(){
            changeMarkFunc(num);
        });
    };

    //同步标记日期方法
    function changeMarkFunc(num){
        var targetFlag = $($(".subParam")[num-1]).attr("flag");
        var contentHtml = '';
        for(var i=0;i< t.nodeNum;i++){
            var flag = i+1;
            if(targetFlag==flag){
                contentHtml += t.params[i].toString().split("/")[3]+" "+t.params[i].toString().split("/")[2]+" - "+t.params[i].toString().split("/")[4];
            }
        }
        $("#timecode-box").html(contentHtml);
    }

    //显示节点提示
    function showTimeNode($this){
        var list = $(".ghost-timecode");
        for(var i=0;i<list.length;i++){
            if($this.attr("flag")==$(list[i]).attr("flag")){
                $(list[i]).css("display","block");
            }
        }
    }
    //隐藏节点提示
    function hideTimeNode(){
        var list = $(".ghost-timecode");
        for(var i=0;i<list.length;i++){
            $(list[i]).css("display","none");
        }
    }

    //动画绑定事件1
    function realizationFunc(num,b){
        var list = $("#timeControl .subParam");
        for(var i=0;i<list.length;i++){
            if($(list[i]).hasClass("active")){
                $(list[i]).removeClass("active");
            }
        }
        $("#timeControl").find(".subParam[flag="+num+"]").addClass("active");
        eval(t.func(t.params[num-1],b));
    }
}

//时间格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
