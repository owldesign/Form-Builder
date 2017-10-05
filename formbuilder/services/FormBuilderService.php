<?php
namespace Craft;


class FormBuilderService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================

    public $forms;
    public $groups;
    public $entries;
    public $templates;
    public $fields;
    public $fieldsets;

    // Public Methods
    // =========================================================================

    public function init()
    {
        parent::init();

        $this->forms            = Craft::app()->getComponent('formBuilder_form');
        $this->groups           = Craft::app()->getComponent('formBuilder_group');
        $this->entries          = Craft::app()->getComponent('formBuilder_entry');
        $this->templates        = Craft::app()->getComponent('emailNotifications_template');
        $this->fields           = Craft::app()->getComponent('formBuilder_field');
        $this->fieldsets        = Craft::app()->getComponent('formBuilder_fieldset');
    }


    // Private Methods
    // =========================================================================

}