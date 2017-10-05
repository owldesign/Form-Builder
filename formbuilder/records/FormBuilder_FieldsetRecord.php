<?php
namespace Craft;


class FormBuilder_FieldsetRecord extends BaseRecord
{
    /**
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_fieldsets';
    }

    /**
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'tab' => array(static::BELONGS_TO, 'FieldLayoutTabRecord', 'onDelete' => static::CASCADE),
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
            'className' => array(AttributeType::Name, 'required' => true)
        );
    }
}