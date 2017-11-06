<?php
namespace Craft;

class FormBuilder_FormModel extends BaseElementModel
{
    // Properties
    // =========================================================================

    /**
     * @var string
     */
    protected $elementType = 'FormBuilder_Form';

    public $totalEntries;

    /**
     * Name to string
     *
     * @return string
     */
    function __toString()
    {
        return Craft::t($this->name);
    }

    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc BaseElementModel::getFieldLayout()
     *
     * @return FieldLayoutModel|null
     */
    public function getFieldLayout()
    {
        return $this->asa('fieldLayout')->getFieldLayout();
    }

    /**
     * @return array
     */
    public function behaviors()
    {
        return array(
            'fieldLayout' => new FieldLayoutBehavior($this->elementType)
        );
    }

    /**
     * Returns the element's CP edit URL.
     *
     * @return string|false
     */
    public function getCpEditUrl()
    {
        $url = UrlHelper::getCpUrl('formbuilder/forms/edit/' . $this->id);

        return $url;
    }

    /**
     * Returns the forms's group.
     *
     * @return UserGroupModel
     */
    public function getGroup()
    {
        return formbuilder()->forms->getFormGroupById($this->groupId);
    }

    /**
     * Get status
     *
     * @return mixed
     */
    public function getStatus()
    {
        $statusId = $this->statusId;
        $status = formbuilder()->forms->getStatusById($statusId);

        return $status->color;
    }

    /**
     * Get entry status
     *
     * @return $this
     */
    public function getEntryStatus()
    {
        $status = formbuilder()->forms->getStatusById($this->statusId);
        $url = UrlHelper::getUrl('formbuilder/forms/edit/' . $this->id);
        $markup = '<a href="' . $url . '">' . $status->name . '</a>';
        $this->__set('statusId', $markup);

        return $this;
    }

    // Protected Methods
    // =========================================================================

    /**
     * @inheritDoc BaseModel::defineAttributes()
     *
     * @return array
     */
    protected function defineAttributes()
    {
        return array_merge(parent::defineAttributes(), array(
            'id'                => AttributeType::Number,
            'name'              => array(AttributeType::Name, 'required' => true),
            'handle'            => array(AttributeType::Handle, 'required' => true),
            'groupId'           => AttributeType::Number,
            'fieldLayoutId'     => AttributeType::Number,
            'statusId'          => AttributeType::Number,
            'options'           => AttributeType::Mixed,
            'spam'              => AttributeType::Mixed,
            'notifications'     => AttributeType::Mixed,
            'settings'          => AttributeType::Mixed,
            'twig'              => AttributeType::Mixed
        ));
    }
}