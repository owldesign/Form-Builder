let GroupItem;
let GroupModal;
let Groups;

Groups = Garnish.Base.extend({
    $groups: null,
    $selectedGroup: null,
    $newGroupBtn: null,
    modal: null,

    init() {
        let $groupSettingsBtn;
        let menuBtn;

        this.$groups = $('#groups');
        this.$selectedGroup = this.$groups.find('a.sel:first');
        this.$newGroupBtn = $('#newgroupbtn');
        this.addListener(this.$newGroupBtn, 'click', 'addNewGroup');

        $groupSettingsBtn = $('#groupsettingsbtn');

        if ($groupSettingsBtn.length) {
            menuBtn = $groupSettingsBtn.data('menubtn');
            menuBtn.settings.onOptionSelect = $.proxy((function(elem) {
                let action;
                action = $(elem).data('action');

                switch (action) {
                    case 'rename':
                        this.renameSelectedGroup();
                    case 'delete':
                        this.deleteSelectedGroup();
                }
            }), this);
        }
    },

    addNewGroup() {
        if (!this.modal) {
            this.modal = new GroupModal(this);
        } else {
            this.modal.show();
        }
    },

    renameSelectedGroup() {
        let data;
        let newName;
        let oldName;

        oldName = this.$selectedGroup.text();
        newName = this.promptForGroupName(oldName);
      
        if (newName && newName !== oldName) {
            data = {
                id: this.$selectedGroup.data('id'),
                name: newName
            };

            Craft.postActionRequest('formBuilder/group/save', data, $.proxy((function(response, textStatus) {
                let errors;

                if (textStatus === 'success') {
                    if (response.success) {
                        this.$selectedGroup.text(response.group.name);
                        Craft.cp.displayNotice(Craft.t('Group renamed.'));
                    } else if (response.errors) {
                        errors = this.flattenErrors(response.errors);
                        alert(`${Craft.t('Could not rename the group:')}\n\n${errors.join('\n')}`);
                    } else {
                        Craft.cp.displayError();
                    }
                }
            }), this));
        }
    },

    promptForGroupName(oldName) {
        prompt(Craft.t('What do you want to name your group?'), oldName);
    },

    deleteSelectedGroup() {
        let data;
        this.$selectedGroup = $('#groups a.sel');
      
        if (this.$selectedGroup.data('id') === 1) {
            Craft.cp.displayError(Craft.t('Cannot delete Default group'));
        } else {
            if (confirm(Craft.t('Are you sure you want to delete this group and all its forms?'))) {
                data = {
                    id: this.$selectedGroup.data('id')
                };

                Craft.postActionRequest('formBuilder/group/delete', data, $.proxy(((response, textStatus) => {
                    if (textStatus === 'success') {
                        if (response.success) {
                            location.href = Craft.getUrl('formbuilder/forms');
                        } else {
                            Craft.cp.displayError();
                        }
                    }
                }), this));
            }
        }
    },

    flattenErrors(responseErrors) {
        let attribute;
        let errors;
        errors = [];

        for (attribute in responseErrors) {
            errors = errors.concat(responseErrors[attribute]);
        }

        return errors;
    }
});

GroupItem = Garnish.Modal.extend({
    $groupListItem: null,
    $group: null,
    $editGroupBtn: null,
    id: null,
    label: null,
    iconName: null,
    modal: null,

    init(el) {
        this.$groupListItem = $(el);
        this.$group = this.$groupListItem.find('a');
        this.$editGroupBtn = this.$group.find('.edit-group');
        this.id = this.$group.data('id');
        this.label = this.$group.data('label');
        this.iconName = this.$group.data('icon-name');
        this.addListener(this.$editGroupBtn, 'click', 'edit');
    },

    edit() {
        if (!this.modal) {
            this.modal = new GroupModal(this);
        } else {
            this.modal.show();
        }
    }
});

GroupModal = Garnish.Modal.extend({
    group: null,
    $form: null,
    $modalInputs: null,
    init(group) {
        let $input;
        let $input2;
        let $icons;
        let body;
        let iconName;
        let label;
        let title;
        let self;

        self = this;
        this.group = group;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);

        title = this.group.id ? Craft.t('Edit Group') : Craft.t('New Group');
        body = $(['<header>', `<span class="modal-title">${title}</span>`, '</header>', '<div class="body"><div class="footer-notes">Get icon names at <a href="https://fontawesome.com/icons" target="_blank">FontAwesome</a></div></div>', '<footer class="footer">', '<div class="buttons">', `<input type="button" class="btns btn-modal cancel" value="${Craft.t('Cancel')}">`, `<input type="submit" class="btns btn-modal submit" value="${Craft.t('Save')}">`, '</div>', '</footer>'].join('')).appendTo(this.$form);
        label = this.group.label ? this.group.label : '';
        iconName = this.group.iconName ? this.group.iconName : '';
        $input = `<input type='text' class='groupName' value='${label}' data-hint='NAME' data-name='groupName' />`;
        $input2 = `<input type='text' class='groupIcon' value='${iconName}' data-hint='ICON' data-name='groupIcon' />`;
        // $icons = '{"glass", "music", "search", "envelope-o", "heart", "star", "star-o", "user", "film", "th-large", "th", "th-list", "check", "remove", "close", "times", "search-plus", "search-minus", "power-off", "signal", "gear", "cog", "trash-o", "home", "file-o", "clock-o", "road", "download", "arrow-circle-o-down", "arrow-circle-o-up", "inbox", "play-circle-o", "rotate-right", "repeat", "refresh", "list-alt", "lock", "flag", "headphones", "volume-off", "volume-down", "volume-up", "qrcode", "barcode", "tag", "tags", "book", "bookmark", "print", "camera", "font", "bold", "italic", "text-height", "text-width", "align-left", "align-center", "align-right", "align-justify", "list", "dedent", "outdent", "indent", "video-camera", "photo", "image", "picture-o", "pencil", "map-marker", "adjust", "tint", "edit", "pencil-square-o", "share-square-o", "check-square-o", "arrows", "step-backward", "fast-backward", "backward", "play", "pause", "stop", "forward", "fast-forward", "step-forward", "eject", "chevron-left", "chevron-right", "plus-circle", "minus-circle", "times-circle", "check-circle", "question-circle", "info-circle", "crosshairs", "times-circle-o", "check-circle-o", "ban", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "mail-forward", "share", "expand", "compress", "plus", "minus", "asterisk", "exclamation-circle", "gift", "leaf", "fire", "eye", "eye-slash", "warning", "exclamation-triangle", "plane", "calendar", "random", "comment", "magnet", "chevron-up", "chevron-down", "retweet", "shopping-cart", "folder", "folder-open", "arrows-v", "arrows-h", "bar-chart-o", "bar-chart", "twitter-square", "facebook-square", "camera-retro", "key", "gears", "cogs", "comments", "thumbs-o-up", "thumbs-o-down", "star-half", "heart-o", "sign-out", "linkedin-square", "thumb-tack", "external-link", "sign-in", "trophy", "github-square", "upload", "lemon-o", "phone", "square-o", "bookmark-o", "phone-square", "twitter", "facebook-f", "facebook", "github", "unlock", "credit-card", "feed", "rss", "hdd-o", "bullhorn", "bell", "certificate", "hand-o-right", "hand-o-left", "hand-o-up", "hand-o-down", "arrow-circle-left", "arrow-circle-right", "arrow-circle-up", "arrow-circle-down", "globe", "wrench", "tasks", "filter", "briefcase", "arrows-alt", "group", "users", "chain", "link", "cloud", "flask", "cut", "scissors", "copy", "files-o", "paperclip", "save", "floppy-o", "square", "navicon", "reorder", "bars", "list-ul", "list-ol", "strikethrough", "underline", "table", "magic", "truck", "pinterest", "pinterest-square", "google-plus-square", "google-plus", "money", "caret-down", "caret-up", "caret-left", "caret-right", "columns", "unsorted", "sort", "sort-down", "sort-desc", "sort-up", "sort-asc", "envelope", "linkedin", "rotate-left", "undo", "legal", "gavel", "dashboard", "tachometer", "comment-o", "comments-o", "flash", "bolt", "sitemap", "umbrella", "paste", "clipboard", "lightbulb-o", "exchange", "cloud-download", "cloud-upload", "user-md", "stethoscope", "suitcase", "bell-o", "coffee", "cutlery", "file-text-o", "building-o", "hospital-o", "ambulance", "medkit", "fighter-jet", "beer", "h-square", "plus-square", "angle-double-left", "angle-double-right", "angle-double-up", "angle-double-down", "angle-left", "angle-right", "angle-up", "angle-down", "desktop", "laptop", "tablet", "mobile-phone", "mobile", "circle-o", "quote-left", "quote-right", "spinner", "circle", "mail-reply", "reply", "github-alt", "folder-o", "folder-open-o", "smile-o", "frown-o", "meh-o", "gamepad", "keyboard-o", "flag-o", "flag-checkered", "terminal", "code", "mail-reply-all", "reply-all", "star-half-empty", "star-half-full", "star-half-o", "location-arrow", "crop", "code-fork", "unlink", "chain-broken", "question", "info", "exclamation", "superscript", "subscript", "eraser", "puzzle-piece", "microphone", "microphone-slash", "shield", "calendar-o", "fire-extinguisher", "rocket", "maxcdn", "chevron-circle-left", "chevron-circle-right", "chevron-circle-up", "chevron-circle-down", "html5", "css3", "anchor", "unlock-alt", "bullseye", "ellipsis-h", "ellipsis-v", "rss-square", "play-circle", "ticket", "minus-square", "minus-square-o", "level-up", "level-down", "check-square", "pencil-square", "external-link-square", "share-square", "compass", "toggle-down", "caret-square-o-down", "toggle-up", "caret-square-o-up", "toggle-right", "caret-square-o-right", "euro", "eur", "gbp", "dollar", "usd", "rupee", "inr", "cny", "rmb", "yen", "jpy", "ruble", "rouble", "rub", "won", "krw", "bitcoin", "btc", "file", "file-text", "sort-alpha-asc", "sort-alpha-desc", "sort-amount-asc", "sort-amount-desc", "sort-numeric-asc", "sort-numeric-desc", "thumbs-up", "thumbs-down", "youtube-square", "youtube", "xing", "xing-square", "youtube-play", "dropbox", "stack-overflow", "instagram", "flickr", "adn", "bitbucket", "bitbucket-square", "tumblr", "tumblr-square", "long-arrow-down", "long-arrow-up", "long-arrow-left", "long-arrow-right", "apple", "windows", "android", "linux", "dribbble", "skype", "foursquare", "trello", "female", "male", "gittip", "gratipay", "sun-o", "moon-o", "archive", "bug", "vk", "weibo", "renren", "pagelines", "stack-exchange", "arrow-circle-o-right", "arrow-circle-o-left", "toggle-left", "caret-square-o-left", "dot-circle-o", "wheelchair", "vimeo-square", "turkish-lira", "try", "plus-square-o", "space-shuttle", "slack", "envelope-square", "wordpress", "openid", "institution", "bank", "university", "mortar-board", "graduation-cap", "yahoo", "google", "reddit", "reddit-square", "stumbleupon-circle", "stumbleupon", "delicious", "digg", "pied-piper", "pied-piper-alt", "drupal", "joomla", "language", "fax", "building", "child", "paw", "spoon", "cube", "cubes", "behance", "behance-square", "steam", "steam-square", "recycle", "automobile", "car", "cab", "taxi", "tree", "spotify", "deviantart", "soundcloud", "database", "file-pdf-o", "file-word-o", "file-excel-o", "file-powerpoint-o", "file-photo-o", "file-picture-o", "file-image-o", "file-zip-o", "file-archive-o", "file-sound-o", "file-audio-o", "file-movie-o", "file-video-o", "file-code-o", "vine", "codepen", "jsfiddle", "life-bouy", "life-buoy", "life-saver", "support", "life-ring", "circle-o-notch", "ra", "rebel", "ge", "empire", "git-square", "git", "y-combinator-square", "yc-square", "hacker-news", "tencent-weibo", "qq", "wechat", "weixin", "send", "paper-plane", "send-o", "paper-plane-o", "history", "circle-thin", "header", "paragraph", "sliders", "share-alt", "share-alt-square", "bomb", "soccer-ball-o", "futbol-o", "tty", "binoculars", "plug", "slideshare", "twitch", "yelp", "newspaper-o", "wifi", "calculator", "paypal", "google-wallet", "cc-visa", "cc-mastercard", "cc-discover", "cc-amex", "cc-paypal", "cc-stripe", "bell-slash", "bell-slash-o", "trash", "copyright", "at", "eyedropper", "paint-brush", "birthday-cake", "area-chart", "pie-chart", "line-chart", "lastfm", "lastfm-square", "toggle-off", "toggle-on", "bicycle", "bus", "ioxhost", "angellist", "cc", "shekel", "sheqel", "ils", "meanpath", "buysellads", "connectdevelop", "dashcube", "forumbee", "leanpub", "sellsy", "shirtsinbulk", "simplybuilt", "skyatlas", "cart-plus", "cart-arrow-down", "diamond", "ship", "user-secret", "motorcycle", "street-view", "heartbeat", "venus", "mars", "mercury", "intersex", "transgender", "transgender-alt", "venus-double", "mars-double", "venus-mars", "mars-stroke", "mars-stroke-v", "mars-stroke-h", "neuter", "genderless", "facebook-official", "pinterest-p", "whatsapp", "server", "user-plus", "user-times", "hotel", "bed", "viacoin", "train", "subway", "medium", "yc", "y-combinator", "optin-monster", "opencart", "expeditedssl", "battery-4", "battery-full", "battery-3", "battery-three-quarters", "battery-2", "battery-half", "battery-1", "battery-quarter", "battery-0", "battery-empty", "mouse-pointer", "i-cursor", "object-group", "object-ungroup", "sticky-note", "sticky-note-o", "cc-jcb", "cc-diners-club", "clone", "balance-scale", "hourglass-o", "hourglass-1", "hourglass-start", "hourglass-2", "hourglass-half", "hourglass-3", "hourglass-end", "hourglass", "hand-grab-o", "hand-rock-o", "hand-stop-o", "hand-paper-o", "hand-scissors-o", "hand-lizard-o", "hand-spock-o", "hand-pointer-o", "hand-peace-o", "trademark", "registered", "creative-commons", "gg", "gg-circle", "tripadvisor", "odnoklassniki", "odnoklassniki-square", "get-pocket", "wikipedia-w", "safari", "chrome", "firefox", "opera", "internet-explorer", "tv", "television", "contao", "500px", "amazon", "calendar-plus-o", "calendar-minus-o", "calendar-times-o", "calendar-check-o", "industry", "map-pin", "map-signs", "map-o", "map", "commenting", "commenting-o", "houzz", "vimeo", "black-tie", "fonticons", "reddit-alien", "edge", "credit-card-alt", "codiepie", "modx", "fort-awesome", "usb", "product-hunt", "mixcloud", "scribd", "pause-circle", "pause-circle-o", "stop-circle", "stop-circle-o", "shopping-bag", "shopping-basket", "hashtag", "bluetooth", "bluetooth-b", "percent",}';
        // $input2 = `<select class='groupIcon' data-hint='ICON' data-name='groupIcon'>
                // <option></option>
            // </select`;

        this.renderInputs($input2, '', 'select', 'groupIcon', 'ICON', 'iconName');
        this.renderInputs($input, '', 'text', 'groupName', 'NAME', 'groupName');
        this.show();
        this.$saveBtn = body.find('.submit');
        this.$cancelBtn = body.find('.cancel');
        this.addListener(this.$cancelBtn, 'click', 'hide');
        this.addListener(this.$form, 'submit', 'save');
    },

    renderInputs(el, value, type, name, hint, className) {
        let $input;
        $input = $(`<div class="fb-field"><div class="input-hint">${hint}</div>${el}</div>`);
        
        this.$form.find('.body').prepend($input);

        // TODO: allow users to dynamically search fontawesome icon repository
        // if (type == 'select') {
        //     $input.select2({
        //         ajax: {
        //             url: Craft.getActionUrl() + '/form-builder/icons/get-all-icons',
        //             dataType: 'json',
        //             processResults: function(data) {
        //                 return {
        //                     results: data.icons
        //                 };
        //             },
        //         },
        //         placeholder: 'Select Icon',
        //         escapeMarkup: function (markup) { return markup; },
        //         templateResult: function(icon) {
        //             let markup = `<div class='select2-result-icon clearfix'><div class='select2-result-image'><img src='${icon.icon}' /></div><div class='select2-result-icon-details'><div class='select2-result-name'>${icon.name}</div>`;
        //             return markup;
        //         },
        //         templateSelection: function(data) {
        //         }
        //     });
        // }
    },

    save(e) {
        e.preventDefault();
        let data;
        let groupIcon;
        let groupName;
        let inputLength;
        let self;

        self = this;
        groupName = this.$form.find('.groupName').val();
        groupIcon = this.$form.find('.groupIcon').val();
        inputLength = this.$form.find('.groupName').val().length;
        if (inputLength > 0) {
            data = {
                id: this.group.id ? this.group.id : null,
                name: groupName,
                settings: {
                    icon: {
                        name: groupIcon
                    }
                }
            };

            Craft.postActionRequest('formBuilder/group/save', data, $.proxy((function(response, textStatus) {
                let errors;
                console.log(response);
                if (textStatus === 'success') {
                    if (response.success) {
                        location.href = Craft.getUrl('formbuilder/forms');
                    } else if (response.errors) {
                        errors = this.flattenErrors(response.errors);
                        alert(`${Craft.t('Could not create the group:')}\n\n${errors.join('\n')}`);
                    } else {
                        Craft.cp.displayError();
                    }
                }
            }), this));
        }
    },

    flattenErrors(responseErrors) {
        let attribute;
        let errors;
        errors = [];
        
        for (attribute in responseErrors) {
            errors = errors.concat(responseErrors[attribute]);
        }

        return errors;
    }
});
  
Garnish.$doc.ready(() => {
    let FormGroups;
    FormGroups = new Groups;
    $.each($('.group-item'), (i, item) => new GroupItem(item));
});