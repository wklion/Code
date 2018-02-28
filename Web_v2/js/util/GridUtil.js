/*
*作者:wangkun
*日期:2017.1.14
*功能:格点相关
 */
var gu = (function (){
	return {
		ConvertToDatasetGrid:function(data,elementid){//转换data成datasetGrid
			var datasetGrid = null;
			var dvalues = data.dvalues;
			var size=dvalues.length;
			var rows=data.rows;
			var cols=data.cols;
			var bWind = (elementid == "10uv" || elementid == "wmax");
			var hasTag = (!bWind)&&(size==rows*cols*2);
			var dimensions = (bWind||hasTag) ? 2 : 1; //维度，风场有两维；带有Tag属性也是两维
			var dMin = 9999;
            var dMax = -9999;
            datasetGrid = new WeatherMap.DatasetGrid(data.left, data.top, data.right, data.bottom, data.rows, data.cols, bWind?2:1); //只有风是两要素
			datasetGrid.noDataValue = data.noDataValue;
			if (data.nwpmodelTime != null)
                nwpModelTime = data.nwpmodelTime;
            var grid = [];
            var tag = [];
            for (var i = 0; i < rows; i++) {
            	var tagLine = [];
            	var nIndexLine = cols * i * dimensions;
            	for (var j = 0; j < cols; j++) {
            		var nIndex = nIndexLine + j * dimensions;
            		var z;
            		if (bWind){
            			z = dvalues[nIndex + 1];
                        grid.push(Math.round(dvalues[nIndex+1])); //风速在前
                        grid.push(Math.round(dvalues[nIndex]));   //风向在后
                    }
                    else {
                    	z = dvalues[nIndex];
                    	grid.push(Math.round(dvalues[nIndex] * 10) / 10);
                    	if(hasTag)
                    		tagLine.push(dvalues[nIndex+1]);
                    }
                    if (z != 9999 && z != -9999) {
                    	if (z < dMin)
                    		dMin = z;
                    	if (z > dMax)
                    		dMax = z;
                    }
            	}
            	if(hasTag)
                    tag.push(tagLine);
            }
            datasetGrid.grid = grid;
            datasetGrid.dMin = dMin;
            datasetGrid.dMax = dMax;
            if(hasTag){
            	datasetGrid.tag = tag;
            	datasetGrid.defaultTag = 0;
            }
			return datasetGrid;
		},
		/**
		 * @author:wangkun
		 * @date:2017-01-17
		 * @param:
		 * @return:
		 * @description:计算等值面
		 */
		CalDZM:function(datasetGrid,item,hour){
			//let map = GDYB.Page.curPage.map;
			//let layer = new WeatherMap.Layer.Vector("Test", {renderers: ["Canvas2"]});
			//layerContour.renderer.labelField = "值";
			/*layerContour.style = {
				fontFamily:"Arial",
				fontColor:"#333",
				fontSize:"14px",
				fontWeight:"bold",
				strokeColor: "#ff0000",
				strokeWidth: 1.0
			};*/
			//layerContour.renderer.labelField = "dZValue";
			//layer.setOpacity(0.5);
			var style = {fillColor: "#ff0000"};
                	//layerContour.removeAllFeatures();
			//map.addLayers([layer]);
			var dZValues = [];
            var val = 0;
            dZValues.push(val);
			var itemSize=item.length;
			for(var i=0;i<itemSize;i++){
				var val=item[i].end;
				dZValues.push(val);
			}
			var contour = new WeatherMap.Analysis.Contour();
			var result = contour.analysis(datasetGrid, dZValues, 6); //6为平滑度
			var size=result.length;
			var features= [];
			for(var i=0;i<size;i++){
				var dZValue=result[i].dZValue;
				var geoline=result[i].geoline;
				var comCount=geoline.components.length;
				if(comCount<10){
					continue;
				}
				var linearRings = new WeatherMap.Geometry.LinearRing(geoline.components);
				var region = new WeatherMap.Geometry.Polygon([linearRings]);
				var feature = new WeatherMap.Feature.Vector(region,{
					FEATUREID:region.id,
					TIME:hour
				},style);
				feature.attributes.dZValue = dZValue.toString();
				features.push(feature);
			}
			//layer.addFeatures(contours);
			return features;
		}
	}
})();
