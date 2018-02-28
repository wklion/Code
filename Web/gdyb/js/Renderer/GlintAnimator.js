/**
 * 闪烁动画
 * @author rexer
 * @date   2017-01-17
 */

WeatherMap.Renderer.GlintAnimator = WeatherMap.Class(WeatherMap.Renderer.AnimatorCanvas, {
	pointStyle: { //默认样式
		fillOpacity: 0.3,
		pointRadius: 15, //外圈半径
		gradient: false
	},
	initialize: function() {
		WeatherMap.Renderer.AnimatorCanvas.prototype.initialize.apply(this, arguments);
		this.glintId = {};
	},
	drawPoint: function(geometry, style, featureId, frontGeometry, backGeometry) {
		if (style.graphic || style.fill === false) {
			WeatherMap.Renderer.AnimatorCanvas.prototype.drawPoint.apply(this, arguments);
			return;
		}
		var me = this;
		var elem = me.features[featureId][0],
			// nodeType = elem.frontFeature,
			pt = me.getLocalXY(geometry),
			x = pt[0],
			y = pt[1],
			endAngle = Math.PI * 2,
			radius = style.pointRadius;

		// 描点
		me.setCanvasStyle('fill', style);
		me.canvas.beginPath();
		me.canvas.arc(x, y, radius, 0, endAngle, true);
		me.canvas.fill();

		// 外圈半径
		var key = elem.attributes[me.layer.featureIdName] || elem.id;
		var val = me.glintId[key];
		if (!val) {
			me.glintId[key] = Math.random() + 0.5;
		} else {
			if (val + 0.1 > 1) {
				val = val + 0.1 - 1;
			} else {
				val += 0.1;
			}
			me.glintId[key] = val;
		}

		// 获取外圈样式
		var s = Object.assign({}, style, me.pointStyle),
			outterRadius = s.outterRadius || me.pointStyle.pointRadius;

		// if (s.gradient) {
		//     var gradient = s.gradient;
		//     if (gradient.color) {
		//         var color = gradient.color;
		//         s.fillColor = color;
		//     } else {
		//         gradient.color = s.fillColor;
		//     }
		//     me.pointStyle.gradient = gradient;
		// }

		me.setCanvasStyle('fill', s);
		me.canvas.beginPath();
		me.canvas.arc(x, y, outterRadius * (1 + val * 2), 0, endAngle, true);
		me.canvas.fill();

		if (me.hitDetection) {
			me.setHitContextStyle('fill', featureId, style);
			me.hitContext.beginPath();
			me.hitContext.arc(x, y, radius, 0, endAngle, true);
			me.hitContext.fill();
		}

		// 绘制边线
		if (style.stroke !== false) {
			me.setCanvasStyle('stroke', style);
			me.canvas.beginPath();
			me.canvas.arc(x, y, radius, 0, endAngle, true);
			me.canvas.stroke();
			if (me.hitDetection) {
				me.setHitContextStyle('stroke', featureId, style);
				me.hitContext.beginPath();
				me.hitContext.arc(x, y, radius, 0, endAngle, true);
				me.hitContext.stroke();
			}
			me.setCanvasStyle('reset');
		}
	},
	// drawLineString:function(){},
	// drawPolygon:function(){},
	CLASS_NAME: 'WeatherMap.Renderer.GlintAnimator'
});
