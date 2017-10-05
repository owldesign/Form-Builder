<?php
namespace Craft;


class FormBuilder_GroupRecord extends BaseRecord
{
    /**
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_groups';
    }


    /**
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'formbuilder_forms' => array(static::HAS_MANY, 'FormBuilder_FormRecord', 'id'),
        );
    }

    /**
     * @return array
     */
    public function defineIndexes()
    {
        return array(
            array('columns' => array('name'), 'unique' => true)
        );
    }

    /**
     * @return array
     */
    public function scopes()
    {
        return array(
            'ordered' => array('order' => 'id'),
        );
    }

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'name'      => array(AttributeType::Name, 'required' => true),
            'settings'  => AttributeType::Mixed
        );
    }
}