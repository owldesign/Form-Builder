<?php
namespace Craft;

class FormBuilder_FormRecord extends BaseRecord
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc BaseRecord::getTableName()
     *
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_forms';
    }

    /**
     * @inheritDoc BaseRecord::defineRelations()
     *
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'element'       => array(static::BELONGS_TO, 'ElementRecord', 'id', 'required' => true, 'onDelete' => static::CASCADE),
            'fieldLayout'   => array(static::BELONGS_TO, 'FieldLayoutRecord', 'onDelete' => static::SET_NULL),
            'group'         => array(static::BELONGS_TO, 'FormBuilder_GroupRecord', 'required' => true, 'onDelete' => static::CASCADE),
            'status'        => array(static::BELONGS_TO, 'FormBuilder_FormStatusRecord', 'onDelete' => static::SET_NULL)
        );
    }

    /**
     * Define validation rules
     *
     * @return array
     */
    public function rules()
    {
        return array(
            array('name,handle', 'required'),
            array('name,handle', 'unique', 'on' => 'insert'),
            array('handle', 'Craft\HandleValidator')
        );
    }


    // Protected Methods
    // =========================================================================

    /**
     * Define attributes
     *
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'name'            => array(AttributeType::Name, 'required' => true),
            'handle'          => array(AttributeType::Handle, 'required' => true),
            'options'         => AttributeType::Mixed,
            'spam'            => AttributeType::Mixed,
            'notifications'   => AttributeType::Mixed,
            'settings'        => AttributeType::Mixed
        );
    }
}