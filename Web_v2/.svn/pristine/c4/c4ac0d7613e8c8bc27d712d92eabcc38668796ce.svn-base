/**
 * 数据监控
 *
 */
~ function(request) {

  const gms = Object.create(null);

  let Status = {
    warning: false, // 数据异常
    error: false, // 请求失败
    makeTime: null, // 制作时间
    updateTime: null // 更新时间
  };

  /**
   * 获取监控数据
   *
   * @param param
   * @returns {Promise}
   */
  gms.getData = function(param) {

    let timeStr = param.makeTime; // 1612210500

    Status.makeTime = new Date('20' + timeStr.substr(0, 2) + '-' + timeStr.substr(2, 2) + '-' + timeStr.substr(4, 2) + ' ' + timeStr.substr(6, 2) + ':00:00');

    return request.post(gms.options.api, param || gms.param).then(({ errcode, message, data }) => {
      if (errcode !== 0) {
        throw new Error(message)
      }
      if (!request.isPretty(data)) {
        throw new Error('暂无数据')
      }

      console.log('GMS: Monitoring=%o', data);

      let alias = message.alias || {};

      Status.updateTime = new Date();

      return { data, alias };
    }).catch(error => {
      Status.updateTime = new Date();

      console.error(error);
    });
  };

  /**
   * 初始化仪表盘
   */
  gms.initDash = function(Status) {
    let container = document.querySelector(gms.options.dash);

    function setCard(icon, content, theme) {
      let card = document.createElement('div');
      card.className = 'card card-' + (theme || 'primary');

      let cardIcon = document.createElement('div');
      cardIcon.className = 'card-icon';
      cardIcon.innerHTML = '<i class="' + icon + '"></i>';

      let cardContent = document.createElement('div');
      cardContent.className = 'card-content';
      cardContent.innerHTML = '<div class="main">' + content + '</div>';

      let refresh = document.createElement('i');
      refresh.className = 'refresh iconfont icon-refresh';
      // event
      cardContent.appendChild(refresh);

      card.appendChild(cardIcon);
      card.appendChild(cardContent);

      return card;
    }

    let { makeTime, updateTime, warning, error } = Status;

    let msgInfo = null;
    let msgDanger = null;
    let msgUpdate = [
      '更新时间',
      updateTime.toLocaleDateString().replace(/\D/g, '-') + ' ' + updateTime.toTimeString().substr(0, 8)
    ].join('<br>');

    if (error) {
      msgInfo = msgDanger = '无数据';
    } else {
      msgInfo = [
        '网格制作：' + makeTime.toLocaleDateString().replace(/\D/g, '-') + ' ' + makeTime.toTimeString().substr(0, 5),
        '是否异常：' + (warning ? '是' : '否')
      ].join('<br>');
      msgDanger = [
        '融合结果：' + '已融合',
        '城镇报：' + '已完成'
      ].join('<br>');
    }

    container.appendChild(setCard('iconfont icon-global', msgInfo, 'info'));
    container.appendChild(setCard('iconfont icon-fengche', msgDanger, 'danger'));
    container.appendChild(setCard('iconfont icon-time', msgUpdate, 'success'));

  };

  /**
   * 初始化表格
   */
  gms.initGrid = function(data, alias) {

    let elementAlias = alias ? alias.elements : {};

    // 表头
    let cols = gms.param.prvn ? [
      { title: '要素', data: 'element' },
      { title: '预报', data: 'prvn_r' },
      { title: '首席', data: 'prvn_p' },
      { title: '中央台', data: 'bj_p' },
      { title: 'GRAPES', data: 'gp_p' },
      { title: '欧洲细网格', data: 'ec_p' },
      { title: 'T639', data: 't639_p' },
      { title: '日本', data: 'japan_p' }
    ] : [
      { title: '要素', data: 'element' },
      { title: '预报', data: 'cty_p' },
      { title: '省台', data: 'prvn_p' },
      { title: '中央台', data: 'bj_p' },
      { title: 'GRAPES', data: 'gp_p' },
      { title: '欧洲细网格', data: 'ec_p' },
      { title: 'T639', data: 't639_p' },
      { title: '日本', data: 'japan_p' }
    ];

    function findColIndex(col) {
      for (let i = 0; i < cols.length; i++) {
        if (col === cols[i].data) return i;
      }
    }

    function renderer(key, value) {
      let td = document.createElement('td');
      td.setAttribute('data-index', key);
      let data = value === undefined ? '' : value;
      if (key === 'element') {
        data = elementAlias[value];
      } else if (!value) {
        td.className = 'warning';
        Status.warning = true; // 标记
      }

      td.innerText = data;

      return td;
    }

    let container = document.querySelector(gms.options.table);
    let table = document.createElement('table');

    // 设置列属性
    let colProps = [
      '<col width="50px" />', // 索引列
    ];

    table.innerHTML = colProps.join('');

    // 创建表头
    let header = document.createElement('tr');
    header.appendChild(document.createElement('th')); // 索引列
    cols.forEach(({ title, data }) => {
      let th = document.createElement('th');
      th.setAttribute('data-key', data);
      th.innerText = title;
      header.appendChild(th);
    });
    table.appendChild(header);

    // table-body 渲染数据
    data.forEach((rowData, index) => {
      let row = document.createElement('tr');
      row.setAttribute('data-index', index);
      // 索引列
      let indexCol = document.createElement('td');
      indexCol.innerText = index + 1;

      let cols = [indexCol];
      for (let key in rowData) {
        let colIndex = findColIndex(key) + 1;
        let colData = rowData[key];
        cols[colIndex] = renderer(key, colData);
      }
      cols.forEach(col => row.appendChild(col));

      table.appendChild(row);
    });

    // 设置table尺寸
    let cellHeight = gms.options.cellHeight;
    table.style.height = cellHeight * (data.length + 1) + 'px';

    // append
    container.appendChild(table);

    // 暂无数据
    if (data.length === 0) {
      let noData = document.createElement('div');
      noData.className = 'noData';
      noData.innerHTML = '暂无监控数据';
      container.appendChild(noData);
    }

  };

  gms.monitor = function(param) {
    if (param) gms.param = param;

    if (!gms.param.makeTime) {
      // 根据当前时间设置监控的制作时间
      let now = new Date();
      let hour = now.getHours();
      let makeTime = now.toISOString().replace(/\D/g, '').substr(0, 8);
      if (hour > 16) {
        makeTime += '0500';
      } else {
        makeTime += '1600';
      }
      gms.param.makeTime = makeTime;
    }

    return gms.getData(gms.param).then(({ data, alias }) => {
      gms.initGrid(data, alias);
      gms.initDash(Status);
    }).catch(error => {
      Status.error = true;
      gms.initGrid([]);
      gms.initDash(Status);
      alert('无监控数据，请重试');
    })
  };

  /**
   * 默认参数
   */
  gms.param = {
    elements: {
      'r12': 240,
      'tmax': 240,
      'tmin': 240,
      'wmax': 240,
      'w': 240,
      '2t': 240,
      'r3': 240,
      '10uv': 240,
      'rh': 240,
      'tcc': 240,
      'pph': 240
    },
    makeTime: null,
    prvn: true
  };

  // 默认设置
  gms.options = {
    api: '/gms/service/monitor', // 接口地址
    table: '.gms-monitor_table', // 表格container
    dash: '.gms-monitor_dash', // 仪表盘container
    cellHeight: 30 // 表格单元格高度
  };

  // exports
  window.gms = gms;

}(request);
