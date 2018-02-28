/**
 * Created by allen_000 on 2015/7/15.
 * 降水填色风格
 * 开始值，结束值，开始颜色，结束颜色
 * 包含最小值，不包含最大值，也即左闭右开
 */
    var heatMap_Rain24Styles = [
    {start:0.0,end:0.0,caption:"无雨",alpha:0,startColor:{red:255,green:255,blue:255},endColor:{red:152,green:251,blue:152}},
    {start:0.1,end:10.0,caption:"小雨",startColor:{red:152,green:251,blue:152},endColor:{red:152,green:251,blue:152}},
    {start:10.0,end:25.0,caption:"中雨",startColor:{red:34,green:139,blue:34},endColor:{red:34,green:139,blue:34}},
    {start:25.0,end:50.0,caption:"大雨",startColor:{red:92,green:172,blue:238},endColor:{red:92,green:172,blue:238}},
    {start:50.0,end:100.0,caption:"暴雨",startColor:{red:0,green:0,blue:205},endColor:{red:0,green:0,blue:205}},
    {start:100.0,end:250.0,caption:"大暴雨",startColor:{red:238,green:0,blue:238},endColor:{red:238,green:0,blue:238}},
    {start:250.0,end:500.0,caption:"特大暴雨",startColor:{red:139,green:0,blue:0},endColor:{red:139,green:0,blue:0}},
    {start:0.1,end:2.5,caption:"小雪",tag:1,startColor:{red:206,green:206,blue:206},endColor:{red:152,green:251,blue:152}},
    {start:2.5,end:5.0,caption:"中雪",tag:1,startColor:{red:165,green:165,blue:165},endColor:{red:34,green:139,blue:34}},
    {start:5.0,end:10.0,caption:"大雪",tag:1,startColor:{red:115,green:115,blue:115},endColor:{red:92,green:172,blue:238}},
    {start:10.0,end:20.0,caption:"暴雪",tag:1,startColor:{red:74,green:74,blue:74},endColor:{red:0,green:0,blue:205}}
];