<?php
namespace Craft;


class FormBuilder_NotesController extends BaseController
{
    protected $allowAnonymous = true;

    /**
     * Render navigation
     */
    public function actionSave()
    {
        $note               = new FormBuilder_NoteModel();
        $note->note         = craft()->request->getPost('note');
        $note->entryId      = craft()->request->getPost('entryId');
        $note->authorId     = craft()->userSession->getUser()->id;

        if (FormBuilder()->notes->save($note)) {
            $user = $note->getAuthor();

            $this->returnJson(array(
                'success'   => true,
                'note'      => $note,
                'user'      => array(
                    'id'        => $user->id,
                    'fullName'  => $user->getName()
                )
            ));
        } else {
            $this->returnJson(array(
                'success'   => false,
                'errors'    => $note->getErrors()
            ));
        }

    }

}