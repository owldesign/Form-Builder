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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

EntriesIndex = Craft.BaseElementIndex.extend({
    getViewClass: function getViewClass(mode) {
        switch (mode) {
            case 'table':
                return EntriesTableView;
            default:
                return this.base(mode);
        }
    }
});

Craft.registerElementIndexClass('FormBuilder_Entry', EntriesIndex);

EntriesTableView = Craft.TableElementIndexView.extend({
    startDate: null,
    endDate: null,

    startDatepicker: null,
    endDatepicker: null,

    $chartExplorer: null,
    $totalValue: null,
    $chartContainer: null,
    $spinner: null,
    $error: null,
    $chart: null,
    $startDate: null,
    $endDate: null,

    afterInit: function afterInit() {
        this.$explorerContainer = $('<div class="chart-explorer-container"></div>').prependTo(this.$container);
        this.createChartExplorer();

        this.base();
    },
    getStorage: function getStorage(key) {
        return EntriesTableView.getStorage(this.elementIndex._namespace, key);
    },
    setStorage: function setStorage(key, value) {
        EntriesTableView.setStorage(this.elementIndex._namespace, key, value);
    },
    createChartExplorer: function createChartExplorer() {
        var $chartExplorer = $('<div class="chart-explorer"></div>').appendTo(this.$explorerContainer);
        var $chartHeader = $('<div class="chart-header"></div>').appendTo($chartExplorer);
        var $dateRange = $('<div class="date-range" />').appendTo($chartHeader);
        var $startDateContainer = $('<div class="datewrapper"></div>').appendTo($dateRange);
        var $to = $('<span class="to"><i class="far fa-long-arrow-right"></i></span>').appendTo($dateRange);
        var $endDateContainer = $('<div class="datewrapper"></div>').appendTo($dateRange);
        var $total = $('<div class="total"></div>').prependTo($chartHeader);
        var $totalLabel = $('<div class="total-label"><p>' + Craft.t('Total Submissions') + '</p></div>').appendTo($total);
        var $totalValueWrapper = $('<div class="total-value-wrapper"></div>').prependTo($total);
        var $totalValue = $('<span class="total-value">&nbsp;</span>').appendTo($totalValueWrapper);

        this.$chartExplorer = $chartExplorer;
        this.$totalValue = $totalValue;
        this.$chartContainer = $('<div class="chart-container"></div>').appendTo($chartExplorer);
        this.$spinner = $('<div class="loader"><svg width="20px" height="20px" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g fill="none" fill-rule="evenodd"><g transform="translate(4 3)" stroke-width="5"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg></div>').prependTo($chartHeader);
        this.$error = $('<div class="error"></div>').appendTo(this.$chartContainer);
        this.$chart = $('<div class="chart"></div>').appendTo(this.$chartContainer);

        this.$startDate = $('<input type="text" class="text" size="20" autocomplete="off" />').appendTo($startDateContainer);
        this.$endDate = $('<input type="text" class="text" size="20" autocomplete="off" />').appendTo($endDateContainer);

        this.$startDate.datepicker($.extend({
            onSelect: $.proxy(this, 'handleStartDateChange')
        }, Craft.datepickerOptions));

        this.$endDate.datepicker($.extend({
            onSelect: $.proxy(this, 'handleEndDateChange')
        }, Craft.datepickerOptions));

        this.startDatepicker = this.$startDate.data('datepicker');
        this.endDatepicker = this.$endDate.data('datepicker');

        this.addListener(this.$startDate, 'keyup', 'handleStartDateChange');
        this.addListener(this.$endDate, 'keyup', 'handleEndDateChange');

        var startTime = this.getStorage('startTime') || new Date().getTime() - 60 * 60 * 24 * 30 * 1000;
        var endTime = this.getStorage('endTime') || new Date().getTime();

        this.setStartDate(new Date(startTime));
        this.setEndDate(new Date(endTime));

        this.loadReport();
    },
    handleStartDateChange: function handleStartDateChange() {
        if (this.setStartDate(EntriesTableView.getDateFromDatepickerInstance(this.startDatepicker))) {
            this.loadReport();
        }
    },
    handleEndDateChange: function handleEndDateChange() {
        if (this.setEndDate(EntriesTableView.getDateFromDatepickerInstance(this.endDatepicker))) {
            this.loadReport();
        }
    },
    setStartDate: function setStartDate(date) {
        if (this.startDate && date.getTime() == this.startDate.getTime()) {
            return false;
        }

        this.startDate = date;
        this.setStorage('startTime', this.startDate.getTime());
        this.$startDate.val(Craft.formatDate(this.startDate));

        if (this.endDate && this.startDate.getTime() > this.endDate.getTime()) {
            this.setEndDate(new Date(this.startDate.getTime()));
        }

        return true;
    },
    setEndDate: function setEndDate(date) {
        if (this.endDate && date.getTime() == this.endDate.getTime()) {
            return false;
        }

        this.endDate = date;
        this.setStorage('endTime', this.endDate.getTime());
        this.$endDate.val(Craft.formatDate(this.endDate));

        if (this.startDate && this.endDate.getTime() < this.startDate.getTime()) {
            this.setStartDate(new Date(this.endDate.getTime()));
        }

        return true;
    },
    loadReport: function loadReport() {
        var requestData = this.settings.params;

        requestData.startDate = EntriesTableView.getDateValue(this.startDate);
        requestData.endDate = EntriesTableView.getDateValue(this.endDate);
        requestData.formId = this.elementIndex.$source.data('form-id');

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
    }
}, {
    storage: {},

    getStorage: function getStorage(namespace, key) {
        if (EntriesTableView.storage[namespace] && EntriesTableView.storage[namespace][key]) {
            return EntriesTableView.storage[namespace][key];
        }

        return null;
    },
    setStorage: function setStorage(namespace, key, value) {
        if (_typeof(EntriesTableView.storage[namespace]) == ( true ? 'undefined' : _typeof(undefined))) {
            EntriesTableView.storage[namespace] = {};
        }

        EntriesTableView.storage[namespace][key] = value;
    },
    getDateFromDatepickerInstance: function getDateFromDatepickerInstance(inst) {
        return new Date(inst.currentYear, inst.currentMonth, inst.currentDay);
    },
    getDateValue: function getDateValue(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvY2hhcnRzLmpzIl0sIm5hbWVzIjpbIkVudHJpZXNJbmRleCIsIkNyYWZ0IiwiQmFzZUVsZW1lbnRJbmRleCIsImV4dGVuZCIsImdldFZpZXdDbGFzcyIsIm1vZGUiLCJFbnRyaWVzVGFibGVWaWV3IiwiYmFzZSIsInJlZ2lzdGVyRWxlbWVudEluZGV4Q2xhc3MiLCJUYWJsZUVsZW1lbnRJbmRleFZpZXciLCJzdGFydERhdGUiLCJlbmREYXRlIiwic3RhcnREYXRlcGlja2VyIiwiZW5kRGF0ZXBpY2tlciIsIiRjaGFydEV4cGxvcmVyIiwiJHRvdGFsVmFsdWUiLCIkY2hhcnRDb250YWluZXIiLCIkc3Bpbm5lciIsIiRlcnJvciIsIiRjaGFydCIsIiRzdGFydERhdGUiLCIkZW5kRGF0ZSIsImFmdGVySW5pdCIsIiRleHBsb3JlckNvbnRhaW5lciIsIiQiLCJwcmVwZW5kVG8iLCIkY29udGFpbmVyIiwiY3JlYXRlQ2hhcnRFeHBsb3JlciIsImdldFN0b3JhZ2UiLCJrZXkiLCJlbGVtZW50SW5kZXgiLCJfbmFtZXNwYWNlIiwic2V0U3RvcmFnZSIsInZhbHVlIiwiYXBwZW5kVG8iLCIkY2hhcnRIZWFkZXIiLCIkZGF0ZVJhbmdlIiwiJHN0YXJ0RGF0ZUNvbnRhaW5lciIsIiR0byIsIiRlbmREYXRlQ29udGFpbmVyIiwiJHRvdGFsIiwiJHRvdGFsTGFiZWwiLCJ0IiwiJHRvdGFsVmFsdWVXcmFwcGVyIiwiZGF0ZXBpY2tlciIsIm9uU2VsZWN0IiwicHJveHkiLCJkYXRlcGlja2VyT3B0aW9ucyIsImRhdGEiLCJhZGRMaXN0ZW5lciIsInN0YXJ0VGltZSIsIkRhdGUiLCJnZXRUaW1lIiwiZW5kVGltZSIsInNldFN0YXJ0RGF0ZSIsInNldEVuZERhdGUiLCJsb2FkUmVwb3J0IiwiaGFuZGxlU3RhcnREYXRlQ2hhbmdlIiwiZ2V0RGF0ZUZyb21EYXRlcGlja2VySW5zdGFuY2UiLCJoYW5kbGVFbmREYXRlQ2hhbmdlIiwiZGF0ZSIsInZhbCIsImZvcm1hdERhdGUiLCJyZXF1ZXN0RGF0YSIsInNldHRpbmdzIiwicGFyYW1zIiwiZ2V0RGF0ZVZhbHVlIiwiZm9ybUlkIiwiJHNvdXJjZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInJlc3BvbnNlIiwidGV4dFN0YXR1cyIsImVycm9yIiwiY2hhcnQiLCJjaGFydHMiLCJBcmVhIiwiY2hhcnREYXRhVGFibGUiLCJEYXRhVGFibGUiLCJkYXRhVGFibGUiLCJjaGFydFNldHRpbmdzIiwib3JpZW50YXRpb24iLCJmb3JtYXRzIiwiZGF0YVNjYWxlIiwic2NhbGUiLCJtYXJnaW4iLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJkcmF3IiwiaHRtbCIsInRvdGFsSHRtbCIsIm1zZyIsInN0b3JhZ2UiLCJuYW1lc3BhY2UiLCJ1bmRlZmluZWQiLCJpbnN0IiwiY3VycmVudFllYXIiLCJjdXJyZW50TW9udGgiLCJjdXJyZW50RGF5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBQSxlQUFlQyxNQUFNQyxn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QnFDO0FBQ2hDLGVBQU8sSUFBSS9DLElBQUosQ0FBUytDLEtBQUtDLFdBQWQsRUFBMkJELEtBQUtFLFlBQWhDLEVBQThDRixLQUFLRyxVQUFuRCxDQUFQO0FBQ0gsS0FyQkY7QUF1QkNuQyxnQkF2QkQsd0JBdUJjTixJQXZCZCxFQXVCb0I7QUFDZixlQUFPQSxLQUFLMEMsV0FBTCxLQUFtQixHQUFuQixJQUF3QjFDLEtBQUsyQyxRQUFMLEtBQWdCLENBQXhDLElBQTJDLEdBQTNDLEdBQStDM0MsS0FBSzRDLE9BQUwsRUFBdEQ7QUFDSDtBQXpCRixDQXZLZ0IsQ0FBbkIsQyIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL2NoYXJ0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGE0ZmY3Nzc4NDY0MjkxN2FhMWIzIiwiRW50cmllc0luZGV4ID0gQ3JhZnQuQmFzZUVsZW1lbnRJbmRleC5leHRlbmQoe1xuICAgIGdldFZpZXdDbGFzcyhtb2RlKSB7XG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSAndGFibGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBFbnRyaWVzVGFibGVWaWV3XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhc2UobW9kZSlcbiAgICAgICAgfVxuICAgIH0sXG59KVxuXG5DcmFmdC5yZWdpc3RlckVsZW1lbnRJbmRleENsYXNzKCdGb3JtQnVpbGRlcl9FbnRyeScsIEVudHJpZXNJbmRleClcblxuRW50cmllc1RhYmxlVmlldyA9IENyYWZ0LlRhYmxlRWxlbWVudEluZGV4Vmlldy5leHRlbmQoe1xuICAgIHN0YXJ0RGF0ZTogbnVsbCxcbiAgICBlbmREYXRlOiBudWxsLFxuXG4gICAgc3RhcnREYXRlcGlja2VyOiBudWxsLFxuICAgIGVuZERhdGVwaWNrZXI6IG51bGwsXG5cbiAgICAkY2hhcnRFeHBsb3JlcjogbnVsbCxcbiAgICAkdG90YWxWYWx1ZTogbnVsbCxcbiAgICAkY2hhcnRDb250YWluZXI6IG51bGwsXG4gICAgJHNwaW5uZXI6IG51bGwsXG4gICAgJGVycm9yOiBudWxsLFxuICAgICRjaGFydDogbnVsbCxcbiAgICAkc3RhcnREYXRlOiBudWxsLFxuICAgICRlbmREYXRlOiBudWxsLFxuXG4gICAgYWZ0ZXJJbml0KCkge1xuICAgICAgICB0aGlzLiRleHBsb3JlckNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJjaGFydC1leHBsb3Jlci1jb250YWluZXJcIj48L2Rpdj4nKS5wcmVwZW5kVG8odGhpcy4kY29udGFpbmVyKVxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXJ0RXhwbG9yZXIoKVxuXG4gICAgICAgIHRoaXMuYmFzZSgpXG4gICAgfSxcblxuICAgIGdldFN0b3JhZ2Uoa2V5KSB7XG4gICAgICAgIHJldHVybiBFbnRyaWVzVGFibGVWaWV3LmdldFN0b3JhZ2UodGhpcy5lbGVtZW50SW5kZXguX25hbWVzcGFjZSwga2V5KTtcbiAgICB9LFxuXG4gICAgc2V0U3RvcmFnZShrZXksIHZhbHVlKSB7XG4gICAgICAgIEVudHJpZXNUYWJsZVZpZXcuc2V0U3RvcmFnZSh0aGlzLmVsZW1lbnRJbmRleC5fbmFtZXNwYWNlLCBrZXksIHZhbHVlKVxuICAgIH0sXG5cbiAgICBjcmVhdGVDaGFydEV4cGxvcmVyKCkge1xuICAgICAgICBsZXQgJGNoYXJ0RXhwbG9yZXIgPSAkKCc8ZGl2IGNsYXNzPVwiY2hhcnQtZXhwbG9yZXJcIj48L2Rpdj4nKS5hcHBlbmRUbyh0aGlzLiRleHBsb3JlckNvbnRhaW5lcilcbiAgICAgICAgbGV0ICRjaGFydEhlYWRlciA9ICQoJzxkaXYgY2xhc3M9XCJjaGFydC1oZWFkZXJcIj48L2Rpdj4nKS5hcHBlbmRUbygkY2hhcnRFeHBsb3JlcilcbiAgICAgICAgbGV0ICRkYXRlUmFuZ2UgPSAkKCc8ZGl2IGNsYXNzPVwiZGF0ZS1yYW5nZVwiIC8+JykuYXBwZW5kVG8oJGNoYXJ0SGVhZGVyKVxuICAgICAgICBsZXQgJHN0YXJ0RGF0ZUNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJkYXRld3JhcHBlclwiPjwvZGl2PicpLmFwcGVuZFRvKCRkYXRlUmFuZ2UpXG4gICAgICAgIGxldCAkdG8gPSAkKCc8c3BhbiBjbGFzcz1cInRvXCI+PGkgY2xhc3M9XCJmYXIgZmEtbG9uZy1hcnJvdy1yaWdodFwiPjwvaT48L3NwYW4+JykuYXBwZW5kVG8oJGRhdGVSYW5nZSlcbiAgICAgICAgbGV0ICRlbmREYXRlQ29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cImRhdGV3cmFwcGVyXCI+PC9kaXY+JykuYXBwZW5kVG8oJGRhdGVSYW5nZSlcbiAgICAgICAgbGV0ICR0b3RhbCA9ICQoJzxkaXYgY2xhc3M9XCJ0b3RhbFwiPjwvZGl2PicpLnByZXBlbmRUbygkY2hhcnRIZWFkZXIpXG4gICAgICAgIGxldCAkdG90YWxMYWJlbCA9ICQoJzxkaXYgY2xhc3M9XCJ0b3RhbC1sYWJlbFwiPjxwPicrQ3JhZnQudCgnVG90YWwgU3VibWlzc2lvbnMnKSsnPC9wPjwvZGl2PicpLmFwcGVuZFRvKCR0b3RhbClcbiAgICAgICAgbGV0ICR0b3RhbFZhbHVlV3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJ0b3RhbC12YWx1ZS13cmFwcGVyXCI+PC9kaXY+JykucHJlcGVuZFRvKCR0b3RhbClcbiAgICAgICAgbGV0ICR0b3RhbFZhbHVlID0gJCgnPHNwYW4gY2xhc3M9XCJ0b3RhbC12YWx1ZVwiPiZuYnNwOzwvc3Bhbj4nKS5hcHBlbmRUbygkdG90YWxWYWx1ZVdyYXBwZXIpXG5cbiAgICAgICAgdGhpcy4kY2hhcnRFeHBsb3JlciA9ICRjaGFydEV4cGxvcmVyXG4gICAgICAgIHRoaXMuJHRvdGFsVmFsdWUgPSAkdG90YWxWYWx1ZVxuICAgICAgICB0aGlzLiRjaGFydENvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJjaGFydC1jb250YWluZXJcIj48L2Rpdj4nKS5hcHBlbmRUbygkY2hhcnRFeHBsb3JlcilcbiAgICAgICAgdGhpcy4kc3Bpbm5lciA9ICQoJzxkaXYgY2xhc3M9XCJsb2FkZXJcIj48c3ZnIHdpZHRoPVwiMjBweFwiIGhlaWdodD1cIjIwcHhcIiB2aWV3Qm94PVwiMCAwIDQyIDQyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHN0cm9rZT1cIiNmZmZmZmZcIj48ZyBmaWxsPVwibm9uZVwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIj48ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNCAzKVwiIHN0cm9rZS13aWR0aD1cIjVcIj48Y2lyY2xlIHN0cm9rZS1vcGFjaXR5PVwiLjVcIiBjeD1cIjE4XCIgY3k9XCIxOFwiIHI9XCIxOFwiLz48cGF0aCBkPVwiTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4XCI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT1cInRyYW5zZm9ybVwiIHR5cGU9XCJyb3RhdGVcIiBmcm9tPVwiMCAxOCAxOFwiIHRvPVwiMzYwIDE4IDE4XCIgZHVyPVwiMXNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIi8+PC9wYXRoPjwvZz48L2c+PC9zdmc+PC9kaXY+JykucHJlcGVuZFRvKCRjaGFydEhlYWRlcilcbiAgICAgICAgdGhpcy4kZXJyb3IgPSAkKCc8ZGl2IGNsYXNzPVwiZXJyb3JcIj48L2Rpdj4nKS5hcHBlbmRUbyh0aGlzLiRjaGFydENvbnRhaW5lcilcbiAgICAgICAgdGhpcy4kY2hhcnQgPSAkKCc8ZGl2IGNsYXNzPVwiY2hhcnRcIj48L2Rpdj4nKS5hcHBlbmRUbyh0aGlzLiRjaGFydENvbnRhaW5lcilcblxuICAgICAgICB0aGlzLiRzdGFydERhdGUgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHRcIiBzaXplPVwiMjBcIiBhdXRvY29tcGxldGU9XCJvZmZcIiAvPicpLmFwcGVuZFRvKCRzdGFydERhdGVDb250YWluZXIpXG4gICAgICAgIHRoaXMuJGVuZERhdGUgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHRcIiBzaXplPVwiMjBcIiBhdXRvY29tcGxldGU9XCJvZmZcIiAvPicpLmFwcGVuZFRvKCRlbmREYXRlQ29udGFpbmVyKVxuXG4gICAgICAgIHRoaXMuJHN0YXJ0RGF0ZS5kYXRlcGlja2VyKCQuZXh0ZW5kKHtcbiAgICAgICAgICAgIG9uU2VsZWN0OiAkLnByb3h5KHRoaXMsICdoYW5kbGVTdGFydERhdGVDaGFuZ2UnKVxuICAgICAgICB9LCBDcmFmdC5kYXRlcGlja2VyT3B0aW9ucykpXG5cbiAgICAgICAgdGhpcy4kZW5kRGF0ZS5kYXRlcGlja2VyKCQuZXh0ZW5kKHtcbiAgICAgICAgICAgIG9uU2VsZWN0OiAkLnByb3h5KHRoaXMsICdoYW5kbGVFbmREYXRlQ2hhbmdlJylcbiAgICAgICAgfSwgQ3JhZnQuZGF0ZXBpY2tlck9wdGlvbnMpKVxuXG4gICAgICAgIHRoaXMuc3RhcnREYXRlcGlja2VyID0gdGhpcy4kc3RhcnREYXRlLmRhdGEoJ2RhdGVwaWNrZXInKVxuICAgICAgICB0aGlzLmVuZERhdGVwaWNrZXIgPSB0aGlzLiRlbmREYXRlLmRhdGEoJ2RhdGVwaWNrZXInKVxuXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kc3RhcnREYXRlLCAna2V5dXAnLCAnaGFuZGxlU3RhcnREYXRlQ2hhbmdlJylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRlbmREYXRlLCAna2V5dXAnLCAnaGFuZGxlRW5kRGF0ZUNoYW5nZScpXG5cbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IHRoaXMuZ2V0U3RvcmFnZSgnc3RhcnRUaW1lJykgfHwgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSAoNjAgKiA2MCAqIDI0ICogMzAgKiAxMDAwKSlcbiAgICAgICAgbGV0IGVuZFRpbWUgPSB0aGlzLmdldFN0b3JhZ2UoJ2VuZFRpbWUnKSB8fCAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSlcblxuICAgICAgICB0aGlzLnNldFN0YXJ0RGF0ZShuZXcgRGF0ZShzdGFydFRpbWUpKVxuICAgICAgICB0aGlzLnNldEVuZERhdGUobmV3IERhdGUoZW5kVGltZSkpXG5cbiAgICAgICAgdGhpcy5sb2FkUmVwb3J0KClcbiAgICB9LFxuXG4gICAgaGFuZGxlU3RhcnREYXRlQ2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5zZXRTdGFydERhdGUoRW50cmllc1RhYmxlVmlldy5nZXREYXRlRnJvbURhdGVwaWNrZXJJbnN0YW5jZSh0aGlzLnN0YXJ0RGF0ZXBpY2tlcikpKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRSZXBvcnQoKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZUVuZERhdGVDaGFuZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLnNldEVuZERhdGUoRW50cmllc1RhYmxlVmlldy5nZXREYXRlRnJvbURhdGVwaWNrZXJJbnN0YW5jZSh0aGlzLmVuZERhdGVwaWNrZXIpKSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkUmVwb3J0KClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRTdGFydERhdGUoZGF0ZSkge1xuICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgZGF0ZS5nZXRUaW1lKCkgPT0gdGhpcy5zdGFydERhdGUuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gZGF0ZVxuICAgICAgICB0aGlzLnNldFN0b3JhZ2UoJ3N0YXJ0VGltZScsIHRoaXMuc3RhcnREYXRlLmdldFRpbWUoKSlcbiAgICAgICAgdGhpcy4kc3RhcnREYXRlLnZhbChDcmFmdC5mb3JtYXREYXRlKHRoaXMuc3RhcnREYXRlKSlcblxuICAgICAgICBpZiAodGhpcy5lbmREYXRlICYmIHRoaXMuc3RhcnREYXRlLmdldFRpbWUoKSA+IHRoaXMuZW5kRGF0ZS5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZShuZXcgRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5nZXRUaW1lKCkpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgc2V0RW5kRGF0ZShkYXRlKSB7XG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgJiYgZGF0ZS5nZXRUaW1lKCkgPT0gdGhpcy5lbmREYXRlLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVuZERhdGUgPSBkYXRlXG4gICAgICAgIHRoaXMuc2V0U3RvcmFnZSgnZW5kVGltZScsIHRoaXMuZW5kRGF0ZS5nZXRUaW1lKCkpXG4gICAgICAgIHRoaXMuJGVuZERhdGUudmFsKENyYWZ0LmZvcm1hdERhdGUodGhpcy5lbmREYXRlKSlcblxuICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlLmdldFRpbWUoKSA8IHRoaXMuc3RhcnREYXRlLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUobmV3IERhdGUodGhpcy5lbmREYXRlLmdldFRpbWUoKSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG5cbiAgICBsb2FkUmVwb3J0KCkge1xuICAgICAgICBsZXQgcmVxdWVzdERhdGEgPSB0aGlzLnNldHRpbmdzLnBhcmFtc1xuXG4gICAgICAgIHJlcXVlc3REYXRhLnN0YXJ0RGF0ZSA9IEVudHJpZXNUYWJsZVZpZXcuZ2V0RGF0ZVZhbHVlKHRoaXMuc3RhcnREYXRlKVxuICAgICAgICByZXF1ZXN0RGF0YS5lbmREYXRlID0gRW50cmllc1RhYmxlVmlldy5nZXREYXRlVmFsdWUodGhpcy5lbmREYXRlKVxuICAgICAgICByZXF1ZXN0RGF0YS5mb3JtSWQgPSB0aGlzLmVsZW1lbnRJbmRleC4kc291cmNlLmRhdGEoJ2Zvcm0taWQnKVxuXG4gICAgICAgIHRoaXMuJHNwaW5uZXIucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgIHRoaXMuJGVycm9yLmFkZENsYXNzKCdoaWRkZW4nKVxuICAgICAgICB0aGlzLiRjaGFydC5yZW1vdmVDbGFzcygnZXJyb3InKVxuXG4gICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9jaGFydHMvZ2V0RW50cmllc0NvdW50JywgcmVxdWVzdERhdGEsICQucHJveHkoZnVuY3Rpb24ocmVzcG9uc2UsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgIHRoaXMuJHNwaW5uZXIuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgICAgICAgICAgIGlmKHRleHRTdGF0dXMgPT0gJ3N1Y2Nlc3MnICYmIHR5cGVvZihyZXNwb25zZS5lcnJvcikgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpZighdGhpcy5jaGFydCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENyYWZ0LmNoYXJ0cy5BcmVhKHRoaXMuJGNoYXJ0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBjaGFydERhdGFUYWJsZSA9IG5ldyBDcmFmdC5jaGFydHMuRGF0YVRhYmxlKHJlc3BvbnNlLmRhdGFUYWJsZSlcblxuICAgICAgICAgICAgICAgIGxldCBjaGFydFNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbjogcmVzcG9uc2Uub3JpZW50YXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHM6IHJlc3BvbnNlLmZvcm1hdHMsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFTY2FsZTogcmVzcG9uc2Uuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogeyB0b3A6IDEwLCByaWdodDogMTAsIGJvdHRvbTogMzAsIGxlZnQ6IDEwIH1cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuY2hhcnQuc2V0dGluZ3MuZm9ybWF0cyA9IHJlc3BvbnNlLmZvcm1hdHNcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnQuZHJhdyhjaGFydERhdGFUYWJsZSwgY2hhcnRTZXR0aW5ncylcbiAgICAgICAgICAgICAgICB0aGlzLiR0b3RhbFZhbHVlLmh0bWwocmVzcG9uc2UudG90YWxIdG1sKVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtc2cgPSBDcmFmdC50KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicpXG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHJlc3BvbnNlKSAhPSAndW5kZWZpbmVkJyAmJiByZXNwb25zZSAmJiB0eXBlb2YocmVzcG9uc2UuZXJyb3IpICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IHJlc3BvbnNlLmVycm9yXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3IuaHRtbChtc2cpXG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3IucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgICAgICAgICAgdGhpcy4kY2hhcnQuYWRkQ2xhc3MoJ2Vycm9yJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgIH1cbn0sIHtcbiAgICBzdG9yYWdlOiB7fSxcblxuICAgIGdldFN0b3JhZ2UobmFtZXNwYWNlLCBrZXkpIHtcbiAgICAgICAgaWYgKEVudHJpZXNUYWJsZVZpZXcuc3RvcmFnZVtuYW1lc3BhY2VdICYmIEVudHJpZXNUYWJsZVZpZXcuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBFbnRyaWVzVGFibGVWaWV3LnN0b3JhZ2VbbmFtZXNwYWNlXVtrZXldXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH0sXG5cbiAgICBzZXRTdG9yYWdlKG5hbWVzcGFjZSwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIEVudHJpZXNUYWJsZVZpZXcuc3RvcmFnZVtuYW1lc3BhY2VdID09IHR5cGVvZiB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEVudHJpZXNUYWJsZVZpZXcuc3RvcmFnZVtuYW1lc3BhY2VdID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIEVudHJpZXNUYWJsZVZpZXcuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV0gPSB2YWx1ZVxuICAgIH0sXG5cbiAgICBnZXREYXRlRnJvbURhdGVwaWNrZXJJbnN0YW5jZShpbnN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShpbnN0LmN1cnJlbnRZZWFyLCBpbnN0LmN1cnJlbnRNb250aCwgaW5zdC5jdXJyZW50RGF5KVxuICAgIH0sXG5cbiAgICBnZXREYXRlVmFsdWUoZGF0ZSkge1xuICAgICAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpKyctJysoZGF0ZS5nZXRNb250aCgpKzEpKyctJytkYXRlLmdldERhdGUoKVxuICAgIH1cbn0pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZGV2ZWxvcG1lbnQvanMvY2hhcnRzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==