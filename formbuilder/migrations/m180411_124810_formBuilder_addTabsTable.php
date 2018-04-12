<?php

namespace Craft;

class m180411_124810_formBuilder_addTabsTable extends BaseMigration
{
    public function safeUp()
    {
        craft()->db->createCommand()->createTable('formbuilder_tabs', array(
            'name'          => array('column' => ColumnType::Varchar),
            'tabId'         => array('column' => ColumnType::Int),
            'layoutId'      => array('column' => ColumnType::Int),
            'formId'        => array('column' => ColumnType::Int),
            'options'       => array('column' => ColumnType::Text)
        ), null, true);

        craft()->db->createCommand()->addForeignKey('formbuilder_tabs', 'formId', 'formbuilder_forms', 'id', 'CASCADE', null);
        craft()->db->createCommand()->addForeignKey('formbuilder_tabs', 'layoutId', 'fieldlayouts', 'id', 'CASCADE', null);
        craft()->db->createCommand()->addForeignKey('formbuilder_tabs', 'tabId', 'fieldlayouttabs', 'id', 'CASCADE', null);

        return true;
    }
}