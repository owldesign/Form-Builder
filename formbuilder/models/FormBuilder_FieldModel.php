<?php
namespace Craft;

class FormBuilder_FieldModel extends BaseComponentModel
{

    // Public Properties
    // =========================================================================

    public $id;
    public $fieldId;
    public $fieldLayoutId;
    public $options;
    public $formId;

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'id'                => AttributeType::Number,
            'fieldId'           => AttributeType::Number,
            'fieldLayoutId'     => AttributeType::Number,
            'options'          => AttributeType::Mixed,
            'formId'            => AttributeType::Number
        );
    }
}