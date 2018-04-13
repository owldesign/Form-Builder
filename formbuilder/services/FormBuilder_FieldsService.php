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
        $fields = $this->_getAllFieldOptions();
        $output = [];

        foreach ($fields as $field) {
            $output[$field->attributes['id']] = array(
                'fieldLayoutId' => $field->attributes['fieldLayoutId'],
                'fieldId' => $field->attributes['fieldId'],
                'options' => $field->attributes['options']
            );
        }

        return $output;
    }

    /**
     * Get field record by field ID
     *
     * @param $fieldId
     * @param null $formId
     * @return static
     */
    public function getFieldRecordByFieldId($fieldId, $formId = null)
    {
        $fieldRecord = FormBuilder_FieldRecord::model()->findByAttributes(array(
            'fieldId' => $fieldId,
            'formId' => $formId
        ));

        return $fieldRecord;
    }

    /**
     * Save field options
     *
     * @param FormBuilder_FieldModel $field
     * @return bool
     * @throws \Throwable
     */
    public function save(FormBuilder_FieldModel $field)
    {
        $fieldRecord = FormBuilder()->fields->getFieldRecordByFieldId($field->fieldId);

        if (!$fieldRecord) {
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

    /**
     * Get all field options
     * @return static[]
     */
    private function _getAllFieldOptions()
    {
        $query = FormBuilder_FieldRecord::model()->findAll();
        $fields = FormBuilder_FieldModel::populateModels($query);

        return $fields;
    }
}