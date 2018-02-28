/**
 * Created by wangkun on 2016/7/12.
 * 霾填色风格
 * 开始值，结束值，开始颜色，结束颜色
 * 包含最小值，不包含最大值，也即左闭右开
 */
    var heatMap_GDYB_HZ = [
    {start:-1,end:-1,caption:"无",legend:"无", alpha:0, startColor:{red:255,green:255,blue:255},endColor:{red:255,green:255,blue:255}},
    {start:1,end:1,caption:"霾",legend:"霾",startColor:{red:220,green:200,blue:3},endColor:{red:255,green:255,blue:255}},
    {start:2,end:2,caption:"中度霾",legend:"中度霾",startColor:{red:179,green:110,blue:0},endColor:{red:255,green:255,blue:255}},
    {start:3,end:3,caption:"重度霾",legend:"重度霾",startColor:{red:128,green:0,blue:35},endColor:{red:255,green:255,blue:255}},
    {start:4,end:4,caption:"极重霾",legend:"极重霾",startColor:{red:70,green:0,blue:0},endColor:{red:255,green:0,blue:0}}
];