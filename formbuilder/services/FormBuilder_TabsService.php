<?php
namespace Craft;


class FormBuilder_TabsService extends BaseApplicationComponent
{
    // Properties
    // =========================================================================


    // Public Methods
    // =========================================================================

    /**
     * Get all tabs
     *
     * @return array
     */
    public function getTabs()
    {
        $output = [];
        $tabs = FieldLayoutTabRecord::model()->findAll();

        foreach ($tabs as $key => $tab) {
            $output[(int) $tab->id] = array(
                'id'            => (int) $tab->id,
                'name'          => $tab->name,
                'layoutId'      => $tab->layoutId
            );
        }

        return $output;
    }

    /**
     * Get all tab options
     *
     * @return array
     */
    public function getAllTabOptions()
    {
        $tabs = $this->_getAllTabOptions();
        $output = [];

        foreach ($tabs as $tab) {
            $output[$tab->tabId] = array(
                'layoutId' => $tab->layoutId,
                'tabId' => $tab->tabId,
                'options' => $tab->options
            );
        }

        return $output;
    }

    public function getTabSettings($tabId)
    {
        $tabRecord = FormBuilder_TabRecord::model()->findByAttributes(array(
            'tabId' => $tabId
        ));

        if ($tabRecord) {
            $tabRecord->options = JsonHelper::decode($tabRecord->options);

        }

        return $tabRecord;
    }

    // Private Methods
    // =========================================================================

    private function _getAllTabOptions()
    {
        $tabs = FormBuilder_TabRecord::model()->findAll();

        return $tabs;
    }
}