EntriesIndex = Craft.BaseElementIndex.extend(
    getViewClass: (mode) ->
        switch mode
            when 'table'
                return EntriesTableView
            else
                return @base(mode)
    getDefaultSort: ->
        [
            'dateCreated'
            'desc'
        ]
)
Craft.registerElementIndexClass 'Formbuilder_Entry', EntriesIndex


EntriesTableView = Craft.TableElementIndexView.extend({
    startDate: null
    endDate: null

    startDatepicker: null
    endDatepicker: null

    $chartExplorer: null
    $totalValue: null
    $chartContainer: null
    $spinner: null
    $error: null
    $chart: null
    $startDate: null
    $endDate: null

    afterInit: ->
        @$explorerContainer = $('<div class="chart-explorer-container"></div>').prependTo(@$container)
        @createChartExplorer()
        @base()

    getStorage: (key) ->
        EntriesTableView.getStorage @elementIndex._namespace, key

    setStorage: (key, value) ->
        EntriesTableView.setStorage @elementIndex._namespace, key, value

    createChartExplorer: ->
        $chartExplorer = $('<div class="chart-explorer"></div>').appendTo(@$explorerContainer)
        $chartHeader = $('<div class="chart-header"></div>').appendTo($chartExplorer)
        $dateRange = $('<div class="date-range" />').appendTo($chartHeader)
        $startDateContainer = $('<div class="datewrapper"></div>').appendTo($dateRange)
        $to = $('<span class="to light">to</span>').appendTo($dateRange)
        $endDateContainer = $('<div class="datewrapper"></div>').appendTo($dateRange)
        $total = $('<div class="total"></div>').appendTo($chartHeader)
        $totalLabel = $('<div class="total-label light">' + Craft.t('Total Entries') + '</div>').appendTo($total)
        $totalValueWrapper = $('<div class="total-value-wrapper"></div>').appendTo($total)
        $totalValue = $('<span class="total-value">&nbsp;</span>').appendTo($totalValueWrapper)

        @$chartExplorer = $chartExplorer
        @$totalValue = $totalValue
        @$chartContainer = $('<div class="chart-container"></div>').appendTo($chartExplorer)
        @$spinner = $('<div class="spinner hidden" />').prependTo($chartHeader)
        @$error = $('<div class="error"></div>').appendTo(@$chartContainer)
        @$chart = $('<div class="chart"></div>').appendTo(@$chartContainer)
        @$startDate = $('<input type="text" class="text" size="20" autocomplete="off" />').appendTo($startDateContainer)
        @$endDate = $('<input type="text" class="text" size="20" autocomplete="off" />').appendTo($endDateContainer)
        @$startDate.datepicker $.extend({onSelect: $.proxy(this, 'handleStartDateChange')}, Craft.datepickerOptions)
        @$endDate.datepicker $.extend({onSelect: $.proxy(this, 'handleEndDateChange')}, Craft.datepickerOptions)
        @startDatepicker = @$startDate.data('datepicker')
        @endDatepicker = @$endDate.data('datepicker')
        @addListener @$startDate, 'keyup', 'handleStartDateChange'
        @addListener @$endDate, 'keyup', 'handleEndDateChange'
        startTime = @getStorage('startTime') or (new Date).getTime() - (60 * 60 * 24 * 7 * 1000)
        endTime = @getStorage('endTime') or (new Date).getTime()
        @setStartDate new Date(startTime)
        @setEndDate new Date(endTime)
        @loadReport()

    handleStartDateChange: ->
        if @setStartDate(EntriesTableView.getDateFromDatepickerInstance(@startDatepicker))
            console.log 'start date changed'
            @loadReport()

    handleEndDateChange: ->
        if @setEndDate(EntriesTableView.getDateFromDatepickerInstance(@endDatepicker))
            console.log 'end date changed'
            @loadReport()

    setStartDate: (date) ->
        if @startDate and date.getTime() == @startDate.getTime()
            false
        @startDate = date
        @setStorage 'startTime', @startDate.getTime()
        @$startDate.val Craft.formatDate(@startDate)

        if @endDate and @startDate.getTime() > @endDate.getTime()
            @setEndDate new Date(@startDate.getTime())
        true

    setEndDate: (date) ->
        if @endDate and date.getTime() == @endDate.getTime()
            false
        @endDate = date
        @setStorage 'endTime', @endDate.getTime()
        @$endDate.val Craft.formatDate(@endDate)

        if @startDate and @endDate.getTime() < @startDate.getTime()
            @setStartDate new Date(@endDate.getTime())
        true

    loadReport: ->
        requestData = @settings.params
        requestData.startDate = EntriesTableView.getDateValue(@startDate)
        requestData.endDate = EntriesTableView.getDateValue(@endDate)
        @$spinner.removeClass 'hidden'
        @$error.addClass 'hidden'
        @$chart.removeClass 'error'
        Craft.postActionRequest 'formBuilder/charts/getEntriesCount', requestData, $.proxy(((response, textStatus) ->
            @$spinner.addClass 'hidden'
            if textStatus == 'success' and typeof response.error == 'undefined'
                if !@chart
                    @chart = new (Craft.charts.Area)(@$chart)
                chartDataTable = new (Craft.charts.DataTable)(response.dataTable)
                chartSettings =
                    localeDefinition: response.localeDefinition
                    orientation: response.orientation
                    formats: response.formats
                    dataScale: response.scale
                @chart.draw chartDataTable, chartSettings
                @$totalValue.html response.totalHtml
            else
                msg = Craft.t('An unknown error occurred.')
                if typeof response != 'undefined' and response and typeof response.error != 'undefined'
                    msg = response.error
                @$error.html msg
                @$error.removeClass 'hidden'
                @$chart.addClass 'error'
            return
        ), this)
},
    storage: {}
    getStorage: (namespace, key) ->
        if EntriesTableView.storage[namespace] and EntriesTableView.storage[namespace][key]
            return EntriesTableView.storage[namespace][key]
        null
    setStorage: (namespace, key, value) ->
        if typeof EntriesTableView.storage[namespace] == typeof undefined
            EntriesTableView.storage[namespace] = {}
        EntriesTableView.storage[namespace][key] = value
    getDateFromDatepickerInstance: (inst) ->
        return new Date(inst.currentYear, inst.currentMonth, inst.currentDay)
    getDateValue: (date) ->
        return date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()
)


#Garnish.$doc.ready ->