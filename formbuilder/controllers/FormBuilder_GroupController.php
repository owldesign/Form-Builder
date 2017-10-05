<?php
namespace Craft;


class FormBuilder_GroupController extends BaseController
{
    /**
     * Save group
     */
    public function actionSave()
    {
        $this->requirePostRequest();
        $this->requireAjaxRequest();

        $group              = new FormBuilder_GroupModel();
        $group->id          = craft()->request->getPost('id');
        $group->name        = craft()->request->getRequiredPost('name');
        $group->settings    = craft()->request->getPost('settings');

        $isNewGroup = empty($group->id);

        if (formbuilder()->groups->save($group)) {
            if ($isNewGroup) {
                craft()->userSession->setNotice(Craft::t('Group added.'));
            }

            $this->returnJson(array(
                'success' => true,
                'group'   => $group->getAttributes(),
            ));
        } else {
            $this->returnJson(array(
                'errors' => $group->getErrors(),
            ));
        }
    }

    /**
     * Delete group
     */
    public function actionDelete()
    {
        $this->requirePostRequest();
        $this->requireAjaxRequest();

        $groupId = craft()->request->getRequiredPost('id');
        $success = formbuilder()->groups->deleteGroupById($groupId);

        craft()->userSession->setNotice(Craft::t('Group deleted.'));

        $this->returnJson(array(
            'success' => $success,
        ));
    }
}