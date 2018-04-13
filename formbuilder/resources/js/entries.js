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
                _this.updateNotesHtml(response.note);
            }
        }, this));

        this.modal.hide();
    },
    updateNotesHtml: function updateNotesHtml(data) {
        var author = void 0;
        var note = void 0;

        note = data.note;
        author = data.author.fullName;

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
                        window.location.href = window.FormBuilder.adminUrl + '/entries';
                    }, 2000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZW50cmllcy5qcyJdLCJuYW1lcyI6WyJXcml0ZU5vdGVXaWRnZXQiLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsIiR3aWRnZXQiLCIkYnRuIiwiJGxpc3QiLCIkbm90ZVRleHRhcmVhIiwiJHNwaW5uZXIiLCJtb2RhbCIsIm5vdGUiLCJlbnRyeUlkIiwiaW5pdCIsIndpZGdldCIsIiQiLCJmaW5kIiwiZGF0YSIsImFkZExpc3RlbmVyIiwib3Blbk5vdGVNb2RlbCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIk5vdGVNb2RhbCIsIm9uIiwicHJveHkiLCJ1cGRhdGVOb3RlcyIsInJlbW92ZUNsYXNzIiwiQ3JhZnQiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInJlc3BvbnNlIiwidGV4dFN0YXR1cyIsImNwIiwiZGlzcGxheU5vdGljZSIsInQiLCJhZGRDbGFzcyIsInVwZGF0ZU5vdGVzSHRtbCIsImhpZGUiLCJhdXRob3IiLCJmdWxsTmFtZSIsIiRtYXJrdXAiLCJwcmVwZW5kIiwicmVtb3ZlIiwiTW9kYWwiLCJib2R5Iiwic2VsZiIsImJhc2UiLCIkZm9ybSIsImFwcGVuZFRvIiwiJGJvZCIsInNldENvbnRhaW5lciIsImpvaW4iLCJzaG93IiwiJHNhdmVCdG4iLCIkY2FuY2VsQnRuIiwic2F2ZSIsInZhbCIsInNoYWtlIiwiJGNvbnRhaW5lciIsInRyaWdnZXIiLCJBc3NldE1hbmFnZW1lbnQiLCIkZWxlbWVudHMiLCIkdHJpZ2dlciIsImRvd25sb2FkQ291bnQiLCJjb250YWluZXIiLCIkc3RhdHVzIiwiZWFjaCIsImkiLCJlbCIsImVsZW1lbnQiLCJBc3NldEZpbGUiLCJ1cGRhdGVEb3dubG9hZEJ0biIsIml0ZW1zIiwiT2JqZWN0Iiwia2V5cyIsInN0b3JhZ2UiLCJsZW5ndGgiLCJodG1sIiwib25TdWJtaXQiLCJoYXNDbGFzcyIsInByb2dyZXNzQmFyIiwiUHJvZ3Jlc3NCYXIiLCJyZXNldFByb2dyZXNzQmFyIiwiJHByb2dyZXNzQmFyIiwidmVsb2NpdHkiLCJvcGFjaXR5IiwiY29tcGxldGUiLCJwb3N0RGF0YSIsImdldFBvc3REYXRhIiwicGFyYW1zIiwiZXhwYW5kUG9zdEFycmF5IiwiYXNzZXRzIiwiYWN0aW9uIiwiZXJyb3IiLCJhbGVydCIsInVwZGF0ZVByb2dyZXNzQmFyIiwiZG93bmxvYWRGaWxlIiwiJGlmcmFtZSIsImdldEFjdGlvblVybCIsImFwcGVuZCIsInNldFRpbWVvdXQiLCJkaXNwbGF5RXJyb3IiLCJvbkNvbXBsZXRlIiwibm9vcCIsIiRhbGxEb25lIiwiY3NzIiwid2lkdGgiLCJzZXRQcm9ncmVzc1BlcmNlbnRhZ2UiLCJzaG93QWxsRG9uZSIsImR1cmF0aW9uIiwic2V0U3RvcmFnZSIsIm5hbWVzcGFjZSIsImtleSIsInZhbHVlIiwidW5kZWZpbmVkIiwiZ2V0U3RvcmFnZSIsIiRzZWxlY3RCdG4iLCJwYXJlbnQiLCJpZCIsInRvZ2dsZVNlbGVjdGlvbiIsIiRkb2MiLCJyZWFkeSIsImVsZW1lbnRJbmRleCIsImVsZW1lbnRzQ291bnQiLCJzZWxlY3RlZFNvdXJjZSIsInVucmVhZEl0ZW1zIiwic3VjY2VzcyIsIndpbmRvdyIsIkZvcm1CdWlsZGVyIiwidW5yZWFkQ291bnQiLCJjb3VudCIsInRhcmdldCIsImluc3RhbmNlU3RhdGUiLCJ2aWV3IiwiX3RvdGFsVmlzaWJsZSIsIiRlbGVtZW50Q29udGFpbmVyIiwiZ3JvdXBlZCIsImVudHJpZXMiLCJ0b3RhbENvdW50IiwidGVtcGxhdGUiLCJjdXJyZW50VGFyZ2V0IiwiY29uZmlybSIsImxvY2F0aW9uIiwiaHJlZiIsImFkbWluVXJsIiwiJG1lbnUiLCJmaWxlSWRzIiwiZm9ybUlkIiwidHlwZSIsIkhVRCIsImh1ZENsYXNzIiwiY2xvc2VPdGhlckhVRHMiLCJmaWxlSWQiLCJodWRJRCIsImFjdGl2ZUhVRHMiLCJpZHMiLCJyZXN1bHRz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dUgsT0FBUDtBQUNILGFBakJtRSxFQWlCaEUsSUFqQmdFLENBQXBFO0FBa0JILFNBM0JEO0FBNkJILEtBcEdEO0FBcUdILENBNUtELEUiLCJmaWxlIjoiL2Zvcm1idWlsZGVyL3Jlc291cmNlcy9qcy9lbnRyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTRmZjc3Nzg0NjQyOTE3YWExYjMiLCJsZXQgV3JpdGVOb3RlV2lkZ2V0XG5cbldyaXRlTm90ZVdpZGdldCA9IEdhcm5pc2guQmFzZS5leHRlbmQoe1xuICAgICR3aWRnZXQ6IG51bGwsXG4gICAgJGJ0bjogbnVsbCxcbiAgICAkbGlzdDogbnVsbCxcbiAgICAkbm90ZVRleHRhcmVhOiBudWxsLFxuICAgICRzcGlubmVyOiBudWxsLFxuXG4gICAgbW9kYWw6IG51bGwsXG4gICAgbm90ZTogbnVsbCxcbiAgICBlbnRyeUlkOiBudWxsLFxuXG4gICAgaW5pdCh3aWRnZXQpIHtcbiAgICAgICAgdGhpcy4kd2lkZ2V0ID0gJCh3aWRnZXQpXG4gICAgICAgIHRoaXMuJGJ0biA9IHRoaXMuJHdpZGdldC5maW5kKCcjd3JpdGUtbm90ZS1idG4nKVxuICAgICAgICB0aGlzLiRsaXN0ID0gdGhpcy4kd2lkZ2V0LmZpbmQoJy5saXN0JylcbiAgICAgICAgdGhpcy4kc3Bpbm5lciA9IHRoaXMuJHdpZGdldC5maW5kKCcubG9hZGVyJylcblxuICAgICAgICB0aGlzLmVudHJ5SWQgPSB0aGlzLiR3aWRnZXQuZGF0YSgnZW50cnktaWQnKVxuXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kYnRuLCAnY2xpY2snLCAnb3Blbk5vdGVNb2RlbCcpXG4gICAgfSxcblxuICAgIG9wZW5Ob3RlTW9kZWwoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMubW9kYWxcbiAgICAgICAgICAgIHRoaXMubW9kYWwgPSBuZXcgTm90ZU1vZGFsKHRoaXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1vZGFsID0gbmV3IE5vdGVNb2RhbCh0aGlzKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLm1vZGFsLm9uKCdzYXZlJywgJC5wcm94eSh0aGlzLCAndXBkYXRlTm90ZXMnKSlcbiAgICB9LFxuXG4gICAgdXBkYXRlTm90ZXMoZGF0YSkge1xuICAgICAgICB0aGlzLiRzcGlubmVyLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuXG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICBub3RlOiB0aGlzLm5vdGUsXG4gICAgICAgICAgICBlbnRyeUlkOiB0aGlzLmVudHJ5SWRcbiAgICAgICAgfVxuXG4gICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9ub3Rlcy9zYXZlJywgZGF0YSwgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdOb3RlIGFkZGVkJykpXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lci5hZGRDbGFzcygnaGlkZGVuJylcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU5vdGVzSHRtbChyZXNwb25zZS5ub3RlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgdGhpcykpXG5cbiAgICAgICAgdGhpcy5tb2RhbC5oaWRlKClcbiAgICB9LFxuXG4gICAgdXBkYXRlTm90ZXNIdG1sKGRhdGEpIHtcbiAgICAgICAgbGV0IGF1dGhvclxuICAgICAgICBsZXQgbm90ZVxuXG4gICAgICAgIG5vdGUgPSBkYXRhLm5vdGVcbiAgICAgICAgYXV0aG9yID0gZGF0YS5hdXRob3IuZnVsbE5hbWVcblxuICAgICAgICAkbWFya3VwID0gJCgnPGRpdiBjbGFzcz1cImxpc3QtaXRlbSBwYWRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIml0ZW0tbWV0YVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJpdGVtLW1ldGEtaWNvblwiPjxpIGNsYXNzPVwiZmFyIGZhLXVzZXJcIj48L2k+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJpdGVtLW1ldGEtdGl0bGVcIj4nICsgYXV0aG9yICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaXRlbS1tZXRhLXJpZ2h0XCI+JyArIENyYWZ0LnQoJ05vdycpICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpdGVtLXRpdGxlXCI+JyArIG5vdGUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPC9kaXY+JylcblxuICAgICAgICB0aGlzLiRsaXN0LnByZXBlbmQoJG1hcmt1cClcbiAgICAgICAgJCgnLm5vLWl0ZW1zJykucmVtb3ZlKClcbiAgICB9XG5cbn0pXG5cbk5vdGVNb2RhbCA9IEdhcm5pc2guTW9kYWwuZXh0ZW5kKHtcbiAgICB3aWRnZXQ6IG51bGwsXG5cbiAgICBpbml0KHdpZGdldCkge1xuICAgICAgICB2YXIgYm9keSwgc2VsZlxuICAgICAgICBzZWxmID0gdGhpc1xuICAgICAgICB0aGlzLmJhc2UoKVxuXG4gICAgICAgIHRoaXMud2lkZ2V0ID0gd2lkZ2V0XG5cbiAgICAgICAgdGhpcy4kZm9ybSA9ICQoJzxmb3JtIGNsYXNzPVwibW9kYWwgZml0dGVkIGZvcm1idWlsZGVyLW1vZGFsXCI+JykuYXBwZW5kVG8oR2FybmlzaC4kYm9kKVxuICAgICAgICB0aGlzLnNldENvbnRhaW5lcih0aGlzLiRmb3JtKVxuICAgICAgICBcbiAgICAgICAgYm9keSA9ICQoW1xuICAgICAgICAgICAgJzxoZWFkZXI+JywgXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibW9kYWwtdGl0bGVcIj4nICsgQ3JhZnQudCgnTm90ZScpICsgJzwvc3Bhbj4nLCBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImluc3RydWN0aW9uc1wiPicgKyBDcmFmdC50KCdMZWF2ZSBhIG5vdGUgZm9yIHRoaXMgZW50cnknKSArICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICc8L2hlYWRlcj4nLCBcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYm9keVwiPicsIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmItZmllbGRcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImlucHV0LWhpbnRcIj5URVhUPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJpbnB1dFwiPjx0ZXh0YXJlYSBpZD1cIm5vdGUtdGV4dFwiIHJvd3M9XCI2XCI+PC90ZXh0YXJlYT48L2Rpdj4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPC9kaXY+JywgXG4gICAgICAgICAgICAnPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPicsIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIGNhbmNlbFwiIHZhbHVlPVwiJyArIENyYWZ0LnQoJ0NhbmNlbCcpICsgJ1wiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bnMgYnRuLW1vZGFsIHN1Ym1pdFwiIHZhbHVlPVwiJyArIENyYWZ0LnQoJ0FkZCcpICsgJ1wiPicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLCBcbiAgICAgICAgICAgICc8L2Zvb3Rlcj4nXS5qb2luKCcnKSkuYXBwZW5kVG8odGhpcy4kZm9ybSlcblxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy4kc2F2ZUJ0biA9IGJvZHkuZmluZCgnLnN1Ym1pdCcpXG4gICAgICAgIHRoaXMuJGNhbmNlbEJ0biA9IGJvZHkuZmluZCgnLmNhbmNlbCcpXG4gICAgICAgIHRoaXMuJG5vdGVUZXh0YXJlYSA9IGJvZHkuZmluZCgnI25vdGUtdGV4dCcpXG5cbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRjYW5jZWxCdG4sICdjbGljaycsICdoaWRlJylcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRmb3JtLCAnc3VibWl0JywgJ3NhdmUnKVxuICAgIH0sXG5cbiAgICBzYXZlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMubm90ZSA9IHRoaXMuJG5vdGVUZXh0YXJlYS52YWwoKVxuICAgICAgICB0aGlzLndpZGdldC5ub3RlID0gdGhpcy5ub3RlXG5cbiAgICAgICAgaWYgKHRoaXMubm90ZSA9PSAnJykge1xuICAgICAgICAgICAgR2FybmlzaC5zaGFrZSh0aGlzLiRjb250YWluZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3NhdmUnLCB7XG4gICAgICAgICAgICAgICAgbm90ZTogdGhpcy5ub3RlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbn0pXG5cbkFzc2V0TWFuYWdlbWVudCA9IEdhcm5pc2guQmFzZS5leHRlbmQoe1xuICAgICRjb250YWluZXI6IG51bGwsXG4gICAgJGVsZW1lbnRzOiBudWxsLFxuICAgICRmb3JtOiBudWxsLFxuICAgICR0cmlnZ2VyOiBudWxsLFxuICAgIFxuICAgIGRvd25sb2FkQ291bnQ6IG51bGwsXG5cbiAgICBpbml0KGNvbnRhaW5lcikge1xuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAkKGNvbnRhaW5lcilcbiAgICAgICAgdGhpcy4kZWxlbWVudHMgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLml0ZW0tYXNzZXQnKVxuICAgICAgICBcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcjZG93bmxvYWQtYWxsLWFzc2V0cycpXG4gICAgICAgIHRoaXMuJHRyaWdnZXIgPSB0aGlzLiRmb3JtLmZpbmQoJ2J1dHRvbicpXG4gICAgICAgIHRoaXMuZG93bmxvYWRDb3VudCA9IHRoaXMuJGZvcm0uZmluZCgnLmFzc2V0LWNvdW50JylcbiAgICAgICAgdGhpcy4kc3RhdHVzID0gJCgnLmRvd25sb2FkLXN0YXR1cycsIHRoaXMuJGZvcm0pXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudHMuZWFjaCgoaSwgZWwpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBuZXcgQXNzZXRGaWxlKGVsLCB0aGlzKVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kZm9ybSwgJ3N1Ym1pdCcsICdvblN1Ym1pdCcpXG4gICAgfSxcblxuICAgIHVwZGF0ZURvd25sb2FkQnRuKCkge1xuICAgICAgICBpdGVtcyA9IE9iamVjdC5rZXlzKEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXRlbXMgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRvd25sb2FkQ291bnQuaHRtbChpdGVtcylcbiAgICAgICAgICAgIHRoaXMuJHRyaWdnZXIucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiR0cmlnZ2VyLmFkZENsYXNzKCdoaWRkZW4nKVxuICAgICAgICAgICAgdGhpcy5kb3dubG9hZENvdW50Lmh0bWwoJzAnKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uU3VibWl0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgaWYgKCF0aGlzLiR0cmlnZ2VyLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyID0gbmV3IENyYWZ0LlByb2dyZXNzQmFyKHRoaXMuJHN0YXR1cylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5yZXNldFByb2dyZXNzQmFyKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci4kcHJvZ3Jlc3NCYXIucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG5cbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuJHByb2dyZXNzQmFyLnZlbG9jaXR5KCdzdG9wJykudmVsb2NpdHkoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogJC5wcm94eShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc3REYXRhID0gR2FybmlzaC5nZXRQb3N0RGF0YSh0aGlzLiRmb3JtKVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gQ3JhZnQuZXhwYW5kUG9zdEFycmF5KHBvc3REYXRhKVxuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5hc3NldHMgPSBpdGVtcyA9IEFzc2V0TWFuYWdlbWVudC5zdG9yYWdlXG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QocGFyYW1zLmFjdGlvbiwgZGF0YSwgJC5wcm94eShmdW5jdGlvbihyZXNwb25zZSwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHRTdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChyZXNwb25zZS5lcnJvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzQmFyKClcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5kb3dubG9hZEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkKCc8aWZyYW1lLz4nLCB7J3NyYyc6IENyYWZ0LmdldEFjdGlvblVybCgnZm9ybUJ1aWxkZXIvYXNzZXRzL2Rvd25sb2FkRmlsZScsIHsnZmlsZW5hbWUnOiByZXNwb25zZS5kb3dubG9hZEZpbGV9KX0pLmhpZGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRmb3JtLmFwcGVuZCgkaWZyYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLCAnb25Db21wbGV0ZScpLCAzMDApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheUVycm9yKENyYWZ0LnQoJ1RoZXJlIHdhcyBhIHByb2JsZW0gZG93bmxvYWRpbmcgYXNzZXRzLiBQbGVhc2UgY2hlY2sgdGhlIENyYWZ0IGxvZ3MuJykpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAkLm5vb3BcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKHRoaXMuJGFsbERvbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRhbGxEb25lLmNzcygnb3BhY2l0eScsIDApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJHRyaWdnZXIuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuJHRyaWdnZXIudHJpZ2dlcignYmx1cicpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlUHJvZ3Jlc3NCYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgd2lkdGggPSAxMDBcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5zZXRQcm9ncmVzc1BlcmNlbnRhZ2Uod2lkdGgpXG4gICAgfSxcblxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKHNob3dBbGxEb25lKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuJHByb2dyZXNzQmFyLnZlbG9jaXR5KHtvcGFjaXR5OiAwfSwge1xuICAgICAgICAgICAgZHVyYXRpb246ICdmYXN0JywgXG4gICAgICAgICAgICBjb21wbGV0ZTogJC5wcm94eShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiR0cmlnZ2VyLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy4kdHJpZ2dlci50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICB9KVxuICAgIH1cblxufSwge1xuICAgIHN0b3JhZ2U6IHt9LFxuXG4gICAgc2V0U3RvcmFnZShuYW1lc3BhY2UsIGtleSwgdmFsdWUsIHJlbW92ZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXNzZXRNYW5hZ2VtZW50LnN0b3JhZ2VbbmFtZXNwYWNlXSA9PSB0eXBlb2YgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV0gPSB2YWx1ZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZ2V0U3RvcmFnZShuYW1lc3BhY2UsIGtleSkge1xuICAgICAgICBpZiAoQXNzZXRNYW5hZ2VtZW50LnN0b3JhZ2VbbmFtZXNwYWNlXSAmJiBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBBc3NldE1hbmFnZW1lbnQuc3RvcmFnZVtuYW1lc3BhY2VdW2tleV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSxcbn0pXG5cbkFzc2V0RmlsZSA9IEdhcm5pc2guQmFzZS5leHRlbmQoe1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgJHNlbGVjdEJ0bjogbnVsbCxcblxuICAgIHBhcmVudDogbnVsbCxcbiAgICBpZDogbnVsbCxcblxuICAgIGluaXQoZWxlbWVudCwgcGFyZW50KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAgICAgdGhpcy4kc2VsZWN0QnRuID0gdGhpcy5lbGVtZW50LmZpbmQoJy5hc3NldC1zZWxlY3QnKVxuICAgICAgICB0aGlzLmlkID0gdGhpcy4kc2VsZWN0QnRuLmRhdGEoJ2Fzc2V0LWlkJylcblxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJHNlbGVjdEJ0biwgJ2NsaWNrJywgJ3RvZ2dsZVNlbGVjdGlvbicpXG4gICAgfSxcblxuICAgIHRvZ2dsZVNlbGVjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuJHNlbGVjdEJ0bi5oYXNDbGFzcygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdEJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgQXNzZXRNYW5hZ2VtZW50LnNldFN0b3JhZ2UodGhpcy5pZCwgJ2Fzc2V0JywgdGhpcy5pZCwgdHJ1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0QnRuLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgQXNzZXRNYW5hZ2VtZW50LnNldFN0b3JhZ2UodGhpcy5pZCwgJ2Fzc2V0JywgdGhpcy5pZClcbiAgICAgICAgfSAgIFxuXG4gICAgICAgIHRoaXMucGFyZW50LnVwZGF0ZURvd25sb2FkQnRuKClcbiAgICB9XG59KVxuXG5HYXJuaXNoLiRkb2MucmVhZHkoKCkgPT4ge1xuXG4gICAgbmV3IFdyaXRlTm90ZVdpZGdldCgnLm5vdGVzLXdpZGdldCcpXG4gICAgbmV3IEFzc2V0TWFuYWdlbWVudCgnI21haW4nKVxuXG4gICAgaWYgKENyYWZ0LmVsZW1lbnRJbmRleCkge1xuICAgICAgICBDcmFmdC5lbGVtZW50SW5kZXgub24oJ3VwZGF0ZUVsZW1lbnRzJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzQ291bnQ7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRTb3VyY2U7XG4gICAgICAgICAgICBsZXQgdW5yZWFkSXRlbXM7XG5cbiAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9lbnRyeS9nZXRVbnJlYWRFbnRyaWVzJywgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkZvcm1CdWlsZGVyLnVucmVhZENvdW50ID0gcmVzcG9uc2UuY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuY291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCgnLnRvdGFsLWVudHJ5LWNvdW50JykuaHRtbChyZXNwb25zZS5jb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCgnLnRvdGFsLWVudHJ5LWNvdW50JykuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgdGhpcykpO1xuXG4gICAgICAgICAgICBzZWxlY3RlZFNvdXJjZSA9IGUudGFyZ2V0Lmluc3RhbmNlU3RhdGUuc2VsZWN0ZWRTb3VyY2U7XG5cbiAgICAgICAgICAgIGlmIChlLnRhcmdldC52aWV3Ll90b3RhbFZpc2libGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC52aWV3LiRlbGVtZW50Q29udGFpbmVyLmh0bWwoJChgPHRyPjx0ZCBjb2xzcGFuPVwiNlwiPiR7Q3JhZnQudChcIk5vIGVudHJpZXMgYXZhaWxhYmxlXCIpfTwvdGQ+PC90cj5gKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB1bnJlYWQgY291bnQgdXRpbGl0eSBuYXZcbiAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9lbnRyeS9nZXRVbnJlYWRFbnRyaWVzJywgJC5wcm94eSgoKHJlc3BvbnNlLCB0ZXh0U3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRTdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjc291cmNlcyAuZW50cnktY291bnQnKS5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocmVzcG9uc2UuZ3JvdXBlZCwgKGtleSwgZW50cmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnW2RhdGEta2V5PVwiZm9ybUlkOicra2V5KydcIl0nKS5maW5kKCcuZW50cnktY291bnQnKS5odG1sKGVudHJpZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS50b3RhbENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZiLXVucmVhZC1jb250YWluZXIgLmZiLWJhZGdlJykuYWRkQ2xhc3MoJ3Nob3cnKVxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmZiLXVucmVhZC1jb250YWluZXIgLmZiLWJhZGdlIC5jb3VudCcpLmh0bWwocmVzcG9uc2UudG90YWxDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN1bnJlYWQtbm90aWZpY2F0aW9ucycpLmZpbmQoJy5ib2R5JykuaHRtbChyZXNwb25zZS50ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5mYi11bnJlYWQtY29udGFpbmVyIC5mYi1iYWRnZScpLnJlbW92ZUNsYXNzKCdzaG93JylcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5mYi11bnJlYWQtY29udGFpbmVyIC5mYi1iYWRnZSAuY291bnQnKS5odG1sKCcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VucmVhZC1ub3RpZmljYXRpb25zJykuZmluZCgnLmJvZHknKS5odG1sKCc8cCBjbGFzcz1cIm5vLWNvbnRlbnRcIj4nK0NyYWZ0LnQoJ05vIHVucmVhZCBzdWJtaXNzaW9ucy4nKSsnPC9wPicpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgdGhpcykpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBUT0RPOiBkZWxldGUgZW50cnkgYW5kIGFsbCBhc3NldHMgYW5kIG5vdGVzXG4gICAgJCgnI2RlbGV0ZS1lbnRyeScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2VudHJ5LWlkJylcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogZW50cnlJZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpcm0oQ3JhZnQudChcIkRlbGV0aW5nIGVudHJ5IHdpbGwgcmVtb3ZlIGFsbCByZWxldmFudCBhc3NldHMgYW5kIG5vdGVzLCBhcmUgeW91IHN1cmU/XCIpKSkge1xuICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2VudHJ5L2RlbGV0ZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdEZWxldGluZyBlbnRyeS4uLicpKVxuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHt3aW5kb3cuRm9ybUJ1aWxkZXIuYWRtaW5Vcmx9L2VudHJpZXNgXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgdGhpcykpO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgICQoJy5zdWJtaXNzaW9uLWFjdGlvbi10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBsZXQgJG1lbnU7XG4gICAgICAgIGxldCBlbnRyeUlkO1xuICAgICAgICBsZXQgZmlsZUlkcztcbiAgICAgICAgbGV0IGZvcm1JZDtcbiAgICAgICAgbGV0IHR5cGU7XG5cbiAgICAgICAgdHlwZSA9ICQodGhpcykuZGF0YSgndHlwZScpO1xuICAgICAgICBmb3JtSWQgPSAkKHRoaXMpLmRhdGEoJ2Zvcm0taWQnKTtcbiAgICAgICAgZW50cnlJZCA9ICQodGhpcykuZGF0YSgnZW50cnktaWQnKTtcbiAgICAgICAgZmlsZUlkcyA9ICQodGhpcykuZGF0YSgnZmlsZS1pZHMnKTtcbiAgICAgICAgJG1lbnUgPSAkKCc8ZGl2IGNsYXNzPVwidG91dC1kcm9wZG93blwiLz4nKS5odG1sKCc8dWwgY2xhc3M9XCJmb3JtLWl0ZW0tbWVudVwiPicgKyAnPC91bD4nKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N1Ym1pc3Npb24nKSB7XG4gICAgICAgICAgICAkKCc8bGk+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImRlbGV0ZS1zdWJtaXNzaW9uXCI+RGVsZXRlIFN1Ym1pc3Npb248L2E+PC9saT4nKS5hcHBlbmRUbygkbWVudS5maW5kKCd1bCcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZm9ybScpIHtcbiAgICAgICAgICAgICQoYDxsaT48YSBocmVmPVwiJHt3aW5kb3cuRm9ybUJ1aWxkZXIuYWRtaW5Vcmx9L2Zvcm1zLyR7Zm9ybUlkfVwiPlZpZXcgRm9ybTwvYT48L2xpPmApLmFwcGVuZFRvKCRtZW51LmZpbmQoJ3VsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd1cGxvYWRzJykge1xuICAgICAgICAgICAgJChgPGxpPjxhIGhyZWY9XCIke3dpbmRvdy5Gb3JtQnVpbGRlci5hZG1pblVybH0vZW50cmllc1wiIGNsYXNzPVwiZGVsZXRlLWFsbC1maWxlc1wiPkRlbGV0ZSBBbGw8L2E+PC9saT5gKS5hcHBlbmRUbygkbWVudS5maW5kKCd1bCcpKTtcbiAgICAgICAgICAgICQoYDxsaT48YSBocmVmPVwiJHt3aW5kb3cuRm9ybUJ1aWxkZXIuYWRtaW5Vcmx9L2VudHJpZXNcIiBjbGFzcz1cImRvd25sb2FkLWFsbC1maWxlc1wiPkRvd25sb2FkIEFsbDwvYT48L2xpPmApLmFwcGVuZFRvKCRtZW51LmZpbmQoJ3VsJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3IEdhcm5pc2guSFVEKCQodGhpcyksICRtZW51LCB7XG4gICAgICAgICAgICBodWRDbGFzczogJ2h1ZCBmYi1odWQgc3VibWlzc2lvbmh1ZCcsXG4gICAgICAgICAgICBjbG9zZU90aGVySFVEczogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJG1lbnUuZmluZCgnLmRlbGV0ZS1zdWJtaXNzaW9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICBpZDogZW50cnlJZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpcm0oQ3JhZnQudChcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBlbnRyeT9cIikpKSB7XG4gICAgICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2VudHJ5L2RlbGV0ZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ0VudHJ5IGRlbGV0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3dpbmRvdy5Gb3JtQnVpbGRlci5hZG1pblVybH0vZW50cmllc2A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSwgdGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkbWVudS5maW5kKCcuZGVsZXRlLWFsbC1maWxlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgZmlsZUlkOiBmaWxlSWRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY29uZmlybShDcmFmdC50KFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBhbGwgZmlsZXM/XCIpKSkge1xuICAgICAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdhc3NldHMvZGVsZXRlRmlsZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaHVkSUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGh1ZElEIGluIEdhcm5pc2guSFVELmFjdGl2ZUhVRHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYXJuaXNoLkhVRC5hY3RpdmVIVURzW2h1ZElEXS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy51cGxvYWQtZGV0YWlscycpLnBhcmVudCgpLnZlbG9jaXR5KCdmYWRlT3V0Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAnMTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKCkgPT4gJCgnLnVwbG9hZC1kZXRhaWxzJykucGFyZW50KCkucmVtb3ZlKCkpLCAxMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJG1lbnUuZmluZCgnLmRvd25sb2FkLWFsbC1maWxlcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgQ3JhZnQuY3AuZGlzcGxheU5vdGljZShDcmFmdC50KCdEb3dubG9hZGluZy4uLicpKTtcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgIGlkczogZmlsZUlkcyxcbiAgICAgICAgICAgICAgZm9ybUlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBDcmFmdC5wb3N0QWN0aW9uUmVxdWVzdCgnZm9ybUJ1aWxkZXIvZW50cnkvZG93bmxvYWRBbGxGaWxlcycsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBodWRJRDtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cztcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBgL2FjdGlvbnMvZm9ybWJ1aWxkZXIvZW50cnkvZG93bmxvYWRGaWxlcz9maWxlUGF0aD0ke3Jlc3BvbnNlLmZpbGVQYXRofWA7XG4gICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlOb3RpY2UoQ3JhZnQudCgnRG93bmxvYWQgU3VjY2Vzc2Z1bCcpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5RXJyb3IoQ3JhZnQudChyZXNwb25zZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChodWRJRCBpbiBHYXJuaXNoLkhVRC5hY3RpdmVIVURzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChHYXJuaXNoLkhVRC5hY3RpdmVIVURzW2h1ZElEXS5oaWRlKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL2VudHJpZXMuanMiXSwic291cmNlUm9vdCI6IiJ9