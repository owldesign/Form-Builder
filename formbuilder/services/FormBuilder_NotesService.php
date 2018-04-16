<?php
namespace Craft;


class FormBuilder_NotesService extends BaseApplicationComponent
{

    // Public Methods
    // =========================================================================

    /**
     * Get notes
     *
     * @param $entryId
     * @return array
     */
    public function getNotes($entryId)
    {
        $query = craft()->getDb()->createCommand()
            ->select('*')
            ->from('formbuilder_entries_notes')
            ->where(array(
                'entryId' => $entryId
            ))
            ->order('dateCreated DESC')
            ->queryAll();

        return FormBuilder_NoteModel::populateModels($query);
    }

    /**
     * Save note
     *
     * @param $note
     * @return bool
     * @throws \Throwable
     */
    public function save($note)
    {
        $note->validate();

        if ($note->hasErrors()) {
            return false;
        }

        $noteRecord             = new FormBuilder_NotesRecord();
        $noteRecord->note       = $note->note;
        $noteRecord->entryId    = $note->entryId;
        $noteRecord->authorId   = $note->authorId;

        $transaction = craft()->db->getCurrentTransaction() ? false : craft()->db->beginTransaction();

        try {
            $noteRecord->save(false);
            $note->id = $noteRecord->id;

            $transaction->commit();
        } catch (\Throwable $e) {
            $transaction->rollback();

            throw $e;
        }

        return true;
    }
}