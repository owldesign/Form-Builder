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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var DashboardReportChart = void 0;

DashboardReportChart = Garnish.Base.extend({
    $container: null,
    $chartExplorer: null,
    $totalValue: null,
    $chartContainer: null,
    $spinner: null,
    $error: null,
    $chart: null,

    params: {
        startDate: null,
        endDate: null
    },

    init: function init(el) {
        this.$container = $(el);
        this.createChartExplorer();

        this.handleMonthChange();
    },
    getStorage: function getStorage(key) {
        return DashboardReportChart.getStorage(this._namespace, key);
    },
    setStorage: function setStorage(key, value) {
        DashboardReportChart.setStorage(this._namespace, key, value);
    },
    createChartExplorer: function createChartExplorer() {
        var $chartExplorer = $('<div class="chart-explorer"></div>').appendTo(this.$container);
        var $chartHeader = $('<div class="chart-header"></div>').appendTo($chartExplorer);

        var $timelinePickerWrapper = $('<div class="timeline-wrapper" />').appendTo($chartHeader);

        var $total = $('<div class="total"></div>').prependTo($chartHeader);
        var $totalLabel = $('<div class="total-label"><p>' + Craft.t('Total Submissions') + '</p></div>').appendTo($total);
        var $totalValueWrapper = $('<div class="total-value-wrapper"></div>').prependTo($total);
        var $totalValue = $('<span class="total-value">&nbsp;</span>').appendTo($totalValueWrapper);

        this.$chartExplorer = $chartExplorer;
        this.$totalValue = $totalValue;
        this.$chartContainer = $('<div class="chart-container"></div>').appendTo($chartExplorer);
        this.$spinner = $('<div class="loader"><svg width="20px" height="20px" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" stroke="#E9EFF4"><g fill="none" fill-rule="evenodd"><g transform="translate(4 3)" stroke-width="5"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg></div>').prependTo($chartHeader);
        this.$error = $('<div class="error"></div>').appendTo(this.$chartContainer);
        this.$chart = $('<div class="chart"></div>').appendTo(this.$chartContainer);

        this.$monthBtn = $('<button id="month-range" class="active">Last 30 days</buttons>').appendTo($timelinePickerWrapper);
        this.$weekBtn = $('<button id="week-range">Week</buttons>').appendTo($timelinePickerWrapper);

        this.addListener(this.$monthBtn, 'click', 'handleMonthChange');
        this.addListener(this.$weekBtn, 'click', 'handleWeekChange');
    },
    handleMonthChange: function handleMonthChange() {
        this.$weekBtn.removeClass('active');
        this.$monthBtn.addClass('active');

        var startTime = this.monthRangeDate();
        var endTime = new Date(new Date().getTime());

        this.params.startDate = startTime;
        this.params.endDate = endTime;

        this.setStorage('startTime', startTime);
        this.setStorage('endTime', endTime);

        this.loadReport();
    },
    handleWeekChange: function handleWeekChange() {
        this.$monthBtn.removeClass('active');
        this.$weekBtn.addClass('active');

        var startTime = this.weekRangeDate();
        var endTime = new Date(new Date().getTime());

        this.params.startDate = startTime;
        this.params.endDate = endTime;

        this.setStorage('startTime', startTime);
        this.setStorage('endTime', endTime);

        this.loadReport();
    },
    monthRangeDate: function monthRangeDate() {
        var today = new Date();
        var priorDate = new Date(new Date().setDate(today.getDate() - 30));

        return priorDate;
    },
    weekRangeDate: function weekRangeDate() {
        var firstDay = new Date(new Date().getTime());
        var previousweek = new Date(firstDay.getTime() - 7 * 24 * 60 * 60 * 1000);

        return previousweek;
    },
    loadReport: function loadReport() {
        var requestData = this.params;

        requestData.startDate = this.getDateValue(this.params.startDate);
        requestData.endDate = this.getDateValue(this.params.endDate);
        requestData.elementType = 'FormBuilder_Entry';

        this.$spinner.removeClass('hidden');
        this.$error.addClass('hidden');
        this.$chart.removeClass('error');

        Craft.postActionRequest('formBuilder/charts/getEntriesCount', requestData, $.proxy(function (response, textStatus) {
            this.$spinner.addClass('hidden');

            if (textStatus == 'success' && typeof response.error == 'undefined') {
                if (!this.chart) {
                    this.chart = new Craft.charts.Area(this.$chart);
                }

                var chartDataTable = new Craft.charts.DataTable(response.dataTable);

                var chartSettings = {
                    orientation: response.orientation,
                    formats: response.formats,
                    dataScale: response.scale,
                    margin: { top: 10, right: 10, bottom: 30, left: 10 }

                    // this.chart.settings.formats = response.formats

                };this.chart.draw(chartDataTable, chartSettings);
                this.$totalValue.html(response.totalHtml);
            } else {
                var msg = Craft.t('An unknown error occurred.');

                if (typeof response != 'undefined' && response && typeof response.error != 'undefined') {
                    msg = response.error;
                }

                this.$error.html(msg);
                this.$error.removeClass('hidden');
                this.$chart.addClass('error');
            }
        }, this));
    },
    getDateFromDatepickerInstance: function getDateFromDatepickerInstance(inst) {
        return new Date(inst.currentYear, inst.currentMonth, inst.currentDay);
    },
    getDateValue: function getDateValue(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
}, {
    storage: {},

    getStorage: function getStorage(namespace, key) {
        if (DashboardReportChart.storage[namespace] && DashboardReportChart.storage[namespace][key]) {
            return DashboardReportChart.storage[namespace][key];
        }

        return null;
    },
    setStorage: function setStorage(namespace, key, value) {
        if (_typeof(DashboardReportChart.storage[namespace]) == ( true ? 'undefined' : _typeof(undefined))) {
            DashboardReportChart.storage[namespace] = {};
        }

        DashboardReportChart.storage[namespace][key] = value;
    }
});

Garnish.$doc.ready(function () {
    new DashboardReportChart($('.chart-explorer-container'));
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZGFzaGJvYXJkLmpzIl0sIm5hbWVzIjpbIkRhc2hib2FyZFJlcG9ydENoYXJ0IiwiR2FybmlzaCIsIkJhc2UiLCJleHRlbmQiLCIkY29udGFpbmVyIiwiJGNoYXJ0RXhwbG9yZXIiLCIkdG90YWxWYWx1ZSIsIiRjaGFydENvbnRhaW5lciIsIiRzcGlubmVyIiwiJGVycm9yIiwiJGNoYXJ0IiwicGFyYW1zIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsImluaXQiLCJlbCIsIiQiLCJjcmVhdGVDaGFydEV4cGxvcmVyIiwiaGFuZGxlTW9udGhDaGFuZ2UiLCJnZXRTdG9yYWdlIiwia2V5IiwiX25hbWVzcGFjZSIsInNldFN0b3JhZ2UiLCJ2YWx1ZSIsImFwcGVuZFRvIiwiJGNoYXJ0SGVhZGVyIiwiJHRpbWVsaW5lUGlja2VyV3JhcHBlciIsIiR0b3RhbCIsInByZXBlbmRUbyIsIiR0b3RhbExhYmVsIiwiQ3JhZnQiLCJ0IiwiJHRvdGFsVmFsdWVXcmFwcGVyIiwiJG1vbnRoQnRuIiwiJHdlZWtCdG4iLCJhZGRMaXN0ZW5lciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzdGFydFRpbWUiLCJtb250aFJhbmdlRGF0ZSIsImVuZFRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsImxvYWRSZXBvcnQiLCJoYW5kbGVXZWVrQ2hhbmdlIiwid2Vla1JhbmdlRGF0ZSIsInRvZGF5IiwicHJpb3JEYXRlIiwic2V0RGF0ZSIsImdldERhdGUiLCJmaXJzdERheSIsInByZXZpb3Vzd2VlayIsInJlcXVlc3REYXRhIiwiZ2V0RGF0ZVZhbHVlIiwiZWxlbWVudFR5cGUiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInByb3h5IiwicmVzcG9uc2UiLCJ0ZXh0U3RhdHVzIiwiZXJyb3IiLCJjaGFydCIsImNoYXJ0cyIsIkFyZWEiLCJjaGFydERhdGFUYWJsZSIsIkRhdGFUYWJsZSIsImRhdGFUYWJsZSIsImNoYXJ0U2V0dGluZ3MiLCJvcmllbnRhdGlvbiIsImZvcm1hdHMiLCJkYXRhU2NhbGUiLCJzY2FsZSIsIm1hcmdpbiIsInRvcCIsInJpZ2h0IiwiYm90dG9tIiwibGVmdCIsImRyYXciLCJodG1sIiwidG90YWxIdG1sIiwibXNnIiwiZ2V0RGF0ZUZyb21EYXRlcGlja2VySW5zdGFuY2UiLCJpbnN0IiwiY3VycmVudFllYXIiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50RGF5IiwiZGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJzdG9yYWdlIiwibmFtZXNwYWNlIiwidW5kZWZpbmVkIiwiJGRvYyIsInJlYWR5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsSUFBSUEsNkJBQUo7O0FBRUFBLHVCQUF1QkMsUUFBUUMsSUFBUixDQUFhQyxNQUFiLENBQW9CO0FBQ3ZDQyxnQkFBWSxJQUQyQjtBQUV2Q0Msb0JBQWdCLElBRnVCO0FBR3ZDQyxpQkFBYSxJQUgwQjtBQUl2Q0MscUJBQWlCLElBSnNCO0FBS3ZDQyxjQUFVLElBTDZCO0FBTXZDQyxZQUFRLElBTitCO0FBT3ZDQyxZQUFRLElBUCtCOztBQVN2Q0MsWUFBUTtBQUNKQyxtQkFBVyxJQURQO0FBRUpDLGlCQUFT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QUFJcEIscUJBQXFCd0YsT0FBckIsQ0FBNkJDLFNBQTdCLEtBQTJDekYscUJBQXFCd0YsT0FBckIsQ0FBNkJDLFNBQTdCLEVBQXdDckUsR0FBeEMsQ0FBL0MsRUFBNkY7QUFDekYsbUJBQU9wQixxQkFBcUJ3RixPQUFyQixDQUE2QkMsU0FBN0IsRUFBd0NyRSxHQUF4QyxDQUFQO0FBQ0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0FUSDtBQVdFRSxjQVhGLHNCQVdhbUUsU0FYYixFQVd3QnJFLEdBWHhCLEVBVzZCRyxLQVg3QixFQVdvQztBQUM5QixZQUFJLFFBQU92QixxQkFBcUJ3RixPQUFyQixDQUE2QkMsU0FBN0IsQ0FBUCxvQ0FBeURDLFNBQXpELEVBQUosRUFBd0U7QUFDcEUxRixpQ0FBcUJ3RixPQUFyQixDQUE2QkMsU0FBN0IsSUFBMEMsRUFBMUM7QUFDSDs7QUFFRHpGLDZCQUFxQndGLE9BQXJCLENBQTZCQyxTQUE3QixFQUF3Q3JFLEdBQXhDLElBQStDRyxLQUEvQztBQUNIO0FBakJILENBM0pxQixDQUF2Qjs7QUFrTEF0QixRQUFRMEYsSUFBUixDQUFhQyxLQUFiLENBQW1CLFlBQU07QUFDckIsUUFBSTVGLG9CQUFKLENBQXlCZ0IsRUFBRSwyQkFBRixDQUF6QjtBQUNILENBRkQsRSIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL2Rhc2hib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGE0ZmY3Nzc4NDY0MjkxN2FhMWIzIiwibGV0IERhc2hib2FyZFJlcG9ydENoYXJ0XG5cbkRhc2hib2FyZFJlcG9ydENoYXJ0ID0gR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgJGNvbnRhaW5lcjogbnVsbCxcbiAgICAkY2hhcnRFeHBsb3JlcjogbnVsbCxcbiAgICAkdG90YWxWYWx1ZTogbnVsbCxcbiAgICAkY2hhcnRDb250YWluZXI6IG51bGwsXG4gICAgJHNwaW5uZXI6IG51bGwsXG4gICAgJGVycm9yOiBudWxsLFxuICAgICRjaGFydDogbnVsbCxcblxuICAgIHBhcmFtczoge1xuICAgICAgICBzdGFydERhdGU6IG51bGwsXG4gICAgICAgIGVuZERhdGU6IG51bGxcbiAgICB9LFxuXG4gICAgaW5pdChlbCkge1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKGVsKVxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0RXhwbG9yZXIoKVxuXG4gICAgICAgIHRoaXMuaGFuZGxlTW9udGhDaGFuZ2UoKVxuICAgIH0sXG5cbiAgICBnZXRTdG9yYWdlKGtleSkge1xuICAgICAgICByZXR1cm4gRGFzaGJvYXJkUmVwb3J0Q2hhcnQuZ2V0U3RvcmFnZSh0aGlzLl9uYW1lc3BhY2UsIGtleSk7XG4gICAgfSxcblxuICAgIHNldFN0b3JhZ2Uoa2V5LCB2YWx1ZSkge1xuICAgICAgICBEYXNoYm9hcmRSZXBvcnRDaGFydC5zZXRTdG9yYWdlKHRoaXMuX25hbWVzcGFjZSwga2V5LCB2YWx1ZSlcbiAgICB9LFxuXG4gICAgY3JlYXRlQ2hhcnRFeHBsb3JlcigpIHtcbiAgICAgICAgbGV0ICRjaGFydEV4cGxvcmVyID0gJCgnPGRpdiBjbGFzcz1cImNoYXJ0LWV4cGxvcmVyXCI+PC9kaXY+JykuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKVxuICAgICAgICBsZXQgJGNoYXJ0SGVhZGVyID0gJCgnPGRpdiBjbGFzcz1cImNoYXJ0LWhlYWRlclwiPjwvZGl2PicpLmFwcGVuZFRvKCRjaGFydEV4cGxvcmVyKVxuICAgICAgICBcbiAgICAgICAgbGV0ICR0aW1lbGluZVBpY2tlcldyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwidGltZWxpbmUtd3JhcHBlclwiIC8+JykuYXBwZW5kVG8oJGNoYXJ0SGVhZGVyKVxuXG4gICAgICAgIGxldCAkdG90YWwgPSAkKCc8ZGl2IGNsYXNzPVwidG90YWxcIj48L2Rpdj4nKS5wcmVwZW5kVG8oJGNoYXJ0SGVhZGVyKVxuICAgICAgICBsZXQgJHRvdGFsTGFiZWwgPSAkKCc8ZGl2IGNsYXNzPVwidG90YWwtbGFiZWxcIj48cD4nK0NyYWZ0LnQoJ1RvdGFsIFN1Ym1pc3Npb25zJykrJzwvcD48L2Rpdj4nKS5hcHBlbmRUbygkdG90YWwpXG4gICAgICAgIGxldCAkdG90YWxWYWx1ZVdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwidG90YWwtdmFsdWUtd3JhcHBlclwiPjwvZGl2PicpLnByZXBlbmRUbygkdG90YWwpXG4gICAgICAgIGxldCAkdG90YWxWYWx1ZSA9ICQoJzxzcGFuIGNsYXNzPVwidG90YWwtdmFsdWVcIj4mbmJzcDs8L3NwYW4+JykuYXBwZW5kVG8oJHRvdGFsVmFsdWVXcmFwcGVyKVxuXG4gICAgICAgIHRoaXMuJGNoYXJ0RXhwbG9yZXIgPSAkY2hhcnRFeHBsb3JlclxuICAgICAgICB0aGlzLiR0b3RhbFZhbHVlID0gJHRvdGFsVmFsdWVcbiAgICAgICAgdGhpcy4kY2hhcnRDb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwiY2hhcnQtY29udGFpbmVyXCI+PC9kaXY+JykuYXBwZW5kVG8oJGNoYXJ0RXhwbG9yZXIpXG4gICAgICAgIHRoaXMuJHNwaW5uZXIgPSAkKCc8ZGl2IGNsYXNzPVwibG9hZGVyXCI+PHN2ZyB3aWR0aD1cIjIwcHhcIiBoZWlnaHQ9XCIyMHB4XCIgdmlld0JveD1cIjAgMCA0MiA0MlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBzdHJva2U9XCIjRTlFRkY0XCI+PGcgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCI+PGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDQgMylcIiBzdHJva2Utd2lkdGg9XCI1XCI+PGNpcmNsZSBzdHJva2Utb3BhY2l0eT1cIi41XCIgY3g9XCIxOFwiIGN5PVwiMThcIiByPVwiMThcIi8+PHBhdGggZD1cIk0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFwiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9XCJ0cmFuc2Zvcm1cIiB0eXBlPVwicm90YXRlXCIgZnJvbT1cIjAgMTggMThcIiB0bz1cIjM2MCAxOCAxOFwiIGR1cj1cIjFzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIvPjwvcGF0aD48L2c+PC9nPjwvc3ZnPjwvZGl2PicpLnByZXBlbmRUbygkY2hhcnRIZWFkZXIpXG4gICAgICAgIHRoaXMuJGVycm9yID0gJCgnPGRpdiBjbGFzcz1cImVycm9yXCI+PC9kaXY+JykuYXBwZW5kVG8odGhpcy4kY2hhcnRDb250YWluZXIpXG4gICAgICAgIHRoaXMuJGNoYXJ0ID0gJCgnPGRpdiBjbGFzcz1cImNoYXJ0XCI+PC9kaXY+JykuYXBwZW5kVG8odGhpcy4kY2hhcnRDb250YWluZXIpXG5cbiAgICAgICAgdGhpcy4kbW9udGhCdG4gPSAkKCc8YnV0dG9uIGlkPVwibW9udGgtcmFuZ2VcIiBjbGFzcz1cImFjdGl2ZVwiPkxhc3QgMzAgZGF5czwvYnV0dG9ucz4nKS5hcHBlbmRUbygkdGltZWxpbmVQaWNrZXJXcmFwcGVyKVxuICAgICAgICB0aGlzLiR3ZWVrQnRuID0gJCgnPGJ1dHRvbiBpZD1cIndlZWstcmFuZ2VcIj5XZWVrPC9idXR0b25zPicpLmFwcGVuZFRvKCR0aW1lbGluZVBpY2tlcldyYXBwZXIpXG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRtb250aEJ0biwgJ2NsaWNrJywgJ2hhbmRsZU1vbnRoQ2hhbmdlJylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiR3ZWVrQnRuLCAnY2xpY2snLCAnaGFuZGxlV2Vla0NoYW5nZScpXG4gICAgfSxcblxuICAgIGhhbmRsZU1vbnRoQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLiR3ZWVrQnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB0aGlzLiRtb250aEJ0bi5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSB0aGlzLm1vbnRoUmFuZ2VEYXRlKClcbiAgICAgICAgbGV0IGVuZFRpbWUgPSBuZXcgRGF0ZSgoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSkpXG5cbiAgICAgICAgdGhpcy5wYXJhbXMuc3RhcnREYXRlID0gc3RhcnRUaW1lXG4gICAgICAgIHRoaXMucGFyYW1zLmVuZERhdGUgPSBlbmRUaW1lXG5cbiAgICAgICAgdGhpcy5zZXRTdG9yYWdlKCdzdGFydFRpbWUnLCBzdGFydFRpbWUpXG4gICAgICAgIHRoaXMuc2V0U3RvcmFnZSgnZW5kVGltZScsIGVuZFRpbWUpXG5cbiAgICAgICAgdGhpcy5sb2FkUmVwb3J0KClcbiAgICB9LFxuXG4gICAgaGFuZGxlV2Vla0NoYW5nZSgpIHtcbiAgICAgICAgdGhpcy4kbW9udGhCdG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJHdlZWtCdG4uYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IHRoaXMud2Vla1JhbmdlRGF0ZSgpXG4gICAgICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpKVxuXG4gICAgICAgIHRoaXMucGFyYW1zLnN0YXJ0RGF0ZSA9IHN0YXJ0VGltZVxuICAgICAgICB0aGlzLnBhcmFtcy5lbmREYXRlID0gZW5kVGltZVxuXG4gICAgICAgIHRoaXMuc2V0U3RvcmFnZSgnc3RhcnRUaW1lJywgc3RhcnRUaW1lKVxuICAgICAgICB0aGlzLnNldFN0b3JhZ2UoJ2VuZFRpbWUnLCBlbmRUaW1lKVxuXG4gICAgICAgIHRoaXMubG9hZFJlcG9ydCgpXG4gICAgfSxcblxuICAgIG1vbnRoUmFuZ2VEYXRlKCkge1xuICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGxldCBwcmlvckRhdGUgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpLTMwKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBwcmlvckRhdGVcbiAgICB9LFxuXG4gICAgd2Vla1JhbmdlRGF0ZSgpIHtcbiAgICAgICAgbGV0IGZpcnN0RGF5ID0gbmV3IERhdGUoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSlcbiAgICAgICAgbGV0IHByZXZpb3Vzd2Vlaz0gbmV3IERhdGUoZmlyc3REYXkuZ2V0VGltZSgpIC0gNyAqIDI0ICogNjAgKiA2MCAqIDEwMDApXG5cbiAgICAgICAgcmV0dXJuIHByZXZpb3Vzd2Vla1xuICAgIH0sXG5cblxuICAgIGxvYWRSZXBvcnQoKSB7XG4gICAgICAgIGxldCByZXF1ZXN0RGF0YSA9IHRoaXMucGFyYW1zXG5cbiAgICAgICAgcmVxdWVzdERhdGEuc3RhcnREYXRlID0gdGhpcy5nZXREYXRlVmFsdWUodGhpcy5wYXJhbXMuc3RhcnREYXRlKVxuICAgICAgICByZXF1ZXN0RGF0YS5lbmREYXRlID0gdGhpcy5nZXREYXRlVmFsdWUodGhpcy5wYXJhbXMuZW5kRGF0ZSlcbiAgICAgICAgcmVxdWVzdERhdGEuZWxlbWVudFR5cGUgPSAnRm9ybUJ1aWxkZXJfRW50cnknXG5cbiAgICAgICAgdGhpcy4kc3Bpbm5lci5yZW1vdmVDbGFzcygnaGlkZGVuJylcbiAgICAgICAgdGhpcy4kZXJyb3IuYWRkQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgIHRoaXMuJGNoYXJ0LnJlbW92ZUNsYXNzKCdlcnJvcicpXG5cbiAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2NoYXJ0cy9nZXRFbnRyaWVzQ291bnQnLCByZXF1ZXN0RGF0YSwgJC5wcm94eShmdW5jdGlvbihyZXNwb25zZSwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy4kc3Bpbm5lci5hZGRDbGFzcygnaGlkZGVuJylcblxuICAgICAgICAgICAgaWYodGV4dFN0YXR1cyA9PSAnc3VjY2VzcycgJiYgdHlwZW9mKHJlc3BvbnNlLmVycm9yKSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ3JhZnQuY2hhcnRzLkFyZWEodGhpcy4kY2hhcnQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoYXJ0RGF0YVRhYmxlID0gbmV3IENyYWZ0LmNoYXJ0cy5EYXRhVGFibGUocmVzcG9uc2UuZGF0YVRhYmxlKVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoYXJ0U2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWVudGF0aW9uOiByZXNwb25zZS5vcmllbnRhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0czogcmVzcG9uc2UuZm9ybWF0cyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNjYWxlOiByZXNwb25zZS5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiB7IHRvcDogMTAsIHJpZ2h0OiAxMCwgYm90dG9tOiAzMCwgbGVmdDogMTAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuY2hhcnQuc2V0dGluZ3MuZm9ybWF0cyA9IHJlc3BvbnNlLmZvcm1hdHNcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuZHJhdyhjaGFydERhdGFUYWJsZSwgY2hhcnRTZXR0aW5ncylcbiAgICAgICAgICAgICAgICB0aGlzLiR0b3RhbFZhbHVlLmh0bWwocmVzcG9uc2UudG90YWxIdG1sKVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtc2cgPSBDcmFmdC50KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicpXG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHJlc3BvbnNlKSAhPSAndW5kZWZpbmVkJyAmJiByZXNwb25zZSAmJiB0eXBlb2YocmVzcG9uc2UuZXJyb3IpICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IHJlc3BvbnNlLmVycm9yXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3IuaHRtbChtc2cpXG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3IucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgICAgICAgICAgdGhpcy4kY2hhcnQuYWRkQ2xhc3MoJ2Vycm9yJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgIH0sXG5cbiAgICBnZXREYXRlRnJvbURhdGVwaWNrZXJJbnN0YW5jZShpbnN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShpbnN0LmN1cnJlbnRZZWFyLCBpbnN0LmN1cnJlbnRNb250aCwgaW5zdC5jdXJyZW50RGF5KVxuICAgIH0sXG5cbiAgICBnZXREYXRlVmFsdWUoZGF0ZSkge1xuICAgICAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpKyctJysoZGF0ZS5nZXRNb250aCgpKzEpKyctJytkYXRlLmdldERhdGUoKVxuICAgIH1cbn0se1xuICAgIHN0b3JhZ2U6IHt9LFxuXG4gICAgZ2V0U3RvcmFnZShuYW1lc3BhY2UsIGtleSkge1xuICAgICAgICBpZiAoRGFzaGJvYXJkUmVwb3J0Q2hhcnQuc3RvcmFnZVtuYW1lc3BhY2VdICYmIERhc2hib2FyZFJlcG9ydENoYXJ0LnN0b3JhZ2VbbmFtZXNwYWNlXVtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gRGFzaGJvYXJkUmVwb3J0Q2hhcnQuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSxcblxuICAgIHNldFN0b3JhZ2UobmFtZXNwYWNlLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgRGFzaGJvYXJkUmVwb3J0Q2hhcnQuc3RvcmFnZVtuYW1lc3BhY2VdID09IHR5cGVvZiB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIERhc2hib2FyZFJlcG9ydENoYXJ0LnN0b3JhZ2VbbmFtZXNwYWNlXSA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICBEYXNoYm9hcmRSZXBvcnRDaGFydC5zdG9yYWdlW25hbWVzcGFjZV1ba2V5XSA9IHZhbHVlXG4gICAgfVxufSlcblxuXG5cblxuR2FybmlzaC4kZG9jLnJlYWR5KCgpID0+IHtcbiAgICBuZXcgRGFzaGJvYXJkUmVwb3J0Q2hhcnQoJCgnLmNoYXJ0LWV4cGxvcmVyLWNvbnRhaW5lcicpKVxufSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZXZlbG9wbWVudC9qcy9kYXNoYm9hcmQuanMiXSwic291cmNlUm9vdCI6IiJ9