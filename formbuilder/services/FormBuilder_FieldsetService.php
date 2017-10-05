<?php
namespace Craft;


class FormBuilder_FieldsetService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================


    // Public Methods
    // =========================================================================

    /**
     * Save fieldset settings
     *
     * @param FormBuilder_FieldsetModel $fieldset
     * @return bool
     * @throws Exception
     * @throws \Exception
     */
    public function saveSettings(FormBuilder_FieldsetModel $fieldset)
    {
        $isExisting = false;
        $record = null;

        if (is_int($fieldset->id)) {
            $record = FormBuilder_FieldsetRecord::model()->findById($fieldset->id);

            if ($record) {
                $isExisting = true;
            } else {
                throw new Exception(Craft::t('No fieldset exists with the ID “{id}”.', array('id' => $fieldset->id)));
            }
        } else {
            $record = FormBuilder_FieldsetRecord::model()->findByAttributes(array(
                'tabId' => $fieldset->tabId,
                'fieldLayoutId' => $fieldset->fieldLayoutId
            ));

            if ($record) {
                $isExisting = true;
            } else {
                $record = new FormBuilder_FieldsetRecord();
            }
        }

        $tab = $this->_getFieldTabById($fieldset->tabId);
        $layout = craft()->fields->getLayoutById($fieldset->fieldLayoutId);

        if (!$tab) {
            throw new Exception(Craft::t('No tab exists with the ID “{id}”.', array('id' => $fieldset->tabId)));
        }

        if (!$layout) {
            throw new Exception(Craft::t('No field layout exists with the ID “{id}”.', array('id' => $fieldset->fieldLayoutId)));
        }

        $record->tabId              = $fieldset->tabId;
        $record->fieldLayoutId      = $fieldset->fieldLayoutId;
        $record->className          = $fieldset->className;

        $record->validate();
        $fieldset->addErrors($record->getErrors());

        $success = !$fieldset->hasErrors();

        if ($success) {
            $transaction = craft()->db->getCurrentTransaction() ? false : craft()->db->beginTransaction();

            try {
                $record->save(false);
                $fieldset->id = $record->id;

                if($transaction) {
                    $transaction->commit();
                }
            } catch (\Exception $e) {
                if($transaction) {
                    $transaction->rollback();
                }

                throw $e;
            }
        }

        return $success;
    }

    // Private Methods
    // =========================================================================

    private function _getFieldTabById($tabId)
    {
        $tab = craft()->db->createCommand()
            ->select('*')
            ->from('fieldlayouttabs')
            ->where(array('id' => $tabId))
            ->queryRow();

        return FieldLayoutTabModel::populateModels($tab);
    }
}