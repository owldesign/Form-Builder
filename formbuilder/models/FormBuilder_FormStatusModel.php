<?php
namespace Craft;


class FormBuilder_FormStatusModel extends BaseModel
{
    // Public Methods
    // =========================================================================

    /**
     * @return string
     */
    public function __toString()
    {
        return (string)$this->name;
    }

    /**
     * @return string
     */
    public function htmlLabel()
    {
        return sprintf('<span class="formbuilder-status-label"><span class="status %s"></span> %s</span>',
            $this->color, $this->name);
    }

    // Protected Methods
    // =========================================================================

    /**
     * @return array
     */
    protected function defineAttributes()
    {
        return [
            'id'        => AttributeType::Number,
            'name'      => [AttributeType::String, 'required' => true],
            'handle'    => [AttributeType::Handle, 'required' => true],
            'color'     => [AttributeType::String, 'default' => 'blue'],
            'sortOrder' => [AttributeType::SortOrder],
            'isDefault' => [AttributeType::Bool, 'default' => 0]
        ];
    }
}
