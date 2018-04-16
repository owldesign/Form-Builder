<?php
namespace Craft;

class FormBuilder_DashboardController extends BaseController
{
    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = true;
    
    public function actionIndex()
    {
        craft()->templates->includeJsResource('/formbuilder/js/dashboard.js');

        $groups = FormBuilder()->groups->getAllGroups();
        $forms = FormBuilder()->forms->getAllForms();

        $plugin = craft()->plugins->getPlugin('FormBuilder');

        // Plugin updates

        $userAgent = 'Craft/'.craft()->getVersion();
        $client = new \Guzzle\Http\Client();
        $client->setUserAgent($userAgent, true);
        $options = array(
            'timeout'         => 5,
            'connect_timeout' => 2,
            'allow_redirects' => true,
            'verify'          => false
        );
        $request = $client->get('https://raw.githubusercontent.com/roundhouse/FormBuilder-2-Craft-CMS/master/releases.json', null, $options);
        craft()->session->close();
        $response = $request->send();
        $responseBody = $response->getBody();
        $releases = JsonHelper::decode($responseBody);

        $this->renderTemplate('formbuilder/dashboard/index', array(
            'plugin' => $plugin,
            'groups' => $groups,
            'forms' => $forms,
            'updates' => $releases
        ));
    }
}