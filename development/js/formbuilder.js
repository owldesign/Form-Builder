let UtilityItem

UtilityItem = Garnish.Base.extend({
    $container: null,
    $btn: null,
    $loader: null,
    $badgeContainer: null,
    $countContainer: null,
    $menuContainer: null,

    type: null,
    count: 0,

    init(el) {
        this.$container = $(el);
        this.type = this.$container.data('type')
        this.$btn = this.$container.find('.icon')
        this.$loader = this.$container.find('.loader')
        this.$badgeContainer = this.$container.find('.fb-badge')
        this.$countContainer = this.$badgeContainer.find('.count')
        this.$menuContainer = this.$container.find('.utility-menu')

        if (this.type == 'unread') {
            this.getUnreadCount()
        }

        if (this.type == 'notifications') {
            this.getNotifications()
        }

        this.addListener(this.$btn, 'click', this.toggleMenu)
    },

    getUnreadCount() {
        Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy(((response, textStatus) => {
            if (textStatus === 'success') {
                if (response.totalCount > 0) {
                    this.$badgeContainer.addClass('show')
                    this.$countContainer.html(response.totalCount)
                    this.$menuContainer.find('.body').html(response.template)
                } else {
                    this.$menuContainer.find('.body').html('<p class="no-content">'+Craft.t('No unread submissions.')+'</p>')
                }
            }
        }), this))
    },

    getNotifications() {
        this.$menuContainer.find('.body').html('<p class="no-content">'+Craft.t('No new notifications.')+'</p>')
    },

    toggleMenu() {
        if (this.$container.hasClass('active')) {
            $('.fb-utility-btn').removeClass('active')
            $('.utility-menu').removeClass('active')
            this.$btn.parent().removeClass('active')
            this.$menuContainer.removeClass('active')
        } else {
            $('.fb-utility-btn').removeClass('active')
            $('.utility-menu').removeClass('active')
            this.$btn.parent().addClass('active')
            this.$menuContainer.addClass('active')
        }
    },
})




Garnish.$doc.ready(function() {
    
    $.each($('.fb-utility-btn'), (i, el) => {
         new UtilityItem(el)
    })

    $('.fb-mobile-nav').on('click', e => {
        $(this).toggleClass('active')
        $('body').toggleClass('show-fb-menu')
    })

    $('body').on('click', e => {
        target = $(e.target).closest('.utility-menu')
        btn = $(e.target).closest('.fb-utility-btn')

        if (target.length == 0 && btn.length == 0) {
            $('.fb-utility-btn').removeClass('active')
            $('.utility-menu').removeClass('active')
        }
    })

//     Craft.initUiElements();

//     window.pluginStoreApp = new Vue({
//         el: '#content'
//     });
})