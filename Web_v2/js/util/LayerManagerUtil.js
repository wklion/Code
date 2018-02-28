/**
 * @author: wangkun
 * @date:2017-10-18
 * @description 图层管理
 */
function LayerManagerUtil() {
    this._init_();
}
LayerManagerUtil.prototype = {
    constructor: LayerManagerUtil,
    _init_: function () {
        this.name = "图层管理";
    },
    /**
     * @author:wangkun
     * @date:2017-10-18
     * @return:
     * @description:添加图层
     */
    addLayer: function (layername, layertype, url, bounds,renderers) {
        var me = this;
        var layer = null;
        var layers = me.getLayer(layername);
        if (layers!=null) {
            layer = layers[0];
        }
        else{
            if (layertype === "vector") {
                layer = new WeatherMap.Layer.Vector(layername, { renderers: [renderers] });
            }
            else if (layertype === "image") {
                layer = new WeatherMap.Layer.Image(layername, url, bounds, { useCanvas: true, isBaseLayer: false });
            }
            else if(layertype === "grid"){
                layer = new WeatherMap.Layer.FillRangeColorLayer(
                    layername, {
                        "radius": 40,
                        "featureWeight": "value",
                        "featureRadius": "geoRadius"
                    }
                );
            }
            GDYB.mapUtil.map.addLayer(layer);
        }
        return layer;
    },
    /**
   * @author:wangkun
   * @date:2017-12-19
   * @modifyDate:
   * @return:
   * @description:添加控件
   */
    addControl:function(control){
        GDYB.mapUtil.map.addControl(control);
    },
    getLayer:function(layername){
        var layers = GDYB.mapUtil.map.getLayersByName(layername);
        if (layers.length > 0) {
            return layers[0];
        }
        else{
            return null;
        }
    },
    /**
     * @author:wangkun
     * @date:2017-10-18
     * @return:
     * @description:移除图层
     */
    removeLayer:function(layername){
        var layers = GDYB.mapUtil.map.getLayersByName(layername)
        if(layers.length>0){
            GDYB.mapUtil.map.removeLayer(layers[0]);
        }
    }
}