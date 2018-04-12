<?php

/*
Plugin Name: Form Builder
Plugin Url: https://github.com/owldesign/Form-Builder
Author: Vadim Goncharov (https://github.com/owldesign)
Author URI: https://github.com/owldesign
Description: Form Builder is a Craft CMS plugin that lets you create and manage forms for your front-end.
Version: 1.0.3
*/

namespace Craft;

require __dir__.'/plugin/Routes.php';

class FormBuilderPlugin extends BasePlugin
{
    // Traits
    // =========================================================================
    use Routes;

    // Public Methods
    // =========================================================================

    public function init()
    {
        parent::init();

        $this->registerCpRoutes();

        // Getting date for releases.json
        // Craft::dd(DateTimeHelper::toIso8601(DateTimeHelper::currentTimeStamp()));

        if (craft()->request->isCpRequest()) {
            // Plugin Prep Template Hook
            craft()->templates->hook('formBuilder.prepTemplate', array($this, '_prepTemplate'));

            // Check for unread entries
            if ($this->getSettings()->unreadNotifications && $this->getSettings()->unreadNotifications == '1') {
                $count = formbuilder()->entries->getUnreadEntries();
                if ($count > 0) {
                    $this->_renderUnreadCount($count);
                }
            }
        }

        // Bind custom events
        $this->customEvents();
    }

    /**
     * @return mixed|string
     */
    public function getName()
    {
        $settings = $this->getSettings();
        if ($settings->pluginName) {
            return $settings->pluginName;
        }

        return 'Form Builder';
    }

    /**
     * Returns the plugin’s version number.
     *
     * @return string The plugin’s version number.
     */
    public function getVersion()
    {
        return '1.0.3';
    }

    /**
     * @inheritDoc IPlugin::getSchemaVersion()
     *
     * @return string|null
     */
    public function getSchemaVersion()
    {
        return '1.0.1';
    }

    /**
     * @inheritDoc IPlugin::getReleaseFeedUrl()
     *
     * @return string|null
     */
    public function getReleaseFeedUrl()
    {
        return 'https://raw.githubusercontent.com/owldesign/Form-Builder/master/releases.json';
    }

    /**
     * Returns the plugin developer’s name.
     *
     * @return string The plugin developer’s name.
     */
    public function getDeveloper()
    {
        return 'Vadim Goncharov';
    }

    /**
     * Returns the plugin developer’s URL.
     *
     * @return string The plugin developer’s URL.
     */
    public function getDeveloperUrl()
    {
        return 'https://owl-design.net';
    }

    /**
     * @inheritDoc IPlugin::getDocumentationUrl()
     *
     * @return string|null
     */
    public function getDocumentationUrl()
    {
        return 'https://formbuilder.tools';
    }

    /**
     * @inheritDoc IPlugin::getDescription()
     *
     * @return string|null
     */
    public function getDescription()
    {
        return Craft::t('Form Builder is a Craft CMS plugin that lets you create and manage forms for your front-end.');
    }

    /**
     * @inheritDoc IPlugin::hasCpSection()
     *
     * @return bool
     */
    public function hasCpSection()
    {
        return true;
    }

    /**
     * @inheritDoc IPlugin::hasSettings()
     *
     * @return bool Whether the plugin has settings
     */
    public function hasSettings()
    {
        return $this->getSettingsUrl() || $this->getSettingsHtml();
    }

    /**
     * @inheritDoc IPlugin::getSettingsUrl()
     *
     * @return string|null
     */
    public function getSettingsUrl()
    {
        return 'formBuilder/settings/';
    }

    // Protected Methods
    // =========================================================================


    /**
     * Plugin settings.
     *
     * @return array
     */
    protected function defineSettings()
    {
        return array(
            'pluginName'            => array(AttributeType::String),
            'canDoActions'          => array(AttributeType::String),
            'unreadNotifications'   => array(AttributeType::String)
        );
    }

    /**
     *
     * Add Navigation
     *
     * @param $context
     */
    public function _prepTemplate(&$context)
    {
        $settings = $this->getSettings();
        $context['subnav'] = array();
        $context['subnav']['dashboard'] = array(
            'label' => Craft::t('Dashboard'),
            'url' => 'formbuilder/dashboard'
        );

        if (craft()->userSession->isAdmin() || $settings->canDoActions) {
            $context['subnav']['forms'] = array(
                'label' => Craft::t('Forms'),
                'url' => 'formbuilder/forms'
            );
        }

        $context['subnav']['entries'] = array(
            'label' => Craft::t('Entries'),
            'url' => 'formbuilder/entries'
        );

        if (craft()->userSession->isAdmin() || $settings->canDoActions) {
            if (craft()->plugins->getPlugin('FormBuilderEmailNotifications', true)) {
                $context['subnav']['templates'] = array(
                    'label' => Craft::t('Templates'),
                    'url' => 'formbuilder/templates'
                );
            }
            $context['subnav']['settings'] = array(
                'label' => Craft::t('Settings'),
                'url' => 'formbuilder/settings'
            );
            $context['subnav']['createnewform'] = array(
                'label' => Craft::t('Create New Form'),
                'url' => 'formbuilder/forms/new?groupId=1'
            );
        }

    }

    public function addTwigExtension()
    {
        Craft::import('plugins.formbuilder.twigextensions.FormBuilderTwigExtension');

        return new FormBuilderTwigExtension();
    }

    // Private Methods
    // =========================================================================

    private function _renderUnreadCount($count)
    {
        craft()->templates->includeCssResource('formbuilder/css/unreadcount.css');
        if ($count > 0) {
            craft()->templates->includeCss('#nav-formbuilder:after { display: block; content: "'.$count.'"}');
        }
    }

    private function customEvents()
    {
        // Check custom field settings
        craft()->on('fields.saveFieldLayout', function(Event $event) {
            $layout = $event->params['layout'];
            $post = craft()->request->getPost('form-builder');

            if ($post) {
                if (isset($post['field'])) {
                    foreach ($post['field'] as $fieldId => $field) {
                        $fieldModel = new FormBuilder_FieldModel();
                        $fieldModel->fieldId = $fieldId;

                        if ($layout->id) {
                            $fieldModel->fieldLayoutId = $layout->id;
                        }

                        if (isset($post['formId'])) {
                            $fieldModel->formId = $post['formId'];
                        }

                        if (isset($field['options'])) {
                            $fieldModel->options = JsonHelper::encode($field['options']);
                        }

                        FormBuilder()->fields->save($fieldModel);
                    }
                }

                if (isset($post['tab'])) {
                    craft()->getDb()->createCommand()
                        ->delete('{{%formbuilder_tabs}}', ['layoutId' => $layout->id])
                        ->execute();

                    foreach ($layout->getTabs() as $key => $value) {
                        if (isset(array_values($post['tab'])[$key]['options'])) {
                            FormBuilder()->tabs->save($value, array_values($post['tab'])[$key], $post['formId'], $layout->id);
                        }

                    }
                }
            }

            unset($_POST['form-builder']);

//            if ($formbuilder) {
//                $transaction = craft()->db->getCurrentTransaction() ? false : craft()->db->beginTransaction();
//
//                try {
//                    foreach($formbuilder['field'] as $fieldId => $fieldInfo) {
//                        $fieldModel = new FormBuilder_FieldModel();
//                        $fieldModel->fieldId = $fieldId;
//                        $fieldModel->fieldLayoutId = $layout->id;
//
//                        if (isset($fieldInfo['input'])) {
//                            $fieldModel->input = JsonHelper::encode($fieldInfo['input']);
//                        }
//
//                        if (isset($fieldInfo['html'])) {
//                            $fieldModel->html = JsonHelper::encode($fieldInfo['html']);
//                        }
//
//                        formbuilder()->fields->save($fieldModel);
//                    }
//
//                    if($transaction) {
//                        $transaction->commit();
//                    }
//
//                } catch (\Exception $e) {
//                    if($transaction) {
//                        $transaction->rollback();
//                    }
//
//                    throw $e;
//                }
//
//                unset($_POST['formbuilder']);
//            }
        });
    }

    /**
     * @inheritDoc IPlugin::onAfterInstall()
     *
     * @return void
     */
    public function onAfterInstall()
    {
        formbuilder()->groups->installDefaultGroups();
        formbuilder()->forms->installDefaultStatuses();
        formbuilder()->entries->installDefaultStatuses();

        craft()->request->redirect('/'.craft()->config->get('cpTrigger').'/formbuilder/dashboard');
    }

    public function onBeforeUninstall()
    {
        formbuilder()->forms->clearOutElementIndex();
        formbuilder()->entries->clearOutElementIndex();
    }


}


/**
 *
 * FormBuilder()->service->method()
 *
 * @return mixed
 */
function FormBuilder()
{
    return Craft::app()->getComponent('formBuilder');
}
