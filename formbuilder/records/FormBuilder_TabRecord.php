<?php
namespace Craft;


class FormBuilder_TabRecord extends BaseRecord
{
    /**
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_tabs';
    }

    /**
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'form'              => array(static::BELONGS_TO, 'FormBuilder_FormRecord', 'required' => true, 'onDelete' => static::CASCADE),
            'fieldLayout'       => array(static::BELONGS_TO, 'FieldLayoutRecord', 'onDelete' => static::CASCADE),
            'fieldLayoutTab'    => array(static::BELONGS_TO, 'FieldLayoutTabRecord', 'onDelete' => static::CASCADE)
        );
    }

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'name'  => AttributeType::String,
            'tabId'  => AttributeType::String,
            'layoutId'  => AttributeType::Number,
            'formId'  => AttributeType::Number,
            'options'  => AttributeType::Mixed
        );
    }
}