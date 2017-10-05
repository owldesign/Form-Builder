<?php
namespace Craft;

class FormBuilder_GroupModel extends BaseElementModel
{
    /**
     * @return mixed
     */
    function __toString()
    {
        return Craft::t($this->name);
    }

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'id'        => AttributeType::Number,
            'name'      => AttributeType::String,
            'settings'  => AttributeType::Mixed
        );
    }

    /**
     * @return mixed
     */
    public function getForms()
    {
        return formbuilder()->forms->getFormsByGroupId($this->id);
    }
}