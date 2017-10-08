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
    public function form($handle, array $options = null)
    {
        $form = formbuilder()->forms->getFormByHandle($handle);

        if ($form->statusId == 2) {
            return false;
        }

        if ($form) {
            $tabs = $form->fieldLayout->getTabs();
            $oldPath = craft()->templates->getTemplatesPath();

            craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form');

            $fieldsetHtml = craft()->templates->render('fieldset', array(
                'tabs'      => $tabs,
                'form'      => $form,
                'entry'     => formbuilder()->entries->getEntryModel($form),
                'options'   => $options
            ));

            $formHtml = craft()->templates->render('form', array(
                'form'          => $form,
                'fieldset'      => $fieldsetHtml,
                'entry'         => formbuilder()->entries->getEntryModel($form),
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

        craft()->templates->setTemplatesPath(craft()->path->getPluginsPath().'formbuilder/templates/frontend/form/fields');

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
        return formbuilder()->templates->getAllTemplates();
    }

    /**
     * Get email model
     *
     * @return mixed
     */
    public function getTemplateModel()
    {
        return formbuilder()->templates->getTemplateModel();
    }

    /**
     * Get email by handle
     *
     * @param $handle
     * @return mixed
     */
    public function getTemplateByHandle($handle)
    {
        return formbuilder()->templates->getTemplateByHandle($handle);
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
        return formbuilder()->templates->getAssetsById($ids);
    }
}