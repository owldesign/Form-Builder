<?php
namespace Craft;

require_once __DIR__ . '/functions/array-group-by.php';

class FormBuilder_EntryController extends BaseController
{
    // Properties
    // =========================================================================

    protected $allowAnonymous = array('actionSave');
    public $form;
    public $entry;
    public $post;
    public $files;

    // Public Methods
    // =========================================================================

    public function actionIndex()
    {
        craft()->templates->includeJsResource('/formbuilder/js/clipboard/clipboard.js');

        craft()->templates->includeJsResource('/formbuilder/js/entries.js');
        craft()->templates->includeJsResource('/formbuilder/js/charts.js');

        $this->renderTemplate('formbuilder/entries/index');
    }

    /**
     * Edit entry page
     *
     * @param array $variables
     * @throws HttpException
     */
    public function actionEdit(array $variables = array())
    {
        craft()->templates->includeJsResource('/formbuilder/js/entries.js');
        $entry = formbuilder()->entries->getEntryById($variables['entryId']);
        $form = $entry->getForm();
        $tabs   = $entry->getFieldLayout()->getTabs();

        // Update read status
        $status = $entry->getStatusModel();
        if ($status->id == '1') {
            craft()->db->createCommand()->update('formbuilder_entries', array(
                    'statusId' => '2'
                ), array(
                    'in', 'id', $entry->id
                )
            );
        }

        if (empty($entry)) {
            throw new HttpException(404);
        }

        $variables['title']     = $entry->getContent()->title;
        $variables['entry']     = $entry;
        $variables['form']      = $form;
        $variables['fieldTabs'] = $tabs;

        $this->renderTemplate('formbuilder/entries/_edit', $variables);
    }

    /**
     * Save entry
     */
    public function actionSave()
    {
        $this->requirePostRequest();

        $formId         = craft()->request->getRequiredParam('formId');
        $this->form     = FormBuilder()->forms->getFormRecordById($formId);
        $this->post     = craft()->request->getPost();
        $this->files    = $_FILES;

        $saveToDatabase = isset($this->form->settings['database']['enabled']) && $this->form->settings['database']['enabled'] == '1' ? true : false;

        // Setup entry model
        $this->entry = $this->_getEntryModel();
        $this->_populateEntryModel($this->entry);

        // Spam Protection
        $this->_spamProtection();

        // Terms & Conditions
//        $this->_checkTermsConditions();

        if ($this->entry->hasErrors()) {
            craft()->urlManager->setRouteVariables(array(
                'submission' => $this->entry
            ));

            return null;
        }

        if ($saveToDatabase) {
            if (FormBuilder()->entries->save($this->entry)) {
                $saved = true;
            } else {
                $saved = false;
            }
        } else {
            $saved = true;
        }


        // Notifications
        if ($saved) {
            $this->_sendNotifications($this->form['notifications']);
            $this->_returnSuccessMessage();
        } else {
            $this->_returnErrorMessage();
        }
    }

    /**
     * Delete entry
     */
    public function actionDelete()
    {
        $this->requirePostRequest();
        $this->requireAjaxRequest();

        $entryId = craft()->request->getRequiredPost('id');
        $entry = FormBuilder()->entries->getEntryById($entryId);

        $this->_removeAllAssets($entry);

        if (craft()->elements->deleteElementById($entryId)) {
            $this->returnJson(array(
                'success' => true
            ));

            craft()->userSession->setNotice(Craft::t('Entry deleted.'));

        } else {
            $this->returnJson(array(
                'success' => false
            ));
        }
    }

    /**
     * Download all entry files
     */
    public function actionDownloadAllFiles()
    {
        $this->requireAjaxRequest();

        if (ini_get('allow_url_fopen')) {
            $fileIds = craft()->request->getRequiredPost('ids');
            $formId = craft()->request->getRequiredPost('formId');
            $files = array();

            foreach ($fileIds as $id) {
                $files[] = craft()->assets->getFileById($id);
            }

            $zipname = craft()->path->getTempPath().'SubmissionFiles-'.$formId.'.zip';
            $zip = new \ZipArchive();
            $zip->open($zipname, \ZipArchive::CREATE);

            foreach ($files as $file) {
                $zip->addFromString($file->filename, file_get_contents($file->url));
            }

            $filePath = $zip->filename;
            $zip->close();

            if ($filePath == $zipname) {
                $this->returnJson(array(
                    'success' => true,
                    'message' => 'Download Complete.',
                    'filePath' => $filePath
                ));
            }
        } else {
            $this->returnJson(array(
                'success' => false,
                'message' => 'Cannot download all files, `allow_url_fopen` must be enabled.'
            ));
        }
    }

    /**
     * Download files
     */
    public function actionDownloadFiles()
    {
        $filePath = craft()->request->query['filePath'];
        craft()->request->sendFile(IOHelper::getFileName($filePath), IOHelper::getFileContents($filePath), array('forceDownload' => true));
    }

    /**
     * Get unread entries count
     *
     * @return mixed
     */
    public function actionGetUnreadEntries()
    {

        $query = FormBuilder_EntryRecord::model()->findAllByAttributes(array(
            'statusId' => 1
        ));

        $entries = FormBuilder_EntryModel::populateModels($query);
        $grouped = array_group_by($entries, 'formId');


        $oldPath = craft()->templates->getTemplatesPath();
        $newPath = craft()->path->getPluginsPath().'formBuilder/templates';
        craft()->templates->setTemplatesPath($newPath);

        if ($entries) {
            $template = craft()->templates->render('entries/_includes/_unread-entries', array('entries' => $entries));
        } else {
            $template = false;
        }

        craft()->templates->setTemplatesPath($oldPath);

        $this->returnJson(array(
            'success' => true,
            'entries' => $entries,
            'grouped' => $grouped,
            'template' => $template,
            'totalCount' => count($entries)
        ));
    }

    /**
     * Get all unread entries by form ID
     *
     * @return mixed
     */
    public function actionGetUnreadEntriesBySource()
    {
        $this->requirePostRequest();

        $source = craft()->request->getParam('source');
        $entries = false;

        if ($source) {
            $formId = explode($source, ':');

            $query = FormBuilder_EntryRecord::model()->findAllByAttributes(array(
               'formId' => $formId[1],
               'statusId' => 1
            ));

            $entries = FormBuilder_EntryModel::populateModels($query);

        }

        $oldPath = craft()->templates->getTemplatesPath();
        $newPath = craft()->path->getPluginsPath().'formBuilder/templates';
        craft()->templates->setTemplatesPath($newPath);

        if ($entries) {
            $template = craft()->templates->render('entries/_includes/_unread-entries', array('entries' => $entries));
        } else {
            $template = false;
        }

        craft()->templates->setTemplatesPath($oldPath);

        $this->returnJson(array(
            'success' => true,
            'entries' => $entries,
            'template' => $template,
            'count' => count($entries)
        ));
    }



    // Protected Methods
    // =========================================================================

    private function _checkTermsConditions()
    {
        if (isset($this->form->options['terms']['enabled']) && $this->form->options['terms']['enabled'] == '1') {
            $accepted = craft()->request->getPost('formbuilderTermsConditions');
            if ($accepted == '0') {
                $this->entry->addError('terms', Craft::t('You must accept terms!'));
                // if (craft()->request->isAjaxRequest()) {
                //     $this->returnJson(array(
                //         'success' => false,
                //         'message' => Craft::t('You must accept terms!')
                //     ));
                // } else {
                //     craft()->userSession->setError(Craft::t('You must accept terms!'));
                //     craft()->urlManager->setRouteVariables(array(
                //         'entry' => $this->entry
                //     ));
                // }
            }
        }
    }

    /**
     * Remove all assets
     *
     * @param $entry
     */
    private function _removeAllAssets($entry)
    {
        $criteria = craft()->elements->getCriteria(ElementType::Asset);
        $criteria->relatedTo = $entry;
        $assets = $criteria->find();

        foreach ($assets as $asset) {
            craft()->elements->deleteElementById($asset->id);
        }
    }

    /**
     * Spam protection validation
     */
    private function _spamProtection()
    {
        // Honeypot
        if (isset($this->form->spam['honeypot']['enabled']) && $this->form->spam['honeypot']['enabled'] == '1') {
            $honeypotField = craft()->request->getPost('email-address-new-one');
            if ($honeypotField != '') {
                $this->entry->addError('honeypot', Craft::t('Failed honeypot validation!'));
            }
        }

        // Timed
        if (isset($this->form->spam['timed']['enabled']) && $this->form->spam['timed']['enabled'] == '1') {
            $submissionTime = (int)craft()->request->getPost('spamTimeMethod');
            $submissionDuration = time() - $submissionTime;
            $allowedTime = (int)$this->form->spam['timed']['number'];

            if ($submissionDuration < $allowedTime) {
                $this->entry->addError('timed', Craft::t('You submitted too fast!'));
            }
        }
    }

    /**
     * Return success message
     */
    private function _returnSuccessMessage()
    {
        if (craft()->request->isAjaxRequest()) {
            $this->returnJson(array(
                'success' => true,
                'message' => isset($this->form['options']['ajax']['messages']['success']) ? $this->form['options']['ajax']['messages']['success'] : Craft::t('Message submitted.')
            ));
        } else {
            craft()->userSession->setNotice(Craft::t('Entry saved.'));
            $this->redirectToPostedUrl($this->entry);
        }
    }

    /**
     * Return error message
     */
    private function _returnErrorMessage()
    {
        if (craft()->request->isAjaxRequest()) {
            $this->returnJson(array(
                'success' => false,
                'message' => isset($this->form['options']['ajax']['messages']['error']) ? $this->form['options']['ajax']['messages']['error'] : Craft::t('Failed to submit message.'),
                'submission' => $this->entry
            ));
        } else {
            craft()->urlManager->setRouteVariables(array(
                'submission' => $this->entry
            ));
        }
    }

    /**
     * Sending notifications
     *
     * @param $notifications
     * @return bool
     */
    private function _sendNotifications($notifications)
    {
        if ($notifications != 'null' && count($notifications) > 0) {
            foreach($notifications as $type => $notification) {
                switch ($type) {
                    case 'email':
                        if (craft()->plugins->getPlugin('FormBuilderEmailNotifications', true)) {
                            FormBuilderPlugin::log("Sending Email Notifications");
                            craft()->formBuilderEmailNotifications->prepareNotification($this->entry, $notification, $this->post);
                        }
                        break;
                    case 'slack':
                        if (craft()->plugins->getPlugin('FormBuilderSlackNotifications', true)) {
                            FormBuilderPlugin::log("Sending Slack Notifications");
                            craft()->formBuilderSlackNotifications->prepareNotification($this->entry, $notification, $this->post, $this->files);
                        }
                        break;
                }
            }
        } else {
            return true;
        }
    }

    /**
     * Creates an entry model
     *
     * @throws Exception
     * @return EntryModel
     */
    private function _getEntryModel()
    {
        $entry = new FormBuilder_EntryModel();

        return $entry;
    }

    /**
     * Populates entry model with post data
     *
     * @param FormBuilder_EntryModel $entry
     */
    private function _populateEntryModel(FormBuilder_EntryModel $entry)
    {
        $entry->formId          = $this->form->id;
        $entry->statusId        = craft()->request->getRequiredParam('statusId');
        $entry->ipAddress       = craft()->request->getUserHostAddress();
        $entry->userAgent       = craft()->request->getUserAgent();

        $title = isset($this->form->settings['database']['titleFormat']) && $this->form->settings['database']['titleFormat'] != '' ? $this->form->settings['database']['titleFormat'] : 'Submission - '.DateTimeHelper::currentTimeStamp();
        $_POST['fields']['date'] = DateTimeHelper::currentTimeStamp();

        $entry->getContent()->title = craft()->templates->renderObjectTemplate($title, $_POST['fields']);
        $fieldsLocation = craft()->request->getParam('fieldsLocation', 'fields');
        $entry->setContentFromPost($fieldsLocation);
        $entry->title = $entry->getContent()->title;
    }


}