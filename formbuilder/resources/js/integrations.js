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
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ({

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28);


/***/ }),

/***/ 28:
/***/ (function(module, exports) {

NotificationElementModal = Craft.BaseElementSelectorModal.extend({
    $notificationsContainer: null,

    type: null,
    index: null,
    form: null,

    init: function init(elementType, settings, type, form) {
        this.type = type;
        this.form = form;
        this.base(elementType, settings);
        this.index = Math.floor(Math.random() * 10000 + 1);

        this.$notificationsContainer = $('#formbuilder-notifications-container');
    },
    onSelectionChange: function onSelectionChange() {
        this.base();
    },
    onSelect: function onSelect(elementInfo) {

        Craft.postActionRequest('form-builder/integrations/add-notification', {
            index: this.index,
            elementId: elementInfo[0].id,
            type: this.type,
            form: this.form
        }, $.proxy(function (response, textStatus) {
            if (response.success) {
                this.$notificationsContainer.append(response.markup);

                new NotificationSection(response.markup, this.type, this.form, this.index);
            }
        }, this));
    }
});

NotificationSection = Garnish.Base.extend({
    $container: null,
    type: null,
    form: null,

    init: function init(el, type, form, index) {
        this.$container = $('#notification-email-' + index);
        this.type = type;
        this.form = form;
        options = this.$container.find('.option-item');

        new window.FormBuilderSection($('#notification-email-' + index), type);

        options.each(function (i, el) {
            return new window.Option(el);
        });
    }
});

Garnish.$doc.ready(function () {
    $('.notify-item-btn').on('click', function (e) {
        e.preventDefault();
        type = e.currentTarget.dataset.type;
        elementType = e.currentTarget.dataset.element;
        form = e.currentTarget.dataset.context;

        switch (type) {
            case 'email':
                new NotificationElementModal(elementType, {}, type, form);
                // this.prepareEmailNotification()
                break;
            case 'slack':
                console.log('slack');
                break;
            default:
                console.log('nothing available.');
        }

        // new Notification(e.currentTarget)
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvaW50ZWdyYXRpb25zLmpzIl0sIm5hbWVzIjpbIk5vdGlmaWNhdGlvbkVsZW1lbnRNb2RhbCIsIkNyYWZ0IiwiQmFzZUVsZW1lbnRTZWxlY3Rvck1vZGFsIiwiZXh0ZW5kIiwiJG5vdGlmaWNhdGlvbnNDb250YWluZXIiLCJ0eXBlIiwiaW5kZXgiLCJmb3JtIiwiaW5pdCIsImVsZW1lbnRUeXBlIiwic2V0dGluZ3MiLCJiYXNlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiJCIsIm9uU2VsZWN0aW9uQ2hhbmdlIiwib25TZWxlY3QiLCJlbGVtZW50SW5mbyIsInBvc3RBY3Rpb25SZXF1ZXN0IiwiZWxlbWVudElkIiwiaWQiLCJwcm94eSIsInJlc3BvbnNlIiwidGV4dFN0YXR1cyIsInN1Y2Nlc3MiLCJhcHBlbmQiLCJtYXJrdXAiLCJOb3RpZmljYXRpb25TZWN0aW9uIiwiR2FybmlzaCIsIkJhc2UiLCIkY29udGFpbmVyIiwiZWwiLCJvcHRpb25zIiwiZmluZCIsIndpbmRvdyIsIkZvcm1CdWlsZGVyU2VjdGlvbiIsImVhY2giLCJpIiwiT3B0aW9uIiwiJGRvYyIsInJlYWR5Iiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImVsZW1lbnQiLCJjb250ZXh0IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNB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QUFGLENBQWdCQyxPQUFoQixDQUF3QkMsT0FBdEM7QUFDQXhDLGVBQU9vQyxFQUFFRSxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkUsT0FBL0I7O0FBRUEsZ0JBQVEzQyxJQUFSO0FBQ0ksaUJBQUssT0FBTDtBQUNJLG9CQUFJTCx3QkFBSixDQUE2QlMsV0FBN0IsRUFBMEMsRUFBMUMsRUFBOENKLElBQTlDLEVBQW9ERSxJQUFwRDtBQUNBO0FBQ0E7QUFDSixpQkFBSyxPQUFMO0FBQ0kwQyx3QkFBUUMsR0FBUixDQUFZLE9BQVo7QUFDQTtBQUNKO0FBQ0lELHdCQUFRQyxHQUFSLENBQVksb0JBQVo7QUFUUjs7QUFZQTtBQUNILEtBbkJEO0FBb0JILENBckJELEUiLCJmaWxlIjoiL2Zvcm1idWlsZGVyL3Jlc291cmNlcy9qcy9pbnRlZ3JhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJOb3RpZmljYXRpb25FbGVtZW50TW9kYWwgPSBDcmFmdC5CYXNlRWxlbWVudFNlbGVjdG9yTW9kYWwuZXh0ZW5kKHtcbiAgICAkbm90aWZpY2F0aW9uc0NvbnRhaW5lcjogbnVsbCxcblxuICAgIHR5cGU6IG51bGwsXG4gICAgaW5kZXg6IG51bGwsXG4gICAgZm9ybTogbnVsbCxcblxuICAgIGluaXQoZWxlbWVudFR5cGUsIHNldHRpbmdzLCB0eXBlLCBmb3JtKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICAgICAgdGhpcy5mb3JtID0gZm9ybVxuICAgICAgICB0aGlzLmJhc2UoZWxlbWVudFR5cGUsIHNldHRpbmdzKVxuICAgICAgICB0aGlzLmluZGV4ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwMDAwKSArIDEpXG5cbiAgICAgICAgdGhpcy4kbm90aWZpY2F0aW9uc0NvbnRhaW5lciA9ICQoJyNmb3JtYnVpbGRlci1ub3RpZmljYXRpb25zLWNvbnRhaW5lcicpXG4gICAgfSxcblxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLmJhc2UoKVxuICAgIH0sXG5cbiAgICBvblNlbGVjdChlbGVtZW50SW5mbykge1xuXG4gICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtLWJ1aWxkZXIvaW50ZWdyYXRpb25zL2FkZC1ub3RpZmljYXRpb24nLCB7XG4gICAgICAgICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgICAgICAgIGVsZW1lbnRJZDogZWxlbWVudEluZm9bMF0uaWQsIFxuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgICAgZm9ybTogdGhpcy5mb3JtLFxuICAgICAgICB9LCAkLnByb3h5KChmdW5jdGlvbihyZXNwb25zZSwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRub3RpZmljYXRpb25zQ29udGFpbmVyLmFwcGVuZChyZXNwb25zZS5tYXJrdXApXG5cbiAgICAgICAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uU2VjdGlvbihyZXNwb25zZS5tYXJrdXAsIHRoaXMudHlwZSwgdGhpcy5mb3JtLCB0aGlzLmluZGV4KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgdGhpcykpO1xuICAgIH1cbn0pXG5cbk5vdGlmaWNhdGlvblNlY3Rpb24gPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkY29udGFpbmVyOiBudWxsLFxuICAgIHR5cGU6IG51bGwsXG4gICAgZm9ybTogbnVsbCxcblxuICAgIGluaXQoZWwsIHR5cGUsIGZvcm0sIGluZGV4KSB7XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lciA9ICQoJyNub3RpZmljYXRpb24tZW1haWwtJyArIGluZGV4KVxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICAgIHRoaXMuZm9ybSA9IGZvcm1cbiAgICAgICAgb3B0aW9ucyA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcub3B0aW9uLWl0ZW0nKVxuXG4gICAgICAgIG5ldyB3aW5kb3cuRm9ybUJ1aWxkZXJTZWN0aW9uKCQoJyNub3RpZmljYXRpb24tZW1haWwtJyArIGluZGV4KSwgdHlwZSlcblxuICAgICAgICBvcHRpb25zLmVhY2goKGksIGVsKSA9PiBuZXcgd2luZG93Lk9wdGlvbihlbCkpXG5cbiAgICB9XG59KVxuXG5HYXJuaXNoLiRkb2MucmVhZHkoKCkgPT4ge1xuICAgICQoJy5ub3RpZnktaXRlbS1idG4nKS5vbignY2xpY2snLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHR5cGUgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC50eXBlXG4gICAgICAgIGVsZW1lbnRUeXBlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZWxlbWVudFxuICAgICAgICBmb3JtID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuY29udGV4dFxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICAgIG5ldyBOb3RpZmljYXRpb25FbGVtZW50TW9kYWwoZWxlbWVudFR5cGUsIHt9LCB0eXBlLCBmb3JtKVxuICAgICAgICAgICAgICAgIC8vIHRoaXMucHJlcGFyZUVtYWlsTm90aWZpY2F0aW9uKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnc2xhY2snOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzbGFjaycpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdGhpbmcgYXZhaWxhYmxlLicpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIG5ldyBOb3RpZmljYXRpb24oZS5jdXJyZW50VGFyZ2V0KVxuICAgIH0pXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZXZlbG9wbWVudC9qcy9pbnRlZ3JhdGlvbnMuanMiXSwic291cmNlUm9vdCI6IiJ9