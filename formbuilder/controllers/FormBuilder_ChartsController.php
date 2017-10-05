<?php
namespace Craft;

class FormBuilder_ChartsController extends ElementIndexController
{
    /**
     * Get entries data for the chart
     */
    public function actionGetEntriesCount()
    {
        $startDateParam = craft()->request->getRequiredPost('startDate');
        $endDateParam = craft()->request->getRequiredPost('endDate');

        $startDate = DateTime::createFromString($startDateParam, craft()->timezone);
        $endDate = DateTime::createFromString($endDateParam, craft()->timezone);
        $endDate->modify('+1 day');

        $intervalUnit = ChartHelper::getRunChartIntervalUnit($startDate, $endDate);
        $criteria = $this->getElementCriteria();
        $criteria->limit = null;
        $criteria->search = null;

        $query = craft()->elements->buildElementsQuery($criteria)
            ->select('COUNT(*) as value');


        $dataTable = ChartHelper::getRunChartDataFromQuery($query, $startDate, $endDate,
            'entries.dateCreated',
            [
                'intervalUnit' => $intervalUnit,
                'valueLabel' => Craft::t('Entries'),
                'valueType' => 'number',
            ]
        );

        $total = 0;

        foreach($dataTable['rows'] as $row) {
            $total = $total + $row[1];
        }

        $this->returnJson([
            'dataTable' => $dataTable,
            'total' => $total,
            'totalHtml' => $total,

            'formats' => ChartHelper::getFormats(),
            'orientation' => craft()->locale->getOrientation(),
            'scale' => $intervalUnit
        ]);
    }
}