let LD_Tabs

LD_Tabs = {
    setup() {}
}

LD_Tabs = new (Garnish.Base.extend({
    tabs: null,
    options: null,

    init() {
        this.tabs = {}
        this.options = {}
    },

    setup() {
        let self
        let FLD
        let FLD_tab
        let FLD_addTab
        let FLD_tabOptions
        self = this

        if (Craft.FieldLayoutDesigner) {
            FLD = Craft.FieldLayoutDesigner
            FLD_init = FLD.prototype.init
            FLD_tab = FLD.prototype.initTab
            FLD_addTab = FLD.prototype.addTab
            FLD_tabOptions = FLD.prototype.onFieldOptionSelect

            FLD.prototype.init = function() {
                FLD_init.apply(this, arguments)
                this.tabEditor = new TabEditor(this)
            }

            FLD.prototype.initTab = function($tab) {
                let $tabEl
                let $preview
                let $editBtn
                let $html
                let $menu
                let $ul
                let tabId
                let menu
                let menuBtn

                FLD_tab.apply(this, arguments)

                tabId = $tab.find('.tab').data('id')

                if (tabId) {
                    $editBtn = $tab.find('.tabs .settings')
                    menuBtn = $editBtn.data('menubtn')
                    menu = menuBtn.menu
                    $menu = menu.$container
                    $ul = $menu.children('ul')
                    $html = $('<li><a data-action="taboptions">' + Craft.t('Options') + '</a></li>').appendTo($ul)
                    console.log()

                    $preview = $([
                        '<div class="field-options-preview">',
                        '</div>'
                    ].join('')).appendTo($tab.find('.tabs'))

                    return menu.addOptions($html.children('a'))
                }

            },

            FLD.prototype.onTabOptionSelect = function(option) {
                let $tab
                let $option
                let tabId
                let action

                FLD_tabOptions.apply(this, arguments)
                
                $option = $(option)
                $tab = $option.data('menu').$anchor.parent().parent().parent()
                action = $option.data('action')
                tabId = $tab.find('.tab').data('id')

                switch (action) {
                    case 'rename': {
                        this.renameTab($tab);
                        this.trigger('tabRenamed', {
                            tabId: tabId
                        })
                        break;
                    }
                    case 'delete': {
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
                        })
                        break
                }
            }

            FLD.prototype.addTab = function() {
                return self.addTab(this)
            }
        }

    },

    addTab(e) {
        if (!e.settings.customizableTabs) {
            return
        }

        var $tab = $('<div class="fld-tab">' +
            '<div class="tabs">' +
            '<div class="tab sel draggable">' +
            '<span>Fieldset ' + (e.tabGrid.$items.length + 1) + '</span>' +
            '<a class="settings icon" title="' + Craft.t('Rename') + '"></a>' +
            '</div>' +
            '</div>' +
            '<div class="fld-tabcontent"></div>' +
            '</div>').appendTo(e.$tabContainer)

        e.tabGrid.addItems($tab)
        e.tabDrag.addItems($tab)

        e.initTab($tab)
    },

    getOptions(layoutId) {
        let options
        options = {}

        $.each(this.options, (key, item) => {
            if (parseInt(item.layoutId) == layoutId) {
                options[item.tabId] = item.options
            }
        })

        return options
    }
}))

TabEditor = Garnish.Base.extend({
    fld: null,
    options: null,
    layoutId: null,
    namespace: 'form-builder',

    init(fld) {
        this.fld = fld
        this.layoutId = LD.getLayoutId()
        this.options = LD_Tabs.getOptions(this.layoutId)

        this.fld.on('tabOptionsSelected', $.proxy(this.openOptionsModal, this))
        this.fld.on('tabRenamed', $.proxy(this.onTabRenamed, this))

        if (this.layoutId !== false) {
            this.applyOptions(this.layoutId)
        }
    },

    applyOptions(layoutId) {
        let results

        if (this.options) {
            results = []

            $.each(this.options, (key, value) => {
                if (this.options.hasOwnProperty(key)) {
                    options = JSON.parse(this.options[key])
                    results.push(this.setFormData(key, JSON.parse(value)))
                } else {
                    results.push(void 0)
                }
            })

            return results

        }
    },

    onTabRenamed(e) {
        $tab = $('.tab-id-'+e.tabId)
        $input = $tab.parent().find('.tab-name-field')
        $labelSpan = $tab.find('span')
        tabName = $labelSpan.text()

        $input.val(tabName)
    },

    openOptionsModal(e) {
        let self
        self = this
        let modal
        let tabId
        let $tab = e.$tab
        let $labelSpan

        $labelSpan = $tab.find('.tabs .tab span')
        tabName = $labelSpan.text()
        tabId = e.tabId

        modal = new TabOptionsModal($tab)
        modal.on('setOptions', e => self.setFormData(tabId, e.options, tabName))
        modal.show(this.options)
    },

    setFormData(tabId, options, tabName) {
        let self
        let $container
        let name
        self = this

        $container = $('[data-id="'+tabId+'"]').parent()
        name = this.namespace + '[tab][' + tabId + '][options]'

        $.each(options, (key, item) => {
            if ($container.children(`input[name="${name}[${key}]"]`).length > 0) {
                if (item) {
                    $container.children(`input[name="${name}[${key}]"]`).val(item)
                    self.updatePreview(tabId, $container, key, item)
                } else {
                    $container.children(`input[name="${name}[${key}]"]`).remove()
                    self.removePreview(tabId, $container, key, item)
                }
            } else {
                if (item) {
                    self.updatePreview(tabId, $container, key, item)
                    $(`<input type="hidden" name="${name}[${key}]">`).val(item).appendTo($container)
                }
            }
        })

        $container.find('.tab-name-field').val(tabName)
    },

    updatePreview(tabId, tab, type, value) {
        target = $('[data-id="'+tabId+'"]').parent()
        body = target.find('.field-options-preview')
        markup = $('<div class="field-'+ type +'-preview"><span class="preview-type">'+ type +'</span> '+value+'</div>')
        oldMarkup = body.find('.field-'+ type +'-preview')

        if (oldMarkup) {
            oldMarkup.remove()
        }

        markup.appendTo(body)
    },

    removePreview(tabId, tab, type, value) {
        target = $('[data-id="'+tabId+'"]').parent()
        target.find('.field-'+type+'-preview').remove()
    }

})

TabOptionsModal = Garnish.Modal.extend({
    tab: null,
    form: null,
    $formContainer: null,

    init(tab) {
        let body
        this.tab = tab
        this.base()
        this.$formContainer = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod)
        this.setContainer(this.$formContainer)
        body = $([
            '<header>', 
                '<span class="modal-title">', 'Attributes', '</span>', 
                '<div class="instructions">', 'Custom tab attributes', '</div>', 
            '</header>', 
            '<div class="body">', 
                '<div class="fb-field">', 
                    '<div class="input-hint">', 
                        'CLASS', 
                    '</div>', 
                    '<input type="text" class="text fullwidth input-class">', 
                '</div>', 
                '<div class="fb-field">', 
                    '<div class="input-hint">', 
                        'ID', 
                    '</div>', 
                    '<input type="text" class="text fullwidth input-id">', 
                '</div>', 
            '</div>', 
            '<footer class="footer">', 
                '<div class="buttons">', 
                    `<input type="button" class="btns btn-modal cancel" value="${Craft.t('Cancel')}">`, 
                    `<input type="submit" class="btns btn-modal submit" value="${Craft.t('Save')}">`, 
                '</div>', 
            '</footer>'
        ].join('')).appendTo(this.$formContainer);

        this.$inputClass = body.find('.input-class')
        this.$inputId = body.find('.input-id')

        this.$cancelBtn = body.find('.cancel')

        this.loadModalValues()

        this.addListener(this.$cancelBtn, 'click', 'hide')
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit')
    },

    loadModalValues() {
        tabId = this.tab.find('.tab').data('id')
        $classInput = $('input[name="form-builder[tab]['+ tabId +'][options][class]"]').val()
        $idInput = $('input[name="form-builder[tab]['+ tabId +'][options][id]"]').val()

        if ($classInput) {
            this.$formContainer.find('.input-class').val($classInput)
        }

        if ($idInput) {
            this.$formContainer.find('.input-id').val($idInput)
        }
    },

    onFormSubmit(e) {
        e.preventDefault()

        if (!this.visible) {
            return
        }

        this.trigger('setOptions', {
            options: {
                "class": this.$inputClass.val(),
                id: this.$inputId.val()
            }
        })

        this.hide()
    },

    onFadeOut() {
        this.base()
        this.destroy()
    },

    destroy() {
        this.base()
        this.$container.remove()
        this.$shade.remove()
    },

    show(options) {
        let self
        let values

        if (options.length > 0) {
            values = JSON.parse(options[this.tab.name])
        }

       $.each(values, (key, value) => {
            if (key === 'class' && value) {
                self.$inputClass.val(value)
            }

            if (key === 'id' && value) {
                self.$inputId.val(value)
            }
       })

        if (!Garnish.isMobileBrowser()) {
            setTimeout($.proxy((function() {
                this.$inputClass.focus();
            }), this), 100)
        }

        this.base()
   }
   

})


window.LD_Tabs = LD_Tabs