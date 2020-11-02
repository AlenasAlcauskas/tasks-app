import MaterialTable, {MTableToolbar} from 'material-table';
import React, {useState, useEffect} from 'react';
import {
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
} from '@material-ui/icons';
import {taskService} from '../../_services';
import {helper} from '../../_helpers';
import {useSnackbar} from 'notistack';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {format, isEqual, isBefore, isAfter} from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {Checkbox, Grid} from '@material-ui/core';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

export const TasksTable = ({classes, tasks, fetchTasks}) => {

    const {enqueueSnackbar} = useSnackbar();
    const today = format(new Date(), 'yyyy-MM-dd');
    const [dateFilters, setDateFilters] = useState({from: today, to: today});
    const [enabledFilters, setEnabledFilters] = useState({from: false, to: false});
    const [filteredTasks, setFilteredTasks] = useState(null);

    useEffect(() => {filterTasks(enabledFilters, dateFilters)}, [tasks]);

    const handleFilterEnabledChange = (name, checked) => {
        setEnabledFilters({...enabledFilters, [name]: checked});
        filterTasks({...enabledFilters, [name]: checked}, dateFilters);
    };

    const dateEditHandler = (id, date) => {
        let stringDate;
        try {
            stringDate = format(date, 'yyyy-MM-dd');
            setDateFilters({...dateFilters, [id]: stringDate});
            filterTasks(enabledFilters, {...dateFilters, [id]: stringDate});
        } catch (e) {
        }
    };

    const filterTasks = (enabled, dateFilters) => {

        let filteredTasks = [...tasks];

        if (enabled?.from) {
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.date);
                const filterDate = new Date(dateFilters.from);

                return isEqual(taskDate, filterDate) || isAfter(taskDate, filterDate);
            });
        }
        if (enabled?.to) {
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.date);
                const filterDate = new Date(dateFilters.to);

                return isEqual(taskDate, filterDate) || isBefore(taskDate, filterDate);
            });
        }

        setFilteredTasks(filteredTasks);
    };

    return <MaterialTable
        columns={[
            {title: 'Title', field: 'title'},
            {title: 'Comment', field: 'comment'},
            {title: 'Date', field: 'date'},
            {title: 'Time Spent (minutes)', field: 'timeSpent', type: 'numeric'},
        ]}

        data={filteredTasks ? filteredTasks : tasks}
        title={'Your tasks'}
        options={{
            actionsColumnIndex: -1,
            filtering: false,
            search: true,
            selection: false,
            grouping: false,
            defaultExpanded: true,
            draggable: false,
            sorting: true,
            exportButton: {
                csv: true,
                pdf: false,
            },
            exportCsv: (columns, data) => {
                const doc = new jsPDF();
                const newData = data.map(task => [task.title, task.comment, task.date, task.timeSpent]);

                newData.push(['', '', 'Total:', data.reduce((acc, current) => acc + current.timeSpent, 0)]);

                doc.autoTable({
                    head: [columns.map(c => c.title)],
                    body: newData
                });

                doc.save('Your_tasks.pdf');
            }
        }}
        localization={{
            toolbar: {
                exportCSVName: 'Export PDF'
            }
        }}
        icons={{
            AddBox: AddBox,
            SortArrow: ArrowDownward,
            Check: Check,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            FirstPage: FirstPage,
            LastPage: LastPage,
            NextPage: ChevronRight,
            PreviousPage: ChevronLeft,
            Search: Search,
            ThirdStateCheck: Remove,
            ResetSearch: Clear
        }}
        actions={[
            rowData => ({
                icon: DeleteOutline,
                tooltip: 'Delete task',
                onClick: () => taskService.deleteTask(rowData.id).then(response => {
                    fetchTasks();
                    helper.enqueueSuccessfulSnackbar(enqueueSnackbar, 'Successfully deleted task');
                })
            })
        ]}
        components={{
            Toolbar: props => (
                <div>
                    <MTableToolbar {...props} />
                    <div className={classes.tableToolbarSecondRow}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={1}>
                                <Grid item xs={1}>
                                    {'Date filters:'}
                                </Grid>
                                <Grid item xs={'auto'}>
                                    {'From: '}
                                    <Checkbox
                                        className={classes.tableDateFilterCheckbox}
                                        name={'enabledFrom'}
                                        checked={enabledFilters?.from}
                                        onChange={({target: {checked}}) => handleFilterEnabledChange('from', checked)}
                                    />
                                    <KeyboardDatePicker
                                        disabled={!enabledFilters?.from}
                                        id={'dateFrom'}
                                        className={classes.tableDateFilterDatePicker}
                                        clearable
                                        name={'dateFrom'}
                                        value={dateFilters?.from}
                                        onChange={(date) => dateEditHandler('from', date)}
                                        format='yyyy-MM-dd'
                                        autoOk
                                        disableFuture
                                    />
                                </Grid>
                                <Grid item xs={'auto'}>
                                    {'To: '}
                                    <Checkbox
                                        name={'enabledTo'}
                                        checked={enabledFilters?.to}
                                        onChange={({target: {checked}}) => handleFilterEnabledChange('to', checked)}
                                    />
                                    <KeyboardDatePicker
                                        disabled={!enabledFilters?.to}
                                        id={'dateTo'}
                                        className={classes.tableDateFilterDatePicker}
                                        clearable
                                        name={'dateTo'}
                                        value={dateFilters?.to}
                                        onChange={(date) => dateEditHandler('to', date)}
                                        format='yyyy-MM-dd'
                                        autoOk
                                        disableFuture
                                    />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
            ),
        }}
    />;
};