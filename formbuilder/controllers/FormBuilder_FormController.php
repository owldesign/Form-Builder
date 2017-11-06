<?php
namespace Craft;

class FormBuilder_FormController extends BaseController
{
    // Properties
    // =========================================================================

    private $form;

    // Public Methods
    // =========================================================================

    /**
     * Edit form
     *
     * @param array $variables
     * @throws HttpException
     */
    public function actionEdit(array $variables = array())
    {
        $variables['saveShortcutRedirect'] = 'formbuilder/forms/edit/{id}';
        $variables['continueEditingUrl'] = 'formbuilder/forms/edit/{id}';

        if (!empty($variables['formId'])) {

            $variables['form'] = formbuilder()->forms->getFormRecordById($variables['formId']);
            if (!$variables['form']) {
                throw new HttpException(404);
            }
        } else {
            if (empty($variables['form'])) {
                $variables['form'] = $this->_prepareNewFormModel();
            }
        }

        // Load Redactor Scripts for Rich Text fields
        craft()->templates->includeCssResource('/lib/redactor/redactor.css');
        craft()->templates->includeJsResource('/lib/redactor/redactor.min.js');
        craft()->templates->includeCssResource('formbuilder/css/libs/alignment.css');
        craft()->templates->includeJsResource('formbuilder/js/libs/alignment.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontfamily.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontsize.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontcolor.js');

        // Load custom fields settings
        craft()->templates->includeJs('FieldSettings.fields=' . json_encode(formbuilder()->fields->getFields()));
        craft()->templates->includeJs('FieldSettings.inputs=' . json_encode(formbuilder()->fields->getAllInputSettings()));
        craft()->templates->includeJs('FieldSettings.htmls=' . json_encode(formbuilder()->fields->getAllHtmlSettings()));
        craft()->templates->includeJs('FieldSettings.settings=' . json_encode(formbuilder()->fields->getSettings()));
        craft()->templates->includeJs('FieldSettings.setup()');


        $this->renderTemplate('formbuilder/forms/_edit', $variables);
    }

    /**
     * Safe form
     */
    public function actionSave()
    {
        $this->requirePostRequest();
        $this->form = new FormBuilder_FormModel();
        $this->form->id                           = craft()->request->getPost('formId');
        $this->form->name                         = craft()->request->getPost('name');
        $this->form->handle                       = craft()->request->getPost('handle');
        $this->form->statusId                     = craft()->request->getPost('statusId');
        $this->form->groupId                      = craft()->request->getPost('groupId');
        $this->form->fieldLayoutId                = craft()->request->getPost('fieldLayoutId');
//         Craft::dd($_POST);
        if (craft()->request->getPost('options')) {
            $this->_populateFormOptions(craft()->request->getPost('options'));
        }

        if (craft()->request->getPost('spam')) {
            $this->_populateSpamProtection(craft()->request->getPost('spam'));
        }

        if (craft()->request->getPost('notifications')) {
            $this->_populateNotifications(craft()->request->getPost('notifications'));
        }

        if (craft()->request->getPost('settings')) {
            $this->_populateSettings(craft()->request->getPost('settings'));
        }

        // Craft::dd($_POST);

        $fieldLayout = craft()->fields->assembleLayoutFromPost();
        $fieldLayout->type = 'FormBuilder_Form';
        $this->form->setFieldLayout($fieldLayout);

        if (formbuilder()->forms->save($this->form)) {
            craft()->userSession->setNotice(Craft::t('Form saved.'));
            $this->redirectToPostedUrl($this->form);
        } else {
            craft()->userSession->setError(Craft::t('Could not save form.'));
        }

        craft()->urlManager->setRouteVariables(array(
            'form' => $this->form
        ));
    }

    /**
     * Delete form
     */
    public function actionDelete()
    {
        $this->requirePostRequest();
        $this->requireAjaxRequest();

        $formId = craft()->request->getRequiredPost('id');
        $form   = formbuilder()->forms->getFormById($formId);

        $result = formbuilder()->forms->delete($form);

        if (craft()->request->isAjaxRequest()) {
            $this->returnJson(array('success' => true));
        } else {
            $this->redirectToPostedUrl($result);
        }

    }

    // Private Methods
    // =========================================================================

    /**
     * Populate form options
     *
     * @param $option
     */
    private function _populateFormOptions($option)
    {
        $this->form->options = $option;
    }

    /**
     * Populate spam protection
     *
     * @param $option
     */
    private function _populateSpamProtection($option)
    {
        $this->form->spam = $option;
    }

    /**
     * Populate notifications
     *
     * @param $option
     */
    private function _populateNotifications($option)
    {
        $this->form->notifications = $option;
    }

    /**
     * Populate settings
     *
     * @param $option
     */
    private function _populateSettings($option)
    {
        $this->form->settings = $option;
    }

    /**
     * Prepare form model
     *
     * @return FormBuilder2_Model
     */
    private function _prepareNewFormModel()
    {
        $model = new FormBuilder_FormModel();

        return $model;
    }
}