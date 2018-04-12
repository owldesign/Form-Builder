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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ({

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(22);


/***/ }),

/***/ 22:
/***/ (function(module, exports) {

function isToggler(item) {
    console.log(item);
}

var OptionModal;

window.OptionModal = Garnish.Modal.extend({
    option: null,
    $form: null,
    $modalInputs: null,
    $redactor: null,
    $validationItems: [],

    $togglerInput: null,
    hasTogglers: false,

    errors: [],
    errorLength: 0,

    init: function init(option) {
        var body, fields, self;
        self = this;
        this.option = option;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);

        body = $(['<header>', '<span class="modal-title">', option.$data.title, '</span>', '<div class="instructions">', option.$data.instructions, '</div>', '</header>', '<div class="body"></div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);

        toggler = option.$inputs.some(function (elem) {
            return elem.toggler;
        });
        this.hasTogglers = toggler;

        $.each(option.$inputs, function (i, item) {
            var $input, camelClassName, className, required, validation;
            required = item.required ? 'data-required' : 'data-not-required';

            if (item.toggler) {
                self.$togglerInput = item;
            }

            if (item.type !== 'checkbox' && !item.toggler) {
                className = item.name.replace(/[_\W]+/g, "-").slice(0, -1);

                camelClassName = className.replace(/-([a-z])/g, function (g) {
                    return g[1].toUpperCase();
                });

                if (item.validation) {
                    validation = item.validation;
                    validation['passed'] = false;
                    validation['inputClass'] = className;
                    self.$validationItems[i] = item;
                }

                if (item.type === 'textarea') {
                    $input = "<textarea class='" + className + " " + required + "' value='" + item.value + "' data-hint='" + item.hint + "' data-name='" + item.name + "' " + required + " />" + item.value + "</textarea>";
                } else if (item.type === 'select') {
                    $input = $.parseJSON(item.options);
                } else {
                    $input = "<input type='" + item.type + "' class='" + className + " " + required + "' value='" + item.value + "' data-hint='" + item.hint + "' data-name='" + item.name + "' " + required + " />";
                }

                return self.renderInputs(required, $input, item.value, item.type, item.name, item.hint, className);
            }
        });

        if (this.option.$container.hasClass('has-fields')) {
            fields = new Fields(this.option, this.$form);
        }

        this.$modalInputs = this.$form.find('.body').find('input, textarea, select');

        if (this.$togglerInput) {
            this.activateFieldToggle();
        }

        this.show();
        this.$saveBtn = body.find('.submit');
        this.$cancelBtn = body.find('.cancel');
        this.addListener(this.$cancelBtn, 'click', 'cancel');

        return this.addListener(this.$form, 'submit', 'save');
    },

    activateFieldToggle: function activateFieldToggle() {
        var $toggler = void 0;
        var item = void 0;

        $toggler = this.$form.find('.toggle-btn');

        if (this.$togglerInput.value) {
            item = this.$form.find('[data-selection-target="' + this.$togglerInput.value + '"]');
            item.parent().addClass('active-field');
        } else {
            $($toggler[0]).parent().addClass('active-field');
            target = $($toggler[0]).data('selection-target');
            input = $('input[name="' + this.$togglerInput.name + '"]');
            input.val(target);
        }

        $toggler.on('click', $.proxy(function (e) {
            var input = void 0;
            var target = void 0;

            // $toggler.removeClass('active-field');
            $toggler.parent().removeClass('active-field');

            $(e.target).parent().addClass('active-field');
            // $(e.target).addClass('active-field');

            target = $(e.target).data('selection-target');
            input = $('input[name="' + this.$togglerInput.name + '"]');
            input.val(target);
        }, this));
    },

    renderInputs: function renderInputs(required, el, value, type, name, hint, className) {
        var $input, togglerClass;

        togglerClass = this.hasTogglers ? 'toggle-field' : '';
        if (type === 'select') {
            $input = $('<div class="fb-field ' + togglerClass + '">' + '<div class="input-hint">' + hint + '</div>' + '<div class="select input"><select class="' + className + ' ' + required + '" data-hint="' + hint + '" data-name="' + name + '" /></div>' + '</div>');
            $.each(el, function (i, item) {
                $input.find('select').append($('<option>', {
                    value: item.value,
                    text: item.label
                }));
            });
            $input.find('select').val(value);
        } else {
            $input = $('<div class="fb-field ' + togglerClass + '">' + '<div class="input-hint">' + hint + '</div>' + '<div class="input">' + el + '</div>' + '</div>');
        }

        if (this.hasTogglers) {
            $input.append($('<div class="toggle-btn" data-selection-target="' + hint.toLowerCase() + '"></div>'));
        }

        this.$form.find('.body').append($input);

        // if (type === 'textarea') {
        //     return this.initRedactor(el);
        // }
    },

    initRedactor: function initRedactor(item) {
        var className, el;
        className = $(item)[0].className;
        el = this.$form.find("." + className);
        el.redactor({
            maxHeight: 160,
            minHeight: 150,
            maxWidth: '400px',
            buttons: ['bold', 'italic', 'link', 'horizontalrule'],
            plugins: ['fontfamily', 'fontsize', 'alignment', 'fontcolor']
        });

        return this.$redactor = el.redactor('core.object');
    },

    cancel: function cancel() {
        if (!this.option.editing) {
            this.option.$edit.addClass('hidden');
            this.option.$container.removeClass('option-enabled');
            this.option.$resultContainer.html('');
            this.option.$toggle.html('ENABLE');
            this.disableOption();
            return this.closeModal();
        } else {
            return this.closeModal();
        }
    },

    disableOption: function disableOption() {
        if (this.option.$enableCheckbox) {
            return this.option.$enableCheckbox.prop('checked', false);
        }
    },

    hide: function hide() {
        return this.cancel();
    },

    closeModal: function closeModal(ev) {
        this.disable();

        if (ev) {
            ev.stopPropagation();
        }

        if (this.$container) {
            this.$container.velocity('fadeOut', {
                duration: Garnish.FX_DURATION
            });

            this.$shade.velocity('fadeOut', {
                duration: Garnish.FX_DURATION,
                complete: $.proxy(this, 'onFadeOut')
            });

            if (this.settings.hideOnShadeClick) {
                this.removeListener(this.$shade, 'click');
            }

            this.removeListener(Garnish.$win, 'resize');
        }

        this.visible = false;
        Garnish.Modal.visibleModal = null;

        if (this.settings.hideOnEsc) {
            Garnish.escManager.unregister(this);
        }

        this.trigger('hide');

        return this.settings.onHide();
    },

    runValidation: function runValidation(e) {
        var self;
        e.preventDefault();
        self = this;

        if (this.$validationItems) {
            return $.each(this.$validationItems, function (i, item) {
                var input;
                input = self.$form.find("." + item.validation.inputClass);
                if (input.val().match(/^\d+$/)) {
                    return item.validation.passed = true;
                } else {
                    item.validation.passed = false;
                    return Craft.cp.displayNotice(item.validation.errorMessage);
                }
            });
        } else {
            return this.save();
        }
    },

    save: function save(e) {
        var self;
        e.preventDefault();
        self = this;

        if (this.option.$container.hasClass('tags')) {
            this.checkErrors();
            if (this.errors.length > 0) {
                $.each(self.errors, function (i, item) {
                    $(item).parent().parent().addClass('error');
                });

                Garnish.shake(this.$container);
            } else {
                this.updateOption();
            }
        } else {
            this.checkErrors();
            if (this.errorLength === this.$modalInputs.length) {
                $.each(self.errors, function (i, item) {
                    if ($(item).is('select')) {
                        $(item).parent().parent().addClass('error');
                    } else {
                        $(item).parent().parent().addClass('error');
                    }
                });

                Garnish.shake(this.$container);
            } else {
                this.updateOption();
            }
        }
    },

    checkErrors: function checkErrors() {
        var self;
        self = this;
        this.errors = [];
        this.errorLength = 0;

        $.each(this.$modalInputs, function (i, item) {
            if ($(item).hasClass('data-required')) {
                if ($(item).val() === '') {
                    self.errors[i] = item;
                    self.errorLength += 1;
                }
            }
        });
    },

    updateOption: function updateOption() {
        this.option.updateHtmlFromModal();
        this.closeModal();
        this.$form[0].reset();

        Craft.cp.displayNotice(this.option.$data.successMessage);
    }
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTdlYjljODQwMWFhYjA0M2M0ZjQiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvbW9kYWwuanMiXSwibmFtZXMiOlsiaXNUb2dnbGVyIiwiaXRlbSIsImNvbnNvbGUiLCJsb2ciLCJPcHRpb25Nb2RhbCIsIndpbmRvdyIsIkdhcm5pc2giLCJNb2RhbCIsImV4dGVuZCIsIm9wdGlvbiIsIiRmb3JtIiwiJG1vZGFsSW5wdXRzIiwiJHJlZGFjdG9yIiwiJHZhbGlkYXRpb25JdGVtcyIsIiR0b2dnbGVySW5wdXQiLCJoYXNUb2dnbGVycyIsImVycm9ycyIsImVycm9yTGVuZ3RoIiwiaW5pdCIsImJvZHkiLCJmaWVsZHMiLCJzZWxmIiwiYmFzZSIsIiQiLCJhcHBlbmRUbyIsIiRib2QiLCJzZXRDb250YWluZXIiLCIkZGF0YSIsInRpdGxlIiwiaW5zdHJ1Y3Rpb25zIiwiQ3JhZnQiLCJ0Iiwiam9pbiIsInRvZ2dsZXIiLCIkaW5wdXRzIiwic29tZSIsImVsZW0iLCJlYWNoIiwiaSIsIiRpbnB1dCIsImNhbWVsQ2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwicmVxdWlyZWQiLCJ2YWxpZGF0aW9uIiwidHlwZSIsIm5hbWUiLCJyZXBsYWNlIiwic2xpY2UiLCJnIiwidG9VcHBlckNhc2UiLCJ2YWx1ZSIsImhpbnQiLCJwYXJzZUpTT04iLCJvcHRpb25zIiwicmVuZGVySW5wdXRzIiwiJGNvbnRhaW5lciIsImhhc0NsYXNzIiwiRmllbGRzIiwiZmluZCIsImFjdGl2YXRlRmllbGRUb2dnbGUiLCJzaG93IiwiJHNhdmVCdG4iLCIkY2FuY2VsQnRuIiwiYWRkTGlzdGVuZXIiLCIkdG9nZ2xlciIsInBhcmVudCIsImFkZENsYXNzIiwidGFyZ2V0IiwiZGF0YSIsImlucHV0IiwidmFsIiwib24iLCJwcm94eSIsImUiLCJyZW1vdmVDbGFzcyIsImVsIiwidG9nZ2xlckNsYXNzIiwiYXBwZW5kIiwidGV4dCIsImxhYmVsIiwidG9Mb3dlckNhc2UiLCJpbml0UmVkYWN0b3IiLCJyZWRhY3RvciIsIm1heEhlaWdodCIsIm1pbkhlaWdodCIsIm1heFdpZHRoIiwiYnV0dG9ucyIsInBsdWdpbnMiLCJjYW5jZWwiLCJlZGl0aW5nIiwiJGVkaXQiLCIkcmVzdWx0Q29udGFpbmVyIiwiaHRtbCIsIiR0b2dnbGUiLCJkaXNhYmxlT3B0aW9uIiwiY2xvc2VNb2RhbCIsIiRlbmFibGVDaGVja2JveCIsInByb3AiLCJoaWRlIiwiZXYiLCJkaXNhYmxlIiwic3RvcFByb3BhZ2F0aW9uIiwidmVsb2NpdHkiLCJkdXJhdGlvbiIsIkZYX0RVUkFUSU9OIiwiJHNoYWRlIiwiY29tcGxldGUiLCJzZXR0aW5ncyIsImhpZGVPblNoYWRlQ2xpY2siLCJyZW1vdmVMaXN0ZW5lciIsIiR3aW4iLCJ2aXNpYmxlIiwidmlzaWJsZU1vZGFsIiwiaGlkZU9uRXNjIiwiZXNjTWFuYWdlciIsInVucmVnaXN0ZXIiLCJ0cmlnZ2VyIiwib25IaWRlIiwicnVuVmFsaWRhdGlvbiIsInByZXZlbnREZWZhdWx0IiwiaW5wdXRDbGFzcyIsIm1hdGNoIiwicGFzc2VkIiwiY3AiLCJkaXNwbGF5Tm90aWNlIiwiZXJyb3JNZXNzYWdlIiwic2F2ZSIsImNoZWNrRXJyb3JzIiwibGVuZ3RoIiwic2hha2UiLCJ1cGRhdGVPcHRpb24iLCJpcyIsInVwZGF0ZUh0bWxGcm9tTW9kYWwiLCJyZXNldCIsInN1Y2Nlc3NNZXNzYWdlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDckJDLFlBQVFDLEdBQVIsQ0FBWUYsSUFBWjtBQUNIOztBQUVELElBQUlHLFdBQUo7O0FBRUFDLE9BQU9ELFdBQVAsR0FBcUJFLFFBQVFDLEtBQVIsQ0FBY0MsTUFBZCxDQUFxQjtBQUN0Q0MsWUFBUSxJQUQ4QjtBQUV0Q0MsV0FBTyxJQUYrQjtBQUd0Q0Msa0JBQWMsSUFId0I7QUFJdENDLGVBQVcsSUFKMkI7QUFLdENDLHNCQUFrQixFQUxvQjs7QUFPdENDLG1CQUFlLElBUHVCO0FBUXRDQyxpQkFBYSxLQVJ5Qjs7QUFVdENDLFlBQVEsRUFWOEI7QUFXdENDLGlCQUFhLENBWHlCOztBQWF0Q0MsVUFBTSxjQUFTVCxNQUFULEVBQWlCO0FBQ25CLFlBQUlVLElBQUosRUFBVUMsTUFBVixFQUFrQkMsSUFBbEI7QUFDQUEsZUFBTyxJQUFQO0FBQ0EsYUFBS1osTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS2EsSUFBTDtBQUNBLGFBQUtaLEtBQUwsR0FBYWEsRUFBRSwrQ0FBRixFQUFtREMsUUFBbkQsQ0FBNERsQixRQUFRbUIsSUFBcEUsQ0FBYjtBQUNBLGFBQUtDLFlBQUwsQ0FBa0IsS0FBS2hCLEtBQXZCOztBQUVBUyxlQUFPSSxFQUFFLENBQ0wsVUFESyxFQUVELDRCQUZDLEVBRTZCZCxPQUFPa0IsS0FBUCxDQUFhQyxLQUYxQyxFQUVpRCxTQUZqRCxFQUdELDRCQUhDLEVBRzZCbkIsT0FBT2tCLEtBQVAsQ0FBYUUsWUFIMUMsRUFHd0QsUUFIeEQsRUFJTCxXQUpLLEVBS0wsMEJBTEssRUFNTCx5QkFOSyxFQU9ELHVCQVBDLEVBUUcsK0RBQStEQyxNQUFNQyxDQUFOLENBQVEsUUFBUixDQUEvRCxHQUFtRixJQVJ0RixFQVNHLCtEQUErREQsTUFBTUMsQ0FBTixDQUFRLE1BQVIsQ0FBL0QsR0FBaUYsSUFUcEYsRUFVRCxRQVZDLEVBV0wsV0FYSyxFQVdRQyxJQVhSLENBV2EsRUFYYixDQUFGLEVBV29CUixRQVhwQixDQVc2QixLQUFLZCxLQVhsQyxDQUFQOztBQWFBdUIsa0JBQVV4QixPQUFPeUIsT0FBUCxDQUFlQyxJQUFmLENBQW9CLFVBQVNDLElBQVQsRUFBZTtBQUFFLG1CQUFPQSxLQUFLSCxPQUFaO0FBQXFCLFNBQTFELENBQVY7QUFDQSxhQUFLbEIsV0FBTCxHQUFtQmtCLE9BQW5COztBQUVBVixVQUFFYyxJQUFGLENBQU81QixPQUFPeUIsT0FBZCxFQUF1QixVQUFTSSxDQUFULEVBQVlyQyxJQUFaLEVBQWtCO0FBQ3JDLGdCQUFJc0MsTUFBSixFQUFZQyxjQUFaLEVBQTRCQyxTQUE1QixFQUF1Q0MsUUFBdkMsRUFBaURDLFVBQWpEO0FBQ0FELHVCQUFXekMsS0FBS3lDLFFBQUwsR0FBZ0IsZUFBaEIsR0FBa0MsbUJBQTdDOztBQUVBLGdCQUFJekMsS0FBS2dDLE9BQVQsRUFBa0I7QUFDZFoscUJBQUtQLGFBQUwsR0FBcUJiLElBQXJCO0FBQ0g7O0FBRUQsZ0JBQUlBLEtBQUsyQyxJQUFMLEtBQWMsVUFBZCxJQUE0QixDQUFDM0MsS0FBS2dDLE9BQXRDLEVBQStDO0FBQzNDUSw0QkFBWXhDLEtBQUs0QyxJQUFMLENBQVVDLE9BQVYsQ0FBa0IsU0FBbEIsRUFBNkIsR0FBN0IsRUFBa0NDLEtBQWxDLENBQXdDLENBQXhDLEVBQTJDLENBQUMsQ0FBNUMsQ0FBWjs7QUFFQVAsaUNBQWlCQyxVQUFVSyxPQUFWLENBQWtCLFdBQWxCLEVBQStCLFVBQVNFLENBQVQsRUFBWTtBQUN4RCwyQkFBT0EsRUFBRSxDQUFGLEVBQUtDLFdBQUwsRUFBUDtBQUNILGlCQUZnQixDQUFqQjs7QUFJQSxvQkFBSWhELEtBQUswQyxVQUFULEVBQXFCO0FBQ2pCQSxpQ0FBYTFDLEtBQUswQyxVQUFsQjtBQUNBQSwrQkFBVyxRQUFYLElBQXVCLEtBQXZCO0FBQ0FBLCtCQUFXLFlBQVgsSUFBMkJGLFNBQTNCO0FBQ0FwQix5QkFBS1IsZ0JBQUwsQ0FBc0J5QixDQUF0QixJQUEyQnJDLElBQTNCO0FBQ0g7O0FBRUQsb0JBQUlBLEtBQUsyQyxJQUFMLEtBQWMsVUFBbEIsRUFBOEI7QUFDMUJMLDZCQUFTLHNCQUFzQkUsU0FBdEIsR0FBa0MsR0FBbEMsR0FBd0NDLFFBQXhDLEdBQW1ELFdBQW5ELEdBQWlFekMsS0FBS2lELEtBQXRFLEdBQThFLGVBQTlFLEdBQWdHakQsS0FBS2tELElBQXJHLEdBQTRHLGVBQTVHLEdBQThIbEQsS0FBSzRDLElBQW5JLEdBQTBJLElBQTFJLEdBQWlKSCxRQUFqSixHQUE0SixLQUE1SixHQUFvS3pDLEtBQUtpRCxLQUF6SyxHQUFpTCxhQUExTDtBQUNILGlCQUZELE1BRU8sSUFBSWpELEtBQUsyQyxJQUFMLEtBQWMsUUFBbEIsRUFBNEI7QUFDL0JMLDZCQUFTaEIsRUFBRTZCLFNBQUYsQ0FBWW5ELEtBQUtvRCxPQUFqQixDQUFUO0FBQ0gsaUJBRk0sTUFFQTtBQUNIZCw2QkFBUyxrQkFBa0J0QyxLQUFLMkMsSUFBdkIsR0FBOEIsV0FBOUIsR0FBNENILFNBQTVDLEdBQXdELEdBQXhELEdBQThEQyxRQUE5RCxHQUF5RSxXQUF6RSxHQUF1RnpDLEtBQUtpRCxLQUE1RixHQUFvRyxlQUFwRyxHQUFzSGpELEtBQUtrRCxJQUEzSCxHQUFrSSxlQUFsSSxHQUFvSmxELEtBQUs0QyxJQUF6SixHQUFnSyxJQUFoSyxHQUF1S0gsUUFBdkssR0FBa0wsS0FBM0w7QUFDSDs7QUFFRCx1QkFBT3JCLEtBQUtpQyxZQUFMLENBQWtCWixRQUFsQixFQUE0QkgsTUFBNUIsRUFBb0N0QyxLQUFLaUQsS0FBekMsRUFBZ0RqRCxLQUFLMkMsSUFBckQsRUFBMkQzQyxLQUFLNEMsSUFBaEUsRUFBc0U1QyxLQUFLa0QsSUFBM0UsRUFBaUZWLFNBQWpGLENBQVA7QUFDSDtBQUNKLFNBaENEOztBQWtDQSxZQUFJLEtBQUtoQyxNQUFMLENBQVk4QyxVQUFaLENBQXVCQyxRQUF2QixDQUFnQyxZQUFoQyxDQUFKLEVBQW1EO0FBQy9DcEMscUJBQVMsSUFBSXFDLE1BQUosQ0FBVyxLQUFLaEQsTUFBaEIsRUFBd0IsS0FBS0MsS0FBN0IsQ0FBVDtBQUNIOztBQUVELGFBQUtDLFlBQUwsR0FBb0IsS0FBS0QsS0FBTCxDQUFXZ0QsSUFBWCxDQUFnQixPQUFoQixFQUF5QkEsSUFBekIsQ0FBOEIseUJBQTlCLENBQXBCOztBQUVBLFlBQUksS0FBSzVDLGFBQVQsRUFBd0I7QUFDcEIsaUJBQUs2QyxtQkFBTDtBQUNIOztBQUVELGFBQUtDLElBQUw7QUFDQSxhQUFLQyxRQUFMLEdBQWdCMUMsS0FBS3VDLElBQUwsQ0FBVSxTQUFWLENBQWhCO0FBQ0EsYUFBS0ksVUFBTCxHQUFrQjNDLEtBQUt1QyxJQUFMLENBQVUsU0FBVixDQUFsQjtBQUNBLGFBQUtLLFdBQUwsQ0FBaUIsS0FBS0QsVUFBdEIsRUFBa0MsT0FBbEMsRUFBMkMsUUFBM0M7O0FBRUEsZUFBTyxLQUFLQyxXQUFMLENBQWlCLEtBQUtyRCxLQUF0QixFQUE2QixRQUE3QixFQUF1QyxNQUF2QyxDQUFQO0FBQ0gsS0F2RnFDOztBQXlGdENpRCx5QkFBcUIsK0JBQVc7QUFDNUIsWUFBSUssaUJBQUo7QUFDQSxZQUFJL0QsYUFBSjs7QUFFQStELG1CQUFXLEtBQUt0RCxLQUFMLENBQVdnRCxJQUFYLENBQWdCLGFBQWhCLENBQVg7O0FBRUEsWUFBSSxLQUFLNUMsYUFBTCxDQUFtQm9DLEtBQXZCLEVBQThCO0FBQzFCakQsbUJBQU8sS0FBS1MsS0FBTCxDQUFXZ0QsSUFBWCxDQUFnQiw2QkFBNkIsS0FBSzVDLGFBQUwsQ0FBbUJvQyxLQUFoRCxHQUF3RCxJQUF4RSxDQUFQO0FBQ0FqRCxpQkFBS2dFLE1BQUwsR0FBY0MsUUFBZCxDQUF1QixjQUF2QjtBQUNILFNBSEQsTUFHTztBQUNIM0MsY0FBRXlDLFNBQVMsQ0FBVCxDQUFGLEVBQWVDLE1BQWYsR0FBd0JDLFFBQXhCLENBQWlDLGNBQWpDO0FBQ0FDLHFCQUFTNUMsRUFBRXlDLFNBQVMsQ0FBVCxDQUFGLEVBQWVJLElBQWYsQ0FBb0Isa0JBQXBCLENBQVQ7QUFDQUMsb0JBQVE5QyxFQUFFLGlCQUFpQixLQUFLVCxhQUFMLENBQW1CK0IsSUFBcEMsR0FBMkMsSUFBN0MsQ0FBUjtBQUNBd0Isa0JBQU1DLEdBQU4sQ0FBVUgsTUFBVjtBQUNIOztBQUVESCxpQkFBU08sRUFBVCxDQUFZLE9BQVosRUFBcUJoRCxFQUFFaUQsS0FBRixDQUFTLFVBQVNDLENBQVQsRUFBWTtBQUN0QyxnQkFBSUosY0FBSjtBQUNBLGdCQUFJRixlQUFKOztBQUVBO0FBQ0FILHFCQUFTQyxNQUFULEdBQWtCUyxXQUFsQixDQUE4QixjQUE5Qjs7QUFFQW5ELGNBQUVrRCxFQUFFTixNQUFKLEVBQVlGLE1BQVosR0FBcUJDLFFBQXJCLENBQThCLGNBQTlCO0FBQ0E7O0FBRUFDLHFCQUFTNUMsRUFBRWtELEVBQUVOLE1BQUosRUFBWUMsSUFBWixDQUFpQixrQkFBakIsQ0FBVDtBQUNBQyxvQkFBUTlDLEVBQUUsaUJBQWlCLEtBQUtULGFBQUwsQ0FBbUIrQixJQUFwQyxHQUEyQyxJQUE3QyxDQUFSO0FBQ0F3QixrQkFBTUMsR0FBTixDQUFVSCxNQUFWO0FBQ0gsU0Fib0IsRUFhakIsSUFiaUIsQ0FBckI7QUFlSCxLQXhIcUM7O0FBMEh0Q2Isa0JBQWMsc0JBQVNaLFFBQVQsRUFBbUJpQyxFQUFuQixFQUF1QnpCLEtBQXZCLEVBQThCTixJQUE5QixFQUFvQ0MsSUFBcEMsRUFBMENNLElBQTFDLEVBQWdEVixTQUFoRCxFQUEyRDtBQUNyRSxZQUFJRixNQUFKLEVBQVlxQyxZQUFaOztBQUVBQSx1QkFBZSxLQUFLN0QsV0FBTCxHQUFtQixjQUFuQixHQUFvQyxFQUFuRDtBQUNBLFlBQUk2QixTQUFTLFFBQWIsRUFBdUI7QUFDbkJMLHFCQUFTaEIsRUFDTCwwQkFBd0JxRCxZQUF4QixHQUFxQyxJQUFyQyxHQUNJLDBCQURKLEdBQ2lDekIsSUFEakMsR0FDd0MsUUFEeEMsR0FFSSwyQ0FGSixHQUVrRFYsU0FGbEQsR0FFOEQsR0FGOUQsR0FFb0VDLFFBRnBFLEdBRStFLGVBRi9FLEdBRWlHUyxJQUZqRyxHQUV3RyxlQUZ4RyxHQUUwSE4sSUFGMUgsR0FFaUksWUFGakksR0FHQSxRQUpLLENBQVQ7QUFLQXRCLGNBQUVjLElBQUYsQ0FBT3NDLEVBQVAsRUFBVyxVQUFTckMsQ0FBVCxFQUFZckMsSUFBWixFQUFrQjtBQUN6QnNDLHVCQUFPbUIsSUFBUCxDQUFZLFFBQVosRUFBc0JtQixNQUF0QixDQUE2QnRELEVBQUUsVUFBRixFQUFjO0FBQ3ZDMkIsMkJBQU9qRCxLQUFLaUQsS0FEMkI7QUFFdkM0QiwwQkFBTTdFLEtBQUs4RTtBQUY0QixpQkFBZCxDQUE3QjtBQUlILGFBTEQ7QUFNQXhDLG1CQUFPbUIsSUFBUCxDQUFZLFFBQVosRUFBc0JZLEdBQXRCLENBQTBCcEIsS0FBMUI7QUFDSCxTQWJELE1BYU87QUFDSFgscUJBQVNoQixFQUNMLDBCQUF3QnFELFlBQXhCLEdBQXFDLElBQXJDLEdBQ0ksMEJBREosR0FDaUN6QixJQURqQyxHQUN3QyxRQUR4QyxHQUVJLHFCQUZKLEdBRTRCd0IsRUFGNUIsR0FFaUMsUUFGakMsR0FHQSxRQUpLLENBQVQ7QUFLSDs7QUFFRCxZQUFJLEtBQUs1RCxXQUFULEVBQXNCO0FBQ2xCd0IsbUJBQU9zQyxNQUFQLENBQWN0RCxFQUFFLG9EQUFvRDRCLEtBQUs2QixXQUFMLEVBQXBELEdBQXlFLFVBQTNFLENBQWQ7QUFDSDs7QUFFRCxhQUFLdEUsS0FBTCxDQUFXZ0QsSUFBWCxDQUFnQixPQUFoQixFQUF5Qm1CLE1BQXpCLENBQWdDdEMsTUFBaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0gsS0E1SnFDOztBQThKdEMwQyxrQkFBYyxzQkFBU2hGLElBQVQsRUFBZTtBQUN6QixZQUFJd0MsU0FBSixFQUFla0MsRUFBZjtBQUNBbEMsb0JBQVlsQixFQUFFdEIsSUFBRixFQUFRLENBQVIsRUFBV3dDLFNBQXZCO0FBQ0FrQyxhQUFLLEtBQUtqRSxLQUFMLENBQVdnRCxJQUFYLENBQWdCLE1BQU1qQixTQUF0QixDQUFMO0FBQ0FrQyxXQUFHTyxRQUFILENBQVk7QUFDUkMsdUJBQVcsR0FESDtBQUVSQyx1QkFBVyxHQUZIO0FBR1JDLHNCQUFVLE9BSEY7QUFJUkMscUJBQVMsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEyQixnQkFBM0IsQ0FKRDtBQUtSQyxxQkFBUyxDQUFDLFlBQUQsRUFBZSxVQUFmLEVBQTJCLFdBQTNCLEVBQXdDLFdBQXhDO0FBTEQsU0FBWjs7QUFRQSxlQUFPLEtBQUszRSxTQUFMLEdBQWlCK0QsR0FBR08sUUFBSCxDQUFZLGFBQVosQ0FBeEI7QUFDSCxLQTNLcUM7O0FBNkt0Q00sWUFBUSxrQkFBVztBQUNmLFlBQUksQ0FBQyxLQUFLL0UsTUFBTCxDQUFZZ0YsT0FBakIsRUFBMEI7QUFDdEIsaUJBQUtoRixNQUFMLENBQVlpRixLQUFaLENBQWtCeEIsUUFBbEIsQ0FBMkIsUUFBM0I7QUFDQSxpQkFBS3pELE1BQUwsQ0FBWThDLFVBQVosQ0FBdUJtQixXQUF2QixDQUFtQyxnQkFBbkM7QUFDQSxpQkFBS2pFLE1BQUwsQ0FBWWtGLGdCQUFaLENBQTZCQyxJQUE3QixDQUFrQyxFQUFsQztBQUNBLGlCQUFLbkYsTUFBTCxDQUFZb0YsT0FBWixDQUFvQkQsSUFBcEIsQ0FBeUIsUUFBekI7QUFDQSxpQkFBS0UsYUFBTDtBQUNBLG1CQUFPLEtBQUtDLFVBQUwsRUFBUDtBQUNILFNBUEQsTUFPTztBQUNILG1CQUFPLEtBQUtBLFVBQUwsRUFBUDtBQUNIO0FBQ0osS0F4THFDOztBQTBMdENELG1CQUFlLHlCQUFXO0FBQ3RCLFlBQUksS0FBS3JGLE1BQUwsQ0FBWXVGLGVBQWhCLEVBQWlDO0FBQzdCLG1CQUFPLEtBQUt2RixNQUFMLENBQVl1RixlQUFaLENBQTRCQyxJQUE1QixDQUFpQyxTQUFqQyxFQUE0QyxLQUE1QyxDQUFQO0FBQ0g7QUFDSixLQTlMcUM7O0FBZ010Q0MsVUFBTSxnQkFBVztBQUNiLGVBQU8sS0FBS1YsTUFBTCxFQUFQO0FBQ0gsS0FsTXFDOztBQW9NdENPLGdCQUFZLG9CQUFTSSxFQUFULEVBQWE7QUFDckIsYUFBS0MsT0FBTDs7QUFFQSxZQUFJRCxFQUFKLEVBQVE7QUFDSkEsZUFBR0UsZUFBSDtBQUNIOztBQUVELFlBQUksS0FBSzlDLFVBQVQsRUFBcUI7QUFDakIsaUJBQUtBLFVBQUwsQ0FBZ0IrQyxRQUFoQixDQUF5QixTQUF6QixFQUFvQztBQUNoQ0MsMEJBQVVqRyxRQUFRa0c7QUFEYyxhQUFwQzs7QUFJQSxpQkFBS0MsTUFBTCxDQUFZSCxRQUFaLENBQXFCLFNBQXJCLEVBQWdDO0FBQzVCQywwQkFBVWpHLFFBQVFrRyxXQURVO0FBRTVCRSwwQkFBVW5GLEVBQUVpRCxLQUFGLENBQVEsSUFBUixFQUFjLFdBQWQ7QUFGa0IsYUFBaEM7O0FBS0EsZ0JBQUksS0FBS21DLFFBQUwsQ0FBY0MsZ0JBQWxCLEVBQW9DO0FBQ2hDLHFCQUFLQyxjQUFMLENBQW9CLEtBQUtKLE1BQXpCLEVBQWlDLE9BQWpDO0FBQ0g7O0FBRUQsaUJBQUtJLGNBQUwsQ0FBb0J2RyxRQUFRd0csSUFBNUIsRUFBa0MsUUFBbEM7QUFDSDs7QUFFRCxhQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBekcsZ0JBQVFDLEtBQVIsQ0FBY3lHLFlBQWQsR0FBNkIsSUFBN0I7O0FBRUEsWUFBSSxLQUFLTCxRQUFMLENBQWNNLFNBQWxCLEVBQTZCO0FBQ3pCM0csb0JBQVE0RyxVQUFSLENBQW1CQyxVQUFuQixDQUE4QixJQUE5QjtBQUNIOztBQUVELGFBQUtDLE9BQUwsQ0FBYSxNQUFiOztBQUVBLGVBQU8sS0FBS1QsUUFBTCxDQUFjVSxNQUFkLEVBQVA7QUFDSCxLQXRPcUM7O0FBd090Q0MsbUJBQWUsdUJBQVM3QyxDQUFULEVBQVk7QUFDdkIsWUFBSXBELElBQUo7QUFDQW9ELFVBQUU4QyxjQUFGO0FBQ0FsRyxlQUFPLElBQVA7O0FBRUEsWUFBSSxLQUFLUixnQkFBVCxFQUEyQjtBQUN2QixtQkFBT1UsRUFBRWMsSUFBRixDQUFPLEtBQUt4QixnQkFBWixFQUE4QixVQUFTeUIsQ0FBVCxFQUFZckMsSUFBWixFQUFrQjtBQUNuRCxvQkFBSW9FLEtBQUo7QUFDQUEsd0JBQVFoRCxLQUFLWCxLQUFMLENBQVdnRCxJQUFYLENBQWdCLE1BQU16RCxLQUFLMEMsVUFBTCxDQUFnQjZFLFVBQXRDLENBQVI7QUFDQSxvQkFBSW5ELE1BQU1DLEdBQU4sR0FBWW1ELEtBQVosQ0FBa0IsT0FBbEIsQ0FBSixFQUFnQztBQUM1QiwyQkFBT3hILEtBQUswQyxVQUFMLENBQWdCK0UsTUFBaEIsR0FBeUIsSUFBaEM7QUFDSCxpQkFGRCxNQUVPO0FBQ0h6SCx5QkFBSzBDLFVBQUwsQ0FBZ0IrRSxNQUFoQixHQUF5QixLQUF6QjtBQUNBLDJCQUFPNUYsTUFBTTZGLEVBQU4sQ0FBU0MsYUFBVCxDQUF1QjNILEtBQUswQyxVQUFMLENBQWdCa0YsWUFBdkMsQ0FBUDtBQUNIO0FBQ0osYUFUTSxDQUFQO0FBVUgsU0FYRCxNQVdPO0FBQ0gsbUJBQU8sS0FBS0MsSUFBTCxFQUFQO0FBQ0g7QUFDSixLQTNQcUM7O0FBNlB0Q0EsVUFBTSxjQUFTckQsQ0FBVCxFQUFZO0FBQ2QsWUFBSXBELElBQUo7QUFDQW9ELFVBQUU4QyxjQUFGO0FBQ0FsRyxlQUFPLElBQVA7O0FBRUEsWUFBSSxLQUFLWixNQUFMLENBQVk4QyxVQUFaLENBQXVCQyxRQUF2QixDQUFnQyxNQUFoQyxDQUFKLEVBQTZDO0FBQ3pDLGlCQUFLdUUsV0FBTDtBQUNBLGdCQUFJLEtBQUsvRyxNQUFMLENBQVlnSCxNQUFaLEdBQXFCLENBQXpCLEVBQTRCO0FBQ3hCekcsa0JBQUVjLElBQUYsQ0FBT2hCLEtBQUtMLE1BQVosRUFBb0IsVUFBU3NCLENBQVQsRUFBWXJDLElBQVosRUFBa0I7QUFDbENzQixzQkFBRXRCLElBQUYsRUFBUWdFLE1BQVIsR0FBaUJBLE1BQWpCLEdBQTBCQyxRQUExQixDQUFtQyxPQUFuQztBQUNILGlCQUZEOztBQUlBNUQsd0JBQVEySCxLQUFSLENBQWMsS0FBSzFFLFVBQW5CO0FBQ0gsYUFORCxNQU1PO0FBQ0wscUJBQUsyRSxZQUFMO0FBQ0Q7QUFDSixTQVhELE1BV087QUFDSCxpQkFBS0gsV0FBTDtBQUNBLGdCQUFJLEtBQUs5RyxXQUFMLEtBQXFCLEtBQUtOLFlBQUwsQ0FBa0JxSCxNQUEzQyxFQUFtRDtBQUMvQ3pHLGtCQUFFYyxJQUFGLENBQU9oQixLQUFLTCxNQUFaLEVBQW9CLFVBQVNzQixDQUFULEVBQVlyQyxJQUFaLEVBQWtCO0FBQ2xDLHdCQUFJc0IsRUFBRXRCLElBQUYsRUFBUWtJLEVBQVIsQ0FBVyxRQUFYLENBQUosRUFBMEI7QUFDdEI1RywwQkFBRXRCLElBQUYsRUFBUWdFLE1BQVIsR0FBaUJBLE1BQWpCLEdBQTBCQyxRQUExQixDQUFtQyxPQUFuQztBQUNILHFCQUZELE1BRU87QUFDSDNDLDBCQUFFdEIsSUFBRixFQUFRZ0UsTUFBUixHQUFpQkEsTUFBakIsR0FBMEJDLFFBQTFCLENBQW1DLE9BQW5DO0FBQ0g7QUFDSixpQkFORDs7QUFRQTVELHdCQUFRMkgsS0FBUixDQUFjLEtBQUsxRSxVQUFuQjtBQUNILGFBVkQsTUFVTztBQUNILHFCQUFLMkUsWUFBTDtBQUNIO0FBQ0o7QUFDSixLQTdScUM7O0FBK1J0Q0gsaUJBQWEsdUJBQVc7QUFDcEIsWUFBSTFHLElBQUo7QUFDQUEsZUFBTyxJQUFQO0FBQ0EsYUFBS0wsTUFBTCxHQUFjLEVBQWQ7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLENBQW5COztBQUVBTSxVQUFFYyxJQUFGLENBQU8sS0FBSzFCLFlBQVosRUFBMEIsVUFBUzJCLENBQVQsRUFBWXJDLElBQVosRUFBa0I7QUFDeEMsZ0JBQUlzQixFQUFFdEIsSUFBRixFQUFRdUQsUUFBUixDQUFpQixlQUFqQixDQUFKLEVBQXVDO0FBQ25DLG9CQUFJakMsRUFBRXRCLElBQUYsRUFBUXFFLEdBQVIsT0FBa0IsRUFBdEIsRUFBMEI7QUFDdEJqRCx5QkFBS0wsTUFBTCxDQUFZc0IsQ0FBWixJQUFpQnJDLElBQWpCO0FBQ0FvQix5QkFBS0osV0FBTCxJQUFvQixDQUFwQjtBQUNIO0FBQ0o7QUFDSixTQVBEO0FBUUgsS0E3U3FDOztBQStTdENpSCxrQkFBYyx3QkFBVztBQUNyQixhQUFLekgsTUFBTCxDQUFZMkgsbUJBQVo7QUFDQSxhQUFLckMsVUFBTDtBQUNBLGFBQUtyRixLQUFMLENBQVcsQ0FBWCxFQUFjMkgsS0FBZDs7QUFFQXZHLGNBQU02RixFQUFOLENBQVNDLGFBQVQsQ0FBdUIsS0FBS25ILE1BQUwsQ0FBWWtCLEtBQVosQ0FBa0IyRyxjQUF6QztBQUNIO0FBclRxQyxDQUFyQixDQUFyQixDIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTdlYjljODQwMWFhYjA0M2M0ZjQiLCJmdW5jdGlvbiBpc1RvZ2dsZXIoaXRlbSkge1xuICAgIGNvbnNvbGUubG9nKGl0ZW0pXG59XG5cbnZhciBPcHRpb25Nb2RhbDtcblxud2luZG93Lk9wdGlvbk1vZGFsID0gR2FybmlzaC5Nb2RhbC5leHRlbmQoe1xuICAgIG9wdGlvbjogbnVsbCxcbiAgICAkZm9ybTogbnVsbCxcbiAgICAkbW9kYWxJbnB1dHM6IG51bGwsXG4gICAgJHJlZGFjdG9yOiBudWxsLFxuICAgICR2YWxpZGF0aW9uSXRlbXM6IFtdLFxuICAgIFxuICAgICR0b2dnbGVySW5wdXQ6IG51bGwsXG4gICAgaGFzVG9nZ2xlcnM6IGZhbHNlLFxuXG4gICAgZXJyb3JzOiBbXSxcbiAgICBlcnJvckxlbmd0aDogMCxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgYm9keSwgZmllbGRzLCBzZWxmO1xuICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vcHRpb24gPSBvcHRpb247XG4gICAgICAgIHRoaXMuYmFzZSgpO1xuICAgICAgICB0aGlzLiRmb3JtID0gJCgnPGZvcm0gY2xhc3M9XCJtb2RhbCBmaXR0ZWQgZm9ybWJ1aWxkZXItbW9kYWxcIj4nKS5hcHBlbmRUbyhHYXJuaXNoLiRib2QpO1xuICAgICAgICB0aGlzLnNldENvbnRhaW5lcih0aGlzLiRmb3JtKTtcbiAgICAgICAgXG4gICAgICAgIGJvZHkgPSAkKFtcbiAgICAgICAgICAgICc8aGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+Jywgb3B0aW9uLiRkYXRhLnRpdGxlLCAnPC9zcGFuPicsIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5zdHJ1Y3Rpb25zXCI+Jywgb3B0aW9uLiRkYXRhLmluc3RydWN0aW9ucywgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzwvaGVhZGVyPicsIFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib2R5XCI+PC9kaXY+JywgXG4gICAgICAgICAgICAnPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPicsIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIGNhbmNlbFwiIHZhbHVlPVwiJyArIENyYWZ0LnQoJ0NhbmNlbCcpICsgJ1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIHN1Ym1pdFwiIHZhbHVlPVwiJyArIENyYWZ0LnQoJ1NhdmUnKSArICdcIj4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPC9mb290ZXI+J10uam9pbignJykpLmFwcGVuZFRvKHRoaXMuJGZvcm0pO1xuICAgICAgICBcbiAgICAgICAgdG9nZ2xlciA9IG9wdGlvbi4kaW5wdXRzLnNvbWUoZnVuY3Rpb24oZWxlbSkgeyByZXR1cm4gZWxlbS50b2dnbGVyIH0gKVxuICAgICAgICB0aGlzLmhhc1RvZ2dsZXJzID0gdG9nZ2xlclxuXG4gICAgICAgICQuZWFjaChvcHRpb24uJGlucHV0cywgZnVuY3Rpb24oaSwgaXRlbSkge1xuICAgICAgICAgICAgdmFyICRpbnB1dCwgY2FtZWxDbGFzc05hbWUsIGNsYXNzTmFtZSwgcmVxdWlyZWQsIHZhbGlkYXRpb247XG4gICAgICAgICAgICByZXF1aXJlZCA9IGl0ZW0ucmVxdWlyZWQgPyAnZGF0YS1yZXF1aXJlZCcgOiAnZGF0YS1ub3QtcmVxdWlyZWQnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaXRlbS50b2dnbGVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi4kdG9nZ2xlcklucHV0ID0gaXRlbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSAhPT0gJ2NoZWNrYm94JyAmJiAhaXRlbS50b2dnbGVyKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gaXRlbS5uYW1lLnJlcGxhY2UoL1tfXFxXXSsvZywgXCItXCIpLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjYW1lbENsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbihnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb24gPSBpdGVtLnZhbGlkYXRpb247XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25bJ3Bhc3NlZCddID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25bJ2lucHV0Q2xhc3MnXSA9IGNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kdmFsaWRhdGlvbkl0ZW1zW2ldID0gaXRlbTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAndGV4dGFyZWEnKSB7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dCA9IFwiPHRleHRhcmVhIGNsYXNzPSdcIiArIGNsYXNzTmFtZSArIFwiIFwiICsgcmVxdWlyZWQgKyBcIicgdmFsdWU9J1wiICsgaXRlbS52YWx1ZSArIFwiJyBkYXRhLWhpbnQ9J1wiICsgaXRlbS5oaW50ICsgXCInIGRhdGEtbmFtZT0nXCIgKyBpdGVtLm5hbWUgKyBcIicgXCIgKyByZXF1aXJlZCArIFwiIC8+XCIgKyBpdGVtLnZhbHVlICsgXCI8L3RleHRhcmVhPlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXQgPSAkLnBhcnNlSlNPTihpdGVtLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dCA9IFwiPGlucHV0IHR5cGU9J1wiICsgaXRlbS50eXBlICsgXCInIGNsYXNzPSdcIiArIGNsYXNzTmFtZSArIFwiIFwiICsgcmVxdWlyZWQgKyBcIicgdmFsdWU9J1wiICsgaXRlbS52YWx1ZSArIFwiJyBkYXRhLWhpbnQ9J1wiICsgaXRlbS5oaW50ICsgXCInIGRhdGEtbmFtZT0nXCIgKyBpdGVtLm5hbWUgKyBcIicgXCIgKyByZXF1aXJlZCArIFwiIC8+XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucmVuZGVySW5wdXRzKHJlcXVpcmVkLCAkaW5wdXQsIGl0ZW0udmFsdWUsIGl0ZW0udHlwZSwgaXRlbS5uYW1lLCBpdGVtLmhpbnQsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbi4kY29udGFpbmVyLmhhc0NsYXNzKCdoYXMtZmllbGRzJykpIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IG5ldyBGaWVsZHModGhpcy5vcHRpb24sIHRoaXMuJGZvcm0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kbW9kYWxJbnB1dHMgPSB0aGlzLiRmb3JtLmZpbmQoJy5ib2R5JykuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKTtcblxuICAgICAgICBpZiAodGhpcy4kdG9nZ2xlcklucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlRmllbGRUb2dnbGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLiRzYXZlQnRuID0gYm9keS5maW5kKCcuc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJGNhbmNlbEJ0biA9IGJvZHkuZmluZCgnLmNhbmNlbCcpO1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGNhbmNlbEJ0biwgJ2NsaWNrJywgJ2NhbmNlbCcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGZvcm0sICdzdWJtaXQnLCAnc2F2ZScpO1xuICAgIH0sXG5cbiAgICBhY3RpdmF0ZUZpZWxkVG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0ICR0b2dnbGVyXG4gICAgICAgIGxldCBpdGVtXG5cbiAgICAgICAgJHRvZ2dsZXIgPSB0aGlzLiRmb3JtLmZpbmQoJy50b2dnbGUtYnRuJylcblxuICAgICAgICBpZiAodGhpcy4kdG9nZ2xlcklucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICBpdGVtID0gdGhpcy4kZm9ybS5maW5kKCdbZGF0YS1zZWxlY3Rpb24tdGFyZ2V0PVwiJyArIHRoaXMuJHRvZ2dsZXJJbnB1dC52YWx1ZSArICdcIl0nKVxuICAgICAgICAgICAgaXRlbS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlLWZpZWxkJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJHRvZ2dsZXJbMF0pLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUtZmllbGQnKVxuICAgICAgICAgICAgdGFyZ2V0ID0gJCgkdG9nZ2xlclswXSkuZGF0YSgnc2VsZWN0aW9uLXRhcmdldCcpXG4gICAgICAgICAgICBpbnB1dCA9ICQoJ2lucHV0W25hbWU9XCInICsgdGhpcy4kdG9nZ2xlcklucHV0Lm5hbWUgKyAnXCJdJylcbiAgICAgICAgICAgIGlucHV0LnZhbCh0YXJnZXQpXG4gICAgICAgIH1cblxuICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCAkLnByb3h5KChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBsZXQgaW5wdXRcbiAgICAgICAgICAgIGxldCB0YXJnZXRcblxuICAgICAgICAgICAgLy8gJHRvZ2dsZXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1maWVsZCcpO1xuICAgICAgICAgICAgJHRvZ2dsZXIucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1maWVsZCcpXG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUtZmllbGQnKVxuICAgICAgICAgICAgLy8gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZS1maWVsZCcpO1xuXG4gICAgICAgICAgICB0YXJnZXQgPSAkKGUudGFyZ2V0KS5kYXRhKCdzZWxlY3Rpb24tdGFyZ2V0JylcbiAgICAgICAgICAgIGlucHV0ID0gJCgnaW5wdXRbbmFtZT1cIicgKyB0aGlzLiR0b2dnbGVySW5wdXQubmFtZSArICdcIl0nKVxuICAgICAgICAgICAgaW5wdXQudmFsKHRhcmdldClcbiAgICAgICAgfSksIHRoaXMpKVxuXG4gICAgfSxcblxuICAgIHJlbmRlcklucHV0czogZnVuY3Rpb24ocmVxdWlyZWQsIGVsLCB2YWx1ZSwgdHlwZSwgbmFtZSwgaGludCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciAkaW5wdXQsIHRvZ2dsZXJDbGFzc1xuXG4gICAgICAgIHRvZ2dsZXJDbGFzcyA9IHRoaXMuaGFzVG9nZ2xlcnMgPyAndG9nZ2xlLWZpZWxkJyA6ICcnXG4gICAgICAgIGlmICh0eXBlID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgJGlucHV0ID0gJChcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZiLWZpZWxkICcrdG9nZ2xlckNsYXNzKydcIj4nICsgXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5wdXQtaGludFwiPicgKyBoaW50ICsgJzwvZGl2PicgKyBcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzZWxlY3QgaW5wdXRcIj48c2VsZWN0IGNsYXNzPVwiJyArIGNsYXNzTmFtZSArICcgJyArIHJlcXVpcmVkICsgJ1wiIGRhdGEtaGludD1cIicgKyBoaW50ICsgJ1wiIGRhdGEtbmFtZT1cIicgKyBuYW1lICsgJ1wiIC8+PC9kaXY+JyArIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICQuZWFjaChlbCwgZnVuY3Rpb24oaSwgaXRlbSkge1xuICAgICAgICAgICAgICAgICRpbnB1dC5maW5kKCdzZWxlY3QnKS5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtLmxhYmVsXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkaW5wdXQuZmluZCgnc2VsZWN0JykudmFsKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRpbnB1dCA9ICQoXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYi1maWVsZCAnK3RvZ2dsZXJDbGFzcysnXCI+JyArIFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nICsgaGludCArICc8L2Rpdj4nICsgXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5wdXRcIj4nICsgZWwgKyAnPC9kaXY+JyArIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc1RvZ2dsZXJzKSB7XG4gICAgICAgICAgICAkaW5wdXQuYXBwZW5kKCQoJzxkaXYgY2xhc3M9XCJ0b2dnbGUtYnRuXCIgZGF0YS1zZWxlY3Rpb24tdGFyZ2V0PVwiJyArIGhpbnQudG9Mb3dlckNhc2UoKSArICdcIj48L2Rpdj4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGZvcm0uZmluZCgnLmJvZHknKS5hcHBlbmQoJGlucHV0KTtcblxuICAgICAgICAvLyBpZiAodHlwZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW5pdFJlZGFjdG9yKGVsKTtcbiAgICAgICAgLy8gfVxuICAgIH0sXG5cbiAgICBpbml0UmVkYWN0b3I6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSwgZWw7XG4gICAgICAgIGNsYXNzTmFtZSA9ICQoaXRlbSlbMF0uY2xhc3NOYW1lO1xuICAgICAgICBlbCA9IHRoaXMuJGZvcm0uZmluZChcIi5cIiArIGNsYXNzTmFtZSk7XG4gICAgICAgIGVsLnJlZGFjdG9yKHtcbiAgICAgICAgICAgIG1heEhlaWdodDogMTYwLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiAxNTAsXG4gICAgICAgICAgICBtYXhXaWR0aDogJzQwMHB4JyxcbiAgICAgICAgICAgIGJ1dHRvbnM6IFsnYm9sZCcsICdpdGFsaWMnLCAnbGluaycsICdob3Jpem9udGFscnVsZSddLFxuICAgICAgICAgICAgcGx1Z2luczogWydmb250ZmFtaWx5JywgJ2ZvbnRzaXplJywgJ2FsaWdubWVudCcsICdmb250Y29sb3InXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy4kcmVkYWN0b3IgPSBlbC5yZWRhY3RvcignY29yZS5vYmplY3QnKTtcbiAgICB9LFxuXG4gICAgY2FuY2VsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbi5lZGl0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbi4kZWRpdC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvcHRpb24tZW5hYmxlZCcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb24uJHJlc3VsdENvbnRhaW5lci5odG1sKCcnKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uLiR0b2dnbGUuaHRtbCgnRU5BQkxFJyk7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVPcHRpb24oKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNhYmxlT3B0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uLiRlbmFibGVDaGVja2JveCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uLiRlbmFibGVDaGVja2JveC5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5jZWwoKTtcbiAgICB9LFxuXG4gICAgY2xvc2VNb2RhbDogZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG5cbiAgICAgICAgaWYgKGV2KSB7XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLiRjb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci52ZWxvY2l0eSgnZmFkZU91dCcsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogR2FybmlzaC5GWF9EVVJBVElPTlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuJHNoYWRlLnZlbG9jaXR5KCdmYWRlT3V0Jywge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBHYXJuaXNoLkZYX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAkLnByb3h5KHRoaXMsICdvbkZhZGVPdXQnKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmhpZGVPblNoYWRlQ2xpY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHRoaXMuJHNoYWRlLCAnY2xpY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihHYXJuaXNoLiR3aW4sICdyZXNpemUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBHYXJuaXNoLk1vZGFsLnZpc2libGVNb2RhbCA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5oaWRlT25Fc2MpIHtcbiAgICAgICAgICAgIEdhcm5pc2guZXNjTWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdoaWRlJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3Mub25IaWRlKCk7XG4gICAgfSxcblxuICAgIHJ1blZhbGlkYXRpb246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHNlbGY7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuJHZhbGlkYXRpb25JdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuICQuZWFjaCh0aGlzLiR2YWxpZGF0aW9uSXRlbXMsIGZ1bmN0aW9uKGksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQ7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBzZWxmLiRmb3JtLmZpbmQoXCIuXCIgKyBpdGVtLnZhbGlkYXRpb24uaW5wdXRDbGFzcyk7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpLm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS52YWxpZGF0aW9uLnBhc3NlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWxpZGF0aW9uLnBhc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ3JhZnQuY3AuZGlzcGxheU5vdGljZShpdGVtLnZhbGlkYXRpb24uZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzYXZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBzZWxmO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbi4kY29udGFpbmVyLmhhc0NsYXNzKCd0YWdzJykpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tFcnJvcnMoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKHNlbGYuZXJyb3JzLCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBHYXJuaXNoLnNoYWtlKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU9wdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0Vycm9ycygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JMZW5ndGggPT09IHRoaXMuJG1vZGFsSW5wdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQuZWFjaChzZWxmLmVycm9ycywgZnVuY3Rpb24oaSwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJChpdGVtKS5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBHYXJuaXNoLnNoYWtlKHRoaXMuJGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3B0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hlY2tFcnJvcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZjtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgICAgIHRoaXMuZXJyb3JMZW5ndGggPSAwO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLiRtb2RhbElucHV0cywgZnVuY3Rpb24oaSwgaXRlbSkge1xuICAgICAgICAgICAgaWYgKCQoaXRlbSkuaGFzQ2xhc3MoJ2RhdGEtcmVxdWlyZWQnKSkge1xuICAgICAgICAgICAgICAgIGlmICgkKGl0ZW0pLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVycm9yc1tpXSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JMZW5ndGggKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVPcHRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm9wdGlvbi51cGRhdGVIdG1sRnJvbU1vZGFsKCk7XG4gICAgICAgIHRoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICB0aGlzLiRmb3JtWzBdLnJlc2V0KCk7XG5cbiAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZSh0aGlzLm9wdGlvbi4kZGF0YS5zdWNjZXNzTWVzc2FnZSk7XG4gICAgfVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZGV2ZWxvcG1lbnQvanMvbW9kYWwuanMiXSwic291cmNlUm9vdCI6IiJ9