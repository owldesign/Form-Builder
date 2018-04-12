class AjaxForm
    constructor: (el) ->
        @$form = $(el)
        @$notificationContainer = $('<div></div>')

    init: =>
        @$form.on 'submit', $.proxy(((e) =>
            e.preventDefault()
            @submitForm(e)
        ), this)

    submitForm: (e) ->
        data = @$form.serialize()
        url = '/actions/formBuilder/entry/save'
        @$form.addClass 'submitting'
        $.post url, data, $.proxy(((response) ->
            @$form.removeClass 'submitting'
            @$form.append @$notificationContainer
            if response.success
                if window.CustomEvent
                    responseEvent = new CustomEvent('formbuilder:submit',
                        detail:
                            'response': response
                            'class': e.currentTarget.className
                            'handle': e.currentTarget.id
                        bubbles: true
                        cancelable: true)
                    e.currentTarget.dispatchEvent responseEvent

                @$notificationContainer.html '<p class="form-notification success-message">' + response.message + '</p>'
                @$form[0].reset()
            else
                @$notificationContainer.html '<p class="form-notification fail-message">' + response.message + '</p>'
        ), this)