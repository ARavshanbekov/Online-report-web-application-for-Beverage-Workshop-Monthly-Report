// in src/termoplastIVyduv.js
import React from "react";

import _uniqueId from 'lodash/uniqueId';
import "react-datepicker/dist/react-datepicker.css";
import MaterialUI from '@material-ui/core/TextField';
import queryString from 'query-string'

import {
    List,
    Datagrid,    
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    DateInput,
    TextField,
    DateField
} from 'react-admin';
import axios from 'axios';
import { Table, Row, Col, Container, Input, Form, Button } from 'reactstrap';

export const TermoplastList = props => (
    <List {...props}>
        <Datagrid>
            <DateField source="date" label="Дата" />
            <TextField source="title" label="Заглавие" />
            <EditButton />
        </Datagrid>
    </List>
);

export const TermoplastCreate = props => (
    <Create {...props}>
        <CreateInfo />
    </Create>
);

class MyInputField extends React.Component {
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
            colId: this.props.columnID,
            calculationSign: this.props.calculationSign
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Input type="number" id={idValue} value={this.state.value} onChange={this.handleChange} />
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
            reportColumns: [],
            reportItems: [],
            monthlyBalance: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1)
            
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleResultValueChange = this.handleResultValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);

    }

    fillTableHead() {
       
    }

    fillTableBody() {
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        //create table heads
        //console.table(this.state.balanceOperationNumbers);
        //console.table(this.state.balanceCalculationSigns);
        //console.log        

        for (let i = 0; i < Object.keys(reportItems).length; i++) {
            let childrenTB = []

            let balanceAtTheBeginning = monthlyBalance[i].residualBalance;

            childrenTB.push(<td key={_uniqueId()} id={i}>{reportItems[i].name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={i}>{reportItems[i].unit}</td>);
            childrenTB.push(<td key={_uniqueId()} id={i}>{balanceAtTheBeginning}</td>);
            this.state.balanceOperationNumbers[i][2] = balanceAtTheBeginning;
            this.state.balanceCalculationSigns[i][2] = reportColumns[2].calculationSign;
            for (let j = 3; j < Object.keys(reportColumns).length - 1; j++) {
                childrenTB.push(<td><MyInputField id={i} rowID={i} columnID={j} calculationSign={reportColumns[j].calculationSign} onValueChange={this.handleValueChange} /></td>);
                //console.table("reportColumns[j] index " + j);
                //console.log("reportColumns[j].CalculationSign " + reportColumns[j - 3].calculationSign);
                
                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order - 1) == j) {
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        this.state.balanceCalculationSigns[i][j] = reportColumns[indexCount].calculationSign;
                        break;
                    }
                }
            }
         
            let sum = 0;
            for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                if (this.state.balanceCalculationSigns[i][j] === ("+").trim()) {
                    sum += this.state.balanceOperationNumbers[i][j];
                } else if (this.state.balanceCalculationSigns[i][j] === ("-").trim()) {
                    sum -= this.state.balanceOperationNumbers[i][j];
                } else {

                }                
            }

            this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex] = sum;

            childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

            tbody.push(<tr>{childrenTB}</tr>)
        }        

        return tbody;
    }

    handleValueChange(target) {        

        let targetRowId = target.rowId;
        let targetColId = target.colId;        
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseInt(target.value);
        let sum = 0;
        for (let i = 1; i < this.state.balanceAtTheEndIndex; i++) {
            if (this.state.balanceCalculationSigns[targetRowId][i] === "+") {
                //console.log("inside sign + : ")
                sum += tempArray[targetRowId][i];
            } else if (this.state.balanceCalculationSigns[targetRowId][i] === "-") {
                //console.log("inside sign - : ")
                sum -= tempArray[targetRowId][i];
            } else {
                //console.log("inside sign else state : ")
            }
            
        }

        //console.log("sum: " + sum)
        tempArray[targetRowId][this.state.balanceAtTheEndIndex] = sum;

        this.setState({
            balanceOperationNumbers: tempArray
        })
        console.table(this.state.balanceOperationNumbers);        
    }

    handleResultValueChange(target) {
        let targetValue = target.value;        
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[target.colId][this.state.balanceAtTheEndIndex] = parseInt(targetValue);
        this.setState({
            balanceOperationNumbers: tempArray
        })

        //console.log("handleResultValueChange triggered");
    }

    handleSubmit(event) {

        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        let postData = [];
        let postMonthlyBalance = [];
        let reportDate = new Date((new Date).setMonth(this.state.currentMonth - 1));
        
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log        

        for (let i = 0; i < Object.keys(reportItems).length; i++) {            
            
            let monthlyBalanceObject = [];
            

            for (let j = 3; j < Object.keys(reportColumns).length - 1; j++) {
              
                let reportDataObject = [];
                let reportColumnId = 0;
                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order - 1) == j) {
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);                                       
                        reportColumnId = reportColumns[indexCount].id;
                        console.log(reportColumns[indexCount].name + "" + reportColumnId);
                        break;

                    }
                }

                reportDataObject = {
                    reportId: report.id,
                    reportItemId: reportItems[i].id,
                    data: this.state.balanceOperationNumbers[i][j],
                    reportColumnId: reportColumnId
                }
                postData.push(reportDataObject);
            }
           
            
            console.log(reportDate);
            monthlyBalanceObject = {
                memberID: parseInt(userId),
                initialBalance: monthlyBalance[i].residualBalance,
                residualBalance: this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex],
                date: reportDate,
                reportItemID: reportItems[i].id,
                reportID: report.id
            }
            postMonthlyBalance.push(monthlyBalanceObject);

        }      

        let postReport = {
            responsibleAreaID: report.responsibleAreaID,
            date: reportDate,
            title: report.title,
            memberID: parseInt(userId)
        }
        
        axios.all([
            axios.post('/api/monthlyBalances/', postMonthlyBalance),
            axios.post('/api/reportDatas/', postData),
            axios.post('/api/reports/', postReport)
            ])            
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);

                
                alert('submitted: ' + this.state.value);
                event.preventDefault();
            })
            .catch(function (error) {
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
        

        //console.log(currentMonth);
        
        this.setState({
            currentMonth: currentMonth
        });
                
        let userId = localStorage.getItem('id');
        let request = {
            MemberID: parseInt(userId),
            Name: "Термопласт и Выдув",
            Month: currentMonth
        };
        //console.log(' before request change: ' + request)

        //console.log('MemberID: ' + request.MemberID)
        //console.log('Name: ' + request.Name)
        //console.log(' after request change: ' + request)
        axios
            .post("/api/DetailedReports/", request)
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);

                if (data.monthlyBalance.length > 0) {
                    this.setState({
                        report: data.report,
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalance: data.monthlyBalance
                    })

                    let report = data.report;
                    let reportColumns = data.reportColumns;
                    let reportItems = data.reportItems;
                    let monthlyBalance = data.monthlyBalance;
                    //console.log(JSON.stringify(data[0].name));

                    let childrenTH = []
                    //create table heads
                    for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order - 1) == j) {
                                //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                                let as = reportColumns[indexCount].name;
                                childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                break;
                            }
                        }
                    } 

                    this.state.thead.push(<tr> {childrenTH}</tr>);

                    let totalColumnNumber = Object.keys(reportColumns).length;
                    for (let i = 0; i < Object.keys(reportItems).length; i++) {

                        //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                        this.state.balanceOperationNumbers.push([totalColumnNumber]);
                        this.state.balanceCalculationSigns.push([totalColumnNumber]);

                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            this.state.balanceOperationNumbers[i][j] = 0;
                            this.state.balanceCalculationSigns[i][j] = "0";
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
                        apiStatus: "Не может открыть бланку на этот месяц!",
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
            MemberID: parseInt(userId),
            Name: "Термопласт и Выдув",
            Month: this.state.currentMonth
        };
        //console.log('before request change: ' + request)
        
        //console.log('Month: ' + request.Month)
        //console.log('Name: ' + request.Name)        
        //console.log(' after request change: ' + request)
        axios
            .post("/api/DetailedReports/", request)
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);

                if (data.monthlyBalance.length > 0) {
                    this.setState({
                        report: data.report,
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalance: data.monthlyBalance
                    })

                    let report = data.report;
                    let reportColumns = data.reportColumns;
                    let reportItems = data.reportItems;
                    let monthlyBalance = data.monthlyBalance;
                    //console.log(JSON.stringify(data[0].name));
                    let childrenTH = []
                    //create table heads
                    for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order - 1) == j) {
                                //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                                let as = reportColumns[j].name;
                                childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                break;
                            }
                        }
                    } 

                    this.state.thead.push(<tr> {childrenTH}</tr>);

                    let totalColumnNumber = Object.keys(reportColumns).length;
                    for (let i = 0; i < Object.keys(reportItems).length; i++) {

                        //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                        this.state.balanceOperationNumbers.push([totalColumnNumber]);
                        this.state.balanceCalculationSigns.push([totalColumnNumber]);

                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            this.state.balanceOperationNumbers[i][j] = 0;
                            this.state.balanceCalculationSigns[i][j] = "0";
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
                        apiStatus: "Не может открыть бланку на этот месяц!",
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
                            <Table striped bordered hover size="md" >
                                <thead>
                                    {this.state.thead}
                                </thead>
                                <tbody>
                                    {this.fillTableBody()}
                                </tbody>
                            </Table>
                            <Button color="primary" size="lg" >
                                <span aria-hidden>&#10003; Сохранить</span>
                            </Button>
                        </Col>
                    </Form >                    
                </Row>
            </Container>
        )
    }
}

export const TermoplastEdit = props => {

    return (
        <Edit {...props} >
            <EditInfo />
        </Edit>
    );
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
            reportColumns: [],
            reportItems: [],
            monthlyBalance: [],
            reportData: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1),            
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleResultValueChange = this.handleResultValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIdValueChange = this.handleIdValueChange.bind(this)
    }

    fillTableHead() {

    }

    fillTableBody() {
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        //create table heads
        //console.table(this.state.balanceOperationNumbers);
        //console.table(this.state.balanceCalculationSigns);
        //console.log        

        for (let i = 0; i < Object.keys(reportItems).length; i++) {
            let childrenTB = []

            let balanceAtTheBeginning = monthlyBalance[i].residualBalance;

            childrenTB.push(<td key={_uniqueId()} id={i}>{reportItems[i].name}</td>);
            childrenTB.push(<td key={_uniqueId()} id={i}>{reportItems[i].unit}</td>);
            childrenTB.push(<td key={_uniqueId()} id={i}>{balanceAtTheBeginning}</td>);
            this.state.balanceOperationNumbers[i][2] = balanceAtTheBeginning;
            this.state.balanceCalculationSigns[i][2] = reportColumns[2].calculationSign;
            for (let j = 3; j < Object.keys(reportColumns).length - 1; j++) {
                
                //console.table("reportColumns[j] index " + j);
                //console.log("reportColumns[j].CalculationSign " + reportColumns[j - 3].calculationSign);

                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order - 1) == j) {
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        this.state.balanceCalculationSigns[i][j] = reportColumns[indexCount].calculationSign;
                        childrenTB.push(<td><MyInputField id={i} rowID={i} columnID={j} calculationSign={reportColumns[j].calculationSign} initialValue={ } onValueChange={this.handleValueChange} /></td>);
                        break;
                    }
                }
            }

            let sum = 0;
            for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                if (this.state.balanceCalculationSigns[i][j] === ("+").trim()) {
                    sum += this.state.balanceOperationNumbers[i][j];
                } else if (this.state.balanceCalculationSigns[i][j] === ("-").trim()) {
                    sum -= this.state.balanceOperationNumbers[i][j];
                } else {

                }
            }

            this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex] = sum;

            childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

            tbody.push(<tr>{childrenTB}</tr>)
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseInt(target.value);
        let sum = 0;
        for (let i = 1; i < this.state.balanceAtTheEndIndex; i++) {
            if (this.state.balanceCalculationSigns[targetRowId][i] === "+") {
                //console.log("inside sign + : ")
                sum += tempArray[targetRowId][i];
            } else if (this.state.balanceCalculationSigns[targetRowId][i] === "-") {
                //console.log("inside sign - : ")
                sum -= tempArray[targetRowId][i];
            } else {
                //console.log("inside sign else state : ")
            }

        }

        //console.log("sum: " + sum)
        tempArray[targetRowId][this.state.balanceAtTheEndIndex] = sum;

        this.setState({
            balanceOperationNumbers: tempArray
        })
        console.table(this.state.balanceOperationNumbers);
    }

    handleResultValueChange(target) {
        let targetValue = target.value;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[target.colId][this.state.balanceAtTheEndIndex] = parseInt(targetValue);
        this.setState({
            balanceOperationNumbers: tempArray
        })

        //console.log("handleResultValueChange triggered");
    }

    handleSubmit(event) {

        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        let postData = [];
        let postMonthlyBalance = [];
        let reportDate = new Date((new Date).setMonth(this.state.currentMonth - 1));

        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log        

        for (let i = 0; i < Object.keys(reportItems).length; i++) {

            let monthlyBalanceObject = [];


            for (let j = 3; j < Object.keys(reportColumns).length - 1; j++) {

                let reportDataObject = [];
                let reportColumnId = 0;
                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order - 1) == j) {
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);                                       
                        reportColumnId = reportColumns[indexCount].id;
                        console.log(reportColumns[indexCount].name + "" + reportColumnId);
                        break;

                    }
                }

                reportDataObject = {
                    reportId: report.id,
                    reportItemId: reportItems[i].id,
                    data: this.state.balanceOperationNumbers[i][j],
                    reportColumnId: reportColumnId
                }
                postData.push(reportDataObject);
            }


            console.log(reportDate);
            monthlyBalanceObject = {
                memberID: parseInt(userId),
                initialBalance: monthlyBalance[i].residualBalance,
                residualBalance: this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex],
                date: reportDate,
                reportItemID: reportItems[i].id,
                reportID: report.id
            }
            postMonthlyBalance.push(monthlyBalanceObject);

        }

        let postReport = {
            responsibleAreaID: report.responsibleAreaID,
            date: reportDate,
            title: report.title,
            memberID: parseInt(userId)
        }

        axios.all([
            axios.post('/api/monthlyBalances/', postMonthlyBalance),
            axios.post('/api/reportDatas/', postData),
            axios.post('/api/reports/', postReport)
        ])
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);


                alert('submitted: ' + this.state.value);
                event.preventDefault();
            })
            .catch(function (error) {
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

    handleIdValueChange(event) {
        this.setState({
            reportId: event.target.value
        })
    }

    componentWillReceiveProps () {
        
        let userId = localStorage.getItem('id');
        let reportId = parseInt(localStorage.getItem('reportId'));
        axios
            .get('/api/DetailedReports/' + reportId)
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                console.log("data received: " + data);

                if (data.monthlyBalance.length > 0) {
                    this.setState({
                        report: data.report,
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalance: data.monthlyBalance,
                        reportData: data.reportData
                    })

                    let report = data.report;
                    let reportColumns = data.reportColumns;
                    let reportItems = data.reportItems;
                    let monthlyBalance = data.monthlyBalance;
                    //console.log(JSON.stringify(data[0].name));

                    let childrenTH = []
                    //create table heads
                    for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order - 1) == j) {
                                //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                                let as = reportColumns[indexCount].name;
                                childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                                break;
                            }
                        }
                    }

                    this.state.thead.push(<tr> {childrenTH}</tr>);

                    let totalColumnNumber = Object.keys(reportColumns).length;
                    for (let i = 0; i < Object.keys(reportItems).length; i++) {

                        //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                        this.state.balanceOperationNumbers.push([totalColumnNumber]);
                        this.state.balanceCalculationSigns.push([totalColumnNumber]);

                        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
                            this.state.balanceOperationNumbers[i][j] = 0;
                            this.state.balanceCalculationSigns[i][j] = "0";
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
                        apiStatus: "Не может открыть бланку на этот месяц!",
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
                            <Table striped bordered hover size="md" >
                                <thead>
                                    {this.state.thead}
                                </thead>
                                <tbody>
                                    {this.fillTableBody()}
                                </tbody>
                            </Table>
                            <Button color="primary" size="lg" >
                                <span aria-hidden>&#10003; Сохранить</span>
                            </Button>
                        </Col>
                    </Form >
                </Row>
            </Container>
        )
    }
}