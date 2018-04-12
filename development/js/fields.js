let Field;
let Fields;

window.Fields = Garnish.Base.extend({
    $container: null,
    $form: null,
    $body: null,
    $tagContainer: null,
    $targetEl: null,
    $target: null,
    init(container, form, target) {
        let self;
        let tags;
        let targetClassName;
        self = this;
        this.$container = container;
        this.$form = $(form);
        this.$body = this.$form.find('.body');
        this.$tagContainer = $('<div class="tags-container"></div>');
        this.$body.append(this.$tagContainer);
        tags = [];

        $.each($.parseJSON(this.$container.$fields), (i, item) => tags[i] = `<div class='tag-btn tag-${item.value}' data-tag='{${item.value}}'>${item.label}</div>`);
        
        tags.splice(0, 1);
        this.$tagContainer.html(tags);
        
        $.each(this.$container.$inputs, (i, item) => {
            if (item.tags) {
                self.$targetEl = item;
            }
        });

        targetClassName = this.$targetEl.name.replace(/[_\W]+/g, "-").slice(0, -1);
        this.$target = $(`.${targetClassName}`);
        
        $.each(this.$tagContainer.find('.tag-btn'), (i, item) => new Field(item, self.$target));
    }
});


Field = Garnish.Base.extend({
    $tag: null,
    $target: null,

    init(tag, target) {
        this.$tag = $(tag);
        this.$target = target;
        
        return this.addListener(this.$tag, 'click', 'addTag');
    },

    addTag() {
        let tag;
        tag = this.$tag.data('tag');
        
        return this.$target.val(this.$target.val() + tag);
    }
});