<?php

namespace Craft;

class m180411_121010_formBuilder_updateFieldsTableTable extends BaseMigration
{
    public function safeUp()
    {
        $this->dropColumn('formbuilder_fields', 'input');
        $this->dropColumn('formbuilder_fields', 'html');
        $this->dropColumn('formbuilder_fields', 'template');
        $this->dropColumn('formbuilder_fields', 'settings');

        $this->addColumn('formbuilder_fields','options', ColumnType::Text);
        $this->addColumn('formbuilder_fields','formId', ColumnType::Int);

        craft()->db->createCommand()->addForeignKey('formbuilder_fields', 'formId', 'formbuilder_forms', 'id', 'CASCADE', null);

        return true;
    }
}