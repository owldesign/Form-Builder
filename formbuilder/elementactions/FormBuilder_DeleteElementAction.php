<?php
namespace Craft;

class FormBuilder_DeleteElementAction extends BaseElementAction
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritDoc IComponentType::getName()
     *
     * @return string
     */
    public function getName()
    {
        return Craft::t('Delete…');
    }

    /**
     * @inheritDoc IElementAction::isDestructive()
     *
     * @return bool
     */
    public function isDestructive()
    {
        return true;
    }

    /**
     * @inheritDoc IElementAction::getConfirmationMessage()
     *
     * @return string|null
     */
    public function getConfirmationMessage()
    {
        return $this->getParams()->confirmationMessage;
    }

    /**
     * @inheritDoc IElementAction::performAction()
     *
     * @param ElementCriteriaModel $criteria
     *
     * @return bool
     */
    public function performAction(ElementCriteriaModel $criteria)
    {
        $entryType = $criteria->elementType->classHandle;

        if ($entryType == 'FormBuilder_Form') {
            if (formbuilder()->forms->deleteForms($criteria->ids())) {
                return true;
            }
        } else {
            craft()->elements->deleteElementById($criteria->ids());
        }

        return true;
    }

    // Protected Methods
    // =========================================================================

    /**
     * @inheritDoc BaseElementAction::defineParams()
     *
     * @return array
     */
    protected function defineParams()
    {
        return array(
            'confirmationMessage'   => array(AttributeType::String),
            'successMessage'        => array(AttributeType::String),
            'failMessage'           => array(AttributeType::String)
        );
    }
}