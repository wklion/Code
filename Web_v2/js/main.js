﻿var GDYB = {
  // 用户模块 FIXME demo
  User: {
    getName: function () {
      return 'admin';
    },
    getDepart: function () {
      return '62';
    }
  },
  FeatureUtilityClass: new FeatureUtilityClass(),
  Com: null,
  mapUtil: null
};
GDYB.Page = {
  curPage: null,
  curModuleID: "home",
  curModule: null, //当前模块
  alertInfo: null,
  initEvent: function () {
    var t = this;
    $(".nav-item").on("click", function () {
      var $t = $(this);
      var a = $t.find("a");
      $t.addClass("active").siblings(".active").removeClass("active");
      $(".brand .title").text(a.attr("title")).attr("href", a.attr("href"));
      t.curModuleID = this.id;
      t.main();

    });
  },
  main: function () {
    $(".delete").remove();
    if (this.curModuleID === "home") {
      var home = new Home();
      home.initEvent();
    } else if (this.curModuleID === "zhgc") {
      GDYB.mapUtil = new MapUtil();
      GDYB.Page.alertInfo = new AlertInfo();
      GDYB.Page.alertInfo.init();
      var zhjcmenu = new ZHJCMenuClass();
      zhjcmenu.renderMenu();
    } else if (this.curModuleID === "qdl") {
      GDYB.mapUtil = new MapUtil();
      GDYB.Page.alertInfo = new AlertInfo();
      GDYB.Page.alertInfo.init();
      var qdlPage = new QDLYBPageClass();
      qdlPage.renderMenu();
    } else if (this.curModuleID === "qxyj") {
      GDYB.mapUtil = new MapUtil();
    } else if (this.curModuleID === "ybzz") {
      GDYB.mapUtil = new MapUtil();
      var ybzzPage = new YBZZPageClass();
      ybzzPage.renderMenu();
      ybzzPage.initEvent();
    } else if (this.curModuleID === "yjxh") {
      GDYB.mapUtil = new MapUtil();
      var YJXHPage = new YJXHPageClass();
      YJXHPage.map = GDYB.mapUtil.map;
      YJXHPage.renderMenu();
    } else if (this.curModuleID === "yqkb") {
      var yqkbpage = new YQKBPageClass();
      yqkbpage.renderMenu();

    } else if (this.curModuleID === "jypg") {

      var gdjy = new GDJYPageCLass();
      gdjy.renderMenu();
      gdjy.initEvent();
      GDYB.mapUtil = new MapUtil($("#gdjyMap"));
    } else if (this.curModuleID === "znzs") {
      GDYB.mapUtil = new MapUtil();
      var ZNZSPage = new ZNZSPageClas();
      ZNZSPage.renderMenu();
      ZNZSPage.initEvent();
    } else if (this.curModuleID === "sjjk") {
      var GMSMonitor = new GMSMonitorPageClass();
      GMSMonitor.renderMenu();
    }
    GDYB.Com = new Common();
    GDYB.Title = new TitleControl();//标题控件
    GDYB.Legend = new LegendControl();//图例控件
  },


}
