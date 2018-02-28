/**
 * Class Generator
 * @author rexer
 * @date   2016-10-18
 * @param  {Object}   proto 原型
 * @return {BaseClass}
 */

var clazz = function() {

    /**
     * 基类
     */
    function BaseClass() {
      this.init.apply(this, arguments);
    }

    /**
     * 构造器
     */
    BaseClass.prototype.init = function() {};

    /**
     * 继承
     */
    BaseClass.prototype.extend = function(proto) {
        var Base = this.constructor;

        function Clazz() {
            Base.apply(this, arguments);
        }

        function inherit(Child, Parent) {
            function Bridge() {}
            Bridge.prototype = Parent.prototype;
            Child.prototype = new Bridge();
            Child.prototype.constructor = Child;
            for (var p in proto) {
                Child.prototype[p] = proto[p];
            }
            return Child;
        }

        return inherit(Clazz, Base);
    };

    return function(proto) {
        return BaseClass.prototype.extend(proto || {});
    };

}();
