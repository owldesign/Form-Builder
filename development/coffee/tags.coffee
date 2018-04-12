if $ and window.Garnish
    Tag = Garnish.Base.extend(
        $item: null
        $deleteTag: null

        init: (item) ->
            @$item = $(item)
            @$deleteTag = @$item.find '.option-result-delete'
            
            @addListener @$deleteTag, 'click', 'delete'

        delete: (e) ->
            e.preventDefault()
            self = @
            @$item.addClass 'zap'
            setTimeout (->
                self.$item.remove()
                Craft.cp.displayNotice(Craft.t('Item Removed'))
            ), 300
    )

Garnish.$doc.ready ->
    $('.result-item').each (i, el) ->
        new Tag(el)