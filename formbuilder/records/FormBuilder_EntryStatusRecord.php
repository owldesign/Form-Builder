<?php
namespace Craft;


class FormBuilder_EntryStatusRecord extends BaseRecord
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
        return 'formbuilder_entrystatuses';
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
        return [
            'name'          => [AttributeType::String, 'required' => true],
            'handle'        => [AttributeType::Handle, 'required' => true],
            'color'         => [AttributeType::Enum,
                'values'    => ['green', 'blue', 'black'],
                'required'  => true,
                'default'   => 'blue'
            ],
            'sortOrder'     => [AttributeType::SortOrder],
            'isDefault'     => [AttributeType::Bool, 'default' => 0]
        ];
    }
}