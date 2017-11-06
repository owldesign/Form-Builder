<?php
namespace Craft;

class FormBuilder_FormService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================

    private $_formsById;
    private $_allFormIds;
    private $_fetchedAllForms = false;
    private $_groupsById;

    // Public Methods
    // =========================================================================

    /**
     * @param array $attributes
     * @return ElementCriteriaModel
     */
    public function getCriteria(array $attributes = array())
    {
        return craft()->elements->getCriteria('FormBuilder_Form', $attributes);
    }

    /**
     * Get all forms
     *
     * @return array
     */
    public function getAllForms()
    {
        $attributes = array('order' => 'name');

        return $this->getCriteria($attributes)->find();
    }

    /**
     * Get form group by id
     *
     * @param $groupId
     * @return mixed
     */
    public function getFormGroupById($groupId)
    {
        if (!isset($this->_groupsById) || !array_key_exists($groupId, $this->_groupsById)) {
            $result = $this->_createGroupQuery()
                ->where('id = :id', array(':id' => $groupId))
                ->queryRow();

            if ($result) {
                $group = new FormBuilder_GroupModel($result);
            } else {
                $group = null;
            }

            $this->_groupsById[$groupId] = $group;
        }

        return $this->_groupsById[$groupId];
    }

    /**
     * Get forms by group id
     *
     * @param $groupId
     * @param null $indexBy
     * @return array
     */
    public function getFormsByGroupId($groupId, $indexBy = null)
    {
        $results = $this->_createFormQuery()
            ->where('f.groupId = :groupId', array(':groupId' => $groupId))
            ->queryAll();

        $forms = array();

        foreach ($results as $result) {
            $form =  new FormBuilder_FormModel($result);

            if ($indexBy) {
                $forms[$form->$indexBy] = $form;
            } else {
                $forms[] = $form;
            }
        }

        return $forms;
    }

    /**
     * Get form by id
     *
     * @param $formId
     * @return BaseElementModel|null
     */
    public function getFormById($formId)
    {
        return $this->getCriteria(array('limit' => 1, 'id' => $formId))->first();
    }

    /**
     * Get form record by id
     *
     * @param $formId
     * @return mixed
     */
    public function getFormRecordById($formId)
    {
        if (!isset($this->_formsById) || !array_key_exists($formId, $this->_formsById)) {
            $formRecord = FormBuilder_FormRecord::model()->findById($formId);

            if ($formRecord) {
                $this->_formsById[$formId] = FormBuilder_FormModel::populateModel($formRecord);
            } else {
                $this->_formsById[$formId] = null;
            }
        }

        return $this->_formsById[$formId];
    }

    public function getFormByHandle($handle)
    {
        return $this->getCriteria(array('limit' => 1, 'handle' => $handle))->first();
    }

    /**
     * Save Form
     *
     * @param FormBuilder_FormModel $form
     * @return bool
     * @throws Exception
     * @throws \Exception
     */
    public function save(FormBuilder_FormModel $form)
    {
        if ($form->id) {
            $formRecord = FormBuilder_FormRecord::model()->findById($form->id);

            if (!$formRecord) {
                throw new Exception(Craft::t('No form exists with the ID “{id}”', array('id' => $form->id)));
            }

            $oldForm = FormBuilder_FormModel::populateModel($formRecord);
            $isNewForm = false;
        } else {
            $formRecord = new FormBuilder_FormRecord();
            $isNewForm = true;
        }

        $formRecord->name               = $form->name;
        $formRecord->handle             = $form->handle;
        $formRecord->statusId           = $form->statusId;
        $formRecord->groupId            = $form->groupId;
        $formRecord->fieldLayoutId      = $form->fieldLayoutId;
        $formRecord->options            = JsonHelper::encode($form->options);
        $formRecord->spam               = JsonHelper::encode($form->spam);
        $formRecord->notifications      = JsonHelper::encode($form->notifications);
        $formRecord->settings           = JsonHelper::encode($form->settings);

        $attributes     = $form->getAttributes();
        $options        = $attributes['options'];
        $spam           = $attributes['spam'];
        $notifications  = $attributes['notifications'];
        $settings       = $attributes['settings'];

        $formRecord->validate();
        $form->addErrors($formRecord->getErrors());

        if (!$form->hasErrors()) {
            $transaction = craft()->db->getCurrentTransaction() === null ? craft()->db->beginTransaction() : null;

            try {
                if (!$isNewForm && $oldForm->fieldLayoutId) {
                    craft()->fields->deleteLayoutById($oldForm->fieldLayoutId);
                }

                $fieldLayout = $form->getFieldLayout();
                craft()->fields->saveLayout($fieldLayout);

                $form->fieldLayoutId = $fieldLayout->id;
                $formRecord->fieldLayoutId = $fieldLayout->id;

                if (craft()->elements->saveElement($form)){
                    if ($isNewForm){
                        $formRecord->id = $form->id;
                    }

                    $formRecord->save();

                    if (!$form->id) {
                        $form->id = $formRecord->id;
                    }

                    $this->_formsById[$form->id] = $form;

                    if ($transaction !== null) {
                        $transaction->commit();
                    }

                    return true;
                }

            } catch (\Exception $e) {
                if ($transaction !== null) {
                    $transaction->rollback();
                }

                throw $e;
            }

            return true;

        } else {
            return false;

        }
    }

    /**
     * Delete form
     *
     * @param FormBuilder_FormModel $form
     * @return bool
     * @throws \Exception
     */
    public function delete(FormBuilder_FormModel $form)
    {
        $transaction = craft()->db->getCurrentTransaction() === null ? craft()->db->beginTransaction() : null;
        try {

            craft()->fields->deleteLayoutById($form->fieldLayoutId);

            craft()->elements->deleteElementById($form->id);

            if ($transaction !== null) {
                $transaction->commit();
            }

            return true;
        } catch (\Exception $e) {
            if ($transaction !== null) {
                $transaction->rollback();
            }

            throw $e;
        }
    }

    /**
     * Delete forms
     *
     * @param $ids
     * @return bool
     */
    public function deleteForms($ids)
    {
        foreach ($ids as $key => $id) {
            $form = formbuilder()->forms->getFormById($id);

            if ($form) {
                formbuilder()->forms->delete($form);
            } else {
                FormBuilderPlugin::log("Can't delete form with id: ".$id);
            }
        }

        return true;
    }

    /**
     * Get all statuses
     *
     * @return array
     */
    public function getAllStatuses()
    {
        $statuses = craft()->db->createCommand()
            ->select('*')
            ->from('formbuilder_formstatuses')
            ->order('sortOrder asc')
            ->queryAll();

        return FormBuilder_FormStatusModel::populateModels($statuses);
    }

    public function getStatusById($id)
    {
        $status = craft()->db->createCommand()
            ->select('*')
            ->from('formbuilder_formstatuses')
            ->where('id=:id', [':id' => $id])
            ->queryRow();

        return $status != null ? FormBuilder_FormStatusModel::populateModel($status) : null;
    }

    /**
     * Get status by color
     *
     * @param $color
     * @return BaseModel|null
     */
    public function getStatusByColor($color)
    {
        $status = craft()->db->createCommand()
            ->select('*')
            ->from('formbuilder_formstatuses')
            ->where('color=:color', [':color' => $color])
            ->queryRow();

        return $status != null ? FormBuilder_FormStatusModel::populateModel($status) : null;
    }

    /**
     * Install default statuses
     */
    public function installDefaultStatuses()
    {
        $defaultStatuses = [
            0 => [
                'name'      => 'Enabled',
                'handle'    => 'enabled',
                'color'     => 'green',
                'sortOrder' => 1,
                'isDefault' => 0
            ],
            1 => [
                'name'      => 'Disabled',
                'handle'    => 'disabled',
                'color'     => 'red',
                'sortOrder' => 2,
                'isDefault' => 0
            ]
        ];

        foreach ($defaultStatuses as $status) {
            craft()->db->createCommand()->insert('formbuilder_formstatuses', array(
                'name'      => $status['name'],
                'handle'    => $status['handle'],
                'color'     => $status['color'],
                'sortOrder' => $status['sortOrder'],
                'isDefault' => $status['isDefault']
            ));
        }
    }

    /**
     * Clear out the element index settings
     *
     * @return bool
     */
    public function clearOutElementIndex()
    {
        $result = craft()->db->createCommand()->delete('elementindexsettings', array(
            'type' => 'FormBuilder_Form'
        ));

        return $result;
    }

    /**
     * Clear email notifications
     *
     * @return bool
     */
    public function clearEmailNotifications()
    {
        $elements = $this->getCriteria()->find();

        if ($elements) {
            foreach ($elements as $form) {
                $notifications = $form->notifications;

                if ($notifications) {
                    if (isset($notifications['email'])) {
                        unset($notifications['email']);
                        if ($notifications) {
                            $notifications = JsonHelper::encode($notifications);
                        } else {
                            $notifications = null;
                        }
                    } else {
                        $notifications = JsonHelper::encode($notifications);
                    }
                } else {
                    $notifications = null;
                }

                craft()->db->createCommand()->update(
                    'formbuilder_forms',
                    ['notifications' => $notifications],
                    ['in', 'id', $form->id]
                );

                craft()->templateCache->deleteCachesByElementId($form->id);
            }
        }

        return true;
    }

    /**
     * Clear slack notifications
     *
     * @return bool
     */
    public function clearSlackNotifications()
    {
        $elements = $this->getCriteria()->find();

        if ($elements) {
            foreach ($elements as $form) {
                $notifications = $form->notifications;

                if ($notifications) {
                    if (isset($notifications['slack'])) {
                        unset($notifications['slack']);
                        if ($notifications) {
                            $notifications = JsonHelper::encode($notifications);
                        } else {
                            $notifications = null;
                        }
                    } else {
                        $notifications = JsonHelper::encode($notifications);
                    }
                } else {
                    $notifications = null;
                }

                craft()->db->createCommand()->update(
                    'formbuilder_forms',
                    ['notifications' => $notifications],
                    ['in', 'id', $form->id]
                );

                craft()->templateCache->deleteCachesByElementId($form->id);
            }
        }

        return true;
    }

    // Private Methods
    // =========================================================================

    /**
     * Returns a DbCommand object prepped for retrieving groups.
     *
     * @return DbCommand
     */
    private function _createGroupQuery()
    {
        return craft()->db->createCommand()
            ->select('id, name')
            ->from('formbuilder_groups')
            ->order('name');
    }

    /**
     * Returns a DbCommand object prepped for retrieving fields.
     *
     * @return DbCommand
     */
    private function _createFormQuery()
    {
        return craft()->db->createCommand()
            ->select('f.id, f.groupId, f.name, f.handle')
            ->from('formbuilder_forms f')
            ->order('f.name');
    }
}