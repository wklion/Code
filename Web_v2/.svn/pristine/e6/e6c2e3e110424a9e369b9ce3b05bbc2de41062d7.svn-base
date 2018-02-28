/**
 * Class: WeatherMap.Layer.StreamLayer
 * 流（场）图层。
 * 用于风、洋流动画显示等。
 * by zouwei
 * 2016-5-15
 */
WeatherMap.Layer.StreamLayer = WeatherMap.Class(WeatherMap.Layer, {
    rootCanvas: null,
    canvasContext: null,
    maxWidth: null,
    maxHeight: null,
    resolution:2,
    features: null,
    colorStyles:null,
    datasetGrid:null,
    gridS:null,
    uv:null,
    buckets:null,
    particles:null,
    MAX_PARTICLE_AGE:100,

    bmovestart:false,

    bfirst:true,


    initialize: function(name, options) {
        WeatherMap.Layer.prototype.initialize.apply(this, arguments);

        //构建绘图面板
        this.rootCanvas = document.createElement("canvas");
        if (!this.rootCanvas.getContext) {
            return;
        }
        this.supported = true;
        this.rootCanvas.id = "Canvas_" + this.id;
        this.rootCanvas.style.position = "absolute";
        this.div.appendChild(this.rootCanvas);
        this.canvasContext = this.rootCanvas.getContext('2d');

        this.colorStyles= {0: "rgba(0, 0, 150, 1)",
            1: "rgba(0, 0, 160, 1)",
            2: "rgba(0, 0, 170, 1)",
            3: "rgba(0, 0, 180, 1)",
            4: "rgba(0, 0, 190, 1)",
            5: "rgba(0, 0, 200, 1)",
            6: "rgba(0, 0, 210, 1)",
            7: "rgba(0, 0, 220, 1)",
            8: "rgba(0, 0, 230, 1)",
            9: "rgba(0, 0, 240, 1)",
            10: "rgba(0, 0, 250, 1)",
            11: "rgba(0, 0, 255, 1)",
            12: "rgba(0, 0, 255, 1)",
            13: "rgba(0, 0, 255, 1)",
            14: "rgba(0, 0, 255, 1)",
            15: "rgba(0, 0, 255, 1)",
            16: "rgba(0, 0, 255, 1)",
            17: "rgba(0, 0, 255, 1)"
        };

        this.buckets = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[],13:[],14:[],15:[],16:[],17:[]};
    },

    setMap:function(map){
        WeatherMap.Layer.prototype.setMap.apply(this, arguments);
        if(!this.supported){
            this.map.removeLayer(this);
        }else{
            this.redraw();
        }

        this.animate(); //放在这里，确保只执行一次

        var t = this;
        map.events.register("movestart", map, function(event){
            t.bmovestart = true;
            t.uv = [];
        });
        map.events.register("moveend", map, function(event){
            t.buildParticles();
        });
    },

    moveTo: function(bounds, zoomChanged, dragging) {
        WeatherMap.Layer.prototype.moveTo.apply(this, arguments);
        if(!this.supported){
            return;
        }
        this.zoomChanged = zoomChanged;
        if(!dragging){
            this.div.style.visibility = "hidden";
            this.div.style.left = -parseInt(this.map.layerContainerDiv.style.left) + "px";
            this.div.style.top = -parseInt(this.map.layerContainerDiv.style.top) + "px";
            var size = this.map.getSize();
            this.rootCanvas.width = parseInt(size.w);
            this.rootCanvas.height = parseInt(size.h);
            this.maxWidth = size.w;
            this.maxHeight = size.h;
            this.div.style.visibility = "visible";
            if(!zoomChanged){
                this.updateGrid();
                this.update2();
                this.refresh(true);
            }
        }

        if(zoomChanged){
            this.updateGrid();
            this.update2();
            this.refresh(true);
        }
        this.bmovestart = false;
    },

    setDatasetGrid:function(datasetGrid){
        this.datasetGrid = datasetGrid;
        if(datasetGrid != null)
        {
            this.noDataValue = datasetGrid.noDataValue;
            this.gridS = null;
        }
        this.updateGrid();
        this.update2();
    },

    updateGrid:function(){
        var bounds = this.map.getExtent();
        var resolution = this.map.getResolution();
        var bFirst = false;
        if(this.gridS == null) {
            this.gridS = [];
            bFirst = true;
        }
        if(this.datasetGrid != null && this.datasetGrid.grid.length > 0)
        {
            var pixelPointLeftTop = this.getPixelXY(this.datasetGrid.left, this.datasetGrid.top, bounds, resolution);
            var pixelPointRightBottom = this.getPixelXY(this.datasetGrid.right, this.datasetGrid.bottom, bounds, resolution);
            this.deltaX = Math.abs(pixelPointRightBottom.x - pixelPointLeftTop.x) / (this.datasetGrid.cols);
            this.deltaY = Math.abs(pixelPointRightBottom.y - pixelPointLeftTop.y) / (this.datasetGrid.rows);
            this.left = pixelPointLeftTop.x;
            this.bottom = pixelPointRightBottom.y;
            this.right = pixelPointRightBottom.x;
            this.top = pixelPointLeftTop.y;
            for(var i=0;i<this.datasetGrid.rows;i++) {
                var gridRowS = [];
                for (var j = 0; j < this.datasetGrid.cols; j++) {
                        if (bFirst) {
                            gridRowS.push({
                                "x": this.left + this.deltaX * j,
                                "y": this.top + this.deltaY * i,
                                "u": this.datasetGrid.getValue(0, j, i),
                                "v": this.datasetGrid.getValue(1, j, i)
                            });
                        }
                        else {
                            this.gridS[i][j].x = this.left + this.deltaX * j;
                            this.gridS[i][j].y = this.top + this.deltaY * i;
                            this.gridS[i][j].u = this.datasetGrid.getValue(0, j, i);
                            this.gridS[i][j].v = this.datasetGrid.getValue(1, j, i);;
                        }
                }
                if(bFirst)
                    this.gridS.push(gridRowS);
            }
        }
    },

    update2:function(){
        this.uv = [];
        for(var i = 0; i < this.maxHeight; i+=1) {
            var uvRow = [];
            for (var j = 0; j < this.maxWidth; j += 1) {
                uvRow.push(this.getUV(j, i));
            }
            this.uv.push(uvRow);
        }
    },

    bilinearInterpolateVector:function(x, y, uv00, uv10, uv01, uv11) {
        var rx = (1 - x);
        var ry = (1 - y);
        var a = rx * ry, b = x * ry, c = rx * y, d = x * y;
        var u = uv00.u * a + uv10.u * b + uv01.u * c + uv11.u * d;
        var v = uv00.v * a + uv10.v * b + uv01.v * c + uv11.v * d;
        return {u:u*0.5, v:v*0.5, m:Math.sqrt(u * u + v * v)};
        //return {u:u, v:v};
    },

    getUV:function(x, y){
        var result = null;
        var gridS = this.gridS;
        if(gridS == null || gridS.length == 0)
            return result;

        if(x < this.left || x > this.right || y< this.top || y>this.bottom)
            return result;

        var xRelative = x - this.left;
        var yRelative = y - this.top;
        var xIndex = xRelative <0 ? 0 : Math.floor(xRelative/this.deltaX); //列
        var yIndex = yRelative <0 ? 0 : Math.floor(yRelative/this.deltaY); //行

        //左上
        if(xIndex<0 && yIndex < 0)
        {
            var u = gridS[0][0].u;
            var v = gridS[0][0].v;
            return {u:u,v:v, m:Math.sqrt(u*u+v*v)};
        }

        //左下
        if(xIndex<0 && yIndex>=gridS.length - 1)
        {
            var u = gridS[gridS.length - 1][0].u;
            var v = gridS[gridS.length - 1][0].v;
            return {u:u, v:v, m:Math.sqrt(u*u+v*v)};
        }

        //右下
        if(xIndex>=gridS[0].length - 1 && yIndex>=gridS.length - 1)
        {
            var u = gridS[gridS.length - 1][gridS[0].length - 1].u;
            var v = gridS[gridS.length - 1][gridS[0].length - 1].v;
            return {u:u, v:v, m:Math.sqrt(u*u+v*v)};
        }

        //右上
        if(xIndex>=gridS[0].length - 1 && yIndex<0)
        {
            var u = gridS[0][gridS[0].length - 1].u;
            var v = gridS[0][gridS[0].length - 1].v;
            return {u:u,v:v, m:Math.sqrt(u*u+v*v)};
        }


        {
            //左、右边缘
            if (xIndex < 0 || xIndex >= gridS[0].length - 1) {
                var yTop = gridS[yIndex][xIndex < 0 ? 0 : gridS[yIndex].length - 1].y;
                var uTop = gridS[yIndex][xIndex < 0 ? 0 : gridS[yIndex].length - 1].u;
                var vTop = gridS[yIndex][xIndex < 0 ? 0 : gridS[yIndex].length - 1].v;
                var yBottom = gridS[yIndex + 1][xIndex < 0 ? 0 : gridS[yIndex].length - 1].y;
                var uBottom = gridS[yIndex + 1][xIndex < 0 ? 0 : gridS[yIndex].length - 1].u;
                var vBottom = gridS[yIndex + 1][xIndex < 0 ? 0 : gridS[yIndex].length - 1].v;
                var u = Math.abs(yBottom - y) / this.deltaY * uTop + Math.abs(yTop - y) / this.deltaY * uBottom;
                var v = Math.abs(yBottom - y) / this.deltaY * vTop + Math.abs(yTop - y) / this.deltaY * vBottom;
                u = Math.round(u * 10) / 10;
                v = Math.round(v * 10) / 10;
                return {u:u, v:v, m:Math.sqrt(u*u+v*v)};
            }

            //上、下边缘
            if (yIndex < 0 || yIndex >= gridS.length - 1) {
                var xLeft = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex].x;
                var uLeft = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex].u;
                var vLeft = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex].v;
                var xRight = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex + 1].x;
                var uRight = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex + 1].u;
                var vRight = gridS[yIndex < 0 ? 0 : gridS.length - 1][xIndex + 1].v;
                var u = Math.abs(xRight - x) / this.deltaX * uLeft + Math.abs(xLeft - x) / this.deltaX * uRight;
                var v = Math.abs(xRight - x) / this.deltaX * vLeft + Math.abs(xLeft - x) / this.deltaX * vRight;
                u = Math.round(u* 10) / 10;
                v = Math.round(v* 10) / 10;
                return {u:u, v:v, m:Math.sqrt(u*u+v*v)};
            }

            var uv00 = gridS[yIndex][xIndex];
            var uv10 = gridS[yIndex][xIndex + 1];
            var uv01 = gridS[yIndex + 1][xIndex];
            var uv11 = gridS[yIndex + 1][xIndex + 1];
            result = this.bilinearInterpolateVector((x-uv00.x)/this.deltaX, (y-uv00.y)/this.deltaY, uv00, uv10, uv01, uv11);
        }
        return result;
    },

    animate:function(){
//        try {
            var t = this;
            (function frame() {
                //try {
                    t.evolve();
                    t.refresh();
                    setTimeout(frame, 40);
//                catch (e) {
//                    console.log(e);
//                }
            })();
//        }
//        catch (e) {
//            console.log(e);
//        }
    },

    buildParticles:function(){
        if(this.uv  == null || this.uv.length == 0 || this.gridS.length == 0)
            return;
        this.bfirst = true;
        var resolution = this.resolution;
        var deltax = this.maxWidth/this.gridS[0].length;
        var deltay = this.maxHeight/this.gridS.length;
        var particle = null;
        var particles = [];
        for(var i=0; i<this.gridS.length; i+=resolution){
            var row = [];
            var y = deltay*i;
            if(this.bmovestart)
                break;
            for(var j=0; j<this.gridS[0].length; j+=resolution) {
                if(this.bmovestart)
                    break;
                particle = {age: Math.round(Math.random()*100),x: deltax*j,y: y};
                if(this.uv[parseInt(particle.y)][parseInt(particle.x)]==null)
                    row.push(null);
                else
                    row.push(particle);
            }
            particles.push(row);
        }
        this.particles = particles;
    },

    evolve:function(){
        if(this.uv  == null || this.uv.length == 0 || this.gridS.length == 0 || !this.visibility)
            return;
        for(var key in this.buckets){
            this.buckets[key] = [];
        }

        var deltax = this.maxWidth/this.gridS[0].length;
        var deltay = this.maxHeight/this.gridS.length;
        if(this.particles == null){
            this.buildParticles();
        }

        for(var i=0; i<this.particles.length; i++){
            if(this.bmovestart)
                break;
            for(var j=0; j<this.particles[0].length; j++){
                if(this.bmovestart)
                    break;
                var particle = this.particles[i][j];
                if(particle == null)
                    continue;
                if(!this.bfirst){
                    particle.x = particle.xt;
                    particle.y = particle.yt;
                }
                var x = particle.x;
                var y = particle.y;
                if(particle.age > this.MAX_PARTICLE_AGE || x < 0 || x >= this.uv[0].length || y < 0 || y >= this.uv.length){
                    x = deltax*j*2;
                    y = deltay*i*2;
                    particle.age=0;
                    particle.x=x;
                    particle.y=y;
                }
                var uv = this.uv[parseInt(y)][parseInt(x)];  // vector at current position
                if(uv != null)
                {
                    var xt = x + uv.u;
                    var yt = y - uv.v; //屏幕坐标Y向下
                    if (true) {
                        particle.xt = xt;
                        particle.yt = yt;
                        var m = Math.round(uv.m);
                        if(m>17)
                            m=17;
                        this.buckets[m].push(particle);
                    }
                    particle.age += 1;
                }
            }
        }
        this.bfirst = false;
    },

    refresh: function(bclear){
        if(this.uv == null || this.uv.length == 0)
            return;

        var g = this.canvasContext;
        if(!this.visibility){
            g.clearRect(0, 0, this.maxWidth, this.maxHeight);
            return;
        }

        if(bclear){
            g.clearRect(0, 0, this.maxWidth, this.maxHeight);
            return;
        }
        else {
            var prev = g.globalCompositeOperation;
            g.fillStyle = "rgba(0, 0, 0, 0.972549019607843)";
            g.globalCompositeOperation = "destination-in";
            g.fillRect(0, 0, this.maxWidth, this.maxHeight);
            g.globalCompositeOperation = prev;
        }

        for(var key in this.buckets){
            if(this.bmovestart)
                break;
            var bucket = this.buckets[key];
            if (bucket.length > 0) {
                g.beginPath();
                g.strokeStyle = this.colorStyles[key];
                bucket.forEach(function(particle) {
                    g.moveTo(particle.x, particle.y);
                    g.lineTo(particle.xt, particle.yt);
                });
                g.stroke();
            }
        }
    },

    /**
     * Method: getPixelXY
     * 转换地理坐标为相对于当前窗口左上角的像素坐标
     *
     * Parameters:
     * x - {int} 热点的像素 x 坐标。
     * y - {int} 热点的像素 y 坐标。
     * bounds - {WeatherMap.Bounds} 当前地图显示范围。
     * resolution - {Number} 当前地图分辨率。
     */
    getPixelXY: function(x, y, bounds, resolution) {
        var x = (x / resolution + (-bounds.left / resolution));
        var y = ((bounds.top / resolution) - y / resolution);
        return {x: parseInt(x), y: parseInt(y)};
    },

    /**
     * APIMethod: destroy
     * 销毁图层，释放资源。
     */
    destroy: function() {
        if(this.features && this.features.length > 0){
            for(var i=0, len= this.features.length; i < len; i++){
                this.features[i].destroy();
                this.features[i] = null;
            }
        }
        this.colors = null;
        this.features = null;
        this.radius = null;
        this.supported = null;
        this.canvasContext = null;
        this.pixelHeatPoints = null;
        this.rootCanvas = null;
        this.alphaValues = null;
        this.colorValues = null;
        this.imgData = null;
        this.maxWeight = null;
        this.minWeight = null;
        this.maxWidth = null;
        this.maxHeight = null;
        this.featureRadius = null;
        WeatherMap.Layer.prototype.destroy.apply(this, arguments);
    },

    CLASS_NAME: "WeatherMap.Layer.StreamLayer"
});