/**
 * 格点数据监控页面
 *
 * @author rexer
 */
GMSMonitorPageClass = PageBase.prototype.extend(function () {
    /*
     * 页面html
     */
    var template = `<div id="gms-monitor" class="gms-monitor_container f">
                      <div class="gms-monitor_dash"></div>
                      <div class="gms-monitor_table"></div>
                    </div>`;

    let tempFrame = `<iframe width="100%" height="100%" src="http://172.23.2.237:7081/gms"></iframe>`

    // 设置
    gms.options.api = GMSUrl;

    return {
        renderMenu: function () {
            // 载入页面
            // $('.content').html(template);
            $("#content").html(tempFrame);
            // GMS init
            gms.monitor({
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
                makeTime: '1612210500',
                prvn: true
            });
        }
    };

});
