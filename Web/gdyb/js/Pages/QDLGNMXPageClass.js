

function QDLGNMXPageClass(){
   this.renderMenu = function() {
        var htmlStr = "<div id='gnmxMenu' style='padding-top: 15px;'>"
            +"<div>"
                +"<div class='title1'>短时强降水</div>"
                +"<div  class='btn_line2 menuDiv_bottom1' style='margin-left: 13px;text-align:left;'>"
                    +"<button id='dqskfb' class='active'>时空分布图</button><button id='dqdwx' >低涡型</button><button id='dqdcx' >低槽型</button><button id='dqfgx'>副高型</button>"
                    +"</br>"
                    +"<button id='dqxbqlx' >西北气流型</button><button id='dqgybyx' >高压边缘型</button>"
                +"</div>"
            +"<div>"
                +"<div class='title1'>冰雹概念模型</div>"
                +"<div  class='btn_line2 menuDiv_bottom1' style='margin-left: 13px;text-align:left;'>"
                    +"<button id='bbskfb'>时空分布图</button><button id='bbdcx' >低槽型</button><button id='bbxbqlx' >西北气流型</button><button id='bbdwqbx'>低涡切变型</button>"
                +"</div>"
            +"</div>"
            +"<div>"
                +"<div class='title1'>物理量指标阈值</div>"
                +"<div  class='btn_line2 menuDiv_bottom1'  style='margin-left: 13px;text-align:left;'>"
                    +"<button id='bgdq'> 短时强降水 </button><button id='bgbb'>冰雹 </button>"
                +"</div>"
            +"</div>"
            +"</div>"
        +"</div>";
       $("#menu_bd").html(htmlStr);
       $("#map_div").css("display","none");
       $("#workspace_div").append("<div id='pdfDiv' style='position: absolute;top:10px;left: 61px;right: 357px;bottom: 10px;z-index: 99;'></div>");
       $("#pdfDiv").append("<iframe style='position: absolute;z-index:99;background-color: #ffffff' id='gnmxPdf' scrolling='no' frameborder='0' width='100%' height='100%'></iframe>")
       $("#gnmxPdf").attr("src","docs/dqskfb.pdf");

       $("#gnmxMenu").find("button").click(function(){
           if($(this).hasClass("active"))
               return;
           if($("#gnmxMenu").find("button.active").length != 0){
               $("#gnmxMenu").find("button.active").removeClass("active");
               var id = $(this).attr("id");
               var srcStr = "docs/"+id+".pdf";
               $("#gnmxPdf").attr("src",srcStr);
           }
           $(this).addClass("active");
       });
    }


}
QDLGNMXPageClass.prototype = new PageBase();