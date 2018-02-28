/**
 * Created by Administrator on 2016/5/12.
 */
function Panel_YSTJ(div){
    this.div = div;
    var t = this;

    this.createPanelDom = function() {
        this.panel = $("<div id=\"Panel_YSTJ\" class='panelToolYSTJ' >"
            +"<div class=\"title\"><span id='ptitle'>强对流天气监测实况统计分析</span></div>"
            /*+"<div class=\"title\"><span>工具箱</span><a class=\"closeBtn\">△</a></div>"*/
            +"<div class='ystjContent'></div>"
            + "</div>")
            .appendTo(this.div);
    }

    t.init();
}
Panel_YSTJ.prototype = new DragPanelBase();