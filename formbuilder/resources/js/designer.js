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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),

/***/ 12:
/***/ (function(module, exports) {

var LD = void 0;

LD = {
    setup: function setup() {}
};

LD = new (Garnish.Base.extend({
    layoutId: null,
    formId: null,
    $settingsBtn: null,

    init: function init() {
        this.layoutId = null;
        this.layoutId = null;
        this.$settingsBtn = $('.fields-settings');

        this.addListener(this.$settingsBtn, 'click', 'showFieldsSettings');
    },
    setup: function setup() {},
    showFieldsSettings: function showFieldsSettings() {
        var self = void 0;
        self = this;

        modal = new FieldSettingsModal();
        modal.on('setFieldsSettings', function (e) {
            return self.setFormData(e);
        });
        modal.show();
    },
    setFormData: function setFormData(data) {
        var self = void 0;
        var $container = void 0;
        var $field = void 0;
        var name = void 0;
        self = this;

        $container = $('#fieldlayoutsettings');
        name = 'settings[fields][global]';

        $container.html('');

        if (Object.keys(data.options).length === 0) {
            $('.fields-settings').removeClass('has-values');
        } else {
            $('.fields-settings').addClass('has-values');

            $.each(data.options, function (key, item) {
                if ($container.find('input[name="' + name + '[' + key + ']"]').length > 0) {
                    if (item) {
                        $container.find('input[name="' + name + '[' + key + ']"]').val(item);
                    } else {
                        $container.find('input[name="' + name + '[' + key + ']"]').remove();
                    }
                } else {
                    if (item) {
                        $('<input type="hidden" name="' + name + '[' + key + ']">').val(item).appendTo($container);
                    }
                }
            });
        }
    },
    getLayoutId: function getLayoutId() {
        return this.layoutId;
    },
    getFormId: function getFormId() {
        return this.formId;
    }
}))();

FieldSettingsModal = Garnish.Modal.extend({
    $formClass: null,
    $formId: null,
    $inputClass: null,
    $inputTemplate: null,
    $formContainer: null,

    timeout: null,

    init: function init() {
        var body = void 0;
        this.base();

        this.$formContainer = $('<form class="modal fitted formbuilder-modal has-sidebar">').appendTo(Garnish.$bod);
        this.setContainer(this.$formContainer);

        body = $(['<section class="modal-container">', '<div class="modal-sidebar">', '<nav>', '<a href="#" class="modal-nav active" data-target="modal-content-styles"><i class="far fa-clipboard-list"></i> <span class="link-text">Styles</span></a>', '<a href="#" class="modal-nav" data-target="modal-content-settings"><i class="far fa-window-alt"></i> <span class="link-text">Settings</span></a>', '</nav>', '</div>', '<div class="modal-content-container">', '<div class="modal-content modal-content-styles active">', '<header>', '<span class="modal-title">', 'Form Attributes', '</span>', '<div class="instructions">', 'Global form attributes', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'CLASS', '</div>', '<input type="text" class="text fullwidth global-form-class">', '</div>', '<div class="fb-field">', '<div class="input-hint">', 'ID', '</div>', '<input type="text" class="text fullwidth global-form-id">', '</div>', '</div>', '</div>', '<div class="modal-content modal-content-settings">', '<header>', '<span class="modal-title">', 'Input Settings', '</span>', '<div class="instructions">', 'Global input settings', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'CLASS', '</div>', '<input type="text" class="text fullwidth global-input-class">', '</div>', '<div class="fb-field has-spinner">', '<div class="spinner hidden"></div>', '<div class="input-hint">', 'TEMPLATES', '</div>', '<input type="text" class="text fullwidth global-input-template">', '</div>', '</div>', '</div>', '</div>', '</section>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$formContainer);

        this.$formClass = body.find('.global-form-class');
        this.$formId = body.find('.global-form-id');
        this.$inputClass = body.find('.global-input-class');
        this.$inputTemplate = body.find('.global-input-template');

        this.$navLink = body.find('.modal-nav');
        this.$cancelBtn = body.find('.cancel');

        this.loadModalValues();

        this.addListener(this.$cancelBtn, 'click', 'hide');
        this.addListener(this.$navLink, 'click', 'toggleModalContent');
        this.addListener(this.$inputTemplate, 'keyup', 'checkTemplatePath');
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit');
    },
    checkTemplatePath: function checkTemplatePath() {
        var _this = this;

        var $container = void 0;
        var $hint = void 0;

        $container = this.$inputTemplate.parent();
        $spinner = $container.find('.spinner');
        $hint = $container.find('.input-hint');

        data = {
            path: this.$inputTemplate.val()
        };

        $spinner.removeClass('hidden');

        clearTimeout(this.timeout);

        this.timeout = setTimeout(function () {
            $spinner.addClass('hidden');

            Craft.postActionRequest('formBuilder/form/checkIinputTemplatePath', data, $.proxy(function (response, textStatus) {
                if (response.valid) {
                    $hint.removeClass('error');
                    $hint.addClass('success');
                } else {
                    $hint.removeClass('success');
                    $hint.addClass('error');
                }
            }, _this));
        }, 1000);
    },
    loadModalValues: function loadModalValues() {
        $formClass = $('input[name="settings[fields][global][formClass]"]').val();
        $formId = $('input[name="settings[fields][global][formId]"]').val();
        $inputClass = $('input[name="settings[fields][global][inputClass]"]').val();
        $inputTemplate = $('input[name="settings[fields][global][inputTemplate]"]').val();

        if ($formClass) {
            this.$formContainer.find('.global-form-class').val($formClass);
        }

        if ($formId) {
            this.$formContainer.find('.global-form-id').val($formId);
        }

        if ($inputClass) {
            this.$formContainer.find('.global-input-class').val($inputClass);
        }

        if ($inputTemplate) {
            this.$formContainer.find('.global-input-template').val($inputTemplate);
        }
    },
    toggleModalContent: function toggleModalContent(e) {
        var _this2 = this;

        e.preventDefault();
        var target = void 0;
        var link = void 0;
        var height = void 0;

        link = $(e.currentTarget);
        target = link.data('target');
        height = $('.' + target).height() + 53;

        $('.modal-nav').removeClass('active');
        $('.modal-content').removeClass('active');

        link.addClass('active');
        $('.' + target).addClass('active');

        this.$container.velocity('stop');
        this.$container.velocity({ height: height }, 'fast', function () {
            _this2.$container.css({
                height: height,
                minHeight: 'auto'
            });
        });
    },
    onFormSubmit: function onFormSubmit(e) {
        var options = void 0;
        options = {};

        e.preventDefault();

        if (!this.visible) {
            return;
        }

        if (this.$formClass.val()) {
            options.formClass = this.$formClass.val();
        }

        if (this.$formId.val()) {
            options.formId = this.$formId.val();
        }

        if (this.$inputClass.val()) {
            options.inputClass = this.$inputClass.val();
        }

        if (this.$inputTemplate.val()) {
            options.inputTemplate = this.$inputTemplate.val();
        }

        this.trigger('setFieldsSettings', { options: options });
        this.hide();
    },
    onFadeOut: function onFadeOut() {
        this.base();
        this.destroy();
    },
    destroy: function destroy() {
        this.base();
        this.$container.remove();
        this.$shade.remove();
    },
    show: function show(options) {
        // let self
        // let values
        // self = this

        // if (options.length > 0) {
        //     values = JSON.parse(options[this.field.id])

        //     $.each(values, (key, value) => {
        //         if (key == 'class' && value) {
        //             self.$classInput.val(value)
        //         }

        //         if (key == 'id' && value) {
        //             self.$idInput.val(value)
        //         }
        //     })

        //     if (!Garnish.isMobileBrowser()) {
        //         setTimeout($.proxy((function() {
        //             this.$classInput.focus()
        //         })))
        //     }
        // }

        this.base();
    }
});

window.LD = LD;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZGVzaWduZXIuanMiXSwibmFtZXMiOlsiTEQiLCJzZXR1cCIsIkdhcm5pc2giLCJCYXNlIiwiZXh0ZW5kIiwibGF5b3V0SWQiLCJmb3JtSWQiLCIkc2V0dGluZ3NCdG4iLCJpbml0IiwiJCIsImFkZExpc3RlbmVyIiwic2hvd0ZpZWxkc1NldHRpbmdzIiwic2VsZiIsIm1vZGFsIiwiRmllbGRTZXR0aW5nc01vZGFsIiwib24iLCJzZXRGb3JtRGF0YSIsImUiLCJzaG93IiwiZGF0YSIsIiRjb250YWluZXIiLCIkZmllbGQiLCJuYW1lIiwiaHRtbCIsIk9iamVjdCIsImtleXMiLCJvcHRpb25zIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImVhY2giLCJrZXkiLCJpdGVtIiwiZmluZCIsInZhbCIsInJlbW92ZSIsImFwcGVuZFRvIiwiZ2V0TGF5b3V0SWQiLCJnZXRGb3JtSWQiLCJNb2RhbCIsIiRmb3JtQ2xhc3MiLCIkZm9ybUlkIiwiJGlucHV0Q2xhc3MiLCIkaW5wdXRUZW1wbGF0ZSIsIiRmb3JtQ29udGFpbmVyIiwidGltZW91dCIsImJvZHkiLCJiYXNlIiwiJGJvZCIsInNldENvbnRhaW5lciIsIkNyYWZ0IiwidCIsImpvaW4iLCIkbmF2TGluayIsIiRjYW5jZWxCdG4iLCJsb2FkTW9kYWxWYWx1ZXMiLCJjaGVja1RlbXBsYXRlUGF0aCIsIiRoaW50IiwicGFyZW50IiwiJHNwaW5uZXIiLCJwYXRoIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBvc3RBY3Rpb25SZXF1ZXN0IiwicHJveHkiLCJyZXNwb25zZSIsInRleHRTdGF0dXMiLCJ2YWxpZCIsInRvZ2dsZU1vZGFsQ29udGVudCIsInByZXZlbnREZWZhdWx0IiwidGFyZ2V0IiwibGluayIsImhlaWdodCIsImN1cnJlbnRUYXJnZXQiLCJ2ZWxvY2l0eSIsImNzcyIsIm1pbkhlaWdodCIsIm9uRm9ybVN1Ym1pdCIsInZpc2libGUiLCJmb3JtQ2xhc3MiLCJpbnB1dENsYXNzIiwiaW5wdXRUZW1wbGF0ZSIsInRyaWdnZXIiLCJoaWRlIiwib25GYWRlT3V0IiwiZGVzdHJveSIsIiRzaGFkZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBLElBQUlBLFdBQUo7O0FBRUFBLEtBQUs7QUFDREMsU0FEQyxtQkFDTyxDQUFFO0FBRFQsQ0FBTDs7QUFJQUQsS0FBSyxLQUFLRSxRQUFRQyxJQUFSLENBQWFDLE1BQWIsQ0FBb0I7QUFDMUJDLGNBQVUsSUFEZ0I7QUFFMUJDLFlBQVEsSUFGa0I7QUFHMUJDLGtCQUFjLElBSFk7O0FBSzFCQyxRQUwwQixrQkFLbkI7QUFDSCxhQUFLSCxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUtFLFlBQUwsR0FBb0JFLEVBQUUsa0JBQUYsQ0FBcEI7O0FBRUEsYUFBS0MsV0FBTCxDQUFpQixLQUFLSCxZQUF0QixFQUFvQyxPQUFwQyxFQUE2QyxvQkFBN0M7QUFDSCxLQVh5QjtBQWExQk4sU0FiMEIsbUJBYWxCLENBQ1AsQ0FkeUI7QUFnQjFCVSxzQkFoQjBCLGdDQWdCTDtB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QlIsR0FBakIsRUFBckI7QUFDSDs7QUFFRCxZQUFJLEtBQUtTLGNBQUwsQ0FBb0JULEdBQXBCLEVBQUosRUFBK0I7QUFDM0JSLG9CQUFRdUQsYUFBUixHQUF3QixLQUFLdEMsY0FBTCxDQUFvQlQsR0FBcEIsRUFBeEI7QUFDSDs7QUFFRCxhQUFLZ0QsT0FBTCxDQUFhLG1CQUFiLEVBQWtDLEVBQUV4RCxTQUFTQSxPQUFYLEVBQWxDO0FBQ0EsYUFBS3lELElBQUw7QUFDSCxLQXhNcUM7QUEwTXRDQyxhQTFNc0MsdUJBME0xQjtBQUNSLGFBQUtyQyxJQUFMO0FBQ0EsYUFBS3NDLE9BQUw7QUFDSCxLQTdNcUM7QUErTXRDQSxXQS9Nc0MscUJBK001QjtBQUNOLGFBQUt0QyxJQUFMO0FBQ0EsYUFBSzNCLFVBQUwsQ0FBZ0JlLE1BQWhCO0FBQ0EsYUFBS21ELE1BQUwsQ0FBWW5ELE1BQVo7QUFDSCxLQW5OcUM7QUFxTnRDakIsUUFyTnNDLGdCQXFOakNRLE9Bck5pQyxFQXFOeEI7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBS3FCLElBQUw7QUFDSDtBQS9PcUMsQ0FBckIsQ0FBckI7O0FBbVBBd0MsT0FBT3ZGLEVBQVAsR0FBWUEsRUFBWixDIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvZGVzaWduZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJsZXQgTERcblxuTEQgPSB7XG4gICAgc2V0dXAoKSB7fVxufVxuXG5MRCA9IG5ldyAoR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgbGF5b3V0SWQ6IG51bGwsXG4gICAgZm9ybUlkOiBudWxsLFxuICAgICRzZXR0aW5nc0J0bjogbnVsbCxcblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMubGF5b3V0SWQgPSBudWxsXG4gICAgICAgIHRoaXMubGF5b3V0SWQgPSBudWxsXG4gICAgICAgIHRoaXMuJHNldHRpbmdzQnRuID0gJCgnLmZpZWxkcy1zZXR0aW5ncycpXG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRzZXR0aW5nc0J0biwgJ2NsaWNrJywgJ3Nob3dGaWVsZHNTZXR0aW5ncycpXG4gICAgfSxcblxuICAgIHNldHVwKCkge1xuICAgIH0sXG5cbiAgICBzaG93RmllbGRzU2V0dGluZ3MoKSB7XG4gICAgICAgIGxldCBzZWxmXG4gICAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgbW9kYWwgPSBuZXcgRmllbGRTZXR0aW5nc01vZGFsKClcbiAgICAgICAgbW9kYWwub24oJ3NldEZpZWxkc1NldHRpbmdzJywgZSA9PiBzZWxmLnNldEZvcm1EYXRhKGUpKVxuICAgICAgICBtb2RhbC5zaG93KClcbiAgICB9LFxuXG4gICAgc2V0Rm9ybURhdGEoZGF0YSkge1xuICAgICAgICBsZXQgc2VsZlxuICAgICAgICBsZXQgJGNvbnRhaW5lclxuICAgICAgICBsZXQgJGZpZWxkXG4gICAgICAgIGxldCBuYW1lXG4gICAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgJGNvbnRhaW5lciA9ICQoJyNmaWVsZGxheW91dHNldHRpbmdzJylcbiAgICAgICAgbmFtZSA9ICdzZXR0aW5nc1tmaWVsZHNdW2dsb2JhbF0nXG5cbiAgICAgICAgJGNvbnRhaW5lci5odG1sKCcnKVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgJCgnLmZpZWxkcy1zZXR0aW5ncycpLnJlbW92ZUNsYXNzKCdoYXMtdmFsdWVzJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5maWVsZHMtc2V0dGluZ3MnKS5hZGRDbGFzcygnaGFzLXZhbHVlcycpXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLm9wdGlvbnMsIChrZXksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJGNvbnRhaW5lci5maW5kKGBpbnB1dFtuYW1lPVwiJHtuYW1lfVske2tleX1dXCJdYCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKGBpbnB1dFtuYW1lPVwiJHtuYW1lfVske2tleX1dXCJdYCkudmFsKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoYGlucHV0W25hbWU9XCIke25hbWV9WyR7a2V5fV1cIl1gKS5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7bmFtZX1bJHtrZXl9XVwiPmApLnZhbChpdGVtKS5hcHBlbmRUbygkY29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRMYXlvdXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0SWRcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybUlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtSWRcbiAgICB9XG59KSlcblxuRmllbGRTZXR0aW5nc01vZGFsID0gR2FybmlzaC5Nb2RhbC5leHRlbmQoe1xuICAgICRmb3JtQ2xhc3M6IG51bGwsXG4gICAgJGZvcm1JZDogbnVsbCxcbiAgICAkaW5wdXRDbGFzczogbnVsbCxcbiAgICAkaW5wdXRUZW1wbGF0ZTogbnVsbCxcbiAgICAkZm9ybUNvbnRhaW5lcjogbnVsbCxcblxuICAgIHRpbWVvdXQ6IG51bGwsXG5cbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgYm9keVxuICAgICAgICB0aGlzLmJhc2UoKVxuXG4gICAgICAgIHRoaXMuJGZvcm1Db250YWluZXIgPSAkKCc8Zm9ybSBjbGFzcz1cIm1vZGFsIGZpdHRlZCBmb3JtYnVpbGRlci1tb2RhbCBoYXMtc2lkZWJhclwiPicpLmFwcGVuZFRvKEdhcm5pc2guJGJvZClcbiAgICAgICAgdGhpcy5zZXRDb250YWluZXIodGhpcy4kZm9ybUNvbnRhaW5lcilcblxuICAgICAgICBib2R5ID0gJChbXG4gICAgICAgICAgICAnPHNlY3Rpb24gY2xhc3M9XCJtb2RhbC1jb250YWluZXJcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWwtc2lkZWJhclwiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPG5hdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwibW9kYWwtbmF2IGFjdGl2ZVwiIGRhdGEtdGFyZ2V0PVwibW9kYWwtY29udGVudC1zdHlsZXNcIj48aSBjbGFzcz1cImZhciBmYS1jbGlwYm9hcmQtbGlzdFwiPjwvaT4gPHNwYW4gY2xhc3M9XCJsaW5rLXRleHRcIj5TdHlsZXM8L3NwYW4+PC9hPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJtb2RhbC1uYXZcIiBkYXRhLXRhcmdldD1cIm1vZGFsLWNvbnRlbnQtc2V0dGluZ3NcIj48aSBjbGFzcz1cImZhciBmYS13aW5kb3ctYWx0XCI+PC9pPiA8c3BhbiBjbGFzcz1cImxpbmstdGV4dFwiPlNldHRpbmdzPC9zcGFuPjwvYT4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzwvbmF2PicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQtY29udGFpbmVyXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBtb2RhbC1jb250ZW50LXN0eWxlcyBhY3RpdmVcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+JywgJ0Zvcm0gQXR0cmlidXRlcycsICc8L3NwYW4+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnN0cnVjdGlvbnNcIj4nLCAnR2xvYmFsIGZvcm0gYXR0cmlidXRlcycsICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2hlYWRlcj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9keVwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmItZmllbGRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnB1dC1oaW50XCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ0xBU1MnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0IGZ1bGx3aWR0aCBnbG9iYWwtZm9ybS1jbGFzc1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZiLWZpZWxkXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5wdXQtaGludFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0lEJywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dCBmdWxsd2lkdGggZ2xvYmFsLWZvcm0taWRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgbW9kYWwtY29udGVudC1zZXR0aW5nc1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxoZWFkZXI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibW9kYWwtdGl0bGVcIj4nLCAnSW5wdXQgU2V0dGluZ3MnLCAnPC9zcGFuPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5zdHJ1Y3Rpb25zXCI+JywgJ0dsb2JhbCBpbnB1dCBzZXR0aW5ncycsICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2hlYWRlcj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9keVwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYi1maWVsZFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDTEFTUycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHQgZnVsbHdpZHRoIGdsb2JhbC1pbnB1dC1jbGFzc1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZiLWZpZWxkIGhhcy1zcGlubmVyXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic3Bpbm5lciBoaWRkZW5cIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdURU1QTEFURVMnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0IGZ1bGx3aWR0aCBnbG9iYWwtaW5wdXQtdGVtcGxhdGVcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgJzwvc2VjdGlvbj4nLFxuICAgICAgICAgICAgJzxmb290ZXIgY2xhc3M9XCJmb290ZXJcIj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgYDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5zIGJ0bi1tb2RhbCBjYW5jZWxcIiB2YWx1ZT1cIiR7Q3JhZnQudCgnQ2FuY2VsJyl9XCI+YCwgXG4gICAgICAgICAgICAgICAgICAgIGA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRucyBidG4tbW9kYWwgc3VibWl0XCIgdmFsdWU9XCIke0NyYWZ0LnQoJ1NhdmUnKX1cIj5gLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPC9mb290ZXI+J1xuICAgICAgICBdLmpvaW4oJycpKS5hcHBlbmRUbyh0aGlzLiRmb3JtQ29udGFpbmVyKTtcblxuXG4gICAgICAgIHRoaXMuJGZvcm1DbGFzcyA9IGJvZHkuZmluZCgnLmdsb2JhbC1mb3JtLWNsYXNzJylcbiAgICAgICAgdGhpcy4kZm9ybUlkID0gYm9keS5maW5kKCcuZ2xvYmFsLWZvcm0taWQnKVxuICAgICAgICB0aGlzLiRpbnB1dENsYXNzID0gYm9keS5maW5kKCcuZ2xvYmFsLWlucHV0LWNsYXNzJylcbiAgICAgICAgdGhpcy4kaW5wdXRUZW1wbGF0ZSA9IGJvZHkuZmluZCgnLmdsb2JhbC1pbnB1dC10ZW1wbGF0ZScpXG5cbiAgICAgICAgdGhpcy4kbmF2TGluayA9IGJvZHkuZmluZCgnLm1vZGFsLW5hdicpXG4gICAgICAgIHRoaXMuJGNhbmNlbEJ0biA9IGJvZHkuZmluZCgnLmNhbmNlbCcpXG5cbiAgICAgICAgdGhpcy5sb2FkTW9kYWxWYWx1ZXMoKVxuXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kY2FuY2VsQnRuLCAnY2xpY2snLCAnaGlkZScpXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kbmF2TGluaywgJ2NsaWNrJywgJ3RvZ2dsZU1vZGFsQ29udGVudCcpXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kaW5wdXRUZW1wbGF0ZSwgJ2tleXVwJywgJ2NoZWNrVGVtcGxhdGVQYXRoJylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRmb3JtQ29udGFpbmVyLCAnc3VibWl0JywgJ29uRm9ybVN1Ym1pdCcpXG4gICAgfSxcblxuICAgIGNoZWNrVGVtcGxhdGVQYXRoKCkge1xuICAgICAgICBsZXQgJGNvbnRhaW5lclxuICAgICAgICBsZXQgJGhpbnRcblxuICAgICAgICAkY29udGFpbmVyID0gdGhpcy4kaW5wdXRUZW1wbGF0ZS5wYXJlbnQoKVxuICAgICAgICAkc3Bpbm5lciA9ICRjb250YWluZXIuZmluZCgnLnNwaW5uZXInKVxuICAgICAgICAkaGludCA9ICRjb250YWluZXIuZmluZCgnLmlucHV0LWhpbnQnKVxuXG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICBwYXRoOiB0aGlzLiRpbnB1dFRlbXBsYXRlLnZhbCgpXG4gICAgICAgIH1cblxuICAgICAgICAkc3Bpbm5lci5yZW1vdmVDbGFzcygnaGlkZGVuJylcblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuXG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJHNwaW5uZXIuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cbiAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9mb3JtL2NoZWNrSWlucHV0VGVtcGxhdGVQYXRoJywgZGF0YSwgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICRoaW50LnJlbW92ZUNsYXNzKCdlcnJvcicpXG4gICAgICAgICAgICAgICAgICAgICRoaW50LmFkZENsYXNzKCdzdWNjZXNzJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkaGludC5yZW1vdmVDbGFzcygnc3VjY2VzcycpXG4gICAgICAgICAgICAgICAgICAgICRoaW50LmFkZENsYXNzKCdlcnJvcicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIHRoaXMpKVxuICAgICAgICB9LCAxMDAwKVxuICAgIH0sXG5cbiAgICBsb2FkTW9kYWxWYWx1ZXMoKSB7XG4gICAgICAgICRmb3JtQ2xhc3MgPSAkKCdpbnB1dFtuYW1lPVwic2V0dGluZ3NbZmllbGRzXVtnbG9iYWxdW2Zvcm1DbGFzc11cIl0nKS52YWwoKVxuICAgICAgICAkZm9ybUlkID0gJCgnaW5wdXRbbmFtZT1cInNldHRpbmdzW2ZpZWxkc11bZ2xvYmFsXVtmb3JtSWRdXCJdJykudmFsKClcbiAgICAgICAgJGlucHV0Q2xhc3MgPSAkKCdpbnB1dFtuYW1lPVwic2V0dGluZ3NbZmllbGRzXVtnbG9iYWxdW2lucHV0Q2xhc3NdXCJdJykudmFsKClcbiAgICAgICAgJGlucHV0VGVtcGxhdGUgPSAkKCdpbnB1dFtuYW1lPVwic2V0dGluZ3NbZmllbGRzXVtnbG9iYWxdW2lucHV0VGVtcGxhdGVdXCJdJykudmFsKClcblxuICAgICAgICBpZiAoJGZvcm1DbGFzcykge1xuICAgICAgICAgICAgdGhpcy4kZm9ybUNvbnRhaW5lci5maW5kKCcuZ2xvYmFsLWZvcm0tY2xhc3MnKS52YWwoJGZvcm1DbGFzcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkZm9ybUlkKSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtQ29udGFpbmVyLmZpbmQoJy5nbG9iYWwtZm9ybS1pZCcpLnZhbCgkZm9ybUlkKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRpbnB1dENsYXNzKSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtQ29udGFpbmVyLmZpbmQoJy5nbG9iYWwtaW5wdXQtY2xhc3MnKS52YWwoJGlucHV0Q2xhc3MpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJGlucHV0VGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Db250YWluZXIuZmluZCgnLmdsb2JhbC1pbnB1dC10ZW1wbGF0ZScpLnZhbCgkaW5wdXRUZW1wbGF0ZSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0b2dnbGVNb2RhbENvbnRlbnQoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgbGV0IHRhcmdldFxuICAgICAgICBsZXQgbGlua1xuICAgICAgICBsZXQgaGVpZ2h0XG5cbiAgICAgICAgbGluayA9ICQoZS5jdXJyZW50VGFyZ2V0KVxuICAgICAgICB0YXJnZXQgPSBsaW5rLmRhdGEoJ3RhcmdldCcpXG4gICAgICAgIGhlaWdodCA9ICQoJy4nK3RhcmdldCkuaGVpZ2h0KCkgKyA1M1xuXG4gICAgICAgICQoJy5tb2RhbC1uYXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnLm1vZGFsLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcblxuICAgICAgICBsaW5rLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcuJyt0YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci52ZWxvY2l0eSgnc3RvcCcpXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci52ZWxvY2l0eSh7aGVpZ2h0OiBoZWlnaHR9LCAnZmFzdCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJ2F1dG8nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBvbkZvcm1TdWJtaXQoZSkge1xuICAgICAgICBsZXQgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kZm9ybUNsYXNzLnZhbCgpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmZvcm1DbGFzcyA9IHRoaXMuJGZvcm1DbGFzcy52YWwoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuJGZvcm1JZC52YWwoKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5mb3JtSWQgPSB0aGlzLiRmb3JtSWQudmFsKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiRpbnB1dENsYXNzLnZhbCgpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmlucHV0Q2xhc3MgPSB0aGlzLiRpbnB1dENsYXNzLnZhbCgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kaW5wdXRUZW1wbGF0ZS52YWwoKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5pbnB1dFRlbXBsYXRlID0gdGhpcy4kaW5wdXRUZW1wbGF0ZS52YWwoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzZXRGaWVsZHNTZXR0aW5ncycsIHsgb3B0aW9uczogb3B0aW9ucyB9KVxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgIH0sXG5cbiAgICBvbkZhZGVPdXQoKSB7XG4gICAgICAgIHRoaXMuYmFzZSgpXG4gICAgICAgIHRoaXMuZGVzdHJveSgpXG4gICAgfSxcblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuYmFzZSgpXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICB0aGlzLiRzaGFkZS5yZW1vdmUoKVxuICAgIH0sXG5cbiAgICBzaG93KG9wdGlvbnMpIHtcbiAgICAgICAgLy8gbGV0IHNlbGZcbiAgICAgICAgLy8gbGV0IHZhbHVlc1xuICAgICAgICAvLyBzZWxmID0gdGhpc1xuXG4gICAgICAgIC8vIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIHZhbHVlcyA9IEpTT04ucGFyc2Uob3B0aW9uc1t0aGlzLmZpZWxkLmlkXSlcblxuICAgICAgICAvLyAgICAgJC5lYWNoKHZhbHVlcywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgLy8gICAgICAgICBpZiAoa2V5ID09ICdjbGFzcycgJiYgdmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc2VsZi4kY2xhc3NJbnB1dC52YWwodmFsdWUpXG4gICAgICAgIC8vICAgICAgICAgfVxuXG4gICAgICAgIC8vICAgICAgICAgaWYgKGtleSA9PSAnaWQnICYmIHZhbHVlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuJGlkSW5wdXQudmFsKHZhbHVlKVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0pXG5cbiAgICAgICAgLy8gICAgIGlmICghR2FybmlzaC5pc01vYmlsZUJyb3dzZXIoKSkge1xuICAgICAgICAvLyAgICAgICAgIHNldFRpbWVvdXQoJC5wcm94eSgoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuJGNsYXNzSW5wdXQuZm9jdXMoKVxuICAgICAgICAvLyAgICAgICAgIH0pKSlcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5iYXNlKClcbiAgICB9XG5cbn0pXG5cbndpbmRvdy5MRCA9IExEXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZGV2ZWxvcG1lbnQvanMvZGVzaWduZXIuanMiXSwic291cmNlUm9vdCI6IiJ9