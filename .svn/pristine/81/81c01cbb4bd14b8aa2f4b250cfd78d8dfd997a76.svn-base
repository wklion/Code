/**
 * 灾害天气预警信号制作
 * @author rexer
 * @class
 * @requires clazz
 * @requires jQuery
 * @requires T
 * @requires layui
 * @requires layer
 * @requires moment
 */
var AlertSignalProduce = clazz({
	CONST: { //常量
		step_amount: 2, //总步骤数
		service: T.url('WAPDService', 'AlertSignalService'), //预警信号服务
		date_format: 'YYYYMMDDHHmmss', //时间格式
		icon_url: T.CTX + 'imgs/WarningIcon/', // 图标地址
		signal_change: ['首发', '确认', '变更', '解除'], //信号状态
		signal_dict: { //信号字典
			'暴雨': ['蓝色', '黄色', '橙色', '红色'],
			'高温': ['黄色', '橙色', '红色'],
			'干旱': ['橙色', '红色'],
			'大风': ['蓝色', '黄色', '橙色', '红色'],
			'台风': ['蓝色', '黄色', '橙色', '红色'],
			'大雾': ['黄色', '橙色', '红色'],
			'雷电': ['黄色', '橙色', '红色'],
			'寒潮': ['蓝色', '黄色', '橙色', '红色'],
			'霜冻': ['蓝色', '黄色', '橙色'],
			'暴雪': ['蓝色', '黄色', '橙色', '红色'],
			'冰雹': ['橙色', '红色'],
			'道路结冰': ['黄色', '橙色', '红色'],
			'霾': ['黄色', '橙色', '红色']
		}
	},
	AREA_INFO: null, //区域信息
	ALERT_CONTEXT: null, //预警文本
	PRODUCE_DOC: null, //预警页面模版(document对象)
	FORM_DATA: { //表单数据
		_STEP_: 0 //初始步骤
	},
	getAlertIcon: function(icon) {
		return this.CONST.icon_url + icon + '.jpg';
	},
	getAlertColor: function(level) {
		switch (level) {
			case '蓝色':
				return 'blue';
			case '黄色':
				return 'yellow';
			case '橙色':
				return 'orange';
			case '红色':
				return 'red';
		}
	},
	getAlertChange: function(changes) {
		return this.CONST.signal_change[changes];
	},
	// 空白预警信号参数
	getPlainSignalPara: function() {
		return {
			alertId: '',
			alertPID: '',
			province: '甘肃',
			city: '',
			areaCode: '',
			stationName: '',
			stationId: '',
			signalType: '',
			signalLevel: '',
			issueTime: '',
			issueContent: '',
			recoveryChannel: '',
			relieveTime: '',
			dstandardtune: '',
			distinctionlevel: '',
			dffectvaluate: '',
			docietybenefit: '',
			tnumber: 0,
			underWriter: '',
			operator: '',
			changes: 0
		};
	},
	/**
	 * Event 定义
	 * @type {Object}
	 */
	_HOOKS_: {
		/**
		 * 数据准备完成
		 */
		ready: $.Callbacks('memory once'),
		/**
		 * 预警添加完成
		 */
		added: $.Callbacks('stopOnFalse'),
		/**
		 * 当前步骤完成
		 * @private
		 */
		endStep: $.Callbacks('unique stopOnFalse'),
		/**
		 * 开始下一步
		 * @private
		 */
		nextStep: $.Callbacks('unique stopOnFalse'),
	},
	/**
	 * 绑定事件
	 */
	on: function(event, handler) {
		var callback = this._HOOKS_[event];
		if (!callback) return;
		if (T.isFunction(handler))
			callback.add(handler);
		return this;
	},
	/**
	 * 取消事件绑定
	 */
	off: function(event, handler) {
		var callback = this._HOOKS_[event];
		if (!callback) return;
		if (T.isFunction(handler))
			callback.remove(handler);
		else callback.empty();
		return this;
	},
	/**
	 * 激活事件
	 */
	fire: function(event) {
		var callback = this._HOOKS_[event];
		if (!callback) return;
		callback.fire.apply(callback, [].slice.call(arguments, 1));
		return this;
	},
	addEvent: function(event, callbacks) {
		this._HOOKS_[event] = callbacks;
		return this;
	},
	init: function(option) {
		this.option = $.extend(true, {
			signalType: '暴雨',
			signalLevel: '蓝色',
			changes: 0,
			alertPID: '', //解除预警时必选
			areas: [], //默认区域信息
			user: { //默认省局用户
				userName: '测试用户',
				province: '甘肃',
				areaCode: 62,
				areaName: '甘肃省',
				stationId: 52889,
				stationName: '甘肃',
				lat: 36.05,
				lon: 103.88
			},
            depart:GDYB.GridProductClass.currentUserDepart,
			/**
			 * 添加之前
			 */
			onAddBefore: function(para) {
				return para;
			}
		}, option);

		// prepare
		var me = this;
		this.prepare().done(function(a, b, c) {
			me.fire('ready', a, b, c);
		}).fail(function(error) {
			layer.msg(error.message);
			throw error;
		});
	},
	updateSetting: function(option) {
		$.extend(true, this.option, option);
	},
	// 打开预警弹窗页面
	open: function() {
		if (!this._isReady_) throw new Error('This instance is NOT ready, Please execute `prepare` FIRST!');

		var me = this;
		var rootHTML = this.PRODUCE_DOC.querySelector('#root').innerHTML;
		// 弹出制作页面
		layui.use(['form', 'laydate', 'layedit'], function() {
			var form = layui.form();
				// 配置表单验证
			form.verify({
				// 时间格式验证 YYY-MM-DD HH:mm(:ss)
				datetime: [
					/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(|:\d{2})$/,
					'日期时间格式不正确'
				]
			});
			var pageIndex = layer.open({
				title: '预报制作',
				content: rootHTML,
				type: 1,
				skin: 'layui-layer-custom',
				area: ['1200px', '750px'], //默认宽度
				shadow: 0.1,
				scrollbar: false,
				maxmin: true,
				success: function(layero, index) {
					me.initPage(layero, index);
				}
			});
		});
	},
	// 预报制作页面初始化
	initPage: function(layero, index) {
		// Fix: By resizing, adjust childNode`s height to relative layout
		layer.full(index);
		setTimeout(function() { layer.restore && layer.restore(index) }, 100);

		var me = this,
			$mainPage = $(layero).find('.main'),
			$footer = $(layero).find('.footer')

		var stepArgs = [$mainPage, $footer, index];

		// 注册事件
		this.off('nextStep').on('nextStep', function(step) {
			var args = stepArgs.concat([].slice.call(arguments, 1));
			me.nextStep(step, args);
		});

		// 触发
		$footer.on('click', '.progress-btn', function() {
			me.fire('endStep');
		});

		// 初始化步骤
		this.nextStep(this.FORM_DATA._STEP_, stepArgs);
	},
	/**
	 * 下一步
	 * @param  {Number}   step 当前步骤
	 * @return {Boolean}
	 */
	nextStep: function(step, stepArgs) {
		// 总步骤数
		var STEP_AMOUNT = this.CONST.step_amount;
		// 完成
		if (step === STEP_AMOUNT) {
			layer.close(stepArgs[2]);
			return;
		}

		var nextStep = step + 1,
			$mainPage = stepArgs[0],
			$footer = stepArgs[1],
			$btn = $footer.find('.progress-btn'),
			stepController = this['stepPage' + nextStep],
			stepHTML = this.PRODUCE_DOC.querySelector('section.step[value="' + nextStep + '"]').innerHTML;

		// 载入下一页面
		$mainPage.html(stepHTML);

		stepController.apply(this, stepArgs);

		// 更新进度条
		var progressRate = 100 * nextStep / STEP_AMOUNT;
		var progressText = nextStep + '/' + STEP_AMOUNT;
		// if (nextStep === STEP_AMOUNT) { $btn.text('完成'); }
		$footer.data('step', nextStep)
			.find('.progress-bar')
			.width(progressRate + '%')
			.attr('aria-valuenow', progressRate)
			.find('span').text(progressText);
	},
	// 步骤一
	stepPage1: function($mainPage, $footer, index) {
		var form = layui.form();

		this.off('endStep').on('endStep', function() {
			$('#form-submit').click();
		});

		var me = this,
			$treelist = $('#produce-area-list-tree'),
			$formSec_info = $('.form-section-info'),
			$formSec_weather = $('.form-section-weather'),
			$select_signalType = $formSec_info.find('select[name="signalType"]'),
			$select_signalLevel = $formSec_info.find('select[name="signalLevel"]'),
			$select_forcastor = $formSec_info.find('select[name="operator"]'),
			$select_signer = $formSec_info.find('select[name="underWriter"]'),
			$alertEditor = $('.alert-editor'),
			$guideEditor = $('.guide-editor'),
			$alertIcon = $('#warn-type-img');

		$footer.find('.btn').text('确定并制作');
		// 获取当前期号
		me.getTnumber().done(function(data) {
			$formSec_info.find('input[name="tnumber"]').val(data);
		});

		var alert_signal = me.CONST.signal_dict,
			user_areaName = me.option.user.areaName,
			user_areaCode = me.option.user.areaCode,
			defaultSignalType = me.option.signalType,
			defaultSignalLevel = me.option.signalLevel,
            depart_departName = me.option.depart.departName,
			check_type_opts = [],
			select_type_opts = [];

		// 灾害天气类型
		for (var key in alert_signal) {
			check_type_opts.push(`<input type="checkbox" title="${key}" value="${key}" lay-skin="primary">`);
			select_type_opts.push(`<option value="${key}">${key}</option>`);
		}


		// 更新select灾害级别
		function updateSelectLevel(signalType) {
			var levels = alert_signal[signalType];
			var opts = [];
			levels.forEach(function(value) {
				opts.push(`<option value="${value}">${value}</option>`);
			});
			$select_signalLevel.html(opts.join(''));
		}

		// 补充页面
		$formSec_weather.html(check_type_opts.join('')); // 伴随天气
		$select_signalType.html(select_type_opts.join('')); // 灾害种类
		// 设置默认预警信号
		updateSelectLevel(defaultSignalType);
		$select_signalType.find(`option[value="${defaultSignalType}"]`).attr('selected', 'selected');
		$select_signalLevel.find(`option[value="${defaultSignalLevel}"]`).attr('selected', 'selected');
		$('select[name="changes"]').find(`option[value="${me.option.changes}"]`).attr('selected', 'selected');
		// 发布单位 用户部门
		$formSec_info.find('select[name="city"]').html(`<option data-code="${user_areaCode}" value="${user_areaName}">${depart_departName}</option>`);
		$formSec_info.find('input[name="issueTime"]').val(moment().format('YYYY-MM-DD HH:mm'));

		//更新 预报员 签发人
		$select_forcastor.html("");
		$select_signer.html("");
		var forecastors = me.CONST.forecastors;
		if(forecastors.length) {
			for(var key in forecastors){
				var forecastor = forecastors[key];
				$select_forcastor.append("<option value=" + forecastor.name + ">" + forecastor.name + "</option>");
			}
		}
		else {
			$select_forcastor.append("<option value=''>请选择</option>");
		}

		var issuers = me.CONST.issuers;
		if(issuers.length) {
			for(var key in issuers){
				var issuer = issuers[key];
				$select_signer.append("<option value=" + issuer.name + ">" + issuer.name + "</option>");
			}
		}
		else {
			$select_signer.append("<option value=''>请选择</option>");
		}


		// 时间
		$('.lay-datepicker').click(function() {
			layui.laydate({
				elem: this,
				istime: true,
				format: 'YYYY-MM-DD hh:mm'
			});
		});

		// 重新渲染表单
		form.render();
		form.render('select');

		// 更改类型后生成文本
		function alertChanged() {
			var signalType = $select_signalType.val(),
				signalLevel = $select_signalLevel.val(),
				issueTime = $('input[name="issueTime"]').val(),
				city = $('select[name="city"]').val(),
				isJC = $('select[name="changes"]').val() == '3',
				dateStr = moment(issueTime).format('YYYY年MM月DD日HH时mm分'),
				depart = city + '气象台',
				alertName = signalType + signalLevel,
				// oldContext = $alertEditor.val(),
                areaNames = [];
                if(me.option.areas.length > 0){
                    for(var key in me.option.areas){
                        areaNames.push(me.option.areas[key].name);
                    }
                }

			// 全部选中的城市
			var checkedCities = listTree.getNodesByFilter(function(node) {
				return node.level == 1 && node.checked && !node.getCheckStatus().half;
			});
			// 部分选中的城市
			var halfCheckedCities = listTree.getNodesByFilter(function(node) {
				return node.level == 1 && node.checked && node.getCheckStatus().half;
			});
			var checkedXians = [];
			halfCheckedCities.forEach(function(item) {
				var pId = item.id;
				var children = listTree.getNodesByFilter(function(node) {
					return node.pId == pId && node.checked;
				});
				checkedXians = checkedXians.concat(children);
			});
			checkedCities.concat(checkedXians).forEach(function(item) {
				areaNames.push(item.name);
			});


			// 更新预警类容
			var alertContext = me.ALERT_CONTEXT[alertName] || '';
			var context = depart + dateStr + (isJC ? '解除' : '发布') + alertName +
				'预警，' + (isJC ? '解除' : '') +
				'预警区域：' + areaNames.join('、') + '。\n';

			// TODO 预报文字描述
			if (!isJC) context += '预警标准：' + alertContext.text;

			$alertEditor.val(context).data('alertContext', alertContext);
			$guideEditor.val(alertContext.guide.replace(/<br>/g, '\n'));

			// 更新图标
			var icon = me.getAlertIcon(alertName);
			if ($alertIcon.attr('src') !== icon) {
				$alertIcon.attr('src', icon);
			}
		}

		// 初始化行政区划树
		var listTree = $.fn.zTree.init($treelist, {
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onCheck: alertChanged
			}
		}, me.applyTree());

		// 监听
		form.on('select(alert-changes)', function(data) {
			// 解除预警

			alertChanged();
		});

		form.on('select(alert-type)', function(data) {
			updateSelectLevel(data.value);
			layui.form('select(alert-level)').render(); //重新渲染
			alertChanged();
		});
		form.on('select(alert-level)', alertChanged);
		form.on('select(alert-city)', alertChanged);
		$('input[name="issueTime"]').off('click').click(function() {
			layui.laydate({
				elem: this,
				istime: true,
				format: 'YYYY-MM-DD hh:mm',
				choose: alertChanged,
			});
		});

		// 监听表单提交(验证通过后触发)
		form.on('submit(submit)', function(data) {
			var formData = data.field;
			var alertContext = $alertEditor.val().replace(/\n/g, '<br>');
			var guideContext = $guideEditor.val().replace(/\n/g, '<br>');
			var para = me.getPlainSignalPara();
			var userInfo = me.option.user;

			//填充参数
			for (var key in para) {
				var value = formData[key];
				if (value !== undefined)
					para[key] = formData[key];
			}
			para.issueContent = alertContext;
			para.guide = guideContext;
			para.province = userInfo.province;
			para.stationId = userInfo.stationId;
			para.stationName = userInfo.stationName;
			//TODO 表单中添加该项
			// para.recoveryChannel = '大屏幕';
			para.issueTime = moment(para.issueTime).format(me.CONST.date_format);
			para.changes = Number(para.changes);

			me.produce(para, function(data) {
				me.fire('nextStep', 1, data);
			});

			return false;
		});

		//默认
		alertChanged();
	},
	// 步骤2
	stepPage2: function($mainPage, $footer, index, data) {

		// var fileUrl = me.CONST.service + 'queryAlertSignalFile';
		var me = this;
		this.off('endStep').on('endStep', function() {
			me.fire('nextStep', 2);
		});

		/**
		 * 生成页面
		 */

		var $pdf = $mainPage.find('.pdf-wrapper'),
			word = T.HOST + data.word,
			xml = T.HOST + data.xml,
			pdf = word.replace('.doc', '.pdf'),
			filename = data.alertId;

		// 展示PDF
		$pdf.html(`<iframe width="100%" height="100%" style="border:none;" src="${pdf}"></iframe>`);
		$mainPage.find('.btn.xml').attr({ href: xml, download: filename + '.xml' });
		$mainPage.find('.btn.word').attr({ href: word, download: filename + '.doc' });
		$mainPage.find('.btn.pdf').attr({ href: pdf, download: filename + '.pdf' });
		$footer.find('.btn').text('关闭');
	},
	// 步骤3
	stepPage3: function($mainPage, $footer, index) {
		var me = this;
		this.off('endStep').on('endStep', function() {
			me.fire('nextStep', 3);
		});
	},
	produce: function(para, callback) {
		// fire callback
		para = this.option.onAddBefore(para);

		var me = this;
		var addUrl = this.CONST.service + 'addAlertSignal';
		var loadIndex = layer.load(0, {
			time: 3000
		});

		function fail(err) {
			err = err || 'Undefined Error';
			console.error(err);
			layer.msg('预警信号添加失败：' + err);
		}

		return $.post(addUrl, T.paramize(para))
			.done(function(data) {
				if (data.issueTime === para.issueTime) {
					layer.msg('预警信号添加成功：' + data.alertId);
					callback(data);
					me.fire('added', data);
				} else {
					fail(data);
				}
			})
			.fail(function(a, b, c) {
				fail(c);
			})
			.always(function() {
				layer.close(loadIndex);
			});
	},
	applyTree: function() {
		var checkAreas = [];
		for (i = 0; i < this.option.areas.length; i++) {
			var areaCode = this.option.areas[i].code;
			checkAreas.push(areaCode);
		}
		// 选中区域正则式
		var expr = checkAreas.join('|');

		var me = this,
			province = me.AREA_INFO,
			tree = [{
				id: province.code,
				pId: 0,
				name: province.name,
				open: true,
				checked: expr && new RegExp(expr).test(areaCode)
			}],
			cities = province.area,
			loopI = cities.length,
			i, j;
		// 市级用户
		if (this.option.user.areaCode != 62) {
			var areaCode = this.option.user.areaCode;
			for (i = 0; i < loopI; i++) {
				var city = cities[i];
				if (Number(areaCode.toString().substr(0,4)) === city.code) {
					cities = [city];
					loopI = cities.length;
					break;
				}
			}
		}

		for (i = 0; i < loopI; i++) {
			// 遍历市
			var city = cities[i],
				countries = city.area,
				loopJ = countries.length;
			tree.push({
				id: city.code,
				pId: province.code,
				name: city.name,
				checked: expr && new RegExp(expr).test(city.code)
			});

			// 遍历县
			for (j = 0; j < loopJ; j++) {
				var country = countries[j];

				tree.push({
					id: country.code,
					pId: city.code,
					name: country.name,
					checked: expr && new RegExp(expr).test(country.code)
				});
			}
		}
		// 展开第一个市
		tree[1].open = true;

		return tree;
	},
	/**
	 * 基础数据准备
	 * @return {Deferred}   [description]
	 */
	prepare: function() {
		var me = this;
		var defer = new $.Deferred();
		console.time('producer prepare');
		// 提示框
		var loadIndex = layer.load(0, {
			time: 5000
		});
		var userName = GDYB.GridProductClass.currentUserName;
		var Query = new T.DeferredQuery();
		Query.addQuery(T.CTX + 'data/gansu.json', null, 'getJSON') //获取区域信息
			.addQuery(T.CTX + 'produce.html', null, 'get') //获取模版
			// 查询预警模版Context
			.addQuery(me.CONST.service + 'queryAlertSignalContext', T.paramize({}), 'post')
			.addQuery(userServiceUrl + "services/UserService/getForecastor",T.paramize({userName}),'post')
			.addQuery(userServiceUrl + "services/UserService/getIssuer",T.paramize({userName}),'post')
			.query(function(shandong, html, alertContext,forecastors,issuers) {
				if (!shandong || !html || !T.isPretty(alertContext) ||
					!Array.isArray(forecastors) || !Array.isArray(issuers)
				) {
					defer.reject(new Error('基础数据准备失败：数据不正确'));
					return;
				}
				//var forecastors = JSON.parse(forecastor);
				//var issuers = JSON.parse(issuer);

				me.CONST.forecastors = forecastors;
				me.CONST.issuers = issuers;

				// 区域信息
				me.AREA_INFO = shandong;
				// 预警信号内容
				var indexedContext = {};
				alertContext.forEach(function(context) {
					//以alertName建立索引
					var alertName = context.signalType + context.signalLevel;
					indexedContext[alertName] = context;
				});
				me.ALERT_CONTEXT = indexedContext;

				// HTML文档
				var doc = null;
				try {
					var parser = new DOMParser();
					doc = parser.parseFromString(html, 'text/html');
				} catch (err) {
					err.message = '基础数据准备失败：' + err.message;
					defer.reject(err);
					return;
				}
				// 缓存doc
				me.PRODUCE_DOC = doc;

				me._isReady_ = true;

				defer.resolve(doc, shandong, indexedContext);
			})
			.fail(function(a, b, c) {
				defer.reject(new Error('基础数据准备失败：' + c));
			})
			.always(function() {
				layer.close(loadIndex);
				console.timeEnd('producer prepare');
			});

		return defer.promise();
	},
	getTnumber: function() {
		var year = moment().year();
		return $.post(this.CONST.service + 'getTnumber', T.paramize(year));
	}
});
