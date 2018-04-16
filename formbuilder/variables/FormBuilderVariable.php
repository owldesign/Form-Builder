<?php
namespace Craft;

class FormBuilderVariable
{
    /**
     * Render form
     *
     * @param $variables
     * @return bool|\Twig_Markup
     */
    public function form($variables)
    {
        $form = FormBuilder()->forms->getFormByHandle(($variables['formHandle']));
        $options = isset($variables['options']) ? $variables['options'] : null;
        $submission = isset($variables['submission']) ? $variables['submission'] : null;

        if ($form->statusId == 2) {
            return false;
        }

        if ($submission) {
            $entry = $submission;
        } else {
            $entry = new FormBuilder_EntryModel();
            $entry->form = $form;
        }

        if ($form) {
            $tabs = $form->fieldLayout->getTabs();

            $oldPath = craft()->templates->getTemplatesPath();

            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form');

            $fieldsets = craft()->templates->render('fieldset', array(
                'tabs'          => $tabs,
                'form'          => $form,
                'submission'    => $submission,
                'entry'         => $entry,
                'options'       => $options
            ));

            $formHtml = craft()->templates->render('form', array(
                'form'          => $form,
                'fieldset'      => $fieldsets,
                'entry'         => $entry,
                'options'       => $options
            ));

            craft()->templates->setTemplatesPath($oldPath);

            return TemplateHelper::getRaw($formHtml);

        } else {
            $notice = '<code>'.Craft::t('There is no form with handle: '. $variables['formHandle']).'</code>';

            echo $notice;
        }
    }

    /**
     * Get input html
     *
     * @param $value
     * @param $entry
     * @param $field
     * @param $form
     * @return string|\Twig_Markup
     * @throws Exception
     */
    public function getInputHtml($value, $entry, $field, $form)
    {
        $oldPath = craft()->templates->getTemplatesPath();
        $type = StringHelper::toLowerCase($field->type);
        $settings = $form->settings;

        if (isset($settings['fields']['global']['inputTemplate']) && $settings['fields']['global']['inputTemplate'] != '') {
            $customPath = $settings['fields']['global']['inputTemplate'];
            craft()->templates->setTemplatesPath(craft()->path->getSiteTemplatesPath() . $customPath);

        } else {
            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/_includes/forms/');
        }

        $fileExist = IOHelper::fileExists(craft()->templates->getTemplatesPath().$type.'/input.twig') ? true : false;

        if (!$fileExist) {
            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/_includes/forms/');
        }

        $variables = [
            'name'          => $field->handle,
            'value'         => $value,
            'field'         => $field,
            'settings'      => $field,
            'form'          => $form,
            'options'       => null,
            'class'         => '',
            'id'         => ''
        ];

        if (isset($field->settings['placeholder'])) {
            $variables['placeholder'] = $field->settings['placeholder'];
        }

        if (isset($field->settings['charLimit'])) {
            $variables['maxlength'] = $field->settings['charLimit'];
        }

        if (isset($field->settings['size'])) {
            $variables['size'] = $field->settings['size'];
        }

        if (isset($field->settings['initialRows'])) {
            $variables['rows'] = $field->settings['initialRows'];
        }

        $fieldModel = FormBuilder()->fields->getFieldRecordByFieldId($field->id, $form->id);

        if ($fieldModel && $fieldModel->attributes['options']) {
            $options = $fieldModel->attributes['options'];

            if (isset($options['class'])) {
                $variables['class'] = $options['class'];
            }

            if (isset($options['id'])) {
                $variables['id'] = $options['id'];
            }
        }

        if (isset($settings['fields']['global']['inputClass'])) {
            $availableClasses = $variables['class'];
            $variables['class'] = $availableClasses . ' ' . $settings['fields']['global']['inputClass'];
        }


        switch ($type) {
            case 'plaintext':
                $variables['type'] = 'text';
                if ($field->settings['multiline']) {
                    $input = craft()->templates->render('textarea', $variables);
                } else {
                    $input = craft()->templates->render('text', $variables);
                }
                break;
            case 'number':
                $variables['type'] = 'number';
                $input = craft()->templates->render('text', $variables);
                break;
            case 'dropdown':
                $variables['type'] = 'select';
                $variables['options'] = $field->settings['options'];
                $input = craft()->templates->render('select', $variables);
                break;
            case 'multiselect':
                $variables['options'] = $field->settings['options'];
                $input = craft()->templates->render('multiselect', $variables);
                break;
            case 'checkboxes':
                $variables['type'] = 'checkbox';
                $variables['options'] = $field->settings['options'];
                $input = craft()->templates->render('checkboxGroup', $variables);
                break;
            case 'radiobuttons':
                $variables['options'] = $field->settings['options'];
                $input = craft()->templates->render('radioGroup', $variables);
                break;
            case 'color':
                $variables['type'] = 'color';
                $input = craft()->templates->render('color', $variables);
                break;
            case 'date':
                $variables['type'] = 'date';
                $input = craft()->templates->render('date', $variables);
                break;
            case 'assets':
                $input = craft()->templates->render('file', $variables);
                break;
        }

        craft()->templates->setTemplatesPath($oldPath);

        if (isset($input)) {
            return TemplateHelper::getRaw($input);
        } else {
            return '';
        }
    }

//    public function getTermsConditionsInputs($form)
//    {
//        $oldPath    = craft()->templates->getTemplatesPath();
//        $terms      = $form->options['terms'];
//
//        craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form/fields');
//
//        $html = craft()->templates->render('/terms-conditions', array(
//            'terms' => $terms
//        ));
//
//        craft()->templates->setTemplatesPath($oldPath);
//
//        return $html;
//    }

    /**
     * Get form by handle
     *
     * @param $handle
     * @return mixed
     */
    public function getFormByHandle($handle)
    {
        $form = formbuilder()->forms->getFormByHandle($handle);

        return $form;
    }

    /**
     * Get all form groups
     *
     * @param $index
     * @return mixed
     */
    public function getAllGroups($index)
    {
        return formbuilder()->groups->getAllGroups($index);
    }

    /**
     * Get group by id
     *
     * @param $groupId
     * @return mixed
     */
    public function getGroupById($groupId)
    {
        return formbuilder()->groups->getGroupById($groupId);
    }

    /**
     * Get all forms
     *
     * @return array
     */
    public function getAllForms()
    {
        return formbuilder()->forms->getAllForms();
    }

    /**
     * Get all form statuses
     *
     * @return mixed
     */
    public function getFormStatuses()
    {
        return formbuilder()->forms->getAllStatuses();
    }

    public function entries(array $attributes = array())
    {
        return formbuilder()->entries->getCriteria($attributes);
    }

    /**
     * Get entry by ID
     *
     * @param $id
     * @return mixed
     */
    public function getEntryById($id)
    {
        return formbuilder()->entries->getEntryById($id);
    }

    /**
     * Get all entry statuses
     *
     * @return mixed
     */
    public function getEntryStatuses()
    {
        return formbuilder()->entries->getAllStatuses();
    }

    /**
     * Get all templates
     *
     * @return array
     */
    public function getAllTemplates()
    {
        $notificationPlugin = craft()->plugins->getPlugin('formbuilderemailnotifications');

        if ($notificationPlugin->isInstalled) {
            return craft()->formBuilderEmailNotifications->templates->getAllTemplates();
        }

        return null;
    }

    /**
     * Get email model
     *
     * @return mixed
     */
    public function getTemplateModel()
    {
        $notificationPlugin = craft()->plugins->getPlugin('formbuilderemailnotifications');

        if ($notificationPlugin->isInstalled) {
            return craft()->formBuilderEmailNotifications->templates->getTemplateModel();
        }

        return null;
    }

    /**
     * Get email by handle
     *
     * @param $handle
     * @return mixed
     */
    public function getTemplateByHandle($handle)
    {   
        $notificationPlugin = craft()->plugins->getPlugin('formbuilderemailnotifications');

        if ($notificationPlugin->isInstalled) {
            return craft()->formBuilderEmailNotifications->templates->getTemplateByHandle($handle['handle']);
        }

        return null;
    }

    /**
     * Get total number of entries
     *
     * @return mixed
     */
    public function totalEntries()
    {
        $count = formbuilder()->entries->getTotalEntries();
        return $count;
    }

    /**
     * Get total number of entries
     *
     * @return mixed
     */
    public function getUnreadEntries()
    {
        return formbuilder()->entries->getUnreadEntries();
    }

    public function getUnreadEntriesByFormId($formId)
    {
        $entries = FormBuilder_EntryRecord::model()->findAllByAttributes(array(
            'formId' => $formId,
            'statusId' => 1
        ));

        return count($entries);
    }

    /**
     * Get assets by id
     *
     * @param $ids
     * @return mixed
     */
    public function getAssetsById($ids)
    {
        $notificationPlugin = craft()->plugins->getPlugin('formbuilderemailnotifications');

        if ($notificationPlugin->isInstalled) {
            return craft()->formBuilderEmailNotifications->templates->getAssetsById($ids);
        }

        return null;
        
    }

    /**
     * Return dynamic admin url
     *
     * @param bool $includePluginPath
     * @return string
     */
    public function adminUrl($includePluginPath = true)
    {
        if ($includePluginPath) {
            return '/'.craft()->config->get('cpTrigger').'/formbuilder';
        } else {
            return '/'.craft()->config->get('cpTrigger').'';
        }
    }

    /**
     * Get tab settings
     *
     * @param $tabId
     * @return mixed
     */
    public function getTabSettings($tabId) {
        return FormBuilder()->tabs->getTabSettings($tabId);
    }

    /**
     * Get entry notes
     *
     * @param $entryId
     * @return mixed
     */
    public function notes($entryId)
    {
        return FormBuilder()->notes->getNotes($entryId);
    }
}