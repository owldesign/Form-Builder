let EmailTemplate;

EmailTemplate = Garnish.Base.extend({
    $container: null,

    init(el) {
        this.$container = $(el)

        console.log(this.$container)
    }
})

Garnish.$doc.ready(() => {
    new EmailTemplate('#email-template')

    $('#template-body').redactor({
        focus: true,
        air: true,
        buttons: ['html', 'format', 'bold', 'italic', 'deleted', 'lists', 'link']
    })
})