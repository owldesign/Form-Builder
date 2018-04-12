let LD_Fields

LD_Fields = {
    setup() {}
}

LD_Fields = new (Garnish.Base.extend({
    fields: null,
    options: null,

    init() {
        this.fields = {}
        this.options = {}
    },

    setup() {
        let self
        let FLD
        let FLD_init
        let FLD_field
        let FLD_fieldOptions
        self = this

        if (Craft.FieldLayoutDesigner) {
            FLD = Craft.FieldLayoutDesigner
            FLD_init = FLD.prototype.init
            FLD_field = FLD.prototype.initField
            FLD_fieldOptions = FLD.prototype.onFieldOptionSelect

            FLD.prototype.init = function() {
                FLD_init.apply(this, arguments)
                this.fieldEditor = new FieldEditor(this)
            }

            FLD.prototype.initField = function($field) {
                let $preview
                let $editBtn
                let $html
                let $menu
                let $ul
                let menu
                let menuBtn

                FLD_field.apply(this, arguments)

                $editBtn = $field.find('.settings')
                menuBtn = $editBtn.data('menubtn')
                menu = menuBtn.menu
                $menu = menu.$container
                $ul = $menu.children('ul')
                $html = $('<li><a data-action="fieldoptions">' + Craft.t('Options') + '</a></li>').appendTo($ul)

                $preview = $([
                    '<div class="field-options-preview">',
                    '</div>'
                ].join('')).appendTo($field)

                return menu.addOptions($html.children('a'))
            }

            FLD.prototype.onFieldOptionSelect = function(option) {
                let $field
                let $option
                let action

                FLD_fieldOptions.apply(this, arguments)

                $option = $(option)
                $field = $option.data('menu').$anchor.parent()
                action = $option.data('action')

                switch (action) {
                    case 'fieldoptions':
                        this.trigger('fieldOptionsSelected', {
                            target: $option[0],
                            $target: $option,
                            $field: $field,
                            fld: this,
                            id: $field.data('id') | 0
                        })
                }
            }
        }
    },

    getOptions(layoutId) {
        let options
        options = {}

        $.each(this.options, (key, item) => {
            if (parseInt(item.fieldLayoutId) == layoutId) {
                options[item.fieldId] = item.options
            }
        })

        return options
    }
}))

FieldEditor = Garnish.Base.extend({
    fld: null,
    options: null,
    layoutId: null,
    namespace: 'form-builder',

    init(fld) {
        this.fld = fld
        this.layoutId = LD.getLayoutId()
        this.options = LD_Fields.getOptions(this.layoutId)

        this.fld.on('fieldOptionsSelected', $.proxy(this.openOptionsModal, this))

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
                    options = this.options[key]
                    results.push(this.setFormData(key, value))
                } else {
                    results.push(void 0)
                }
            })

            return results
        }

    },

    openOptionsModal(e) {
        let self
        let formId
        let modal
        self = this
        formId = e.id

        modal = new FieldOptionsModal(e)
        modal.on('setOptions', e => self.setFormData(formId, e.options))
        modal.show(this.options)
    },

    setFormData(fieldId, options) {
        let self
        let $container
        let $field
        let name
        self = this

        $container = this.fld.$container
        $field = $container.find('.fld-field[data-id="' + fieldId + '"]:not(".unused")')
        name = this.namespace + '[field][' + fieldId + '][options]'

        $.each(options, (key, item) => {
            if ($field.children(`input[name="${name}[${key}]"]`).length > 0) {
                if (item) {
                    $field.children(`input[name="${name}[${key}]"]`).val(item)
                    self.updatePreview($field, key, item)
                } else {
                    $field.children(`input[name="${name}[${key}]"]`).remove()
                    self.removePreview($field, key, item)
                }
            } else {
                if (item) {
                    self.updatePreview($field, key, item)
                    $(`<input type="hidden" name="${name}[${key}]">`).val(item).appendTo($field)
                }
            }
        })
    },

    updatePreview(field, type, value) {
        body = field.find('.field-options-preview')
        markup = $('<div class="field-'+ type +'-preview"><span class="preview-type">'+ type +'</span> '+value+'</div>')
        oldMarkup = body.find('.field-'+ type +'-preview')

        if (oldMarkup) {
            oldMarkup.remove()
        }

        markup.appendTo(body)
    },

    removePreview(field, type, value) {
        field.find('.field-'+type+'-preview').remove()
    }
})

FieldOptionsModal = Garnish.Modal.extend({
    field: null,
    $formContainer: null,
    $classInput: null,
    $idInput: null,
    $templateInput: null,

    init(field) {
        let body
        this.field = field
        this.base()

        this.$formContainer = $('<form class="modal fitted formbuilder-modal has-sidebar">').appendTo(Garnish.$bod)
        this.setContainer(this.$formContainer)

        body = $([
            '<section class="modal-container">',
                '<div class="modal-sidebar">', 
                    '<nav>', 
                        '<a href="#" class="modal-nav active" data-target="modal-content-styles"><i class="far fa-magic"></i> <span class="link-text">Styles</span></a>', 
                        '<a href="#" class="modal-nav" data-target="modal-content-settings"><i class="far fa-cog"></i> <span class="link-text">Settings</span></a>', 
                    '</nav>', 
                '</div>', 
                '<div class="modal-content-container">', 
                    '<div class="modal-content modal-content-styles active">', 
                        '<header>', 
                            '<span class="modal-title">', 'Attributes', '</span>', 
                            '<div class="instructions">', 'Custom field attributes', '</div>', 
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
                    '</div>',
                    '<div class="modal-content modal-content-settings">', 
                        '<header>', 
                            '<span class="modal-title">', 'Settings', '</span>', 
                            '<div class="instructions">', 'Custom field settings', '</div>', 
                        '</header>', 
                        '<div class="body">', 
                            '<div class="fb-field">', 
                                '<div class="input-hint">', 
                                    'TEMPLATE', 
                                '</div>', 
                                '<input type="text" class="text fullwidth input-template">', 
                            '</div>', 
                        '</div>', 
                    '</div>',
                '</div>',
            '</section>',
            '<footer class="footer">', 
                '<div class="buttons">', 
                    `<input type="button" class="btns btn-modal cancel" value="${Craft.t('Cancel')}">`, 
                    `<input type="submit" class="btns btn-modal submit" value="${Craft.t('Save')}">`, 
                '</div>', 
            '</footer>'
        ].join('')).appendTo(this.$formContainer);

        this.$classInput = body.find('.input-class')
        this.$idInput = body.find('.input-id')
        this.$templateInput = body.find('.input-template')

        this.$navLink = body.find('.modal-nav')
        this.$cancelBtn = body.find('.cancel')

        this.loadModalValues()

        this.addListener(this.$cancelBtn, 'click', 'hide')
        this.addListener(this.$navLink, 'click', 'toggleModalContent')
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit')
    },

    loadModalValues() {
        $classInput = $('input[name="form-builder[field]['+ this.field.id +'][options][class]"]').val()
        $idInput = $('input[name="form-builder[field]['+ this.field.id +'][options][id]"]').val()
        $templateInput = $('input[name="form-builder[field]['+ this.field.id +'][options][template]"]').val()

        if ($classInput) {
            this.$formContainer.find('.input-class').val($classInput)
        }

        if ($idInput) {
            this.$formContainer.find('.input-id').val($idInput)
        }

        if ($templateInput) {
            this.$formContainer.find('.input-template').val($templateInput)
        }
    },

    toggleModalContent(e) {
        e.preventDefault()
        let target
        let link
        let height

        link = $(e.currentTarget)
        target = link.data('target')
        height = $('.'+target).height() + 53

        $('.modal-nav').removeClass('active')
        $('.modal-content').removeClass('active')

        link.addClass('active')
        $('.'+target).addClass('active')

        this.$container.velocity('stop')
        this.$container.velocity({height: height}, 'fast', () => {
            this.$container.css({
                height: height,
                minHeight: 'auto'
            })
        })
    },

    onFormSubmit(e) {
        e.preventDefault()

        if (!this.visible) {
            return
        }

        this.trigger('setOptions', {
            options: {
                "class": this.$classInput.val(),
                id: this.$idInput.val(),
                template: this.$templateInput.val()
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
        self = this

        if (options.length > 0) {
            values = JSON.parse(options[this.field.id])

            $.each(values, (key, value) => {
                if (key == 'class' && value) {
                    self.$classInput.val(value)
                }

                if (key == 'id' && value) {
                    self.$idInput.val(value)
                }
            })

            if (!Garnish.isMobileBrowser()) {
                setTimeout($.proxy((function() {
                    this.$classInput.focus()
                })))
            }
        }
        
        this.base()
    }

})

window.LD_Fields = LD_Fields