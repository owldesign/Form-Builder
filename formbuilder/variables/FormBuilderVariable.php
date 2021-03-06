<?php
namespace Craft;

class FormBuilderVariable
{
    /**
     * Render form on the frontend
     *
     * @param $handle
     * @param array|null $options
     * @return \Twig_Markup
     */
    public function form($variables)
    {
        $form = formbuilder()->forms->getFormByHandle(($variables['formHandle']));
        $options = isset($variables['options']) ? $variables['options'] : null;
        $submission = isset($variables['submission']) ? $variables['submission'] : null;
        
        if ($form->statusId == 2) {
            return false;
        }

        if ($submission) {
            $entry = $submission;
        } else {
            $entry = formbuilder()->entries->getEntryModel($form);
        }

        if ($form) {
            $tabs = $form->fieldLayout->getTabs();
            $oldPath = craft()->templates->getTemplatesPath();

            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form');

            $fieldsetHtml = craft()->templates->render('fieldset', array(
                'tabs'          => $tabs,
                'form'          => $form,
                'submission'    => $submission,
                'entry'         => $entry,
                'options'       => $options
            ));

            $formHtml = craft()->templates->render('form', array(
                'form'          => $form,
                'fieldset'      => $fieldsetHtml,
                'entry'         => $entry,
                'options'       => $options
            ));

            craft()->templates->setTemplatesPath($oldPath);

            return TemplateHelper::getRaw($formHtml);
        } else {
            $notice = '<code>'.Craft::t('There is no form with handle: '. $handle).'</code>';
            echo $notice;
        }
    }

    /**
     * Get input HTML
     *
     * @param $form
     * @param $field
     * @param $value
     * @param array|null $options
     * @return \Twig_Markup
     */
    public function getInputHtml($form, $field, $value, array $options = null)
    {
        $oldPath = craft()->templates->getTemplatesPath();
        $type = StringHelper::toLowerCase($field->type);

        if (isset($form->settings['fields']['globalInputTemplatePath']) && $form->settings['fields']['globalInputTemplatePath'] != '') {
            craft()->templates->setTemplatesPath(craft()->path->getSiteTemplatesPath().$form->settings['fields']['globalInputTemplatePath']);
        } else {
            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form/fields/');
        }

        $fileExist = IOHelper::fileExists(craft()->templates->getTemplatesPath().$type.'/input.twig') ? true : false;

        if (!$fileExist) {
            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form/fields/');
        }


        $input = craft()->templates->render($type.'/input', array(
            'form'          => $form,
            'name'          => $field->handle,
            'value'         => $value,
            'field'         => $field,
            'settings'      => $field->settings,
            'options'       => $options,
            'custom'        => formbuilder()->fields->getFieldSettingsByFieldId($field->id, $form->fieldLayoutId)
        ));

        craft()->templates->setTemplatesPath($oldPath);

        return TemplateHelper::getRaw($input);
    }

    /**
     * Load Terms & Conditions markup
     *
     * @param $form
     * @return string
     */
    public function getTermsConditionsInputs($form)
    {
        $oldPath    = craft()->templates->getTemplatesPath();
        $terms      = $form->options['terms'];

        craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form/fields');

        $html = craft()->templates->render('/terms-conditions', array(
            'terms' => $terms
        ));

        craft()->templates->setTemplatesPath($oldPath);

        return $html;
    }

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
        return formbuilder()->entries->getUnreadEntriesByFormId($formId);
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
}