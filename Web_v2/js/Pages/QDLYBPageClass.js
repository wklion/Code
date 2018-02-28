function QDLYBPageClass() {
  this.renderMenu = function () {
    var html =
      `<div id="menu">
        <a href="" id="displayBtn"></a>
        <div id="menu_changeDiv">
          <a class="menu_change active">背景场</a>
          <a class="menu_change">临近预报</a>
          <a class="menu_change">短时预报</a>
        </div>     
        <div id="menu_bd"></div>
      </div>`;
    $(".map_div").append(html);
    //tab切换
    $('#menu_changeDiv a').click(function (e) {
      $(this).addClass("active").siblings().removeClass("active");
      GDYB.mapUtil.clearMap();
      if (this.innerHTML == "背景场") {
        let backgroundFieldMenu = new BackgroundFieldMenu();
        backgroundFieldMenu.renderMenu();
        backgroundFieldMenu.initEvent();
        backgroundFieldMenu.initRes();
      }
      else if (this.innerHTML == "临近预报") {

        var nowCasting = new NowcastingMenu();
        nowCasting.renderMenu();
      }

      else if (this.innerHTML == "短时预报") {
        var shortForecastingMenu = new ShortForecastingMenu();
        shortForecastingMenu.renderMenu();
        shortForecastingMenu.initRes();
        shortForecastingMenu.initEvent();
      }
    });
    $('#menu_changeDiv a:first').click();
  }
}
