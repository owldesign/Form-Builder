<?php
namespace Craft;


class FormBuilder_EntryElementType extends BaseElementType
{
    /**
     * @inheritDoc IComponentType::getName()
     *
     * @return string
     */
    public function getName()
    {
        return Craft::t('Form Builder Entries');
    }

    /**
     * @inheritDoc IElementType::hasContent()
     *
     * @return bool
     */
    public function hasContent()
    {
        return true;
    }

    /**
     * @inheritDoc IElementType::hasTitles()
     *
     * @return bool
     */
    public function hasTitles()
    {
        return true;
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
        $statuses    = formbuilder()->entries->getAllStatuses();
        $statusArray = array();

        foreach ($statuses as $status) {
            $key = $status['handle'] . ' ' . $status['color'];
            $statusArray[$key] = $status['name'];
        }

        return $statusArray;
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

            $query->andWhere(DbHelper::parseParam('entrystatuses.handle', $handle, $query->params));
        }
    }

    /**
     * @inheritDoc IElementType::getSources()
     *
     * @param null $context
     *
     * @return array|bool|false
     */
    public function getSources($context = null)
    {
        $sources = array(
            '*' => array(
                'label' => Craft::t('All Entries'),
            ),
        );

        foreach (formbuilder()->forms->getAllForms() as $form) {
            $key = 'formId:' . $form->id;
            $sources[$key] = array(
                'label'    => $form->name,
                'criteria' => array('formId' => $form->id)
            );
        }

        return $sources;
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
                'confirmationMessage'   => Craft::t('Are you sure you want to delete selected entries?'),
                'successMessage'        => Craft::t('Entries deleted.'),
                'failMessage'           => Craft::t('Cannot delete entries.'),
            )
        );

        $setStatusAction = craft()->elements->getAction('FormBuilder_SetEntryStatus');

        $actions[] = $deleteAction;
        $actions[] = $setStatusAction;

        return $actions;
    }

    /**
     * @inheritDoc IElementType::defineSortableAttributes()
     *
     * @return array
     */
    public function defineSortableAttributes()
    {
        $attributes = array(
            'title'         => Craft::t('Title'),
            'statusId'      => Craft::t('Status'),
            'formId'        => Craft::t('Form'),
            'dateCreated'   => Craft::t('Date Submitted')
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
            'title'         => array('label' => Craft::t('Title')),
            'statusId'      => array('label' => Craft::t('Status')),
            'formId'        => array('label' => Craft::t('Forms')),
            'dateCreated'   => array('label' => Craft::t('Date Submitted'))
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
        $attributes[] = 'formId';
        $attributes[] = 'dateCreated';

        if ($source == '*') {
            $attributes[] = 'title';
        }

        return $attributes;
    }

    /**
     * @inheritDoc IElementType::getTableAttributeHtml()
     *
     * @param BaseElementModel $element
     * @param string           $attribute
     *
     * @return mixed|null|string
     */
    public function getTableAttributeHtml(BaseElementModel $element, $attribute)
    {
        switch ($attribute) {
            case 'formId': {
                $element->getFormDetails();
                return $element->formId;
            }
            default:
                return parent::getTableAttributeHtml($element, $attribute);
                break;
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
            'statusId'          => AttributeType::Number,
            'formId'            => AttributeType::Number,
            'dateCreated'       => AttributeType::Mixed,
            'order'             => array(AttributeType::String, 'default' => 'dateCreated desc'),
        );
    }

    /**
     * @inheritDoc IElementType::modifyElementsQuery()
     *
     * @param DbCommand            $query
     * @param ElementCriteriaModel $criteria
     *
     * @return bool|false|null|void
     */
    public function modifyElementsQuery(DbCommand $query, ElementCriteriaModel $criteria)
    {
        $select =
            'entries.id,
            entries.formId,
            entries.statusId,
            entries.ipAddress,
            entries.userAgent,
            entries.dateCreated,
			entries.dateUpdated';

        $query->join('formbuilder_entries entries', 'entries.id = elements.id')
            ->join('formbuilder_forms forms', 'forms.id = entries.formId')
            ->join('formbuilder_entrystatuses entrystatuses', 'entrystatuses.id = entries.statusId');

        $query->addSelect($select);

        if ($criteria->id) {
            $query->andWhere(DbHelper::parseParam('entries.id', $criteria->id, $query->params));
        }

        if ($criteria->formId) {
            $query->andWhere(DbHelper::parseParam('entries.formId', $criteria->formId, $query->params));
        }

        if ($criteria->statusId) {
            $query->andWhere(DbHelper::parseParam('entries.statusId', $criteria->statusId, $query->params));
        }

        if ($criteria->dateCreated) {
            $query->andWhere(DbHelper::parseParam('entries.dateCreated', $criteria->dateCreated, $query->params));
        }

        if ($criteria->order) {
            if (stripos($criteria->order, 'elements.') === false) {
                $criteria->order = str_replace('dateCreated', 'entries.dateCreated', $criteria->order);
                $criteria->order = str_replace('dateUpdated', 'entries.dateUpdated', $criteria->order);
            }

            if (stripos($criteria->order, 'title') !== false && !$criteria->formId) {
                $criteria->order = null;
            }
        }
    }

    /**
     * @inheritDoc IElementType::getEditorHtml()
     *
     * @param BaseElementModel $element
     *
     * @return string
     */
    public function getEditorHtml(BaseElementModel $element)
    {
        $html = '';

        $fieldLayout = $element->getFieldLayout();

        if ($fieldLayout)
        {
            $originalNamespace = craft()->templates->getNamespace();
            $namespace = craft()->templates->namespaceInputName('fields', $originalNamespace);
            craft()->templates->setNamespace($namespace);

            foreach ($fieldLayout->getFields() as $fieldLayoutField)
            {
                $fieldHtml = craft()->templates->render('_includes/field', array(
                    'element'  => $element,
                    'field'    => $fieldLayoutField->getField(),
                    'required' => $fieldLayoutField->required
                ));

                $html .= craft()->templates->namespaceInputs($fieldHtml, 'fields');
            }

            craft()->templates->setNamespace($originalNamespace);
        }

        return $html;
    }

    /**
     * @inheritDoc IElementType::populateElementModel()
     *
     * @param array $row
     *
     * @return BaseElementModel|BaseModel|void
     */
    public function populateElementModel($row)
    {
        $entry = FormBuilder_EntryModel::populateModel($row);

        return $entry;
    }
}