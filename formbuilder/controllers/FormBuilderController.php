<?php
namespace Craft;


class FormBuilderController extends BaseController
{
    protected $allowAnonymous = true;

    /**
     * Render navigation
     */
    public function actionRenderNavigation()
    {
        $title = craft()->request->getPost('title');

        $variables['title'] = $title;
        $markup = craft()->templates->render('formbuilder/_includes/_navigation', $variables);

        $this->returnJson(array(
            'success'   => true,
            'markup'    => $markup
        ));
    }

}