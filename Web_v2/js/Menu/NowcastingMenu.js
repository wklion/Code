function NowcastingMenu() {
    this._init_();
}

NowcastingMenu.prototype = {
    constructor: NowcastingMenu,
    preventMeasure: "1.政府及相关部门按照职责做好防范短时强降水、防雷、防大风准备工作；\r\n2. 防范短时强降水可能引发的山洪、泥石流等地质灾害；\n3.户外行人和工作人员减少户外活动，注意远离棚架广告牌等搭建物；\n4.相关水域水上作业和过往船舶采取回港规避或者绕道航行等积极应对措施，工地注意遮盖建筑物资，妥善安置易受风雨影响的室外物品。",
    vectorLayer:null,//失量图层
    gridLayer:null,//格点图层
    areas:[],//所有区域
    areaLayer:null,//区域图层
    selectFeature:null,
    drawLayer:null,//画图图层
    drawControl:null,//画图控件
    levelObj:{
        blue:"蓝色",
        yellow:"黄色",
        orange:"橙色",
        red:"红色"
    },
    elements:[
        {name:"stsp", caption:"短时强降水",value:1},
        {name:"ts", caption:"雷暴",value:2},
        {name:"tsgh", caption:"雷暴大风或冰雹",value:3}
    ],
    _init_: function () {
        var me = this;
        this.name = "临近预报菜单";
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
        this.gridLayer.items = levelColor;
        this.gridLayer.setDatasetGrid(dg);

        this.drawLayer = lmu.addLayer("画图图层","vector",null,null,"Canvas2");
        // this.drawLayer.style = {
        //     strokeColor: "#ff0000",
        //     strokeWidth: 2.0,
        //     fillColor: "#ff0000",
        //     fillOpacity: "0"
        // };
        this.drawControl = new WeatherMap.Control.DrawFeature(this.drawLayer, WeatherMap.Handler.PolygonFree);
        this.drawControl.events.on({ "featureadded": function(feature){
            me.updateDatasetGrid(feature);
        } });
        lmu.addControl(this.drawControl);
    },
    renderMenu: function () {
        let me = this;
        let html = `<div id="yjForecastDiv">
        <div id="div_QianFaRen">
            <div class="qdlTitleBar">签发人：</div>
            <div id="issueor" class="menuDropDown" name="model">
                <!--<input class="inputYuBaoyuan" type="text">-->
                <select id="selectQianFaRen" class="selectYuBaoYuan">
                <option>黄武斌</option>
                <option>杨建才</option>
                <option>刘新伟</option>
                <option>赵庆云</option>
                <option>许东蓓</option>
                <option>黄玉霞</option>
                <option>傅朝</option>
                </select>
            </div>
        </div>
        <div id="yjqs_div_datetime">
            <div class="qdlTitleBar">时次：</div>
            <!--<div class="menuDropDown" name="model">-->
                <!--<span id="yjqs_selectMakeTime" value="8">08时</span>-->
                <!--<div id="makeTimeDiv" class="selectYuBaoYuan">-->
                    <!--<div value="8">08时</div>-->
                    <!--<div value="20">20时</div>-->
                <!--</div>-->
            <!--</div>-->
            <div id="yjqs_dateSelect">
                <div>
                <!--<img class="dateBtn" src="imgs/dateBtn1.png">-->
                <input type="datetime-local" value="2017-06-10T23:00">
                
                <!--<img class="dateBtn" src="imgs/dateBtn2.png">-->
                </div>
            </div>
            <div></div>
        </div>
        <div id="yjqs_divElement">
            <div class="qdlTitleBar">类型：</div>
            <div class="qdlContentDiv">
                <button id="stsp" value="2" class="active">雷暴</button>
                <button id="ts" value="1">短时强降水</button>
                <button id="tsgh" value="3">雷暴大风或冰雹</button>
            </div>
        </div>
        <div id="yjqs_warnLevel">
            <div class="qdlTitleBar">等级：</div>
            <div class="qdlContentDiv">
                <button id="ts" value="1" class="active" flag="blue">蓝色</button>
                <button value="2" flag="yellow">黄色</button>
                <button value="3" flag="orange">橙色</button>
                <button value="3" flag="red">红色</button>
            </div>
        </div>
        <div>
            <textarea id="yjqs_txtContent"></textarea>
            <textarea id="guide"></textarea>
            <div id="controlBtn" class="qdlContentDiv">
                <button id="btnGridEdit">格点编辑</button>
                <button id="btnAreaSelect">区域选择</button>
                <button id="btnCancel">放弃编辑</button>
                <button id="btnSave">发布预警</button>
                <button id="brush">画刷</button>
            </div>
        </div>
        <div>
            <div class="title1">近期预警 <span class="moreForecast">更多</span></div>
            <div id="divProductsOfRecent24H_qsyb">
                <div id="1107866" class="active">12-18 10:00 兰州中心气象台发布
                    <img src="imgs/messageIcon.png"></div>
            </div>
            <div id="yjqs_divContent">
                兰州中心气象台2017年12月18日10时00分发布预警潜势：预计9时-15时，张家川回族自治县、静宁县、庄浪县、秦安县等地将出现短时强降水。请注意防范。
            </div>
        </div>
    </div>`;
        $("#menu_bd").html(html);

        initRes();
        initEvent();
        //初始化资源
        async function initRes(){
            //初始化时间
            var dateControl = $("#yjqs_dateSelect input")[0];
            var now = new MyDate();
            var strDateTime = now.format("yyyy-MM-ddThh:mm");
            dateControl.value = strDateTime;

            $("#guide").val(me.preventMeasure);
            var selectColor = $("#yjqs_warnLevel button.active").attr("flag");
            //下载区域数据，并转成feature
            var areas = await me.downAreas();
            var fuc = new FeatureUtilityClass();
            for (var key in areas) {
                var feature = fuc.getFeatureFromJson(JSON.parse(areas[key]));
                feature.style = {
                    fillColor: selectColor,
                    fillOpacity: "0"
                };
                me.areas.push(feature);
            }
            me.areaLayer.addFeatures(me.areas);
        }
        function initEvent(){
            $("#btnGridEdit").on("click",function(){
                me.startDraw();
            });
            $("#btnAreaSelect").on("click",function(){
                me.selectFeature.activate();
            });
            $("#btnCancel").on("click",function(){
                me.selectFeature.deactivate();
                me.stopDraw(me);
                me.areaLayer.features.forEach(item=>{
                    item.style.fillOpacity = "0";
                });
                me.areaLayer.redraw();
                var com = new Common();
                com.clearGridLayer(me.gridLayer);
            });
            $("#yjqs_warnLevel button").on("click",function(){
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                var selectColor = $(this).attr("flag");
                //levelChange(selectColor);
            });

            $("#yjqs_divElement button").on("click",function(){
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            });
        }
        //暂时不用
        function levelChange(color){
            me.areaLayer.features.forEach(item=>{
                item.style.fillColor = color;
            });
        }
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
    startDraw:function(){
        var me = this;
        if(me.drawLayer.features.length>0){
            me.drawLayer.removeAllFeatures();
        }
        me.drawControl.activate();
        me.stopDragMap();
    },
    stopDraw:function(me){
        me.startDragMap();
        me.drawControl.deactivate();
    },
    stopDragMap:function(){
        var me = this;
        var map = GDYB.mapUtil.map;
        for (var i = 0; i < map.events.listeners.mousemove.length; i++) {
            var handler = map.events.listeners.mousemove[i];
            if (handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag") {
                handler.obj.active = false;
            }
        }
    },
    startDragMap:function(){
        var map = GDYB.mapUtil.map;
        for(var i =0; i < map.events.listeners.mousemove.length; i++) {
          var handler = map.events.listeners.mousemove[i];
          if(handler.obj.CLASS_NAME == "WeatherMap.Handler.Drag")
          {
              handler.obj.active = true;
          }
        }
    },
    /**
   * @author:wangkun
   * @date:2017-12-19
   * @modifyDate:
   * @return:
   * @description:更新格点
   */
    updateDatasetGrid:function(feature){
      var me = this;
      var selectColor = $("#yjqs_warnLevel button.active").attr("flag");
      var geoRegion = feature.feature.geometry;
      var val = $("#yjqs_warnLevel button.active").attr("value");
      val = parseInt(val);
      var gridProductClass = new GridProductClass();
      var dg = me.gridLayer.datasetGrid;
      let id = $("#yjqs_divElement button.active")[0].id;
      gridProductClass.fillRegion(dg, geoRegion, val, 0, id, false);
      me.gridLayer.setDatasetGrid(dg);
      me.gridLayer.refresh();
      me.drawLayer.removeAllFeatures();
      me.drawLayer.redraw();
      me.convertToText();
    },
    /**
   * @author:wangkun
   * @date:2017-2-6
   * @modifyDate:
   * @return:
   * @description:生成文本
   */
    convertToText:function(){
      var me = this;
      var strContent = "";
      if(me.areas.length<1){
          return;
      }
      var selectType = $("#yjqs_divElement button.active").text();//选中要素
      var val = $("#yjqs_warnLevel button.active").attr("value");
      var gridProductClass = new GridProductClass();
      var dg = me.gridLayer.datasetGrid;
      var now = new MyDate();
      var makeTime = now.format("yyyy年MM月dd日 hh时mm分");
      var strContent = "";
      var strArea = "";
      for(var key in me.areas) {
        var feature = me.areas[key];
        if (gridProductClass.contain(dg, feature.geometry, val)){
          strArea += feature.attributes["NAME"] + "、";
        }
      }
      if (strArea.length <0) {
        return;
      }
      strArea = strArea.substr(0, strArea.length - 1);
      strContent = strArea + "等地将出现" + selectType;
      var strContent = "兰州中心台" + makeTime + "发布临近预报：预计未来2小时，"+ strContent +"。请注意防范。";
      $("#yjqs_txtContent").val(strContent);
    }
}
