<?php
namespace Craft;


class FormBuilder_FieldService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================


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

    public function getAllInputSettings()
    {
        $fields = $this->_getAllFieldSettings();
        $output = array();

        foreach($fields as $field) {
            $output[$field->id] = array(
                'fieldLayoutId' => $field->fieldLayoutId,
                'fieldId' => $field->fieldId,
                'input' => $field->input
            );
        }

        return $output;
    }

    public function getAllHtmlSettings()
    {
        $fields = $this->_getAllFieldSettings();
        $output = array();

        foreach($fields as $field) {
            $output[$field->id] = array(
                'fieldLayoutId' => $field->fieldLayoutId,
                'fieldId' => $field->fieldId,
                'html' => $field->html
            );
        }

        return $output;
    }

    /**
     * Get all settings
     *
     * @return array
     */
    public function getSettings()
    {
        $fields = $this->_getAllFieldSettings();
        $output = array();

        foreach($fields as $field) {
            $output[$field->id] = array(
                'id'            => (int) $field->id,
                'fieldId'       => (int) $field->fieldId,
                'fieldLayoutId' => (int) $field->fieldLayoutId,
                'input'         => $field->input,
                'html'          => $field->html
            );
        }

        return $output;
    }

    /**
     * Get field's settings by its ID
     *
     * @param $fieldId
     * @param $fieldLayoutId
     * @return BaseModel
     */
    public function getFieldSettingsByFieldId($fieldId, $fieldLayoutId)
    {
        $record = FormBuilder_FieldRecord::model()->findByAttributes(array(
            'fieldId' => $fieldId,
            'fieldLayoutId' => $fieldLayoutId
        ));

        $result = FormBuilder_FieldModel::populateModel($record);

        return $result;
    }

    /**
     * Save field settings
     *
     * @param FormBuilder_FieldModel $settings
     * @return bool
     * @throws Exception
     * @throws \Exception
     */
    public function save(FormBuilder_FieldModel $settings)
    {
        $isExisting = false;
        $record = null;

        if (is_int($settings->id)) {
            $record = FormBuilder_FieldRecord::model()->findById($settings->id);

            if ($record) {
                $isExisting = true;
            } else {
                throw new Exception(Craft::t('No field settings exists with the ID “{id}”.', array('id' => $settings->id)));
            }
        } else {
            $record = FormBuilder_FieldRecord::model()->findByAttributes(array(
                'fieldId' => $settings->fieldId,
                'fieldLayoutId' => $settings->fieldLayoutId
            ));

            if ($record) {
                $isExisting = true;
            } else {
                $record = new FormBuilder_FieldRecord();
            }
        }

        $field = craft()->fields->getFieldById($settings->fieldId);
        $layout = craft()->fields->getLayoutById($settings->fieldLayoutId);

        if (!$field) {
            throw new Exception(Craft::t('No field exists with the ID “{id}”.', array('id' => $settings->fieldId)));
        }

        if (!$layout) {
            throw new Exception(Craft::t('No fieldlayout exists with the ID “{id}”.', array('id' => $settings->fieldLayoutId)));
        }

        $record->fieldId            = $settings->fieldId;
        $record->fieldLayoutId      = $settings->fieldLayoutId;
        $record->input              = $settings->input;
        $record->html               = $settings->html;

        $record->validate();
        $settings->addErrors($record->getErrors());

        $success = !$settings->hasErrors();

        if ($success) {
            $transaction = craft()->db->getCurrentTransaction() ? false : craft()->db->beginTransaction();

            try {
                $record->save(false);
                $settings->id = $record->id;

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

    /**
     * Get all field settings
     *
     * @return array
     */
    private function _getAllFieldSettings()
    {
        $records = FormBuilder_FieldRecord::model()->findAll();
        $result = FormBuilder_FieldModel::populateModels($records);

        return $result;
    }

}