function AlertInfo() {
  this.init = function () {
    // console.log("alertInfo init");
    let html = `<div id="alertInfo" class="alertInfo"></div>`;
    $("#content").append(html);
    $("#alertInfo").hide();
  };
  this.show = function (str = "") {
    $("#alertInfo").html(str).show();
  };
  this.hide = function (str = "") {
    $("#alertInfo").html(str).show();
    setTimeout(function () {
      $("#alertInfo").html(str).hide();
    }, 2000)
  };
}
