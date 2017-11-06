<?php
namespace Craft;


class FormBuilder_EntryModel extends BaseElementModel
{
    // Properties
    // =========================================================================

    protected $elementType = 'FormBuilder_Entry';

    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc BaseElementModel::getFieldLayout()
     *
     * @return FieldLayoutModel|null
     */
    public function getFieldLayout()
    {
        return $this->getForm()->getFieldLayout();
    }

    /**
     * Returns the content title for this entry
     *
     * @return mixed|string
     */
    public function getTitle()
    {
        return $this->getContent()->title;
    }

    /**
     * Returns whether the current user can edit the element.
     *
     * @return bool
     */
    public function isEditable()
    {
        return true;
    }

    /**
     * @inheritDoc BaseElementModel::getCpEditUrl()
     *
     * @return string
     */
    public function getCpEditUrl()
    {
        return UrlHelper::getCpUrl('formbuilder/entries/edit/' . $this->id);
    }

    /**
     * @inheritDoc BaseElementModel::getCpEditUrl()
     *
     * @return string
     */
    public function getUrl()
    {
        return UrlHelper::getCpUrl('formbuilder/entries/edit/' . $this->id);
    }

    /**
     * Get current entry's form
     *
     * @return mixed
     */
    public function getForm()
    {
        if (!isset($this->form)) {
            $this->form = formbuilder()->forms->getFormById($this->formId);
        }
        return $this->form;
    }

    /**
     * Get status
     *
     * @return mixed
     */
    public function getStatus()
    {
        $statusId = $this->statusId;
        $status = formbuilder()->entries->getStatusById($statusId);

        return $status->color;
    }

    /**
     * Get status model
     *
     * @return mixed
     */
    public function getStatusModel()
    {
        $statusId = $this->statusId;
        $status = formbuilder()->entries->getStatusById($statusId);

        return $status;
    }

    /**
     * Get form details
     *
     * @return $this
     */
    public function getFormDetails()
    {
        $form = formbuilder()->forms->getFormRecordById($this->formId);
        $markup = '<code>' . $form->name . '</code>';
        $this->__set('formId', $markup);

        return $this;
    }

    /**
     * Get current time stamp
     *
     * @return int
     */
    public function date()
    {
        return DateTimeHelper::currentTimeStamp();
    }

    /**
     * Return entry URL
     *
     * @return $this
     */
    public function entryUrl()
    {
        $url = UrlHelper::getUrl('formbuilder/entries/edit/' . $this->id);
        $link = '<a href="'.$url.'" class="view-submission">'.Craft::t('View Submission').'</a>';

        $this->__set('submission', $link);

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
            'id'              => AttributeType::Number,
            'form'            => AttributeType::Mixed,
            'formId'          => AttributeType::Number,
            'statusId'        => AttributeType::Number,
            'title'           => AttributeType::String,
            'dateSubmitted'   => AttributeType::DateTime,
            'ipAddress'       => AttributeType::String,
            'userAgent'       => AttributeType::Mixed
        ));
    }
}