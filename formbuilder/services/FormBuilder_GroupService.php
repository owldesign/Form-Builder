<?php
namespace Craft;


class FormBuilder_GroupService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================

    private $_groupsById;
    private $_fetchedAllGroups = false;

    // Public Methods
    // =========================================================================

    /**
     * Returns all groups
     *
     * @param string|null $indexBy
     *
     * @return array
     */
    public function getAllGroups($indexBy = null)
    {
        if (!$this->_fetchedAllGroups) {
            $groupRecords = FormBuilder_GroupRecord::model()->ordered()->findAll();
            $this->_groupsById = FormBuilder_GroupModel::populateModels($groupRecords, 'id');
            $this->_fetchedAllGroups = true;
        }

        if ($indexBy == 'id') {
            $groups = $this->_groupsById;
        } else {
            if (!$indexBy) {
                $groups = array_values($this->_groupsById);
            } else {
                $groups = array();
                foreach ($this->_groupsById as $group) {
                    $groups[$group->$indexBy] = $group;
                }
            }
        }

        return $groups;
    }

    /**
     * Get forms by group id
     *
     * @param $groupId
     * @return mixed
     */
    public function getFormsByGroupId($groupId)
    {
        $query = craft()->db->createCommand()
            ->from('formbuilder_forms')
            ->where('groupId=:groupId', array('groupId' => $groupId))
            ->order('name')
            ->queryAll();

        return FormBuilder_FormModel::populateModels($query);
    }

    /**
     * Save group
     *
     * @param FormBuilder_GroupModel $group
     *
     * @return bool
     */
    public function save(FormBuilder_GroupModel $group)
    {
        $groupRecord = $this->_getGroupRecord($group);
        $groupRecord->name = $group->name;
        $groupRecord->settings = JsonHelper::encode($group->settings);

        if ($groupRecord->validate()) {
            $groupRecord->save(false);

            if (!$group->id) {
                $group->id = $groupRecord->id;
            }

            return true;
        } else {
            $group->addErrors($groupRecord->getErrors());

            return false;
        }
    }

    /**
     * Delete group by id
     *
     * @param $groupId
     * @return bool
     */
    public function deleteGroupById($groupId)
    {
        $groupRecord = FormBuilder_GroupRecord::model()->findById($groupId);

        if (!$groupRecord) {
            return false;
        }

        $affectedRows = craft()->db->createCommand()->delete('formbuilder_groups', array('id' => $groupId));

        return (bool)$affectedRows;
    }

    /**
     * Get group by id
     *
     * @param $groupId
     * @return bool|BaseRecord
     */
    public function getGroupById($groupId)
    {
        if (!$this->_groupsById) {
            $this->getAllFormGroups('id');
        }

        if (!$groupId) {
            return false;
        }

        return $this->_groupsById[$groupId];
    }

    /**
     * Install default form groups
     */
    public function installDefaultGroups()
    {
        $settings = array(
            'icon' => array(
                'name' => 'list'
            )
        );

        $group = new FormBuilder_GroupModel();
        $group->name = 'Default';
        $group->settings = JsonHelper::encode($settings);;

        if (formbuilder()->groups->save($group)) {
            FormBuilderPlugin::log('Default form group created successfully');
        } else {
            FormBuilderPlugin::log('Could not save the Default form group.', LogLevel::Warning);
        }
    }

    // Private Methods
    // =========================================================================

    /**
     * @param FormBuilder_GroupModel $group
     * @return FormBuilder_GroupRecord
     * @throws Exception
     */
    private function _getGroupRecord(FormBuilder_GroupModel $group)
    {
        if ($group->id) {
            $groupRecord = FormBuilder_GroupRecord::model()->findById($group->id);

            if (!$groupRecord) {
                throw new Exception(Craft::t('No form group exists with the ID “{id}”', array('id' => $group->id)));
            }
        } else {
            $groupRecord = new FormBuilder_GroupRecord();
        }

        return $groupRecord;
    }

}