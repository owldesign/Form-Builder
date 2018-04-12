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
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-regular.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-light.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fa-solid.min.js');
        craft()->templates->includeJsResource('/formbuilder/js/fontawesome/fontawesome.js');

        craft()->templates->includeCssResource('/formbuilder/css/formbuilder.css');
        craft()->templates->includeJsResource('/formbuilder/js/formbuilder.js');
        craft()->templates->includeJsResource('/formbuilder/js/dashboard.js');

        $groups = FormBuilder()->groups->getAllGroups();
        $forms = FormBuilder()->forms->getAllForms();

        $plugin = craft()->plugins->getPlugin('FormBuilder');

        $this->renderTemplate('formbuilder/dashboard/index', array(
            'plugin' => $plugin,
            'groups' => $groups,
            'forms' => $forms
        ));
    }
}