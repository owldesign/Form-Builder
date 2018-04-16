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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ({

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(26);


/***/ }),

/***/ 26:
/***/ (function(module, exports) {

var Field = void 0;
var Fields = void 0;

window.Fields = Garnish.Base.extend({
    $container: null,
    $form: null,
    $body: null,
    $tagContainer: null,
    $targetEl: null,
    $target: null,
    init: function init(container, form, target) {
        var self = void 0;
        var tags = void 0;
        var targetClassName = void 0;
        self = this;
        this.$container = container;
        this.$form = $(form);
        this.$body = this.$form.find('.body');
        this.$tagContainer = $('<div class="tags-container"></div>');
        this.$body.append(this.$tagContainer);
        tags = [];

        $.each($.parseJSON(this.$container.$fields), function (i, item) {
            return tags[i] = '<div class=\'tag-btn tag-' + item.value + '\' data-tag=\'{' + item.value + '}\'>' + item.label + '</div>';
        });

        tags.splice(0, 1);
        this.$tagContainer.html(tags);

        $.each(this.$container.$inputs, function (i, item) {
            if (item.tags) {
                self.$targetEl = item;
            }
        });

        targetClassName = this.$targetEl.name.replace(/[_\W]+/g, "-").slice(0, -1);
        this.$target = $('.' + targetClassName);

        $.each(this.$tagContainer.find('.tag-btn'), function (i, item) {
            return new Field(item, self.$target);
        });
    }
});

Field = Garnish.Base.extend({
    $tag: null,
    $target: null,

    init: function init(tag, target) {
        this.$tag = $(tag);
        this.$target = target;

        return this.addListener(this.$tag, 'click', 'addTag');
    },
    addTag: function addTag() {
        var tag = void 0;
        tag = this.$tag.data('tag');

        return this.$target.val(this.$target.val() + tag);
    }
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZmllbGRzLmpzIl0sIm5hbWVzIjpbIkZpZWxkIiwiRmllbGRzIiwid2luZG93IiwiR2FybmlzaCIsIkJhc2UiLCJleHRlbmQiLCIkY29udGFpbmVyIiwiJGZvcm0iLCIkYm9keSIsIiR0YWdDb250YWluZXIiLCIkdGFyZ2V0RWwiLCIkdGFyZ2V0IiwiaW5pdCIsImNvbnRhaW5lciIsImZvcm0iLCJ0YXJnZXQiLCJzZWxmIiwidGFncyIsInRhcmdldENsYXNzTmFtZSIsIiQiLCJmaW5kIiwiYXBwZW5kIiwiZWFjaCIsInBhcnNlSlNPTiIsIiRmaWVsZHMiLCJpIiwiaXRlbSIsInZhbHVlIiwibGFiZWwiLCJzcGxpY2UiLCJodG1sIiwiJGlucHV0cyIsIm5hbWUiLCJyZXBsYWNlIiwic2xpY2UiLCIkdGFnIiwidGFnIiwiYWRkTGlzdGVuZXIiLCJhZGRUYWciLCJkYXRhIiwidmFsIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsSUFBSUEsY0FBSjtBQUNBLElBQUlDLGVBQUo7O0FBRUFDLE9BQU9ELE1BQVAsR0FBZ0JFLFFBQVFDLElBQVIsQ0FBYUMsTUFBYixDQUFvQjtBQUNoQ0MsZ0JBQVksSUFEb0I7QUFFaENDLFdBQU8sSUFGeUI7QUFHaENDLFdBQU8sSUFIeUI7QUFJaENDLG1CQUFlLElBSmlCO0FBS2hDQyxlQUFXLElBTHFCO0FBTWhDQyxhQUFTLElBTnVCO0FBT2hDQyxRQVBnQyxnQkFPM0JDLFNBUDJCLEVBT2hCQyxJQVBnQixFQU9WQyxNQVBVLEVBT0Y7QUFDMUIsWUFBSUMsYUFBSjtBQUNBLFlBQUlDLGFBQUo7QUFDQSxZQUFJQyx3QkFBSjtBQUNBRixlQUFPLElBQVA7QUFDQSxhQUFLVixVQUFMLEdBQWtCTyxTQUFsQjtBQUNBLGFBQUtOLEtBQUwsR0FBYVksRUFBRUwsSUFBRixDQUFiO0FBQ0EsYUFBS04sS0FBTCxHQUFhLEtBQUtELEtBQUwsQ0FBV2EsSUFBWCxDQUFnQixPQUFoQixDQUFiO0FBQ0EsYUFBS1gsYUFBTCxHQUFxQlUsRUFBRSxvQ0FBRixDQUFyQjtBQUNBLGFBQUtYLEtBQUwsQ0FBV2EsTUFBWCxDQUFrQixLQUFLWixhQUF2QjtBQUNBUSxlQUFPLEVBQVA7O0FBRUFFLFVBQUVHLElBQUYsQ0FBT0gsRUFBRUksU0FBRixDQUFZLEtBQUtqQixVQUFMLENBQWdCa0IsT0FBNUIsQ0FBUCxFQUE2QyxVQUFDQyxDQUFELEVBQUlDLElBQUo7QUFBQSxtQkFBYVQsS0FBS1EsQ0FBTCxrQ0FBcUNDLEtBQUtDLEtBQTFDLHVCQUErREQsS0FBS0MsS0FBcEUsWUFBK0VELEtBQUtFLEtBQXBGLFdBQWI7QUFBQSxTQUE3Qzs7QUFFQVgsYUFBS1ksTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmO0FBQ0EsYUFBS3BCLGFBQUwsQ0FBbUJxQixJQUFuQixDQUF3QmIsSUFBeEI7O0FBRUFFLFVBQUVHLElBQUYsQ0FBTyxLQUFLaEIsVUFBTCxDQUFnQnlCLE9BQXZCLEVBQWdDLFVBQUNOLENBQUQsRUFBSUMsSUFBSixFQUFhO0FBQ3pDLGdCQUFJQSxLQUFLVCxJQUFULEVBQWU7QUFDWEQscUJBQUtOLFNBQUwsR0FBaUJnQixJQUFqQjtBQUNIO0FBQ0osU0FKRDs7QUFNQVIsMEJBQWtCLEtBQUtSLFNBQUwsQ0FBZXNCLElBQWYsQ0FBb0JDLE9BQXBCLENBQTRCLFNBQTVCLEVBQXVDLEdBQXZDLEVBQTRDQyxLQUE1QyxDQUFrRCxDQUFsRCxFQUFxRCxDQUFDLENBQXRELENBQWxCO0FBQ0EsYUFBS3ZCLE9BQUwsR0FBZVEsUUFBTUQsZUFBTixDQUFmOztBQUVBQyxVQUFFRyxJQUFGLENBQU8sS0FBS2IsYUFBTCxDQUFtQlcsSUFBbkIsQ0FBd0IsVUFBeEIsQ0FBUCxFQUE0QyxVQUFDSyxDQUFELEVBQUlDLElBQUo7QUFBQSxtQkFBYSxJQUFJMUIsS0FBSixDQUFVMEIsSUFBVixFQUFnQlYsS0FBS0wsT0FBckIsQ0FBYjtBQUFBLFNBQTVDO0FBQ0g7QUFsQytCLENBQXBCLENBQWhCOztBQXNDQVgsUUFBUUcsUUFBUUMsSUFBUixDQUFhQyxNQUFiLENBQW9CO0FBQ3hCOEIsVUFBTSxJQURrQjtBQUV4QnhCLGFBQVMsSUFGZTs7QUFJeEJDLFFBSndCLGdCQUluQndCLEdBSm1CLEVBSWRyQixNQUpjLEVBSU47QUFDZCxhQUFLb0IsSUFBTCxHQUFZaEIsRUFBRWlCLEdBQUYsQ0FBWjtBQUNBLGFBQUt6QixPQUFMLEdBQWVJLE1BQWY7O0FBRUEsZUFBTyxLQUFLc0IsV0FBTCxDQUFpQixLQUFLRixJQUF0QixFQUE0QixPQUE1QixFQUFxQyxRQUFyQyxDQUFQO0FBQ0gsS0FUdUI7QUFXeEJHLFVBWHdCLG9CQVdmO0FBQ0wsWUFBSUYsWUFBSjtBQUNBQSxjQUFNLEtBQUtELElBQUwsQ0FBVUksSUFBVixDQUFlLEtBQWYsQ0FBTjs7QUFFQSxlQUFPLEtBQUs1QixPQUFMLENBQWE2QixHQUFiLENBQWlCLEtBQUs3QixPQUFMLENBQWE2QixHQUFiLEtBQXFCSixHQUF0QyxDQUFQO0FBQ0g7QUFoQnVCLENBQXBCLENBQVIsQyIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL2ZpZWxkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDI1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YTc4OWRlMjMyOThlMTkyYmQzNyIsImxldCBGaWVsZDtcbmxldCBGaWVsZHM7XG5cbndpbmRvdy5GaWVsZHMgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkY29udGFpbmVyOiBudWxsLFxuICAgICRmb3JtOiBudWxsLFxuICAgICRib2R5OiBudWxsLFxuICAgICR0YWdDb250YWluZXI6IG51bGwsXG4gICAgJHRhcmdldEVsOiBudWxsLFxuICAgICR0YXJnZXQ6IG51bGwsXG4gICAgaW5pdChjb250YWluZXIsIGZvcm0sIHRhcmdldCkge1xuICAgICAgICBsZXQgc2VsZjtcbiAgICAgICAgbGV0IHRhZ3M7XG4gICAgICAgIGxldCB0YXJnZXRDbGFzc05hbWU7XG4gICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKGZvcm0pO1xuICAgICAgICB0aGlzLiRib2R5ID0gdGhpcy4kZm9ybS5maW5kKCcuYm9keScpO1xuICAgICAgICB0aGlzLiR0YWdDb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwidGFncy1jb250YWluZXJcIj48L2Rpdj4nKTtcbiAgICAgICAgdGhpcy4kYm9keS5hcHBlbmQodGhpcy4kdGFnQ29udGFpbmVyKTtcbiAgICAgICAgdGFncyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCgkLnBhcnNlSlNPTih0aGlzLiRjb250YWluZXIuJGZpZWxkcyksIChpLCBpdGVtKSA9PiB0YWdzW2ldID0gYDxkaXYgY2xhc3M9J3RhZy1idG4gdGFnLSR7aXRlbS52YWx1ZX0nIGRhdGEtdGFnPSd7JHtpdGVtLnZhbHVlfX0nPiR7aXRlbS5sYWJlbH08L2Rpdj5gKTtcbiAgICAgICAgXG4gICAgICAgIHRhZ3Muc3BsaWNlKDAsIDEpO1xuICAgICAgICB0aGlzLiR0YWdDb250YWluZXIuaHRtbCh0YWdzKTtcbiAgICAgICAgXG4gICAgICAgICQuZWFjaCh0aGlzLiRjb250YWluZXIuJGlucHV0cywgKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICBzZWxmLiR0YXJnZXRFbCA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhcmdldENsYXNzTmFtZSA9IHRoaXMuJHRhcmdldEVsLm5hbWUucmVwbGFjZSgvW19cXFddKy9nLCBcIi1cIikuc2xpY2UoMCwgLTEpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKGAuJHt0YXJnZXRDbGFzc05hbWV9YCk7XG4gICAgICAgIFxuICAgICAgICAkLmVhY2godGhpcy4kdGFnQ29udGFpbmVyLmZpbmQoJy50YWctYnRuJyksIChpLCBpdGVtKSA9PiBuZXcgRmllbGQoaXRlbSwgc2VsZi4kdGFyZ2V0KSk7XG4gICAgfVxufSk7XG5cblxuRmllbGQgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkdGFnOiBudWxsLFxuICAgICR0YXJnZXQ6IG51bGwsXG5cbiAgICBpbml0KHRhZywgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuJHRhZyA9ICQodGFnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kdGFnLCAnY2xpY2snLCAnYWRkVGFnJyk7XG4gICAgfSxcblxuICAgIGFkZFRhZygpIHtcbiAgICAgICAgbGV0IHRhZztcbiAgICAgICAgdGFnID0gdGhpcy4kdGFnLmRhdGEoJ3RhZycpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuJHRhcmdldC52YWwodGhpcy4kdGFyZ2V0LnZhbCgpICsgdGFnKTtcbiAgICB9XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZXZlbG9wbWVudC9qcy9maWVsZHMuanMiXSwic291cmNlUm9vdCI6IiJ9