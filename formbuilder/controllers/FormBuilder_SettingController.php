<?php
namespace Craft;


class FormBuilder_SettingController extends BaseController
{
    // Properties
    // =========================================================================

    public $integrations = array();

    // Public Methods
    // =========================================================================

    /**
     * Settings index
     *
     * Includes integrations
     *
     */
    public function actionIndex()
    {
        // Integrations

        // Email
        $emailNotificationsPlugin = craft()->plugins->getPlugin('FormBuilderEmailNotifications', false);
        $this->_integration($emailNotificationsPlugin, 'Email Notifications', '1.0.0', 'http://download.com', true);

        // Slack
        $slackNotificationsPlugin = craft()->plugins->getPlugin('FormBuilderSlackNotifications', false);
        $this->_integration($slackNotificationsPlugin, 'Slack Notifications', '1.0.0', 'http://download.com', true);

        // Salesforce
        $salesforce = craft()->plugins->getPlugin('FormBuilderSalesforce', false);
        $this->_integration($salesforce, 'Salesforce', '1.0.0', 'http://download.com', false);

        // Mailchimp
        $mailchimp = craft()->plugins->getPlugin('FormBuilderMailchimp', false);
        $this->_integration($mailchimp, 'Mailchimp', '1.0.0', 'http://download.com', false);

        // Constant Contact
        $constantContact = craft()->plugins->getPlugin('FormBuilderConstantContact', false);
        $this->_integration($constantContact, 'Constant Contact', '1.0.0', 'http://download.com', false);

        // Formstack
        $formstack = craft()->plugins->getPlugin('FormBuilderFormstack', false);
        $this->_integration($formstack, 'Formstack', '1.0.0', 'http://download.com', false);


        $plugin = craft()->plugins->getPlugin('FormBuilder');
        $settings = $plugin->getSettings();

        $variables['settings']      = $settings;
        $variables['plugin']        = $plugin;
        $variables['integrations']  = $this->integrations;

        $this->renderTemplate('formbuilder/settings/index', $variables);
    }

    /**
     * Save plugin's settings
     *
     * @throws Exception
     */
    public function actionSave()
    {
        $this->requirePostRequest();
        $settings = array();
        $pluginName = craft()->request->getPost('pluginName');
        $canDoActions = craft()->request->getPost('canDoActions');
        $unreadNotifications = craft()->request->getPost('unreadNotifications');
        $settings['pluginName'] = $pluginName;
        $settings['canDoActions'] = $canDoActions;
        $settings['unreadNotifications'] = $unreadNotifications;

        $plugin = craft()->plugins->getPlugin('FormBuilder');
        if (!$plugin) {
            throw new Exception(Craft::t('No plugin exists with the class “{class}”', array('class' => $plugin)));
        }

        if (craft()->plugins->savePluginSettings($plugin, $settings)) {
            craft()->userSession->setNotice(Craft::t('Plugin settings saved.'));
            $this->redirectToPostedUrl();
        }

        craft()->userSession->setError(Craft::t('Couldn’t save plugin settings.'));

        // Send the plugin back to the email
        craft()->urlManager->setRouteVariables(array(
            'settings' => $settings
        ));
    }

    // Private Methods
    // =========================================================================

    private function _integration($plugin, $name, $version, $downloadUrl, $available)
    {
        $this->integrations[StringHelper::toCamelCase($name)] = array(
            'plugin'        => $plugin,
            'name'          => $name,
            'version'       => $version,
            'downloadUrl'   => $downloadUrl,
            'available'     => $available
        );
    }

}