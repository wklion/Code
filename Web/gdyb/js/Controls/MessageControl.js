/**
 * Created by Administrator on 2016/7/25.
 */
function dealWithMessage(message){
    var divProductsOfRecent24H = null;
    var divMessage = $("#divMessage");

    if(divMessage != null){
        if(message.productId == GDYB.Chat.productId){
            if(message.departCode == GDYB.GridProductClass.currentUserDepart.departCode){
                var content = "<div style='margin-top: 5px;float: left;width: 100%;'>" +
                    "<div style='text-align: right;margin-right: 20px;color: rgb(128,128,128);'><span style='color: rgb(164,137,138);'>"+message.updateTime.split("-")[1]+"-"+message.updateTime.split("-")[2] + "</span></div>" +
                    "<div class='messageDetailMe'>"+message.content.replace("000001","")+"</div>" +
                    "</div>";
            }
            else {
                var content = "<div style='margin-top: 5px;float: left;width: 100%;'>" +
                    "<div style='margin-left: 20px;color: rgb(128,128,128);'>"+message.departName.split("气象台")[0]+" <span style='color: rgb(164,137,138);'>"+message.updateTime.split("-")[1]+"-"+message.updateTime.split("-")[2] + "</span></div>" +
                    "<div class='messageDetail'>"+message.content.replace("000001","")+"</div>" +
                    "</div>";
            }
            divMessage.append(content);
            $("#divMessage")[0].scrollTop = $("#divMessage")[0].scrollHeight;
        }
        else if($("#messageDivs").css("display") == "none"){
            /*var list = $("#menu_bd").find("#"+message.productId);
            for(var i=0;i<list.length;i++){
                if(list[i].id == message.productId){
                    if($(list[i]).find("span").length == 0){
                        $(list[i]).find("img").css("margin-right","5px");
                        $(list[i]).find("img").before("<span style='color: white;border-radius: 100%;background-color: red;float: right;display: inline-block;height: 18px;width: 18px;text-align: center;line-height: 18px;' value='1'>1</span>");
                    }
                    else{
                        var num = parseInt($(list[i]).find("span").html())
                        $(list[i]).find("span").html((num+1));
                    }
                    break;
                }
            }*/
        }
    }
}

function getNewCalamityGridInfos(){
    if(GDYB.GridProductClass.currentUserDepart == null)
        return;
    var date = new Date();
    var maketimeEnd = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
    var time = date.getTime();
    time -= 24*60*60*1000;
    date.setTime(time);
    var maketimeStart = date.getFullYear() + "-" + (Array(2).join(0)+(date.getMonth()+1)).slice(-2) + "-" + (Array(2).join(0)+date.getDate()).slice(-2) + " " + (Array(2).join(0)+date.getHours()).slice(-2) + ":" + (Array(2).join(0)+date.getMinutes()).slice(-2)+":"+(Array(2).join(0)+date.getSeconds()).slice(-2);
    var url=gridServiceUrl+"services/GridService/getNewCalamityGridInfos";
    $.ajax({
        data: {"para": "{element:'nowcast,signal,pw',departCode:'"+GDYB.GridProductClass.currentUserDepart.departCode+"',maketimeStart:'" + maketimeStart + "',maketimeEnd:'" + maketimeEnd + "'}"},
        url: url,
        dataType: "json",
        success: function (data) {
            GDYB.Message = {nowcast:0,signal:0,pw:0};
            for(var i=0;i<data.length;i++){
                GDYB.Message[data[i].element]++;
            }
            if(data.length != 0){
                $("#messageNum_qdl").css("display","block").html(data.length);
            }
            else{
                $("#messageNum_qdl").css("display","none");
            }
            if($("#qdl_btn").find("button").hasClass("active")){
                showMessageNum("messageNum_qdl");
            }
            if(GDYB.Page.curPage == GDYB.QDLLJYBPage){
                showMessageNum("messageNum_ljyb");
            }
            else if(GDYB.Page.curPage == GDYB.QDLQSYBPage){
                showMessageNum("messageNum_qsyb");
            }
        },
        type: "POST"
    });
}

function showMessageNum(name){
    if(name == "messageNum_qdl"){
        var num = GDYB.Message.nowcast+GDYB.Message.signal
        if(num != 0)
            $("#messageNum_ljyb").css("display","block").html(num);
        else
            $("#messageNum_ljyb").css("display","none");
        if(GDYB.Message.pw != 0)
            $("#messageNum_qsyb").css("display","block").html(GDYB.Message.pw);
        else
            $("#messageNum_qsyb").css("display","none");
    }
    else if(name == "messageNum_ljyb"){
        if(GDYB.Message.nowcast != 0)
            $("#messageNum_xbyj").css("display","block").html(GDYB.Message.nowcast);
        else
            $("#messageNum_xbyj").css("display","none");
        if(GDYB.Message.signal != 0)
            $("#messageNum_yjxh").css("display","block").html(GDYB.Message.signal);
        else
            $("#messageNum_yjxh").css("display","none");
    }
    else if(name == "messageNum_qsyb"){
        if(GDYB.Message.pw != 0)
            $("#messageNum_yjqs").css("display","block").html(GDYB.Message.pw);
        else
            $("#messageNum_yjqs").css("display","none");
    }
}
function pollingNewCalamityGridInfos(){
    setTimeout(function(){
        getNewCalamityGridInfos();
    },1000*30);
}