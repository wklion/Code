/**
 * @author: 杠上花
 * @date:2017-12-18
 * @description 公用类
 */
function Common() {
    this._init_();
}
Common.prototype = {
    constructor: Common,
    _init_: function () {
        this.name = "公用类";
    },
    /**
   * @author:杠上花
   * @date:2017-12-18
   * @modifyDate:
   * @return:
   * @description:获取MCS
   */
    getMCS:function(strDateTime,id){
        var param = {
            element:id,
            level:"",
            datetime:strDateTime
        };
        var url = dataSericeUrl+"services/AWXService/getMCS";
        return request("POST",url,param);
    },
    /**
   * @author:杠上花
   * @date:2017-12-18
   * @modifyDate:
   * @return:
   * @description:获取风的等级
   */
    getWindLevel:function(value){
      var level = 1;
      if(value<=0.3)
          level = 1;
      else if(value<=1.6)
          level = 2
      else if(value<=3.4)
          level = 3
      else if(value<=5.5)
          level = 4
      else if(value<=8.0)
          level = 5
      else if(value<=10.8)
          level = 6
      else if(value<=13.9)
          level = 7
      else if(value<=17.2)
          level = 8
      else if(value<=20.8)
          level = 9
      else if(value<=24.5)
          level = 10
      else if(value<=28.5)
          level = 11
      else if(value<=32.7)
          level = 12
      else if(value<=36.9)
          level = 13
      else if(value<=41.4)
          level = 14
      else if(value<=46.1)
          level = 15
      else if(value<=50.9)
          level = 16
      else if(value<=56.0)
          level = 17
      else if(value<=61.2)
          level = 18
      return level;
    },
    /**
   * @author:杠上花
   * @date:2017-12-18
   * @modifyDate:
   * @return:
   * @description:创建格点数据集
   */
    createDatasetGrid:function(delta){
      var rows = (GRIDBounds[3] - GRIDBounds[1]) / delta;
      var cols = (GRIDBounds[2] - GRIDBounds[0]) / delta;
      var datasetGrid = new WeatherMap.DatasetGrid(GRIDBounds[0], GRIDBounds[3], GRIDBounds[2], GRIDBounds[1], rows, cols, 1);
      var noVal = -9999;
      datasetGrid.noDataValue = noVal;
      var grid = [];
      for (var i = 0; i < rows; i++) {
          for (var j = 0; j < cols; j++) {
              grid.push(noVal);
          }
      }
      datasetGrid.grid = grid;
      datasetGrid.dMin = noVal;
      datasetGrid.dMax = noVal;
      return datasetGrid;
    },
    getStrWeek:function(date){
      var dayIndex = date.getDay();
      var strWeek = "星期天";
      switch(dayIndex){
        case 1:
          strWeek = "星期一";
          break;
        case 2:
          strWeek = "星期二";
          break;
        case 3:
          strWeek = "星期三";
          break;
        case 4:
          strWeek = "星期四";
          break;
        case 5:
          strWeek = "星期五";
          break;
        case 6:
          strWeek = "星期六";
          break;
        default:
          strWeek = "星期天";
          break;
      }
      return strWeek;
    },
    /**
   * @author:杠上花
   * @date:2017-12-17
   * @modifyDate:
   * @return:
   * @description:获取雷达图片最新时间
   */
    getRadarImgLastDate:function(id, cappiP){
        var me = this;
        var now = new MyDate();
        if (IsDEBUG) {
          now.setFullYear(2017);
          now.setMonth(6);
          now.setDate(10);
          now.setHours(12);
          now.setMinutes(0);
        }
        now = now.addHours(-8);
        times = now.getTime();
        var boundsList = RADARConfig.BOUNDS[id];
        bounds = new WeatherMap.Bounds(boundsList[0], boundsList[1], boundsList[2], boundsList[3]);
        var strBounds = boundsList[0] + "_" + boundsList[1] + "_" + boundsList[2] + "_" + boundsList[3];
        var url = IMGCacheUrl;
        url += RADARConfig.URL[id];
        url = url.replace("bounds", strBounds);
        if (cappiP != undefined) {
          url = url.replace("elevation", cappiP);
        }
        var count = 120;
        var newURL = "";
        var isFind = false;
        while (count > 0) {
          var strDateTime = now.format("yyyyMMddhhmm00");
          newURL = url.replace(/time/g, strDateTime);
          var result = request.ping(newURL);
          if (result) {
            isFind = true;
            break;
          }
          now = now.addMinutes(-1);
          count--;
        }
        now.addHours(8);
        var strDateTime = now.format("yyyy-MM-dd hh:mm");
        return {
          isFind: isFind,
          url: newURL,
          bounds: bounds,
          dateTime: strDateTime
        };
    },
    /**
   * @author:杠上花
   * @date:2018-1-14
   * @modifyDate:
   * @return:
   * @description:转DatasetGrid
   */
    converGridToDatasetGrid: function (data, element) {
        var me = this;
        if (!data) return;
        var bWind = false;
        if (typeof (element) != "undefined") {
            bWind = (element == "10uv" || element == "wmax");
        }
        var dvalues = data.dvalues || data.dValues || data.grid;
        if(!dvalues){
            return null;
        }
        var hasTag = (!bWind) && (dvalues.length == data.rows * data.cols * 2);
        var dimensions = (bWind || hasTag) ? 2 : 1; //维度，风场有两维；带有Tag属性也是两维
        var rows = data.rows;
        var cols = data.cols;
        var datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, rows, cols, bWind ? 2 : 1); //只有风是两要素
        datasetGrid.noDataValue = data.noDataValue;
        var dMin = 9999;
        var dMax = -9999;
        var grid = [];
        var tag = [];
        for (var i = 0; i < rows; i++) {
            var tagLine = [];
            var nIndexLine = cols * i * dimensions;
            for (var j = 0; j < cols; j++) {
                var nIndex = nIndexLine + j * dimensions;
                var z;
                if (bWind) {
                    z = dvalues[nIndex + 1];
                    grid.push(Math.round(dvalues[nIndex + 1])); //风速在前
                    grid.push(Math.round(dvalues[nIndex]));   //风向在后
                }
                else {
                    z = dvalues[nIndex];
                    if(z == -9999){
                        z = 0;
                    }
                    grid.push(Math.round(z * 10) / 10);
                    if (hasTag)
                        tagLine.push(dvalues[nIndex + 1]);
                }
                if (z != 9999 && z != -9999) {
                    if (z < dMin)
                        dMin = z;
                    if (z > dMax)
                        dMax = z;
                }
            }
            if (hasTag)
                tag.push(tagLine);
        }
        datasetGrid.grid = grid;
        datasetGrid.dMin = dMin;
        datasetGrid.dMax = dMax;
        if (hasTag) {
            datasetGrid.tag = tag;
            datasetGrid.defaultTag = 0;
        }
        return datasetGrid;
    },
    /**
   * @author:杠上花
   * @date:2018-2-05
   * @modifyDate:
   * @return:
   * @description:清空GridLayer
   */
    clearGridLayer:function(layer){
        var dg = layer.datasetGrid;
        if(dg == undefined){
            return;
        }
        var rows = dg.rows;
        var cols = dg.cols;
        var grid = dg.grid;
        var noVal = dg.noDataValue;
        for(var r=0;r<rows;r++){
            for(var c=0;c<cols;c++){
                var index = r*cols + c;
                grid[index] = noVal;
            }
        }
        layer.setDatasetGrid(dg);
        layer.refresh();
    }
}