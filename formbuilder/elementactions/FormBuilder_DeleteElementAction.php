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

        $response = formbuilder()->forms->deleteForms($criteria->ids());

        if ($response) {
            $this->setMessage(Craft::t('Forms has been deleted.'));
        } else {
            $this->setMessage(Craft::t('Cannot delete forms.'));
        }


        return $response;
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
            'confirmationMessage' => array(AttributeType::String),
            'successMessage'      => array(AttributeType::String),
        );
    }
}