<?php
namespace Craft;

class FormBuilder_FieldsService extends BaseApplicationComponent
{
    // Public Methods
    // =========================================================================

    /**
     * Get all fields
     *
     * @return array
     */
    public function getFields()
    {
        $fields = craft()->fields->getAllFields();
        $output = array();

        foreach($fields as $field) {
            $output[(int) $field->id] = array(
                'id'            => (int) $field->id,
                'handle'        => $field->handle,
                'name'          => $field->name,
                'instructions'  => $field->instructions
            );
        }

        return $output;
    }

    /**
     * Get all field options
     *
     * @return array
     */
    public function getAllFieldOptions()
    {
        $field = $this->_getAllFieldOptions();
        $output = [];

        foreach ($field as $field) {
            $output[$field->id] = array(
                'fieldLayoutId' => $field->fieldLayoutId,
                'fieldId' => $field->fieldId,
                'options' => $field->options
            );
        }

        return $output;
    }

    public function getFieldRecordByFieldId($fieldId)
    {
        $fieldRecord = FormBuilder_FieldRecord::model()->findById($fieldId);

        return $fieldRecord;
    }

    public function save(FormBuilder_FieldModel $field)
    {
        $fieldRecord = FormBuilder()->fields->getFieldRecordByFieldId($field->fieldId);

        if ($fieldRecord) {
            if (!$fieldRecord) {
                throw new Exception(Craft::t('No field settings exists with the ID “{id}”.', array('id' => $field->id)));
            }
        } else {
            $fieldRecord = new FormBuilder_FieldRecord();
        }

        $field->validate();

        if ($field->hasErrors()) {
            return false;
        }

        $fieldRecord->fieldId           = $field->fieldId;
        $fieldRecord->fieldLayoutId     = $field->fieldLayoutId;
        $fieldRecord->options           = $field->options;
        $fieldRecord->formId            = $field->formId;

        $transaction = craft()->db->getCurrentTransaction() ? false : craft()->db->beginTransaction();

        try {
            $fieldRecord->save(false);
            $field->id = $fieldRecord->id;

            $transaction->commit();
        } catch (\Throwable $e) {
            $transaction->rollback();

            throw $e;
        }

        return true;
    }

    // Private Methods
    // =========================================================================

    private function _getAllFieldOptions()
    {
        $fields = FormBuilder_FieldRecord::model()->findAll();

        return $fields;
    }
}