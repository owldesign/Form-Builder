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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

var _this3 = this;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var WriteNoteWidget = void 0;

WriteNoteWidget = Garnish.Base.extend({
    $widget: null,
    $btn: null,
    $list: null,
    $noteTextarea: null,
    $spinner: null,

    modal: null,
    note: null,
    entryId: null,

    init: function init(widget) {
        this.$widget = $(widget);
        this.$btn = this.$widget.find('#write-note-btn');
        this.$list = this.$widget.find('.list');
        this.$spinner = this.$widget.find('.loader');

        this.entryId = this.$widget.data('entry-id');

        this.addListener(this.$btn, 'click', 'openNoteModel');
    },
    openNoteModel: function openNoteModel(e) {
        e.preventDefault();

        if (this.modal) {
            delete this.modal;
            this.modal = new NoteModal(this);
        } else {
            this.modal = new NoteModal(this);
        }

        this.modal.on('save', $.proxy(this, 'updateNotes'));
    },
    updateNotes: function updateNotes(data) {
        var _this = this;

        this.$spinner.removeClass('hidden');

        data = {
            note: this.note,
            entryId: this.entryId
        };

        Craft.postActionRequest('formBuilder/notes/save', data, $.proxy(function (response, textStatus) {
            if (textStatus === 'success') {
                Craft.cp.displayNotice(Craft.t('Note added'));
                _this.$spinner.addClass('hidden');
                _this.updateNotesHtml(response);
            }
        }, this));

        this.modal.hide();
    },
    updateNotesHtml: function updateNotesHtml(data) {
        var author = void 0;
        var note = void 0;
        console.log(data);
        note = data.note.note;
        author = data.user.fullName;

        $markup = $('<div class="list-item pad">' + '<div class="item-meta">' + '<span class="item-meta-icon"><i class="far fa-user"></i></span>' + '<span class="item-meta-title">' + author + '</span>' + '<span class="item-meta-right">' + Craft.t('Now') + '</span>' + '</div>' + '<div class="item-title">' + note + '</div>' + '</div>');

        this.$list.prepend($markup);
        $('.no-items').remove();
    }
});

NoteModal = Garnish.Modal.extend({
    widget: null,

    init: function init(widget) {
        var body, self;
        self = this;
        this.base();

        this.widget = widget;

        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);

        body = $(['<header>', '<span class="modal-title">' + Craft.t('Note') + '</span>', '<div class="instructions">' + Craft.t('Leave a note for this entry') + '</div>', '</header>', '<div class="body">', '<div class="fb-field">', '<div class="input-hint">TEXT</div>', '<div class="input"><textarea id="note-text" rows="6"></textarea></div>', '</div>', '</div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Add') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);

        this.show();
        this.$saveBtn = body.find('.submit');
        this.$cancelBtn = body.find('.cancel');
        this.$noteTextarea = body.find('#note-text');

        this.addListener(this.$cancelBtn, 'click', 'hide');
        this.addListener(this.$form, 'submit', 'save');
    },
    save: function save(e) {
        e.preventDefault();
        this.note = this.$noteTextarea.val();
        this.widget.note = this.note;

        if (this.note == '') {
            Garnish.shake(this.$container);
        } else {
            this.trigger('save', {
                note: this.note
            });
        }
    }
});

AssetManagement = Garnish.Base.extend({
    $container: null,
    $elements: null,
    $form: null,
    $trigger: null,

    downloadCount: null,

    init: function init(container) {
        var _this2 = this;

        this.$container = $(container);
        this.$elements = this.$container.find('.item-asset');

        this.$form = this.$container.find('#download-all-assets');
        this.$trigger = this.$form.find('button');
        this.downloadCount = this.$form.find('.asset-count');
        this.$status = $('.download-status', this.$form);

        this.$elements.each(function (i, el) {
            element = new AssetFile(el, _this2);
        });

        this.addListener(this.$form, 'submit', 'onSubmit');
    },
    updateDownloadBtn: function updateDownloadBtn() {
        items = Object.keys(AssetManagement.storage).length;

        if (items > 0) {
            this.downloadCount.html(items);
            this.$trigger.removeClass('hidden');
        } else {
            this.$trigger.addClass('hidden');
            this.downloadCount.html('0');
        }
    },
    onSubmit: function onSubmit(e) {
        e.preventDefault();

        if (!this.$trigger.hasClass('disabled')) {
            if (!this.progressBar) {
                this.progressBar = new Craft.ProgressBar(this.$status);
            } else {
                this.progressBar.resetProgressBar();
            }

            this.progressBar.$progressBar.removeClass('hidden');

            this.progressBar.$progressBar.velocity('stop').velocity({
                opacity: 1
            }, {
                complete: $.proxy(function () {
                    var postData = Garnish.getPostData(this.$form);
                    var params = Craft.expandPostArray(postData);

                    params.assets = items = AssetManagement.storage;

                    var data = {
                        params: params
                    };

                    Craft.postActionRequest(params.action, data, $.proxy(function (response, textStatus) {
                        if (textStatus === 'success') {
                            if (response && response.error) {
                                alert(response.error);
                            }

                            this.updateProgressBar();

                            if (response && response.downloadFile) {
                                var $iframe = $('<iframe/>', { 'src': Craft.getActionUrl('formBuilder/assets/downloadFile', { 'filename': response.downloadFile }) }).hide();
                                this.$form.append($iframe);
                            }

                            setTimeout($.proxy(this, 'onComplete'), 300);
                        } else {
                            Craft.cp.displayError(Craft.t('There was a problem downloading assets. Please check the Craft logs.'));

                            this.onComplete(false);
                        }
                    }, this), {
                        complete: $.noop
                    });
                }, this)
            });

            if (this.$allDone) {
                this.$allDone.css('opacity', 0);
            }

            this.$trigger.addClass('disabled');
            this.$trigger.trigger('blur');
        }
    },


    updateProgressBar: function updateProgressBar() {
        var width = 100;
        this.progressBar.setProgressPercentage(width);
    },

    onComplete: function onComplete(showAllDone) {
        this.progressBar.$progressBar.velocity({ opacity: 0 }, {
            duration: 'fast',
            complete: $.proxy(function () {
                this.$trigger.removeClass('disabled');
                this.$trigger.trigger('focus');
            }, this)
        });

        Craft.cp.displayNotice(Craft.t('Download complete...'));

        $('.item-asset').removeClass('selected');
        $('.asset-select').removeClass('active');
    }

}, {
    storage: {},

    setStorage: function setStorage(namespace, key, value) {
        var remove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (_typeof(AssetManagement.storage[namespace]) == ( true ? 'undefined' : _typeof(undefined))) {
            AssetManagement.storage[namespace] = {};
        }

        if (remove) {
            delete AssetManagement.storage[namespace];
        } else {
            AssetManagement.storage[namespace][key] = value;
        }
    },
    getStorage: function getStorage(namespace, key) {
        if (AssetManagement.storage[namespace] && AssetManagement.storage[namespace][key]) {
            return AssetManagement.storage[namespace][key];
        }

        return null;
    }
});

AssetFile = Garnish.Base.extend({
    element: null,
    $selectBtn: null,

    parent: null,
    id: null,

    init: function init(element, parent) {
        this.parent = parent;
        this.element = $(element);
        this.$selectBtn = this.element.find('.asset-select');
        this.id = this.$selectBtn.data('asset-id');

        this.addListener(this.$selectBtn, 'click', 'toggleSelection');
    },
    toggleSelection: function toggleSelection() {
        if (this.$selectBtn.hasClass('active')) {
            this.$selectBtn.removeClass('active');
            this.element.removeClass('selected');
            AssetManagement.setStorage(this.id, 'asset', this.id, true);
        } else {
            this.element.addClass('selected');
            this.$selectBtn.addClass('active');
            AssetManagement.setStorage(this.id, 'asset', this.id);
        }

        this.parent.updateDownloadBtn();
    }
});

Garnish.$doc.ready(function () {

    new WriteNoteWidget('.notes-widget');
    new AssetManagement('#main');

    if (Craft.elementIndex) {
        Craft.elementIndex.on('updateElements', function (e) {
            var elementsCount = void 0;
            var selectedSource = void 0;
            var unreadItems = void 0;

            Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(function (response, textStatus) {
                if (response.success) {
                    window.FormBuilder.unreadCount = response.count;

                    if (response.count > 0) {
                        return $('.total-entry-count').html(response.count);
                    } else {
                        return $('.total-entry-count').html('');
                    }
                }
            }, this));

            selectedSource = e.target.instanceState.selectedSource;

            if (e.target.view._totalVisible === 0) {
                e.target.view.$elementContainer.html($('<tr><td colspan="6">' + Craft.t("No entries available") + '</td></tr>'));
            }

            // Update unread count utility nav
            Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(function (response, textStatus) {
                if (textStatus === 'success') {
                    $('#sources .entry-count').html('');
                    $.each(response.grouped, function (key, entries) {
                        $('[data-key="formId:' + key + '"]').find('.entry-count').html(entries.length);
                    });

                    if (response.totalCount > 0) {
                        $('.fb-unread-container .fb-badge').addClass('show');
                        $('.fb-unread-container .fb-badge .count').html(response.totalCount);
                        $('#unread-notifications').find('.body').html(response.template);
                    } else {
                        $('.fb-unread-container .fb-badge').removeClass('show');
                        $('.fb-unread-container .fb-badge .count').html('');
                        $('#unread-notifications').find('.body').html('<p class="no-content">' + Craft.t('No unread submissions.') + '</p>');
                    }
                }
            }, this));
        });
    }
    // TODO: delete entry and all assets and notes
    $('#delete-entry').on('click', function (e) {
        var entryId = $(e.currentTarget).data('entry-id');
        var data = {
            id: entryId
        };

        if (confirm(Craft.t("Deleting entry will remove all relevant assets and notes, are you sure?"))) {
            Craft.postActionRequest('formBuilder/entry/delete', data, $.proxy(function (response, textStatus) {
                if (textStatus === 'success') {
                    Craft.cp.displayNotice(Craft.t('Deleting entry...'));

                    setTimeout(function () {
                        window.location.href = Craft.getCpUrl() + '/formbuilder/entries';
                    }, 1000);
                }
            }, _this3));
        }
    });

    $('.submission-action-trigger').on('click', function (e) {
        e.preventDefault();

        var $menu = void 0;
        var entryId = void 0;
        var fileIds = void 0;
        var formId = void 0;
        var type = void 0;

        type = $(this).data('type');
        formId = $(this).data('form-id');
        entryId = $(this).data('entry-id');
        fileIds = $(this).data('file-ids');
        $menu = $('<div class="tout-dropdown"/>').html('<ul class="form-item-menu">' + '</ul>');

        if (type === 'submission') {
            $('<li><a href="#" class="delete-submission">Delete Submission</a></li>').appendTo($menu.find('ul'));
        } else if (type === 'form') {
            $('<li><a href="' + window.FormBuilder.adminUrl + '/forms/' + formId + '">View Form</a></li>').appendTo($menu.find('ul'));
        } else if (type === 'uploads') {
            $('<li><a href="' + window.FormBuilder.adminUrl + '/entries" class="delete-all-files">Delete All</a></li>').appendTo($menu.find('ul'));
            $('<li><a href="' + window.FormBuilder.adminUrl + '/entries" class="download-all-files">Download All</a></li>').appendTo($menu.find('ul'));
        }

        new Garnish.HUD($(this), $menu, {
            hudClass: 'hud fb-hud submissionhud',
            closeOtherHUDs: false
        });

        $menu.find('.delete-submission').on('click', function (e) {
            e.preventDefault();
            var data = void 0;
            data = {
                id: entryId
            };

            if (confirm(Craft.t("Are you sure you want to delete this entry?"))) {
                Craft.postActionRequest('formBuilder/entry/delete', data, $.proxy(function (response, textStatus) {
                    if (textStatus === 'success') {
                        Craft.cp.displayNotice(Craft.t('Entry deleted'));
                        window.location.href = window.FormBuilder.adminUrl + '/entries';
                    }
                }, this));
            }
        });

        $menu.find('.delete-all-files').on('click', function (e) {
            var data = void 0;
            e.preventDefault();
            data = {
                fileId: fileIds
            };

            if (confirm(Craft.t("Are you sure you want to delete all files?"))) {
                Craft.postActionRequest('assets/deleteFile', data, $.proxy(function (response, textStatus) {
                    var hudID = void 0;
                    if (response.success) {
                        for (hudID in Garnish.HUD.activeHUDs) {
                            Garnish.HUD.activeHUDs[hudID].hide();
                        }

                        $('.upload-details').parent().velocity('fadeOut', {
                            duration: '100'
                        });

                        return setTimeout(function () {
                            return $('.upload-details').parent().remove();
                        }, 100);
                    }
                }, this));
            }
        });

        $menu.find('.download-all-files').on('click', function (e) {
            e.preventDefault();
            var data = void 0;
            Craft.cp.displayNotice(Craft.t('Downloading...'));
            data = {
                ids: fileIds,
                formId: formId
            };

            Craft.postActionRequest('formBuilder/entry/downloadAllFiles', data, $.proxy(function (response, textStatus) {
                var hudID = void 0;
                var results = void 0;
                if (response.success) {
                    window.location = '/actions/formbuilder/entry/downloadFiles?filePath=' + response.filePath;
                    Craft.cp.displayNotice(Craft.t('Download Successful'));
                } else {
                    Craft.cp.displayError(Craft.t(response.message));
                }

                results = [];

                for (hudID in Garnish.HUD.activeHUDs) {
                    results.push(Garnish.HUD.activeHUDs[hudID].hide());
                }

                return results;
            }, this));
        });
    });
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjg0MzdmYmVmZjI0NzM0NjRkYzEiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZW50cmllcy5qcyJdLCJuYW1lcyI6WyJXcml0ZU5vdGVXaWRnZXQiLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsIiR3aWRnZXQiLCIkYnRuIiwiJGxpc3QiLCIkbm90ZVRleHRhcmVhIiwiJHNwaW5uZXIiLCJtb2RhbCIsIm5vdGUiLCJlbnRyeUlkIiwiaW5pdCIsIndpZGdldCIsIiQiLCJmaW5kIiwiZGF0YSIsImFkZExpc3RlbmVyIiwib3Blbk5vdGVNb2RlbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIk5vdGVNb2RhbCIsIm9uIiwicHJveHkiLCJ1cGRhdGVOb3RlcyIsInJlbW92ZUNsYXNzIiwiQ3JhZnQiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInJlc3BvbnNlIiwidGV4dFN0YXR1cyIsImNwIiwiZGlzcGxheU5vdGljZSIsInQiLCJhZGRDbGFzcyIsInVwZGF0ZU5vdGVzSHRtbCIsImhpZGUiLCJhdXRob3IiLCJjb25zb2xlIiwibG9nIiwidXNlciIsImZ1bGxOYW1lIiwiJG1hcmt1cCIsInByZXBlbmQiLCJyZW1vdmUiLCJNb2RhbCIsImJvZHkiLCJzZWxmIiwiYmFzZSIsIiRmb3JtIiwiYXBwZW5kVG8iLCIkYm9kIiwic2V0Q29udGFpbmVyIiwiam9pbiIsInNob3ciLCIkc2F2ZUJ0biIsIiRjYW5jZWxCdG4iLCJzYXZlIiwidmFsIiwic2hha2UiLCIkY29udGFpbmVyIiwidHJpZ2dlciIsIkFzc2V0TWFuYWdlbWVudCIsIiRlbGVtZW50cyIsIiR0cmlnZ2VyIiwiZG93bmxvYWRDb3VudCIsImNvbnRhaW5lciIsIiRzdGF0dXMiLCJlYWNoIiwiaSIsImVsIiwiZWxlbWVudCIsIkFzc2V0RmlsZSIsInVwZGF0ZURvd25sb2FkQnRuIiwiaXRlbXMiLCJPYmplY3QiLCJrZXlzIiwic3RvcmFnZSIsImxlbmd0aCIsImh0bWwiLCJvblN1Ym1pdCIsImhhc0NsYXNzIiwicHJvZ3Jlc3NCYXIiLCJQcm9ncmVzc0JhciIsInJlc2V0UHJvZ3Jlc3NCYXIiLCIkcHJvZ3Jlc3NCYXIiLCJ2ZWxvY2l0eSIsIm9wYWNpdHkiLCJjb21wbGV0ZSIsInBvc3REYXRhIiwiZ2V0UG9zdERhdGEiLCJwYXJhbXMiLCJleHBhbmRQb3N0QXJyYXkiLCJhc3NldHMiLCJhY3Rpb24iLCJlcnJvciIsImFsZXJ0IiwidXBkYXRlUHJvZ3Jlc3NCYXIiLCJkb3dubG9hZEZpbGUiLCIkaWZyYW1lIiwiZ2V0QWN0aW9uVXJsIiwiYXBwZW5kIiwic2V0VGltZW91dCIsImRpc3BsYXlFcnJvciIsIm9uQ29tcGxldGUiLCJub29wIiwiJGFsbERvbmUiLCJjc3MiLCJ3aWR0aCIsInNldFByb2dyZXNzUGVyY2VudGFnZSIsInNob3dBbGxEb25lIiwiZHVyYXRpb24iLCJzZXRTdG9yYWdlIiwibmFtZXNwYWNlIiwia2V5IiwidmFsdWUiLCJ1bmRlZmluZWQiLCJnZXRTdG9yYWdlIiwiJHNlbGVjdEJ0biIsInBhcmVudCIsImlkIiwidG9nZ2xlU2VsZWN0aW9uIiwiJGRvYyIsInJlYWR5IiwiZWxlbWVudEluZGV4IiwiZWxlbWVudHNDb3VudCIsInNlbGVjdGVkU291cmNlIiwidW5yZWFkSXRlbXMiLCJzdWNjZXNzIiwid2luZG93IiwiRm9ybUJ1aWxkZXIiLCJ1bnJlYWRDb3VudCIsImNvdW50IiwidGFyZ2V0IiwiaW5zdGFuY2VTdGF0ZSIsInZpZXciLCJfdG90YWxWaXNpYmxlIiwiJGVsZW1lbnRDb250YWluZXIiLCJncm91cGVkIiwiZW50cmllcyIsInRvdGFsQ291bnQiLCJ0ZW1wbGF0ZSIsImN1cnJlbnRUYXJnZXQiLCJjb25maXJtIiwibG9jYXRpb24iLCJocmVmIiwiZ2V0Q3BVcmwiLCIkbWVudSIsImZpbGVJZHMiLCJmb3JtSWQiLCJ0eXBlIiwiYWRtaW5VcmwiLCJIVUQiLCJodWRDbGFzcyIsImNsb3NlT3RoZXJIVURzIiwiZmlsZUlkIiwiaHVkSUQiLCJhY3RpdmVIVURzIiwiaWRzIiwicmVzdWx0cyIsImZpbGVQYXRoIiwibWVzc2FnZSIsInB1c2giXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsSUFBSUEsd0JBQUo7O0FBRUFBLGtCQUFrQkMsUUFBUUMsSUFBUixDQUFhQyxNQUFiLENBQW9CO0FBQ2xDQyxhQUFTLElBRHlCO0FBRWxDQyxVQUFNLElBRjRCO0FBR2xDQyxXQUFPLElBSDJCO0FBSWxDQyxtQkFBZSxJQUptQjtBQUtsQ0MsY0FBVSxJQUx3Qjs7QUFPbENDLFdBQU8sSUFQMkI7QUFRbENDLFVBQU0sSUFSNEI7QUFTbENDLGFBQVMsSUFUeUI7O0FBV2xDQyxRQVhrQyxnQkFXN0JDLE1BWDZCLEVBV3JCO0FBQ1QsYUFBS1QsT0FBTCxHQUFlVSxFQUFFRCxNQUFGLENBQWY7QUFDQSxhQUFLUixJQUFMLEdBQVksS0FBS0QsT0FBTCxDQUFhVyxJQUFiLENBQWtCLGlCQUFsQixDQUFaO0FBQ0EsYUFBS1QsS0FBTCxHQUFhLEtBQUtGLE9BQUwsQ0FBYVcsSUFBYixDQUFrQixPQUFsQixDQUFiO0FBQ0EsYUFBS1AsUUFBTCxHQUFnQixLQUFLSixPQUFMLENBQWFXLElBQWIsQ0FBa0IsU0FBbEIsQ0FBaEI7O0FBRUEsYUFBS0osT0FBTCxHQUFlLEtBQUtQLE9B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LE1BQU1NLENBQU4sQ0FBUUosU0FBU29JLE9BQWpCLENBQXRCO0FBQ0g7O0FBRURGLDBCQUFVLEVBQVY7O0FBRUEscUJBQUtILEtBQUwsSUFBYzFKLFFBQVFzSixHQUFSLENBQVlLLFVBQTFCLEVBQXNDO0FBQ2xDRSw0QkFBUUcsSUFBUixDQUFhaEssUUFBUXNKLEdBQVIsQ0FBWUssVUFBWixDQUF1QkQsS0FBdkIsRUFBOEJ4SCxJQUE5QixFQUFiO0FBQ0g7O0FBRUQsdUJBQU8ySCxPQUFQO0FBQ0gsYUFqQm1FLEVBaUJoRSxJQWpCZ0UsQ0FBcEU7QUFrQkgsU0EzQkQ7QUE2QkgsS0FwR0Q7QUFxR0gsQ0E1S0QsRSIsImZpbGUiOiIvZm9ybWJ1aWxkZXIvcmVzb3VyY2VzL2pzL2VudHJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyODQzN2ZiZWZmMjQ3MzQ2NGRjMSIsImxldCBXcml0ZU5vdGVXaWRnZXRcblxuV3JpdGVOb3RlV2lkZ2V0ID0gR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgJHdpZGdldDogbnVsbCxcbiAgICAkYnRuOiBudWxsLFxuICAgICRsaXN0OiBudWxsLFxuICAgICRub3RlVGV4dGFyZWE6IG51bGwsXG4gICAgJHNwaW5uZXI6IG51bGwsXG5cbiAgICBtb2RhbDogbnVsbCxcbiAgICBub3RlOiBudWxsLFxuICAgIGVudHJ5SWQ6IG51bGwsXG5cbiAgICBpbml0KHdpZGdldCkge1xuICAgICAgICB0aGlzLiR3aWRnZXQgPSAkKHdpZGdldClcbiAgICAgICAgdGhpcy4kYnRuID0gdGhpcy4kd2lkZ2V0LmZpbmQoJyN3cml0ZS1ub3RlLWJ0bicpXG4gICAgICAgIHRoaXMuJGxpc3QgPSB0aGlzLiR3aWRnZXQuZmluZCgnLmxpc3QnKVxuICAgICAgICB0aGlzLiRzcGlubmVyID0gdGhpcy4kd2lkZ2V0LmZpbmQoJy5sb2FkZXInKVxuXG4gICAgICAgIHRoaXMuZW50cnlJZCA9IHRoaXMuJHdpZGdldC5kYXRhKCdlbnRyeS1pZCcpXG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRidG4sICdjbGljaycsICdvcGVuTm90ZU1vZGVsJylcbiAgICB9LFxuXG4gICAgb3Blbk5vdGVNb2RlbChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGlmICh0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tb2RhbFxuICAgICAgICAgICAgdGhpcy5tb2RhbCA9IG5ldyBOb3RlTW9kYWwodGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWwgPSBuZXcgTm90ZU1vZGFsKHRoaXMpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMubW9kYWwub24oJ3NhdmUnLCAkLnByb3h5KHRoaXMsICd1cGRhdGVOb3RlcycpKVxuICAgIH0sXG5cbiAgICB1cGRhdGVOb3RlcyhkYXRhKSB7XG4gICAgICAgIHRoaXMuJHNwaW5uZXIucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG5cbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgIG5vdGU6IHRoaXMubm90ZSxcbiAgICAgICAgICAgIGVudHJ5SWQ6IHRoaXMuZW50cnlJZFxuICAgICAgICB9XG5cbiAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL25vdGVzL3NhdmUnLCBkYXRhLCAkLnByb3h5KCgocmVzcG9uc2UsIHRleHRTdGF0dXMpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ05vdGUgYWRkZWQnKSlcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGlubmVyLmFkZENsYXNzKCdoaWRkZW4nKVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTm90ZXNIdG1sKHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgdGhpcykpXG5cbiAgICAgICAgdGhpcy5tb2RhbC5oaWRlKClcbiAgICB9LFxuXG4gICAgdXBkYXRlTm90ZXNIdG1sKGRhdGEpIHtcbiAgICAgICAgbGV0IGF1dGhvclxuICAgICAgICBsZXQgbm90ZVxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICBub3RlID0gZGF0YS5ub3RlLm5vdGVcbiAgICAgICAgYXV0aG9yID0gZGF0YS51c2VyLmZ1bGxOYW1lXG5cbiAgICAgICAgJG1hcmt1cCA9ICQoJzxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0gcGFkXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpdGVtLW1ldGFcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaXRlbS1tZXRhLWljb25cIj48aSBjbGFzcz1cImZhciBmYS11c2VyXCI+PC9pPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaXRlbS1tZXRhLXRpdGxlXCI+JyArIGF1dGhvciArICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIml0ZW0tbWV0YS1yaWdodFwiPicgKyBDcmFmdC50KCdOb3cnKSArICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaXRlbS10aXRsZVwiPicgKyBub3RlICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzwvZGl2PicpXG5cbiAgICAgICAgdGhpcy4kbGlzdC5wcmVwZW5kKCRtYXJrdXApXG4gICAgICAgICQoJy5uby1pdGVtcycpLnJlbW92ZSgpXG4gICAgfVxuXG59KVxuXG5Ob3RlTW9kYWwgPSBHYXJuaXNoLk1vZGFsLmV4dGVuZCh7XG4gICAgd2lkZ2V0OiBudWxsLFxuXG4gICAgaW5pdCh3aWRnZXQpIHtcbiAgICAgICAgdmFyIGJvZHksIHNlbGZcbiAgICAgICAgc2VsZiA9IHRoaXNcbiAgICAgICAgdGhpcy5iYXNlKClcblxuICAgICAgICB0aGlzLndpZGdldCA9IHdpZGdldFxuXG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKCc8Zm9ybSBjbGFzcz1cIm1vZGFsIGZpdHRlZCBmb3JtYnVpbGRlci1tb2RhbFwiPicpLmFwcGVuZFRvKEdhcm5pc2guJGJvZClcbiAgICAgICAgdGhpcy5zZXRDb250YWluZXIodGhpcy4kZm9ybSlcbiAgICAgICAgXG4gICAgICAgIGJvZHkgPSAkKFtcbiAgICAgICAgICAgICc8aGVhZGVyPicsIFxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+JyArIENyYWZ0LnQoJ05vdGUnKSArICc8L3NwYW4+JywgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnN0cnVjdGlvbnNcIj4nICsgQ3JhZnQudCgnTGVhdmUgYSBub3RlIGZvciB0aGlzIGVudHJ5JykgKyAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPC9oZWFkZXI+JywgXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvZHlcIj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZiLWZpZWxkXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnB1dC1oaW50XCI+VEVYVDwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaW5wdXRcIj48dGV4dGFyZWEgaWQ9XCJub3RlLXRleHRcIiByb3dzPVwiNlwiPjwvdGV4dGFyZWE+PC9kaXY+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzwvZGl2PicsIFxuICAgICAgICAgICAgJzxmb290ZXIgY2xhc3M9XCJmb290ZXJcIj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5zIGJ0bi1tb2RhbCBjYW5jZWxcIiB2YWx1ZT1cIicgKyBDcmFmdC50KCdDYW5jZWwnKSArICdcIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG5zIGJ0bi1tb2RhbCBzdWJtaXRcIiB2YWx1ZT1cIicgKyBDcmFmdC50KCdBZGQnKSArICdcIj4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPC9mb290ZXI+J10uam9pbignJykpLmFwcGVuZFRvKHRoaXMuJGZvcm0pXG5cbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIHRoaXMuJHNhdmVCdG4gPSBib2R5LmZpbmQoJy5zdWJtaXQnKVxuICAgICAgICB0aGlzLiRjYW5jZWxCdG4gPSBib2R5LmZpbmQoJy5jYW5jZWwnKVxuICAgICAgICB0aGlzLiRub3RlVGV4dGFyZWEgPSBib2R5LmZpbmQoJyNub3RlLXRleHQnKVxuXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kY2FuY2VsQnRuLCAnY2xpY2snLCAnaGlkZScpXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kZm9ybSwgJ3N1Ym1pdCcsICdzYXZlJylcbiAgICB9LFxuXG4gICAgc2F2ZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLm5vdGUgPSB0aGlzLiRub3RlVGV4dGFyZWEudmFsKClcbiAgICAgICAgdGhpcy53aWRnZXQubm90ZSA9IHRoaXMubm90ZVxuXG4gICAgICAgIGlmICh0aGlzLm5vdGUgPT0gJycpIHtcbiAgICAgICAgICAgIEdhcm5pc2guc2hha2UodGhpcy4kY29udGFpbmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdzYXZlJywge1xuICAgICAgICAgICAgICAgIG5vdGU6IHRoaXMubm90ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG59KVxuXG5Bc3NldE1hbmFnZW1lbnQgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkY29udGFpbmVyOiBudWxsLFxuICAgICRlbGVtZW50czogbnVsbCxcbiAgICAkZm9ybTogbnVsbCxcbiAgICAkdHJpZ2dlcjogbnVsbCxcbiAgICBcbiAgICBkb3dubG9hZENvdW50OiBudWxsLFxuXG4gICAgaW5pdChjb250YWluZXIpIHtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJChjb250YWluZXIpXG4gICAgICAgIHRoaXMuJGVsZW1lbnRzID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5pdGVtLWFzc2V0JylcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGZvcm0gPSB0aGlzLiRjb250YWluZXIuZmluZCgnI2Rvd25sb2FkLWFsbC1hc3NldHMnKVxuICAgICAgICB0aGlzLiR0cmlnZ2VyID0gdGhpcy4kZm9ybS5maW5kKCdidXR0b24nKVxuICAgICAgICB0aGlzLmRvd25sb2FkQ291bnQgPSB0aGlzLiRmb3JtLmZpbmQoJy5hc3NldC1jb3VudCcpXG4gICAgICAgIHRoaXMuJHN0YXR1cyA9ICQoJy5kb3dubG9hZC1zdGF0dXMnLCB0aGlzLiRmb3JtKVxuXG4gICAgICAgIHRoaXMuJGVsZW1lbnRzLmVhY2goKGksIGVsKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50ID0gbmV3IEFzc2V0RmlsZShlbCwgdGhpcylcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGZvcm0sICdzdWJtaXQnLCAnb25TdWJtaXQnKVxuICAgIH0sXG5cbiAgICB1cGRhdGVEb3dubG9hZEJ0bigpIHtcbiAgICAgICAgaXRlbXMgPSBPYmplY3Qua2V5cyhBc3NldE1hbmFnZW1lbnQuc3RvcmFnZSkubGVuZ3RoXG5cbiAgICAgICAgaWYgKGl0ZW1zID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kb3dubG9hZENvdW50Lmh0bWwoaXRlbXMpXG4gICAgICAgICAgICB0aGlzLiR0cmlnZ2VyLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdHJpZ2dlci5hZGRDbGFzcygnaGlkZGVuJylcbiAgICAgICAgICAgIHRoaXMuZG93bmxvYWRDb3VudC5odG1sKCcwJylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblN1Ym1pdChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGlmICghdGhpcy4kdHJpZ2dlci5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2dyZXNzQmFyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0JhciA9IG5ldyBDcmFmdC5Qcm9ncmVzc0Jhcih0aGlzLiRzdGF0dXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIucmVzZXRQcm9ncmVzc0JhcigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuJHByb2dyZXNzQmFyLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyLiRwcm9ncmVzc0Jhci52ZWxvY2l0eSgnc3RvcCcpLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICQucHJveHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IEdhcm5pc2guZ2V0UG9zdERhdGEodGhpcy4kZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IENyYWZ0LmV4cGFuZFBvc3RBcnJheShwb3N0RGF0YSlcblxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMuYXNzZXRzID0gaXRlbXMgPSBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KHBhcmFtcy5hY3Rpb24sIGRhdGEsICQucHJveHkoZnVuY3Rpb24ocmVzcG9uc2UsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzcG9uc2UuZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzc0JhcigpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2UuZG93bmxvYWRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0gJCgnPGlmcmFtZS8+JywgeydzcmMnOiBDcmFmdC5nZXRBY3Rpb25VcmwoJ2Zvcm1CdWlsZGVyL2Fzc2V0cy9kb3dubG9hZEZpbGUnLCB7J2ZpbGVuYW1lJzogcmVzcG9uc2UuZG93bmxvYWRGaWxlfSl9KS5oaWRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZm9ybS5hcHBlbmQoJGlmcmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcywgJ29uQ29tcGxldGUnKSwgMzAwKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlFcnJvcihDcmFmdC50KCdUaGVyZSB3YXMgYSBwcm9ibGVtIGRvd25sb2FkaW5nIGFzc2V0cy4gUGxlYXNlIGNoZWNrIHRoZSBDcmFmdCBsb2dzLicpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlKGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogJC5ub29wXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSwgdGhpcylcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmICh0aGlzLiRhbGxEb25lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kYWxsRG9uZS5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiR0cmlnZ2VyLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICB0aGlzLiR0cmlnZ2VyLnRyaWdnZXIoJ2JsdXInKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVByb2dyZXNzQmFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gMTAwXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuc2V0UHJvZ3Jlc3NQZXJjZW50YWdlKHdpZHRoKVxuICAgIH0sXG5cbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbihzaG93QWxsRG9uZSkge1xuICAgICAgICB0aGlzLnByb2dyZXNzQmFyLiRwcm9ncmVzc0Jhci52ZWxvY2l0eSh7b3BhY2l0eTogMH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAnZmFzdCcsIFxuICAgICAgICAgICAgY29tcGxldGU6ICQucHJveHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kdHJpZ2dlci5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgICAgICAgIHRoaXMuJHRyaWdnZXIudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAgICAgfSwgdGhpcylcbiAgICAgICAgfSlcblxuICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ0Rvd25sb2FkIGNvbXBsZXRlLi4uJykpXG5cbiAgICAgICAgJCgnLml0ZW0tYXNzZXQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgICAkKCcuYXNzZXQtc2VsZWN0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG59LCB7XG4gICAgc3RvcmFnZToge30sXG5cbiAgICBzZXRTdG9yYWdlKG5hbWVzcGFjZSwga2V5LCB2YWx1ZSwgcmVtb3ZlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdID09IHR5cGVvZiB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlW25hbWVzcGFjZV0gPSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlbW92ZSkge1xuICAgICAgICAgICAgZGVsZXRlIEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlW25hbWVzcGFjZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlW25hbWVzcGFjZV1ba2V5XSA9IHZhbHVlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBnZXRTdG9yYWdlKG5hbWVzcGFjZSwga2V5KSB7XG4gICAgICAgIGlmIChBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdICYmIEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlW25hbWVzcGFjZV1ba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlW25hbWVzcGFjZV1ba2V5XVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxufSlcblxuQXNzZXRGaWxlID0gR2FybmlzaC5CYXNlLmV4dGVuZCh7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICAkc2VsZWN0QnRuOiBudWxsLFxuXG4gICAgcGFyZW50OiBudWxsLFxuICAgIGlkOiBudWxsLFxuXG4gICAgaW5pdChlbGVtZW50LCBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgICB0aGlzLiRzZWxlY3RCdG4gPSB0aGlzLmVsZW1lbnQuZmluZCgnLmFzc2V0LXNlbGVjdCcpXG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLiRzZWxlY3RCdG4uZGF0YSgnYXNzZXQtaWQnKVxuXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kc2VsZWN0QnRuLCAnY2xpY2snLCAndG9nZ2xlU2VsZWN0aW9uJylcbiAgICB9LFxuXG4gICAgdG9nZ2xlU2VsZWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy4kc2VsZWN0QnRuLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGhpcy4kc2VsZWN0QnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICBBc3NldE1hbmFnZW1lbnQuc2V0U3RvcmFnZSh0aGlzLmlkLCAnYXNzZXQnLCB0aGlzLmlkLCB0cnVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICB0aGlzLiRzZWxlY3RCdG4uYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICBBc3NldE1hbmFnZW1lbnQuc2V0U3RvcmFnZSh0aGlzLmlkLCAnYXNzZXQnLCB0aGlzLmlkKVxuICAgICAgICB9ICAgXG5cbiAgICAgICAgdGhpcy5wYXJlbnQudXBkYXRlRG93bmxvYWRCdG4oKVxuICAgIH1cbn0pXG5cbkdhcm5pc2guJGRvYy5yZWFkeSgoKSA9PiB7XG5cbiAgICBuZXcgV3JpdGVOb3RlV2lkZ2V0KCcubm90ZXMtd2lkZ2V0JylcbiAgICBuZXcgQXNzZXRNYW5hZ2VtZW50KCcjbWFpbicpXG5cbiAgICBpZiAoQ3JhZnQuZWxlbWVudEluZGV4KSB7XG4gICAgICAgIENyYWZ0LmVsZW1lbnRJbmRleC5vbigndXBkYXRlRWxlbWVudHMnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudHNDb3VudDtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZFNvdXJjZTtcbiAgICAgICAgICAgIGxldCB1bnJlYWRJdGVtcztcblxuICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2VudHJ5L2dldFVucmVhZEVudHJpZXMnLCAkLnByb3h5KCgocmVzcG9uc2UsIHRleHRTdGF0dXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuRm9ybUJ1aWxkZXIudW5yZWFkQ291bnQgPSByZXNwb25zZS5jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5jb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCcudG90YWwtZW50cnktY291bnQnKS5odG1sKHJlc3BvbnNlLmNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCcudG90YWwtZW50cnktY291bnQnKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHNlbGVjdGVkU291cmNlID0gZS50YXJnZXQuaW5zdGFuY2VTdGF0ZS5zZWxlY3RlZFNvdXJjZTtcblxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnZpZXcuX3RvdGFsVmlzaWJsZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZpZXcuJGVsZW1lbnRDb250YWluZXIuaHRtbCgkKGA8dHI+PHRkIGNvbHNwYW49XCI2XCI+JHtDcmFmdC50KFwiTm8gZW50cmllcyBhdmFpbGFibGVcIil9PC90ZD48L3RyPmApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIHVucmVhZCBjb3VudCB1dGlsaXR5IG5hdlxuICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2VudHJ5L2dldFVucmVhZEVudHJpZXMnLCAkLnByb3h5KCgocmVzcG9uc2UsIHRleHRTdGF0dXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzb3VyY2VzIC5lbnRyeS1jb3VudCcpLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChyZXNwb25zZS5ncm91cGVkLCAoa2V5LCBlbnRyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdbZGF0YS1rZXk9XCJmb3JtSWQ6JytrZXkrJ1wiXScpLmZpbmQoJy5lbnRyeS1jb3VudCcpLmh0bWwoZW50cmllcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZmItdW5yZWFkLWNvbnRhaW5lciAuZmItYmFkZ2UnKS5hZGRDbGFzcygnc2hvdycpXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZmItdW5yZWFkLWNvbnRhaW5lciAuZmItYmFkZ2UgLmNvdW50JykuaHRtbChyZXNwb25zZS50b3RhbENvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VucmVhZC1ub3RpZmljYXRpb25zJykuZmluZCgnLmJvZHknKS5odG1sKHJlc3BvbnNlLnRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZiLXVucmVhZC1jb250YWluZXIgLmZiLWJhZGdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZiLXVucmVhZC1jb250YWluZXIgLmZiLWJhZGdlIC5jb3VudCcpLmh0bWwoJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdW5yZWFkLW5vdGlmaWNhdGlvbnMnKS5maW5kKCcuYm9keScpLmh0bWwoJzxwIGNsYXNzPVwibm8tY29udGVudFwiPicrQ3JhZnQudCgnTm8gdW5yZWFkIHN1Ym1pc3Npb25zLicpKyc8L3A+JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLCB0aGlzKSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFRPRE86IGRlbGV0ZSBlbnRyeSBhbmQgYWxsIGFzc2V0cyBhbmQgbm90ZXNcbiAgICAkKCcjZGVsZXRlLWVudHJ5Jykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnZW50cnktaWQnKVxuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGlkOiBlbnRyeUlkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlybShDcmFmdC50KFwiRGVsZXRpbmcgZW50cnkgd2lsbCByZW1vdmUgYWxsIHJlbGV2YW50IGFzc2V0cyBhbmQgbm90ZXMsIGFyZSB5b3Ugc3VyZT9cIikpKSB7XG4gICAgICAgICAgICBDcmFmdC5wb3N0QWN0aW9uUmVxdWVzdCgnZm9ybUJ1aWxkZXIvZW50cnkvZGVsZXRlJywgZGF0YSwgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRTdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ0RlbGV0aW5nIGVudHJ5Li4uJykpXG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke0NyYWZ0LmdldENwVXJsKCl9L2Zvcm1idWlsZGVyL2VudHJpZXNgXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgdGhpcykpO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgICQoJy5zdWJtaXNzaW9uLWFjdGlvbi10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgJG1lbnU7XG4gICAgICAgIGxldCBlbnRyeUlkO1xuICAgICAgICBsZXQgZmlsZUlkcztcbiAgICAgICAgbGV0IGZvcm1JZDtcbiAgICAgICAgbGV0IHR5cGU7XG5cbiAgICAgICAgdHlwZSA9ICQodGhpcykuZGF0YSgndHlwZScpO1xuICAgICAgICBmb3JtSWQgPSAkKHRoaXMpLmRhdGEoJ2Zvcm0taWQnKTtcbiAgICAgICAgZW50cnlJZCA9ICQodGhpcykuZGF0YSgnZW50cnktaWQnKTtcbiAgICAgICAgZmlsZUlkcyA9ICQodGhpcykuZGF0YSgnZmlsZS1pZHMnKTtcbiAgICAgICAgJG1lbnUgPSAkKCc8ZGl2IGNsYXNzPVwidG91dC1kcm9wZG93blwiLz4nKS5odG1sKCc8dWwgY2xhc3M9XCJmb3JtLWl0ZW0tbWVudVwiPicgKyAnPC91bD4nKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N1Ym1pc3Npb24nKSB7XG4gICAgICAgICAgICAkKCc8bGk+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImRlbGV0ZS1zdWJtaXNzaW9uXCI+RGVsZXRlIFN1Ym1pc3Npb248L2E+PC9saT4nKS5hcHBlbmRUbygkbWVudS5maW5kKCd1bCcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZm9ybScpIHtcbiAgICAgICAgICAgICQoYDxsaT48YSBocmVmPVwiJHt3aW5kb3cuRm9ybUJ1aWxkZXIuYWRtaW5Vcmx9L2Zvcm1zLyR7Zm9ybUlkfVwiPlZpZXcgRm9ybTwvYT48L2xpPmApLmFwcGVuZFRvKCRtZW51LmZpbmQoJ3VsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd1cGxvYWRzJykge1xuICAgICAgICAgICAgJChgPGxpPjxhIGhyZWY9XCIke3dpbmRvdy5Gb3JtQnVpbGRlci5hZG1pblVybH0vZW50cmllc1wiIGNsYXNzPVwiZGVsZXRlLWFsbC1maWxlc1wiPkRlbGV0ZSBBbGw8L2E+PC9saT5gKS5hcHBlbmRUbygkbWVudS5maW5kKCd1bCcpKTtcbiAgICAgICAgICAgICQoYDxsaT48YSBocmVmPVwiJHt3aW5kb3cuRm9ybUJ1aWxkZXIuYWRtaW5Vcmx9L2VudHJpZXNcIiBjbGFzcz1cImRvd25sb2FkLWFsbC1maWxlc1wiPkRvd25sb2FkIEFsbDwvYT48L2xpPmApLmFwcGVuZFRvKCRtZW51LmZpbmQoJ3VsJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3IEdhcm5pc2guSFVEKCQodGhpcyksICRtZW51LCB7XG4gICAgICAgICAgICBodWRDbGFzczogJ2h1ZCBmYi1odWQgc3VibWlzc2lvbmh1ZCcsXG4gICAgICAgICAgICBjbG9zZU90aGVySFVEczogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJG1lbnUuZmluZCgnLmRlbGV0ZS1zdWJtaXNzaW9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICBpZDogZW50cnlJZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpcm0oQ3JhZnQudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBlbnRyeT9cIikpKSB7XG4gICAgICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2VudHJ5L2RlbGV0ZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ0VudHJ5IGRlbGV0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3dpbmRvdy5Gb3JtQnVpbGRlci5hZG1pblVybH0vZW50cmllc2A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSwgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkbWVudS5maW5kKCcuZGVsZXRlLWFsbC1maWxlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgZmlsZUlkOiBmaWxlSWRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY29uZmlybShDcmFmdC50KFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBhbGwgZmlsZXM/XCIpKSkge1xuICAgICAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdhc3NldHMvZGVsZXRlRmlsZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaHVkSUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGh1ZElEIGluIEdhcm5pc2guSFVELmFjdGl2ZUhVRHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYXJuaXNoLkhVRC5hY3RpdmVIVURzW2h1ZElEXS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy51cGxvYWQtZGV0YWlscycpLnBhcmVudCgpLnZlbG9jaXR5KCdmYWRlT3V0Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAnMTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKCkgPT4gJCgnLnVwbG9hZC1kZXRhaWxzJykucGFyZW50KCkucmVtb3ZlKCkpLCAxMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJG1lbnUuZmluZCgnLmRvd25sb2FkLWFsbC1maWxlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdEb3dubG9hZGluZy4uLicpKTtcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgIGlkczogZmlsZUlkcyxcbiAgICAgICAgICAgICAgZm9ybUlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDcmFmdC5wb3N0QWN0aW9uUmVxdWVzdCgnZm9ybUJ1aWxkZXIvZW50cnkvZG93bmxvYWRBbGxGaWxlcycsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBodWRJRDtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cztcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBgL2FjdGlvbnMvZm9ybWJ1aWxkZXIvZW50cnkvZG93bmxvYWRGaWxlcz9maWxlUGF0aD0ke3Jlc3BvbnNlLmZpbGVQYXRofWA7XG4gICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlOb3RpY2UoQ3JhZnQudCgnRG93bmxvYWQgU3VjY2Vzc2Z1bCcpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5RXJyb3IoQ3JhZnQudChyZXNwb25zZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChodWRJRCBpbiBHYXJuaXNoLkhVRC5hY3RpdmVIVURzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChHYXJuaXNoLkhVRC5hY3RpdmVIVURzW2h1ZElEXS5oaWRlKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL2VudHJpZXMuanMiXSwic291cmNlUm9vdCI6IiJ9