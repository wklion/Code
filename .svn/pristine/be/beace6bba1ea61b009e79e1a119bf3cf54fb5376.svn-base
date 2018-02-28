/**
 * @author: wangkun
 * @date:2017-06-09
 * @description 数据过滤
 */
function DataFilter() {
    this._init_();
}
DataFilter.prototype = {
    constructor: DataFilter,
    _init_: function () {
        this.name = "数据过滤";
    },
    /**
     * @author:wangkun
     * @date:2017-06-09
     * @param:
     * @return:
     * @description:格点数据过滤
     */
    datasetgridFilter: function (datasetgrid,id) {
        var me = this;
        var cons = me.getFilterCondition(id);
        if(cons.length==0){
            return;
        }
        var max = datasetgrid.dMax;
        var min = datasetgrid.dMin;
        var grid = datasetgrid.grid;
        var rows = datasetgrid.rows;
        var cols = datasetgrid.cols;
        var noVal = datasetgrid.noDataValue;
        //获取极值
        if(cons[1]===">"){
            min = cons[0];
        }
        else{
            max = cons[0];
        }
        //过滤数据
        for(var r=0;r<rows;r++){
            for(var c=0;c<cols;c++){
                var index = r*cols+c;
                var val = grid[index];
                if(cons[1]===">"){
                    if(val<cons[0]){
                        grid[index] = noVal;
                    }
                }
                else{
                    if(val>cons[0]){
                        grid[index] = noVal;
                    }
                }
            }
        }
        datasetgrid.dMax = max;
        datasetgrid.dMin = min;
    },
    /**
     * @author:wangkun
     * @date:2017-06-09
     * @param:
     * @return:
     * @description:获取过滤条件
     */
    getFilterCondition:function(id){
        if(id===undefined){
            return;
        }
        var cons= [];
        if(id.toLowerCase()==="physic_pw"){//>=30
            cons[0]=30;
            cons[1]=">";
        }
        else if(id.toLowerCase()==="physic_k"||id.toLowerCase()==="lz_physic_k"){//>=30
            cons[0]=30;
            cons[1]=">";
        }
        else if(id.toLowerCase()==="physic_q"){//>=6
            cons[0]=10.0;
            cons[1]=">";
        }
        else if(id.toLowerCase()==="physic_rh"){//>=6
            cons[0]=54.2;
            cons[1]=">";
        }
        else if(id.toLowerCase()==="physic_ifvq"){//>=6
            cons[0]=0;
            cons[1]="<";
        }
        else if(id.toLowerCase()==="physic_cape"||id.toLowerCase()==="lz_physic_cape"||id.toLowerCase()==="hd_physic_cape"){//>=6
            cons[0]=100;
            cons[1]=">";
        }
        // else if(id.toLowerCase()==="physic_cin"){//>=6
        //     cons[0]=0;
        //     cons[1]=">";
        // }
        else if(id.toLowerCase()==="physic_li"||id.toLowerCase()==="lz_physic_li"){//>=6
            cons[0]=0;
            cons[1]="<";
        }
        else if(id.toLowerCase()==="physic_VOR"){//>=1
            cons[0]=1;
            cons[1]=">";
        }
        return cons;
    }
}