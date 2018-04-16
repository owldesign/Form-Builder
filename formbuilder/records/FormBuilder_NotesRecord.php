<?php
namespace Craft;


class FormBuilder_NotesRecord extends BaseRecord
{
    /**
     * @return string
     */
    public function getTableName()
    {
        return 'formbuilder_entries_notes';
    }


    /**
     * @return array
     */
    public function defineRelations()
    {
        return array(
            'entry' => array(static::BELONGS_TO, 'FormBuilder_EntryRecord', 'required' => true, 'onDelete' => static::CASCADE),
            'author' => array(static::BELONGS_TO, 'UserRecord', 'required' => true, 'onDelete' => static::SET_NULL)
        );
    }

    /**
     * @return array
     */
    public function scopes()
    {
        return array(
            'ordered' => array('order' => 'dateCreated desc'),
        );
    }

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'note'      => AttributeType::Mixed,
            'entryId'  => AttributeType::Number,
            'authorId'  => AttributeType::Number
        );
    }
}