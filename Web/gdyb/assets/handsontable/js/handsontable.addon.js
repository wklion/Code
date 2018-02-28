/**
 * 拓展 handsontable.addon
 * 编辑器 handsontable.StationEditor
 * @author rexer
 * @date   2016-07-11
 */

+ function($, H) {

    /**
     * @namespace
     */
    H.addon = Object.create(null);

    H.addon.defaults = {
        rowHeaders: true,
        rowHeights: 30,
        height: '100%',
        width: '100%',
        stretchH: 'all', //拉伸所有单元格宽度
        manualColumnResize: true,
        manualRowResize: true,
        autoWrapCol: true,
        autoWrapRow: true,
        currentRowClassName: 'currentRow', //选中css
        currentColClassName: 'currentCol', //选中css
        manualColumnMove: true, //移动列
        manualRowMove: true, //移动行
        columnSorting: true,
        sortIndicator: true,
        filters: true,
        contextMenu: true, //右键菜单
        dropdownMenu: ['remove_col', '---------', 'make_read_only', '---------', 'alignment', '---------', 'filter_by_condition', 'filter_action_bar', '---------', 'filter_by_value'],
        minSpareRows: 0, //空行
        allowRemoveColumn: true,
        allowRemoveRow: true,
        renderAllRows: false,
        //以下属性与排序冲突，请勿使用
        // autoRowSize: true,
        // autoColumnSize: true,
    };

    /**
     * 参数化
     * @param  {Array}   cols dataSchema
     * @param  {Array}   data 数据
     * @param  {Object}  [opts] 自定义参数
     * @return {Object}	 handsontable参数
     */
    H.addon.paramize = function(cols, data, opts) {
        var headers = [],
            columns = [];
        cols.forEach(function(item) {
            headers.push(item.title);
            var col = $.extend({ className: 'htCenter htMiddle' }, item);
            delete col.title;
            columns.push(col);
        });
        return $.extend({
            data: data,
            colHeaders: headers,
            columns: columns
        }, H.addon.defaults, opts);
    };

    /**
     * 工具类
     * @param  {Handsontable|jQuery|HTMLElement|Selector}   para 实例对象
     * @constructor
     */
    H.addon.Util = function(para) {
        var instance;

        this.setInstance = function(table) {
            if (table instanceof $ || table instanceof HTMLElement || typeof table === 'string') {
                instance = $(table).handsontable('getInstance');
            } else instance = table;
            return this;
        };

        /**
         * 设置行属性
         * @param  {Number}   row  [description]
         * @param  {Object}   prop [description]
         */
        this.setRowMeta = function(row, prop) {
            var col = instance.countCols() - 1;
            while (col >= 0) {
                instance.setCellMetaObject(row, col, prop);
                col--;
            }
            return this;
        };

        /**
         * 设置列属性
         * @param  {Number}   col  [description]
         * @param  {Object}   prop [description]
         */
        this.setColMeta = function(col, prop) {
            var row = instance.countRows() - 1;
            while (row >= 0) {
                instance.setCellMetaObject(row, col, prop);
                row--;
            }
            return this;
        };

        /**
         * 选择整行
         * @param  {[type]}   row [description]
         * @return {[type]}       [description]
         */
        this.selectRow = function(row) {
            var col = instance.countCols() - 1;
            instance.selectCell(row, 0, row, col, true);
            return this;
        };

        /**
         * 选择整列
         * @param  {Number}   col [description]
         * @return {[type]}       [description]
         */
        this.selectCol = function(col) {
            var row = instance.countRows() - 1;
            instance.selectCell(0, col, row, col, true);
            return this;
        };

        /**
         * 导出表格
         * @param  {Function}   filter   过滤器 args: data,header
         * @param  {String}     filename 文件名
         */
        this.exportToExcel = function(filter, filename) {
            var BOM = '\uFEFF'; //utf-8 with bom
            var LF = '\r\n';
            var header = instance.getColHeader();
            var dataSource = instance.getData();
            var content = typeof filter === 'function' ? filter(dataSource, header) : dataSource;
            content.unshift(header);
            var blob = new Blob([BOM + content.join(LF)], { type: 'text/csv' });
            var name = (filename || 'export') + '.csv';
            T.download(blob, name);
        };

        this.setInstance(para);
    };


    //////////////////////////////
    //         Editor           //
    //////////////////////////////

}(jQuery, Handsontable);
