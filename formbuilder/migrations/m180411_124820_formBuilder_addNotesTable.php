<?php

namespace Craft;

class m180411_124820_formBuilder_addNotesTable extends BaseMigration
{
    public function safeUp()
    {
        craft()->db->createCommand()->createTable('formbuilder_entries_notes', array(
            'note'          => array('column' => ColumnType::Text),
            'entryId'       => array('column' => ColumnType::Int),
            'authorId'      => array('column' => ColumnType::Int)
        ), null, true);

        craft()->db->createCommand()->addForeignKey('formbuilder_entries_notes', 'formId', 'formbuilder_entries', 'id', 'CASCADE', null);
        craft()->db->createCommand()->addForeignKey('formbuilder_entries_notes', 'authorId', 'users', 'id', 'CASCADE', null);

        return true;
    }
}