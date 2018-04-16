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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ }),

/***/ 16:
/***/ (function(module, exports) {

var LD_Tabs = void 0;

LD_Tabs = {
    setup: function setup() {}
};

LD_Tabs = new (Garnish.Base.extend({
    tabs: null,
    options: null,

    init: function init() {
        this.tabs = {};
        this.options = {};
    },
    setup: function setup() {
        var self = void 0;
        var FLD = void 0;
        var FLD_tab = void 0;
        var FLD_addTab = void 0;
        var FLD_tabOptions = void 0;
        self = this;

        if (Craft.FieldLayoutDesigner) {
            FLD = Craft.FieldLayoutDesigner;
            FLD_init = FLD.prototype.init;
            FLD_tab = FLD.prototype.initTab;
            FLD_addTab = FLD.prototype.addTab;
            FLD_tabOptions = FLD.prototype.onFieldOptionSelect;

            FLD.prototype.init = function () {
                FLD_init.apply(this, arguments);
                this.tabEditor = new TabEditor(this);
            };

            FLD.prototype.initTab = function ($tab) {
                var $tabEl = void 0;
                var $preview = void 0;
                var $editBtn = void 0;
                var $html = void 0;
                var $menu = void 0;
                var $ul = void 0;
                var tabId = void 0;
                var menu = void 0;
                var menuBtn = void 0;

                FLD_tab.apply(this, arguments);

                tabId = $tab.find('.tab').data('id');

                if (tabId) {
                    $editBtn = $tab.find('.tabs .settings');
                    menuBtn = $editBtn.data('menubtn');
                    menu = menuBtn.menu;
                    $menu = menu.$container;
                    $ul = $menu.children('ul');
                    $html = $('<li><a data-action="taboptions">' + Craft.t('Options') + '</a></li>').appendTo($ul);
                    console.log();

                    $preview = $(['<div class="field-options-preview">', '</div>'].join('')).appendTo($tab.find('.tabs'));

                    return menu.addOptions($html.children('a'));
                }
            }, FLD.prototype.onTabOptionSelect = function (option) {
                var $tab = void 0;
                var $option = void 0;
                var tabId = void 0;
                var action = void 0;

                FLD_tabOptions.apply(this, arguments);

                $option = $(option);
                $tab = $option.data('menu').$anchor.parent().parent().parent();
                action = $option.data('action');
                tabId = $tab.find('.tab').data('id');

                switch (action) {
                    case 'rename':
                        {
                            this.renameTab($tab);
                            this.trigger('tabRenamed', {
                                tabId: tabId
                            });
                            break;
                        }
                    case 'delete':
                        {
                            this.deleteTab($tab);
                            break;
                        }
                    case 'taboptions':
                        this.trigger('tabOptionsSelected', {
                            target: $option[0],
                            $target: $option,
                            $tab: $tab,
                            fld: this,
                            tabId: tabId
                        });
                        break;
                }
            };

            FLD.prototype.addTab = function () {
                return self.addTab(this);
            };
        }
    },
    addTab: function addTab(e) {
        if (!e.settings.customizableTabs) {
            return;
        }

        var $tab = $('<div class="fld-tab">' + '<div class="tabs">' + '<div class="tab sel draggable">' + '<span>Fieldset ' + (e.tabGrid.$items.length + 1) + '</span>' + '<a class="settings icon" title="' + Craft.t('Rename') + '"></a>' + '</div>' + '</div>' + '<div class="fld-tabcontent"></div>' + '</div>').appendTo(e.$tabContainer);

        e.tabGrid.addItems($tab);
        e.tabDrag.addItems($tab);

        e.initTab($tab);
    },
    getOptions: function getOptions(layoutId) {
        var options = void 0;
        options = {};

        $.each(this.options, function (key, item) {
            if (parseInt(item.layoutId) == layoutId) {
                options[item.tabId] = item.options;
            }
        });

        return options;
    }
}))();

TabEditor = Garnish.Base.extend({
    fld: null,
    options: null,
    layoutId: null,
    namespace: 'form-builder',

    init: function init(fld) {
        this.fld = fld;
        this.layoutId = LD.getLayoutId();
        this.options = LD_Tabs.getOptions(this.layoutId);

        this.fld.on('tabOptionsSelected', $.proxy(this.openOptionsModal, this));
        this.fld.on('tabRenamed', $.proxy(this.onTabRenamed, this));

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
                    options = JSON.parse(_this.options[key]);
                    results.push(_this.setFormData(key, JSON.parse(value)));
                } else {
                    results.push(void 0);
                }
            });

            return results;
        }
    },
    onTabRenamed: function onTabRenamed(e) {
        $tab = $('.tab-id-' + e.tabId);
        $input = $tab.parent().find('.tab-name-field');
        $labelSpan = $tab.find('span');
        tabName = $labelSpan.text();

        $input.val(tabName);
    },
    openOptionsModal: function openOptionsModal(e) {
        var self = void 0;
        self = this;
        var modal = void 0;
        var tabId = void 0;
        var $tab = e.$tab;
        var $labelSpan = void 0;

        $labelSpan = $tab.find('.tabs .tab span');
        tabName = $labelSpan.text();
        tabId = e.tabId;

        modal = new TabOptionsModal($tab);
        modal.on('setOptions', function (e) {
            return self.setFormData(tabId, e.options, tabName);
        });
        modal.show(this.options);
    },
    setFormData: function setFormData(tabId, options, tabName) {
        var self = void 0;
        var $container = void 0;
        var name = void 0;
        self = this;

        $container = $('[data-id="' + tabId + '"]').parent();
        name = this.namespace + '[tab][' + tabId + '][options]';

        $.each(options, function (key, item) {
            if ($container.children('input[name="' + name + '[' + key + ']"]').length > 0) {
                if (item) {
                    $container.children('input[name="' + name + '[' + key + ']"]').val(item);
                    self.updatePreview(tabId, $container, key, item);
                } else {
                    $container.children('input[name="' + name + '[' + key + ']"]').remove();
                    self.removePreview(tabId, $container, key, item);
                }
            } else {
                if (item) {
                    self.updatePreview(tabId, $container, key, item);
                    $('<input type="hidden" name="' + name + '[' + key + ']">').val(item).appendTo($container);
                }
            }
        });

        $container.find('.tab-name-field').val(tabName);
    },
    updatePreview: function updatePreview(tabId, tab, type, value) {
        target = $('[data-id="' + tabId + '"]').parent();
        body = target.find('.field-options-preview');
        markup = $('<div class="field-' + type + '-preview"><span class="preview-type">' + type + '</span> ' + value + '</div>');
        oldMarkup = body.find('.field-' + type + '-preview');

        if (oldMarkup) {
            oldMarkup.remove();
        }

        markup.appendTo(body);
    },
    removePreview: function removePreview(tabId, tab, type, value) {
        target = $('[data-id="' + tabId + '"]').parent();
        target.find('.field-' + type + '-preview').remove();
    }
});

TabOptionsModal = Garnish.Modal.extend({
    tab: null,
    form: null,
    $formContainer: null,

    init: function init(tab) {
        var body = void 0;
        this.tab = tab;
        this.base();
        this.$formContainer = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$formContainer);
        body = $(['<header>', '<span class="modal-title">', 'Attributes', '</span>', '<div class="instructions">', 'Custom tab attributes', '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">', 'CLASS', '</div>', '<input type="text" class="text fullwidth input-class">', '</div>', '<div class="fb-field">', '<div class="input-hint">', 'ID', '</div>', '<input type="text" class="text fullwidth input-id">', '</div>', '</div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$formContainer);

        this.$inputClass = body.find('.input-class');
        this.$inputId = body.find('.input-id');

        this.$cancelBtn = body.find('.cancel');

        this.loadModalValues();

        this.addListener(this.$cancelBtn, 'click', 'hide');
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit');
    },
    loadModalValues: function loadModalValues() {
        tabId = this.tab.find('.tab').data('id');
        $classInput = $('input[name="form-builder[tab][' + tabId + '][options][class]"]').val();
        $idInput = $('input[name="form-builder[tab][' + tabId + '][options][id]"]').val();

        if ($classInput) {
            this.$formContainer.find('.input-class').val($classInput);
        }

        if ($idInput) {
            this.$formContainer.find('.input-id').val($idInput);
        }
    },
    onFormSubmit: function onFormSubmit(e) {
        e.preventDefault();

        if (!this.visible) {
            return;
        }

        this.trigger('setOptions', {
            options: {
                "class": this.$inputClass.val(),
                id: this.$inputId.val()
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

        if (options.length > 0) {
            values = JSON.parse(options[this.tab.name]);
        }

        $.each(values, function (key, value) {
            if (key === 'class' && value) {
                self.$inputClass.val(value);
            }

            if (key === 'id' && value) {
                self.$inputId.val(value);
            }
        });

        if (!Garnish.isMobileBrowser()) {
            setTimeout($.proxy(function () {
                this.$inputClass.focus();
            }, this), 100);
        }

        this.base();
    }
});

window.LD_Tabs = LD_Tabs;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvdGFiLWRlc2lnbmVyLmpzIl0sIm5hbWVzIjpbIkxEX1RhYnMiLCJzZXR1cCIsIkdhcm5pc2giLCJCYXNlIiwiZXh0ZW5kIiwidGFicyIsIm9wdGlvbnMiLCJpbml0Iiwic2VsZiIsIkZMRCIsIkZMRF90YWIiLCJGTERfYWRkVGFiIiwiRkxEX3RhYk9wdGlvbnMiLCJDcmFmdCIsIkZpZWxkTGF5b3V0RGVzaWduZXIiLCJGTERfaW5pdCIsInByb3RvdHlwZSIsImluaXRUYWIiLCJhZGRUYWIiLCJvbkZpZWxkT3B0aW9uU2VsZWN0IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ0YWJFZGl0b3IiLCJUYWJFZGl0b3IiLCIkdGFiIiwiJHRhYkVsIiwiJHByZXZpZXciLCIkZWRpdEJ0biIsIiRodG1sIiwiJG1lbnUiLCIkdWwiLCJ0YWJJZCIsIm1lbnUiLCJtZW51QnRuIiwiZmluZCIsImRhdGEiLCIkY29udGFpbmVyIiwiY2hpbGRyZW4iLCIkIiwidCIsImFwcGVuZFRvIiwiY29uc29sZSIsImxvZyIsImpvaW4iLCJhZGRPcHRpb25zIiwib25UYWJPcHRpb25TZWxlY3QiLCJvcHRpb24iLCIkb3B0aW9uIiwiYWN0aW9uIiwiJGFuY2hvciIsInBhcmVudCIsInJlbmFtZVRhYiIsInRyaWdnZXIiLCJkZWxldGVUYWIiLCJ0YXJnZXQiLCIkdGFyZ2V0IiwiZmxkIiwiZSIsInNldHRpbmdzIiwiY3VzdG9taXphYmxlVGFicyIsInRhYkdyaWQiLCIkaXRlbXMiLCJsZW5ndGgiLCIkdGFiQ29udGFpbmVyIiwiYWRkSXRlbXMiLCJ0YWJEcmFnIiwiZ2V0T3B0aW9ucyIsImxheW91dElkIiwiZWFjaCIsImtleSIsIml0ZW0iLCJwYXJzZUludCIsIm5hbWVzcGFjZSIsIkxEIiwiZ2V0TGF5b3V0SWQiLCJvbiIsInByb3h5Iiwib3Blbk9wdGlvbnNNb2RhbCIsIm9uVGFiUmVuYW1lZCIsImFwcGx5T3B0aW9ucyIsInJlc3VsdHMiLCJ2YWx1ZSIsImhhc093blByb3BlcnR5IiwiSlNPTiIsInBhcnNlIiwicHVzaCIsInNldEZvcm1EYXRhIiwiJGlucHV0IiwiJGxhYmVsU3BhbiIsInRhYk5hbWUiLCJ0ZXh0IiwidmFsIiwibW9kYWwiLCJUYWJPcHRpb25zTW9kYWwiLCJzaG93IiwibmFtZSIsInVwZGF0ZVByZXZpZXciLCJyZW1vdmUiLCJyZW1vdmVQcmV2aWV3IiwidGFiIiwidHlwZSIsImJvZHkiLCJtYXJrdXAiLCJvbGRNYXJrdXAiLCJNb2RhbCIsImZvcm0iLCIkZm9ybUNvbnRhaW5lciIsImJhc2UiLCIkYm9kIiwic2V0Q29udGFpbmVyIiwiJGlucHV0Q2xhc3MiLCIkaW5wdXRJZCIsIiRjYW5jZWxCdG4iLCJsb2FkTW9kYWxWYWx1ZXMiLCJhZGRMaXN0ZW5lciIsIiRjbGFzc0lucHV0IiwiJGlkSW5wdXQiLCJvbkZvcm1TdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsInZpc2libGUiLCJpZCIsImhpZGUiLCJvbkZhZGVPdXQiLCJkZXN0cm95IiwiJHNoYWRlIiwidmFsdWVzIiwiaXNNb2JpbGVCcm93c2VyIiwic2V0VGltZW91dCIsImZvY3VzIiwid2luZG93Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FB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QUNIOztBQUVELGdCQUFJWixRQUFRLElBQVIsSUFBZ0JZLEtBQXBCLEVBQTJCO0FBQ3ZCekUscUJBQUt1RyxRQUFMLENBQWNwQixHQUFkLENBQWtCVixLQUFsQjtBQUNIO0FBQ0wsU0FSRDs7QUFVQyxZQUFJLENBQUMvRSxRQUFRNEgsZUFBUixFQUFMLEVBQWdDO0FBQzVCQyx1QkFBV3pGLEVBQUVzQyxLQUFGLENBQVMsWUFBVztBQUMzQixxQkFBS2tDLFdBQUwsQ0FBaUJrQixLQUFqQjtBQUNILGFBRlUsRUFFUCxJQUZPLENBQVgsRUFFVyxHQUZYO0FBR0g7O0FBRUQsYUFBS3JCLElBQUw7QUFDSjtBQXBIbUMsQ0FBckIsQ0FBbEI7O0FBMEhBc0IsT0FBT2pJLE9BQVAsR0FBaUJBLE9BQWpCLEMiLCJmaWxlIjoiL2Zvcm1idWlsZGVyL3Jlc291cmNlcy9qcy90YWItZGVzaWduZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJsZXQgTERfVGFic1xuXG5MRF9UYWJzID0ge1xuICAgIHNldHVwKCkge31cbn1cblxuTERfVGFicyA9IG5ldyAoR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgdGFiczogbnVsbCxcbiAgICBvcHRpb25zOiBudWxsLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJzID0ge31cbiAgICAgICAgdGhpcy5vcHRpb25zID0ge31cbiAgICB9LFxuXG4gICAgc2V0dXAoKSB7XG4gICAgICAgIGxldCBzZWxmXG4gICAgICAgIGxldCBGTERcbiAgICAgICAgbGV0IEZMRF90YWJcbiAgICAgICAgbGV0IEZMRF9hZGRUYWJcbiAgICAgICAgbGV0IEZMRF90YWJPcHRpb25zXG4gICAgICAgIHNlbGYgPSB0aGlzXG5cbiAgICAgICAgaWYgKENyYWZ0LkZpZWxkTGF5b3V0RGVzaWduZXIpIHtcbiAgICAgICAgICAgIEZMRCA9IENyYWZ0LkZpZWxkTGF5b3V0RGVzaWduZXJcbiAgICAgICAgICAgIEZMRF9pbml0ID0gRkxELnByb3RvdHlwZS5pbml0XG4gICAgICAgICAgICBGTERfdGFiID0gRkxELnByb3RvdHlwZS5pbml0VGFiXG4gICAgICAgICAgICBGTERfYWRkVGFiID0gRkxELnByb3RvdHlwZS5hZGRUYWJcbiAgICAgICAgICAgIEZMRF90YWJPcHRpb25zID0gRkxELnByb3RvdHlwZS5vbkZpZWxkT3B0aW9uU2VsZWN0XG5cbiAgICAgICAgICAgIEZMRC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIEZMRF9pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICB0aGlzLnRhYkVkaXRvciA9IG5ldyBUYWJFZGl0b3IodGhpcylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRkxELnByb3RvdHlwZS5pbml0VGFiID0gZnVuY3Rpb24oJHRhYikge1xuICAgICAgICAgICAgICAgIGxldCAkdGFiRWxcbiAgICAgICAgICAgICAgICBsZXQgJHByZXZpZXdcbiAgICAgICAgICAgICAgICBsZXQgJGVkaXRCdG5cbiAgICAgICAgICAgICAgICBsZXQgJGh0bWxcbiAgICAgICAgICAgICAgICBsZXQgJG1lbnVcbiAgICAgICAgICAgICAgICBsZXQgJHVsXG4gICAgICAgICAgICAgICAgbGV0IHRhYklkXG4gICAgICAgICAgICAgICAgbGV0IG1lbnVcbiAgICAgICAgICAgICAgICBsZXQgbWVudUJ0blxuXG4gICAgICAgICAgICAgICAgRkxEX3RhYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cbiAgICAgICAgICAgICAgICB0YWJJZCA9ICR0YWIuZmluZCgnLnRhYicpLmRhdGEoJ2lkJylcblxuICAgICAgICAgICAgICAgIGlmICh0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgICAkZWRpdEJ0biA9ICR0YWIuZmluZCgnLnRhYnMgLnNldHRpbmdzJylcbiAgICAgICAgICAgICAgICAgICAgbWVudUJ0biA9ICRlZGl0QnRuLmRhdGEoJ21lbnVidG4nKVxuICAgICAgICAgICAgICAgICAgICBtZW51ID0gbWVudUJ0bi5tZW51XG4gICAgICAgICAgICAgICAgICAgICRtZW51ID0gbWVudS4kY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICR1bCA9ICRtZW51LmNoaWxkcmVuKCd1bCcpXG4gICAgICAgICAgICAgICAgICAgICRodG1sID0gJCgnPGxpPjxhIGRhdGEtYWN0aW9uPVwidGFib3B0aW9uc1wiPicgKyBDcmFmdC50KCdPcHRpb25zJykgKyAnPC9hPjwvbGk+JykuYXBwZW5kVG8oJHVsKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygpXG5cbiAgICAgICAgICAgICAgICAgICAgJHByZXZpZXcgPSAkKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmllbGQtb3B0aW9ucy1wcmV2aWV3XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgIF0uam9pbignJykpLmFwcGVuZFRvKCR0YWIuZmluZCgnLnRhYnMnKSlcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVudS5hZGRPcHRpb25zKCRodG1sLmNoaWxkcmVuKCdhJykpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBGTEQucHJvdG90eXBlLm9uVGFiT3B0aW9uU2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0YWJcbiAgICAgICAgICAgICAgICBsZXQgJG9wdGlvblxuICAgICAgICAgICAgICAgIGxldCB0YWJJZFxuICAgICAgICAgICAgICAgIGxldCBhY3Rpb25cblxuICAgICAgICAgICAgICAgIEZMRF90YWJPcHRpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkb3B0aW9uID0gJChvcHRpb24pXG4gICAgICAgICAgICAgICAgJHRhYiA9ICRvcHRpb24uZGF0YSgnbWVudScpLiRhbmNob3IucGFyZW50KCkucGFyZW50KCkucGFyZW50KClcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAkb3B0aW9uLmRhdGEoJ2FjdGlvbicpXG4gICAgICAgICAgICAgICAgdGFiSWQgPSAkdGFiLmZpbmQoJy50YWInKS5kYXRhKCdpZCcpXG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyZW5hbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmFtZVRhYigkdGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcigndGFiUmVuYW1lZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJJZDogdGFiSWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVRhYigkdGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RhYm9wdGlvbnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCd0YWJPcHRpb25zU2VsZWN0ZWQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAkb3B0aW9uWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YXJnZXQ6ICRvcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhYjogJHRhYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGQ6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiSWQ6IHRhYklkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEZMRC5wcm90b3R5cGUuYWRkVGFiID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuYWRkVGFiKHRoaXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBhZGRUYWIoZSkge1xuICAgICAgICBpZiAoIWUuc2V0dGluZ3MuY3VzdG9taXphYmxlVGFicykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJHRhYiA9ICQoJzxkaXYgY2xhc3M9XCJmbGQtdGFiXCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInRhYnNcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwidGFiIHNlbCBkcmFnZ2FibGVcIj4nICtcbiAgICAgICAgICAgICc8c3Bhbj5GaWVsZHNldCAnICsgKGUudGFiR3JpZC4kaXRlbXMubGVuZ3RoICsgMSkgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgJzxhIGNsYXNzPVwic2V0dGluZ3MgaWNvblwiIHRpdGxlPVwiJyArIENyYWZ0LnQoJ1JlbmFtZScpICsgJ1wiPjwvYT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmxkLXRhYmNvbnRlbnRcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nKS5hcHBlbmRUbyhlLiR0YWJDb250YWluZXIpXG5cbiAgICAgICAgZS50YWJHcmlkLmFkZEl0ZW1zKCR0YWIpXG4gICAgICAgIGUudGFiRHJhZy5hZGRJdGVtcygkdGFiKVxuXG4gICAgICAgIGUuaW5pdFRhYigkdGFiKVxuICAgIH0sXG5cbiAgICBnZXRPcHRpb25zKGxheW91dElkKSB7XG4gICAgICAgIGxldCBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgICAgICQuZWFjaCh0aGlzLm9wdGlvbnMsIChrZXksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChpdGVtLmxheW91dElkKSA9PSBsYXlvdXRJZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbaXRlbS50YWJJZF0gPSBpdGVtLm9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gb3B0aW9uc1xuICAgIH1cbn0pKVxuXG5UYWJFZGl0b3IgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICBmbGQ6IG51bGwsXG4gICAgb3B0aW9uczogbnVsbCxcbiAgICBsYXlvdXRJZDogbnVsbCxcbiAgICBuYW1lc3BhY2U6ICdmb3JtLWJ1aWxkZXInLFxuXG4gICAgaW5pdChmbGQpIHtcbiAgICAgICAgdGhpcy5mbGQgPSBmbGRcbiAgICAgICAgdGhpcy5sYXlvdXRJZCA9IExELmdldExheW91dElkKClcbiAgICAgICAgdGhpcy5vcHRpb25zID0gTERfVGFicy5nZXRPcHRpb25zKHRoaXMubGF5b3V0SWQpXG5cbiAgICAgICAgdGhpcy5mbGQub24oJ3RhYk9wdGlvbnNTZWxlY3RlZCcsICQucHJveHkodGhpcy5vcGVuT3B0aW9uc01vZGFsLCB0aGlzKSlcbiAgICAgICAgdGhpcy5mbGQub24oJ3RhYlJlbmFtZWQnLCAkLnByb3h5KHRoaXMub25UYWJSZW5hbWVkLCB0aGlzKSlcblxuICAgICAgICBpZiAodGhpcy5sYXlvdXRJZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlPcHRpb25zKHRoaXMubGF5b3V0SWQpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYXBwbHlPcHRpb25zKGxheW91dElkKSB7XG4gICAgICAgIGxldCByZXN1bHRzXG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdXG5cbiAgICAgICAgICAgICQuZWFjaCh0aGlzLm9wdGlvbnMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBKU09OLnBhcnNlKHRoaXMub3B0aW9uc1trZXldKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zZXRGb3JtRGF0YShrZXksIEpTT04ucGFyc2UodmFsdWUpKSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzXG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblRhYlJlbmFtZWQoZSkge1xuICAgICAgICAkdGFiID0gJCgnLnRhYi1pZC0nK2UudGFiSWQpXG4gICAgICAgICRpbnB1dCA9ICR0YWIucGFyZW50KCkuZmluZCgnLnRhYi1uYW1lLWZpZWxkJylcbiAgICAgICAgJGxhYmVsU3BhbiA9ICR0YWIuZmluZCgnc3BhbicpXG4gICAgICAgIHRhYk5hbWUgPSAkbGFiZWxTcGFuLnRleHQoKVxuXG4gICAgICAgICRpbnB1dC52YWwodGFiTmFtZSlcbiAgICB9LFxuXG4gICAgb3Blbk9wdGlvbnNNb2RhbChlKSB7XG4gICAgICAgIGxldCBzZWxmXG4gICAgICAgIHNlbGYgPSB0aGlzXG4gICAgICAgIGxldCBtb2RhbFxuICAgICAgICBsZXQgdGFiSWRcbiAgICAgICAgbGV0ICR0YWIgPSBlLiR0YWJcbiAgICAgICAgbGV0ICRsYWJlbFNwYW5cblxuICAgICAgICAkbGFiZWxTcGFuID0gJHRhYi5maW5kKCcudGFicyAudGFiIHNwYW4nKVxuICAgICAgICB0YWJOYW1lID0gJGxhYmVsU3Bhbi50ZXh0KClcbiAgICAgICAgdGFiSWQgPSBlLnRhYklkXG5cbiAgICAgICAgbW9kYWwgPSBuZXcgVGFiT3B0aW9uc01vZGFsKCR0YWIpXG4gICAgICAgIG1vZGFsLm9uKCdzZXRPcHRpb25zJywgZSA9PiBzZWxmLnNldEZvcm1EYXRhKHRhYklkLCBlLm9wdGlvbnMsIHRhYk5hbWUpKVxuICAgICAgICBtb2RhbC5zaG93KHRoaXMub3B0aW9ucylcbiAgICB9LFxuXG4gICAgc2V0Rm9ybURhdGEodGFiSWQsIG9wdGlvbnMsIHRhYk5hbWUpIHtcbiAgICAgICAgbGV0IHNlbGZcbiAgICAgICAgbGV0ICRjb250YWluZXJcbiAgICAgICAgbGV0IG5hbWVcbiAgICAgICAgc2VsZiA9IHRoaXNcblxuICAgICAgICAkY29udGFpbmVyID0gJCgnW2RhdGEtaWQ9XCInK3RhYklkKydcIl0nKS5wYXJlbnQoKVxuICAgICAgICBuYW1lID0gdGhpcy5uYW1lc3BhY2UgKyAnW3RhYl1bJyArIHRhYklkICsgJ11bb3B0aW9uc10nXG5cbiAgICAgICAgJC5lYWNoKG9wdGlvbnMsIChrZXksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmICgkY29udGFpbmVyLmNoaWxkcmVuKGBpbnB1dFtuYW1lPVwiJHtuYW1lfVske2tleX1dXCJdYCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuY2hpbGRyZW4oYGlucHV0W25hbWU9XCIke25hbWV9WyR7a2V5fV1cIl1gKS52YWwoaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVQcmV2aWV3KHRhYklkLCAkY29udGFpbmVyLCBrZXksIGl0ZW0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5jaGlsZHJlbihgaW5wdXRbbmFtZT1cIiR7bmFtZX1bJHtrZXl9XVwiXWApLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlUHJldmlldyh0YWJJZCwgJGNvbnRhaW5lciwga2V5LCBpdGVtKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVQcmV2aWV3KHRhYklkLCAkY29udGFpbmVyLCBrZXksIGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgICQoYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7bmFtZX1bJHtrZXl9XVwiPmApLnZhbChpdGVtKS5hcHBlbmRUbygkY29udGFpbmVyKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAkY29udGFpbmVyLmZpbmQoJy50YWItbmFtZS1maWVsZCcpLnZhbCh0YWJOYW1lKVxuICAgIH0sXG5cbiAgICB1cGRhdGVQcmV2aWV3KHRhYklkLCB0YWIsIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldCA9ICQoJ1tkYXRhLWlkPVwiJyt0YWJJZCsnXCJdJykucGFyZW50KClcbiAgICAgICAgYm9keSA9IHRhcmdldC5maW5kKCcuZmllbGQtb3B0aW9ucy1wcmV2aWV3JylcbiAgICAgICAgbWFya3VwID0gJCgnPGRpdiBjbGFzcz1cImZpZWxkLScrIHR5cGUgKyctcHJldmlld1wiPjxzcGFuIGNsYXNzPVwicHJldmlldy10eXBlXCI+JysgdHlwZSArJzwvc3Bhbj4gJyt2YWx1ZSsnPC9kaXY+JylcbiAgICAgICAgb2xkTWFya3VwID0gYm9keS5maW5kKCcuZmllbGQtJysgdHlwZSArJy1wcmV2aWV3JylcblxuICAgICAgICBpZiAob2xkTWFya3VwKSB7XG4gICAgICAgICAgICBvbGRNYXJrdXAucmVtb3ZlKClcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcmt1cC5hcHBlbmRUbyhib2R5KVxuICAgIH0sXG5cbiAgICByZW1vdmVQcmV2aWV3KHRhYklkLCB0YWIsIHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldCA9ICQoJ1tkYXRhLWlkPVwiJyt0YWJJZCsnXCJdJykucGFyZW50KClcbiAgICAgICAgdGFyZ2V0LmZpbmQoJy5maWVsZC0nK3R5cGUrJy1wcmV2aWV3JykucmVtb3ZlKClcbiAgICB9XG5cbn0pXG5cblRhYk9wdGlvbnNNb2RhbCA9IEdhcm5pc2guTW9kYWwuZXh0ZW5kKHtcbiAgICB0YWI6IG51bGwsXG4gICAgZm9ybTogbnVsbCxcbiAgICAkZm9ybUNvbnRhaW5lcjogbnVsbCxcblxuICAgIGluaXQodGFiKSB7XG4gICAgICAgIGxldCBib2R5XG4gICAgICAgIHRoaXMudGFiID0gdGFiXG4gICAgICAgIHRoaXMuYmFzZSgpXG4gICAgICAgIHRoaXMuJGZvcm1Db250YWluZXIgPSAkKCc8Zm9ybSBjbGFzcz1cIm1vZGFsIGZpdHRlZCBmb3JtYnVpbGRlci1tb2RhbFwiPicpLmFwcGVuZFRvKEdhcm5pc2guJGJvZClcbiAgICAgICAgdGhpcy5zZXRDb250YWluZXIodGhpcy4kZm9ybUNvbnRhaW5lcilcbiAgICAgICAgYm9keSA9ICQoW1xuICAgICAgICAgICAgJzxoZWFkZXI+JywgXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibW9kYWwtdGl0bGVcIj4nLCAnQXR0cmlidXRlcycsICc8L3NwYW4+JywgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnN0cnVjdGlvbnNcIj4nLCAnQ3VzdG9tIHRhYiBhdHRyaWJ1dGVzJywgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzwvaGVhZGVyPicsIFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJib2R5XCI+JywgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYi1maWVsZFwiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICdDTEFTUycsIFxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHQgZnVsbHdpZHRoIGlucHV0LWNsYXNzXCI+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmItZmllbGRcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnB1dC1oaW50XCI+JywgXG4gICAgICAgICAgICAgICAgICAgICAgICAnSUQnLCBcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0IGZ1bGx3aWR0aCBpbnB1dC1pZFwiPicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICc8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+JywgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJidXR0b25zXCI+JywgXG4gICAgICAgICAgICAgICAgICAgIGA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRucyBidG4tbW9kYWwgY2FuY2VsXCIgdmFsdWU9XCIke0NyYWZ0LnQoJ0NhbmNlbCcpfVwiPmAsIFxuICAgICAgICAgICAgICAgICAgICBgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIHN1Ym1pdFwiIHZhbHVlPVwiJHtDcmFmdC50KCdTYXZlJyl9XCI+YCwgXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzwvZm9vdGVyPidcbiAgICAgICAgXS5qb2luKCcnKSkuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRDbGFzcyA9IGJvZHkuZmluZCgnLmlucHV0LWNsYXNzJylcbiAgICAgICAgdGhpcy4kaW5wdXRJZCA9IGJvZHkuZmluZCgnLmlucHV0LWlkJylcblxuICAgICAgICB0aGlzLiRjYW5jZWxCdG4gPSBib2R5LmZpbmQoJy5jYW5jZWwnKVxuXG4gICAgICAgIHRoaXMubG9hZE1vZGFsVmFsdWVzKClcblxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGNhbmNlbEJ0biwgJ2NsaWNrJywgJ2hpZGUnKVxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGZvcm1Db250YWluZXIsICdzdWJtaXQnLCAnb25Gb3JtU3VibWl0JylcbiAgICB9LFxuXG4gICAgbG9hZE1vZGFsVmFsdWVzKCkge1xuICAgICAgICB0YWJJZCA9IHRoaXMudGFiLmZpbmQoJy50YWInKS5kYXRhKCdpZCcpXG4gICAgICAgICRjbGFzc0lucHV0ID0gJCgnaW5wdXRbbmFtZT1cImZvcm0tYnVpbGRlclt0YWJdWycrIHRhYklkICsnXVtvcHRpb25zXVtjbGFzc11cIl0nKS52YWwoKVxuICAgICAgICAkaWRJbnB1dCA9ICQoJ2lucHV0W25hbWU9XCJmb3JtLWJ1aWxkZXJbdGFiXVsnKyB0YWJJZCArJ11bb3B0aW9uc11baWRdXCJdJykudmFsKClcblxuICAgICAgICBpZiAoJGNsYXNzSW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Db250YWluZXIuZmluZCgnLmlucHV0LWNsYXNzJykudmFsKCRjbGFzc0lucHV0KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRpZElucHV0KSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtQ29udGFpbmVyLmZpbmQoJy5pbnB1dC1pZCcpLnZhbCgkaWRJbnB1dClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkZvcm1TdWJtaXQoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3NldE9wdGlvbnMnLCB7XG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiB0aGlzLiRpbnB1dENsYXNzLnZhbCgpLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLiRpbnB1dElkLnZhbCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICB9LFxuXG4gICAgb25GYWRlT3V0KCkge1xuICAgICAgICB0aGlzLmJhc2UoKVxuICAgICAgICB0aGlzLmRlc3Ryb3koKVxuICAgIH0sXG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmJhc2UoKVxuICAgICAgICB0aGlzLiRjb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgdGhpcy4kc2hhZGUucmVtb3ZlKClcbiAgICB9LFxuXG4gICAgc2hvdyhvcHRpb25zKSB7XG4gICAgICAgIGxldCBzZWxmXG4gICAgICAgIGxldCB2YWx1ZXNcblxuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSBKU09OLnBhcnNlKG9wdGlvbnNbdGhpcy50YWIubmFtZV0pXG4gICAgICAgIH1cblxuICAgICAgICQuZWFjaCh2YWx1ZXMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3MnICYmIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi4kaW5wdXRDbGFzcy52YWwodmFsdWUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdpZCcgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLiRpbnB1dElkLnZhbCh2YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICB9KVxuXG4gICAgICAgIGlmICghR2FybmlzaC5pc01vYmlsZUJyb3dzZXIoKSkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgkLnByb3h5KChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRpbnB1dENsYXNzLmZvY3VzKCk7XG4gICAgICAgICAgICB9KSwgdGhpcyksIDEwMClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFzZSgpXG4gICB9XG4gICBcblxufSlcblxuXG53aW5kb3cuTERfVGFicyA9IExEX1RhYnNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kZXZlbG9wbWVudC9qcy90YWItZGVzaWduZXIuanMiXSwic291cmNlUm9vdCI6IiJ9