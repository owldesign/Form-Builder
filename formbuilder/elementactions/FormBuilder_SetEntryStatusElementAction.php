<?php
namespace Craft;

class FormBuilder_SetEntryStatusElementAction extends BaseElementAction
{
    // Public Methods
    // =========================================================================

    /**
     * @return string
     */
    public function getTriggerHtml()
    {
        return craft()->templates->render('formbuilder/_includes/elementactions/_setStatus');
    }

    /**
     * @inheritDoc IComponentType::getName()
     *
     * @return string
     */
    public function getName()
    {
        return Craft::t('Mark As Unread');
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
        $status = $this->getParams()->status;

        $elementIds = $criteria->ids();

        craft()->db->createCommand()->update(
            'formbuilder_entries',
            ['statusId' => $status],
            ['in', 'id', $elementIds]
        );

        craft()->templateCache->deleteCachesByElementId($elementIds);

        // TODO: Use this for events template
//        Craft::import('plugins.formbuilder.events.FormBuilder_OnSetEntryStatusEvent');
//
//        $event = new FormBuilder_OnSetEntryStatusEvent(
//            $this, [
//                'criteria'   => $criteria,
//                'elementIds' => $elementIds,
//                'status'     => $status,
//            ]
//        );
//
//        formbuilder()->events->onSetEntryStatus($event);

        $this->setMessage(Craft::t('Status updated.'));

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
            'status'                => AttributeType::Number,
            'confirmationMessage'   => array(AttributeType::String),
            'successMessage'        => array(AttributeType::String),
        );
    }
}