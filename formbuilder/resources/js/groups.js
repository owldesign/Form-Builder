/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

var GroupItem = void 0;
var GroupModal = void 0;
var Groups = void 0;

Groups = Garnish.Base.extend({
    $groups: null,
    $selectedGroup: null,
    $newGroupBtn: null,
    modal: null,

    init: function init() {
        var $groupSettingsBtn = void 0;
        var menuBtn = void 0;

        this.$groups = $('#groups');
        this.$selectedGroup = this.$groups.find('a.sel:first');
        this.$newGroupBtn = $('#newgroupbtn');
        this.addListener(this.$newGroupBtn, 'click', 'addNewGroup');

        $groupSettingsBtn = $('#groupsettingsbtn');

        if ($groupSettingsBtn.length) {
            menuBtn = $groupSettingsBtn.data('menubtn');
            menuBtn.settings.onOptionSelect = $.proxy(function (elem) {
                var action = void 0;
                action = $(elem).data('action');

                switch (action) {
                    case 'rename':
                        this.renameSelectedGroup();
                    case 'delete':
                        this.deleteSelectedGroup();
                }
            }, this);
        }
    },
    addNewGroup: function addNewGroup() {
        if (!this.modal) {
            this.modal = new GroupModal(this);
        } else {
            this.modal.show();
        }
    },
    renameSelectedGroup: function renameSelectedGroup() {
        var data = void 0;
        var newName = void 0;
        var oldName = void 0;

        oldName = this.$selectedGroup.text();
        newName = this.promptForGroupName(oldName);

        if (newName && newName !== oldName) {
            data = {
                id: this.$selectedGroup.data('id'),
                name: newName
            };

            Craft.postActionRequest('formBuilder/group/save', data, $.proxy(function (response, textStatus) {
                var errors = void 0;

                if (textStatus === 'success') {
                    if (response.success) {
                        this.$selectedGroup.text(response.group.name);
                        Craft.cp.displayNotice(Craft.t('Group renamed.'));
                    } else if (response.errors) {
                        errors = this.flattenErrors(response.errors);
                        alert(Craft.t('Could not rename the group:') + '\n\n' + errors.join('\n'));
                    } else {
                        Craft.cp.displayError();
                    }
                }
            }, this));
        }
    },
    promptForGroupName: function promptForGroupName(oldName) {
        prompt(Craft.t('What do you want to name your group?'), oldName);
    },
    deleteSelectedGroup: function deleteSelectedGroup() {
        var data = void 0;
        this.$selectedGroup = $('#groups a.sel');

        if (this.$selectedGroup.data('id') === 1) {
            Craft.cp.displayError(Craft.t('Cannot delete Default group'));
        } else {
            if (confirm(Craft.t('Are you sure you want to delete this group and all its forms?'))) {
                data = {
                    id: this.$selectedGroup.data('id')
                };

                Craft.postActionRequest('formBuilder/group/delete', data, $.proxy(function (response, textStatus) {
                    if (textStatus === 'success') {
                        if (response.success) {
                            location.href = Craft.getUrl('formbuilder/forms');
                        } else {
                            Craft.cp.displayError();
                        }
                    }
                }, this));
            }
        }
    },
    flattenErrors: function flattenErrors(responseErrors) {
        var attribute = void 0;
        var errors = void 0;
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

    init: function init(el) {
        this.$groupListItem = $(el);
        this.$group = this.$groupListItem.find('a');
        this.$editGroupBtn = this.$group.find('.edit-group');
        this.id = this.$group.data('id');
        this.label = this.$group.data('label');
        this.iconName = this.$group.data('icon-name');
        this.addListener(this.$editGroupBtn, 'click', 'edit');
    },
    edit: function edit() {
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
    init: function init(group) {
        var $input = void 0;
        var $input2 = void 0;
        var $icons = void 0;
        var body = void 0;
        var iconName = void 0;
        var label = void 0;
        var title = void 0;
        var self = void 0;

        self = this;
        this.group = group;
        this.base();
        this.$form = $('<form class="modal fitted formbuilder-modal">').appendTo(Garnish.$bod);
        this.setContainer(this.$form);

        title = this.group.id ? Craft.t('Edit Group') : Craft.t('New Group');
        body = $(['<header>', '<span class="modal-title">' + title + '</span>', '</header>', '<div class="body"><div class="footer-notes">Get icon names at <a href="https://fontawesome.com/icons" target="_blank">FontAwesome</a></div></div>', '<footer class="footer">', '<div class="buttons">', '<input type="button" class="btns btn-modal cancel" value="' + Craft.t('Cancel') + '">', '<input type="submit" class="btns btn-modal submit" value="' + Craft.t('Save') + '">', '</div>', '</footer>'].join('')).appendTo(this.$form);
        label = this.group.label ? this.group.label : '';
        iconName = this.group.iconName ? this.group.iconName : '';
        $input = '<input type=\'text\' class=\'groupName\' value=\'' + label + '\' data-hint=\'NAME\' data-name=\'groupName\' />';
        $input2 = '<input type=\'text\' class=\'groupIcon\' value=\'' + iconName + '\' data-hint=\'ICON\' data-name=\'groupIcon\' />';
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
    renderInputs: function renderInputs(el, value, type, name, hint, className) {
        var $input = void 0;
        $input = $('<div class="fb-field"><div class="input-hint">' + hint + '</div>' + el + '</div>');

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
    save: function save(e) {
        e.preventDefault();
        var data = void 0;
        var groupIcon = void 0;
        var groupName = void 0;
        var inputLength = void 0;
        var self = void 0;

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

            Craft.postActionRequest('formBuilder/group/save', data, $.proxy(function (response, textStatus) {
                var errors = void 0;
                console.log(response);
                if (textStatus === 'success') {
                    if (response.success) {
                        location.href = Craft.getUrl('formbuilder/forms');
                    } else if (response.errors) {
                        errors = this.flattenErrors(response.errors);
                        alert(Craft.t('Could not create the group:') + '\n\n' + errors.join('\n'));
                    } else {
                        Craft.cp.displayError();
                    }
                }
            }, this));
        }
    },
    flattenErrors: function flattenErrors(responseErrors) {
        var attribute = void 0;
        var errors = void 0;
        errors = [];

        for (attribute in responseErrors) {
            errors = errors.concat(responseErrors[attribute]);
        }

        return errors;
    }
});

Garnish.$doc.ready(function () {
    var FormGroups = void 0;
    FormGroups = new Groups();
    $.each($('.group-item'), function (i, item) {
        return new GroupItem(item);
    });
});

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJ3ZWJwYWNrOi8vLy4vZGV2ZWxvcG1lbnQvanMvZ3JvdXBzLmpzIl0sIm5hbWVzIjpbIkdyb3VwSXRlbSIsIkdyb3VwTW9kYWwiLCJHcm91cHMiLCJHYXJuaXNoIiwiQmFzZSIsImV4dGVuZCIsIiRncm91cHMiLCIkc2VsZWN0ZWRHcm91cCIsIiRuZXdHcm91cEJ0biIsIm1vZGFsIiwiaW5pdCIsIiRncm91cFNldHRpbmdzQnRuIiwibWVudUJ0biIsIiQiLCJmaW5kIiwiYWRkTGlzdGVuZXIiLCJsZW5ndGgiLCJkYXRhIiwic2V0dGluZ3MiLCJvbk9wdGlvblNlbGVjdCIsInByb3h5IiwiZWxlbSIsImFjdGlvbiIsInJlbmFtZVNlbGVjdGVkR3JvdXAiLCJkZWxldGVTZWxlY3RlZEdyb3VwIiwiYWRkTmV3R3JvdXAiLCJzaG93IiwibmV3TmFtZSIsIm9sZE5hbWUiLCJ0ZXh0IiwicHJvbXB0Rm9yR3JvdXBOYW1lIiwiaWQiLCJuYW1lIiwiQ3JhZnQiLCJwb3N0QWN0aW9uUmVxdWVzdCIsInJlc3BvbnNlIiwidGV4dFN0YXR1cyIsImVycm9ycyIsInN1Y2Nlc3MiLCJncm91cCIsImNwIiwiZGlzcGxheU5vdGljZSIsInQiLCJmbGF0dGVuRXJyb3JzIiwiYWxlcnQiLCJqb2luIiwiZGlzcGxheUVycm9yIiwicHJvbXB0IiwiY29uZmlybSIsImxvY2F0aW9uIiwiaHJlZiIsImdldFVybCIsInJlc3BvbnNlRXJyb3JzIiwiYXR0cmlidXRlIiwiY29uY2F0IiwiTW9kYWwiLCIkZ3JvdXBMaXN0SXRlbSIsIiRncm91cCIsIiRlZGl0R3JvdXBCdG4iLCJsYWJlbCIsImljb25OYW1lIiwiZWwiLCJlZGl0IiwiJGZvcm0iLCIkbW9kYWxJbnB1dHMiLCIkaW5wdXQiLCIkaW5wdXQyIiwiJGljb25zIiwiYm9keSIsInRpdGxlIiwic2VsZiIsImJhc2UiLCJhcHBlbmRUbyIsIiRib2QiLCJzZXRDb250YWluZXIiLCJyZW5kZXJJbnB1dHMiLCIkc2F2ZUJ0biIsIiRjYW5jZWxCdG4iLCJ2YWx1ZSIsInR5cGUiLCJoaW50IiwiY2xhc3NOYW1lIiwicHJlcGVuZCIsInNhdmUiLCJlIiwicHJldmVudERlZmF1bHQiLCJncm91cEljb24iLCJncm91cE5hbWUiLCJpbnB1dExlbmd0aCIsInZhbCIsImljb24iLCJjb25zb2xlIiwibG9nIiwiJGRvYyIsInJlYWR5IiwiRm9ybUdyb3VwcyIsImVhY2giLCJpIiwiaXRlbSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQSxJQUFJQSxrQkFBSjtBQUNBLElBQUlDLG1CQUFKO0FBQ0EsSUFBSUMsZUFBSjs7QUFFQUEsU0FBU0MsUUFBUUMsSUFBUixDQUFhQyxNQUFiLENBQW9CO0FBQ3pCQyxhQUFTLElBRGdCO0FBRXpCQyxvQkFBZ0IsSUFGUztBQUd6QkMsa0JBQWMsSUFIVztBQUl6QkMsV0FBTyxJQUprQjs7QUFNekJDLFFBTnlCLGtCQU1sQjtBQUNILFlBQUlDLDBCQUFKO0FBQ0EsWUFBSUMsZ0JBQUo7O0FBRUEsYUFBS04sT0FBTCxHQUFlTyxFQUFFLFNBQUYsQ0FBZjtBQUNBLGFBQUtOLGNBQUwsR0FBc0IsS0FBS0QsT0FBTCxDQUFhUSxJQUFiLENBQWtCLGFBQWxCLENBQXRCO0FBQ0EsYUFBS04sWUFBTCxHQUFvQkssRUFBRSxjQUFGLENBQXBCO0FBQ0EsYUFBS0UsV0FBTCxDQUFpQixLQUFLUCxZQUF0QixFQUFvQyxPQUFwQyxFQUE2QyxhQUE3Qzs7QUFFQUcsNEJBQW9CRSxFQUFFLG1CQUFGLENBQXBCOztBQUVBLFlBQUlGLGtCQUFrQkssTUFBdEIsRUFBOEI7QUFDMUJKLHNCQUFVRCxrQkFBa0JNLElBQWxCLENBQXVCLFNBQXZCLENBQVY7QUFDQUwsb0JBQVFNLFFBQVIsQ0FBaUJDLGNBQWpCLEdBQWtDTixFQUFFTyxLQUFGLENBQVMsVUFBU0MsSUFBVCxFQUFlO0FBQ3RELG9CQUFJQyxlQUFKO0FBQ0FBLHlCQUFTVCxFQUFFUSxJQUFGLEVBQVFKLElBQVIsQ0FBYSxRQUFiLENBQVQ7O0FBRUEsd0JBQVFLLE1BQVI7QUFDSSx5QkFBSyxRQUFMO0FBQ0ksNkJBQUtDLG1CQUFMO0FBQ0oseUJBQUssUUFBTDtBQUNJLDZCQUFLQyxtQkFBTDtBQUpSO0FBTUgsYUFWaUMsRUFVOUIsSUFWOEIsQ0FBbEM7QUFXSDtBQUNKLEtBL0J3QjtBQWlDekJDLGVBakN5Qix5QkFpQ1g7QUFDVixZQUFJLENBQUMsS0FBS2hCLEtBQVYsRUFBaUI7QUFDYixpQkFBS0EsS0FBTCxHQUFhLElBQUlSLFVBQUosQ0FBZSxJQUFmLENBQWI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS1EsS0FBTCxDQUFXaUIsSUFBWDtBQUNIO0FBQ0osS0F2Q3dCO0FBeUN6QkgsdUJBekN5QixpQ0F5Q0g7QUFDbEIsWUFBSU4sYUFBSjtBQUNBLFlBQUlVLGdCQUFKO0FBQ0EsWUFBSUMsZ0JBQUo7O0FBRUFBLGtCQUFVLEtBQUtyQixjQUFMLENBQW9Cc0IsSUFBcEIsRUFBVjtBQUNBRixrQkFBVSxLQUFLRyxrQkFBTCxDQUF3QkYsT0FBeEIsQ0FBVjs7QUFFQSxZQUFJRCxXQUFXQSxZQUFZQyxPQUEzQixFQUFvQztBQUNoQ1gsbUJBQU87QUFDSGMsb0JBQUksS0FBS3hCLGNBQUwsQ0FBb0JVLElBQXBCLENBQXlCLElBQXpCLENBREQ7QUFFSGUsc0JBQU1MO0FBRkgsYUFBUDs7QUFLQU0sa0JBQU1DLGlCQUFOLENBQXdCLHdCQUF4QixFQUFrRGpCLElBQWxELEVBQXdESixFQUFFTyxLQUFGLENBQVMsVUFBU2UsUUFBVCxFQUFtQkMsVUFBbkIsRUFBK0I7QUFDNUYsb0JBQUlDLGVBQUo7O0FBRUEsb0JBQUlELGVBQWUsU0FBbkIsRUFBOEI7QUFDMUIsd0JBQUlELFNBQVNHLE9BQWIsRUFBc0I7QUFDbEIsNkJBQUsvQixjQUFMLENBQW9Cc0IsSUFBcEIsQ0FBeUJNLFNBQVNJLEtBQVQsQ0FBZVAsSUFBeEM7QUFDQUMsOEJBQU1PLEVBQU4sQ0FBU0MsYUFBVCxDQUF1QlIsTUFBTVMsQ0FBTixDQUFRLGdCQUFSLENBQXZCO0FBQ0gscUJBSEQsTUFHTyxJQUFJUCxTQUFTRSxNQUFiLEVBQXFCO0FBQ3hCQSxpQ0FBUyxLQUFLTSxhQUFMLENBQW1CUixTQUFTRSxNQUE1QixDQUFUO0FBQ0FPLDhCQUFTWCxNQUFNUyxDQUFOLENBQVEsNkJBQVIsQ0FBVCxZQUFzREwsT0FBT1EsSUFBUCxDQUFZLElBQVosQ0FBdEQ7QUFDSCxxQkFITSxNQUdBO0FBQ0haLDhCQUFNTyxFQUFOLENBQVNNLFlBQVQ7QUFDSDtBQUNKO0FBQ0osYUFkdUQsRUFjcEQsSUFkb0QsQ0FBeEQ7QUFlSDtBQUNKLEtBdkV3QjtBQXlFekJoQixzQkF6RXlCLDhCQXlFTkYsT0F6RU0sRUF5RUc7QUFDeEJtQixlQUFPZCxNQUFNUyxDQUFOLENBQVEsc0NBQVIsQ0FBUCxFQUF3RGQsT0FBeEQ7QUFDSCxLQTNFd0I7QUE2RXpCSix1QkE3RXlCLGlDQTZFSDtBQUNsQixZQUFJUCxhQUFKO0FBQ0EsYUFBS1YsY0FBTCxHQUFzQk0sRUFBRSxlQUFGLENBQXRCOztBQUVBLFlBQUksS0FBS04sY0FBTCxDQUFvQlUsSUFBcEIsQ0FBeUIsSUFBekIsTUFBbUMsQ0FBdkMsRUFBMEM7QUFDdENnQixrQkFBTU8sRUFBTixDQUFTTSxZQUFULENBQXNCYixNQUFNUyxDQUFOLENBQVEsNkJBQVIsQ0FBdEI7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSU0sUUFBUWYsTUFBTVMsQ0FBTixDQUFRLCtEQUFSLENBQVIsQ0FBSixFQUF1RjtBQUNuRnpCLHVCQUFPO0FBQ0hjLHdCQUFJLEtBQUt4QixjQUFMLENBQW9CVSxJQUFwQixDQUF5QixJQUF6QjtBQURELGlCQUFQOztBQUlBZ0Isc0JBQU1DLGlCQUFOLENBQXdCLDBCQUF4QixFQUFvRGpCLElBQXBELEVBQTBESixFQUFFTyxLQUFGLENBQVMsVUFBQ2UsUUFBRCxFQUFXQyxVQUFYLEVBQTBCO0FBQ3pGLHdCQUFJQSxlQUFlLFNBQW5CLEVBQThCO0FBQzFCLDRCQUFJRCxTQUFTRyxPQUFiLEVBQXNCO0FBQ2xCVyxxQ0FBU0MsSUFBVCxHQUFnQmpCLE1BQU1rQixNQUFOLENBQWEsbUJBQWIsQ0FBaEI7QUFDSCx5QkFGRCxNQUVPO0FBQ0hsQixrQ0FBTU8sRUFBTixDQUFTTSxZQUFUO0FBQ0g7QUFDSjtBQUNKLGlCQVJ5RCxFQVF0RCxJQVJzRCxDQUExRDtBQVNIO0FBQ0o7QUFDSixLQXBHd0I7QUFzR3pCSCxpQkF0R3lCLHlCQXNHWFMsY0F0R1csRUFzR0s7QUFDMUIsWUFBSUMsa0JBQUo7QUFDQSxZQUFJaEIsZUFBSjtBQUNBQSxpQkFBUyxFQUFUOztBQUVBLGFBQUtnQixTQUFMLElBQWtCRCxjQUFsQixFQUFrQztBQUM5QmYscUJBQVNBLE9BQU9pQixNQUFQLENBQWNGLGVBQWVDLFNBQWYsQ0FBZCxDQUFUO0FBQ0g7O0FBRUQsZUFBT2hCLE1BQVA7QUFDSDtBQWhId0IsQ0FBcEIsQ0FBVDs7QUFtSEFyQyxZQUFZRyxRQUFRb0QsS0FBUixDQUFjbEQsTUFBZCxDQUFxQjtBQUM3Qm1ELG9CQUFnQixJQURhO0FBRTdCQyxZQUFRLElBRnFCO0FBRzdCQyxtQkFBZSxJQUhjO0FBSTdCM0IsUUFBSSxJQUp5QjtBQUs3QjRCLFdBQU8sSUFMc0I7QUFNN0JDLGNBQVUsSUFObUI7QUFPN0JuRCxXQUFPLElBUHNCOztBQVM3QkMsUUFUNkIsZ0JBU3hCbUQsRUFUd0IsRUFTcEI7QUFDTCxhQUFLTCxjQUFMLEdBQXNCM0MsRUFBRWdELEVBQUYsQ0FBdEI7QUFDQSxhQUFLSixNQUFMLEdBQWMsS0FBS0QsY0FBTCxDQUFvQjFDLElBQXBCLENBQXlCLEdBQXpCLENBQWQ7QUFDQSxhQUFLNEMsYUFBTCxHQUFxQixLQUFLRCxNQUFMLENBQVkzQyxJQUFaLENBQWlCLGFBQWpCLENBQXJCO0FBQ0EsYUFBS2lCLEVBQUwsR0FBVSxLQUFLMEIsTUFBTCxDQUFZeEMsSUFBWixDQUFpQixJQUFqQixDQUFWO0FBQ0EsYUFBSzBDLEtBQUwsR0FBYSxLQUFLRixNQUFMLENBQVl4QyxJQUFaLENBQWlCLE9BQWpCLENBQWI7QUFDQSxhQUFLMkMsUUFBTCxHQUFnQixLQUFLSCxNQUFMLENBQVl4QyxJQUFaLENBQWlCLFdBQWpCLENBQWhCO0FBQ0EsYUFBS0YsV0FBTCxDQUFpQixLQUFLMkMsYUFBdEIsRUFBcUMsT0FBckMsRUFBOEMsTUFBOUM7QUFDSCxLQWpCNEI7QUFtQjdCSSxRQW5CNkIsa0JBbUJ0QjtBQUNILFlBQUksQ0FBQyxLQUFLckQsS0FBVixFQUFpQjtBQUNiLGlCQUFLQSxLQUFMLEdBQWEsSUFBSVIsVUFBSixDQUFlLElBQWYsQ0FBYjtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLUSxLQUFMLENBQVdpQixJQUFYO0FBQ0g7QUFDSjtBQXpCNEIsQ0FBckIsQ0FBWjs7QUE0QkF6QixhQUFhRSxRQUFRb0QsS0FBUixDQUFjbEQsTUFBZCxDQUFxQjtBQUM5QmtDLFdBQU8sSUFEdUI7QUFFOUJ3QixXQUFPLElBRnVCO0FBRzlCQyxrQkFBYyxJQUhnQjtBQUk5QnRELFFBSjhCLGdCQUl6QjZCLEtBSnlCLEVBSWxCO0FBQ1IsWUFBSTBCLGVBQUo7QUFDQSxZQUFJQyxnQkFBSjtBQUNBLFlBQUlDLGVBQUo7QUFDQSxZQUFJQyxhQUFKO0FBQ0EsWUFBSVIsaUJBQUo7QUFDQSxZQUFJRCxjQUFKO0FBQ0EsWUFBSVUsY0FBSjtBQUNBLFlBQUlDLGFBQUo7O0FBRUFBLGVBQU8sSUFBUDtBQUNBLGFBQUsvQixLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLZ0MsSUFBTDtBQUNBLGFBQUtSLEtBQUwsR0FBYWxELEVBQUUsK0NBQUYsRUFBbUQyRCxRQUFuRCxDQUE0RHJFLFFBQVFzRSxJQUFwRSxDQUFiO0FBQ0EsYUFBS0MsWUFBTCxDQUFrQixLQUFLWCxLQUF2Qjs7QUFFQU0sZ0JBQVEsS0FBSzlCLEtBQUwsQ0FBV1IsRUFBWCxHQUFnQkUsTUFBTVMsQ0FBTixDQUFRLFlBQVIsQ0FBaEIsR0FBd0NULE1BQU1TLENBQU4sQ0FBUSxXQUFSLENBQWhEO0FBQ0EwQixlQUFPdkQsRUFBRSxDQUFDLFVBQUQsaUNBQTBDd0QsS0FBMUMsY0FBMEQsV0FBMUQsRUFBdUUsbUpBQXZFLEVBQTROLHlCQUE1TixFQUF1UCx1QkFBdlAsaUVBQTZVcEMsTUFBTVMsQ0FBTixDQUFRLFFBQVIsQ0FBN1Usd0VBQWlhVCxNQUFNUyxDQUFOLENBQVEsTUFBUixDQUFqYSxTQUFzYixRQUF0YixFQUFnYyxXQUFoYyxFQUE2Y0csSUFBN2MsQ0FBa2QsRUFBbGQsQ0FBRixFQUF5ZDJCLFFBQXpkLENBQWtlLEtBQUtULEtBQXZlLENBQVA7QUFDQUosZ0JBQVEsS0FBS3BCLEtBQUwsQ0FBV29CLEtBQVgsR0FBbUIsS0FBS3BCLEtBQUwsQ0FBV29CLEtBQTlCLEdBQXNDLEVBQTlDO0FBQ0FDLG1CQUFXLEtBQUtyQixLQUFMLENBQVdxQixRQUFYLEdBQXNCLEtBQUtyQixLQUFMLENBQVdxQixRQUFqQyxHQUE0QyxFQUF2RDtBQUNBSyx1RUFBd0ROLEtBQXhEO0FBQ0FPLHdFQUF5RE4sUUFBekQ7QUFDQTtBQUNBO0FBQ1E7QUFDSjs7QUFFSixhQUFLZSxZQUFMLENBQWtCVCxPQUFsQixFQUEyQixFQUEzQixFQUErQixRQUEvQixFQUF5QyxXQUF6QyxFQUFzRCxNQUF0RCxFQUE4RCxVQUE5RDtBQUNBLGFBQUtTLFlBQUwsQ0FBa0JWLE1BQWxCLEVBQTBCLEVBQTFCLEVBQThCLE1BQTlCLEVBQXNDLFdBQXRDLEVBQW1ELE1BQW5ELEVBQTJELFdBQTNEO0FBQ0EsYUFBS3ZDLElBQUw7QUFDQSxhQUFLa0QsUUFBTCxHQUFnQlIsS0FBS3RELElBQUwsQ0FBVSxTQUFWLENBQWhCO0FBQ0EsYUFBSytELFVBQUwsR0FBa0JULEtBQUt0RCxJQUFMLENBQVUsU0FBVixDQUFsQjtBQUNBLGFBQUtDLFdBQUwsQ0FBaUIsS0FBSzhELFVBQXRCLEVBQWtDLE9BQWxDLEVBQTJDLE1BQTNDO0FBQ0EsYUFBSzlELFdBQUwsQ0FBaUIsS0FBS2dELEtBQXRCLEVBQTZCLFFBQTdCLEVBQXVDLE1BQXZDO0FBQ0gsS0F0QzZCO0FBd0M5QlksZ0JBeEM4Qix3QkF3Q2pCZCxFQXhDaUIsRUF3Q2JpQixLQXhDYSxFQXdDTkMsSUF4Q00sRUF3Q0EvQyxJQXhDQSxFQXdDTWdELElBeENOLEVBd0NZQyxTQXhDWixFQXdDdUI7QUFDakQsWUFBSWhCLGVBQUo7QUFDQUEsaUJBQVNwRCxxREFBbURtRSxJQUFuRCxjQUFnRW5CLEVBQWhFLFlBQVQ7O0FBRUEsYUFBS0UsS0FBTCxDQUFXakQsSUFBWCxDQUFnQixPQUFoQixFQUF5Qm9FLE9BQXpCLENBQWlDakIsTUFBakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxLQXBFNkI7QUFzRTlCa0IsUUF0RThCLGdCQXNFekJDLENBdEV5QixFQXNFdEI7QUFDSkEsVUFBRUMsY0FBRjtBQUNBLFlBQUlwRSxhQUFKO0FBQ0EsWUFBSXFFLGtCQUFKO0FBQ0EsWUFBSUMsa0JBQUo7QUFDQSxZQUFJQyxvQkFBSjtBQUNBLFlBQUlsQixhQUFKOztBQUVBQSxlQUFPLElBQVA7QUFDQWlCLG9CQUFZLEtBQUt4QixLQUFMLENBQVdqRCxJQUFYLENBQWdCLFlBQWhCLEVBQThCMkUsR0FBOUIsRUFBWjtBQUNBSCxvQkFBWSxLQUFLdkIsS0FBTCxDQUFXakQsSUFBWCxDQUFnQixZQUFoQixFQUE4QjJFLEdBQTlCLEVBQVo7QUFDQUQsc0JBQWMsS0FBS3pCLEtBQUwsQ0FBV2pELElBQVgsQ0FBZ0IsWUFBaEIsRUFBOEIyRSxHQUE5QixHQUFvQ3pFLE1BQWxEO0FBQ0EsWUFBSXdFLGNBQWMsQ0FBbEIsRUFBcUI7QUFDakJ2RSxtQkFBTztBQUNIYyxvQkFBSSxLQUFLUSxLQUFMLENBQVdSLEVBQVgsR0FBZ0IsS0FBS1EsS0FBTCxDQUFXUixFQUEzQixHQUFnQyxJQURqQztBQUVIQyxzQkFBTXVELFNBRkg7QUFHSHJFLDBCQUFVO0FBQ053RSwwQkFBTTtBQUNGMUQsOEJBQU1zRDtBQURKO0FBREE7QUFIUCxhQUFQOztBQVVBckQsa0JBQU1DLGlCQUFOLENBQXdCLHdCQUF4QixFQUFrRGpCLElBQWxELEVBQXdESixFQUFFTyxLQUFGLENBQVMsVUFBU2UsUUFBVCxFQUFtQkMsVUFBbkIsRUFBK0I7QUFDNUYsb0JBQUlDLGVBQUo7QUFDQXNELHdCQUFRQyxHQUFSLENBQVl6RCxRQUFaO0FBQ0Esb0JBQUlDLGVBQWUsU0FBbkIsRUFBOEI7QUFDMUIsd0JBQUlELFNBQVNHLE9BQWIsRUFBc0I7QUFDbEJXLGlDQUFTQyxJQUFULEdBQWdCakIsTUFBTWtCLE1BQU4sQ0FBYSxtQkFBYixDQUFoQjtBQUNILHFCQUZELE1BRU8sSUFBSWhCLFNBQVNFLE1BQWIsRUFBcUI7QUFDeEJBLGlDQUFTLEtBQUtNLGFBQUwsQ0FBbUJSLFNBQVNFLE1BQTVCLENBQVQ7QUFDQU8sOEJBQVNYLE1BQU1TLENBQU4sQ0FBUSw2QkFBUixDQUFULFlBQXNETCxPQUFPUSxJQUFQLENBQVksSUFBWixDQUF0RDtBQUNILHFCQUhNLE1BR0E7QUFDSFosOEJBQU1PLEVBQU4sQ0FBU00sWUFBVDtBQUNIO0FBQ0o7QUFDSixhQWJ1RCxFQWFwRCxJQWJvRCxDQUF4RDtBQWNIO0FBQ0osS0E1RzZCO0FBOEc5QkgsaUJBOUc4Qix5QkE4R2hCUyxjQTlHZ0IsRUE4R0E7QUFDMUIsWUFBSUMsa0JBQUo7QUFDQSxZQUFJaEIsZUFBSjtBQUNBQSxpQkFBUyxFQUFUOztBQUVBLGFBQUtnQixTQUFMLElBQWtCRCxjQUFsQixFQUFrQztBQUM5QmYscUJBQVNBLE9BQU9pQixNQUFQLENBQWNGLGVBQWVDLFNBQWYsQ0FBZCxDQUFUO0FBQ0g7O0FBRUQsZUFBT2hCLE1BQVA7QUFDSDtBQXhINkIsQ0FBckIsQ0FBYjs7QUEySEFsQyxRQUFRMEYsSUFBUixDQUFhQyxLQUFiLENBQW1CLFlBQU07QUFDckIsUUFBSUMsbUJBQUo7QUFDQUEsaUJBQWEsSUFBSTdGLE1BQUosRUFBYjtBQUNBVyxNQUFFbUYsSUFBRixDQUFPbkYsRUFBRSxhQUFGLENBQVAsRUFBeUIsVUFBQ29GLENBQUQsRUFBSUMsSUFBSjtBQUFBLGVBQWEsSUFBSWxHLFNBQUosQ0FBY2tHLElBQWQsQ0FBYjtBQUFBLEtBQXpCO0FBQ0gsQ0FKRCxFIiwiZmlsZSI6Ii9mb3JtYnVpbGRlci9yZXNvdXJjZXMvanMvZ3JvdXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmE3ODlkZTIzMjk4ZTE5MmJkMzciLCJsZXQgR3JvdXBJdGVtO1xubGV0IEdyb3VwTW9kYWw7XG5sZXQgR3JvdXBzO1xuXG5Hcm91cHMgPSBHYXJuaXNoLkJhc2UuZXh0ZW5kKHtcbiAgICAkZ3JvdXBzOiBudWxsLFxuICAgICRzZWxlY3RlZEdyb3VwOiBudWxsLFxuICAgICRuZXdHcm91cEJ0bjogbnVsbCxcbiAgICBtb2RhbDogbnVsbCxcblxuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCAkZ3JvdXBTZXR0aW5nc0J0bjtcbiAgICAgICAgbGV0IG1lbnVCdG47XG5cbiAgICAgICAgdGhpcy4kZ3JvdXBzID0gJCgnI2dyb3VwcycpO1xuICAgICAgICB0aGlzLiRzZWxlY3RlZEdyb3VwID0gdGhpcy4kZ3JvdXBzLmZpbmQoJ2Euc2VsOmZpcnN0Jyk7XG4gICAgICAgIHRoaXMuJG5ld0dyb3VwQnRuID0gJCgnI25ld2dyb3VwYnRuJyk7XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy4kbmV3R3JvdXBCdG4sICdjbGljaycsICdhZGROZXdHcm91cCcpO1xuXG4gICAgICAgICRncm91cFNldHRpbmdzQnRuID0gJCgnI2dyb3Vwc2V0dGluZ3NidG4nKTtcblxuICAgICAgICBpZiAoJGdyb3VwU2V0dGluZ3NCdG4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBtZW51QnRuID0gJGdyb3VwU2V0dGluZ3NCdG4uZGF0YSgnbWVudWJ0bicpO1xuICAgICAgICAgICAgbWVudUJ0bi5zZXR0aW5ncy5vbk9wdGlvblNlbGVjdCA9ICQucHJveHkoKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICBsZXQgYWN0aW9uO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICQoZWxlbSkuZGF0YSgnYWN0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyZW5hbWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5hbWVTZWxlY3RlZEdyb3VwKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkR3JvdXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkTmV3R3JvdXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5tb2RhbCkge1xuICAgICAgICAgICAgdGhpcy5tb2RhbCA9IG5ldyBHcm91cE1vZGFsKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb2RhbC5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuYW1lU2VsZWN0ZWRHcm91cCgpIHtcbiAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgIGxldCBuZXdOYW1lO1xuICAgICAgICBsZXQgb2xkTmFtZTtcblxuICAgICAgICBvbGROYW1lID0gdGhpcy4kc2VsZWN0ZWRHcm91cC50ZXh0KCk7XG4gICAgICAgIG5ld05hbWUgPSB0aGlzLnByb21wdEZvckdyb3VwTmFtZShvbGROYW1lKTtcbiAgICAgIFxuICAgICAgICBpZiAobmV3TmFtZSAmJiBuZXdOYW1lICE9PSBvbGROYW1lKSB7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLiRzZWxlY3RlZEdyb3VwLmRhdGEoJ2lkJyksXG4gICAgICAgICAgICAgICAgbmFtZTogbmV3TmFtZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2dyb3VwL3NhdmUnLCBkYXRhLCAkLnByb3h5KChmdW5jdGlvbihyZXNwb25zZSwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvcnM7XG5cbiAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzZWxlY3RlZEdyb3VwLnRleHQocmVzcG9uc2UuZ3JvdXAubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5Tm90aWNlKENyYWZ0LnQoJ0dyb3VwIHJlbmFtZWQuJykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdGhpcy5mbGF0dGVuRXJyb3JzKHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChgJHtDcmFmdC50KCdDb3VsZCBub3QgcmVuYW1lIHRoZSBncm91cDonKX1cXG5cXG4ke2Vycm9ycy5qb2luKCdcXG4nKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwcm9tcHRGb3JHcm91cE5hbWUob2xkTmFtZSkge1xuICAgICAgICBwcm9tcHQoQ3JhZnQudCgnV2hhdCBkbyB5b3Ugd2FudCB0byBuYW1lIHlvdXIgZ3JvdXA/JyksIG9sZE5hbWUpO1xuICAgIH0sXG5cbiAgICBkZWxldGVTZWxlY3RlZEdyb3VwKCkge1xuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgdGhpcy4kc2VsZWN0ZWRHcm91cCA9ICQoJyNncm91cHMgYS5zZWwnKTtcbiAgICAgIFxuICAgICAgICBpZiAodGhpcy4kc2VsZWN0ZWRHcm91cC5kYXRhKCdpZCcpID09PSAxKSB7XG4gICAgICAgICAgICBDcmFmdC5jcC5kaXNwbGF5RXJyb3IoQ3JhZnQudCgnQ2Fubm90IGRlbGV0ZSBEZWZhdWx0IGdyb3VwJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbmZpcm0oQ3JhZnQudCgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGdyb3VwIGFuZCBhbGwgaXRzIGZvcm1zPycpKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLiRzZWxlY3RlZEdyb3VwLmRhdGEoJ2lkJylcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgQ3JhZnQucG9zdEFjdGlvblJlcXVlc3QoJ2Zvcm1CdWlsZGVyL2dyb3VwL2RlbGV0ZScsIGRhdGEsICQucHJveHkoKChyZXNwb25zZSwgdGV4dFN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBDcmFmdC5nZXRVcmwoJ2Zvcm1idWlsZGVyL2Zvcm1zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmbGF0dGVuRXJyb3JzKHJlc3BvbnNlRXJyb3JzKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGU7XG4gICAgICAgIGxldCBlcnJvcnM7XG4gICAgICAgIGVycm9ycyA9IFtdO1xuXG4gICAgICAgIGZvciAoYXR0cmlidXRlIGluIHJlc3BvbnNlRXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KHJlc3BvbnNlRXJyb3JzW2F0dHJpYnV0ZV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9XG59KTtcblxuR3JvdXBJdGVtID0gR2FybmlzaC5Nb2RhbC5leHRlbmQoe1xuICAgICRncm91cExpc3RJdGVtOiBudWxsLFxuICAgICRncm91cDogbnVsbCxcbiAgICAkZWRpdEdyb3VwQnRuOiBudWxsLFxuICAgIGlkOiBudWxsLFxuICAgIGxhYmVsOiBudWxsLFxuICAgIGljb25OYW1lOiBudWxsLFxuICAgIG1vZGFsOiBudWxsLFxuXG4gICAgaW5pdChlbCkge1xuICAgICAgICB0aGlzLiRncm91cExpc3RJdGVtID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGdyb3VwID0gdGhpcy4kZ3JvdXBMaXN0SXRlbS5maW5kKCdhJyk7XG4gICAgICAgIHRoaXMuJGVkaXRHcm91cEJ0biA9IHRoaXMuJGdyb3VwLmZpbmQoJy5lZGl0LWdyb3VwJyk7XG4gICAgICAgIHRoaXMuaWQgPSB0aGlzLiRncm91cC5kYXRhKCdpZCcpO1xuICAgICAgICB0aGlzLmxhYmVsID0gdGhpcy4kZ3JvdXAuZGF0YSgnbGFiZWwnKTtcbiAgICAgICAgdGhpcy5pY29uTmFtZSA9IHRoaXMuJGdyb3VwLmRhdGEoJ2ljb24tbmFtZScpO1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGVkaXRHcm91cEJ0biwgJ2NsaWNrJywgJ2VkaXQnKTtcbiAgICB9LFxuXG4gICAgZWRpdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGFsID0gbmV3IEdyb3VwTW9kYWwodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1vZGFsLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5Hcm91cE1vZGFsID0gR2FybmlzaC5Nb2RhbC5leHRlbmQoe1xuICAgIGdyb3VwOiBudWxsLFxuICAgICRmb3JtOiBudWxsLFxuICAgICRtb2RhbElucHV0czogbnVsbCxcbiAgICBpbml0KGdyb3VwKSB7XG4gICAgICAgIGxldCAkaW5wdXQ7XG4gICAgICAgIGxldCAkaW5wdXQyO1xuICAgICAgICBsZXQgJGljb25zO1xuICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgbGV0IGljb25OYW1lO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCB0aXRsZTtcbiAgICAgICAgbGV0IHNlbGY7XG5cbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcbiAgICAgICAgdGhpcy5iYXNlKCk7XG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKCc8Zm9ybSBjbGFzcz1cIm1vZGFsIGZpdHRlZCBmb3JtYnVpbGRlci1tb2RhbFwiPicpLmFwcGVuZFRvKEdhcm5pc2guJGJvZCk7XG4gICAgICAgIHRoaXMuc2V0Q29udGFpbmVyKHRoaXMuJGZvcm0pO1xuXG4gICAgICAgIHRpdGxlID0gdGhpcy5ncm91cC5pZCA/IENyYWZ0LnQoJ0VkaXQgR3JvdXAnKSA6IENyYWZ0LnQoJ05ldyBHcm91cCcpO1xuICAgICAgICBib2R5ID0gJChbJzxoZWFkZXI+JywgYDxzcGFuIGNsYXNzPVwibW9kYWwtdGl0bGVcIj4ke3RpdGxlfTwvc3Bhbj5gLCAnPC9oZWFkZXI+JywgJzxkaXYgY2xhc3M9XCJib2R5XCI+PGRpdiBjbGFzcz1cImZvb3Rlci1ub3Rlc1wiPkdldCBpY29uIG5hbWVzIGF0IDxhIGhyZWY9XCJodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9pY29uc1wiIHRhcmdldD1cIl9ibGFua1wiPkZvbnRBd2Vzb21lPC9hPjwvZGl2PjwvZGl2PicsICc8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+JywgJzxkaXYgY2xhc3M9XCJidXR0b25zXCI+JywgYDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5zIGJ0bi1tb2RhbCBjYW5jZWxcIiB2YWx1ZT1cIiR7Q3JhZnQudCgnQ2FuY2VsJyl9XCI+YCwgYDxpbnB1dCB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG5zIGJ0bi1tb2RhbCBzdWJtaXRcIiB2YWx1ZT1cIiR7Q3JhZnQudCgnU2F2ZScpfVwiPmAsICc8L2Rpdj4nLCAnPC9mb290ZXI+J10uam9pbignJykpLmFwcGVuZFRvKHRoaXMuJGZvcm0pO1xuICAgICAgICBsYWJlbCA9IHRoaXMuZ3JvdXAubGFiZWwgPyB0aGlzLmdyb3VwLmxhYmVsIDogJyc7XG4gICAgICAgIGljb25OYW1lID0gdGhpcy5ncm91cC5pY29uTmFtZSA/IHRoaXMuZ3JvdXAuaWNvbk5hbWUgOiAnJztcbiAgICAgICAgJGlucHV0ID0gYDxpbnB1dCB0eXBlPSd0ZXh0JyBjbGFzcz0nZ3JvdXBOYW1lJyB2YWx1ZT0nJHtsYWJlbH0nIGRhdGEtaGludD0nTkFNRScgZGF0YS1uYW1lPSdncm91cE5hbWUnIC8+YDtcbiAgICAgICAgJGlucHV0MiA9IGA8aW5wdXQgdHlwZT0ndGV4dCcgY2xhc3M9J2dyb3VwSWNvbicgdmFsdWU9JyR7aWNvbk5hbWV9JyBkYXRhLWhpbnQ9J0lDT04nIGRhdGEtbmFtZT0nZ3JvdXBJY29uJyAvPmA7XG4gICAgICAgIC8vICRpY29ucyA9ICd7XCJnbGFzc1wiLCBcIm11c2ljXCIsIFwic2VhcmNoXCIsIFwiZW52ZWxvcGUtb1wiLCBcImhlYXJ0XCIsIFwic3RhclwiLCBcInN0YXItb1wiLCBcInVzZXJcIiwgXCJmaWxtXCIsIFwidGgtbGFyZ2VcIiwgXCJ0aFwiLCBcInRoLWxpc3RcIiwgXCJjaGVja1wiLCBcInJlbW92ZVwiLCBcImNsb3NlXCIsIFwidGltZXNcIiwgXCJzZWFyY2gtcGx1c1wiLCBcInNlYXJjaC1taW51c1wiLCBcInBvd2VyLW9mZlwiLCBcInNpZ25hbFwiLCBcImdlYXJcIiwgXCJjb2dcIiwgXCJ0cmFzaC1vXCIsIFwiaG9tZVwiLCBcImZpbGUtb1wiLCBcImNsb2NrLW9cIiwgXCJyb2FkXCIsIFwiZG93bmxvYWRcIiwgXCJhcnJvdy1jaXJjbGUtby1kb3duXCIsIFwiYXJyb3ctY2lyY2xlLW8tdXBcIiwgXCJpbmJveFwiLCBcInBsYXktY2lyY2xlLW9cIiwgXCJyb3RhdGUtcmlnaHRcIiwgXCJyZXBlYXRcIiwgXCJyZWZyZXNoXCIsIFwibGlzdC1hbHRcIiwgXCJsb2NrXCIsIFwiZmxhZ1wiLCBcImhlYWRwaG9uZXNcIiwgXCJ2b2x1bWUtb2ZmXCIsIFwidm9sdW1lLWRvd25cIiwgXCJ2b2x1bWUtdXBcIiwgXCJxcmNvZGVcIiwgXCJiYXJjb2RlXCIsIFwidGFnXCIsIFwidGFnc1wiLCBcImJvb2tcIiwgXCJib29rbWFya1wiLCBcInByaW50XCIsIFwiY2FtZXJhXCIsIFwiZm9udFwiLCBcImJvbGRcIiwgXCJpdGFsaWNcIiwgXCJ0ZXh0LWhlaWdodFwiLCBcInRleHQtd2lkdGhcIiwgXCJhbGlnbi1sZWZ0XCIsIFwiYWxpZ24tY2VudGVyXCIsIFwiYWxpZ24tcmlnaHRcIiwgXCJhbGlnbi1qdXN0aWZ5XCIsIFwibGlzdFwiLCBcImRlZGVudFwiLCBcIm91dGRlbnRcIiwgXCJpbmRlbnRcIiwgXCJ2aWRlby1jYW1lcmFcIiwgXCJwaG90b1wiLCBcImltYWdlXCIsIFwicGljdHVyZS1vXCIsIFwicGVuY2lsXCIsIFwibWFwLW1hcmtlclwiLCBcImFkanVzdFwiLCBcInRpbnRcIiwgXCJlZGl0XCIsIFwicGVuY2lsLXNxdWFyZS1vXCIsIFwic2hhcmUtc3F1YXJlLW9cIiwgXCJjaGVjay1zcXVhcmUtb1wiLCBcImFycm93c1wiLCBcInN0ZXAtYmFja3dhcmRcIiwgXCJmYXN0LWJhY2t3YXJkXCIsIFwiYmFja3dhcmRcIiwgXCJwbGF5XCIsIFwicGF1c2VcIiwgXCJzdG9wXCIsIFwiZm9yd2FyZFwiLCBcImZhc3QtZm9yd2FyZFwiLCBcInN0ZXAtZm9yd2FyZFwiLCBcImVqZWN0XCIsIFwiY2hldnJvbi1sZWZ0XCIsIFwiY2hldnJvbi1yaWdodFwiLCBcInBsdXMtY2lyY2xlXCIsIFwibWludXMtY2lyY2xlXCIsIFwidGltZXMtY2lyY2xlXCIsIFwiY2hlY2stY2lyY2xlXCIsIFwicXVlc3Rpb24tY2lyY2xlXCIsIFwiaW5mby1jaXJjbGVcIiwgXCJjcm9zc2hhaXJzXCIsIFwidGltZXMtY2lyY2xlLW9cIiwgXCJjaGVjay1jaXJjbGUtb1wiLCBcImJhblwiLCBcImFycm93LWxlZnRcIiwgXCJhcnJvdy1yaWdodFwiLCBcImFycm93LXVwXCIsIFwiYXJyb3ctZG93blwiLCBcIm1haWwtZm9yd2FyZFwiLCBcInNoYXJlXCIsIFwiZXhwYW5kXCIsIFwiY29tcHJlc3NcIiwgXCJwbHVzXCIsIFwibWludXNcIiwgXCJhc3Rlcmlza1wiLCBcImV4Y2xhbWF0aW9uLWNpcmNsZVwiLCBcImdpZnRcIiwgXCJsZWFmXCIsIFwiZmlyZVwiLCBcImV5ZVwiLCBcImV5ZS1zbGFzaFwiLCBcIndhcm5pbmdcIiwgXCJleGNsYW1hdGlvbi10cmlhbmdsZVwiLCBcInBsYW5lXCIsIFwiY2FsZW5kYXJcIiwgXCJyYW5kb21cIiwgXCJjb21tZW50XCIsIFwibWFnbmV0XCIsIFwiY2hldnJvbi11cFwiLCBcImNoZXZyb24tZG93blwiLCBcInJldHdlZXRcIiwgXCJzaG9wcGluZy1jYXJ0XCIsIFwiZm9sZGVyXCIsIFwiZm9sZGVyLW9wZW5cIiwgXCJhcnJvd3MtdlwiLCBcImFycm93cy1oXCIsIFwiYmFyLWNoYXJ0LW9cIiwgXCJiYXItY2hhcnRcIiwgXCJ0d2l0dGVyLXNxdWFyZVwiLCBcImZhY2Vib29rLXNxdWFyZVwiLCBcImNhbWVyYS1yZXRyb1wiLCBcImtleVwiLCBcImdlYXJzXCIsIFwiY29nc1wiLCBcImNvbW1lbnRzXCIsIFwidGh1bWJzLW8tdXBcIiwgXCJ0aHVtYnMtby1kb3duXCIsIFwic3Rhci1oYWxmXCIsIFwiaGVhcnQtb1wiLCBcInNpZ24tb3V0XCIsIFwibGlua2VkaW4tc3F1YXJlXCIsIFwidGh1bWItdGFja1wiLCBcImV4dGVybmFsLWxpbmtcIiwgXCJzaWduLWluXCIsIFwidHJvcGh5XCIsIFwiZ2l0aHViLXNxdWFyZVwiLCBcInVwbG9hZFwiLCBcImxlbW9uLW9cIiwgXCJwaG9uZVwiLCBcInNxdWFyZS1vXCIsIFwiYm9va21hcmstb1wiLCBcInBob25lLXNxdWFyZVwiLCBcInR3aXR0ZXJcIiwgXCJmYWNlYm9vay1mXCIsIFwiZmFjZWJvb2tcIiwgXCJnaXRodWJcIiwgXCJ1bmxvY2tcIiwgXCJjcmVkaXQtY2FyZFwiLCBcImZlZWRcIiwgXCJyc3NcIiwgXCJoZGQtb1wiLCBcImJ1bGxob3JuXCIsIFwiYmVsbFwiLCBcImNlcnRpZmljYXRlXCIsIFwiaGFuZC1vLXJpZ2h0XCIsIFwiaGFuZC1vLWxlZnRcIiwgXCJoYW5kLW8tdXBcIiwgXCJoYW5kLW8tZG93blwiLCBcImFycm93LWNpcmNsZS1sZWZ0XCIsIFwiYXJyb3ctY2lyY2xlLXJpZ2h0XCIsIFwiYXJyb3ctY2lyY2xlLXVwXCIsIFwiYXJyb3ctY2lyY2xlLWRvd25cIiwgXCJnbG9iZVwiLCBcIndyZW5jaFwiLCBcInRhc2tzXCIsIFwiZmlsdGVyXCIsIFwiYnJpZWZjYXNlXCIsIFwiYXJyb3dzLWFsdFwiLCBcImdyb3VwXCIsIFwidXNlcnNcIiwgXCJjaGFpblwiLCBcImxpbmtcIiwgXCJjbG91ZFwiLCBcImZsYXNrXCIsIFwiY3V0XCIsIFwic2Npc3NvcnNcIiwgXCJjb3B5XCIsIFwiZmlsZXMtb1wiLCBcInBhcGVyY2xpcFwiLCBcInNhdmVcIiwgXCJmbG9wcHktb1wiLCBcInNxdWFyZVwiLCBcIm5hdmljb25cIiwgXCJyZW9yZGVyXCIsIFwiYmFyc1wiLCBcImxpc3QtdWxcIiwgXCJsaXN0LW9sXCIsIFwic3RyaWtldGhyb3VnaFwiLCBcInVuZGVybGluZVwiLCBcInRhYmxlXCIsIFwibWFnaWNcIiwgXCJ0cnVja1wiLCBcInBpbnRlcmVzdFwiLCBcInBpbnRlcmVzdC1zcXVhcmVcIiwgXCJnb29nbGUtcGx1cy1zcXVhcmVcIiwgXCJnb29nbGUtcGx1c1wiLCBcIm1vbmV5XCIsIFwiY2FyZXQtZG93blwiLCBcImNhcmV0LXVwXCIsIFwiY2FyZXQtbGVmdFwiLCBcImNhcmV0LXJpZ2h0XCIsIFwiY29sdW1uc1wiLCBcInVuc29ydGVkXCIsIFwic29ydFwiLCBcInNvcnQtZG93blwiLCBcInNvcnQtZGVzY1wiLCBcInNvcnQtdXBcIiwgXCJzb3J0LWFzY1wiLCBcImVudmVsb3BlXCIsIFwibGlua2VkaW5cIiwgXCJyb3RhdGUtbGVmdFwiLCBcInVuZG9cIiwgXCJsZWdhbFwiLCBcImdhdmVsXCIsIFwiZGFzaGJvYXJkXCIsIFwidGFjaG9tZXRlclwiLCBcImNvbW1lbnQtb1wiLCBcImNvbW1lbnRzLW9cIiwgXCJmbGFzaFwiLCBcImJvbHRcIiwgXCJzaXRlbWFwXCIsIFwidW1icmVsbGFcIiwgXCJwYXN0ZVwiLCBcImNsaXBib2FyZFwiLCBcImxpZ2h0YnVsYi1vXCIsIFwiZXhjaGFuZ2VcIiwgXCJjbG91ZC1kb3dubG9hZFwiLCBcImNsb3VkLXVwbG9hZFwiLCBcInVzZXItbWRcIiwgXCJzdGV0aG9zY29wZVwiLCBcInN1aXRjYXNlXCIsIFwiYmVsbC1vXCIsIFwiY29mZmVlXCIsIFwiY3V0bGVyeVwiLCBcImZpbGUtdGV4dC1vXCIsIFwiYnVpbGRpbmctb1wiLCBcImhvc3BpdGFsLW9cIiwgXCJhbWJ1bGFuY2VcIiwgXCJtZWRraXRcIiwgXCJmaWdodGVyLWpldFwiLCBcImJlZXJcIiwgXCJoLXNxdWFyZVwiLCBcInBsdXMtc3F1YXJlXCIsIFwiYW5nbGUtZG91YmxlLWxlZnRcIiwgXCJhbmdsZS1kb3VibGUtcmlnaHRcIiwgXCJhbmdsZS1kb3VibGUtdXBcIiwgXCJhbmdsZS1kb3VibGUtZG93blwiLCBcImFuZ2xlLWxlZnRcIiwgXCJhbmdsZS1yaWdodFwiLCBcImFuZ2xlLXVwXCIsIFwiYW5nbGUtZG93blwiLCBcImRlc2t0b3BcIiwgXCJsYXB0b3BcIiwgXCJ0YWJsZXRcIiwgXCJtb2JpbGUtcGhvbmVcIiwgXCJtb2JpbGVcIiwgXCJjaXJjbGUtb1wiLCBcInF1b3RlLWxlZnRcIiwgXCJxdW90ZS1yaWdodFwiLCBcInNwaW5uZXJcIiwgXCJjaXJjbGVcIiwgXCJtYWlsLXJlcGx5XCIsIFwicmVwbHlcIiwgXCJnaXRodWItYWx0XCIsIFwiZm9sZGVyLW9cIiwgXCJmb2xkZXItb3Blbi1vXCIsIFwic21pbGUtb1wiLCBcImZyb3duLW9cIiwgXCJtZWgtb1wiLCBcImdhbWVwYWRcIiwgXCJrZXlib2FyZC1vXCIsIFwiZmxhZy1vXCIsIFwiZmxhZy1jaGVja2VyZWRcIiwgXCJ0ZXJtaW5hbFwiLCBcImNvZGVcIiwgXCJtYWlsLXJlcGx5LWFsbFwiLCBcInJlcGx5LWFsbFwiLCBcInN0YXItaGFsZi1lbXB0eVwiLCBcInN0YXItaGFsZi1mdWxsXCIsIFwic3Rhci1oYWxmLW9cIiwgXCJsb2NhdGlvbi1hcnJvd1wiLCBcImNyb3BcIiwgXCJjb2RlLWZvcmtcIiwgXCJ1bmxpbmtcIiwgXCJjaGFpbi1icm9rZW5cIiwgXCJxdWVzdGlvblwiLCBcImluZm9cIiwgXCJleGNsYW1hdGlvblwiLCBcInN1cGVyc2NyaXB0XCIsIFwic3Vic2NyaXB0XCIsIFwiZXJhc2VyXCIsIFwicHV6emxlLXBpZWNlXCIsIFwibWljcm9waG9uZVwiLCBcIm1pY3JvcGhvbmUtc2xhc2hcIiwgXCJzaGllbGRcIiwgXCJjYWxlbmRhci1vXCIsIFwiZmlyZS1leHRpbmd1aXNoZXJcIiwgXCJyb2NrZXRcIiwgXCJtYXhjZG5cIiwgXCJjaGV2cm9uLWNpcmNsZS1sZWZ0XCIsIFwiY2hldnJvbi1jaXJjbGUtcmlnaHRcIiwgXCJjaGV2cm9uLWNpcmNsZS11cFwiLCBcImNoZXZyb24tY2lyY2xlLWRvd25cIiwgXCJodG1sNVwiLCBcImNzczNcIiwgXCJhbmNob3JcIiwgXCJ1bmxvY2stYWx0XCIsIFwiYnVsbHNleWVcIiwgXCJlbGxpcHNpcy1oXCIsIFwiZWxsaXBzaXMtdlwiLCBcInJzcy1zcXVhcmVcIiwgXCJwbGF5LWNpcmNsZVwiLCBcInRpY2tldFwiLCBcIm1pbnVzLXNxdWFyZVwiLCBcIm1pbnVzLXNxdWFyZS1vXCIsIFwibGV2ZWwtdXBcIiwgXCJsZXZlbC1kb3duXCIsIFwiY2hlY2stc3F1YXJlXCIsIFwicGVuY2lsLXNxdWFyZVwiLCBcImV4dGVybmFsLWxpbmstc3F1YXJlXCIsIFwic2hhcmUtc3F1YXJlXCIsIFwiY29tcGFzc1wiLCBcInRvZ2dsZS1kb3duXCIsIFwiY2FyZXQtc3F1YXJlLW8tZG93blwiLCBcInRvZ2dsZS11cFwiLCBcImNhcmV0LXNxdWFyZS1vLXVwXCIsIFwidG9nZ2xlLXJpZ2h0XCIsIFwiY2FyZXQtc3F1YXJlLW8tcmlnaHRcIiwgXCJldXJvXCIsIFwiZXVyXCIsIFwiZ2JwXCIsIFwiZG9sbGFyXCIsIFwidXNkXCIsIFwicnVwZWVcIiwgXCJpbnJcIiwgXCJjbnlcIiwgXCJybWJcIiwgXCJ5ZW5cIiwgXCJqcHlcIiwgXCJydWJsZVwiLCBcInJvdWJsZVwiLCBcInJ1YlwiLCBcIndvblwiLCBcImtyd1wiLCBcImJpdGNvaW5cIiwgXCJidGNcIiwgXCJmaWxlXCIsIFwiZmlsZS10ZXh0XCIsIFwic29ydC1hbHBoYS1hc2NcIiwgXCJzb3J0LWFscGhhLWRlc2NcIiwgXCJzb3J0LWFtb3VudC1hc2NcIiwgXCJzb3J0LWFtb3VudC1kZXNjXCIsIFwic29ydC1udW1lcmljLWFzY1wiLCBcInNvcnQtbnVtZXJpYy1kZXNjXCIsIFwidGh1bWJzLXVwXCIsIFwidGh1bWJzLWRvd25cIiwgXCJ5b3V0dWJlLXNxdWFyZVwiLCBcInlvdXR1YmVcIiwgXCJ4aW5nXCIsIFwieGluZy1zcXVhcmVcIiwgXCJ5b3V0dWJlLXBsYXlcIiwgXCJkcm9wYm94XCIsIFwic3RhY2stb3ZlcmZsb3dcIiwgXCJpbnN0YWdyYW1cIiwgXCJmbGlja3JcIiwgXCJhZG5cIiwgXCJiaXRidWNrZXRcIiwgXCJiaXRidWNrZXQtc3F1YXJlXCIsIFwidHVtYmxyXCIsIFwidHVtYmxyLXNxdWFyZVwiLCBcImxvbmctYXJyb3ctZG93blwiLCBcImxvbmctYXJyb3ctdXBcIiwgXCJsb25nLWFycm93LWxlZnRcIiwgXCJsb25nLWFycm93LXJpZ2h0XCIsIFwiYXBwbGVcIiwgXCJ3aW5kb3dzXCIsIFwiYW5kcm9pZFwiLCBcImxpbnV4XCIsIFwiZHJpYmJibGVcIiwgXCJza3lwZVwiLCBcImZvdXJzcXVhcmVcIiwgXCJ0cmVsbG9cIiwgXCJmZW1hbGVcIiwgXCJtYWxlXCIsIFwiZ2l0dGlwXCIsIFwiZ3JhdGlwYXlcIiwgXCJzdW4tb1wiLCBcIm1vb24tb1wiLCBcImFyY2hpdmVcIiwgXCJidWdcIiwgXCJ2a1wiLCBcIndlaWJvXCIsIFwicmVucmVuXCIsIFwicGFnZWxpbmVzXCIsIFwic3RhY2stZXhjaGFuZ2VcIiwgXCJhcnJvdy1jaXJjbGUtby1yaWdodFwiLCBcImFycm93LWNpcmNsZS1vLWxlZnRcIiwgXCJ0b2dnbGUtbGVmdFwiLCBcImNhcmV0LXNxdWFyZS1vLWxlZnRcIiwgXCJkb3QtY2lyY2xlLW9cIiwgXCJ3aGVlbGNoYWlyXCIsIFwidmltZW8tc3F1YXJlXCIsIFwidHVya2lzaC1saXJhXCIsIFwidHJ5XCIsIFwicGx1cy1zcXVhcmUtb1wiLCBcInNwYWNlLXNodXR0bGVcIiwgXCJzbGFja1wiLCBcImVudmVsb3BlLXNxdWFyZVwiLCBcIndvcmRwcmVzc1wiLCBcIm9wZW5pZFwiLCBcImluc3RpdHV0aW9uXCIsIFwiYmFua1wiLCBcInVuaXZlcnNpdHlcIiwgXCJtb3J0YXItYm9hcmRcIiwgXCJncmFkdWF0aW9uLWNhcFwiLCBcInlhaG9vXCIsIFwiZ29vZ2xlXCIsIFwicmVkZGl0XCIsIFwicmVkZGl0LXNxdWFyZVwiLCBcInN0dW1ibGV1cG9uLWNpcmNsZVwiLCBcInN0dW1ibGV1cG9uXCIsIFwiZGVsaWNpb3VzXCIsIFwiZGlnZ1wiLCBcInBpZWQtcGlwZXJcIiwgXCJwaWVkLXBpcGVyLWFsdFwiLCBcImRydXBhbFwiLCBcImpvb21sYVwiLCBcImxhbmd1YWdlXCIsIFwiZmF4XCIsIFwiYnVpbGRpbmdcIiwgXCJjaGlsZFwiLCBcInBhd1wiLCBcInNwb29uXCIsIFwiY3ViZVwiLCBcImN1YmVzXCIsIFwiYmVoYW5jZVwiLCBcImJlaGFuY2Utc3F1YXJlXCIsIFwic3RlYW1cIiwgXCJzdGVhbS1zcXVhcmVcIiwgXCJyZWN5Y2xlXCIsIFwiYXV0b21vYmlsZVwiLCBcImNhclwiLCBcImNhYlwiLCBcInRheGlcIiwgXCJ0cmVlXCIsIFwic3BvdGlmeVwiLCBcImRldmlhbnRhcnRcIiwgXCJzb3VuZGNsb3VkXCIsIFwiZGF0YWJhc2VcIiwgXCJmaWxlLXBkZi1vXCIsIFwiZmlsZS13b3JkLW9cIiwgXCJmaWxlLWV4Y2VsLW9cIiwgXCJmaWxlLXBvd2VycG9pbnQtb1wiLCBcImZpbGUtcGhvdG8tb1wiLCBcImZpbGUtcGljdHVyZS1vXCIsIFwiZmlsZS1pbWFnZS1vXCIsIFwiZmlsZS16aXAtb1wiLCBcImZpbGUtYXJjaGl2ZS1vXCIsIFwiZmlsZS1zb3VuZC1vXCIsIFwiZmlsZS1hdWRpby1vXCIsIFwiZmlsZS1tb3ZpZS1vXCIsIFwiZmlsZS12aWRlby1vXCIsIFwiZmlsZS1jb2RlLW9cIiwgXCJ2aW5lXCIsIFwiY29kZXBlblwiLCBcImpzZmlkZGxlXCIsIFwibGlmZS1ib3V5XCIsIFwibGlmZS1idW95XCIsIFwibGlmZS1zYXZlclwiLCBcInN1cHBvcnRcIiwgXCJsaWZlLXJpbmdcIiwgXCJjaXJjbGUtby1ub3RjaFwiLCBcInJhXCIsIFwicmViZWxcIiwgXCJnZVwiLCBcImVtcGlyZVwiLCBcImdpdC1zcXVhcmVcIiwgXCJnaXRcIiwgXCJ5LWNvbWJpbmF0b3Itc3F1YXJlXCIsIFwieWMtc3F1YXJlXCIsIFwiaGFja2VyLW5ld3NcIiwgXCJ0ZW5jZW50LXdlaWJvXCIsIFwicXFcIiwgXCJ3ZWNoYXRcIiwgXCJ3ZWl4aW5cIiwgXCJzZW5kXCIsIFwicGFwZXItcGxhbmVcIiwgXCJzZW5kLW9cIiwgXCJwYXBlci1wbGFuZS1vXCIsIFwiaGlzdG9yeVwiLCBcImNpcmNsZS10aGluXCIsIFwiaGVhZGVyXCIsIFwicGFyYWdyYXBoXCIsIFwic2xpZGVyc1wiLCBcInNoYXJlLWFsdFwiLCBcInNoYXJlLWFsdC1zcXVhcmVcIiwgXCJib21iXCIsIFwic29jY2VyLWJhbGwtb1wiLCBcImZ1dGJvbC1vXCIsIFwidHR5XCIsIFwiYmlub2N1bGFyc1wiLCBcInBsdWdcIiwgXCJzbGlkZXNoYXJlXCIsIFwidHdpdGNoXCIsIFwieWVscFwiLCBcIm5ld3NwYXBlci1vXCIsIFwid2lmaVwiLCBcImNhbGN1bGF0b3JcIiwgXCJwYXlwYWxcIiwgXCJnb29nbGUtd2FsbGV0XCIsIFwiY2MtdmlzYVwiLCBcImNjLW1hc3RlcmNhcmRcIiwgXCJjYy1kaXNjb3ZlclwiLCBcImNjLWFtZXhcIiwgXCJjYy1wYXlwYWxcIiwgXCJjYy1zdHJpcGVcIiwgXCJiZWxsLXNsYXNoXCIsIFwiYmVsbC1zbGFzaC1vXCIsIFwidHJhc2hcIiwgXCJjb3B5cmlnaHRcIiwgXCJhdFwiLCBcImV5ZWRyb3BwZXJcIiwgXCJwYWludC1icnVzaFwiLCBcImJpcnRoZGF5LWNha2VcIiwgXCJhcmVhLWNoYXJ0XCIsIFwicGllLWNoYXJ0XCIsIFwibGluZS1jaGFydFwiLCBcImxhc3RmbVwiLCBcImxhc3RmbS1zcXVhcmVcIiwgXCJ0b2dnbGUtb2ZmXCIsIFwidG9nZ2xlLW9uXCIsIFwiYmljeWNsZVwiLCBcImJ1c1wiLCBcImlveGhvc3RcIiwgXCJhbmdlbGxpc3RcIiwgXCJjY1wiLCBcInNoZWtlbFwiLCBcInNoZXFlbFwiLCBcImlsc1wiLCBcIm1lYW5wYXRoXCIsIFwiYnV5c2VsbGFkc1wiLCBcImNvbm5lY3RkZXZlbG9wXCIsIFwiZGFzaGN1YmVcIiwgXCJmb3J1bWJlZVwiLCBcImxlYW5wdWJcIiwgXCJzZWxsc3lcIiwgXCJzaGlydHNpbmJ1bGtcIiwgXCJzaW1wbHlidWlsdFwiLCBcInNreWF0bGFzXCIsIFwiY2FydC1wbHVzXCIsIFwiY2FydC1hcnJvdy1kb3duXCIsIFwiZGlhbW9uZFwiLCBcInNoaXBcIiwgXCJ1c2VyLXNlY3JldFwiLCBcIm1vdG9yY3ljbGVcIiwgXCJzdHJlZXQtdmlld1wiLCBcImhlYXJ0YmVhdFwiLCBcInZlbnVzXCIsIFwibWFyc1wiLCBcIm1lcmN1cnlcIiwgXCJpbnRlcnNleFwiLCBcInRyYW5zZ2VuZGVyXCIsIFwidHJhbnNnZW5kZXItYWx0XCIsIFwidmVudXMtZG91YmxlXCIsIFwibWFycy1kb3VibGVcIiwgXCJ2ZW51cy1tYXJzXCIsIFwibWFycy1zdHJva2VcIiwgXCJtYXJzLXN0cm9rZS12XCIsIFwibWFycy1zdHJva2UtaFwiLCBcIm5ldXRlclwiLCBcImdlbmRlcmxlc3NcIiwgXCJmYWNlYm9vay1vZmZpY2lhbFwiLCBcInBpbnRlcmVzdC1wXCIsIFwid2hhdHNhcHBcIiwgXCJzZXJ2ZXJcIiwgXCJ1c2VyLXBsdXNcIiwgXCJ1c2VyLXRpbWVzXCIsIFwiaG90ZWxcIiwgXCJiZWRcIiwgXCJ2aWFjb2luXCIsIFwidHJhaW5cIiwgXCJzdWJ3YXlcIiwgXCJtZWRpdW1cIiwgXCJ5Y1wiLCBcInktY29tYmluYXRvclwiLCBcIm9wdGluLW1vbnN0ZXJcIiwgXCJvcGVuY2FydFwiLCBcImV4cGVkaXRlZHNzbFwiLCBcImJhdHRlcnktNFwiLCBcImJhdHRlcnktZnVsbFwiLCBcImJhdHRlcnktM1wiLCBcImJhdHRlcnktdGhyZWUtcXVhcnRlcnNcIiwgXCJiYXR0ZXJ5LTJcIiwgXCJiYXR0ZXJ5LWhhbGZcIiwgXCJiYXR0ZXJ5LTFcIiwgXCJiYXR0ZXJ5LXF1YXJ0ZXJcIiwgXCJiYXR0ZXJ5LTBcIiwgXCJiYXR0ZXJ5LWVtcHR5XCIsIFwibW91c2UtcG9pbnRlclwiLCBcImktY3Vyc29yXCIsIFwib2JqZWN0LWdyb3VwXCIsIFwib2JqZWN0LXVuZ3JvdXBcIiwgXCJzdGlja3ktbm90ZVwiLCBcInN0aWNreS1ub3RlLW9cIiwgXCJjYy1qY2JcIiwgXCJjYy1kaW5lcnMtY2x1YlwiLCBcImNsb25lXCIsIFwiYmFsYW5jZS1zY2FsZVwiLCBcImhvdXJnbGFzcy1vXCIsIFwiaG91cmdsYXNzLTFcIiwgXCJob3VyZ2xhc3Mtc3RhcnRcIiwgXCJob3VyZ2xhc3MtMlwiLCBcImhvdXJnbGFzcy1oYWxmXCIsIFwiaG91cmdsYXNzLTNcIiwgXCJob3VyZ2xhc3MtZW5kXCIsIFwiaG91cmdsYXNzXCIsIFwiaGFuZC1ncmFiLW9cIiwgXCJoYW5kLXJvY2stb1wiLCBcImhhbmQtc3RvcC1vXCIsIFwiaGFuZC1wYXBlci1vXCIsIFwiaGFuZC1zY2lzc29ycy1vXCIsIFwiaGFuZC1saXphcmQtb1wiLCBcImhhbmQtc3BvY2stb1wiLCBcImhhbmQtcG9pbnRlci1vXCIsIFwiaGFuZC1wZWFjZS1vXCIsIFwidHJhZGVtYXJrXCIsIFwicmVnaXN0ZXJlZFwiLCBcImNyZWF0aXZlLWNvbW1vbnNcIiwgXCJnZ1wiLCBcImdnLWNpcmNsZVwiLCBcInRyaXBhZHZpc29yXCIsIFwib2Rub2tsYXNzbmlraVwiLCBcIm9kbm9rbGFzc25pa2ktc3F1YXJlXCIsIFwiZ2V0LXBvY2tldFwiLCBcIndpa2lwZWRpYS13XCIsIFwic2FmYXJpXCIsIFwiY2hyb21lXCIsIFwiZmlyZWZveFwiLCBcIm9wZXJhXCIsIFwiaW50ZXJuZXQtZXhwbG9yZXJcIiwgXCJ0dlwiLCBcInRlbGV2aXNpb25cIiwgXCJjb250YW9cIiwgXCI1MDBweFwiLCBcImFtYXpvblwiLCBcImNhbGVuZGFyLXBsdXMtb1wiLCBcImNhbGVuZGFyLW1pbnVzLW9cIiwgXCJjYWxlbmRhci10aW1lcy1vXCIsIFwiY2FsZW5kYXItY2hlY2stb1wiLCBcImluZHVzdHJ5XCIsIFwibWFwLXBpblwiLCBcIm1hcC1zaWduc1wiLCBcIm1hcC1vXCIsIFwibWFwXCIsIFwiY29tbWVudGluZ1wiLCBcImNvbW1lbnRpbmctb1wiLCBcImhvdXp6XCIsIFwidmltZW9cIiwgXCJibGFjay10aWVcIiwgXCJmb250aWNvbnNcIiwgXCJyZWRkaXQtYWxpZW5cIiwgXCJlZGdlXCIsIFwiY3JlZGl0LWNhcmQtYWx0XCIsIFwiY29kaWVwaWVcIiwgXCJtb2R4XCIsIFwiZm9ydC1hd2Vzb21lXCIsIFwidXNiXCIsIFwicHJvZHVjdC1odW50XCIsIFwibWl4Y2xvdWRcIiwgXCJzY3JpYmRcIiwgXCJwYXVzZS1jaXJjbGVcIiwgXCJwYXVzZS1jaXJjbGUtb1wiLCBcInN0b3AtY2lyY2xlXCIsIFwic3RvcC1jaXJjbGUtb1wiLCBcInNob3BwaW5nLWJhZ1wiLCBcInNob3BwaW5nLWJhc2tldFwiLCBcImhhc2h0YWdcIiwgXCJibHVldG9vdGhcIiwgXCJibHVldG9vdGgtYlwiLCBcInBlcmNlbnRcIix9JztcbiAgICAgICAgLy8gJGlucHV0MiA9IGA8c2VsZWN0IGNsYXNzPSdncm91cEljb24nIGRhdGEtaGludD0nSUNPTicgZGF0YS1uYW1lPSdncm91cEljb24nPlxuICAgICAgICAgICAgICAgIC8vIDxvcHRpb24+PC9vcHRpb24+XG4gICAgICAgICAgICAvLyA8L3NlbGVjdGA7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJJbnB1dHMoJGlucHV0MiwgJycsICdzZWxlY3QnLCAnZ3JvdXBJY29uJywgJ0lDT04nLCAnaWNvbk5hbWUnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJJbnB1dHMoJGlucHV0LCAnJywgJ3RleHQnLCAnZ3JvdXBOYW1lJywgJ05BTUUnLCAnZ3JvdXBOYW1lJyk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLiRzYXZlQnRuID0gYm9keS5maW5kKCcuc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJGNhbmNlbEJ0biA9IGJvZHkuZmluZCgnLmNhbmNlbCcpO1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMuJGNhbmNlbEJ0biwgJ2NsaWNrJywgJ2hpZGUnKTtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcih0aGlzLiRmb3JtLCAnc3VibWl0JywgJ3NhdmUnKTtcbiAgICB9LFxuXG4gICAgcmVuZGVySW5wdXRzKGVsLCB2YWx1ZSwgdHlwZSwgbmFtZSwgaGludCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIGxldCAkaW5wdXQ7XG4gICAgICAgICRpbnB1dCA9ICQoYDxkaXYgY2xhc3M9XCJmYi1maWVsZFwiPjxkaXYgY2xhc3M9XCJpbnB1dC1oaW50XCI+JHtoaW50fTwvZGl2PiR7ZWx9PC9kaXY+YCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRmb3JtLmZpbmQoJy5ib2R5JykucHJlcGVuZCgkaW5wdXQpO1xuXG4gICAgICAgIC8vIFRPRE86IGFsbG93IHVzZXJzIHRvIGR5bmFtaWNhbGx5IHNlYXJjaCBmb250YXdlc29tZSBpY29uIHJlcG9zaXRvcnlcbiAgICAgICAgLy8gaWYgKHR5cGUgPT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgLy8gICAgICRpbnB1dC5zZWxlY3QyKHtcbiAgICAgICAgLy8gICAgICAgICBhamF4OiB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHVybDogQ3JhZnQuZ2V0QWN0aW9uVXJsKCkgKyAnL2Zvcm0tYnVpbGRlci9pY29ucy9nZXQtYWxsLWljb25zJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgcHJvY2Vzc1Jlc3VsdHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVzdWx0czogZGF0YS5pY29uc1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0IEljb24nLFxuICAgICAgICAvLyAgICAgICAgIGVzY2FwZU1hcmt1cDogZnVuY3Rpb24gKG1hcmt1cCkgeyByZXR1cm4gbWFya3VwOyB9LFxuICAgICAgICAvLyAgICAgICAgIHRlbXBsYXRlUmVzdWx0OiBmdW5jdGlvbihpY29uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGxldCBtYXJrdXAgPSBgPGRpdiBjbGFzcz0nc2VsZWN0Mi1yZXN1bHQtaWNvbiBjbGVhcmZpeCc+PGRpdiBjbGFzcz0nc2VsZWN0Mi1yZXN1bHQtaW1hZ2UnPjxpbWcgc3JjPScke2ljb24uaWNvbn0nIC8+PC9kaXY+PGRpdiBjbGFzcz0nc2VsZWN0Mi1yZXN1bHQtaWNvbi1kZXRhaWxzJz48ZGl2IGNsYXNzPSdzZWxlY3QyLXJlc3VsdC1uYW1lJz4ke2ljb24ubmFtZX08L2Rpdj5gO1xuICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gbWFya3VwO1xuICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgdGVtcGxhdGVTZWxlY3Rpb246IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfVxuICAgIH0sXG5cbiAgICBzYXZlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgbGV0IGdyb3VwSWNvbjtcbiAgICAgICAgbGV0IGdyb3VwTmFtZTtcbiAgICAgICAgbGV0IGlucHV0TGVuZ3RoO1xuICAgICAgICBsZXQgc2VsZjtcblxuICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgZ3JvdXBOYW1lID0gdGhpcy4kZm9ybS5maW5kKCcuZ3JvdXBOYW1lJykudmFsKCk7XG4gICAgICAgIGdyb3VwSWNvbiA9IHRoaXMuJGZvcm0uZmluZCgnLmdyb3VwSWNvbicpLnZhbCgpO1xuICAgICAgICBpbnB1dExlbmd0aCA9IHRoaXMuJGZvcm0uZmluZCgnLmdyb3VwTmFtZScpLnZhbCgpLmxlbmd0aDtcbiAgICAgICAgaWYgKGlucHV0TGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5ncm91cC5pZCA/IHRoaXMuZ3JvdXAuaWQgOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hbWU6IGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICBpY29uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBncm91cEljb25cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIENyYWZ0LnBvc3RBY3Rpb25SZXF1ZXN0KCdmb3JtQnVpbGRlci9ncm91cC9zYXZlJywgZGF0YSwgJC5wcm94eSgoZnVuY3Rpb24ocmVzcG9uc2UsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JzO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gQ3JhZnQuZ2V0VXJsKCdmb3JtYnVpbGRlci9mb3JtcycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdGhpcy5mbGF0dGVuRXJyb3JzKHJlc3BvbnNlLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChgJHtDcmFmdC50KCdDb3VsZCBub3QgY3JlYXRlIHRoZSBncm91cDonKX1cXG5cXG4ke2Vycm9ycy5qb2luKCdcXG4nKX1gKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENyYWZ0LmNwLmRpc3BsYXlFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksIHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmbGF0dGVuRXJyb3JzKHJlc3BvbnNlRXJyb3JzKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGU7XG4gICAgICAgIGxldCBlcnJvcnM7XG4gICAgICAgIGVycm9ycyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yIChhdHRyaWJ1dGUgaW4gcmVzcG9uc2VFcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQocmVzcG9uc2VFcnJvcnNbYXR0cmlidXRlXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbn0pO1xuICBcbkdhcm5pc2guJGRvYy5yZWFkeSgoKSA9PiB7XG4gICAgbGV0IEZvcm1Hcm91cHM7XG4gICAgRm9ybUdyb3VwcyA9IG5ldyBHcm91cHM7XG4gICAgJC5lYWNoKCQoJy5ncm91cC1pdGVtJyksIChpLCBpdGVtKSA9PiBuZXcgR3JvdXBJdGVtKGl0ZW0pKTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RldmVsb3BtZW50L2pzL2dyb3Vwcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=