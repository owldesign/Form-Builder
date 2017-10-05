<?php
namespace Craft;


class FormBuilder_EntryRecord extends BaseRecord
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
        return 'formbuilder_entries';
    }

    /**
     * @inheritDoc BaseRecord::defineRelations()
     *
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'element'   => array(static::BELONGS_TO, 'ElementRecord', 'id', 'required' => true, 'onDelete' => static::CASCADE),
            'form'      => array(static::BELONGS_TO, 'FormBuilder_FormRecord', 'required' => true, 'onDelete' => static::CASCADE),
            'status'    => array(static::BELONGS_TO, 'FormBuilder_EntryStatusRecord', 'onDelete' => static::SET_NULL)
        );
    }

    // Protected Methods
    // =========================================================================

    /**
     * Define attributes
     *
     * @return array
     */
    public function defineAttributes()
    {
        return array(
            'title'         => AttributeType::String,
            'options'       => AttributeType::Mixed,
            'ipAddress'     => AttributeType::String,
            'userAgent'     => AttributeType::Mixed
        );
    }


}