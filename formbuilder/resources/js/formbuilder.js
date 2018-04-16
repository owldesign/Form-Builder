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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var UtilityItem = void 0;

UtilityItem = Garnish.Base.extend({
    $container: null,
    $btn: null,
    $loader: null,
    $badgeContainer: null,
    $countContainer: null,
    $menuContainer: null,

    type: null,
    count: 0,

    init: function init(el) {
        this.$container = $(el);
        this.type = this.$container.data('type');
        this.$btn = this.$container.find('.icon');
        this.$loader = this.$container.find('.loader');
        this.$badgeContainer = this.$container.find('.fb-badge');
        this.$countContainer = this.$badgeContainer.find('.count');
        this.$menuContainer = this.$container.find('.utility-menu');

        if (this.type == 'unread') {
            this.getUnreadCount();
        }

        if (this.type == 'notifications') {
            this.getNotifications();
        }

        this.addListener(this.$btn, 'click', this.toggleMenu);
    },
    getUnreadCount: function getUnreadCount() {
        var _this = this;

        Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(function (response, textStatus) {
            if (textStatus === 'success') {
                if (response.totalCount > 0) {
                    _this.$badgeContainer.addClass('show');
                    _this.$countContainer.html(response.totalCount);
                    _this.$menuContainer.find('.body').html(response.template);
                } else {
                    _this.$menuContainer.find('.body').html('<p class="no-content">' + Craft.t('No unread submissions.') + '</p>');
                }
            }
        }, this));
    },
    getNotifications: function getNotifications() {
        this.$menuContainer.find('.body').html('<p class="no-content">' + Craft.t('No new notifications.') + '</p>');
    },
    toggleMenu: function toggleMenu() {
        if (this.$container.hasClass('active')) {
            $('.fb-utility-btn').removeClass('active');
            $('.utility-menu').removeClass('active');
            this.$btn.parent().removeClass('active');
            this.$menuContainer.removeClass('active');
        } else {
            $('.fb-utility-btn').removeClass('active');
            $('.utility-menu').removeClass('active');
            this.$btn.parent().addClass('active');
            this.$menuContainer.addClass('active');
        }
    }
});

Garnish.$doc.ready(function () {
    var _this2 = this;

    $.each($('.fb-utility-btn'), function (i, el) {
        new UtilityItem(el);
    });

    $('.fb-mobile-nav').on('click', function (e) {
        $(_this2).toggleClass('active');
        $('body').toggleClass('show-fb-menu');
    });

    $('body').on('click', function (e) {
        target = $(e.target).closest('.utility-menu');
        btn = $(e.target).closest('.fb-utility-btn');

        if (target.length == 0 && btn.length == 0) {
            $('.fb-utility-btn').removeClass('active');
            $('.utility-menu').removeClass('active');
        }
    });

    //     Craft.initUiElements();

    //     window.pluginStoreApp = new Vue({
    //         el: '#content'
    //     });
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZm9ybWJ1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvc2Nzcy9mb3JtYnVpbGRlci5zY3NzP2JlODIiXSwibmFtZXMiOlsiVXRpbGl0eUl0ZW0iLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsIiRjb250YWluZXIiLCIkYnRuIiwiJGxvYWRlciIsIiRiYWRnZUNvbnRhaW5lciIsIiRjb3VudENvbnRhaW5lciIsIiRtZW51Q29udGFpbmVyIiwidHlwZSIsImNvdW50IiwiaW5pdCIsImVsIiwiJCIsImRhdGEiLCJmaW5kIiwiZ2V0VW5yZWFkQ291bnQiLCJnZXROb3RpZmljYXRpb25zIiwiYWRkTGlzdGVuZXIiLCJ0b2dnbGVNZW51IiwiQ3JhZnQiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInByb3h5IiwicmVzcG9uc2UiLCJ0ZXh0U3RhdHVzIiwidG90YWxDb3VudCIsImFkZENsYXNzIiwiaHRtbCIsInRlbXBsYXRlIiwidCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJwYXJlbnQiLCIkZG9jIiwicmVhZHkiLCJlYWNoIiwiaSIsIm9uIiwidG9nZ2xlQ2xhc3MiLCJ0YXJnZXQiLCJlIiwiY2xvc2VzdCIsImJ0biIsImxlbmd0aCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7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QUFqQztBQUNBbEIsY0FBRSxlQUFGLEVBQW1Ca0IsV0FBbkIsQ0FBK0IsUUFBL0I7QUFDSDtBQUNKLEtBUkQ7O0FBVUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0MsQ0ExQkQsRTs7Ozs7O0FDckVBLHlDIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvZm9ybWJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YTc4OWRlMjMyOThlMTkyYmQzNyIsImxldCBVdGlsaXR5SXRlbVxuXG5VdGlsaXR5SXRlbSA9IEdhcm5pc2guQmFzZS5leHRlbmQoe1xuICAgICRjb250YWluZXI6IG51bGwsXG4gICAgJGJ0bjogbnVsbCxcbiAgICAkbG9hZGVyOiBudWxsLFxuICAgICRiYWRnZUNvbnRhaW5lcjogbnVsbCxcbiAgICAkY291bnRDb250YWluZXI6IG51bGwsXG4gICAgJG1lbnVDb250YWluZXI6IG51bGwsXG5cbiAgICB0eXBlOiBudWxsLFxuICAgIGNvdW50OiAwLFxuXG4gICAgaW5pdChlbCkge1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50eXBlID0gdGhpcy4kY29udGFpbmVyLmRhdGEoJ3R5cGUnKVxuICAgICAgICB0aGlzLiRidG4gPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmljb24nKVxuICAgICAgICB0aGlzLiRsb2FkZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmxvYWRlcicpXG4gICAgICAgIHRoaXMuJGJhZGdlQ29udGFpbmVyID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5mYi1iYWRnZScpXG4gICAgICAgIHRoaXMuJGNvdW50Q29udGFpbmVyID0gdGhpcy4kYmFkZ2VDb250YWluZXIuZmluZCgnLmNvdW50JylcbiAgICAgICAgdGhpcy4kbWVudUNvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcudXRpbGl0eS1tZW51JylcblxuICAgICAgICBpZiAodGhpcy50eXBlID09ICd1bnJlYWQnKSB7XG4gICAgICAgICAgICB0aGlzLmdldFVucmVhZENvdW50KClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gJ25vdGlmaWNhdGlvbnMnKSB7XG4gICAgICAgICAgICB0aGlzLmdldE5vdGlmaWNhdGlvbnMoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRidG4sICdjbGljaycsIHRoaXMudG9nZ2xlTWVudSlcbiAgICB9LFxuXG4gICAgZ2V0VW5yZWFkQ291bnQoKSB7XG4gICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9lbnRyeS9nZXRVbnJlYWRFbnRyaWVzJywgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGJhZGdlQ29udGFpbmVyLmFkZENsYXNzKCdzaG93JylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kY291bnRDb250YWluZXIuaHRtbChyZXNwb25zZS50b3RhbENvdW50KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRtZW51Q29udGFpbmVyLmZpbmQoJy5ib2R5JykuaHRtbChyZXNwb25zZS50ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRtZW51Q29udGFpbmVyLmZpbmQoJy5ib2R5JykuaHRtbCgnPHAgY2xhc3M9XCJuby1jb250ZW50XCI+JytDcmFmdC50KCdObyB1bnJlYWQgc3VibWlzc2lvbnMuJykrJzwvcD4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksIHRoaXMpKVxuICAgIH0sXG5cbiAgICBnZXROb3RpZmljYXRpb25zKCkge1xuICAgICAgICB0aGlzLiRtZW51Q29udGFpbmVyLmZpbmQoJy5ib2R5JykuaHRtbCgnPHAgY2xhc3M9XCJuby1jb250ZW50XCI+JytDcmFmdC50KCdObyBuZXcgbm90aWZpY2F0aW9ucy4nKSsnPC9wPicpXG4gICAgfSxcblxuICAgIHRvZ2dsZU1lbnUoKSB7XG4gICAgICAgIGlmICh0aGlzLiRjb250YWluZXIuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAkKCcuZmItdXRpbGl0eS1idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgICQoJy51dGlsaXR5LW1lbnUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIHRoaXMuJGJ0bi5wYXJlbnQoKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIHRoaXMuJG1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuZmItdXRpbGl0eS1idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgICQoJy51dGlsaXR5LW1lbnUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIHRoaXMuJGJ0bi5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIHRoaXMuJG1lbnVDb250YWluZXIuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9LFxufSlcblxuXG5cblxuR2FybmlzaC4kZG9jLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIFxuICAgICQuZWFjaCgkKCcuZmItdXRpbGl0eS1idG4nKSwgKGksIGVsKSA9PiB7XG4gICAgICAgICBuZXcgVXRpbGl0eUl0ZW0oZWwpXG4gICAgfSlcblxuICAgICQoJy5mYi1tb2JpbGUtbmF2Jykub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2hvdy1mYi1tZW51JylcbiAgICB9KVxuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsIGUgPT4ge1xuICAgICAgICB0YXJnZXQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcudXRpbGl0eS1tZW51JylcbiAgICAgICAgYnRuID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmZiLXV0aWxpdHktYnRuJylcblxuICAgICAgICBpZiAodGFyZ2V0Lmxlbmd0aCA9PSAwICYmIGJ0bi5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJCgnLmZiLXV0aWxpdHktYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAkKCcudXRpbGl0eS1tZW51JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9KVxuXG4vLyAgICAgQ3JhZnQuaW5pdFVpRWxlbWVudHMoKTtcblxuLy8gICAgIHdpbmRvdy5wbHVnaW5TdG9yZUFwcCA9IG5ldyBWdWUoe1xuLy8gICAgICAgICBlbDogJyNjb250ZW50J1xuLy8gICAgIH0pO1xufSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZXZlbG9wbWVudC9qcy9mb3JtYnVpbGRlci5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9kZXZlbG9wbWVudC9zY3NzL2Zvcm1idWlsZGVyLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==