<?php
namespace Craft;

class FormBuilder_FieldsetModel extends BaseComponentModel
{

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'id'                => AttributeType::Number,
            'tabId'             => AttributeType::Number,
            'fieldLayoutId'     => AttributeType::Number,
            'className'         => AttributeType::String
        );
    }
}