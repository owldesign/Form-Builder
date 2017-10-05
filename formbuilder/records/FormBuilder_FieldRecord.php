<?php
namespace Craft;


class FormBuilder_FieldRecord extends BaseRecord
{
    /**
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_fields';
    }

    /**
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'field'       => array(static::BELONGS_TO, 'FieldRecord',       'onDelete' => static::CASCADE),
            'fieldLayout' => array(static::BELONGS_TO, 'FieldLayoutRecord', 'onDelete' => static::CASCADE)
        );
    }

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'settings'  => AttributeType::Mixed,
            'input'     => AttributeType::Mixed,
            'html'      => AttributeType::Mixed,
            'template'  => AttributeType::String
        );
    }
}