class MyArray extends Array{
    constructor(...args) {
        super(...args);
    }
    contain(obj){
        var size = this.length;
        var result = false;
        for(var i=0;i<size;i++){
            if(this[i] === obj){
                result = true;
                break;
            }
        }
        return result;
    }
}