<?php

namespace Craft;

trait Routes
{
    public function registerCpRoutes()
    {
        return array(
            'formbuilder' => array('action' => 'formBuilder/dashboard/index'),
            'formbuilder/dashboard' => array('action' => 'formBuilder/dashboard/index'),
            'formbuilder/forms' => array('action' => 'formBuilder/form/index'),
            'formbuilder/forms/new' => array('action' => 'formBuilder/form/edit'),
            'formbuilder/forms/(?P<formId>\d+)' => array('action' => 'formBuilder/form/edit'),
            'formbuilder/entries' => array('action' => 'formBuilder/entry/index'),
            'formbuilder/entries/(?P<entryId>\d+)' => array('action' => 'formBuilder/entry/edit'),
            'formbuilder/templates' => 'formbuilderemailnotifications/templates',
            'formbuilder/templates/new' => array('action' => 'formBuilderEmailNotifications/template/edit'),
            'formbuilder/templates/(?P<templateId>\d+)' => array('action' => 'formBuilderEmailNotifications/template/edit'),
            'formbuilder/templates/(?P<templateId>\d+)/edit' => array('action' => 'formBuilderEmailNotifications/template/edit'),
            'formbuilder/settings' => array('action' => 'formBuilder/setting/index'),
        );
    }
}