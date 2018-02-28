/**
 * @author: wangkun
 * @date:2017-12-07
 * @description 地图服务
 */
function MapUtil(dom) {
  this._init_(dom);
}

MapUtil.prototype = {
  constructor: MapUtil,
  _init_: function (dom) {
    dom = dom || $("#content");
    this.name = "地图服务";
    dom.html(`
            <div class="map_div" id="map_div">
                <div id="map" class="map"></div>
            </div>
        `);
    var navigatnion = new WeatherMap.Control.Navigation();
    var layerSwitcher = new WeatherMap.Control.LayerSwitcher();
    navigatnion.handleRightClicks = true; //响应右键双击缩小
    this.map = new WeatherMap.Map("map", {
      controls: [
        navigatnion,
        layerSwitcher,
        new WeatherMap.Control.Zoom()], projection: "EPSG:4326"
    });
    this.map.addControl(new WeatherMap.Control.MousePosition());
    this.initWhiteMapLayer();
    this.map.setCenter(new WeatherMap.LonLat(defaultCenter[0], defaultCenter[1]), defaultCenter[2]);
  },
  initWhiteMapLayer: function () {
    var layer = new WeatherMap.Layer.LocalTiledCacheLayerWhiteMap();
    layer.name = "白板图";
    layer.setIsBaseLayer(true);
    this.map.addLayers([layer]);
  },
  /**
   * @author:wangkun
   * @date:2017-12-18
   * @modifyDate:
   * @return:
   * @description:清除所有图层
   */
  clearMap: function () {
    var me = this;
    var layers = me.map.layers;
    var size = layers.length;
    for (var i = size - 1; i >= 0; i--) {
      if (!layers[i].isBaseLayer) {
        me.map.removeLayer(layers[i]);
      }
    }
  }
}
