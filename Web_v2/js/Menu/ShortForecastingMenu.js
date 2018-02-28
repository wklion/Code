function ShortForecastingMenu() {
  this._init_();
}
ShortForecastingMenu.prototype = {
  constructor: ShortForecastingMenu,
  areas:[],//所有区域
  vectorLayer:null,//失量图层
  gridLayer:null,//格点图层
  areaLayer:null,//区域图层
  selectFeature:null,
  drawLayer:null,//画图图层
  drawControl:null,//画图控件
  _init_: function () {
    this.name = "短时预报";
  },
  renderMenu:function () {
    let html = `
      <div class="ShortForecasting"> 
        <dl>  
          <dt>时次:</dt>
          <dd id="shortForecasting_Datetime"><input type="datetime-local"></dd>
          <dt>绘图:</dt>
          <dd><button></button><button></button></dd>
          <dt>时效:</dt>
          <dd><button class="active">12H</button><button>24H</button></dd>
          <dt>类型:</dt>
          <dd><button class="active">雷暴</button><button>短时强降水</button><button>雷暴大风或冰雹</button></dd>
          <dt>格距:</dt>
          <dd><button>0.5</button><button>0.25</button><button class="active">0.125</button></dd>
        </dl>
        
        <div class="edit_grid"> 
          <textarea name="" id="" cols="30" rows="10"></textarea>
          <div>  
            <button>格点编辑</button><button>站点选择</button><button>放弃编辑</button><button>提交预报</button>
          </div>
        </div>
        
        <div class="YBhistory"> 
          <p><span>近期预报</span><span>更多</span></p>
          <div></div>
        </div>
      </div>`;
    $("#menu_bd").html(html);
  },
  initRes:function(){
    var me = this;
    var dateControl = $("#shortForecasting_Datetime input")[0];
    var now = new MyDate();
    var strDateTime = now.format("yyyy-MM-ddThh:00");
    dateControl.value = strDateTime;
    var lmu = new LayerManagerUtil();
    this.vectorLayer = lmu.addLayer("失量图层","vector"); 
    this.gridLayer = lmu.addLayer("格点图层","grid");
    this.areaLayer = lmu.addLayer("区域图层","vector",null,null,"Canvas2");
    this.selectFeature = new WeatherMap.Control.SelectFeature(this.areaLayer,{
        callbacks:{
            click:function(feature){
                me.areaSelected(feature,me);
            }
        }
    });
    lmu.addControl(this.selectFeature);
    var com = new Common();
    var dg = com.createDatasetGrid(0.01);
    this.gridLayer.items = heatMap_CalamityStyles;
    this.gridLayer.setDatasetGrid(dg);
    this.drawLayer = lmu.addLayer("画图图层","vector",null,null,"Canvas2");
    this.drawControl = new WeatherMap.Control.DrawFeature(this.drawLayer, WeatherMap.Handler.PolygonFree);
    this.drawControl.events.on({ "featureadded": function(feature){
        me.updateDatasetGrid(feature);
    } });
    lmu.addControl(this.drawControl);

    me.downAreas().then(function(data){
      var fuc = new FeatureUtilityClass();
      for (var key in data) {
        var feature = fuc.getFeatureFromJson(JSON.parse(data[key]));
        feature.style = {
            fillColor: "green",
            fillOpacity: "0"
        };
        me.areas.push(feature);
      }
      me.areaLayer.addFeatures(me.areas);
    });
  },
  initEvent:function () {
    
  },
  /**
   * @author:wangkun
   * @date:2017-12-19
   * @modifyDate:
   * @return:
   * @description:下载区域
   */
  downAreas:function(){
      var url = gridServiceUrl + "services/AdminDivisionService/getChildDivisionInfo";
      var param = {
          areaCode:'62',
          level:'cty'
      };
      var pro = request('POST', url, param);
      return pro;
  },
    /**
 * @author:wangkun
 * @date:2017-12-19
 * @modifyDate:
 * @return:
 * @description:区域选中后
 */
  areaSelected:function(feature,me){
    if(feature.style.fillOpacity === "1"){
        feature.style.fillOpacity = "0";
    }
    else{
        feature.style.fillOpacity = "1";
    }
    var selectColor = $("#yjqs_warnLevel button.active").attr("flag");
    feature.style.fillColor = selectColor;
    feature.layer.redraw();

    //生成文字
    let type = $("#yjqs_divElement button.active").text();

    var now = new MyDate();
    var strDate = now.format("yyyy年MM月dd日hh时mm分");
    var txt = "兰州中心气象台"+strDate+"发布临近预报:";

    var areaNames = "";
    var colors = ["red","orange","yellow","blue"];
    colors.forEach(colorItem=>{
        var areaNames = "";
        feature.layer.features.forEach(item=>{
            if(item.style.fillOpacity === "0"){
                return;
            }
            var color = item.style.fillColor;
            if(color != colorItem){
                return;
            }
            areaNames += item.attributes["NAME"]+"、";
        });
        if(areaNames.length<1){
            return;
        }
        areaNames = areaNames.substring(0,areaNames.length-1);
        var strColor = me.levelObj[colorItem];
        areaNames += "等地将出现"+strColor+"等级的"+type;
        txt += areaNames;
        txt += ";";
    });
    $("#yjqs_txtContent").val(txt);
  },
}
