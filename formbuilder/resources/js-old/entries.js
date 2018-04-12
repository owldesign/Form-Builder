if ($ && window.Garnish) {
  Craft.FileUploadsIndex = Garnish.Base.extend({
    $container: $('.upload-details'),
    elementIndex: null,
    init: function(elementIndex, container, settings) {
      var $elements;
      this.elementIndex = elementIndex;
      this.$container = $(container);
      this.setSettings(settings, Craft.BaseElementIndexView.defaults);
      this.$loadingMoreSpinner = $('<div class="centeralign hidden">' + '<div class="spinner loadingmore"></div>' + '</div>').insertAfter(this.$container);
      this.$elementContainer = this.getElementContainer();
      $elements = this.$elementContainer.children();
      if (this.settings.context === 'index') {
        return this.addListener(this.$elementContainer, 'dblclick', function(ev) {
          var $element;
          var $element, $target;
          $target = $(ev.target);
          if ($target.hasClass('element')) {
            $element = $target;
          } else {
            $element = $target.closest('.element');
          }
          if ($element.length) {
            return this.createElementEditor($element);
          }
        });
      }
    },
    getElementContainer: function() {
      this.$table = this.$container.find('table:first');
      return this.$table.children('tbody:first');
    },
    createElementEditor: function($element) {
      return new Craft.ElementEditor($element, {
        onSaveElement: $.proxy((function(response) {
          return Craft.cp.displayNotice(Craft.t('Asset updated'));
        }), this)
      });
    }
  });
  Garnish.$doc.ready(function() {
    if (Craft.elementIndex) {
      Craft.elementIndex.on('updateElements', function(e) {
        var elementsCount, selectedSource, unreadItems;
        Craft.postActionRequest('formBuilder/entry/getUnreadEntries', $.proxy((function(response, textStatus) {
          if (response.success) {
            window.FormBuilder.unreadCount = response.count;
            if (response.count > 0) {
              return $('.total-entry-count').html(response.count);
            } else {
              return $('.total-entry-count').html('');
            }
          }
        }), this));
        selectedSource = e.target.instanceState.selectedSource;
        elementsCount = e.target.view.elementSelect.$items.length;
        unreadItems = $.grep(e.target.view.elementSelect.$items, function(elem) {
          var status;
          status = $(elem).find('.element').data('status');
          return status === 'blue';
        }).length;
        if (unreadItems !== 0) {
          $('a[data-key="' + selectedSource + '"]').find('.entry-count').html(unreadItems);
        } else {
          $('a[data-key="' + selectedSource + '"]').find('.entry-count').html('');
        }
        if (elementsCount === 0) {
          return e.target.view.elementSelect.$container.html($('<tr><td colspan="6">' + Craft.t("No entries available") + '</td></tr>'));
        }
      });
    }
    return $('.submission-action-trigger').on('click', function(e) {
      var $menu, entryId, fileIds, formId, type;
      e.preventDefault();
      type = $(this).data('type');
      formId = $(this).data('form-id');
      entryId = $(this).data('entry-id');
      fileIds = $(this).data('file-ids');
      $menu = $('<div class="tout-dropdown"/>').html('<ul class="form-item-menu">' + '</ul>');
      if (type === 'submission') {
        $('<li><a href="#" class="delete-submission">Delete Submission</a></li>').appendTo($menu.find('ul'));
      } else if (type === 'form') {
        $('<li><a href="' + window.FormBuilder.adminUrl + '/forms/edit/' + formId + '">View Form</a></li>').appendTo($menu.find('ul'));
      } else if (type === 'uploads') {
        $('<li><a href="' + window.FormBuilder.adminUrl + '/entries" class="delete-all-files">Delete All</a></li>').appendTo($menu.find('ul'));
        $('<li><a href="' + window.FormBuilder.adminUrl + '/entries" class="download-all-files">Download All</a></li>').appendTo($menu.find('ul'));
      }
      new Garnish.HUD($(this), $menu, {
        hudClass: 'hud fb-hud submissionhud',
        closeOtherHUDs: false
      });
      $menu.find('.delete-submission').on('click', function(e) {
        var data;
        e.preventDefault();
        data = {
          id: entryId
        };
        if (confirm(Craft.t("Are you sure you want to delete this entry?"))) {
          return Craft.postActionRequest('formBuilder/entry/delete', data, $.proxy((function(response, textStatus) {
            if (textStatus === 'success') {
              Craft.cp.displayNotice(Craft.t('Entry deleted'));
              return window.location.href = window.FormBuilder.adminUrl + '/entries';
            }
          }), this));
        }
      });
      $menu.find('.delete-all-files').on('click', function(e) {
        var data;
        e.preventDefault();
        data = {
          fileId: fileIds
        };
        if (confirm(Craft.t("Are you sure you want to delete all files?"))) {
          return Craft.postActionRequest('assets/deleteFile', data, $.proxy((function(response, textStatus) {
            var hudID;
            if (response.success) {
              for (hudID in Garnish.HUD.activeHUDs) {
                Garnish.HUD.activeHUDs[hudID].hide();
              }
              $('.upload-details').parent().velocity('fadeOut', {
                duration: '100'
              });
              return setTimeout((function() {
                return $('.upload-details').parent().remove();
              }), 100);
            }
          }), this));
        }
      });
      return $menu.find('.download-all-files').on('click', function(e) {
        var data;
        e.preventDefault();
        Craft.cp.displayNotice(Craft.t('Downloading...'));
        data = {
          ids: fileIds,
          formId: formId
        };
        return Craft.postActionRequest('formBuilder/entry/downloadAllFiles', data, $.proxy((function(response, textStatus) {
          var hudID, results;
          if (response.success) {
            window.location = '/actions/formBuilder/entry/downloadFiles?filePath=' + response.filePath;
            Craft.cp.displayNotice(Craft.t('Download Successful'));
          } else {
            Craft.cp.displayError(Craft.t(response.message));
          }
          results = [];
          for (hudID in Garnish.HUD.activeHUDs) {
            results.push(Garnish.HUD.activeHUDs[hudID].hide());
          }
          return results;
        }), this));
      });
    });
  });
}
