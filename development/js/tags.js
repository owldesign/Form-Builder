let Tag;

window.Tag = Garnish.Base.extend({
    $item: null,
    $deleteTag: null,
    init(item) {
        this.$item = $(item);
        this.$deleteTag = this.$item.find('.option-result-delete');
        
        return this.addListener(this.$deleteTag, 'click', 'delete');
    },

    "delete"(e) {
        let self;
        e.preventDefault();
        self = this;
        this.$item.addClass('zap');
        setTimeout((() => {
            self.$item.remove();
            Craft.cp.displayNotice(Craft.t('Item Removed'));
        }), 300);
    }
});

Garnish.$doc.ready(() => $('.result-item').each((i, el) => new window.Tag(el)));
