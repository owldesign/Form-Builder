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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ }),

/***/ 14:
/***/ (function(module, exports) {

var LD_Fields = void 0;

LD_Fields = {
    setup: function setup() {}
};

LD_Fields = new (Garnish.Base.extend({
    fields: null,
    options: null,

    init: function init() {
        this.fields = {};
        this.options = {};
    },
    setup: function setup() {
        var self = void 0;
        var FLD = void 0;
        var FLD_init = void 0;
        var FLD_field = void 0;
        var FLD_fieldOptions = void 0;
        self = this;

        if (Craft.FieldLayoutDesigner) {
            FLD = Craft.FieldLayoutDesigner;
            FLD_init = FLD.prototype.init;
            FLD_field = FLD.prototype.initField;
            FLD_fieldOptions = FLD.prototype.onFieldOptionSelect;

            FLD.prototype.init = function () {
                FLD_init.apply(this, arguments);
                this.fieldEditor = new FieldEditor(this);
            };

            FLD.prototype.initField = function ($field) {
                var $preview = void 0;
                var $editBtn = void 0;
                var $html = void 0;
                var $menu = void 0;
                var $ul = void 0;
                var menu = void 0;
                var menuBtn = void 0;

                FLD_field.apply(this, arguments);

                $editBtn = $field.find('.settings');
                menuBtn = $editBtn.data('menubtn');
                menu = menuBtn.menu;
                $menu = menu.$container;
                $ul = $menu.children('ul');
                $html = $('<li><a data-action="fieldoptions">' + Craft.t('Options') + '</a></li>').appendTo($ul);

                $preview = $(['<div class="field-options-preview">', '</div>'].join('')).appendTo($field);

                return menu.addOptions($html.children('a'));
            };

            FLD.prototype.onFieldOptionSelect = function (option) {
                var $field = void 0;
                var $option = void 0;
                var action = void 0;

                FLD_fieldOptions.apply(this, arguments);

                $option = $(option);
                $field = $option.data('menu').$anchor.parent();
                action = $option.data('action');

                switch (action) {
                    case 'fieldoptions':
                        this.trigger('fieldOptionsSelected', {
                            target: $option[0],
                            $target: $option,
                            $field: $field,
                            fld: this,
                            id: $field.data('id') | 0
                        });
                }
            };
        }
    },
    getOptions: function getOptions(layoutId) {
        var options = void 0;
        options = {};

        $.each(this.options, function (key, item) {
            if (parseInt(item.fieldLayoutId) == layoutId) {
                options[item.fieldId] = item.options;
            }
        });

        return options;
    }
}))();

FieldEditor = Garnish.Base.extend({
    fld: null,
    options: null,
    layoutId: null,
    namespace: 'form-builder',

    init: function init(fld) {
        this.fld = fld;
        this.layoutId = LD.getLayoutId();
        this.options = LD_Fields.getOptions(this.layoutId);

        this.fld.on('fieldOptionsSelected', $.proxy(this.openOptionsModal, this));

        if (this.layoutId !== false) {
            this.applyOptions(this.layoutId);
        }
    },
    applyOptions: function applyOptions(layoutId) {
        var _this = this;

        var results = void 0;

        if (this.options) {
            results = [];

            $.each(this.options, function (key, value) {
                if (_this.options.hasOwnProperty(key)) {
                    options = _this.options[key];
                    results.push(_this.setFormData(key, value));
                } else {
                    results.push(void 0);
                }
            });

            return results;
        }
    },
    openOptionsModal: function openOptionsModal(e) {
        var self = void 0;
        var formId = void 0;
        var modal = void 0;
        self = this;
        formId = e.id;

        modal = new FieldOptionsModal(e);
        modal.on('setOptions', function (e) {
            return self.setFormData(formId, e.options);
        });
        modal.show(this.options);
    },
    setFormData: function setFormData(fieldId, options) {
        var self = void 0;
        var $container = void 0;
        var $field = void 0;
        var name = void 0;
        self = this;

        $container = this.fld.$container;
        $field = $container.find('.fld-field[data-id="' + fieldId + '"]:not(".unused")');
        name = this.namespace + '[field][' + fieldId + '][options]';

        $.each(options, function (key, item) {
            if ($field.children('input[name="' + name + '[' + key + ']"]').length > 0) {
                if (item) {
                    $field.children('input[name="' + name + '[' + key + ']"]').val(item);
                    self.updatePreview($field, key, item);
                } else {
                    $field.children('input[name="' + name + '[' + key + ']"]').remove();
                    self.removePreview($field, key, item);
                }
            } else {
                if (item) {
                    self.updatePreview($field, key, item);
                    $('<input type="hidden" name="' + name + '[' + key + ']">').val(item).appendTo($field);
                }
            }
        });
    },
    updatePreview: function updatePreview(field, type, value) {
        body = field.find('.field-options-preview');
        markup = $('<div class="field-' + type + '-preview"><span class="preview-type">' + type + '</span> ' + value + '</div>');
        oldMarkup = body.find('.field-' + type + '-preview');

        if (oldMarkup) {
            oldMarkup.remove();
        }

        markup.appendTo(body);
    },
    removePreview: function removePreview(field, type, value) {
        field.find('.field-' + type + '-preview').remove();
    }
});

FieldOptionsModal = Garnish.Modal.extend({
    field: null,
    $formContainer: null,
    $classInput: null,
    $idInput: null,
    $templateInput: null,

    init: function init(field) {
        var body = void 0;
        this.field = field;
        this.base();

        this.$formContainer = $('<form class="modal fitted formbuilder-modal has-sidebar">').appendTo(Garnish.$bod);
        this.setContainer(this.$formContainer);

        body = $(['<section class="modal-container">', '<div class="modal-sidebar">', '<nav>', '<a href="#" class="modal-nav active" data-target="modal-content-styles"><i class="far fa-magic"></i> <span class="link-text">Styles</span></a>', '<a href="#" class="modal-nav" data-target="modal-content-settings"><i class="far fa-cog"></i> <span class="link-text">Settings</span></a>', '</nav>', '</div>', '<div class="modal-content-container">', '<div class="modal-content modal-content-styles active">', '<header>', '<span class="modal-title">', 'Attributes', '</span>', '<div class="instructions">', 'Custom field attributes', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'CLASS', '</div>', '<input type="text" class="text fullwidth input-class">', '</div>', '<div class="fb-field">', '<div class="input-hint">', 'ID', '</div>', '<input type="text" class="text fullwidth input-id">', '</div>', '</div>', '</div>', '<div class="modal-content modal-content-settings">', '<header>', '<span class="modal-title">', 'Settings', '</span>', '<div class="instructions">', 'Custom field settings', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'TEMPLATE', '</div>', '<input type="text" class="text fullwidth input-template">', '</div>', '</div>', '</div>', '</div>', '</section>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$formContainer);

        this.$classInput = body.find('.input-class');
        this.$idInput = body.find('.input-id');
        this.$templateInput = body.find('.input-template');

        this.$navLink = body.find('.modal-nav');
        this.$cancelBtn = body.find('.cancel');

        this.loadModalValues();

        this.addListener(this.$cancelBtn, 'click', 'hide');
        this.addListener(this.$navLink, 'click', 'toggleModalContent');
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit');
    },
    loadModalValues: function loadModalValues() {
        $classInput = $('input[name="form-builder[field][' + this.field.id + '][options][class]"]').val();
        $idInput = $('input[name="form-builder[field][' + this.field.id + '][options][id]"]').val();
        $templateInput = $('input[name="form-builder[field][' + this.field.id + '][options][template]"]').val();

        if ($classInput) {
            this.$formContainer.find('.input-class').val($classInput);
        }

        if ($idInput) {
            this.$formContainer.find('.input-id').val($idInput);
        }

        if ($templateInput) {
            this.$formContainer.find('.input-template').val($templateInput);
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
        e.preventDefault();

        if (!this.visible) {
            return;
        }

        this.trigger('setOptions', {
            options: {
                "class": this.$classInput.val(),
                id: this.$idInput.val(),
                template: this.$templateInput.val()
            }
        });

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
        var self = void 0;
        var values = void 0;
        self = this;

        if (options.length > 0) {
            values = JSON.parse(options[this.field.id]);

            $.each(values, function (key, value) {
                if (key == 'class' && value) {
                    self.$classInput.val(value);
                }

                if (key == 'id' && value) {
                    self.$idInput.val(value);
                }
            });

            if (!Garnish.isMobileBrowser()) {
                setTimeout($.proxy(function () {
                    this.$classInput.focus();
                }));
            }
        }

        this.base();
    }
});

window.LD_Fields = LD_Fields;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZmllbGQtZGVzaWduZXIuanMiXSwibmFtZXMiOlsiTERfRmllbGRzIiwic2V0dXAiLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsImZpZWxkcyIsIm9wdGlvbnMiLCJpbml0Iiwic2VsZiIsIkZMRCIsIkZMRF9pbml0IiwiRkxEX2ZpZWxkIiwiRkxEX2ZpZWxkT3B0aW9ucyIsIkNyYWZ0IiwiRmllbGRMYXlvdXREZXNpZ25lciIsInByb3RvdHlwZSIsImluaXRGaWVsZCIsIm9uRmllbGRPcHRpb25TZWxlY3QiLCJhcHBseSIsImFyZ3VtZW50cyIsImZpZWxkRWRpdG9yIiwiRmllbGRFZGl0b3IiLCIkZmllbGQiLCIkcHJldmlldyIsIiRlZGl0QnRuIiwiJGh0bWwiLCIkbWVudSIsIiR1bCIsIm1lbnUiLCJtZW51QnRuIiwiZmluZCIsImRhdGEiLCIkY29udGFpbmVyIiwiY2hpbGRyZW4iLCIkIiwidCIsImFwcGVuZFRvIiwiam9pbiIsImFkZE9wdGlvbnMiLCJvcHRpb24iLCIkb3B0aW9uIiwiYWN0aW9uIiwiJGFuY2hvciIsInBhcmVudCIsInRyaWdnZXIiLCJ0YXJnZXQiLCIkdGFyZ2V0IiwiZmxkIiwiaWQiLCJnZXRPcHRpb25zIiwibGF5b3V0SWQiLCJlYWNoIiwia2V5IiwiaXRlbSIsInBhcnNlSW50IiwiZmllbGRMYXlvdXRJZCIsImZpZWxkSWQiLCJuYW1lc3BhY2UiLCJMRCIsImdldExheW91dElkIiwib24iLCJwcm94eSIsIm9wZW5PcHRpb25zTW9kYWwiLCJhcHBseU9wdGlvbnMiLCJyZXN1bHRzIiwidmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJzZXRGb3JtRGF0YSIsImUiLCJmb3JtSWQiLCJtb2RhbCIsIkZpZWxkT3B0aW9uc01vZGFsIiwic2hvdyIsIm5hbWUiLCJsZW5ndGgiLCJ2YWwiLCJ1cGRhdGVQcmV2aWV3IiwicmVtb3ZlIiwicmVtb3ZlUHJldmlldyIsImZpZWxkIiwidHlwZSIsImJvZHkiLCJtYXJrdXAiLCJvbGRNYXJrdXAiLCJNb2RhbCIsIiRmb3JtQ29udGFpbmVyIiwiJGNsYXNzSW5wdXQiLCIkaWRJbnB1dCIsIiR0ZW1wbGF0ZUlucHV0IiwiYmFzZSIsIiRib2QiLCJzZXRDb250YWluZXIiLCIkbmF2TGluayIsIiRjYW5jZWxCdG4iLCJsb2FkTW9kYWxWYWx1ZXMiLCJhZGRMaXN0ZW5lciIsInRvZ2dsZU1vZGFsQ29udGVudCIsInByZXZlbnREZWZhdWx0IiwibGluayIsImhlaWdodCIsImN1cnJlbnRUYXJnZXQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwidmVsb2NpdHkiLCJjc3MiLCJtaW5IZWlnaHQiLCJvbkZvcm1TdWJtaXQiLCJ2aXNpYmxlIiwidGVtcGxhdGUiLCJoaWRlIiwib25GYWRlT3V0IiwiZGVzdHJveSIsIiRzaGFkZSIsInZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImlzTW9iaWxlQnJvd3NlciIsInNldFRpbWVvdXQiLCJmb2N1cyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBLElBQUlBLGtCQUFKOztBQUVBQSxZQUFZO0FBQ1JDLFNBRFEsbUJBQ0EsQ0FB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LEtBbEpvQztBQW9KckNBLFdBcEpxQyxxQkFvSjNCO0FBQ04sYUFBS3RCLElBQUw7QUFDQSxhQUFLMUQsVUFBTCxDQUFnQjhDLE1BQWhCO0FBQ0EsYUFBS21DLE1BQUwsQ0FBWW5DLE1BQVo7QUFDSCxLQXhKb0M7QUEwSnJDTCxRQTFKcUMsZ0JBMEpoQ25FLE9BMUpnQyxFQTBKdkI7QUFDVixZQUFJRSxhQUFKO0FBQ0EsWUFBSTBHLGVBQUo7QUFDQTFHLGVBQU8sSUFBUDs7QUFFQSxZQUFJRixRQUFRcUUsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUNwQnVDLHFCQUFTQyxLQUFLQyxLQUFMLENBQVc5RyxRQUFRLEtBQUswRSxLQUFMLENBQVdoQyxFQUFuQixDQUFYLENBQVQ7O0FBRUFkLGNBQUVpQixJQUFGLENBQU8rRCxNQUFQLEVBQWUsVUFBQzlELEdBQUQsRUFBTWEsS0FBTixFQUFnQjtBQUMzQixvQkFBSWIsT0FBTyxPQUFQLElBQWtCYSxLQUF0QixFQUE2QjtBQUN6QnpELHlCQUFLK0UsV0FBTCxDQUFpQlgsR0FBakIsQ0FBcUJYLEtBQXJCO0FBQ0g7O0FBRUQsb0JBQUliLE9BQU8sSUFBUCxJQUFlYSxLQUFuQixFQUEwQjtBQUN0QnpELHlCQUFLZ0YsUUFBTCxDQUFjWixHQUFkLENBQWtCWCxLQUFsQjtBQUNIO0FBQ0osYUFSRDs7QUFVQSxnQkFBSSxDQUFDL0QsUUFBUW1ILGVBQVIsRUFBTCxFQUFnQztBQUM1QkMsMkJBQVdwRixFQUFFMkIsS0FBRixDQUFTLFlBQVc7QUFDM0IseUJBQUswQixXQUFMLENBQWlCZ0MsS0FBakI7QUFDSCxpQkFGVSxDQUFYO0FBR0g7QUFDSjs7QUFFRCxhQUFLN0IsSUFBTDtBQUNIO0FBcExvQyxDQUFyQixDQUFwQjs7QUF3TEE4QixPQUFPeEgsU0FBUCxHQUFtQkEsU0FBbkIsQyIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL2ZpZWxkLWRlc2lnbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGE0ZmY3Nzc4NDY0MjkxN2FhMWIzIiwibGV0IExEX0ZpZWxkc1xuXG5MRF9GaWVsZHMgPSB7XG4gICAgc2V0dXAoKSB7fVxufVxuXG5MRF9GaWVsZHMgPSBuZXcgKEdhcm5pc2guQmFzZS5leHRlbmQoe1xuICAgIGZpZWxkczogbnVsbCxcbiAgICBvcHRpb25zOiBudWxsLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5maWVsZHMgPSB7fVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7fVxuICAgIH0sXG5cbiAgICBzZXR1cCgpIHtcbiAgICAgICAgbGV0IHNlbGZcbiAgICAgICAgbGV0IEZMRFxuICAgICAgICBsZXQgRkxEX2luaXRcbiAgICAgICAgbGV0IEZMRF9maWVsZFxuICAgICAgICBsZXQgRkxEX2ZpZWxkT3B0aW9uc1xuICAgICAgICBzZWxmID0gdGhpc1xuXG4gICAgICAgIGlmIChDcmFmdC5GaWVsZExheW91dERlc2lnbmVyKSB7XG4gICAgICAgICAgICBGTEQgPSBDcmFmdC5GaWVsZExheW91dERlc2lnbmVyXG4gICAgICAgICAgICBGTERfaW5pdCA9IEZMRC5wcm90b3R5cGUuaW5pdFxuICAgICAgICAgICAgRkxEX2ZpZWxkID0gRkxELnByb3RvdHlwZS5pbml0RmllbGRcbiAgICAgICAgICAgIEZMRF9maWVsZE9wdGlvbnMgPSBGTEQucHJvdG90eXBlLm9uRmllbGRPcHRpb25TZWxlY3RcblxuICAgICAgICAgICAgRkxELnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgRkxEX2luaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgIHRoaXMuZmllbGRFZGl0b3IgPSBuZXcgRmllbGRFZGl0b3IodGhpcylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRkxELnByb3RvdHlwZS5pbml0RmllbGQgPSBmdW5jdGlvbigkZmllbGQpIHtcbiAgICAgICAgICAgICAgICBsZXQgJHByZXZpZXdcbiAgICAgICAgICAgICAgICBsZXQgJGVkaXRCdG5cbiAgICAgICAgICAgICAgICBsZXQgJGh0bWxcbiAgICAgICAgICAgICAgICBsZXQgJG1lbnVcbiAgICAgICAgICAgICAgICBsZXQgJHVsXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVcbiAgICAgICAgICAgICAgICBsZXQgbWVudUJ0blxuXG4gICAgICAgICAgICAgICAgRkxEX2ZpZWxkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcblxuICAgICAgICAgICAgICAgICRlZGl0QnRuID0gJGZpZWxkLmZpbmQoJy5zZXR0aW5ncycpXG4gICAgICAgICAgICAgICAgbWVudUJ0biA9ICRlZGl0QnRuLmRhdGEoJ21lbnVidG4nKVxuICAgICAgICAgICAgICAgIG1lbnUgPSBtZW51QnRuLm1lbnVcbiAgICAgICAgICAgICAgICAkbWVudSA9IG1lbnUuJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICR1bCA9ICRtZW51LmNoaWxkcmVuKCd1bCcpXG4gICAgICAgICAgICAgICAgJGh0bWwgPSAkKCc8bGk+PGEgZGF0YS1hY3Rpb249XCJmaWVsZG9wdGlvbnNcIj4nICsgQ3JhZnQudCgnT3B0aW9ucycpICsgJzwvYT48L2xpPicpLmFwcGVuZFRvKCR1bClcblxuICAgICAgICAgICAgICAgICRwcmV2aWV3ID0gJChbXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmllbGQtb3B0aW9ucy1wcmV2aWV3XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpKS5hcHBlbmRUbygkZmllbGQpXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWVudS5hZGRPcHRpb25zKCRodG1sLmNoaWxkcmVuKCdhJykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEZMRC5wcm90b3R5cGUub25GaWVsZE9wdGlvblNlbGVjdCA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCAkZmllbGRcbiAgICAgICAgICAgICAgICBsZXQgJG9wdGlvblxuICAgICAgICAgICAgICAgIGxldCBhY3Rpb25cblxuICAgICAgICAgICAgICAgIEZMRF9maWVsZE9wdGlvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuXG4gICAgICAgICAgICAgICAgJG9wdGlvbiA9ICQob3B0aW9uKVxuICAgICAgICAgICAgICAgICRmaWVsZCA9ICRvcHRpb24uZGF0YSgnbWVudScpLiRhbmNob3IucGFyZW50KClcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAkb3B0aW9uLmRhdGEoJ2FjdGlvbicpXG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdmaWVsZG9wdGlvbnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdmaWVsZE9wdGlvbnNTZWxlY3RlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICRvcHRpb25bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldDogJG9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmllbGQ6ICRmaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGQ6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICRmaWVsZC5kYXRhKCdpZCcpIHwgMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0T3B0aW9ucyhsYXlvdXRJZCkge1xuICAgICAgICBsZXQgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICAkLmVhY2godGhpcy5vcHRpb25zLCAoa2V5LCBpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoaXRlbS5maWVsZExheW91dElkKSA9PSBsYXlvdXRJZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbaXRlbS5maWVsZElkXSA9IGl0ZW0ub3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zXG4gICAgfVxufSkpXG5cbkZpZWxkRWRpdG9yID0gR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgZmxkOiBudWxsLFxuICAgIG9wdGlvbnM6IG51bGwsXG4gICAgbGF5b3V0SWQ6IG51bGwsXG4gICAgbmFtZXNwYWNlOiAnZm9ybS1idWlsZGVyJyxcblxuICAgIGluaXQoZmxkKSB7XG4gICAgICAgIHRoaXMuZmxkID0gZmxkXG4gICAgICAgIHRoaXMubGF5b3V0SWQgPSBMRC5nZXRMYXlvdXRJZCgpXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IExEX0ZpZWxkcy5nZXRPcHRpb25zKHRoaXMubGF5b3V0SWQpXG5cbiAgICAgICAgdGhpcy5mbGQub24oJ2ZpZWxkT3B0aW9uc1NlbGVjdGVkJywgJC5wcm94eSh0aGlzLm9wZW5PcHRpb25zTW9kYWwsIHRoaXMpKVxuXG4gICAgICAgIGlmICh0aGlzLmxheW91dElkICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5hcHBseU9wdGlvbnModGhpcy5sYXlvdXRJZClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhcHBseU9wdGlvbnMobGF5b3V0SWQpIHtcbiAgICAgICAgbGV0IHJlc3VsdHNcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICByZXN1bHRzID0gW11cblxuICAgICAgICAgICAgJC5lYWNoKHRoaXMub3B0aW9ucywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1trZXldXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNldEZvcm1EYXRhKGtleSwgdmFsdWUpKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIG9wZW5PcHRpb25zTW9kYWwoZSkge1xuICAgICAgICBsZXQgc2VsZlxuICAgICAgICBsZXQgZm9ybUlkXG4gICAgICAgIGxldCBtb2RhbFxuICAgICAgICBzZWxmID0gdGhpc1xuICAgICAgICBmb3JtSWQgPSBlLmlkXG5cbiAgICAgICAgbW9kYWwgPSBuZXcgRmllbGRPcHRpb25zTW9kYWwoZSlcbiAgICAgICAgbW9kYWwub24oJ3NldE9wdGlvbnMnLCBlID0+IHNlbGYuc2V0Rm9ybURhdGEoZm9ybUlkLCBlLm9wdGlvbnMpKVxuICAgICAgICBtb2RhbC5zaG93KHRoaXMub3B0aW9ucylcbiAgICB9LFxuXG4gICAgc2V0Rm9ybURhdGEoZmllbGRJZCwgb3B0aW9ucykge1xuICAgICAgICBsZXQgc2VsZlxuICAgICAgICBsZXQgJGNvbnRhaW5lclxuICAgICAgICBsZXQgJGZpZWxkXG4gICAgICAgIGxldCBuYW1lXG4gICAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgJGNvbnRhaW5lciA9IHRoaXMuZmxkLiRjb250YWluZXJcbiAgICAgICAgJGZpZWxkID0gJGNvbnRhaW5lci5maW5kKCcuZmxkLWZpZWxkW2RhdGEtaWQ9XCInICsgZmllbGRJZCArICdcIl06bm90KFwiLnVudXNlZFwiKScpXG4gICAgICAgIG5hbWUgPSB0aGlzLm5hbWVzcGFjZSArICdbZmllbGRdWycgKyBmaWVsZElkICsgJ11bb3B0aW9uc10nXG5cbiAgICAgICAgJC5lYWNoKG9wdGlvbnMsIChrZXksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICgkZmllbGQuY2hpbGRyZW4oYGlucHV0W25hbWU9XCIke25hbWV9WyR7a2V5fV1cIl1gKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgJGZpZWxkLmNoaWxkcmVuKGBpbnB1dFtuYW1lPVwiJHtuYW1lfVske2tleX1dXCJdYCkudmFsKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlUHJldmlldygkZmllbGQsIGtleSwgaXRlbSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkZmllbGQuY2hpbGRyZW4oYGlucHV0W25hbWU9XCIke25hbWV9WyR7a2V5fV1cIl1gKS5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZVByZXZpZXcoJGZpZWxkLCBrZXksIGl0ZW0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZVByZXZpZXcoJGZpZWxkLCBrZXksIGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICQoYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7bmFtZX1bJHtrZXl9XVwiPmApLnZhbChpdGVtKS5hcHBlbmRUbygkZmllbGQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICB1cGRhdGVQcmV2aWV3KGZpZWxkLCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBib2R5ID0gZmllbGQuZmluZCgnLmZpZWxkLW9wdGlvbnMtcHJldmlldycpXG4gICAgICAgIG1hcmt1cCA9ICQoJzxkaXYgY2xhc3M9XCJmaWVsZC0nKyB0eXBlICsnLXByZXZpZXdcIj48c3BhbiBjbGFzcz1cInByZXZpZXctdHlwZVwiPicrIHR5cGUgKyc8L3NwYW4+ICcrdmFsdWUrJzwvZGl2PicpXG4gICAgICAgIG9sZE1hcmt1cCA9IGJvZHkuZmluZCgnLmZpZWxkLScrIHR5cGUgKyctcHJldmlldycpXG5cbiAgICAgICAgaWYgKG9sZE1hcmt1cCkge1xuICAgICAgICAgICAgb2xkTWFya3VwLnJlbW92ZSgpXG4gICAgICAgIH1cblxuICAgICAgICBtYXJrdXAuYXBwZW5kVG8oYm9keSlcbiAgICB9LFxuXG4gICAgcmVtb3ZlUHJldmlldyhmaWVsZCwgdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgZmllbGQuZmluZCgnLmZpZWxkLScrdHlwZSsnLXByZXZpZXcnKS5yZW1vdmUoKVxuICAgIH1cbn0pXG5cbkZpZWxkT3B0aW9uc01vZGFsID0gR2FybmlzaC5Nb2RhbC5leHRlbmQoe1xuICAgIGZpZWxkOiBudWxsLFxuICAgICRmb3JtQ29udGFpbmVyOiBudWxsLFxuICAgICRjbGFzc0lucHV0OiBudWxsLFxuICAgICRpZElucHV0OiBudWxsLFxuICAgICR0ZW1wbGF0ZUlucHV0OiBudWxsLFxuXG4gICAgaW5pdChmaWVsZCkge1xuICAgICAgICBsZXQgYm9keVxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGRcbiAgICAgICAgdGhpcy5iYXNlKClcblxuICAgICAgICB0aGlzLiRmb3JtQ29udGFpbmVyID0gJCgnPGZvcm0gY2xhc3M9XCJtb2RhbCBmaXR0ZWQgZm9ybWJ1aWxkZXItbW9kYWwgaGFzLXNpZGViYXJcIj4nKS5hcHBlbmRUbyhHYXJuaXNoLiRib2QpXG4gICAgICAgIHRoaXMuc2V0Q29udGFpbmVyKHRoaXMuJGZvcm1Db250YWluZXIpXG5cbiAgICAgICAgYm9keSA9ICQoW1xuICAgICAgICAgICAgJzxzZWN0aW9uIGNsYXNzPVwibW9kYWwtY29udGFpbmVyXCI+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsLXNpZGViYXJcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxuYXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cIm1vZGFsLW5hdiBhY3RpdmVcIiBkYXRhLXRhcmdldD1cIm1vZGFsLWNvbnRlbnQtc3R5bGVzXCI+PGkgY2xhc3M9XCJmYXIgZmEtbWFnaWNcIj48L2k+IDxzcGFuIGNsYXNzPVwibGluay10ZXh0XCI+U3R5bGVzPC9zcGFuPjwvYT4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGNsYXNzPVwibW9kYWwtbmF2XCIgZGF0YS10YXJnZXQ9XCJtb2RhbC1jb250ZW50LXNldHRpbmdzXCI+PGkgY2xhc3M9XCJmYXIgZmEtY29nXCI+PC9pPiA8c3BhbiBjbGFzcz1cImxpbmstdGV4dFwiPlNldHRpbmdzPC9zcGFuPjwvYT4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzwvbmF2PicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQtY29udGFpbmVyXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBtb2RhbC1jb250ZW50LXN0eWxlcyBhY3RpdmVcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+JywgJ0F0dHJpYnV0ZXMnLCAnPC9zcGFuPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5zdHJ1Y3Rpb25zXCI+JywgJ0N1c3RvbSBmaWVsZCBhdHRyaWJ1dGVzJywgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvaGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib2R5XCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYi1maWVsZFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDTEFTUycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHQgZnVsbHdpZHRoIGlucHV0LWNsYXNzXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmItZmllbGRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnB1dC1oaW50XCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnSUQnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0IGZ1bGx3aWR0aCBpbnB1dC1pZFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCBtb2RhbC1jb250ZW50LXNldHRpbmdzXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGhlYWRlcj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJtb2RhbC10aXRsZVwiPicsICdTZXR0aW5ncycsICc8L3NwYW4+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnN0cnVjdGlvbnNcIj4nLCAnQ3VzdG9tIGZpZWxkIHNldHRpbmdzJywgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvaGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib2R5XCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYi1maWVsZFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdURU1QTEFURScsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHQgZnVsbHdpZHRoIGlucHV0LXRlbXBsYXRlXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L3NlY3Rpb24+JyxcbiAgICAgICAgICAgICc8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+JywgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidXR0b25zXCI+JywgXG4gICAgICAgICAgICAgICAgICAgIGA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRucyBidG4tbW9kYWwgY2FuY2VsXCIgdmFsdWU9XCIke0NyYWZ0LnQoJ0NhbmNlbCcpfVwiPmAsIFxuICAgICAgICAgICAgICAgICAgICBgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIHN1Ym1pdFwiIHZhbHVlPVwiJHtDcmFmdC50KCdTYXZlJyl9XCI+YCwgXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzwvZm9vdGVyPidcbiAgICAgICAgXS5qb2luKCcnKSkuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy4kY2xhc3NJbnB1dCA9IGJvZHkuZmluZCgnLmlucHV0LWNsYXNzJylcbiAgICAgICAgdGhpcy4kaWRJbnB1dCA9IGJvZHkuZmluZCgnLmlucHV0LWlkJylcbiAgICAgICAgdGhpcy4kdGVtcGxhdGVJbnB1dCA9IGJvZHkuZmluZCgnLmlucHV0LXRlbXBsYXRlJylcblxuICAgICAgICB0aGlzLiRuYXZMaW5rID0gYm9keS5maW5kKCcubW9kYWwtbmF2JylcbiAgICAgICAgdGhpcy4kY2FuY2VsQnRuID0gYm9keS5maW5kKCcuY2FuY2VsJylcblxuICAgICAgICB0aGlzLmxvYWRNb2RhbFZhbHVlcygpXG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRjYW5jZWxCdG4sICdjbGljaycsICdoaWRlJylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRuYXZMaW5rLCAnY2xpY2snLCAndG9nZ2xlTW9kYWxDb250ZW50JylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRmb3JtQ29udGFpbmVyLCAnc3VibWl0JywgJ29uRm9ybVN1Ym1pdCcpXG4gICAgfSxcblxuICAgIGxvYWRNb2RhbFZhbHVlcygpIHtcbiAgICAgICAgJGNsYXNzSW5wdXQgPSAkKCdpbnB1dFtuYW1lPVwiZm9ybS1idWlsZGVyW2ZpZWxkXVsnKyB0aGlzLmZpZWxkLmlkICsnXVtvcHRpb25zXVtjbGFzc11cIl0nKS52YWwoKVxuICAgICAgICAkaWRJbnB1dCA9ICQoJ2lucHV0W25hbWU9XCJmb3JtLWJ1aWxkZXJbZmllbGRdWycrIHRoaXMuZmllbGQuaWQgKyddW29wdGlvbnNdW2lkXVwiXScpLnZhbCgpXG4gICAgICAgICR0ZW1wbGF0ZUlucHV0ID0gJCgnaW5wdXRbbmFtZT1cImZvcm0tYnVpbGRlcltmaWVsZF1bJysgdGhpcy5maWVsZC5pZCArJ11bb3B0aW9uc11bdGVtcGxhdGVdXCJdJykudmFsKClcblxuICAgICAgICBpZiAoJGNsYXNzSW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Db250YWluZXIuZmluZCgnLmlucHV0LWNsYXNzJykudmFsKCRjbGFzc0lucHV0KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRpZElucHV0KSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtQ29udGFpbmVyLmZpbmQoJy5pbnB1dC1pZCcpLnZhbCgkaWRJbnB1dClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGVtcGxhdGVJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy4kZm9ybUNvbnRhaW5lci5maW5kKCcuaW5wdXQtdGVtcGxhdGUnKS52YWwoJHRlbXBsYXRlSW5wdXQpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlTW9kYWxDb250ZW50KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGxldCB0YXJnZXRcbiAgICAgICAgbGV0IGxpbmtcbiAgICAgICAgbGV0IGhlaWdodFxuXG4gICAgICAgIGxpbmsgPSAkKGUuY3VycmVudFRhcmdldClcbiAgICAgICAgdGFyZ2V0ID0gbGluay5kYXRhKCd0YXJnZXQnKVxuICAgICAgICBoZWlnaHQgPSAkKCcuJyt0YXJnZXQpLmhlaWdodCgpICsgNTNcblxuICAgICAgICAkKCcubW9kYWwtbmF2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJy5tb2RhbC1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAgICAgbGluay5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnLicrdGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJylcblxuICAgICAgICB0aGlzLiRjb250YWluZXIudmVsb2NpdHkoJ3N0b3AnKVxuICAgICAgICB0aGlzLiRjb250YWluZXIudmVsb2NpdHkoe2hlaWdodDogaGVpZ2h0fSwgJ2Zhc3QnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICdhdXRvJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgb25Gb3JtU3VibWl0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzZXRPcHRpb25zJywge1xuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogdGhpcy4kY2xhc3NJbnB1dC52YWwoKSxcbiAgICAgICAgICAgICAgICBpZDogdGhpcy4kaWRJbnB1dC52YWwoKSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGhpcy4kdGVtcGxhdGVJbnB1dC52YWwoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgfSxcblxuICAgIG9uRmFkZU91dCgpIHtcbiAgICAgICAgdGhpcy5iYXNlKClcbiAgICAgICAgdGhpcy5kZXN0cm95KClcbiAgICB9LFxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5iYXNlKClcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuJHNoYWRlLnJlbW92ZSgpXG4gICAgfSxcblxuICAgIHNob3cob3B0aW9ucykge1xuICAgICAgICBsZXQgc2VsZlxuICAgICAgICBsZXQgdmFsdWVzXG4gICAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFsdWVzID0gSlNPTi5wYXJzZShvcHRpb25zW3RoaXMuZmllbGQuaWRdKVxuXG4gICAgICAgICAgICAkLmVhY2godmFsdWVzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gJ2NsYXNzJyAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRjbGFzc0lucHV0LnZhbCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09ICdpZCcgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kaWRJbnB1dC52YWwodmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKCFHYXJuaXNoLmlzTW9iaWxlQnJvd3NlcigpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgkLnByb3h5KChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kY2xhc3NJbnB1dC5mb2N1cygpXG4gICAgICAgICAgICAgICAgfSkpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJhc2UoKVxuICAgIH1cblxufSlcblxud2luZG93LkxEX0ZpZWxkcyA9IExEX0ZpZWxkc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL2ZpZWxkLWRlc2lnbmVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==