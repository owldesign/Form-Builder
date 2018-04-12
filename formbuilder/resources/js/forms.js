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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ({

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);


/***/ }),

/***/ 18:
/***/ (function(module, exports) {

var FormBuilderSection = void 0;

window.FormBuilderSection = Garnish.Base.extend({
    $container: null,
    $titlebar: null,
    $fieldsContainer: null,
    $optionsContainer: null,
    $previewContainer: null,
    $actionMenu: null,
    $collapserBtn: null,
    $sectionToggleInput: null,
    $menuBtn: null,
    $status: null,
    modal: null,
    collapsed: false,
    optionCollapsed: true,
    type: null,

    // $addTemplateBtn: null,

    init: function init(el, type) {
        var menuBtn = void 0;
        this.type = type;
        this.$container = $(el);
        this.$menuBtn = this.$container.find('.actions > .settings');
        this.$collapserBtn = this.$container.find('.actions > .bodytoggle');
        this.$sectionToggleInput = this.$container.find('.section-toggle');
        this.$titlebar = this.$container.find('.titlebar');
        this.$fieldsContainer = this.$container.find('.body');
        this.$optionsContainer = this.$container.find('.body-options');
        this.$previewContainer = this.$container.find('.preview');
        this.$status = this.$container.find('.actions > .status');

        // this.$addTemplateBtn = this.$container.find('.add-template-btn')

        menuBtn = new Garnish.MenuBtn(this.$menuBtn);
        this.$actionMenu = menuBtn.menu.$container;
        menuBtn.menu.settings.onOptionSelect = $.proxy(this, 'onMenuOptionSelect');

        if (Garnish.hasAttr(this.$container, 'data-collapsed')) {
            this.collapse();
        }

        this._handleTitleBarClick = function (ev) {
            ev.preventDefault();
            return this.toggle();
        };

        this.addListener(this.$collapserBtn, 'click', this.toggle);
        this.addListener(this.$titlebar, 'doubletap', this._handleTitleBarClick);

        // if (this.type == 'email') {
        //     this.addListener(this.$addTemplateBtn, 'click', this.addEmailTemplateModal);
        // }
    },
    toggle: function toggle() {
        if (this.collapsed) {
            return this.expand();
        } else {
            this.$sectionToggleInput.prop('checked', true);
            return this.collapse(true);
        }
    },
    collapse: function collapse(animate) {
        var $customTemplates = void 0;
        var $fields = void 0;
        var previewHtml = void 0;
        var title = void 0;

        this.$sectionToggleInput.prop('checked', true);
        if (this.collapsed) {
            return;
        }

        this.$container.addClass('bodycollapsed');
        previewHtml = '';
        title = this.$titlebar.find('.tout-title').text();

        this.$previewContainer.html(previewHtml);
        this.$fieldsContainer.velocity('stop');
        this.$container.velocity('stop');

        if (animate) {
            this.$fieldsContainer.velocity('fadeOut', {
                duration: 'fast'
            });

            this.$container.velocity({
                height: '100%'
            }, 'fast');
        } else {
            this.$previewContainer.show();
            this.$fieldsContainer.hide();
            this.$container.css({
                height: '100%'
            });
        }

        setTimeout($.proxy(function () {
            this.$actionMenu.find('a[data-action=collapse]:first').parent().addClass('hidden');
            return this.$actionMenu.find('a[data-action=expand]:first').parent().removeClass('hidden');
        }, this), 200);

        return this.collapsed = true;
    },
    expand: function expand() {
        var collapsedContainerHeight = void 0;
        var expandedContainerHeight = void 0;
        this.$sectionToggleInput.prop('checked', false);
        if (!this.collapsed) {
            return;
        }
        this.$container.removeClass('bodycollapsed');
        this.$fieldsContainer.velocity('stop');
        this.$container.velocity('stop');
        collapsedContainerHeight = this.$container.height();
        this.$container.height('auto');
        this.$fieldsContainer.show();
        expandedContainerHeight = this.$container.height();
        this.$container.height(collapsedContainerHeight);

        this.$fieldsContainer.hide().velocity('fadeIn', {
            duration: 'fast'
        });

        this.$container.velocity({
            height: expandedContainerHeight
        }, 'fast', $.proxy(function () {
            return this.$container.height('auto');
        }, this));

        setTimeout($.proxy(function () {
            this.$actionMenu.find('a[data-action=collapse]:first').parent().removeClass('hidden');
            return this.$actionMenu.find('a[data-action=expand]:first').parent().addClass('hidden');
        }, this), 200);

        return this.collapsed = false;
    },
    disable: function disable() {
        this.$fieldsContainer.find('.enable-notification-section').prop('checked', false);
        this.$status.removeClass('on');
        this.$status.addClass('off');
        setTimeout($.proxy(function () {
            this.$actionMenu.find('a[data-action=disable]:first').parent().addClass('hidden');
            return this.$actionMenu.find('a[data-action=enable]:first').parent().removeClass('hidden');
        }, this), 200);

        return this.collapse(true);
    },
    enable: function enable() {
        this.$fieldsContainer.find('.enable-notification-section').prop('checked', true);
        this.$status.removeClass('off');
        this.$status.addClass('on');
        return setTimeout($.proxy(function () {
            this.$actionMenu.find('a[data-action=disable]:first').parent().removeClass('hidden');
            return this.$actionMenu.find('a[data-action=enable]:first').parent().addClass('hidden');
        }, this), 200);
    },
    "delete": function _delete() {
        return this.$container.remove();
    },
    settings: function settings() {
        if (!this.modal) {
            return this.modal = new SettingsModal(this);
        } else {
            return this.modal.show();
        }
    },
    updateSectionSettings: function updateSectionSettings() {
        return $.each(this.modal.$modalInputs, $.proxy(function (i, input) {
            var value = void 0;
            value = $(input).val();
            if (value !== '') {
                return this.$container.prepend($(input).addClass('hidden'));
            }
        }, this));
    },
    onMenuOptionSelect: function onMenuOptionSelect(option) {
        var $option = void 0;
        $option = $(option);

        switch ($option.data('action')) {
            case 'collapse':
                return this.collapse(true);
            case 'expand':
                return this.expand();
            case 'disable':
                return this.disable();
            case 'enable':
                this.enable();
                return this.expand();
            case 'delete':
                return this["delete"]();
            case 'settings':
                return this.settings();
        }
    }
});

Garnish.$doc.ready(function () {
    $('.section-collapsible').each(function (i, el) {
        new window.FormBuilderSection(el, $(el).data('type'));
    });

    if (Craft.elementIndex) {
        Craft.elementIndex.on('selectSource', function (e) {
            var groupId = void 0;
            groupId = e.target.$source.data('id');

            if (groupId) {
                $('#new-form-btn').attr("href", Craft.getCpUrl() + ("/formbuilder/forms/new?groupId=" + groupId));
            } else {
                $('#new-form-btn').attr('href', Craft.getCpUrl() + '/formbuilder/forms/new?groupId=1');
            }
        });
    }

    if ($('.fb-forms').length > 0) {
        new Clipboard('.copy-handle', {
            target: function target(trigger) {
                var handle;
                handle = $(trigger).data('handle');
                Craft.cp.displayNotice(Craft.t("Form handle `" + handle + "` copied"));
            }
        });

        new Clipboard('.twig-snippet', {
            text: function text(trigger) {
                var handle, snippet;
                handle = $(trigger).data('handle');
                snippet = '{{ craft.formBuilder.form("' + handle + '") }}';
                Craft.cp.displayNotice(snippet + Craft.t(' copied'));
                return snippet;
            }
        });
    }

    $('.delete-form').on('click', function (e) {
        var data = void 0;
        e.preventDefault();
        data = {
            id: $(this).data('id')
        };

        if (confirm(Craft.t("Are you sure you want to delete this form and all its entries?"))) {
            Craft.postActionRequest('formBuilder/forms/delete', data, $.proxy(function (response, textStatus) {
                if (textStatus === 'success') {
                    Craft.cp.displayNotice(Craft.t('Form deleted'));
                    window.location.href = Craft.getCpUrl() + '/formbuilder/forms';
                }
            }, this));
        }
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTdlYjljODQwMWFhYjA0M2M0ZjQiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZm9ybXMuanMiXSwibmFtZXMiOlsiRm9ybUJ1aWxkZXJTZWN0aW9uIiwid2luZG93IiwiR2FybmlzaCIsIkJhc2UiLCJleHRlbmQiLCIkY29udGFpbmVyIiwiJHRpdGxlYmFyIiwiJGZpZWxkc0NvbnRhaW5lciIsIiRvcHRpb25zQ29udGFpbmVyIiwiJHByZXZpZXdDb250YWluZXIiLCIkYWN0aW9uTWVudSIsIiRjb2xsYXBzZXJCdG4iLCIkc2VjdGlvblRvZ2dsZUlucHV0IiwiJG1lbnVCdG4iLCIkc3RhdHVzIiwibW9kYWwiLCJjb2xsYXBzZWQiLCJvcHRpb25Db2xsYXBzZWQiLCJ0eXBlIiwiaW5pdCIsImVsIiwibWVudUJ0biIsIiQiLCJmaW5kIiwiTWVudUJ0biIsIm1lbnUiLCJzZXR0aW5ncyIsIm9uT3B0aW9uU2VsZWN0IiwicHJveHkiLCJoYXNBdHRyIiwiY29sbGFwc2UiLCJfaGFuZGxlVGl0bGVCYXJDbGljayIsImV2IiwicHJldmVudERlZmF1bHQiLCJ0b2dnbGUiLCJhZGRMaXN0ZW5lciIsImV4cGFuZCIsInByb3AiLCJhbmltYXRlIiwiJGN1c3RvbVRlbXBsYXRlcyIsIiRmaWVsZHMiLCJwcmV2aWV3SHRtbCIsInRpdGxlIiwiYWRkQ2xhc3MiLCJ0ZXh0IiwiaHRtbCIsInZlbG9jaXR5IiwiZHVyYXRpb24iLCJoZWlnaHQiLCJzaG93IiwiaGlkZSIsImNzcyIsInNldFRpbWVvdXQiLCJwYXJlbnQiLCJyZW1vdmVDbGFzcyIsImNvbGxhcHNlZENvbnRhaW5lckhlaWdodCIsImV4cGFuZGVkQ29udGFpbmVySGVpZ2h0IiwiZGlzYWJsZSIsImVuYWJsZSIsInJlbW92ZSIsIlNldHRpbmdzTW9kYWwiLCJ1cGRhdGVTZWN0aW9uU2V0dGluZ3MiLCJlYWNoIiwiJG1vZGFsSW5wdXRzIiwiaSIsImlucHV0IiwidmFsdWUiLCJ2YWwiLCJwcmVwZW5kIiwib25NZW51T3B0aW9uU2VsZWN0Iiwib3B0aW9uIiwiJG9wdGlvbiIsImRhdGEiLCIkZG9jIiwicmVhZHkiLCJDcmFmdCIsImVsZW1lbnRJbmRleCIsIm9uIiwiZSIsImdyb3VwSWQiLCJ0YXJnZXQiLCIkc291cmNlIiwiYXR0ciIsImdldENwVXJsIiwibGVuZ3RoIiwiQ2xpcGJvYXJkIiwidHJpZ2dlciIsImhhbmRsZSIsImNwIiwiZGlzcGxheU5vdGljZSIsInQiLCJzbmlwcGV0IiwiaWQiLCJjb25maXJtIiwicG9zdEFjdGlvblJlcXVlc3QiLCJyZXNwb25zZSIsInRleHRTdGF0dXMiLCJsb2NhdGlvbiIsImhyZWYiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQSxJQUFJQSwyQkFBSjs7QUFFQUMsT0FBT0Qsa0JBQVAsR0FBNEJFLFFBQVFDLElBQVIsQ0FBYUMsTUFBYixDQUFvQjtBQUM1Q0MsZ0JBQVksSUFEZ0M7QUFFNUNDLGVBQVcsSUFGaUM7QUFHNUNDLHNCQUFrQixJQUgwQjtBQUk1Q0MsdUJBQW1CLElBSnlCO0FBSzVDQyx1QkFBbUIsSUFMeUI7QUFNNUNDLGlCQUFhLElBTitCO0FBTzVDQyxtQkFBZSxJQVA2QjtBQVE1Q0MseUJBQXFCLElBUnVCO0FBUzVDQyxjQUFVLElBVGtDO0FBVTVDQyxhQUFTLElBVm1DO0FBVzVDQyxXQUFPLElBWHFDO0FBWTVDQyxlQUFXLEtBWmlDO0FBYTVDQyxxQkFBaUIsSUFiMkI7QUFjNUNDLFVBQU0sSUFkc0M7O0FBZ0I1Qzs7QUFFQUMsUUFsQjRDLGdCQWtCdkNDLEVBbEJ1QyxFQWtCbkNGLElBbEJtQyxFQWtCN0I7QUFDWCxZQUFJRyxnQkFBSjtBQUNBLGFBQUtILElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtiLFVBQUwsR0FBa0JpQixFQUFFRixFQUFGLENBQWxCO0FBQ0EsYUFBS1AsUUFBTCxHQUFnQixLQUFLUixVQUFMLENBQWdCa0IsSUFBaEIsQ0FBcUIsc0JBQXJCLENBQWhCO0FBQ0EsYUFBS1osYUFBTCxHQUFxQixLQUFLTixVQUFMLENBQWdCa0IsSUFBaEIsQ0FBcUIsd0JBQXJCLENBQXJCO0FBQ0EsYUFBS1gsbUJBQUwsR0FBMkIsS0FBS1AsVUFBTCxDQUFnQmtCLElBQWhCLENBQXFCLGlCQUFyQixDQUEzQjtBQUNBLGFBQUtqQixTQUFMLEdBQWlCLEtBQUtELFVBQUwsQ0FBZ0JrQixJQUFoQixDQUFxQixXQUFyQixDQUFqQjtBQUNBLGFBQUtoQixnQkFBTCxHQUF3QixLQUFLRixVQUFMLENBQWdCa0IsSUFBaEIsQ0FBcUIsT0FBckIsQ0FBeEI7QUFDQSxhQUFLZixpQkFBTCxHQUF5QixLQUFLSCxVQUFMLENBQWdCa0IsSUFBaEIsQ0FBcUIsZUFBckIsQ0FBekI7QUFDQSxhQUFLZCxpQkFBTCxHQUF5QixLQUFLSixVQUFMLENBQWdCa0IsSUFBaEIsQ0FBcUIsVUFBckIsQ0FBekI7QUFDQSxhQUFLVCxPQUFMLEdBQWUsS0FBS1QsVUFBTCxDQUFnQmtCLElBQWhCLENBQXFCLG9CQUFyQixDQUFmOztBQUVBOztBQUVBRixrQkFBVSxJQUFJbkIsUUFBUXNCLE9BQVosQ0FBb0IsS0FBS1gsUUFBekIsQ0FBVjtBQUNBLGFBQUtILFdBQUwsR0FBbUJXLFFBQVFJLElBQVIsQ0FBYXBCLFVBQWhDO0FBQ0FnQixnQkFBUUksSUFBUixDQUFhQyxRQUFiLENBQXNCQyxjQUF0QixHQUF1Q0wsRUFBRU0sS0FBRixDQUFRLElBQVIsRUFBYyxvQkFBZCxDQUF2Qzs7QUFFQSxZQUFJMUIsUUFBUTJCLE9BQVIsQ0FBZ0IsS0FBS3hCLFVBQXJCLEVBQWlDLGdCQUFqQyxDQUFKLEVBQXdEO0FBQ3RELGlCQUFLeUIsUUFBTDtBQUNEOztBQUVELGFBQUtDLG9CQUFMLEdBQTRCLFVBQVNDLEVBQVQsRUFBYTtBQUN2Q0EsZUFBR0MsY0FBSDtBQUNBLG1CQUFPLEtBQUtDLE1BQUwsRUFBUDtBQUNELFNBSEQ7O0FBS0EsYUFBS0MsV0FBTCxDQUFpQixLQUFLeEIsYUFBdEIsRUFBcUMsT0FBckMsRUFBOEMsS0FBS3VCLE1BQW5EO0FBQ0EsYUFBS0MsV0FBTCxDQUFpQixLQUFLN0IsU0FBdEIsRUFBaUMsV0FBakMsRUFBOEMsS0FBS3lCLG9CQUFuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDSCxLQXBEMkM7QUFzRDVDRyxVQXRENEMsb0JBc0RuQztBQUNMLFlBQUksS0FBS2xCLFNBQVQsRUFBb0I7QUFDaEIsbUJBQU8sS0FBS29CLE1BQUwsRUFBUDtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLeEIsbUJBQUwsQ0FBeUJ5QixJQUF6QixDQUE4QixTQUE5QixFQUF5QyxJQUF6QztBQUNBLG1CQUFPLEtBQUtQLFFBQUwsQ0FBYyxJQUFkLENBQVA7QUFDSDtBQUNKLEtBN0QyQztBQStENUNBLFlBL0Q0QyxvQkErRG5DUSxPQS9EbUMsRUErRDFCO0FBQ2QsWUFBSUMseUJBQUo7QUFDQSxZQUFJQyxnQkFBSjtBQUNBLFlBQUlDLG9CQUFKO0FBQ0EsWUFBSUMsY0FBSjs7QUFFQSxhQUFLOUIsbUJBQUwsQ0FBeUJ5QixJQUF6QixDQUE4QixTQUE5QixFQUF5QyxJQUF6QztBQUNBLFlBQUksS0FBS3JCLFNBQVQsRUFBb0I7QUFDaEI7QUFDSDs7QUFFRCxhQUFLWCxVQUFMLENBQWdCc0MsUUFBaEIsQ0FBeUIsZUFBekI7QUFDQUYsc0JBQWMsRUFBZDtBQUNBQyxnQkFBUSxLQUFLcEMsU0FBTCxDQUFlaUIsSUFBZixDQUFvQixhQUFwQixFQUFtQ3FCLElBQW5DLEVBQVI7O0FBRUEsYUFBS25DLGlCQUFMLENBQXVCb0MsSUFBdkIsQ0FBNEJKLFdBQTVCO0FBQ0EsYUFBS2xDLGdCQUFMLENBQXNCdUMsUUFBdEIsQ0FBK0IsTUFBL0I7QUFDQSxhQUFLekMsVUFBTCxDQUFnQnlDLFFBQWhCLENBQXlCLE1BQXpCOztBQUVBLFlBQUlSLE9BQUosRUFBYTtBQUNULGlCQUFLL0IsZ0JBQUwsQ0FBc0J1QyxRQUF0QixDQUErQixTQUEvQixFQUEwQztBQUN0Q0MsMEJBQVU7QUFENEIsYUFBMUM7O0FBSUEsaUJBQUsxQyxVQUFMLENBQWdCeUMsUUFBaEIsQ0FBeUI7QUFDckJFLHdCQUFRO0FBRGEsYUFBekIsRUFFRyxNQUZIO0FBR0gsU0FSRCxNQVFPO0FBQ0gsaUJBQUt2QyxpQkFBTCxDQUF1QndDLElBQXZCO0FBQ0EsaUJBQUsxQyxnQkFBTCxDQUFzQjJDLElBQXRCO0FBQ0EsaUJBQUs3QyxVQUFMLENBQWdCOEMsR0FBaEIsQ0FBb0I7QUFDaEJILHdCQUFRO0FBRFEsYUFBcEI7QUFHSDs7QUFFREksbUJBQVc5QixFQUFFTSxLQUFGLENBQVMsWUFBVztBQUMzQixpQkFBS2xCLFdBQUwsQ0FBaUJhLElBQWpCLENBQXNCLCtCQUF0QixFQUF1RDhCLE1BQXZELEdBQWdFVixRQUFoRSxDQUF5RSxRQUF6RTtBQUNBLG1CQUFPLEtBQUtqQyxXQUFMLENBQWlCYSxJQUFqQixDQUFzQiw2QkFBdEIsRUFBcUQ4QixNQUFyRCxHQUE4REMsV0FBOUQsQ0FBMEUsUUFBMUUsQ0FBUDtBQUNILFNBSFUsRUFHUCxJQUhPLENBQVgsRUFHVyxHQUhYOztBQUtBLGVBQU8sS0FBS3RDLFNBQUwsR0FBaUIsSUFBeEI7QUFDSCxLQXhHMkM7QUEwRzVDb0IsVUExRzRDLG9CQTBHbkM7QUFDTCxZQUFJbUIsaUNBQUo7QUFDQSxZQUFJQyxnQ0FBSjtBQUNBLGFBQUs1QyxtQkFBTCxDQUF5QnlCLElBQXpCLENBQThCLFNBQTlCLEVBQXlDLEtBQXpDO0FBQ0EsWUFBSSxDQUFDLEtBQUtyQixTQUFWLEVBQXFCO0FBQ2pCO0FBQ0g7QUFDRCxhQUFLWCxVQUFMLENBQWdCaUQsV0FBaEIsQ0FBNEIsZUFBNUI7QUFDQSxhQUFLL0MsZ0JBQUwsQ0FBc0J1QyxRQUF0QixDQUErQixNQUEvQjtBQUNBLGFBQUt6QyxVQUFMLENBQWdCeUMsUUFBaEIsQ0FBeUIsTUFBekI7QUFDQVMsbUNBQTJCLEtBQUtsRCxVQUFMLENBQWdCMkMsTUFBaEIsRUFBM0I7QUFDQSxhQUFLM0MsVUFBTCxDQUFnQjJDLE1BQWhCLENBQXVCLE1BQXZCO0FBQ0EsYUFBS3pDLGdCQUFMLENBQXNCMEMsSUFBdEI7QUFDQU8sa0NBQTBCLEtBQUtuRCxVQUFMLENBQWdCMkMsTUFBaEIsRUFBMUI7QUFDQSxhQUFLM0MsVUFBTCxDQUFnQjJDLE1BQWhCLENBQXVCTyx3QkFBdkI7O0FBRUEsYUFBS2hELGdCQUFMLENBQXNCMkMsSUFBdEIsR0FBNkJKLFFBQTdCLENBQXNDLFFBQXRDLEVBQWdEO0FBQzVDQyxzQkFBVTtBQURrQyxTQUFoRDs7QUFJQSxhQUFLMUMsVUFBTCxDQUFnQnlDLFFBQWhCLENBQXlCO0FBQ3JCRSxvQkFBUVE7QUFEYSxTQUF6QixFQUVHLE1BRkgsRUFFV2xDLEVBQUVNLEtBQUYsQ0FBUyxZQUFXO0FBQzNCLG1CQUFPLEtBQUt2QixVQUFMLENBQWdCMkMsTUFBaEIsQ0FBdUIsTUFBdkIsQ0FBUDtBQUNILFNBRlUsRUFFUCxJQUZPLENBRlg7O0FBTUFJLG1CQUFXOUIsRUFBRU0sS0FBRixDQUFTLFlBQVc7QUFDM0IsaUJBQUtsQixXQUFMLENBQWlCYSxJQUFqQixDQUFzQiwrQkFBdEIsRUFBdUQ4QixNQUF2RCxHQUFnRUMsV0FBaEUsQ0FBNEUsUUFBNUU7QUFDQSxtQkFBTyxLQUFLNUMsV0FBTCxDQUFpQmEsSUFBakIsQ0FBc0IsNkJBQXRCLEVBQXFEOEIsTUFBckQsR0FBOERWLFFBQTlELENBQXVFLFFBQXZFLENBQVA7QUFDSCxTQUhVLEVBR1AsSUFITyxDQUFYLEVBR1csR0FIWDs7QUFLQSxlQUFPLEtBQUszQixTQUFMLEdBQWlCLEtBQXhCO0FBQ0gsS0ExSTJDO0FBMkk1Q3lDLFdBM0k0QyxxQkEySWxDO0FBQ04sYUFBS2xELGdCQUFMLENBQXNCZ0IsSUFBdEIsQ0FBMkIsOEJBQTNCLEVBQTJEYyxJQUEzRCxDQUFnRSxTQUFoRSxFQUEyRSxLQUEzRTtBQUNBLGFBQUt2QixPQUFMLENBQWF3QyxXQUFiLENBQXlCLElBQXpCO0FBQ0EsYUFBS3hDLE9BQUwsQ0FBYTZCLFFBQWIsQ0FBc0IsS0FBdEI7QUFDQVMsbUJBQVc5QixFQUFFTSxLQUFGLENBQVMsWUFBVztBQUMzQixpQkFBS2xCLFdBQUwsQ0FBaUJhLElBQWpCLENBQXNCLDhCQUF0QixFQUFzRDhCLE1BQXRELEdBQStEVixRQUEvRCxDQUF3RSxRQUF4RTtBQUNBLG1CQUFPLEtBQUtqQyxXQUFMLENBQWlCYSxJQUFqQixDQUFzQiw2QkFBdEIsRUFBcUQ4QixNQUFyRCxHQUE4REMsV0FBOUQsQ0FBMEUsUUFBMUUsQ0FBUDtBQUNILFNBSFUsRUFHUCxJQUhPLENBQVgsRUFHVyxHQUhYOztBQUtBLGVBQU8sS0FBS3hCLFFBQUwsQ0FBYyxJQUFkLENBQVA7QUFDSCxLQXJKMkM7QUF1SjVDNEIsVUF2SjRDLG9CQXVKbkM7QUFDTCxhQUFLbkQsZ0JBQUwsQ0FBc0JnQixJQUF0QixDQUEyQiw4QkFBM0IsRUFBMkRjLElBQTNELENBQWdFLFNBQWhFLEVBQTJFLElBQTNFO0FBQ0EsYUFBS3ZCLE9BQUwsQ0FBYXdDLFdBQWIsQ0FBeUIsS0FBekI7QUFDQSxhQUFLeEMsT0FBTCxDQUFhNkIsUUFBYixDQUFzQixJQUF0QjtBQUNBLGVBQU9TLFdBQVc5QixFQUFFTSxLQUFGLENBQVMsWUFBVztBQUNsQyxpQkFBS2xCLFdBQUwsQ0FBaUJhLElBQWpCLENBQXNCLDhCQUF0QixFQUFzRDhCLE1BQXRELEdBQStEQyxXQUEvRCxDQUEyRSxRQUEzRTtBQUNBLG1CQUFPLEtBQUs1QyxXQUFMLENBQWlCYSxJQUFqQixDQUFzQiw2QkFBdEIsRUFBcUQ4QixNQUFyRCxHQUE4RFYsUUFBOUQsQ0FBdUUsUUFBdkUsQ0FBUDtBQUNILFNBSGlCLEVBR2QsSUFIYyxDQUFYLEVBR0ksR0FISixDQUFQO0FBSUgsS0EvSjJDO0FBaUs1QyxZQWpLNEMscUJBaUtqQztBQUNQLGVBQU8sS0FBS3RDLFVBQUwsQ0FBZ0JzRCxNQUFoQixFQUFQO0FBQ0gsS0FuSzJDO0FBcUs1Q2pDLFlBcks0QyxzQkFxS2pDO0FBQ1AsWUFBSSxDQUFDLEtBQUtYLEtBQVYsRUFBaUI7QUFDYixtQkFBTyxLQUFLQSxLQUFMLEdBQWEsSUFBSTZDLGFBQUosQ0FBa0IsSUFBbEIsQ0FBcEI7QUFDSCxTQUZELE1BRU87QUFDSCxtQkFBTyxLQUFLN0MsS0FBTCxDQUFXa0MsSUFBWCxFQUFQO0FBQ0g7QUFDSixLQTNLMkM7QUE2SzVDWSx5QkE3SzRDLG1DQTZLcEI7QUFDcEIsZUFBT3ZDLEVBQUV3QyxJQUFGLENBQU8sS0FBSy9DLEtBQUwsQ0FBV2dELFlBQWxCLEVBQWdDekMsRUFBRU0sS0FBRixDQUFTLFVBQVNvQyxDQUFULEVBQVlDLEtBQVosRUFBbUI7QUFDL0QsZ0JBQUlDLGNBQUo7QUFDQUEsb0JBQVE1QyxFQUFFMkMsS0FBRixFQUFTRSxHQUFULEVBQVI7QUFDQSxnQkFBSUQsVUFBVSxFQUFkLEVBQWtCO0FBQ2QsdUJBQU8sS0FBSzdELFVBQUwsQ0FBZ0IrRCxPQUFoQixDQUF3QjlDLEVBQUUyQyxLQUFGLEVBQVN0QixRQUFULENBQWtCLFFBQWxCLENBQXhCLENBQVA7QUFDSDtBQUNKLFNBTnNDLEVBTW5DLElBTm1DLENBQWhDLENBQVA7QUFPSCxLQXJMMkM7QUF1TDVDMEIsc0JBdkw0Qyw4QkF1THpCQyxNQXZMeUIsRUF1TGpCO0FBQ3ZCLFlBQUlDLGdCQUFKO0FBQ0FBLGtCQUFVakQsRUFBRWdELE1BQUYsQ0FBVjs7QUFFQSxnQkFBUUMsUUFBUUMsSUFBUixDQUFhLFFBQWIsQ0FBUjtBQUNJLGlCQUFLLFVBQUw7QUFDSSx1QkFBTyxLQUFLMUMsUUFBTCxDQUFjLElBQWQsQ0FBUDtBQUNKLGlCQUFLLFFBQUw7QUFDSSx1QkFBTyxLQUFLTSxNQUFMLEVBQVA7QUFDSixpQkFBSyxTQUFMO0FBQ0ksdUJBQU8sS0FBS3FCLE9BQUwsRUFBUDtBQUNKLGlCQUFLLFFBQUw7QUFDSSxxQkFBS0MsTUFBTDtBQUNBLHVCQUFPLEtBQUt0QixNQUFMLEVBQVA7QUFDSixpQkFBSyxRQUFMO0FBQ0ksdUJBQU8sS0FBSyxRQUFMLEdBQVA7QUFDSixpQkFBSyxVQUFMO0FBQ0ksdUJBQU8sS0FBS1YsUUFBTCxFQUFQO0FBYlI7QUFlSDtBQTFNMkMsQ0FBcEIsQ0FBNUI7O0FBNk1BeEIsUUFBUXVFLElBQVIsQ0FBYUMsS0FBYixDQUFtQixZQUFNO0FBQ3JCcEQsTUFBRSxzQkFBRixFQUEwQndDLElBQTFCLENBQStCLFVBQUNFLENBQUQsRUFBSTVDLEVBQUosRUFBVztBQUN0QyxZQUFJbkIsT0FBT0Qsa0JBQVgsQ0FBOEJvQixFQUE5QixFQUFrQ0UsRUFBRUYsRUFBRixFQUFNb0QsSUFBTixDQUFXLE1BQVgsQ0FBbEM7QUFDSCxLQUZEOztBQUlBLFFBQUlHLE1BQU1DLFlBQVYsRUFBd0I7QUFDcEJELGNBQU1DLFlBQU4sQ0FBbUJDLEVBQW5CLENBQXNCLGNBQXRCLEVBQXNDLFVBQVNDLENBQVQsRUFBWTtBQUM5QyxnQkFBSUMsZ0JBQUo7QUFDQUEsc0JBQVVELEVBQUVFLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQlQsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBVjs7QUFFQSxnQkFBSU8sT0FBSixFQUFhO0FBQ1R6RCxrQkFBRSxlQUFGLEVBQW1CNEQsSUFBbkIsQ0FBd0IsTUFBeEIsRUFBZ0NQLE1BQU1RLFFBQU4sTUFBb0Isb0NBQW9DSixPQUF4RCxDQUFoQztBQUNILGFBRkQsTUFFTztBQUNIekQsa0JBQUUsZUFBRixFQUFtQjRELElBQW5CLENBQXdCLE1BQXhCLEVBQWdDUCxNQUFNUSxRQUFOLEtBQW1CLGtDQUFuRDtBQUNIO0FBQ0osU0FURDtBQVVIOztBQUVELFFBQUk3RCxFQUFFLFdBQUYsRUFBZThELE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDM0IsWUFBSUMsU0FBSixDQUFjLGNBQWQsRUFBOEI7QUFDMUJMLG9CQUFRLGdCQUFTTSxPQUFULEVBQWtCO0FBQ3RCLG9CQUFJQyxNQUFKO0FBQ0FBLHlCQUFTakUsRUFBRWdFLE9BQUYsRUFBV2QsSUFBWCxDQUFnQixRQUFoQixDQUFUO0FBQ0FHLHNCQUFNYSxFQUFOLENBQVNDLGFBQVQsQ0FBdUJkLE1BQU1lLENBQU4sQ0FBUSxrQkFBa0JILE1BQWxCLEdBQTJCLFVBQW5DLENBQXZCO0FBQ0g7QUFMeUIsU0FBOUI7O0FBUUEsWUFBSUYsU0FBSixDQUFjLGVBQWQsRUFBK0I7QUFDM0J6QyxrQkFBTSxjQUFTMEMsT0FBVCxFQUFrQjtBQUNwQixvQkFBSUMsTUFBSixFQUFZSSxPQUFaO0FBQ0FKLHlCQUFTakUsRUFBRWdFLE9BQUYsRUFBV2QsSUFBWCxDQUFnQixRQUFoQixDQUFUO0FBQ0FtQiwwQkFBVSxnQ0FBZ0NKLE1BQWhDLEdBQXlDLE9BQW5EO0FBQ0FaLHNCQUFNYSxFQUFOLENBQVNDLGFBQVQsQ0FBdUJFLFVBQVVoQixNQUFNZSxDQUFOLENBQVEsU0FBUixDQUFqQztBQUNBLHVCQUFPQyxPQUFQO0FBQ0g7QUFQMEIsU0FBL0I7QUFTSDs7QUFFRHJFLE1BQUUsY0FBRixFQUFrQnVELEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLFVBQVNDLENBQVQsRUFBWTtBQUN0QyxZQUFJTixhQUFKO0FBQ0FNLFVBQUU3QyxjQUFGO0FBQ0F1QyxlQUFPO0FBQ0hvQixnQkFBSXRFLEVBQUUsSUFBRixFQUFRa0QsSUFBUixDQUFhLElBQWI7QUFERCxTQUFQOztBQUlBLFlBQUlxQixRQUFRbEIsTUFBTWUsQ0FBTixDQUFRLGdFQUFSLENBQVIsQ0FBSixFQUF3RjtBQUNwRmYsa0JBQU1tQixpQkFBTixDQUF3QiwwQkFBeEIsRUFBb0R0QixJQUFwRCxFQUEwRGxELEVBQUVNLEtBQUYsQ0FBUyxVQUFDbUUsUUFBRCxFQUFXQyxVQUFYLEVBQTBCO0FBQ3pGLG9CQUFJQSxlQUFlLFNBQW5CLEVBQThCO0FBQzFCckIsMEJBQU1hLEVBQU4sQ0FBU0MsYUFBVCxDQUF1QmQsTUFBTWUsQ0FBTixDQUFRLGNBQVIsQ0FBdkI7QUFDQXpGLDJCQUFPZ0csUUFBUCxDQUFnQkMsSUFBaEIsR0FBMEJ2QixNQUFNUSxRQUFOLEVBQTFCO0FBQ0g7QUFDSixhQUx5RCxFQUt0RCxJQUxzRCxDQUExRDtBQU1IO0FBQ0osS0FmRDtBQWdCSCxDQXRERCxFIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvZm9ybXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTdlYjljODQwMWFhYjA0M2M0ZjQiLCJsZXQgRm9ybUJ1aWxkZXJTZWN0aW9uO1xuXG53aW5kb3cuRm9ybUJ1aWxkZXJTZWN0aW9uID0gR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgJGNvbnRhaW5lcjogbnVsbCxcbiAgICAkdGl0bGViYXI6IG51bGwsXG4gICAgJGZpZWxkc0NvbnRhaW5lcjogbnVsbCxcbiAgICAkb3B0aW9uc0NvbnRhaW5lcjogbnVsbCxcbiAgICAkcHJldmlld0NvbnRhaW5lcjogbnVsbCxcbiAgICAkYWN0aW9uTWVudTogbnVsbCxcbiAgICAkY29sbGFwc2VyQnRuOiBudWxsLFxuICAgICRzZWN0aW9uVG9nZ2xlSW5wdXQ6IG51bGwsXG4gICAgJG1lbnVCdG46IG51bGwsXG4gICAgJHN0YXR1czogbnVsbCxcbiAgICBtb2RhbDogbnVsbCxcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIG9wdGlvbkNvbGxhcHNlZDogdHJ1ZSxcbiAgICB0eXBlOiBudWxsLFxuXG4gICAgLy8gJGFkZFRlbXBsYXRlQnRuOiBudWxsLFxuXG4gICAgaW5pdChlbCwgdHlwZSkge1xuICAgICAgICBsZXQgbWVudUJ0bjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kbWVudUJ0biA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuYWN0aW9ucyA+IC5zZXR0aW5ncycpO1xuICAgICAgICB0aGlzLiRjb2xsYXBzZXJCdG4gPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmFjdGlvbnMgPiAuYm9keXRvZ2dsZScpO1xuICAgICAgICB0aGlzLiRzZWN0aW9uVG9nZ2xlSW5wdXQgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLnNlY3Rpb24tdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJHRpdGxlYmFyID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy50aXRsZWJhcicpO1xuICAgICAgICB0aGlzLiRmaWVsZHNDb250YWluZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmJvZHknKTtcbiAgICAgICAgdGhpcy4kb3B0aW9uc0NvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuYm9keS1vcHRpb25zJyk7XG4gICAgICAgIHRoaXMuJHByZXZpZXdDb250YWluZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLnByZXZpZXcnKTtcbiAgICAgICAgdGhpcy4kc3RhdHVzID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5hY3Rpb25zID4gLnN0YXR1cycpO1xuXG4gICAgICAgIC8vIHRoaXMuJGFkZFRlbXBsYXRlQnRuID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5hZGQtdGVtcGxhdGUtYnRuJylcbiAgICAgICAgXG4gICAgICAgIG1lbnVCdG4gPSBuZXcgR2FybmlzaC5NZW51QnRuKHRoaXMuJG1lbnVCdG4pO1xuICAgICAgICB0aGlzLiRhY3Rpb25NZW51ID0gbWVudUJ0bi5tZW51LiRjb250YWluZXI7XG4gICAgICAgIG1lbnVCdG4ubWVudS5zZXR0aW5ncy5vbk9wdGlvblNlbGVjdCA9ICQucHJveHkodGhpcywgJ29uTWVudU9wdGlvblNlbGVjdCcpO1xuICAgICAgICBcbiAgICAgICAgaWYgKEdhcm5pc2guaGFzQXR0cih0aGlzLiRjb250YWluZXIsICdkYXRhLWNvbGxhcHNlZCcpKSB7XG4gICAgICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGFuZGxlVGl0bGVCYXJDbGljayA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGNvbGxhcHNlckJ0biwgJ2NsaWNrJywgdGhpcy50b2dnbGUpO1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJHRpdGxlYmFyLCAnZG91YmxldGFwJywgdGhpcy5faGFuZGxlVGl0bGVCYXJDbGljayk7XG5cbiAgICAgICAgLy8gaWYgKHRoaXMudHlwZSA9PSAnZW1haWwnKSB7XG4gICAgICAgIC8vICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGFkZFRlbXBsYXRlQnRuLCAnY2xpY2snLCB0aGlzLmFkZEVtYWlsVGVtcGxhdGVNb2RhbCk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4cGFuZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kc2VjdGlvblRvZ2dsZUlucHV0LnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlKHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBjb2xsYXBzZShhbmltYXRlKSB7XG4gICAgICAgIGxldCAkY3VzdG9tVGVtcGxhdGVzO1xuICAgICAgICBsZXQgJGZpZWxkcztcbiAgICAgICAgbGV0IHByZXZpZXdIdG1sO1xuICAgICAgICBsZXQgdGl0bGU7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRzZWN0aW9uVG9nZ2xlSW5wdXQucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcygnYm9keWNvbGxhcHNlZCcpO1xuICAgICAgICBwcmV2aWV3SHRtbCA9ICcnO1xuICAgICAgICB0aXRsZSA9IHRoaXMuJHRpdGxlYmFyLmZpbmQoJy50b3V0LXRpdGxlJykudGV4dCgpO1xuXG4gICAgICAgIHRoaXMuJHByZXZpZXdDb250YWluZXIuaHRtbChwcmV2aWV3SHRtbCk7XG4gICAgICAgIHRoaXMuJGZpZWxkc0NvbnRhaW5lci52ZWxvY2l0eSgnc3RvcCcpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIudmVsb2NpdHkoJ3N0b3AnKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChhbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLiRmaWVsZHNDb250YWluZXIudmVsb2NpdHkoJ2ZhZGVPdXQnLCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246ICdmYXN0J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGNvbnRhaW5lci52ZWxvY2l0eSh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgIH0sICdmYXN0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRwcmV2aWV3Q29udGFpbmVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJGZpZWxkc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCQucHJveHkoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYWN0aW9uTWVudS5maW5kKCdhW2RhdGEtYWN0aW9uPWNvbGxhcHNlXTpmaXJzdCcpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRhY3Rpb25NZW51LmZpbmQoJ2FbZGF0YS1hY3Rpb249ZXhwYW5kXTpmaXJzdCcpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfSksIHRoaXMpLCAyMDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIGV4cGFuZCgpIHtcbiAgICAgICAgbGV0IGNvbGxhcHNlZENvbnRhaW5lckhlaWdodDtcbiAgICAgICAgbGV0IGV4cGFuZGVkQ29udGFpbmVySGVpZ2h0O1xuICAgICAgICB0aGlzLiRzZWN0aW9uVG9nZ2xlSW5wdXQucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnYm9keWNvbGxhcHNlZCcpO1xuICAgICAgICB0aGlzLiRmaWVsZHNDb250YWluZXIudmVsb2NpdHkoJ3N0b3AnKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLnZlbG9jaXR5KCdzdG9wJyk7XG4gICAgICAgIGNvbGxhcHNlZENvbnRhaW5lckhlaWdodCA9IHRoaXMuJGNvbnRhaW5lci5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmhlaWdodCgnYXV0bycpO1xuICAgICAgICB0aGlzLiRmaWVsZHNDb250YWluZXIuc2hvdygpO1xuICAgICAgICBleHBhbmRlZENvbnRhaW5lckhlaWdodCA9IHRoaXMuJGNvbnRhaW5lci5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmhlaWdodChjb2xsYXBzZWRDb250YWluZXJIZWlnaHQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZmllbGRzQ29udGFpbmVyLmhpZGUoKS52ZWxvY2l0eSgnZmFkZUluJywge1xuICAgICAgICAgICAgZHVyYXRpb246ICdmYXN0J1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRjb250YWluZXIudmVsb2NpdHkoe1xuICAgICAgICAgICAgaGVpZ2h0OiBleHBhbmRlZENvbnRhaW5lckhlaWdodFxuICAgICAgICB9LCAnZmFzdCcsICQucHJveHkoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5oZWlnaHQoJ2F1dG8nKTtcbiAgICAgICAgfSksIHRoaXMpKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCQucHJveHkoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy4kYWN0aW9uTWVudS5maW5kKCdhW2RhdGEtYWN0aW9uPWNvbGxhcHNlXTpmaXJzdCcpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRhY3Rpb25NZW51LmZpbmQoJ2FbZGF0YS1hY3Rpb249ZXhwYW5kXTpmaXJzdCcpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfSksIHRoaXMpLCAyMDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgdGhpcy4kZmllbGRzQ29udGFpbmVyLmZpbmQoJy5lbmFibGUtbm90aWZpY2F0aW9uLXNlY3Rpb24nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB0aGlzLiRzdGF0dXMucmVtb3ZlQ2xhc3MoJ29uJyk7XG4gICAgICAgIHRoaXMuJHN0YXR1cy5hZGRDbGFzcygnb2ZmJyk7XG4gICAgICAgIHNldFRpbWVvdXQoJC5wcm94eSgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLiRhY3Rpb25NZW51LmZpbmQoJ2FbZGF0YS1hY3Rpb249ZGlzYWJsZV06Zmlyc3QnKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kYWN0aW9uTWVudS5maW5kKCdhW2RhdGEtYWN0aW9uPWVuYWJsZV06Zmlyc3QnKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH0pLCB0aGlzKSwgMjAwKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZSh0cnVlKTtcbiAgICB9LFxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICB0aGlzLiRmaWVsZHNDb250YWluZXIuZmluZCgnLmVuYWJsZS1ub3RpZmljYXRpb24tc2VjdGlvbicpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgdGhpcy4kc3RhdHVzLnJlbW92ZUNsYXNzKCdvZmYnKTtcbiAgICAgICAgdGhpcy4kc3RhdHVzLmFkZENsYXNzKCdvbicpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgkLnByb3h5KChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuJGFjdGlvbk1lbnUuZmluZCgnYVtkYXRhLWFjdGlvbj1kaXNhYmxlXTpmaXJzdCcpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRhY3Rpb25NZW51LmZpbmQoJ2FbZGF0YS1hY3Rpb249ZW5hYmxlXTpmaXJzdCcpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfSksIHRoaXMpLCAyMDApO1xuICAgIH0sXG5cbiAgICBcImRlbGV0ZVwiKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLnJlbW92ZSgpO1xuICAgIH0sXG5cbiAgICBzZXR0aW5ncygpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb2RhbCA9IG5ldyBTZXR0aW5nc01vZGFsKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kYWwuc2hvdygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNlY3Rpb25TZXR0aW5ncygpIHtcbiAgICAgICAgcmV0dXJuICQuZWFjaCh0aGlzLm1vZGFsLiRtb2RhbElucHV0cywgJC5wcm94eSgoZnVuY3Rpb24oaSwgaW5wdXQpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gJChpbnB1dCkudmFsKCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5wcmVwZW5kKCQoaW5wdXQpLmFkZENsYXNzKCdoaWRkZW4nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCB0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uTWVudU9wdGlvblNlbGVjdChvcHRpb24pIHtcbiAgICAgICAgbGV0ICRvcHRpb247XG4gICAgICAgICRvcHRpb24gPSAkKG9wdGlvbik7XG5cbiAgICAgICAgc3dpdGNoICgkb3B0aW9uLmRhdGEoJ2FjdGlvbicpKSB7XG4gICAgICAgICAgICBjYXNlICdjb2xsYXBzZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGFwc2UodHJ1ZSk7XG4gICAgICAgICAgICBjYXNlICdleHBhbmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4cGFuZCgpO1xuICAgICAgICAgICAgY2FzZSAnZGlzYWJsZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgICAgICAgY2FzZSAnZW5hYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV4cGFuZCgpO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tcImRlbGV0ZVwiXSgpO1xuICAgICAgICAgICAgY2FzZSAnc2V0dGluZ3MnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzKCk7XG4gICAgICAgIH1cbiAgICB9XG59KVxuXG5HYXJuaXNoLiRkb2MucmVhZHkoKCkgPT4ge1xuICAgICQoJy5zZWN0aW9uLWNvbGxhcHNpYmxlJykuZWFjaCgoaSwgZWwpID0+IHtcbiAgICAgICAgbmV3IHdpbmRvdy5Gb3JtQnVpbGRlclNlY3Rpb24oZWwsICQoZWwpLmRhdGEoJ3R5cGUnKSlcbiAgICB9KTtcblxuICAgIGlmIChDcmFmdC5lbGVtZW50SW5kZXgpIHtcbiAgICAgICAgQ3JhZnQuZWxlbWVudEluZGV4Lm9uKCdzZWxlY3RTb3VyY2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXBJZDtcbiAgICAgICAgICAgIGdyb3VwSWQgPSBlLnRhcmdldC4kc291cmNlLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIGlmIChncm91cElkKSB7XG4gICAgICAgICAgICAgICAgJCgnI25ldy1mb3JtLWJ0bicpLmF0dHIoXCJocmVmXCIsIENyYWZ0LmdldENwVXJsKCkgKyAoXCIvZm9ybWJ1aWxkZXIvZm9ybXMvbmV3P2dyb3VwSWQ9XCIgKyBncm91cElkKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNuZXctZm9ybS1idG4nKS5hdHRyKCdocmVmJywgQ3JhZnQuZ2V0Q3BVcmwoKSArICcvZm9ybWJ1aWxkZXIvZm9ybXMvbmV3P2dyb3VwSWQ9MScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmZiLWZvcm1zJykubGVuZ3RoID4gMCkge1xuICAgICAgICBuZXcgQ2xpcGJvYXJkKCcuY29weS1oYW5kbGUnLCB7XG4gICAgICAgICAgICB0YXJnZXQ6IGZ1bmN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlO1xuICAgICAgICAgICAgICAgIGhhbmRsZSA9ICQodHJpZ2dlcikuZGF0YSgnaGFuZGxlJyk7XG4gICAgICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KFwiRm9ybSBoYW5kbGUgYFwiICsgaGFuZGxlICsgXCJgIGNvcGllZFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBDbGlwYm9hcmQoJy50d2lnLXNuaXBwZXQnLCB7XG4gICAgICAgICAgICB0ZXh0OiBmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZSwgc25pcHBldDtcbiAgICAgICAgICAgICAgICBoYW5kbGUgPSAkKHRyaWdnZXIpLmRhdGEoJ2hhbmRsZScpO1xuICAgICAgICAgICAgICAgIHNuaXBwZXQgPSAne3sgY3JhZnQuZm9ybUJ1aWxkZXIuZm9ybShcIicgKyBoYW5kbGUgKyAnXCIpIH19JztcbiAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKHNuaXBwZXQgKyBDcmFmdC50KCcgY29waWVkJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzbmlwcGV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkKCcuZGVsZXRlLWZvcm0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogJCh0aGlzKS5kYXRhKCdpZCcpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGNvbmZpcm0oQ3JhZnQudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBmb3JtIGFuZCBhbGwgaXRzIGVudHJpZXM/XCIpKSkge1xuICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2Zvcm1zL2RlbGV0ZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdGb3JtIGRlbGV0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYCR7Q3JhZnQuZ2V0Q3BVcmwoKX0vZm9ybWJ1aWxkZXIvZm9ybXNgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLCB0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL2Zvcm1zLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==