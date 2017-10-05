<?php
namespace Craft;

class FormBuilder_FieldModel extends BaseComponentModel
{

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
            'settings'          => AttributeType::Mixed,
            'input'             => AttributeType::Mixed,
            'html'              => AttributeType::Mixed,
            'template'          => AttributeType::String
        );
    }
}