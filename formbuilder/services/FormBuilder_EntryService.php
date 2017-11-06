<?php
namespace Craft;


class FormBuilder_EntryService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================

    private $_entriesById;
    private $_allEntryIds;
    private $_fetchedAllEntries = false;

    // Public Methods
    // =========================================================================

    /**
     * Returns a criteria model for FormBuilder_Entry elements
     *
     * @param array $attributes
     *
     * @return ElementCriteriaModel
     * @throws Exception
     */
    public function getCriteria(array $attributes = array())
    {
        return craft()->elements->getCriteria('FormBuilder_Entry', $attributes);
    }

    /**
     * Get entry by id
     *
     * @param $entryId
     * @return BaseElementModel|null
     */
    public function getEntryById($entryId)
    {
        return $this->getCriteria(array('limit' => 1, 'id' => $entryId))->first();
    }

    /**
     * @param FormBuilder_FormModel $form
     * @return FormBuilder_EntryModel
     */
    public function getEntryModel(FormBuilder_FormModel $form)
    {
        $entry = new FormBuilder_EntryModel;
        $entry->setAttribute('formId', $form->id);

        return $entry;
    }

    /**
     * Get total number of entries
     *
     * @return int
     */
    public function getTotalEntries()
    {
        return count($this->getAllEntryIds());
    }

    /**
     * Get unread entries count
     *
     * @return int
     */
    public function getUnreadEntries()
    {
        return $this->getCriteria(array('limit' => null, 'statusId' => '1'))->total();
    }

    /**
     * Get unread entries count for specific form
     *
     * @param $formId
     * @return int
     */
    public function getUnreadEntriesByFormId($formId)
    {
        return $this->getCriteria(array('limit' => null, 'statusId' => '1', 'formId' => $formId))->total();
    }

    /**
     * Get all entry ids
     *
     * @return array|\CDbDataReader
     */
    public function getAllEntryIds()
    {
        if (!isset($this->_allEntryIds)) {
            if ($this->_fetchedAllEntries) {
                $this->_allEntryIds = array_keys($this->_entriesById);
            } else {
                $this->_allEntryIds = craft()->db->createCommand()
                    ->select('id')
                    ->from('formbuilder_entries')
                    ->queryColumn();
            }
        }
        return $this->_allEntryIds;
    }

    public function save(FormBuilder_EntryModel $entry)
    {
        $entryRecord = new FormBuilder_EntryRecord();

        $entryRecord->formId        = $entry->formId;
        $entryRecord->statusId      = $entry->statusId;
        $entryRecord->title         = $entry->title;
        $entryRecord->ipAddress     = $entry->ipAddress;
        $entryRecord->userAgent     = $entry->userAgent;

        $entryRecord->validate();
        $entry->addErrors($entryRecord->getErrors());

        if (!$entry->hasErrors()) {
            $transaction = craft()->db->getCurrentTransaction() === null ? craft()->db->beginTransaction() : null;

            try {

                if (craft()->elements->saveElement($entry)){
                    $entryRecord->id = $entry->id;

                    $entryRecord->save();

                    if (!$entry->id) {
                        $entry->id = $entryRecord->id;
                    }


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
     * Update entry status
     *
     * @param $ids
     * @return bool
     */
    public function updateStatus($ids)
    {
        foreach ($ids as $key => $id) {
            $entry = formbuilder()->entries->getEntryById($id);
            if ($entry) {
                formbuilder()->entries->updateEntryStatus($entry);
            } else {
                FormBuilderPlugin::log("Can't mark entry as read. Entry id: ".$id);
            }
        }

        return true;
    }

    /**
     * Mark all entries as read
     *
     * @param $ids
     * @return bool
     */
    public function markAsRead($ids)
    {
        foreach ($ids as $key => $id) {
            $entry = formbuilder()->entries->getEntryById($id);

            if ($entry) {
                formbuilder()->entries->updateStatus($entry, '2');
            } else {
                FormBuilderPlugin::log("Can't mark entry as read. Entry id: ".$id);
            }
        }

        return true;
    }

    /**
     * Mark all entries as unread
     *
     * @param $ids
     * @return bool
     */
    public function markAsUnread($ids)
    {
        foreach ($ids as $key => $id) {
            $entry = formbuilder()->entries->getEntryById($id);

            if ($entry) {
                formbuilder()->entries->updateStatus($entry, '1');
            } else {
                FormBuilderPlugin::log("Can't mark entry as unread. Entry id: ".$id);
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
            ->from('formbuilder_entrystatuses')
            ->order('sortOrder asc')
            ->queryAll();

        return FormBuilder_EntryStatusModel::populateModels($statuses);
    }

    public function getStatusById($id)
    {
        $status = craft()->db->createCommand()
            ->select('*')
            ->from('formbuilder_entrystatuses')
            ->where('id=:id', [':id' => $id])
            ->queryRow();

        return $status != null ? FormBuilder_EntryStatusModel::populateModel($status) : null;
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
            ->from('formbuilder_entrystatuses')
            ->where('color=:color', [':color' => $color])
            ->queryRow();

        return $status != null ? FormBuilder_EntryStatusModel::populateModel($status) : null;
    }

    /**
     * Install default statuses
     */
    public function installDefaultStatuses()
    {
        $defaultStatuses = [
            0 => [
                'name'      => 'Unread',
                'handle'    => 'unread',
                'color'     => 'blue',
                'sortOrder' => 1,
                'isDefault' => 1
            ],
            1 => [
                'name'      => 'Read',
                'handle'    => 'read',
                'color'     => 'green',
                'sortOrder' => 2,
                'isDefault' => 0
            ],
            2 => [
                'name'      => 'Archived',
                'handle'    => 'archived',
                'color'     => 'black',
                'sortOrder' => 3,
                'isDefault' => 0
            ]
        ];

        foreach ($defaultStatuses as $status) {
            craft()->db->createCommand()->insert('formbuilder_entrystatuses', array(
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
            'type' => 'FormBuilder_Entry'
        ));

        return $result;
    }

}