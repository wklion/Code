/**
 * @author: wangkun
 * @date:2017-06-08
 * @description 警戒区
 */
function AlertAreas() {
    this._init_();
}
AlertAreas.prototype = {
    constructor: AlertAreas,
    _init_: function () {
        this.name = "警戒区";
    },
    /**
     * @author:wangkun
     * @date:2017-07-178
     * @return:
     * @description:显示警戒区
     */
    displayAlertAreas: function (layer, areacode) {
        var url = "";
        if(webRoot == ""){
            url = host + "/data/AlertArea/" + areacode + ".json";
        }
        else{
            url = host + "/"+webRoot+"/data/AlertArea/" + areacode + ".json";
        }
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (data) {
                data.forEach(function (element) {
                    var level = element.Level;
                    var strPts = element.StrPts;
                    var pts = JSON.parse(strPts);

                    var color = "blue";
                    if (level == 0) {
                        color = "black";
                    }
                    else if (level == 1) {
                        color = "red";
                    }
                    else if (level == 2) {
                        color = "orange";
                    }
                    var style = {
                        strokeColor: color,
                        strokeOpacity: 0.5,
                        strokeWidth: 2,
                        strokeDashstyle: "dot",
                        fillOpacity: 0
                    }
                    var count = pts.length;
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var pt = pts[i];
                        var lon = pt.X;
                        var lat = pt.Y;
                        var point = new WeatherMap.Geometry.Point(lon, lat);
                        pointArray.push(point);
                    }
                    var linearRings = new WeatherMap.Geometry.LinearRing(pointArray);
                    var lineFeature = new WeatherMap.Feature.Vector(linearRings);

                    lineFeature.style = style;
                    layer.addFeatures([lineFeature]);
                });
            },
            error: function (e) {
                console.log("获取警戒区域失败!");
            }
        });
    }
}