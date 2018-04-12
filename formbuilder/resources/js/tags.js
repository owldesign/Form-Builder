/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

var Tag = void 0;

window.Tag = Garnish.Base.extend({
    $item: null,
    $deleteTag: null,
    init: function init(item) {
        this.$item = $(item);
        this.$deleteTag = this.$item.find('.option-result-delete');

        return this.addListener(this.$deleteTag, 'click', 'delete');
    },
    "delete": function _delete(e) {
        var self = void 0;
        e.preventDefault();
        self = this;
        this.$item.addClass('zap');
        setTimeout(function () {
            self.$item.remove();
            Craft.cp.displayNotice(Craft.t('Item Removed'));
        }, 300);
    }
});

Garnish.$doc.ready(function () {
    return $('.result-item').each(function (i, el) {
        return new window.Tag(el);
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTdlYjljODQwMWFhYjA0M2M0ZjQiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvdGFncy5qcyJdLCJuYW1lcyI6WyJUYWciLCJ3aW5kb3ciLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsIiRpdGVtIiwiJGRlbGV0ZVRhZyIsImluaXQiLCJpdGVtIiwiJCIsImZpbmQiLCJhZGRMaXN0ZW5lciIsImUiLCJzZWxmIiwicHJldmVudERlZmF1bHQiLCJhZGRDbGFzcyIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJDcmFmdCIsImNwIiwiZGlzcGxheU5vdGljZSIsInQiLCIkZG9jIiwicmVhZHkiLCJlYWNoIiwiaSIsImVsIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsSUFBSUEsWUFBSjs7QUFFQUMsT0FBT0QsR0FBUCxHQUFhRSxRQUFRQyxJQUFSLENBQWFDLE1BQWIsQ0FBb0I7QUFDN0JDLFdBQU8sSUFEc0I7QUFFN0JDLGdCQUFZLElBRmlCO0FBRzdCQyxRQUg2QixnQkFHeEJDLElBSHdCLEVBR2xCO0FBQ1AsYUFBS0gsS0FBTCxHQUFhSSxFQUFFRCxJQUFGLENBQWI7QUFDQSxhQUFLRixVQUFMLEdBQWtCLEtBQUtELEtBQUwsQ0FBV0ssSUFBWCxDQUFnQix1QkFBaEIsQ0FBbEI7O0FBRUEsZUFBTyxLQUFLQyxXQUFMLENBQWlCLEtBQUtMLFVBQXRCLEVBQWtDLE9BQWxDLEVBQTJDLFFBQTNDLENBQVA7QUFDSCxLQVI0QjtBQVU3QixZQVY2QixtQkFVcEJNLENBVm9CLEVBVWpCO0FBQ1IsWUFBSUMsYUFBSjtBQUNBRCxVQUFFRSxjQUFGO0FBQ0FELGVBQU8sSUFBUDtBQUNBLGFBQUtSLEtBQUwsQ0FBV1UsUUFBWCxDQUFvQixLQUFwQjtBQUNBQyxtQkFBWSxZQUFNO0FBQ2RILGlCQUFLUixLQUFMLENBQVdZLE1BQVg7QUFDQUMsa0JBQU1DLEVBQU4sQ0FBU0MsYUFBVCxDQUF1QkYsTUFBTUcsQ0FBTixDQUFRLGNBQVIsQ0FBdkI7QUFDSCxTQUhELEVBR0ksR0FISjtBQUlIO0FBbkI0QixDQUFwQixDQUFiOztBQXNCQW5CLFFBQVFvQixJQUFSLENBQWFDLEtBQWIsQ0FBbUI7QUFBQSxXQUFNZCxFQUFFLGNBQUYsRUFBa0JlLElBQWxCLENBQXVCLFVBQUNDLENBQUQsRUFBSUMsRUFBSjtBQUFBLGVBQVcsSUFBSXpCLE9BQU9ELEdBQVgsQ0FBZTBCLEVBQWYsQ0FBWDtBQUFBLEtBQXZCLENBQU47QUFBQSxDQUFuQixFIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvdGFncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5N2ViOWM4NDAxYWFiMDQzYzRmNCIsImxldCBUYWc7XG5cbndpbmRvdy5UYWcgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkaXRlbTogbnVsbCxcbiAgICAkZGVsZXRlVGFnOiBudWxsLFxuICAgIGluaXQoaXRlbSkge1xuICAgICAgICB0aGlzLiRpdGVtID0gJChpdGVtKTtcbiAgICAgICAgdGhpcy4kZGVsZXRlVGFnID0gdGhpcy4kaXRlbS5maW5kKCcub3B0aW9uLXJlc3VsdC1kZWxldGUnKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGRlbGV0ZVRhZywgJ2NsaWNrJywgJ2RlbGV0ZScpO1xuICAgIH0sXG5cbiAgICBcImRlbGV0ZVwiKGUpIHtcbiAgICAgICAgbGV0IHNlbGY7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuJGl0ZW0uYWRkQ2xhc3MoJ3phcCcpO1xuICAgICAgICBzZXRUaW1lb3V0KCgoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLiRpdGVtLnJlbW92ZSgpO1xuICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdJdGVtIFJlbW92ZWQnKSk7XG4gICAgICAgIH0pLCAzMDApO1xuICAgIH1cbn0pO1xuXG5HYXJuaXNoLiRkb2MucmVhZHkoKCkgPT4gJCgnLnJlc3VsdC1pdGVtJykuZWFjaCgoaSwgZWwpID0+IG5ldyB3aW5kb3cuVGFnKGVsKSkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZGV2ZWxvcG1lbnQvanMvdGFncy5qcyJdLCJzb3VyY2VSb290IjoiIn0=