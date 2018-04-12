<?php
namespace Craft;

class FormBuilder_FormController extends BaseController
{
    // Properties
    // =========================================================================

    private $form;

    // Public Methods
    // =========================================================================

    public function actionIndex()
    {
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-regular.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-light.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-solid.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fontawesome.js');
        craft()->templates->includeJsResource('/formbuilder/js/clipboard/clipboard.js');

        craft()->templates->includeCssResource('/formbuilder/css/formbuilder.css');
        craft()->templates->includeJsResource('/formbuilder/js/formbuilder.js');
        craft()->templates->includeJsResource('/formbuilder/js/forms.js');
        craft()->templates->includeJsResource('/formbuilder/js/groups.js');

        $groups = FormBuilder()->groups->getAllGroups();

        $this->renderTemplate('formbuilder/forms/index', array(
            'groups' => $groups
        ));
    }


    public function actionEdit(array $variables = array())
    {
        $this->_prepEditFormVariables($variables);

        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-regular.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-light.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-solid.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fontawesome.js');
        craft()->templates->includeCssResource('/formbuilder/css/formbuilder.css');
        craft()->templates->includeJsResource('/formbuilder/js/formbuilder.js');
        craft()->templates->includeJsResource('/formbuilder/js/modal.js');
        craft()->templates->includeJsResource('/formbuilder/js/fields.js');
        craft()->templates->includeJsResource('/formbuilder/js/forms.js');
        craft()->templates->includeJsResource('/formbuilder/js/field-designer.js');
        craft()->templates->includeJsResource('/formbuilder/js/tab-designer.js');
        craft()->templates->includeJsResource('/formbuilder/js/designer.js');
        craft()->templates->includeJsResource('/formbuilder/js/option.js');
        craft()->templates->includeJsResource('/formbuilder/js/tags.js');
        craft()->templates->includeJsResource('/formbuilder/js/integrations.js');
        craft()->templates->includeCssResource('/lib/redactor/redactor.css');
        craft()->templates->includeJsResource('/lib/redactor/redactor.min.js');
        craft()->templates->includeCssResource('formbuilder/css/libs/alignment.css');
        craft()->templates->includeJsResource('formbuilder/js/libs/alignment.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontfamily.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontsize.js');
        craft()->templates->includeJsResource('formbuilder/js/libs/fontcolor.js');

        if ($variables["form"]->fieldLayoutId) {
            craft()->templates->includeJs('LD.layoutId='.$variables["form"]->fieldLayoutId);
            craft()->templates->includeJs('LD.formId='.$variables["form"]->id);
        }
        craft()->templates->includeJs('LD.setup()');

        craft()->templates->includeJs('LD_Fields.fields=' . json_encode(FormBuilder()->fields->getFields()));
        craft()->templates->includeJs('LD_Fields.options=' . json_encode(FormBuilder()->fields->getAllFieldOptions()));
        craft()->templates->includeJs('LD_Fields.setup()');

        craft()->templates->includeJs('LD_Tabs.tabs=' . json_encode(FormBuilder()->tabs->getTabs()));
        craft()->templates->includeJs('LD_Tabs.options=' . json_encode(FormBuilder()->tabs->getAllTabOptions()));
        craft()->templates->includeJs('LD_Tabs.setup()');

        if ($variables['form']) {
            $variables['title'] = 'Edit '.$variables['form']->name;

        } else {
            $variables['title'] = 'New Form';
        }

        $variables['fullPageForm'] = true;
        $variables['continueEditingUrl'] = 'formbuilder/forms/{id}';
        $variables['saveShortcutRedirect'] = $variables['continueEditingUrl'];

        $this->renderTemplate('formbuilder/forms/_edit', $variables);
    }

    /**
     * Safe form
     */
    public function actionSave()
    {
        $this->requirePostRequest();

        $form = $this->_populateFormModel();

        $fieldLayout = craft()->fields->assembleLayoutFromPost();
        $fieldLayout->type = 'FormBuilder_Form';
        $form->setFieldLayout($fieldLayout);

        if (!FormBuilder()->forms->save($form)) {
            craft()->userSession->setError(Craft::t('Could not save form.'));

            craft()->urlManager->setRouteVariables(array(
                'form' => $form
            ));

            return null;
        }

        craft()->userSession->setNotice(Craft::t('Form saved.'));

        $this->redirectToPostedUrl($form);
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

    private function _populateFormModel()
    {
        $formId = craft()->request->getPost('formId');

        if ($formId) {
            $form = FormBuilder()->forms->getFormRecordById($formId);

            if (!$form) {
                throw new NotFoundHttpException('Form not found');
            }
        } else {

            if (($group = FormBuilder()->groups->getGroupById(craft()->request->getPost('groupId'))) === null) {
                throw new BadRequestHttpException('Invalid form group');
            }

            $form = new FormBuilder_FormModel();
        }

        $form->groupId = craft()->request->getPost('groupId');
        $form->statusId = craft()->request->getPost('statusId');
        $form->name = craft()->request->getPost('name');
        $form->handle = craft()->request->getPost('handle');
        $form->options = craft()->request->getPost('options');
        $form->spam = craft()->request->getPost('spam');
        $form->notifications = craft()->request->getPost('notifications');
        $form->settings = craft()->request->getPost('settings');

        return $form;
    }

    private function _prepEditFormVariables(array &$variables)
    {
        if (isset($variables['formId'])) {
            $variables['form'] = FormBuilder()->forms->getFormRecordById($variables['formId']);

            if (!$variables['form']) {
                throw new NotFoundException('Form not found');
            }

            if (!empty($variables['groupId'])) {
                $variables['group'] = FormBuilder()->groups->getGroupById($variables['groupId']);

                if (empty($variables['group'])) {
                    throw new NotFoundException('Form group not found');
                }
            }
        } else {
            $variables['form'] = new FormBuilder_FormModel();
            $variables['form']->groupId = 1;
            $variables['form']->statusId = 1;
        }
    }

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
     * @return FormBuilder_FormModel
     */
    private function _prepareNewFormModel()
    {
        $model = new FormBuilder_FormModel();

        return $model;
    }
}