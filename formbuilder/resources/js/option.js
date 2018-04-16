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
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ({

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),

/***/ 20:
/***/ (function(module, exports) {

var Option = void 0;

window.Option = Garnish.Base.extend({
    $container: null,
    $resultWrapper: null,
    $resultContainer: null,
    $toggle: null,
    $edit: null,
    $data: null,
    $inputs: null,
    enabled: false,
    editing: false,
    hasModal: false,
    hasTags: false,
    isTemplate: false,
    $enableCheckbox: null,
    $fields: null,

    init: function init(container) {
        var self = void 0;
        self = this;

        this.$container = $(container);
        this.$resultWrapper = this.$container.find('.option-wrapper');
        this.$resultContainer = this.$container.find('.option-result');
        this.$toggle = this.$container.find('.option-toggle');
        this.$edit = this.$container.find('.option-edit');

        if (this.$container.hasClass('tags')) {
            this.hasTags = true;
        }

        if (this.$container.hasClass('is-template')) {
            this.isTemplate = true;
        }

        this.$inputs = this.$container.data('inputs');
        this.$data = this.$container.data('modal');

        if (this.$data) {
            this.$fields = this.$data.fields;
            this.hasModal = true;
        }

        if (this.$inputs) {
            $.each(this.$inputs, function (i, item) {
                var name = void 0;
                if (item.type === 'checkbox') {
                    self.enabled = item.checked;
                    name = item.name;
                    self.$enableCheckbox = $('[name=\'' + name + '\']');
                } else {
                    self.enabled = true;
                }
            });
        }

        this.addListener(this.$toggle, 'click', 'toggle');
        this.addListener(this.$edit, 'click', 'edit');

        if (this.enabled) {
            this.editing = true;

            if (this.$data) {
                this.$edit.removeClass('hidden');
            }
        }
    },
    toggle: function toggle(e) {
        e.preventDefault();
        this.editing = false;

        if (this.$container.hasClass('option-enabled')) {
            this.$edit.addClass('hidden');
            this.$container.removeClass('option-enabled');
            this.$resultWrapper.addClass('hidden');
            this.$resultContainer.html('');
            this.$toggle.html('ENABLE');
            this.disableOption();
        } else {
            this.$edit.removeClass('hidden');
            this.$container.addClass('option-enabled');
            this.$toggle.html('DISABLE');
            this.enableOption();

            if (this.hasModal) {
                if (!this.modal) {
                    this.modal = new OptionModal(this);
                } else {
                    this.modal.$form.find('.fb-field').removeClass('error');
                    this.modal.$form[0].reset();
                    this.modal.show();
                }
            }
        }
    },
    edit: function edit(e) {
        e.preventDefault();
        var self = void 0;
        self = this;
        this.editing = true;

        if (this.editing) {
            if (!this.modal) {
                this.modal = new OptionModal(this);
            } else {
                this.modal.$form.find('.fb-field').removeClass('error');
                $.each(this.$inputs, function (i, item) {
                    var className = void 0;
                    var currentValue = void 0;

                    if (item.type !== 'checkbox') {
                        currentValue = $('[name=\'' + item.name + '\']').val();
                        className = item.name.replace(/[_\W]+/g, "-").slice(0, -1);

                        $.each(self.modal.$modalInputs, function (i, item) {
                            var input = void 0;
                            input = $(item);

                            if (input.hasClass(className)) {
                                input.val(currentValue);
                            }
                        });
                    }
                });

                this.modal.show();
            }
        }
    },
    disableOption: function disableOption() {
        this.$enableCheckbox.prop('checked', false);
    },
    enableOption: function enableOption() {
        if (this.$enableCheckbox) {
            this.$enableCheckbox.prop('checked', true);
        }
    },
    updateHtmlFromModal: function updateHtmlFromModal() {
        var self = void 0;
        self = this;
        var $resultHtml = void 0;
        var body = void 0;
        var index = void 0;
        var key = void 0;
        var name = void 0;
        var totalResults = void 0;
        var value = void 0;

        if (this.hasTags) {
            totalResults = this.$resultContainer.find('.result-item').length;

            if (totalResults) {
                index = totalResults;
            } else {
                index = 0;
            }

            $resultHtml = $('<div class="result-item" data-result-index="' + index + '">').appendTo(Garnish.$bod);
            name = $(this.modal.$modalInputs[0]).data('name');
            key = $(this.modal.$modalInputs[0]).val();
            value = $(this.modal.$modalInputs[1]).val();
            body = $(['<div class="option-result-actions">', '<a href="#" class="option-result-delete" title="' + Craft.t('Delete') + '"><svg width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><path d="M9.521064 18.5182504c-4.973493 0-9.019897-4.0510671-9.019897-9.030471 0-4.98018924 4.046404-9.0312563 9.019897-9.0312563s9.019897 4.05106706 9.019897 9.0312563c0 4.9794039-4.046404 9.030471-9.019897 9.030471zm0-16.05425785c-3.868359 0-7.015127 3.15021907-7.015127 7.02378685 0 3.8727824 3.146768 7.0237869 7.015127 7.0237869 3.86836 0 7.015127-3.1510045 7.015127-7.0237869 0-3.87356778-3.146767-7.02378685-7.015127-7.02378685zm3.167945 10.02870785c-.196085.1955634-.452564.2937378-.708258.2937378-.256479 0-.512958-.0981744-.709042-.2937378L9.521064 10.739699 7.77042 12.4927004c-.196085.1955634-.452564.2937378-.709043.2937378-.256478 0-.512957-.0981744-.708258-.2937378-.391385-.391912-.391385-1.0272965 0-1.4192086l1.750645-1.7530015-1.750645-1.7530015c-.391385-.391912-.391385-1.02729655 0-1.41920862.391385-.39191207 1.025131-.39191207 1.417301 0L9.521064 7.9012817l1.750645-1.75300152c.391385-.39191207 1.025915-.39191207 1.4173 0 .391385.39191207.391385 1.02729662 0 1.41920862l-1.750644 1.7530015 1.750644 1.7530015c.391385.3919121.391385 1.0272966 0 1.4192086z" fill="#8094A1" fill-rule="evenodd"/></svg></a>', '</div>', '<code><span class="option-key input-hint">' + key + '</span> ' + value + '</code>', '<input type="hidden" name="' + name + '[' + index + '][key]" value="' + key + '" />', '<input type="hidden" name="' + name + '[' + index + '][value]" value="' + value + '" />'].join('')).appendTo($resultHtml);
            this.$resultContainer.append($resultHtml);

            new Tag($resultHtml, this.modal);
        } else {
            if (this.isTemplate) {
                updateTemplateHtml(this.modal, this.$container);
            }

            this.$resultContainer.html('');

            $.each(this.modal.$modalInputs, function (i, item) {
                var hint = void 0;
                value = $(item).val();

                if (value) {
                    name = $(item).data('name');
                    hint = $(item).data('hint');
                    $('[name=\'' + name + '\']').val(value);
                    self.$resultContainer.append($('<code><span class=\'input-hint\'>' + hint + ':</span> ' + value + '</code>'));
                } else {
                    name = $(item).data('name');
                    hint = $(item).data('hint');
                    $('[name=\'' + name + '\']').val('');
                }
            });
        }

        this.$resultWrapper.removeClass('hidden');
    }
});

Garnish.$doc.ready(function () {
    return $('.option-item').each(function (i, el) {
        return new window.Option(el);
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvb3B0aW9uLmpzIl0sIm5hbWVzIjpbIk9wdGlvbiIsIndpbmRvdyIsIkdhcm5pc2giLCJCYXNlIiwiZXh0ZW5kIiwiJGNvbnRhaW5lciIsIiRyZXN1bHRXcmFwcGVyIiwiJHJlc3VsdENvbnRhaW5lciIsIiR0b2dnbGUiLCIkZWRpdCIsIiRkYXRhIiwiJGlucHV0cyIsImVuYWJsZWQiLCJlZGl0aW5nIiwiaGFzTW9kYWwiLCJoYXNUYWdzIiwiaXNUZW1wbGF0ZSIsIiRlbmFibGVDaGVja2JveCIsIiRmaWVsZHMiLCJpbml0IiwiY29udGFpbmVyIiwic2VsZiIsIiQiLCJmaW5kIiwiaGFzQ2xhc3MiLCJkYXRhIiwiZmllbGRzIiwiZWFjaCIsImkiLCJpdGVtIiwibmFtZSIsInR5cGUiLCJjaGVja2VkIiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVDbGFzcyIsInRvZ2dsZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImFkZENsYXNzIiwiaHRtbCIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iLCJtb2RhbCIsIk9wdGlvbk1vZGFsIiwiJGZvcm0iLCJyZXNldCIsInNob3ciLCJlZGl0IiwiY2xhc3NOYW1lIiwiY3VycmVudFZhbHVlIiwidmFsIiwicmVwbGFjZSIsInNsaWNlIiwiJG1vZGFsSW5wdXRzIiwiaW5wdXQiLCJwcm9wIiwidXBkYXRlSHRtbEZyb21Nb2RhbCIsIiRyZXN1bHRIdG1sIiwiYm9keSIsImluZGV4Iiwia2V5IiwidG90YWxSZXN1bHRzIiwidmFsdWUiLCJsZW5ndGgiLCJhcHBlbmRUbyIsIiRib2QiLCJDcmFmdCIsInQiLCJqb2luIiwiYXBwZW5kIiwiVGFnIiwidXBkYXRlVGVtcGxhdGVIdG1sIiwiaGludCIsIiRkb2MiLCJyZWFkeSIsImVsIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFF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SUFBUixDQUFhLE1BQWIsQ0FBUDtBQUNBK0MsMkJBQU9sRCxFQUFFTyxJQUFGLEVBQVFKLElBQVIsQ0FBYSxNQUFiLENBQVA7QUFDQUgsbUNBQVlRLElBQVosVUFBc0JvQixHQUF0QixDQUEwQlksS0FBMUI7QUFDQXpDLHlCQUFLZCxnQkFBTCxDQUFzQjhELE1BQXRCLENBQTZCL0Msd0NBQW9Da0QsSUFBcEMsaUJBQW9EVixLQUFwRCxhQUE3QjtBQUNILGlCQUxELE1BS087QUFDSGhDLDJCQUFPUixFQUFFTyxJQUFGLEVBQVFKLElBQVIsQ0FBYSxNQUFiLENBQVA7QUFDQStDLDJCQUFPbEQsRUFBRU8sSUFBRixFQUFRSixJQUFSLENBQWEsTUFBYixDQUFQO0FBQ0FILG1DQUFZUSxJQUFaLFVBQXNCb0IsR0FBdEIsQ0FBMEIsRUFBMUI7QUFDSDtBQUNKLGFBZEQ7QUFlSDs7QUFFRCxhQUFLNUMsY0FBTCxDQUFvQjRCLFdBQXBCLENBQWdDLFFBQWhDO0FBQ0g7QUFuTStCLENBQXBCLENBQWhCOztBQXNNQWhDLFFBQVF1RSxJQUFSLENBQWFDLEtBQWIsQ0FBbUI7QUFBQSxXQUFNcEQsRUFBRSxjQUFGLEVBQWtCSyxJQUFsQixDQUF1QixVQUFDQyxDQUFELEVBQUkrQyxFQUFKO0FBQUEsZUFBVyxJQUFJMUUsT0FBT0QsTUFBWCxDQUFrQjJFLEVBQWxCLENBQVg7QUFBQSxLQUF2QixDQUFOO0FBQUEsQ0FBbkIsRSIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL29wdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YTc4OWRlMjMyOThlMTkyYmQzNyIsImxldCBPcHRpb247XG5cbndpbmRvdy5PcHRpb24gPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkY29udGFpbmVyOiBudWxsLFxuICAgICRyZXN1bHRXcmFwcGVyOiBudWxsLFxuICAgICRyZXN1bHRDb250YWluZXI6IG51bGwsXG4gICAgJHRvZ2dsZTogbnVsbCxcbiAgICAkZWRpdDogbnVsbCxcbiAgICAkZGF0YTogbnVsbCxcbiAgICAkaW5wdXRzOiBudWxsLFxuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIGVkaXRpbmc6IGZhbHNlLFxuICAgIGhhc01vZGFsOiBmYWxzZSxcbiAgICBoYXNUYWdzOiBmYWxzZSxcbiAgICBpc1RlbXBsYXRlOiBmYWxzZSxcbiAgICAkZW5hYmxlQ2hlY2tib3g6IG51bGwsXG4gICAgJGZpZWxkczogbnVsbCxcblxuICAgIGluaXQoY29udGFpbmVyKSB7XG4gICAgICAgIGxldCBzZWxmO1xuICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuJHJlc3VsdFdyYXBwZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLm9wdGlvbi13cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuJHJlc3VsdENvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcub3B0aW9uLXJlc3VsdCcpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLm9wdGlvbi10b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kZWRpdCA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcub3B0aW9uLWVkaXQnKTtcblxuICAgICAgICBpZiAodGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCd0YWdzJykpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzVGFncyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdpcy10ZW1wbGF0ZScpKSB7XG4gICAgICAgICAgICB0aGlzLmlzVGVtcGxhdGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kaW5wdXRzID0gdGhpcy4kY29udGFpbmVyLmRhdGEoJ2lucHV0cycpO1xuICAgICAgICB0aGlzLiRkYXRhID0gdGhpcy4kY29udGFpbmVyLmRhdGEoJ21vZGFsJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuJGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuJGZpZWxkcyA9IHRoaXMuJGRhdGEuZmllbGRzO1xuICAgICAgICAgICAgdGhpcy5oYXNNb2RhbCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy4kaW5wdXRzKSB7XG4gICAgICAgICAgICAkLmVhY2godGhpcy4kaW5wdXRzLCAoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbmFibGVkID0gaXRlbS5jaGVja2VkO1xuICAgICAgICAgICAgICAgICAgICBuYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRlbmFibGVDaGVja2JveCA9ICQoYFtuYW1lPScke25hbWV9J11gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiR0b2dnbGUsICdjbGljaycsICd0b2dnbGUnKTtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRlZGl0LCAnY2xpY2snLCAnZWRpdCcpO1xuXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLiRkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWRpdC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgfSxcblxuICAgIHRvZ2dsZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuJGNvbnRhaW5lci5oYXNDbGFzcygnb3B0aW9uLWVuYWJsZWQnKSkge1xuICAgICAgICAgICAgdGhpcy4kZWRpdC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wdGlvbi1lbmFibGVkJyk7XG4gICAgICAgICAgICB0aGlzLiRyZXN1bHRXcmFwcGVyLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJHJlc3VsdENvbnRhaW5lci5odG1sKCcnKTtcbiAgICAgICAgICAgIHRoaXMuJHRvZ2dsZS5odG1sKCdFTkFCTEUnKTtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZU9wdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZWRpdC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ29wdGlvbi1lbmFibGVkJyk7XG4gICAgICAgICAgICB0aGlzLiR0b2dnbGUuaHRtbCgnRElTQUJMRScpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVPcHRpb24oKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTW9kYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubW9kYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RhbCA9IG5ldyBPcHRpb25Nb2RhbCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsLiRmb3JtLmZpbmQoJy5mYi1maWVsZCcpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsLiRmb3JtWzBdLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlZGl0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgc2VsZjtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZWRpdGluZykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbCA9IG5ldyBPcHRpb25Nb2RhbCh0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC4kZm9ybS5maW5kKCcuZmItZmllbGQnKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAkLmVhY2godGhpcy4kaW5wdXRzLCAoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgIT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9ICQoYFtuYW1lPScke2l0ZW0ubmFtZX0nXWApLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gaXRlbS5uYW1lLnJlcGxhY2UoL1tfXFxXXSsvZywgXCItXCIpLnNsaWNlKDAsIC0xKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHNlbGYubW9kYWwuJG1vZGFsSW5wdXRzLCAoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCA9ICQoaXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQuaGFzQ2xhc3MoY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGlzYWJsZU9wdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZW5hYmxlQ2hlY2tib3gucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgZW5hYmxlT3B0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy4kZW5hYmxlQ2hlY2tib3gpIHtcbiAgICAgICAgICAgIHRoaXMuJGVuYWJsZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVIdG1sRnJvbU1vZGFsKCkge1xuICAgICAgICBsZXQgc2VsZjtcbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCAkcmVzdWx0SHRtbDtcbiAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgbGV0IGtleTtcbiAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgIGxldCB0b3RhbFJlc3VsdHM7XG4gICAgICAgIGxldCB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5oYXNUYWdzKSB7XG4gICAgICAgICAgICB0b3RhbFJlc3VsdHMgPSB0aGlzLiRyZXN1bHRDb250YWluZXIuZmluZCgnLnJlc3VsdC1pdGVtJykubGVuZ3RoO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodG90YWxSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSB0b3RhbFJlc3VsdHM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHJlc3VsdEh0bWwgPSAkKGA8ZGl2IGNsYXNzPVwicmVzdWx0LWl0ZW1cIiBkYXRhLXJlc3VsdC1pbmRleD1cIiR7aW5kZXh9XCI+YCkuYXBwZW5kVG8oR2FybmlzaC4kYm9kKTtcbiAgICAgICAgICAgIG5hbWUgPSAkKHRoaXMubW9kYWwuJG1vZGFsSW5wdXRzWzBdKS5kYXRhKCduYW1lJyk7XG4gICAgICAgICAgICBrZXkgPSAkKHRoaXMubW9kYWwuJG1vZGFsSW5wdXRzWzBdKS52YWwoKTtcbiAgICAgICAgICAgIHZhbHVlID0gJCh0aGlzLm1vZGFsLiRtb2RhbElucHV0c1sxXSkudmFsKCk7XG4gICAgICAgICAgICBib2R5ID0gJChbJzxkaXYgY2xhc3M9XCJvcHRpb24tcmVzdWx0LWFjdGlvbnNcIj4nLCBgPGEgaHJlZj1cIiNcIiBjbGFzcz1cIm9wdGlvbi1yZXN1bHQtZGVsZXRlXCIgdGl0bGU9XCIke0NyYWZ0LnQoJ0RlbGV0ZScpfVwiPjxzdmcgd2lkdGg9XCIxOVwiIGhlaWdodD1cIjE5XCIgdmlld0JveD1cIjAgMCAxOSAxOVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTkuNTIxMDY0IDE4LjUxODI1MDRjLTQuOTczNDkzIDAtOS4wMTk4OTctNC4wNTEwNjcxLTkuMDE5ODk3LTkuMDMwNDcxIDAtNC45ODAxODkyNCA0LjA0NjQwNC05LjAzMTI1NjMgOS4wMTk4OTctOS4wMzEyNTYzczkuMDE5ODk3IDQuMDUxMDY3MDYgOS4wMTk4OTcgOS4wMzEyNTYzYzAgNC45Nzk0MDM5LTQuMDQ2NDA0IDkuMDMwNDcxLTkuMDE5ODk3IDkuMDMwNDcxem0wLTE2LjA1NDI1Nzg1Yy0zLjg2ODM1OSAwLTcuMDE1MTI3IDMuMTUwMjE5MDctNy4wMTUxMjcgNy4wMjM3ODY4NSAwIDMuODcyNzgyNCAzLjE0Njc2OCA3LjAyMzc4NjkgNy4wMTUxMjcgNy4wMjM3ODY5IDMuODY4MzYgMCA3LjAxNTEyNy0zLjE1MTAwNDUgNy4wMTUxMjctNy4wMjM3ODY5IDAtMy44NzM1Njc3OC0zLjE0Njc2Ny03LjAyMzc4Njg1LTcuMDE1MTI3LTcuMDIzNzg2ODV6bTMuMTY3OTQ1IDEwLjAyODcwNzg1Yy0uMTk2MDg1LjE5NTU2MzQtLjQ1MjU2NC4yOTM3Mzc4LS43MDgyNTguMjkzNzM3OC0uMjU2NDc5IDAtLjUxMjk1OC0uMDk4MTc0NC0uNzA5MDQyLS4yOTM3Mzc4TDkuNTIxMDY0IDEwLjczOTY5OSA3Ljc3MDQyIDEyLjQ5MjcwMDRjLS4xOTYwODUuMTk1NTYzNC0uNDUyNTY0LjI5MzczNzgtLjcwOTA0My4yOTM3Mzc4LS4yNTY0NzggMC0uNTEyOTU3LS4wOTgxNzQ0LS43MDgyNTgtLjI5MzczNzgtLjM5MTM4NS0uMzkxOTEyLS4zOTEzODUtMS4wMjcyOTY1IDAtMS40MTkyMDg2bDEuNzUwNjQ1LTEuNzUzMDAxNS0xLjc1MDY0NS0xLjc1MzAwMTVjLS4zOTEzODUtLjM5MTkxMi0uMzkxMzg1LTEuMDI3Mjk2NTUgMC0xLjQxOTIwODYyLjM5MTM4NS0uMzkxOTEyMDcgMS4wMjUxMzEtLjM5MTkxMjA3IDEuNDE3MzAxIDBMOS41MjEwNjQgNy45MDEyODE3bDEuNzUwNjQ1LTEuNzUzMDAxNTJjLjM5MTM4NS0uMzkxOTEyMDcgMS4wMjU5MTUtLjM5MTkxMjA3IDEuNDE3MyAwIC4zOTEzODUuMzkxOTEyMDcuMzkxMzg1IDEuMDI3Mjk2NjIgMCAxLjQxOTIwODYybC0xLjc1MDY0NCAxLjc1MzAwMTUgMS43NTA2NDQgMS43NTMwMDE1Yy4zOTEzODUuMzkxOTEyMS4zOTEzODUgMS4wMjcyOTY2IDAgMS40MTkyMDg2elwiIGZpbGw9XCIjODA5NEExXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiLz48L3N2Zz48L2E+YCwgJzwvZGl2PicsIGA8Y29kZT48c3BhbiBjbGFzcz1cIm9wdGlvbi1rZXkgaW5wdXQtaGludFwiPiR7a2V5fTwvc3Bhbj4gJHt2YWx1ZX08L2NvZGU+YCwgYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7bmFtZX1bJHtpbmRleH1dW2tleV1cIiB2YWx1ZT1cIiR7a2V5fVwiIC8+YCwgYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIiR7bmFtZX1bJHtpbmRleH1dW3ZhbHVlXVwiIHZhbHVlPVwiJHt2YWx1ZX1cIiAvPmBdLmpvaW4oJycpKS5hcHBlbmRUbygkcmVzdWx0SHRtbCk7XG4gICAgICAgICAgICB0aGlzLiRyZXN1bHRDb250YWluZXIuYXBwZW5kKCRyZXN1bHRIdG1sKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3IFRhZygkcmVzdWx0SHRtbCwgdGhpcy5tb2RhbCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVUZW1wbGF0ZUh0bWwodGhpcy5tb2RhbCwgdGhpcy4kY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kcmVzdWx0Q29udGFpbmVyLmh0bWwoJycpO1xuXG4gICAgICAgICAgICAkLmVhY2godGhpcy5tb2RhbC4kbW9kYWxJbnB1dHMsIChpLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGhpbnQ7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkKGl0ZW0pLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkKGl0ZW0pLmRhdGEoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgaGludCA9ICQoaXRlbSkuZGF0YSgnaGludCcpO1xuICAgICAgICAgICAgICAgICAgICAkKGBbbmFtZT0nJHtuYW1lfSddYCkudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kcmVzdWx0Q29udGFpbmVyLmFwcGVuZCgkKGA8Y29kZT48c3BhbiBjbGFzcz0naW5wdXQtaGludCc+JHtoaW50fTo8L3NwYW4+ICR7dmFsdWV9PC9jb2RlPmApKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuYW1lID0gJChpdGVtKS5kYXRhKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIGhpbnQgPSAkKGl0ZW0pLmRhdGEoJ2hpbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgJChgW25hbWU9JyR7bmFtZX0nXWApLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH1cbn0pO1xuXG5HYXJuaXNoLiRkb2MucmVhZHkoKCkgPT4gJCgnLm9wdGlvbi1pdGVtJykuZWFjaCgoaSwgZWwpID0+IG5ldyB3aW5kb3cuT3B0aW9uKGVsKSkpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL29wdGlvbi5qcyJdLCJzb3VyY2VSb290IjoiIn0=