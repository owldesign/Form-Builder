<?php
namespace Craft;

class FormBuilder_FormElementType extends BaseElementType
{
    /**
     * @inheritDoc IComponentType::getName()
     *
     * @return string
     */
    public function getName()
    {
        return Craft::t('Form Builder Forms');
    }

    /**
     * @inheritDoc IElementType::hasContent()
     *
     * @return bool
     */
    public function hasContent()
    {
        return false;
    }

    /**
     * @inheritDoc IElementType::isLocalized()
     *
     * @return bool
     */
    public function isLocalized()
    {
        return false;
    }

    /**
     * @inheritDoc IElementType::hasStatuses()
     *
     * @return bool
     */
    public function hasStatuses()
    {
        return true;
    }

    /**
     * @inheritDoc IElementType::getStatuses()
     *
     * @return array|null
     */
    public function getStatuses()
    {
        $statuses    = formbuilder()->forms->getAllStatuses();
        $statusArray = array();

        foreach ($statuses as $status) {
            $key = $status['handle'] . ' ' . $status['color'];
            $statusArray[$key] = $status['name'];
        }

        return $statusArray;
    }

    /**
     * @param null $context
     * @return array
     */
    public function getSources($context = null)
    {
        $sources = array(
            '*' => array(
                'label' => Craft::t('All Forms'),
            )
        );

        $groups = formbuilder()->groups->getAllGroups();

        foreach ($groups as $group) {
            $key = 'group:' . $group->id;
            if (isset($group->settings['icon'])) {
                $icon = $group->settings['icon']['name'];
            } else {
                $icon = null;
            }

            $sources[$key] = array(
                'label'    => Craft::t($group->name),
                'icon'     => $icon,
                'data'     => array('id' => $group->id),
                'criteria' => array('groupId' => $group->id)
            );
        }

        return $sources;
    }

    /**
     * @inheritDoc IElementType::defineSearchableAttributes()
     *
     * @return array
     */
    public function defineSearchableAttributes()
    {
        return array('name','handle');
    }

    /**
     * @inheritDoc IElementType::getAvailableActions()
     *
     * @param string|null $source
     *
     * @return array|null
     */
    public function getAvailableActions($source = null)
    {
        $actions = array();

        $deleteAction = craft()->elements->getAction('FormBuilder_Delete');

        $deleteAction->setParams(
            array(
                'confirmationMessage'   => Craft::t('Are you sure you want to delete selected forms and its entries?'),
                'successMessage'        => Craft::t('Form and entries deleted.'),
                'failMessage'           => Craft::t('Cannot delete form.'),
            )
        );

        $actions[] = $deleteAction;

        return $actions;
    }

    /**
     * @param null $source
     * @return array
     */
    public function defineTableAttributes($source = null)
    {
        $attributes = array(
            'name'           => Craft::t('Name'),
            'handle'         => Craft::t('Handle'),
            'groupId'        => Craft::t('Group'),
            'totalEntries'   => Craft::t('Total Entries'),
            'twig'           => Craft::t('Twig Snippet')
        );

        return $attributes;
    }

    /**
     * @inheritDoc IElementType::defineSortableAttributes()
     *
     * @return array
     */
    public function defineSortableAttributes()
    {
        $attributes = array(
            'statusId'       => Craft::t('Status'),
            'name'           => Craft::t('Name'),
            'handle'         => Craft::t('Handle'),
            'groupId'        => Craft::t('Group'),
            'totalEntries'   => Craft::t('Total Entries')
        );

        return $attributes;
    }

    /**
     * @inheritDoc IElementType::defineAvailableTableAttributes()
     *
     * @return array
     */
    public function defineAvailableTableAttributes()
    {
        $attributes = array(
            'name'           => array('label' => Craft::t('Name')),
            'handle'         => array('label' => Craft::t('Handle')),
            'groupId'        => array('label' => Craft::t('Group')),
            'totalEntries'   => array('label' => Craft::t('Total Entries')),
            'twig'           => array('label' => Craft::t('Twig Snippet'))
        );

        return $attributes;
    }

    /**
     * @inheritDoc IElementType::getDefaultTableAttributes()
     *
     * @param string|null $source
     *
     * @return array
     */
    public function getDefaultTableAttributes($source = null)
    {
        $attributes = array();

        $attributes[] = 'statusId';
        $attributes[] = 'name';
        $attributes[] = 'handle';
        $attributes[] = 'groupId';
        $attributes[] = 'totalEntries';
        $attributes[] = 'twig';

        return $attributes;
    }

    /**
     * @inheritDoc IElementType::getTableAttributeHtml()
     *
     * @param BaseElementModel $element
     * @param string           $attribute
     *
     * @return string
     *
     * TODO: separate each case to a function service
     */
    public function getTableAttributeHtml(BaseElementModel $element, $attribute)
    {
        switch ($attribute) {
            case 'statusId': {
                $element->getEntryStatus();
                return $element->statusId;
            }

            case 'handle': {
                return '<span class="copy-handle" data-handle="' . $element->handle . '"  data-clipboard-text="' . $element->handle . '">
                            <code>' . $element->handle . '</code>
                            <span class="icon">
                                <i class="far fa-copy"></i>
                            </span>
                        </span>';
            }

            case 'totalEntries': {
                $totalEntries = craft()->db->createCommand()
                    ->select('COUNT(*)')
                    ->from('formbuilder_entries')
                    ->where('formId=:formId', array(':formId' => $element->id))
                    ->queryScalar();

                return $totalEntries;
            }

            case 'groupId': {
                return formbuilder()->groups->getGroupById($element->groupId);
            }

            case 'twig': {
                return '<span class="twig-snippet" data-handle="'. $element->handle . '"  data-clipboard-text="'. $element->handle . '">
                            <code>' . Craft::t("Click to copy") . '<span class="icon"><i class="far fa-copy"></i></span></code>
                        </span>';
            }

            default: {
                return parent::getTableAttributeHtml($element, $attribute);
            }
        }
    }

    /**
     * @inheritDoc IElementType::defineCriteriaAttributes()
     *
     * @return array
     */
    public function defineCriteriaAttributes()
    {
        return array(
            'statusId'       => AttributeType::Number,
            'name'           => AttributeType::String,
            'handle'         => AttributeType::String,
            'groupId'        => AttributeType::Number,
            'totalEntries'   => array(AttributeType::Number, 'default' => 'totalEntries'),
            'fieldLayoutId'  => AttributeType::Number
        );
    }

    /**
     * @param DbCommand $query
     * @param string $status
     *
     * * @return array|false|string|void
     */
    public function getElementQueryStatusCondition(DbCommand $query, $status)
    {
        $statusClasses = explode(' ', $status);
        if (count($statusClasses)>0) {
            $handle = $statusClasses[0];

            $query->andWhere(DbHelper::parseParam('formstatuses.handle', $handle, $query->params));
        }
    }

    /**
     * @inheritDoc IElementType::modifyElementsQuery()
     *
     * @param DbCommand            $query
     * @param ElementCriteriaModel $criteria
     *
     * @return mixed
     */
    public function modifyElementsQuery(DbCommand $query, ElementCriteriaModel $criteria)
    {
        $query
            ->addSelect('forms.id, forms.statusId, forms.name, forms.handle, forms.groupId, forms.fieldLayoutId, forms.options, forms.spam, forms.notifications, forms.settings')
            ->join('formbuilder_forms forms', 'forms.id = elements.id')
            ->join('formbuilder_formstatuses formstatuses', 'formstatuses.id = forms.statusId');

        if ($criteria->statusId) {
            $query->andWhere(DbHelper::parseParam('forms.statusId', $criteria->statusId, $query->params));
        }

        if ($criteria->totalEntries) {
            $query->addSelect('COUNT(entries.id) totalEntries');
            $query->leftJoin('formbuilder_entries entries', 'entries.formId = forms.id');
        }

        if ($criteria->groupId) {
            $query->join('formbuilder_groups groups', 'groups.id = forms.groupId');
            $query->andWhere(DbHelper::parseParam('forms.groupId', $criteria->groupId, $query->params));
        }

        if ($criteria->handle) {
            $query->andWhere(DbHelper::parseParam('forms.handle', $criteria->handle, $query->params));
        }
    }

    /**
     * @inheritDoc IElementType::populateElementModel()
     *
     * @param array $row
     *
     * @return array
     */
    public function populateElementModel($row)
    {
        return FormBuilder_FormModel::populateModel($row);
    }

    /**
     * @inheritDoc IElementType::getEditorHtml()
     *
     * @param BaseElementModel $element
     *
     * @return string
     */
//    public function getEditorHtml(BaseElementModel $element)
//    {
//        if ($element->getType()->hasTitleField) {
//            $html = craft()->templates->render('_cp/fields/titlefield', array(
//                'entry' => $element
//            ));
//        } else {
//            $html = '';
//        }
//
//        $html .= parent::getEditorHtml($element);
//
//        return $html;
//
//    }
}