NotificationElementModal = Craft.BaseElementSelectorModal.extend({
    $notificationsContainer: null,

    type: null,
    index: null,
    form: null,

    init(elementType, settings, type, form) {
        this.type = type
        this.form = form
        this.base(elementType, settings)
        this.index = Math.floor((Math.random() * 10000) + 1)

        this.$notificationsContainer = $('#formbuilder-notifications-container')
    },

    onSelectionChange() {
        this.base()
    },

    onSelect(elementInfo) {

        Craft.postActionRequest('form-builder/integrations/add-notification', {
            index: this.index,
            elementId: elementInfo[0].id, 
            type: this.type,
            form: this.form,
        }, $.proxy((function(response, textStatus) {
            if (response.success) {
                this.$notificationsContainer.append(response.markup)

                new NotificationSection(response.markup, this.type, this.form, this.index)
            }
        }), this));
    }
})

NotificationSection = Garnish.Base.extend({
    $container: null,
    type: null,
    form: null,

    init(el, type, form, index) {
        this.$container = $('#notification-email-' + index)
        this.type = type
        this.form = form
        options = this.$container.find('.option-item')

        new window.FormBuilderSection($('#notification-email-' + index), type)

        options.each((i, el) => new window.Option(el))

    }
})

Garnish.$doc.ready(() => {
    $('.notify-item-btn').on('click', e => {
        e.preventDefault()
        type = e.currentTarget.dataset.type
        elementType = e.currentTarget.dataset.element
        form = e.currentTarget.dataset.context

        switch (type) {
            case 'email':
                new NotificationElementModal(elementType, {}, type, form)
                // this.prepareEmailNotification()
                break
            case 'slack':
                console.log('slack')
                break
            default:
                console.log('nothing available.')
        }
        
        // new Notification(e.currentTarget)
    })
});