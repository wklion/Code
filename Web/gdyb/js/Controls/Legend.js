/**
 * Legend.js 图例控件
 * Created by zouwei on 2015-11-12.
 */
function Legend(name){
    this.items = {}//把原始的颜色存起来
    this.styles = null;
    this.name = name;
    var t = this;
    this.update = function(styles){
        if(styles == null)
            $("#"+ t.name).css("display","none");
        else
            $("#"+ t.name).css("display","block");
        t.styles = styles;
        var strLegendItem = "";
        var strLegendItemText = "";
        for(var key in styles){
            var style = styles[key];
            var value = Math.floor(style.end*10)/10;
            var visible = "true";
            var rgb = "rgb("+ style.startColor.red + "," + style.startColor.green + "," + style.startColor.blue + ")";
            t.items[value] = rgb;
            if(typeof(style.visible) != "undefined" && !style.visible)
            {
                rgb = "rgb(255, 255, 255)";
                visible = "false";
            }
            var strvalue = value;
            if(typeof(style.legend) != "undefined")
                strvalue = style.legend;
            strLegendItem+="<div class='item' style='cursor:pointer;background-color:" + rgb + "' visible='"+ visible +"' tag='"+value+"'>"+strvalue+"</div>";
        }
        $("#"+ t.name).html(strLegendItem);
        //$("#div_legend_itemTexts").html(strLegendItemText);

        //注册点击事件
        $("#"+ t.name).find("div").click(function(){
            if(GDYB.GridProductClass.layerFillRangeColor == null)
                return;
            var legenItemValue = Number($(this).attr("tag"));
            var bvisible = typeof(this.attributes["visible"]) == "undefined" || this.attributes["visible"].value == "true";
            if(bvisible)
            {
                $(this).css("background-color", "rgb(255, 255, 255)");
                $(this).css("border", "1px solid rgb(200,200,150)");
                $(this).attr("visible", "false");
            }
            else
            {
                var rgb = t.items[legenItemValue];
                $(this).css("background-color", rgb);
                $(this).attr("visible", "true");
                $(this).css("border", "");
            }

            for(var key in styles) {
                var style = styles[key];
                var value = Math.floor(style.end * 10) / 10;
                if(value == legenItemValue)
                {
                    style["visible"] = !bvisible;
                    break;
                }
            }
            GDYB.GridProductClass.layerFillRangeColor.refresh();
        });
    };
}