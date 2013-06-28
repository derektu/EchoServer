/**
 * Created with JetBrains WebStorm.
 * User: Derek
 * Date: 13/6/25
 */

var map = function() {
    var _map = {};
    var _count = 0;
    var _self = this;

    this.add = function(key, value) {
        _map[key] = value;
        _count++;
    }

    this.remove = function(key) {
        if (_map.hasOwnProperty(key)) {
            delete _map[key];
            _count--;
        }
    }

    this.getCount = function() {
        return _count;
    }

    this.exists = function(key) {
        return _map.hasOwnProperty(key);
    }

    this.get = function(key) {
        if (_self.exists(key))
            return _map[key];
        else
            return null;
    }
};

module.exports = map;
