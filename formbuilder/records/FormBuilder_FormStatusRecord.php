<?php
namespace Craft;


class FormBuilder_FormStatusRecord extends BaseRecord
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
        return 'formbuilder_formstatuses';
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
                'values'    => ['green', 'red'],
                'required'  => true,
                'default'   => 'green'
            ],
            'sortOrder'     => [AttributeType::SortOrder],
            'isDefault'     => [AttributeType::Bool, 'default' => 0]
        ];
    }
}