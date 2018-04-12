let WriteNoteWidget

WriteNoteWidget = Garnish.Base.extend({
    $widget: null,
    $btn: null,
    $list: null,
    $noteTextarea: null,
    $spinner: null,

    modal: null,
    note: null,
    entryId: null,

    init(widget) {
        this.$widget = $(widget)
        this.$btn = this.$widget.find('#write-note-btn')
        this.$list = this.$widget.find('.list')
        this.$spinner = this.$widget.find('.loader')

        this.entryId = this.$widget.data('entry-id')

        this.addListener(this.$btn, 'click', 'openNoteModel')
    },

    openNoteModel(e) {
        e.preventDefault()

        if (this.modal) {
            delete this.modal
            this.modal = new NoteModal(this)
        } else {
            this.modal = new NoteModal(this)
        }
        
        this.modal.on('save', $.proxy(this, 'updateNotes'))
    },

    updateNotes(data) {
        this.$spinner.removeClass('hidden')

        data = {
            note: this.note,
            entryId: this.entryId
        }

        Craft.postActionRequest('formBuilder/notes/save', data, $.proxy(((response, textStatus) => {
            if (textStatus === 'success') {
                Craft.cp.displayNotice(Craft.t('Note added'))
                this.$spinner.addClass('hidden')
                this.updateNotesHtml(response.note)
            }
        }), this))

        this.modal.hide()
    },

    updateNotesHtml(data) {
        let author
        let note

        note = data.note
        author = data.author.fullName

        $markup = $('<div class="list-item pad">' +
                '<div class="item-meta">' +
                    '<span class="item-meta-icon"><i class="far fa-user"></i></span>' +
                    '<span class="item-meta-title">' + author + '</span>' +
                    '<span class="item-meta-right">' + Craft.t('Now') + '</span>' +
                '</div>' +
                '<div class="item-title">' + note + '</div>' +
            '</div>')

        this.$list.prepend($markup)
        $('.no-items').remove()
    }

})

NoteModal = Garnish.Modal.extend({
    widget: null,

    init(widget) {
        var body, self
        self = this
        this.base()

        this.widget = widget

        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod)
        this.setContainer(this.$form)
        
        body = $([
            '<header>', 
                '<span class="modal-title">' + Craft.t('Note') + '</span>', 
                '<div class="instructions">' + Craft.t('Leave a note for this entry') + '</div>', 
            '</header>', 
            '<div class="body">', 
                '<div class="fb-field">',
                    '<div class="input-hint">TEXT</div>',
                    '<div class="input"><textarea id="note-text" rows="6"></textarea></div>', 
                '</div>', 
            '</div>', 
            '<footer class="footer">', 
                '<div class="buttons">', 
                    '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', 
                    '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Add') + '">', 
                '</div>', 
            '</footer>'].join('')).appendTo(this.$form)

        this.show();
        this.$saveBtn = body.find('.submit')
        this.$cancelBtn = body.find('.cancel')
        this.$noteTextarea = body.find('#note-text')

        this.addListener(this.$cancelBtn, 'click', 'hide')
        this.addListener(this.$form, 'submit', 'save')
    },

    save(e) {
        e.preventDefault()
        this.note = this.$noteTextarea.val()
        this.widget.note = this.note

        if (this.note == '') {
            Garnish.shake(this.$container)
        } else {
            this.trigger('save', {
                note: this.note
            })
        }
    },
})

AssetManagement = Garnish.Base.extend({
    $container: null,
    $elements: null,
    $form: null,
    $trigger: null,
    
    downloadCount: null,

    init(container) {
        this.$container = $(container)
        this.$elements = this.$container.find('.item-asset')
        
        this.$form = this.$container.find('#download-all-assets')
        this.$trigger = this.$form.find('button')
        this.downloadCount = this.$form.find('.asset-count')
        this.$status = $('.download-status', this.$form)

        this.$elements.each((i, el) => {
            element = new AssetFile(el, this)
        });
        
        this.addListener(this.$form, 'submit', 'onSubmit')
    },

    updateDownloadBtn() {
        items = Object.keys(AssetManagement.storage).length

        if (items > 0) {
            this.downloadCount.html(items)
            this.$trigger.removeClass('hidden')
        } else {
            this.$trigger.addClass('hidden')
            this.downloadCount.html('0')
        }
    },

    onSubmit(e) {
        e.preventDefault()

        if (!this.$trigger.hasClass('disabled')) {
            if (!this.progressBar) {
                this.progressBar = new Craft.ProgressBar(this.$status)
            } else {
                this.progressBar.resetProgressBar()
            }

            this.progressBar.$progressBar.removeClass('hidden')

            this.progressBar.$progressBar.velocity('stop').velocity({
                opacity: 1
            }, {
                complete: $.proxy(function() {
                    let postData = Garnish.getPostData(this.$form)
                    let params = Craft.expandPostArray(postData)

                    params.assets = items = AssetManagement.storage

                    let data = {
                        params: params
                    }

                    Craft.postActionRequest(params.action, data, $.proxy(function(response, textStatus) {
                        if (textStatus === 'success') {
                            if (response && response.error) {
                                alert(response.error)
                            }

                            this.updateProgressBar()

                            if (response && response.downloadFile) {
                                var $iframe = $('<iframe/>', {'src': Craft.getActionUrl('formBuilder/assets/downloadFile', {'filename': response.downloadFile})}).hide()
                                this.$form.append($iframe)
                            }

                            setTimeout($.proxy(this, 'onComplete'), 300)

                        } else {
                            Craft.cp.displayError(Craft.t('There was a problem downloading assets. Please check the Craft logs.'))

                            this.onComplete(false)
                        }

                    }, this), {
                        complete: $.noop
                    })
                }, this)
            })

            if (this.$allDone) {
                this.$allDone.css('opacity', 0)
            }

            this.$trigger.addClass('disabled')
            this.$trigger.trigger('blur')
        }
    },

    updateProgressBar: function() {
        let width = 100
        this.progressBar.setProgressPercentage(width)
    },

    onComplete: function(showAllDone) {
        this.progressBar.$progressBar.velocity({opacity: 0}, {
            duration: 'fast', 
            complete: $.proxy(function() {
                this.$trigger.removeClass('disabled')
                this.$trigger.trigger('focus')
            }, this)
        })
    }

}, {
    storage: {},

    setStorage(namespace, key, value, remove = false) {
        if (typeof AssetManagement.storage[namespace] == typeof undefined) {
            AssetManagement.storage[namespace] = {}
        }

        if (remove) {
            delete AssetManagement.storage[namespace]
        } else {
            AssetManagement.storage[namespace][key] = value
        }

    },

    getStorage(namespace, key) {
        if (AssetManagement.storage[namespace] && AssetManagement.storage[namespace][key]) {
            return AssetManagement.storage[namespace][key]
        }

        return null
    },
})

AssetFile = Garnish.Base.extend({
    element: null,
    $selectBtn: null,

    parent: null,
    id: null,

    init(element, parent) {
        this.parent = parent
        this.element = $(element)
        this.$selectBtn = this.element.find('.asset-select')
        this.id = this.$selectBtn.data('asset-id')

        this.addListener(this.$selectBtn, 'click', 'toggleSelection')
    },

    toggleSelection() {
        if (this.$selectBtn.hasClass('active')) {
            this.$selectBtn.removeClass('active')
            this.element.removeClass('selected')
            AssetManagement.setStorage(this.id, 'asset', this.id, true)
        } else {
            this.element.addClass('selected')
            this.$selectBtn.addClass('active')
            AssetManagement.setStorage(this.id, 'asset', this.id)
        }   

        this.parent.updateDownloadBtn()
    }
})

Garnish.$doc.ready(() => {

    new WriteNoteWidget('.notes-widget')
    new AssetManagement('#main')

    if (Craft.elementIndex) {
        Craft.elementIndex.on('updateElements', function(e) {
            let elementsCount;
            let selectedSource;
            let unreadItems;

            Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(((response, textStatus) => {
                if (response.success) {
                    window.FormBuilder.unreadCount = response.count;
                    
                    if (response.count > 0) {
                        return $('.total-entry-count').html(response.count);
                    } else {
                        return $('.total-entry-count').html('');
                    }
                }
            }), this));

            selectedSource = e.target.instanceState.selectedSource;

            if (e.target.view._totalVisible === 0) {
                e.target.view.$elementContainer.html($(`<tr><td colspan="6">${Craft.t("No entries available")}</td></tr>`));
            }

            // Update unread count utility nav
            Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(((response, textStatus) => {
                if (textStatus === 'success') {
                    $('#sources .entry-count').html('')
                    $.each(response.grouped, (key, entries) => {
                        $('[data-key="formId:'+key+'"]').find('.entry-count').html(entries.length)
                    })

                    if (response.totalCount > 0) {
                        $('.fb-unread-container .fb-badge').addClass('show')
                        $('.fb-unread-container .fb-badge .count').html(response.totalCount)
                        $('#unread-notifications').find('.body').html(response.template)
                    } else {
                        $('.fb-unread-container .fb-badge').removeClass('show')
                        $('.fb-unread-container .fb-badge .count').html('')
                        $('#unread-notifications').find('.body').html('<p class="no-content">'+Craft.t('No unread submissions.')+'</p>')
                    }
                }
            }), this))
        });
    }
    // TODO: delete entry and all assets and notes
    $('#delete-entry').on('click', (e) => {
        let entryId = $(e.currentTarget).data('entry-id')
        let data = {
            id: entryId
        }

        if (confirm(Craft.t("Deleting entry will remove all relevant assets and notes, are you sure?"))) {
            Craft.postActionRequest('formBuilder/entry/delete', data, $.proxy(((response, textStatus) => {
                if (textStatus === 'success') {
                    Craft.cp.displayNotice(Craft.t('Deleting entry...'))

                    setTimeout(function() { 
                        window.location.href = `${window.FormBuilder.adminUrl}/entries`
                    }, 2000)

                }
            }), this));
        }
    })

    $('.submission-action-trigger').on('click', function(e) {
        e.preventDefault();
        
        let $menu;
        let entryId;
        let fileIds;
        let formId;
        let type;

        type = $(this).data('type');
        formId = $(this).data('form-id');
        entryId = $(this).data('entry-id');
        fileIds = $(this).data('file-ids');
        $menu = $('<div class="tout-dropdown"/>').html('<ul class="form-item-menu">' + '</ul>');

        if (type === 'submission') {
            $('<li><a href="#" class="delete-submission">Delete Submission</a></li>').appendTo($menu.find('ul'));
        } else if (type === 'form') {
            $(`<li><a href="${window.FormBuilder.adminUrl}/forms/${formId}">View Form</a></li>`).appendTo($menu.find('ul'));
        } else if (type === 'uploads') {
            $(`<li><a href="${window.FormBuilder.adminUrl}/entries" class="delete-all-files">Delete All</a></li>`).appendTo($menu.find('ul'));
            $(`<li><a href="${window.FormBuilder.adminUrl}/entries" class="download-all-files">Download All</a></li>`).appendTo($menu.find('ul'));
        }

        new Garnish.HUD($(this), $menu, {
            hudClass: 'hud fb-hud submissionhud',
            closeOtherHUDs: false
        });

        $menu.find('.delete-submission').on('click', function(e) {
            e.preventDefault();
            let data;
            data = {
              id: entryId
            };

            if (confirm(Craft.t("Are you sure you want to delete this entry?"))) {
                Craft.postActionRequest('formBuilder/entry/delete', data, $.proxy(((response, textStatus) => {
                    if (textStatus === 'success') {
                        Craft.cp.displayNotice(Craft.t('Entry deleted'));
                        window.location.href = `${window.FormBuilder.adminUrl}/entries`;
                    }
                }), this));
            }
        });

        $menu.find('.delete-all-files').on('click', function(e) {
            let data;
            e.preventDefault();
            data = {
              fileId: fileIds
            };

            if (confirm(Craft.t("Are you sure you want to delete all files?"))) {
                Craft.postActionRequest('assets/deleteFile', data, $.proxy(((response, textStatus) => {
                    let hudID;
                    if (response.success) {
                        for (hudID in Garnish.HUD.activeHUDs) {
                            Garnish.HUD.activeHUDs[hudID].hide();
                        }

                        $('.upload-details').parent().velocity('fadeOut', {
                            duration: '100'
                        });

                      return setTimeout((() => $('.upload-details').parent().remove()), 100);
                    }
                }), this));
            }
        });

        $menu.find('.download-all-files').on('click', function(e) {
            e.preventDefault();
            let data;
            Craft.cp.displayNotice(Craft.t('Downloading...'));
            data = {
              ids: fileIds,
              formId
            };

            Craft.postActionRequest('formBuilder/entry/downloadAllFiles', data, $.proxy(((response, textStatus) => {
                let hudID;
                let results;
                if (response.success) {
                    window.location = `/actions/formbuilder/entry/downloadFiles?filePath=${response.filePath}`;
                    Craft.cp.displayNotice(Craft.t('Download Successful'));
                } else {
                    Craft.cp.displayError(Craft.t(response.message));
                }

                results = [];

                for (hudID in Garnish.HUD.activeHUDs) {
                    results.push(Garnish.HUD.activeHUDs[hudID].hide());
                }

                return results;
            }), this));
        });

    });
});