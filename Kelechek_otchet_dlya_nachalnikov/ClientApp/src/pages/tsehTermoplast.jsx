// in src/tsehTermoplast.js
import * as DecimalJS from 'decimal.js';
import React from "react";
import _uniqueId from 'lodash/uniqueId';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './../components/css/custom.css';
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import {
    List,
    Datagrid,
    Edit,
    Create,
    TextField,
    DateField,
    ShowButton,
    Show,
    SimpleShowLayout,
    BooleanField,
    usePermissions
} from 'react-admin';
import axios from 'axios';
import { Row, Col, Container, Form } from 'react-bootstrap';
import { CONSTANTS } from '../Constants.jsx';

import StickyTable from "../components/StickyTable.jsx";
import PrintReportTemplate from "../components/PrintReportTemplate.jsx";

import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

//import { ComponentToPrintFake } from './ComponentToPrint';

const CustomShowButton = ({ record }) => {
    return (
        <ShowButton basePath={CONSTANTS.PathToTsehTermoplast} record={record} onClick={(e) => {
            localStorage.setItem('reportId', record.id)
        }} />
    )
}

export const ListTsehTermoplast = props => (
    <List {...props} title={CONSTANTS.TitleForTsehTermoplast}>
        <Datagrid>
            <DateField source="date" label="Дата" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} locales="ru" />
            <TextField source="title" label="Заглавие" />
            <BooleanField source="status" label="Статус" valueLabelTrue="Проверено" valueLabelFalse="В ожидании" />
            <CustomShowButton />
        </Datagrid>
    </List>
);

export const CreateTsehTermoplast = props => (
    <Create {...props} title={CONSTANTS.TitleForTsehTermoplast}>
        <CreateInfo />
    </Create>
);

class MyCreateInputField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
        let newObj = {
            value: event.target.value,
            rowId: this.props.id,
            colId: this.props.columnId,
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Form.Control className="m-0" type="number" style={{ padding: "0", margin: "0" }} id={idValue} value={this.state.value} onChange={this.handleChange} />
        );
    }
}

class ResultInputField extends React.Component {
    render() {
        return (
            <div key={this.props.resultValue}>{this.props.resultValue}</div>
        );
    }
}

export class CreateInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thead: [],
            balanceOperationNumbers: [],
            balanceCalculationSigns: [],
            balanceAtTheEndIndex: 0,
            report: [],
            reportStandards: [],
            reportColumns: [],
            reportItems: [],
            monthlyBalances: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1),
            amountFromLosses: []
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    fillTableBody() {
        let tbody = [];
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportStandards = this.state.reportStandards;

        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
            let childrenTB = []

            let monthlyBalanceValue = monthlyBalances.find(element => element.order === xCoordinatePosition)
            let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{monthlyBalanceValue.residualBalance}</td>);
            this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast] = monthlyBalanceValue.residualBalance;
            //this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
            for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {


                let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)

                //let reportColumnValue = reportColumns.find(element => element.order === yCoordinatePosition && element.responsibleAreaId === reportStandards[0].responsibleAreaId);                
                if (reportColumnValue.order === CONSTANTS.LossValueColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.LossValueColumnOrderOfTsehTermoplast) {
                    let lossValue = reportStandards.find(element => element.reportItemId === reportItemValue.id).value;
                    childrenTB.push(<td>{lossValue}</td>);
                    //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + yCoordinatePosition);
                    this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehTermoplast] = lossValue;

                } else if (reportColumnValue.order === CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast) {
                    //console.log("INSIDEtOTALArrival", reportColumnValue);
                    childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast]} onResultValueChange={this.handleResultValueChange} /></td>);

                } else if (reportColumnValue.order === CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast) {

                    childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast]} onResultValueChange={this.handleResultValueChange} /></td>);

                } else if (reportColumnValue.order === CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast) {

                    childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast]} onResultValueChange={this.handleResultValueChange} /></td>);

                } else if (reportColumnValue.order === yCoordinatePosition) {
                    childrenTB.push(<td className="px-0 py-auto"><MyCreateInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} onValueChange={this.handleValueChange} /></td>);

                } else {

                }

                this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
                this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
                this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast]).plus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast]).minus(this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast])).valueOf();
            }

            tbody.push(<tr>{childrenTB}</tr>)
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseFloat(target.value);

        tempArray[targetRowId][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
        tempArray[targetRowId][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
        tempArray[targetRowId][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast]).minus(tempArray[targetRowId][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast])).valueOf();

        this.setState({
            balanceOperationNumbers: tempArray
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let postData = [];
        let postMonthlyBalance = [];
        let currentMonth = this.state.currentMonth - 1;
        let reportDate = new Date((new Date).setMonth(currentMonth));

        //console.log("this.state.currentMonth", this.state.currentMonth);
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log                

        let postReport = {
            responsibleAreaId: monthlyBalances[0].responsibleAreaId,
            date: reportDate,
            title: CONSTANTS.TitleForTsehTermoplast,
            memberId: parseInt(userId)
        }

        //console.log("reportDate", reportDate)
        axios
            .post(CONSTANTS.PathToReportsController, postReport)
            .then(response => {
                let data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);
                let newStoredReportId = data.id;

                for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                    let monthlyBalanceObject = [];
                    let reportItemValue = reportItems.filter(element => element.responsibleAreaId == monthlyBalances[0].responsibleAreaId).find(element => element.order == xCoordinatePosition);

                    for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length - 1; yCoordinatePosition++) {

                        let reportColumnValue = reportColumns.filter(r => r.responsibleAreaId == monthlyBalances[0].responsibleAreaId).find(r => r.order == yCoordinatePosition);

                        let reportDataObject = {
                            reportId: newStoredReportId,
                            reportItemId: reportItemValue.id,
                            data: this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition],
                            reportColumnId: reportColumnValue.id
                        }
                        postData.push(reportDataObject);

                    }

                    //console.log(reportDate);
                    monthlyBalanceObject = {
                        memberId: parseInt(userId),
                        initialBalance: monthlyBalances[xCoordinatePosition].residualBalance,
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast],
                        date: reportDate,
                        order: xCoordinatePosition,
                        reportItemId: reportItems[xCoordinatePosition].id,
                        reportId: newStoredReportId,
                        responsibleAreaId: monthlyBalances[0].responsibleAreaId
                    }
                    postMonthlyBalance.push(monthlyBalanceObject);

                }
                function postMonthlyBalanceFunc() {
                    return axios.post(CONSTANTS.PathToMonthlyBalancesController, postMonthlyBalance);
                }
                function postDataFunc() {
                    return axios.post(CONSTANTS.PathToReportDatasController, postData);
                }

                Promise.all([postMonthlyBalanceFunc(), postDataFunc()])
                    .then(function (results) {
                        //let data = JSON.parse(JSON.stringify(results.data));
                        //console.log("results", results);
                        toast.success(CONSTANTS.MessageUpdatedSuccessfully, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        window.location.href = '../';
                    })
                    .catch(function (error) {
                        toast.error(CONSTANTS.MessageError, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        if (error.response) {
                            console.log("Error response: " + error.response);
                            //do something

                        } else if (error.request) {
                            console.log("Error request: " + error.request);
                            //do something else

                        } else if (error.message) {
                            console.log("Error message: " + error.message);
                            //do something other than the other two

                        }

                    });
            })
            .catch((error) => {
                toast.error(CONSTANTS.MessageError, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    handleDate(event) {

        let currentMonth = event.target.value;
        const searchTerm = '-';
        currentMonth = parseInt(currentMonth.substring(currentMonth.indexOf(searchTerm) + 1));

        //console.log("currentMonth", currentMonth);
        //console.log(currentMonth);

        this.setState({
            currentMonth: currentMonth
        });

        let userId = localStorage.getItem('id');
        let request = {
            MemberId: parseInt(userId),
            Name: CONSTANTS.ResponsibleAreaNameOfTsehTermoplast,
            Month: currentMonth
        };
        //console.log(' before request change: ' + request)

        //console.log('MemberId: ' + request.MemberId)
        //console.log('Name: ' + request.Name)
        //console.log(' after request change: ' + request)
        axios
            .post(CONSTANTS.PathToDetailedReportsController, request)
            .then(response => {
                let data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);

                if (data.monthlyBalances.length > 0) {
                    this.setState({
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalances: data.monthlyBalances,
                        reportStandards: data.reportStandards
                    })

                    let reportColumns = data.reportColumns;
                    let reportItems = data.reportItems;
                    let monthlyBalances = data.monthlyBalances;
                    //console.log(JSON.stringify(data[0].name));

                    let childrenTH = []
                    //create table heads
                    for (let j = 0; j < Object.keys(reportColumns).length; j++) {

                        let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === j);

                        if (reportColumnValue.order === CONSTANTS.ReturnColumnOrderOfTsehTermoplast) {

                            var reserveColumnValue = [];
                            for (let i = 0; i <= 3; i++) {
                                reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                            }
                            childrenTH.push(<td colSpan="5" style={{ padding: "0" }} className="h-100">
                                <table style={{ margin: "0" }} className="w-100 h-100">
                                    <thead>
                                        <tr>
                                            <th colSpan="5">Возврат</th>
                                        </tr>
                                        <tr>
                                            <th>{reportColumnValue.name}</th>
                                            <th>{reserveColumnValue[0].name}</th>
                                            <th>{reserveColumnValue[1].name}</th>
                                            <th>{reserveColumnValue[2].name}</th>
                                            <th>{reserveColumnValue[3].name}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </td>);
                            j = j + 4

                        } else if (reportColumnValue.order === CONSTANTS.ExpenseColumnOrderOfTsehTermoplast) {

                            var reserveColumnValue = [];
                            for (let i = 0; i <= 2; i++) {
                                reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                            }
                            childrenTH.push(<td colSpan="4" style={{ padding: "0" }} className="h-100">
                                <table style={{ margin: "0" }} className="w-100 h-100">
                                    <thead>
                                        <tr>
                                            <th colSpan="4">Расход</th>
                                        </tr>
                                        <tr>
                                            <th>{reportColumnValue.name}</th>
                                            <th>{reserveColumnValue[0].name}</th>
                                            <th>{reserveColumnValue[1].name}</th>
                                            <th>{reserveColumnValue[2].name}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </td>);
                            j = j + 3

                        } else if (reportColumnValue.order == j) {
                            let as = reportColumnValue.name;
                            childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);

                        } else {

                        }
                    }
                    this.state.thead = [];
                    this.state.thead.push(<tr>{childrenTH}</tr>);

                    let totalColumnNumber = Object.keys(reportColumns).length;
                    for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                        //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                        this.state.balanceOperationNumbers.push([totalColumnNumber]);
                        this.state.balanceCalculationSigns.push([totalColumnNumber]);

                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            this.state.balanceOperationNumbers[xCoordinatePosition][j] = 0;
                            this.state.balanceCalculationSigns[xCoordinatePosition][j] = "0";
                        }
                    }

                    let isApiReturnedData = true;
                    this.setState({ balanceAtTheEndIndex: Object.keys(reportColumns).length });
                    this.setState({ isApiReturnedData: isApiReturnedData });
                    //console.log("Object.keys(data.reportColumns).length - 1: " + Object.keys(reportColumns).length);
                    //console.log("balanceAtTheEndIndex: " + this.state.balanceAtTheEndIndex);    
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                    this.setState({
                        apiStatus: CONSTANTS.MessageCannotDisplayBlankForThisMonth,
                        reportItems: [],
                        reportColumns: [],
                        thead: [],
                        isApiReturnedData: false,
                        balanceOperationNumbers: [],
                        balanceCalculationSigns: []
                    });

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    componentDidMount() {
        let userId = localStorage.getItem('id');
        let request = {
            MemberId: parseInt(userId),
            Name: CONSTANTS.ResponsibleAreaNameOfTsehTermoplast,
            Month: this.state.currentMonth
        };
        //console.log('before request change: ' + request)

        //console.log('Month: ' + request.Month)
        //console.log('Name: ' + request.Name)        
        //console.log(' after request change: ' + request)
        axios
            .post(CONSTANTS.PathToDetailedReportsController, request)
            .then(response => {
                let data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);

                if (data.monthlyBalances.length > 0) {
                    this.setState({
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalances: data.monthlyBalances,
                        reportStandards: data.reportStandards
                    })

                    let reportColumns = data.reportColumns;
                    let reportItems = data.reportItems;
                    let monthlyBalances = data.monthlyBalances;
                    //console.log(JSON.stringify(data[0].name));

                    let childrenTH = []
                    //create table heads
                    for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                        let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === j);

                        if (reportColumnValue.order === CONSTANTS.ReturnColumnOrderOfTsehTermoplast) {

                            var reserveColumnValue = [];
                            for (let i = 0; i <= 3; i++) {
                                reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                            }
                            childrenTH.push(<td colSpan="5" style={{ padding: "0" }} className="h-100">
                                <table style={{ margin: "0" }} className="w-100 h-100">
                                    <thead>
                                        <tr>
                                            <th colSpan="5">Возврат</th>
                                        </tr>
                                        <tr>
                                            <th>{reportColumnValue.name}</th>
                                            <th>{reserveColumnValue[0].name}</th>
                                            <th>{reserveColumnValue[1].name}</th>
                                            <th>{reserveColumnValue[2].name}</th>
                                            <th>{reserveColumnValue[3].name}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </td>);
                            j = j + 4

                        } else if (reportColumnValue.order === CONSTANTS.ExpenseColumnOrderOfTsehTermoplast) {

                            var reserveColumnValue = [];
                            for (let i = 0; i <= 2; i++) {
                                reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                            }
                            childrenTH.push(<td colSpan="4" style={{ padding: "0" }} className="h-100">
                                <table style={{ margin: "0" }} className="w-100 h-100">
                                    <thead>
                                        <tr>
                                            <th colSpan="4">Расход</th>
                                        </tr>
                                        <tr>
                                            <th>{reportColumnValue.name}</th>
                                            <th>{reserveColumnValue[0].name}</th>
                                            <th>{reserveColumnValue[1].name}</th>
                                            <th>{reserveColumnValue[2].name}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </td>);
                            j = j + 3

                        } else if (reportColumnValue.order == j) {
                            let as = reportColumnValue.name;
                            childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);

                        } else {

                        }
                    }
                    this.state.thead = [];
                    this.state.thead.push(<tr>{childrenTH}</tr>);

                    let totalColumnNumber = Object.keys(reportColumns).length;
                    for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                        //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                        this.state.balanceOperationNumbers.push([totalColumnNumber]);
                        this.state.balanceCalculationSigns.push([totalColumnNumber]);

                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            this.state.balanceOperationNumbers[xCoordinatePosition][j] = 0;
                            this.state.balanceCalculationSigns[xCoordinatePosition][j] = "0";
                        }
                    }

                    let isApiReturnedData = true;
                    this.setState({ balanceAtTheEndIndex: Object.keys(reportColumns).length });
                    this.setState({ isApiReturnedData: isApiReturnedData });
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                    this.setState({
                        apiStatus: CONSTANTS.MessageCannotDisplayBlankForThisMonth,
                        reportItems: [],
                        reportColumns: [],
                        thead: [],
                        isApiReturnedData: false,
                        balanceOperationNumbers: [],
                        balanceCalculationSigns: []
                    });

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    render() {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

        if (!this.state.isApiReturnedData) {
            return (
                <Row>
                    <Container>
                        <h1>Отчет на {months[this.state.currentMonth - 1]} месяц</h1>
                    </Container>
                    <Container>
                        <input
                            id="month"
                            label="Выберите месяц"
                            type="month"
                            defaultValue={(new Date).getMonth()}
                            onBlur={this.handleDate}
                            onChange={this.handleDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Container>
                    <Container>
                        <span>{this.state.apiStatus}</span>
                    </Container>
                </Row>);
        }

        return (
            <Container className="themed-container" fluid={true}>
                <Row>
                    <Container>
                        <h1>Отчет на {months[this.state.currentMonth - 1]} месяц</h1>
                    </Container>
                    <Container>
                        <input
                            id="month"
                            label="Выберите месяц"
                            type="month"
                            defaultValue={(new Date).getMonth()}
                            onBlur={this.handleDate}
                            onChange={this.handleDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Container>

                    <Form onSubmit={this.handleSubmit}>
                        <Col md={12} className="p-0 m-0">
                            <StickyTable size="md" headers={this.state.thead} data={this.fillTableBody()} />
                            <Button variant="contained"
                                color="secondary"
                                startIcon={<SaveIcon />}
                                onClick={this.handleSubmit}>
                                {CONSTANTS.MessageSave}
                            </Button>
                            <ToastContainer />
                        </Col>
                    </Form >

                </Row>
            </Container>
        )
    }
}

export const EditTsehTermoplast = props => {

    return (
        <Edit {...props} title={CONSTANTS.TitleForTsehTermoplast} >
            <EditInfo />
        </Edit>
    );
}

class MyEditInputField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
        let newObj = {
            value: event.target.value,
            rowId: this.props.id,
            colId: this.props.columnId
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Form.Control className="m-0" type="number" style={{ padding: "0" }} id={idValue} value={this.state.value} onChange={this.handleChange} />
        );
    }
}

export class EditInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            thead: [],
            balanceOperationNumbers: [],
            balanceCalculationSigns: [],
            balanceAtTheEndIndex: 0,
            report: [],
            reportStandards: [],
            reportColumns: [],
            reportItems: [],
            monthlyBalances: [],
            reportDatas: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1),
            isBodyFilled: false
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fillTableBody() {
        console.log("inside fillTableBody");
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
        let reportStandards = this.state.reportStandards;

        if (!this.state.isBodyFilled) {
            console.log("entered to filltableBody edit butt not editable")
            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []

                let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("reportItemValue", reportItemValue);
                //console.log("xCoordinatePosition", xCoordinatePosition);
                let monthlyBalanceValue = monthlyBalances.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("monthlyBalanceValue", monthlyBalanceValue);
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);

                this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast] = monthlyBalanceValue.initialBalance;
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast]}</td>);


                for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                    let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)
                    //console.log("reportColumnValue", reportColumnValue);
                    let reportDataValue = reportDatas.filter(element => element.reportItemId === reportItemValue.id).find(element => element.reportColumnId === reportColumnValue.id);
                    //console.log("reportDataValue", reportDataValue);
                    if (reportColumnValue.order == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.LossValueColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.LossValueColumnOrderOfTsehTermoplast) {

                        let lossValue = reportStandards.find(element => element.reportItemId === reportItemValue.id).value;
                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehTermoplast] = lossValue;
                        //console.log(lossValue);
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehTermoplast]} onResultValueChange={this.handleResultValueChange} /></td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + yCoordinatePosition);

                    } else if (reportColumnValue.order == CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast] = reportDataValue.data;

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast] = monthlyBalanceValue.residualBalance;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast]} /></td>);
                    } else if (reportColumnValue.order == yCoordinatePosition) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = reportDataValue.data;
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} /></td>);

                    } else {
                      //console.log("Faillll")
                    }
                }

                tbody.push(<tr>{childrenTB}</tr>)
            }


            //this.state.isBodyFilled = true;
            this.state.isBodyFilled = true;
        } else {

            console.log("Entered to fillTableBody edit");

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []

                let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("reportItemValue", reportItemValue);
                //console.log("xCoordinatePosition", xCoordinatePosition);

                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast]}</td>);

                for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                    let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)

                    if (reportColumnValue.order == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.LossValueColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.LossValueColumnOrderOfTsehTermoplast) {

                        let lossValue = reportStandards.find(element => element.reportItemId === reportItemValue.id).value;
                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehTermoplast] = lossValue;
                        //console.log(lossValue);
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehTermoplast]} onResultValueChange={this.handleResultValueChange} /></td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + yCoordinatePosition);

                    } else if (reportColumnValue.order === CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast && yCoordinatePosition == CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td className="px-0 py-auto"><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast && yCoordinatePosition === CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast) {

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast]} /></td>);
                    } else if (reportColumnValue.order === yCoordinatePosition) {

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} /></td>);

                    } else {
                        //console.log("Faillll")
                    }
                }

                tbody.push(<tr>{childrenTB}</tr>)
            }
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseFloat(target.value);

        tempArray[targetRowId][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTsehFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromWarehouseFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTsehSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromWarehouseSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReturnFromTermoplastIVyduvColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ReceiveWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
        tempArray[targetRowId][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ExpenseVyduvColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseTsehFirstColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseTsehSecondColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseCrushedColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.ExpenseWithInvoiceColumnOrderOfTsehTermoplast])).valueOf();
        tempArray[targetRowId][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast]).plus(tempArray[targetRowId][CONSTANTS.TotalArrivalColumnOrderOfTsehTermoplast]).minus(tempArray[targetRowId][CONSTANTS.TotalExpenceColumnOrderOfTsehTermoplast])).valueOf();

        this.setState({
            balanceOperationNumbers: tempArray
        })

        this.forceUpdate();        
    }

    handleSubmit(event) {
        event.preventDefault();
        let tempArray = this.state.balanceOperationNumbers;
        
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
        let postData = [];
        let postMonthlyBalance = [];        

        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

            for (let indexCount = 0; indexCount < Object.keys(monthlyBalances).length; indexCount++) { // assign beginning balance to specified month
                if ((monthlyBalances[indexCount].order) == xCoordinatePosition) {

                    let monthlyBalanceObject = {
                        id: monthlyBalances[indexCount].id,
                        memberId: monthlyBalances[indexCount].memberId,
                        initialBalance: monthlyBalances[indexCount].initialBalance,
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehTermoplast],
                        date: monthlyBalances[indexCount].date,
                        order: monthlyBalances[indexCount].order,
                        reportItemId: monthlyBalances[indexCount].reportItemId,
                        reportId: monthlyBalances[indexCount].reportId,
                        responsibleAreaId: monthlyBalances[indexCount].responsibleAreaId
                    }
                    postMonthlyBalance.push(monthlyBalanceObject);

                    break;
                }
            }

            for (let j = 0; j < Object.keys(reportItems).length; j++) {
                if ((reportItems[j].order) == xCoordinatePosition) { // check for report row items consistency

                    for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                        for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                            if ((reportColumns[reportColumnIdIndex].order) == yCoordinatePosition) {
                                //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportDatas).length; reportDataXIndex++) {
                                    if (reportDatas[reportDataXIndex].reportItemId == reportItems[j].id && reportDatas[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {

                                        let reportDataObject = {
                                            id: reportDatas[reportDataXIndex].id,
                                            reportId: reportDatas[reportDataXIndex].reportId,
                                            reportItemId: reportDatas[reportDataXIndex].reportItemId,
                                            data: this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition],
                                            order: reportDatas[reportDataXIndex].order,
                                            reportColumnId: reportDatas[reportDataXIndex].reportColumnId
                                        }
                                        postData.push(reportDataObject);
                                        //console.log(this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]);
                                        //console.log(reportDataObject);
                                        break;
                                    }
                                }

                                break;
                            }
                        }
                    }
                }
            }
        }

        //console.table(this.state.balanceOperationNumbers);
        function putMonthlyBalanceFunc() {
            return axios.put(CONSTANTS.PathToMonthlyBalancesController, postMonthlyBalance);
        }
        function putDataFunc() {
            return axios.put(CONSTANTS.PathToReportDatasController, postData);
        }

        Promise.all([putMonthlyBalanceFunc(), putDataFunc()])
            .then(function (results) {
                //let data = JSON.parse(JSON.stringify(results.data));
                //console.log(data);

                toast.success(CONSTANTS.MessageUpdatedSuccessfully, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                window.location.href = '../';
            })
            .catch(function (error) {
                toast.error(CONSTANTS.MessageError, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    componentDidMount() {

        let reportId = parseInt(localStorage.getItem('reportId'));
        axios
            .get(CONSTANTS.PathToDetailedReportsController + reportId)
            .then(response => {
                if (!this.state.isApiReturnedData) {
                    let data = JSON.parse(JSON.stringify(response.data));
                    console.log("data received: " + data);

                    if (data.monthlyBalances.length > 0) {
                        this.setState({
                            reportColumns: data.reportColumns,
                            reportItems: data.reportItems,
                            monthlyBalances: data.monthlyBalances,
                            reportStandards: data.reportStandards,
                            reportDatas: data.reportDatas
                        })

                        let reportColumns = data.reportColumns;
                        let reportItems = data.reportItems;
                        let monthlyBalances = data.monthlyBalances;
                        let report = data.report;

                        //console.log(JSON.stringify(data[0].name));

                        let childrenTH = []
                        //create table heads
                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === j);

                            if (reportColumnValue.order === CONSTANTS.ReturnColumnOrderOfTsehTermoplast) {

                                var reserveColumnValue = [];
                                for (let i = 0; i <= 3; i++) {
                                    reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                                }
                                childrenTH.push(<td colSpan="5" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="5">Возврат</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumnValue.name}</th>
                                                <th>{reserveColumnValue[0].name}</th>
                                                <th>{reserveColumnValue[1].name}</th>
                                                <th>{reserveColumnValue[2].name}</th>
                                                <th>{reserveColumnValue[3].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 4

                            } else if (reportColumnValue.order === CONSTANTS.ExpenseColumnOrderOfTsehTermoplast) {

                                var reserveColumnValue = [];
                                for (let i = 0; i <= 2; i++) {
                                    reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                                }
                                childrenTH.push(<td colSpan="4" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="4">Расход</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumnValue.name}</th>
                                                <th>{reserveColumnValue[0].name}</th>
                                                <th>{reserveColumnValue[1].name}</th>
                                                <th>{reserveColumnValue[2].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 3

                            } else if (reportColumnValue.order == j) {
                                let as = reportColumnValue.name;
                                childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);

                            } else {

                            }
                        }
                        this.state.thead = [];
                        this.state.thead.push(<tr key={_uniqueId()}>{childrenTH}</tr>);

                        let totalColumnNumber = Object.keys(reportColumns).length;
                        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                            //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                            this.state.balanceOperationNumbers.push([totalColumnNumber]);
                            this.state.balanceCalculationSigns.push([totalColumnNumber]);

                            for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                                this.state.balanceOperationNumbers[xCoordinatePosition][j] = 0;
                                this.state.balanceCalculationSigns[xCoordinatePosition][j] = "0";
                            }
                        }

                        //console.log("report.date", report.date)
                        let reportMonth = new Date(report.date).getMonth() + 1;
                        //console.log("reportMonth", reportMonth)
                        let isApiReturnedData = true;
                        this.setState({
                            isApiReturnedData: isApiReturnedData,
                            currentMonth: reportMonth
                        });
                    }
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                    this.setState({
                        apiStatus: CONSTANTS.MessageCannotDisplayBlankForThisMonth,
                        reportItems: [],
                        reportColumns: [],
                        thead: [],
                        isApiReturnedData: false,
                        balanceOperationNumbers: [],
                        balanceCalculationSigns: []
                    });

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    render() {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

        if (!this.state.isApiReturnedData) {
            return (
                <Row>
                    <Container>
                        <span>{this.state.apiStatus}</span>
                    </Container>
                </Row>);

        }

        return (

            <Container className="themed-container" fluid={true}>
                <TextField source="id" onChange={this.handleIdValueChange} />
                <Row>
                    <Container>
                        <h1>Отчет на {months[this.state.currentMonth - 1]} месяц</h1>
                    </Container>

                    <Form onSubmit={this.handleSubmit}>
                        <Col md={12} className="p-0 m-0">
                            <StickyTable size="md" headers={this.state.thead} data={this.fillTableBody()} />
                            <Button variant="contained"
                                color="secondary"
                                startIcon={<SaveIcon />}
                                onClick={this.handleSubmit} >
                                <span aria-hidden>{CONSTANTS.MessageSaveChanges}</span>
                            </Button>
                            <ToastContainer />
                        </Col>
                    </Form >
                </Row>
            </Container>
        )
    }
}

export const ShowTsehTermoplast = ({ permissions, ...props }) => {
    return (
        <Show {...props} title={CONSTANTS.TitleForTsehTermoplast} >
            <ShowInfo {...props} permissions={permissions} />
        </Show>
    );
}

export class ShowInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thead: [],
            balanceOperationNumbers: [],
            balanceCalculationSigns: [],
            balanceAtTheEndIndex: 0,
            report: [],
            responsibleArea: [],
            reportColumns: [],
            reportItems: [],
            monthlyBalances: [],
            reportDatas: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1),
            isBodyFilled: false,
            reportStatus: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePrint = this.handlePrint.bind(this);
    }

    fillTableBody() {

        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
  
        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
            let childrenTB = []

            let reportItemValue = reportItems.filter(element => element.order === xCoordinatePosition).find(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId);
            //console.log("reportItemValue", reportItemValue);

            let monthlyBalanceValue = monthlyBalances.filter(element => element.memberId === monthlyBalances[0].memberId && element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
            //console.log("monthlyBalanceValue", monthlyBalanceValue);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{monthlyBalanceValue.initialBalance}</td>);
            this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehTermoplast] = monthlyBalanceValue.initialBalance;

            for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)
                //console.log("reportColumnValue", reportColumnValue);
                let reportDataValue = reportDatas.filter(element => element.reportId === monthlyBalances[0].reportId && element.reportItemId === reportItemValue.id).find(element => element.reportColumnId === reportColumnValue.id);

                if (reportDataValue !== null && reportDataValue !== undefined) {
                    //console.log("reportDataValue", reportDataValue);
                    this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[yCoordinatePosition].calculationSign;
                    this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = reportDataValue.data;
                    childrenTB.push(<td>{this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]}</td>);
                }
            }

            childrenTB.push(<td>{monthlyBalanceValue.residualBalance}</td>);

            tbody.push(<tr>{childrenTB}</tr>)
        }

        return tbody;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let postData = [];
        let postMonthlyBalance = [];
        let currentMonth = this.state.currentMonth - 1;
        let report = this.state.report;
        let reportDate = new Date((new Date).setMonth(currentMonth));

        //console.log("this.state.currentMonth", this.state.currentMonth);
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log                

        let postReport = report;
        postReport.status = this.state.reportStatus;

        //console.log("postReport", postReport)
        axios
            .put(CONSTANTS.PathToReportsController + JSON.stringify(postReport.id), postReport)
            .then(function (results) {
                toast.success(CONSTANTS.MessageUpdatedSuccessfully, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                window.location.href = '../';
            })
            .catch((error) => {
                toast.error(CONSTANTS.MessageError, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    handlePrint(event) {
        var css = '@page { size: landscape; }',
            head = document.getElementById("printContent"),
            style = document.createElement('style');

        style.type = 'text/css';
        style.media = 'print';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }

    componentDidMount() {

        let reportId = parseInt(localStorage.getItem('reportId'));
        axios
            .get(CONSTANTS.PathToDetailedReportsController + reportId)
            .then(response => {
                if (!this.state.isApiReturnedData) {
                    let data = JSON.parse(JSON.stringify(response.data));
                    //console.log("data received: " + data);

                    if (data.monthlyBalances.length > 0) {
                        this.setState({
                            report: data.report,
                            reportColumns: data.reportColumns,
                            reportItems: data.reportItems,
                            monthlyBalances: data.monthlyBalances,
                            reportStandards: data.reportStandards,
                            reportDatas: data.reportDatas,
                            responsibleArea: data.responsibleArea
                        })

                        let reportColumns = data.reportColumns;
                        let reportItems = data.reportItems;
                        let monthlyBalances = data.monthlyBalances;
                        let report = data.report;

                        let childrenTH = []
                        //create table heads
                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === j);

                            if (reportColumnValue.order === CONSTANTS.ReturnColumnOrderOfTsehTermoplast) {

                                var reserveColumnValue = [];
                                for (let i = 0; i <= 3; i++) {
                                    reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                                }
                                childrenTH.push(<td colSpan="5" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="5">Возврат</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumnValue.name}</th>
                                                <th>{reserveColumnValue[0].name}</th>
                                                <th>{reserveColumnValue[1].name}</th>
                                                <th>{reserveColumnValue[2].name}</th>
                                                <th>{reserveColumnValue[3].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 4

                            } else if (reportColumnValue.order === CONSTANTS.ExpenseColumnOrderOfTsehTermoplast) {

                                var reserveColumnValue = [];
                                for (let i = 0; i <= 2; i++) {
                                    reserveColumnValue[i] = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === (j + i + 1));
                                }
                                childrenTH.push(<td colSpan="4" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="4">Расход</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumnValue.name}</th>
                                                <th>{reserveColumnValue[0].name}</th>
                                                <th>{reserveColumnValue[1].name}</th>
                                                <th>{reserveColumnValue[2].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 3

                            } else if (reportColumnValue.order == j) {
                                let as = reportColumnValue.name;
                                childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);

                            } else {

                            }
                        }
                        this.state.thead = [];
                        this.state.thead.push(<tr>{childrenTH}</tr>);

                        let totalColumnNumber = Object.keys(reportColumns).length;
                        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                            //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                            this.state.balanceOperationNumbers.push([totalColumnNumber]);
                            this.state.balanceCalculationSigns.push([totalColumnNumber]);

                            for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                                this.state.balanceOperationNumbers[xCoordinatePosition][j] = 0;
                                this.state.balanceCalculationSigns[xCoordinatePosition][j] = "0";
                            }
                        }

                        //console.log("report.date", report.date)
                        let reportMonth = new Date(report.date).getMonth() + 1;
                        //console.log("reportMonth", reportMonth)
                        let isApiReturnedData = true;
                        this.setState({
                            isApiReturnedData: isApiReturnedData,
                            currentMonth: reportMonth,
                            reportStatus: report.status
                        });
                    }
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Error response: " + error.response);
                    //do something

                    this.setState({
                        apiStatus: CONSTANTS.MessageCannotDisplayBlankForThisMonth,
                        reportItems: [],
                        reportColumns: [],
                        thead: [],
                        isApiReturnedData: false,
                        balanceOperationNumbers: [],
                        balanceCalculationSigns: []
                    });

                } else if (error.request) {
                    console.log("Error request: " + error.request);
                    //do something else

                } else if (error.message) {
                    console.log("Error message: " + error.message);
                    //do something other than the other two

                }

            });
    }

    render() {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

        const onSwitchAction = () => {
            if (this.state.reportStatus) {
                this.setState({
                    reportStatus: false
                })
            } else {
                this.setState({
                    reportStatus: true
                })
            }
            console.log(this.state.reportStatus);
        };

        if (!this.state.isApiReturnedData) {
            return (
                <Row>
                    <Container>
                        <span>{this.state.apiStatus}</span>
                    </Container>
                </Row>);
        }

        return (
            <Container className="themed-container h-100" fluid={true}>
                {this.state.reportStatus &&
                    <Row>
                        <div id="printContent" >
                            <ReactToPrint content={() => this.printRef} onBeforePrint={this.handlePrint} pageStyle="@{size: auto; margin: 25mm; }">
                                <PrintContextConsumer>
                                    {({ handlePrint }) => (
                                        <Button variant="contained"
                                            color="secondary"
                                            startIcon={<PrintIcon />} onClick={handlePrint}>{CONSTANTS.MessagePrint}</Button>
                                    )}
                                </PrintContextConsumer>
                            </ReactToPrint>
                            <div className="d-none">
                                <PrintReportTemplate ref={el => (this.printRef = el)} headers={this.state.thead} data={this.fillTableBody()} reportMonth={this.state.currentMonth} responsibleAreaName={this.state.responsibleArea.name} />
                            </div>
                        </div>
                    </Row>
                }
                <Row>
                    <Container>
                        <h1>Отчет на {months[this.state.currentMonth - 1]} месяц</h1>
                    </Container>

                    <SimpleShowLayout >
                        <Col md={12} className="p-0 m-0">
                            <StickyTable size="md" headers={this.state.thead} data={this.fillTableBody()} />
                        </Col>

                    </SimpleShowLayout >
                    {this.props.permissions == CONSTANTS.PermissionChiefAccountant &&
                        <Container fluid>
                            <Form>
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.reportStatus}
                                        onChange={onSwitchAction}
                                        color="primary"
                                        name="checkedB"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />}
                                    label={CONSTANTS.MessageIChecked}
                                />
                                <div>
                                    <Button variant="contained"
                                        color="secondary"
                                        startIcon={<SaveIcon />}
                                        onClick={this.handleSubmit} >
                                        <span aria-hidden>{CONSTANTS.MessageSaveChanges}</span>
                                    </Button>
                                </div>
                            </Form>
                        </Container>
                    }

                    <ToastContainer />
                </Row>
            </Container>
        )
    }
}