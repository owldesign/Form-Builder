let LD

LD = {
    setup() {}
}

LD = new (Garnish.Base.extend({
    layoutId: null,
    formId: null,
    $settingsBtn: null,

    init() {
        this.layoutId = null
        this.layoutId = null
        this.$settingsBtn = $('.fields-settings')

        this.addListener(this.$settingsBtn, 'click', 'showFieldsSettings')
    },

    setup() {
    },

    showFieldsSettings() {
        let self
        self = this

        modal = new FieldSettingsModal()
        modal.on('setFieldsSettings', e => self.setFormData(e))
        modal.show()
    },

    setFormData(data) {
        let self
        let $container
        let $field
        let name
        self = this

        $container = $('#fieldlayoutsettings')
        name = 'settings[fields][global]'

        $container.html('')

        if (Object.keys(data.options).length === 0) {
            $('.fields-settings').removeClass('has-values')
        } else {
            $('.fields-settings').addClass('has-values')

            $.each(data.options, (key, item) => {
                if ($container.find(`input[name="${name}[${key}]"]`).length > 0) {
                    if (item) {
                        $container.find(`input[name="${name}[${key}]"]`).val(item)
                    } else {
                        $container.find(`input[name="${name}[${key}]"]`).remove()
                    }
                } else {
                    if (item) {
                        $(`<input type="hidden" name="${name}[${key}]">`).val(item).appendTo($container)
                    }
                }
            })
        }
    },

    getLayoutId() {
        return this.layoutId
    },

    getFormId() {
        return this.formId
    }
}))

FieldSettingsModal = Garnish.Modal.extend({
    $formClass: null,
    $formId: null,
    $inputClass: null,
    $inputTemplate: null,
    $formContainer: null,

    timeout: null,

    init() {
        let body
        this.base()

        this.$formContainer = $('<form class="modal fitted formbuilder-modal has-sidebar">').appendTo(Garnish.$bod)
        this.setContainer(this.$formContainer)

        body = $([
            '<section class="modal-container">',
                '<div class="modal-sidebar">', 
                    '<nav>', 
                        '<a href="#" class="modal-nav active" data-target="modal-content-styles"><i class="far fa-clipboard-list"></i> <span class="link-text">Styles</span></a>', 
                        '<a href="#" class="modal-nav" data-target="modal-content-settings"><i class="far fa-window-alt"></i> <span class="link-text">Settings</span></a>', 
                    '</nav>', 
                '</div>', 
                '<div class="modal-content-container">', 
                    '<div class="modal-content modal-content-styles active">', 
                        '<header>', 
                            '<span class="modal-title">', 'Form Attributes', '</span>', 
                            '<div class="instructions">', 'Global form attributes', '</div>', 
                        '</header>', 
                        '<div class="body">', 
                            '<div class="fb-field">', 
                                '<div class="input-hint">', 
                                    'CLASS', 
                                '</div>', 
                                '<input type="text" class="text fullwidth global-form-class">', 
                            '</div>', 
                            '<div class="fb-field">', 
                                '<div class="input-hint">', 
                                    'ID', 
                                '</div>', 
                                '<input type="text" class="text fullwidth global-form-id">', 
                            '</div>', 
                        '</div>', 
                    '</div>',
                    '<div class="modal-content modal-content-settings">', 
                        '<header>', 
                            '<span class="modal-title">', 'Input Settings', '</span>', 
                            '<div class="instructions">', 'Global input settings', '</div>', 
                        '</header>', 
                        '<div class="body">',
                            '<div class="fb-field">', 
                                '<div class="input-hint">', 
                                    'CLASS', 
                                '</div>', 
                                '<input type="text" class="text fullwidth global-input-class">', 
                            '</div>', 
                            '<div class="fb-field has-spinner">', 
                                '<div class="spinner hidden"></div>',
                                '<div class="input-hint">', 
                                    'TEMPLATES', 
                                '</div>', 
                                '<input type="text" class="text fullwidth global-input-template">', 
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


        this.$formClass = body.find('.global-form-class')
        this.$formId = body.find('.global-form-id')
        this.$inputClass = body.find('.global-input-class')
        this.$inputTemplate = body.find('.global-input-template')

        this.$navLink = body.find('.modal-nav')
        this.$cancelBtn = body.find('.cancel')

        this.loadModalValues()

        this.addListener(this.$cancelBtn, 'click', 'hide')
        this.addListener(this.$navLink, 'click', 'toggleModalContent')
        this.addListener(this.$inputTemplate, 'keyup', 'checkTemplatePath')
        this.addListener(this.$formContainer, 'submit', 'onFormSubmit')
    },

    checkTemplatePath() {
        let $container
        let $hint

        $container = this.$inputTemplate.parent()
        $spinner = $container.find('.spinner')
        $hint = $container.find('.input-hint')

        data = {
            path: this.$inputTemplate.val()
        }

        $spinner.removeClass('hidden')

        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            $spinner.addClass('hidden')

            Craft.postActionRequest('formBuilder/form/checkIinputTemplatePath', data, $.proxy(((response, textStatus) => {
                if (response.valid) {
                    $hint.removeClass('error')
                    $hint.addClass('success')
                } else {
                    $hint.removeClass('success')
                    $hint.addClass('error')
                }
            }), this))
        }, 1000)
    },

    loadModalValues() {
        $formClass = $('input[name="settings[fields][global][formClass]"]').val()
        $formId = $('input[name="settings[fields][global][formId]"]').val()
        $inputClass = $('input[name="settings[fields][global][inputClass]"]').val()
        $inputTemplate = $('input[name="settings[fields][global][inputTemplate]"]').val()

        if ($formClass) {
            this.$formContainer.find('.global-form-class').val($formClass)
        }

        if ($formId) {
            this.$formContainer.find('.global-form-id').val($formId)
        }

        if ($inputClass) {
            this.$formContainer.find('.global-input-class').val($inputClass)
        }

        if ($inputTemplate) {
            this.$formContainer.find('.global-input-template').val($inputTemplate)
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
        let options
        options = {}

        e.preventDefault()

        if (!this.visible) {
            return
        }

        if (this.$formClass.val()) {
            options.formClass = this.$formClass.val()
        }

        if (this.$formId.val()) {
            options.formId = this.$formId.val()
        }

        if (this.$inputClass.val()) {
            options.inputClass = this.$inputClass.val()
        }

        if (this.$inputTemplate.val()) {
            options.inputTemplate = this.$inputTemplate.val()
        }

        this.trigger('setFieldsSettings', { options: options })
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
        // let self
        // let values
        // self = this

        // if (options.length > 0) {
        //     values = JSON.parse(options[this.field.id])

        //     $.each(values, (key, value) => {
        //         if (key == 'class' && value) {
        //             self.$classInput.val(value)
        //         }

        //         if (key == 'id' && value) {
        //             self.$idInput.val(value)
        //         }
        //     })

        //     if (!Garnish.isMobileBrowser()) {
        //         setTimeout($.proxy((function() {
        //             this.$classInput.focus()
        //         })))
        //     }
        // }
        
        this.base()
    }

})

window.LD = LD