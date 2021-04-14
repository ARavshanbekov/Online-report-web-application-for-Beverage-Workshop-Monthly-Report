// in src/tsehRozlivaSecond.js
import * as DecimalJS from 'decimal.js';
import React from "react";
import _uniqueId from 'lodash/uniqueId';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './../css/custom.css';

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
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { CONSTANTS } from '../Constants.jsx';

import StickyTable from "../components/StickyTable.jsx";

const CustomShowButton = ({ record }) => {
    return (
        <ShowButton basePath={CONSTANTS.PathToTsehRozlivaSecond} record={record} onClick={(e) => {
            localStorage.setItem('reportId', record.id)
        }} />
    )
}

export const ListTsehRozlivaSecond = props => (
    <List {...props} title={CONSTANTS.TitleForTsehRozlivaSecond}>
        <Datagrid>
            <DateField source="date" label="Дата" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} locales="ru" />
            <TextField source="title" label="Заглавие" />
            <BooleanField source="status" label="Статус" valueLabelTrue="Проверено" valueLabelFalse="В ожидании" />
            <CustomShowButton />
        </Datagrid>
    </List>
);

export const CreateTsehRozlivaSecond = props => (
    <Create {...props} title={CONSTANTS.TitleForTsehRozlivaSecond}>
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
            calculationSign: this.props.calculationSign
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Form.Control type="number" style={{ padding: "0" }} id={idValue} value={this.state.value} onChange={this.handleChange} />
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
        this.handleResultValueChange = this.handleResultValueChange.bind(this);
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

            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{monthlyBalanceValue.residualBalance}</td>);
            this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond] = monthlyBalanceValue.residualBalance;
            //this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
            for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //let reportColumnValue = reportColumns.find(element => element.order === yCoordinatePosition && element.responsibleAreaId === reportStandards[0].responsibleAreaId);
                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order) == CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond) {
                        //console.log("reportItems[xCoordinatePosition].id", reportItems[xCoordinatePosition].id);
                        let lossValue = reportStandards.find(element => element.reportItemId === reportItemValue.id).value;
                        //console.log(lossValue);
                        childrenTB.push(<td>{lossValue}</td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + yCoordinatePosition);
                        this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = lossValue;
                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);

                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.OverrunSumColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.OverrunSumColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.OverrunSumColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingSumColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.SavingSumColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.SavingSumColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        break;
                    } else if ((reportColumns[indexCount].order) == yCoordinatePosition) {
                        childrenTB.push(<td /*style={{ paddingLeft: "0", paddingRight: "0" }}*/><MyCreateInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} calculationSign={reportColumns[yCoordinatePosition].calculationSign} onValueChange={this.handleValueChange} /></td>);

                        this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[indexCount].calculationSign;
                        break;
                    } else {

                    }
                }
            }

            tbody.push(<tr>{childrenTB}</tr>)
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        console.table(tempArray);
        tempArray[targetRowId][targetColId] = parseFloat(target.value);

        tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]).times(tempArray[targetRowId][CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond]).dividedBy(100)).valueOf();
        tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond])).valueOf();
        tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond]).minus(tempArray[targetRowId][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond])).valueOf();
        if (tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] > tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]) {
            tempArray[targetRowId][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond] = 0;
            let xValue = new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond]);
            tempArray[targetRowId][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond] = xValue.minus(tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]).valueOf();
        } else if (tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] < tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]) {
            tempArray[targetRowId][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond] = 0;
            let xValue = new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]);
            tempArray[targetRowId][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond] = xValue.minus(tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond]).valueOf();
        } else {

        }

        if (tempArray[targetRowId][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond] == 0 && tempArray[targetRowId][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond] == 0) {
            tempArray[targetRowId][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond] = 0;
            tempArray[targetRowId][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond] = 0;
        }

        this.setState({
            balanceOperationNumbers: tempArray
        })

        console.log("tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]", tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]);
        console.log("CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond", CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond);
        console.log("tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond];", tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond])
        console.table(this.state.balanceOperationNumbers);
    }

    handleResultValueChange(target) {
        let targetValue = target.value;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[target.colId][this.state.balanceAtTheEndIndex] = parseFloat(targetValue);
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

        console.log("this.state.currentMonth", this.state.currentMonth);
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log                

        let postReport = {
            responsibleAreaId: monthlyBalances[0].responsibleAreaId,
            date: reportDate,
            title: CONSTANTS.TitleForTsehRozlivaSecond,
            memberId: parseInt(userId)
        }

        console.log("reportDate", reportDate)
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
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond],
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
                        console.log("results", results);
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

        console.log("currentMonth", currentMonth);
        //console.log(currentMonth);

        this.setState({
            currentMonth: currentMonth
        });

        let userId = localStorage.getItem('id');
        let request = {
            MemberId: parseInt(userId),
            Name: CONSTANTS.ResponsibleAreaNameOfTsehRozlivaSecond,
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
                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order) == CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond && CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond == j) {
                                console.log("CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond);
                                childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Перерасход</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumns[j].name}</th>
                                                <th>{reportColumns[j + 1].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 1
                                //childrenTH.push(<th colspan="2" key={_uniqueId()} id={_uniqueId()}>{reportColumns[j].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 1].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 2].name}</th>);
                                break;
                            } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond && CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond == j) {
                                console.log("CONSTANTS.CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond);
                                childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Экономия</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumns[j].name}</th>
                                                <th>{reportColumns[j + 1].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 1
                                //childrenTH.push(<th colspan="2" key={_uniqueId()} id={_uniqueId()}>{reportColumns[j].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 1].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 2].name}</th>);
                                break;
                            } else if ((reportColumns[indexCount].order) == j) {
                                console.log("order: " + (reportColumns[indexCount].order) + "==" + j);
                                let as = reportColumns[j].name;
                                childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                break;
                            } else {

                            }
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
            Name: CONSTANTS.ResponsibleAreaNameOfTsehRozlivaSecond,
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
                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order) == CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond && CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond == j) {
                                console.log("CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond);
                                childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Перерасход</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumns[j].name}</th>
                                                <th>{reportColumns[j + 1].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 1
                                //childrenTH.push(<th colspan="2" key={_uniqueId()} id={_uniqueId()}>{reportColumns[j].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 1].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 2].name}</th>);
                                break;
                            } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond && CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond == j) {
                                console.log("CONSTANTS.CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond);
                                childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                    <table style={{ margin: "0" }} className="w-100 h-100">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Экономия</th>
                                            </tr>
                                            <tr>
                                                <th>{reportColumns[j].name}</th>
                                                <th>{reportColumns[j + 1].name}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </td>);
                                j = j + 1
                                //childrenTH.push(<th colspan="2" key={_uniqueId()} id={_uniqueId()}>{reportColumns[j].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 1].name}</th>);
                                //childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{reportColumns[j + 2].name}</th>);
                                break;
                            } else if ((reportColumns[indexCount].order) == j) {
                                console.log("order: " + (reportColumns[indexCount].order) + "==" + j);
                                let as = reportColumns[j].name;
                                childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                break;
                            } else {

                            }
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
                            <Button color="primary" size="lg" onClick={this.handleSubmit}>
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

export const EditTsehRozlivaSecond = props => {

    return (
        <Edit {...props} title={CONSTANTS.TitleForTsehRozlivaSecond} >
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
            colId: this.props.columnId,
            calculationSign: this.props.calculationSign
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Form.Control type="number" style={{ padding: "0" }} id={idValue} value={this.state.value} onChange={this.handleChange} />
        );
    }
}

export class EditInfo extends React.Component {
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
        this.handleResultValueChange = this.handleResultValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fillTableBody() {
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
        let reportStandards = this.state.reportStandards;

        if (!this.state.isBodyFilled) {
            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []

                let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("reportItemValue", reportItemValue);
                //console.log("xCoordinatePosition", xCoordinatePosition);
                let monthlyBalanceValue = monthlyBalances.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("monthlyBalanceValue", monthlyBalanceValue);
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);

                this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond] = monthlyBalanceValue.initialBalance;
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond]}</td>);


                for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                    let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)
                    console.log("reportColumnValue", reportColumnValue);
                    let reportDataValue = reportDatas.filter(element => element.reportItemId === reportItemValue.id).find(element => element.reportColumnId === reportColumnValue.id);
                    console.log("reportDataValue", reportDataValue);
                    if (reportColumnValue.order == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond] = reportDataValue.data;

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond] = reportDataValue.data;

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond) {

                        let lossValue = reportStandards.find(element => element.reportItemId === reportItemValue.id).value;
                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond] = lossValue;
                        //console.log(lossValue);
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + yCoordinatePosition);

                    } else if (reportColumnValue.order == CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond] = reportDataValue.data;

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond && yCoordinatePosition == CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond] = monthlyBalanceValue.residualBalance;

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order == yCoordinatePosition) {

                        this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = reportDataValue.data;
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} onResultValueChange={this.handleResultValueChange} /></td>);

                    } else {
                        console.log("Faillll")
                    }
                }

                tbody.push(<tr>{childrenTB}</tr>)
            }


            this.state.isBodyFilled = true;
        } else {

            console.log("fillTableBody ");

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []

                let reportItemValue = reportItems.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
                //console.log("reportItemValue", reportItemValue);
                //console.log("xCoordinatePosition", xCoordinatePosition);

                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);
                childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond]}</td>);

                for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                    let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)

                    if (reportColumnValue.order === CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond) {


                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond) {


                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond) {

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond]} onResultValueChange={this.handleResultValueChange} /></td>);

                    } else if (reportColumnValue.order === CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond) {

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond && yCoordinatePosition === CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond) {

                        childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowId={xCoordinatePosition} columnId={yCoordinatePosition} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond]} onValueChange={this.handleValueChange} /></td>);
                    } else if (reportColumnValue.order === yCoordinatePosition) {

                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} onResultValueChange={this.handleResultValueChange} /></td>);
                    } else {
                        console.log("Faillll");
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
        console.table(tempArray);
        tempArray[targetRowId][targetColId] = parseFloat(target.value);

        tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]).times(tempArray[targetRowId][CONSTANTS.LossValueColumnOrderOfTsehRozlivaSecond]).dividedBy(100)).valueOf();
        tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.CompletedInTheWarehouseColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond])).valueOf();
        tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond] = (new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond]).plus(tempArray[targetRowId][CONSTANTS.ArrivalFromTheWarehouseColumnOrderOfTsehRozlivaSecond]).minus(tempArray[targetRowId][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond])).valueOf();
        if (tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] > tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]) {
            tempArray[targetRowId][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond] = 0;
            let xValue = new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond]);
            tempArray[targetRowId][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond] = xValue.minus(tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]).valueOf();
        } else if (tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond] < tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]) {
            tempArray[targetRowId][CONSTANTS.OverrunAmountColumnOrderOfTsehRozlivaSecond] = 0;
            let xValue = new DecimalJS.Decimal(tempArray[targetRowId][CONSTANTS.ActualTotalExpenseColumnOrderOfTsehRozlivaSecond]);
            tempArray[targetRowId][CONSTANTS.SavingAmountColumnOrderOfTsehRozlivaSecond] = xValue.minus(tempArray[targetRowId][CONSTANTS.ExpectedTotalConsumptionColumnOrderOfTsehRozlivaSecond]).valueOf();
        } else {

        }

        this.setState({
            balanceOperationNumbers: tempArray
        })

        console.log("tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]", tempArray[targetRowId][CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond]);
        console.log("CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond", CONSTANTS.InvoiceDefectColumnOrderOfTsehRozlivaSecond);
        console.log("tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond];", tempArray[targetRowId][CONSTANTS.AmountFromLossesColumnOrderOfTsehRozlivaSecond])
        console.table(this.state.balanceOperationNumbers);
    }

    handleResultValueChange(target) {
        let targetValue = target.value;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[target.colId][this.state.balanceAtTheEndIndex] = parseFloat(targetValue);
        this.setState({
            balanceOperationNumbers: tempArray
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let tempArray = this.state.balanceOperationNumbers;
        console.table(tempArray);
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
        let postData = [];
        let postMonthlyBalance = [];

        console.log("fillTableBody");

        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

            for (let indexCount = 0; indexCount < Object.keys(monthlyBalances).length; indexCount++) { // assign beginning balance to specified month
                if ((monthlyBalances[indexCount].order) == xCoordinatePosition) {

                    let monthlyBalanceObject = {
                        id: monthlyBalances[indexCount].id,
                        memberId: monthlyBalances[indexCount].memberId,
                        initialBalance: monthlyBalances[indexCount].initialBalance,
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.ResidualBalanceColumnOrderOfTsehRozlivaSecond],
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
                                        console.log(this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]);
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

                    if (data.report.status) {
                        this.setState({
                            apiStatus: CONSTANTS.MessageCannotDisplayBlankForThisMonth,
                            reportItems: [],
                            reportColumns: [],
                            thead: [],
                            isApiReturnedData: false,
                            balanceOperationNumbers: [],
                            balanceCalculationSigns: []
                        });
                    } else {
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
                            let report = data.report;

                            //console.log(JSON.stringify(data[0].name));

                            let childrenTH = []
                            //create table heads
                            for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                                    if ((reportColumns[indexCount].order) == CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond && CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond == j) {
                                        childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                            <table style={{ margin: "0" }} className="w-100 h-100">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2">Перерасход</th>
                                                    </tr>
                                                    <tr>
                                                        <th>{reportColumns[j].name}</th>
                                                        <th>{reportColumns[j + 1].name}</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </td>);
                                        j = j + 1

                                        break;
                                    } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond && CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond == j) {
                                        childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                            <table style={{ margin: "0" }} className="w-100 h-100">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2">Экономия</th>
                                                    </tr>
                                                    <tr>
                                                        <th>{reportColumns[j].name}</th>
                                                        <th>{reportColumns[j + 1].name}</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </td>);

                                        j = j + 1
                                        break;
                                    } else if ((reportColumns[indexCount].order) == j) {
                                        console.log("order: " + (reportColumns[indexCount].order) + "==" + j);
                                        let as = reportColumns[j].name;
                                        childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                        break;
                                    } else {

                                    }
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

                            console.log("report.date", report.date)
                            let reportMonth = new Date(report.date).getMonth() + 1;
                            console.log("reportMonth", reportMonth)
                            let isApiReturnedData = true;
                            this.setState({
                                isApiReturnedData: isApiReturnedData,
                                currentMonth: reportMonth
                            });
                        }
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
                            <Button color="primary" size="lg" onClick={this.handleSubmit} >
                                <span aria-hidden>&#10003; {CONSTANTS.MessageSaveChanges}</span>
                            </Button>
                            <ToastContainer />
                        </Col>
                    </Form >
                </Row>
            </Container>
        )
    }
}

export const ShowTsehRozlivaSecond = ({ permissions, ...props }) => {
    return (
        <Show {...props} title={CONSTANTS.TitleForTsehRozlivaSecond} >
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
    }

    fillTableBody() {

        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalances = this.state.monthlyBalances;
        let reportDatas = this.state.reportDatas;
        console.log(reportItems);
        console.log("fillTableBody show first");
        console.log("report", report);
        console.log("reportDatas", reportDatas);
        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
            let childrenTB = []

            let reportItemValue = reportItems.filter(element => element.order === xCoordinatePosition).find(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId);
            console.log("reportItemValue", reportItemValue);

            let monthlyBalanceValue = monthlyBalances.filter(element => element.memberId === monthlyBalances[0].memberId && element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === xCoordinatePosition);
            console.log("monthlyBalanceValue", monthlyBalanceValue);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItemValue.name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{monthlyBalanceValue.initialBalance}</td>);
            this.state.balanceOperationNumbers[xCoordinatePosition][CONSTANTS.BalanceAtTheBeginningColumnOrderOfTsehRozlivaSecond] = monthlyBalanceValue.initialBalance;

            for (let yCoordinatePosition = 2; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {

                let reportColumnValue = reportColumns.filter(element => element.responsibleAreaId === monthlyBalances[0].responsibleAreaId).find(element => element.order === yCoordinatePosition)
                //console.log("reportColumnValue", reportColumnValue);
                let reportDataValue = reportDatas.filter(element => element.reportId === monthlyBalances[0].reportId && element.reportItemId === reportItemValue.id).find(element => element.reportColumnId === reportColumnValue.id);
                //console.log("reportItemValue.id", reportItemValue.id);
                //console.log("reportColumnValue.id", reportColumnValue.id)
                //console.log("reportDataValue", reportDataValue);
                //console.log("reportDatas.filter(element => element.reportItemId === reportItemValue.id)", reportDatas.filter(element => element.reportId === monthlyBalances[0].reportId && element.reportItemId === reportItemValue.id));
                if (reportDataValue !== null && reportDataValue !== undefined) {
                    console.log("reportDataValue", reportDataValue);
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

        console.log("this.state.currentMonth", this.state.currentMonth);
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log                

        let postReport = report;
        postReport.status = this.state.reportStatus;

        console.log("postReport", postReport)
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
                            report: data.report,
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
                            for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                                if ((reportColumns[indexCount].order) == CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond && CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond == j) {
                                    console.log("CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.OverrunColumnOrderOfTsehRozlivaSecond);
                                    childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                        <table style={{ margin: "0" }} className="w-100 h-100">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2">Перерасход</th>
                                                </tr>
                                                <tr>
                                                    <th>{reportColumns[j].name}</th>
                                                    <th>{reportColumns[j + 1].name}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </td>);
                                    j = j + 1
                                    break;
                                } else if ((reportColumns[indexCount].order) == CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond && CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond == j) {
                                    console.log("CONSTANTS.CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond " + (reportColumns[indexCount].order) + "==" + CONSTANTS.SavingColumnOrderOfTsehRozlivaSecond);
                                    childrenTH.push(<td colSpan="2" style={{ padding: "0" }} className="h-100">
                                        <table style={{ margin: "0" }} className="w-100 h-100">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2">Экономия</th>
                                                </tr>
                                                <tr>
                                                    <th>{reportColumns[j].name}</th>
                                                    <th>{reportColumns[j + 1].name}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </td>);
                                    j = j + 1
                                    break;
                                } else if ((reportColumns[indexCount].order) == j) {
                                    console.log("order: " + (reportColumns[indexCount].order) + "==" + j);
                                    let as = reportColumns[j].name;
                                    childrenTH.push(<th rowSpan="2" key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                    break;
                                } else {

                                }
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

                        console.log("report.date", report.date)
                        let reportMonth = new Date(report.date).getMonth() + 1;
                        console.log("reportMonth", reportMonth)
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
                                    <Button color="primary" size="lg" onClick={this.handleSubmit} >
                                        <span aria-hidden>&#10003; {CONSTANTS.MessageSaveChanges}</span>
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