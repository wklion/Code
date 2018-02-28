/**
 * Created by Administrator on 2016/5/27.
 */

function Chat(recall){
    this.socket = null;
    var t=this;
    this.productId = null;
    this.productName = null;
    this.ctrlFlag = false;
    this.connect = (function(host) {
        if ('WebSocket' in window) {
            t.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            t.socket = new MozWebSocket(host);
        } else {
            alert('当前浏览器不支持实时推送');
            return;
        }

        t.socket.onopen = function () {
        };

        t.socket.onclose = function () {
            $("#chatText").keydown(null);
            //Console.log('Info: WebSocket closed.');
        };

        t.socket.onmessage = function (message) {
            if(message.data.indexOf(":")!=-1){
                var obj = JSON.parse(message.data.split(": ")[1].replace(/&quot;/g,'"'));
                //Console.log(obj.departName+":"+obj.content);
                recall(obj);
            }
        };
    });

    this.initialize = function() {
        if (window.location.protocol == 'http:') {
            t.connect('ws://' + window.location.host + '/examples/websocket/tc7/chat');
        } else {
            t.connect('wss://' + window.location.host + '/examples/websocket/tc7/chat');
        }
    };

    this.sendMessage = (function(message) {
        if (message != '') {
            message = message.replace(/\n/g,"000001");
            t.socket.send(message);
            $.ajax({
                type: "POST",
                data: {"para": message},
                url: gridServiceUrl+"services/ForecastfineService/updateForecastMessage",
                dataType: "json",
                success: function (data) {

                },
                error:function(data){
                    alert("error");
                }
            });
            $("#chatText").val("");
        }
    });

    this.getNowTimes =function(){
        var nowDate = new Date();
        return nowDate.getFullYear()+"-"+(Array(2).join(0)+(nowDate.getMonth()+1)).slice(-2)+"-"+(Array(2).join(0)+nowDate.getDate()).slice(-2)+" "+(Array(2).join(0)+nowDate.getHours()).slice(-2)+":"+(Array(2).join(0)+nowDate.getMinutes()).slice(-2)+":"+(Array(2).join(0)+nowDate.getSeconds()).slice(-2);
    }
}