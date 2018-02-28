//标题控件
function TitleControl() {
  this._init_();
}
TitleControl.prototype = {
  constructor: TitleControl,
  allTitle:new MyArray(),
  allTitleName:new MyArray(),
  _init_: function () {
    $("#map_div").append(`
      <div id="map_title_div" class="map_title_div"></div>
    `);
  },
  /**
   * @author:wangkun
   * @date:2017-12-20
   * @modifyDate:
   * @return:
   * @description:添加标题
   */
  add:function(name,strDateTime,isOne){
    var me = this;
    if(isOne){
      me.allTitleName = new MyArray();
      me.allTitle = new MyArray();
    }
    var isContain = me.allTitleName.contain(name);
    if(isContain){
      me.allTitle.forEach(item=>{
        if(item.name === name){
          item.dateTime = strDateTime;
        }
      });
    }
    else{
      me.allTitle.push({
        name:name,
        dateTime:strDateTime
      });
      me.allTitleName.push(name);
    }
    var html = "";
    //刷新
    me.allTitle.forEach(item=>{
      html += "<div>"+item.name+"  "+item.dateTime+"</div>"
    });
    $("#map_title_div").html(html);
  }
}