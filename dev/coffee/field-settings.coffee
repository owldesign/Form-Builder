(($) ->
    FieldSettings = setup: ->

    if $ and window.Garnish and window.Craft
        FieldSettings = new (Garnish.Base.extend(
            fields: null
            layouts: null
            inputs: null
            htmls: null
            settings: null

            init: ->
                @fields = {}
                @layouts = {}
                @inputs = {}
                @htmls = {}
                @settings = {}

            setup: ->
                if Craft.FieldLayoutDesigner
                    FLD = Craft.FieldLayoutDesigner
                    FLD_init = FLD::init
                    FLD_field = FLD::initField
                    FLD_options = FLD::onFieldOptionSelect

                    FLD::init = ->
                        FLD_init.apply this, arguments
                        @fieldEditor = new window.FieldEditor(@)

                    FLD::initField = ($field) ->
                        FLD_field.apply this, arguments
                        $editBtn = $field.find '.settings'
                        menuBtn = $editBtn.data 'menubtn'
                        menu = menuBtn.menu
                        $menu = menu.$container
                        $ul = $menu.children 'ul'
#                        $input = $('<li><a data-action="fieldinput">' + Craft.t('Input Settings') + '</a></li>').appendTo($ul)
                        $html = $('<li><a data-action="fieldhtml">' + Craft.t('HTML Settings') + '</a></li>').appendTo($ul)
#                        menu.addOptions $input.children 'a'
                        menu.addOptions $html.children 'a'

                    FLD::onFieldOptionSelect = (option) ->
                        FLD_options.apply this, arguments
                        $option = $(option)
                        $field = $option.data('menu').$anchor.parent()
                        action = $option.data 'action'

                        switch action
                            when 'fieldinput'
                                @trigger 'inputSettingsSelected',
                                    target: $option[0]
                                    $target: $option
                                    $field: $field
                                    fld: this
                                    id: $field.data('id') | 0
                            when 'fieldhtml'
                                @trigger 'htmlSettingsSelected',
                                    target: $option[0]
                                    $target: $option
                                    $field: $field
                                    fld: this
                                    id: $field.data('id') | 0

            getFieldInfo: (id) ->
                return @fields[id]

            getFieldLayoutId: (element) ->
                $form = if element then $(element) else Craft.cp.$primaryForm
                $input = $form.find 'input[name="fieldLayoutId"]'

                return if $input.length then $input.val() | 0 else false

            getHtmlSettingsOnFieldLayout: (fieldLayoutId) ->
                fieldLayoutId = if isNaN(fieldLayoutId) then @getFieldLayoutId() else fieldLayoutId
                htmls = {}

                $.each @htmls, (key, item) ->
                    fieldId = item.fieldId
                    if parseInt(item.fieldLayoutId) == fieldLayoutId
                        htmls[fieldId] = item.html

                return htmls

            getInputSettingsOnFieldLayout: (fieldLayoutId) ->
                fieldLayoutId = if isNaN(fieldLayoutId) then @getFieldLayoutId() else fieldLayoutId
                inputs = {}

                $.each @inputs, (key, item) ->
                    fieldId = item.fieldId
                    if parseInt(item.fieldLayoutId) == fieldLayoutId
                        inputs[fieldId] = item.input

                return inputs
        ))

        FieldEditor = Garnish.Base.extend(
            fld: null
            inputs: null
            htmls: null
            namespace: 'formbuilder'
            $form: null

            init: (fld) ->
                if !(fld instanceof Craft.FieldLayoutDesigner)
                    return

                @fld = fld
                @fld.on 'inputSettingsSelected', $.proxy(@openInputSettingsModal, this)
                @fld.on 'htmlSettingsSelected', $.proxy(@openHtmlSettingsModal, this)
                @$form = @fld.$container.closest 'form'

                @inputs = {}
                @htmls = {}

                fieldLayoutId = FieldSettings.getFieldLayoutId(@$form)

                if fieldLayoutId != false
                    @applyHtmlFieldSettings fieldLayoutId
                    @applyInputFieldSettings fieldLayoutId

            applyHtmlFieldSettings: (fieldLayoutId) ->
                initSettings = FieldSettings.getHtmlSettingsOnFieldLayout(fieldLayoutId)

                @htmls = initSettings
                if initSettings
                    for fieldId of initSettings
                        if initSettings.hasOwnProperty(fieldId)
                            setting = initSettings[fieldId]
                            @setFormData(fieldId, setting, 'html')

            applyInputFieldSettings: (fieldLayoutId) ->
                initSettings = FieldSettings.getInputSettingsOnFieldLayout(fieldLayoutId)

                @inputs = initSettings
                if initSettings
                    for fieldId of initSettings
                        if initSettings.hasOwnProperty(fieldId)
                            setting = initSettings[fieldId]
                            @setFormData(fieldId, setting, 'input')

            openInputSettingsModal: (e) ->
                self = @
                fieldId = e.id
                fieldInfo = FieldSettings.getFieldInfo(fieldId)

                modal = new FieldInputSettingsModal(fieldInfo)
                modal.on 'setInputSettings', (e) ->
                    self.setFormData(fieldId, e.settings, 'input')

                modal.show(@inputs)

            openHtmlSettingsModal: (e) ->
                self = @
                fieldId = e.id
                fieldInfo = FieldSettings.getFieldInfo(fieldId)

                modal = new FieldHtmlSettingsModal(fieldInfo)
                modal.on 'setHtmlSettings', (e) ->
                    self.setFormData(fieldId, e.settings, 'html')

                modal.show(@htmls)

            setFormData: (fieldId, data, type) ->
                $container = @fld.$container
                $field = $container.find '.fld-field[data-id="' + fieldId + '"]'
                name = @namespace + '[field][' + fieldId + '][' + type + ']'

                if type == 'input'
                    $field.children('.input-settings-item').remove()
                else if type == 'html'
                    $field.children('.html-settings-item').remove()

                $.each data, (key, item) ->
                    $field.children('input[name="' + name + '[' + key + ']"]').remove()
                    if item
                        $('<input type="hidden" name="' + name + '[' + key + ']">').val(item).appendTo $field
                        # TODO: add some type of indication that field has settings
                        # $('<span class="item ' + type + '-settings-item">' + key + ': ' + item + '</span>').appendTo $field
        )

        FieldHtmlSettingsModal = Garnish.Modal.extend(
            field: null

            init: (field) ->
                @field = field
                @base()
                @$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod)
                @setContainer @$form
                body = $([
                    '<header>'
                    '<span class="modal-title">'
                    'HTML Settings'
                    '</span>'
                    '<div class="instructions">'
                    'Add custom input html settings'
                    '</div>'
                    '</header>'
                    '<div class="body">'
                        '<div class="fb-field">'
                            '<div class="input-hint">'
                                'CLASS'
                            '</div>'
                            '<input type="text" class="text fullwidth html-settings-class">'
                        '</div>'
                        '<div class="fb-field">'
                            '<div class="input-hint">'
                                'ID'
                            '</div>'
                            '<input type="text" class="text fullwidth html-settings-id">'
                        '</div>'
                        '<div class="fb-field">'
                            '<div class="input-hint">'
                                'STYLE'
                            '</div>'
                            '<textarea class="text fullwidth html-settings-styles"></textarea>'
                        '</div>'
                    '</div>'
                    '<footer class="footer">'
                    '<div class="buttons">'
                    '<input type="button" class="btns btn-modal cancel" value="'+Craft.t('Cancel')+'">'
                    '<input type="submit" class="btns btn-modal submit" value="'+Craft.t('Save')+'">'
                    '</div>'
                    '</footer>'
                ].join('')).appendTo(@$form)

                @$htmlSettingsClass = body.find('.html-settings-class')
                @$htmlSettingsId = body.find('.html-settings-id')
                @$htmlSettingsStyles = body.find('.html-settings-styles')
                @$cancelBtn = body.find('.cancel')

                @addListener @$cancelBtn, 'click', 'hide'
                @addListener @$form, 'submit', 'onFormSubmit'

            onFormSubmit: (e) ->
                e.preventDefault()

                if !@visible
                    return

                @trigger 'setHtmlSettings',
                    settings:
                        class: @$htmlSettingsClass.val()
                        id: @$htmlSettingsId.val()
                        styles: @$htmlSettingsStyles.val()
                @hide()

            onFadeOut: ->
                @base()
                @destroy()

            destroy: ->
                @base()
                @$container.remove()
                @$shade.remove()

            show: (html) ->
                self = @
                values = html[@field.id]

                $.each values, (key, value) ->
                    if key == 'class' and value
                        self.$htmlSettingsClass.val value
                    if key == 'id' and value
                        self.$htmlSettingsId.val value
                    if key == 'styles' and value
                        self.$htmlSettingsStyles.val value

                if !Garnish.isMobileBrowser()
                    setTimeout $.proxy((->
                        @$htmlSettingsClass.focus()
                    ), this), 100

                @base()
        )

        FieldInputSettingsModal = Garnish.Modal.extend(
            field: null

            init: (field) ->
                @field = field
                @base()
                @$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod)
                @setContainer @$form
                body = $([
                    '<header>'
                    '<span class="modal-title">'
                        'Input Settings'
                    '</span>'
                    '<div class="instructions">'
                        'Add custom input settings'
                    '</div>'
                    '</header>'
                    '<div class="body">'
                        '<div class="fb-field">'
                            '<div class="input-hint">'
                                'SIZE'
                            '</div>'
                            '<input type="text" class="text fullwidth input-settings-size">'
                        '</div>'
                    '</div>'
                    '<footer class="footer">'
                    '<div class="buttons">'
                    '<input type="button" class="btns btn-modal cancel" value="'+Craft.t('Cancel')+'">'
                    '<input type="submit" class="btns btn-modal submit" value="'+Craft.t('Save')+'">'
                    '</div>'
                    '</footer>'
                ].join('')).appendTo(@$form)

                @$inputSettingsSize = body.find('.input-settings-size')
                @$cancelBtn = body.find('.cancel')

                @addListener @$cancelBtn, 'click', 'hide'
                @addListener @$form, 'submit', 'onFormSubmit'

            onFormSubmit: (e) ->
                e.preventDefault()

                if !@visible
                    return

                @trigger 'setInputSettings',
                    settings:
                        size: @$inputSettingsSize.val()
                @hide()

            onFadeOut: ->
                @base()
                @destroy()

            destroy: ->
                @base()
                @$container.remove()
                @$shade.remove()

            show: (input) ->
                self = @
                values = input[@field.id]

                $.each values, (key, value) ->
                    if key == 'size' and value
                        self.$inputSettingsSize.val value

                if !Garnish.isMobileBrowser()
                    setTimeout $.proxy((->
                        @$inputSettingsSize.focus()
                    ), this), 100

                @base()
        )

        window.FieldSettings = FieldSettings
        window.FieldEditor = FieldEditor
        window.FieldInputSettingsModal = FieldInputSettingsModal
        window.FieldHtmlSettingsModal = FieldHtmlSettingsModal

) window.jQuery