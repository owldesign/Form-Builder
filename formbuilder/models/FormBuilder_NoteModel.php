<?php
namespace Craft;

class FormBuilder_NoteModel extends BaseElementModel
{

    public $author;

    /**
     * @access protected
     * @return array
     */
    protected function defineAttributes()
    {
        return array(
            'id'            => AttributeType::Number,
            'note'          => AttributeType::Mixed,
            'entryId'       => AttributeType::Number,
            'authorId'      => AttributeType::Number,
            'dateCreated'   => AttributeType::DateTime
        );
    }

    /**
     * Get author by author ID
     *
     * @return UserModel|null
     */
    public function getAuthor()
    {
        return craft()->users->getUserById($this->authorId);
    }

}