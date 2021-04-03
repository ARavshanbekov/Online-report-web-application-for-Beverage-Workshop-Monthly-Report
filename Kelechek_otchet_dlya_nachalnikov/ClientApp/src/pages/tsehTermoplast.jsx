// in src/termoplastIVyduv.js
import React from "react";
import _uniqueId from 'lodash/uniqueId';
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StickyContainer, Sticky } from "react-sticky";
import './../css/custom.css';
import StickyTable from "react-sticky-table-thead";

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
    DateField,
    ShowButton,
    Show,
    SimpleShowLayout,    
} from 'react-admin';
import axios from 'axios';
import { Table, Row, Col, Container, Input, Form, Button } from 'reactstrap';

const CustomShowButton = ({ record }) => {
    return (
        <ShowButton basePath="/tsehTermoplast" record={record} onClick={(e) => {
            localStorage.setItem('reportId', record.id)
        }} />
    )
}

export const ListTsehTermoplast = props => (
    <List {...props}>
        <Datagrid>
            <DateField source="date" label="Дата" />
            <TextField source="title" label="Заглавие" />            
            <CustomShowButton />
        </Datagrid>
    </List>
);

export const CreateTsehTermoplast = props => (
    <Create {...props}>
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
            colId: this.props.columnID,
            calculationSign: this.props.calculationSign
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Input type="number" style={{padding: "0"}} id={idValue} value={this.state.value} onChange={this.handleChange} />
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
        let reportStandards = this.state.reportStandards;
        console.log(reportStandards);
        //create table heads
        //console.table(this.state.balanceOperationNumbers);
        //console.table(this.state.balanceCalculationSigns);
        //console.log        

        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
            let childrenTB = []

            let balanceAtTheBeginning = monthlyBalance[xCoordinatePosition].residualBalance;

            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);            
            childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{balanceAtTheBeginning}</td>);
            this.state.balanceOperationNumbers[xCoordinatePosition][2] = balanceAtTheBeginning;
            this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
            for (let j = 2; j < Object.keys(reportColumns).length - 1; j++) {                                
                //console.table("reportColumns[j] index " + j);
                //console.log("reportColumns[j].CalculationSign " + reportColumns[j - 3].calculationSign);
                
                for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                    if ((reportColumns[indexCount].order) == 17 && j == 17) {
                        let lossValue = reportStandards.find(element => element.reportItemId === reportItems[xCoordinatePosition].id).value;
                        console.log(lossValue);
                        childrenTB.push(<td>{lossValue}</td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        this.state.balanceOperationNumbers[xCoordinatePosition][j] = lossValue;
                        this.state.balanceCalculationSigns[xCoordinatePosition][j] = reportColumns[indexCount].calculationSign;
                        break;
                    }
                    if ((reportColumns[indexCount].order - 1) == j) {
                        childrenTB.push(<td /*style={{ paddingLeft: "0", paddingRight: "0" }}*/><MyCreateInputField id={xCoordinatePosition} rowID={xCoordinatePosition} columnID={j} calculationSign={reportColumns[j].calculationSign} onValueChange={this.handleValueChange} /></td>);
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        this.state.balanceCalculationSigns[xCoordinatePosition][j] = reportColumns[indexCount].calculationSign;
                        break;
                    }
                }
            }
         
            let sum = 0;
            for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                    sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                    sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                } else {

                }                
            }
            //console.log("residual: ", sum);
            this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;

            childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

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
        for (let xCoordinatePosition = 1; xCoordinatePosition < this.state.balanceAtTheEndIndex; xCoordinatePosition++) {
            if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "+") {
                //console.log("inside sign + : ")
                sum += tempArray[targetRowId][xCoordinatePosition];
            } else if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "-") {
                //console.log("inside sign - : ")
                sum -= tempArray[targetRowId][xCoordinatePosition];
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

    handleSubmit = (event) => {
        event.preventDefault();           
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        let postData = [];
        let postMonthlyBalance = [];
        let currentMonth = this.state.currentMonth - 1;        
        let reportDate = new Date((new Date).setMonth(currentMonth));        

        console.log("this.state.currentMonth", this.state.currentMonth);
        let userId = localStorage.getItem('id');
        //create table heads        
        //console.log                

        let postReport = {
            responsibleAreaID: monthlyBalance[0].responsibleAreaID,
            date: reportDate,
            title: "Данные по Цех Термопласт",
            memberID: parseInt(userId)
        }                        

        console.log("reportDate", reportDate)
        axios
            .post('/api/reports/', postReport)
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                //console.log(data);
                let newStoredReportId = data.id;

                for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {

                    let monthlyBalanceObject = [];

                    for (let j = 3; j < Object.keys(reportColumns).length - 1; j++) {

                        for (let indexCount = 0; indexCount < Object.keys(reportColumns).length; indexCount++) {
                            if ((reportColumns[indexCount].order - 1) == j) {
                                //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);                                       
                                let reportColumnId = reportColumns[indexCount].id;
                                //console.log(reportColumns[indexCount].name + "" + reportColumnId);
                                let reportDataObject = {
                                    reportId: newStoredReportId,
                                    reportItemId: reportItems[xCoordinatePosition].id,
                                    data: this.state.balanceOperationNumbers[xCoordinatePosition][j],
                                    reportColumnId: reportColumnId
                                }
                                postData.push(reportDataObject);
                                break;
                            }
                        }


                    }

                    //console.log(reportDate);
                    monthlyBalanceObject = {
                        memberID: parseInt(userId),
                        initialBalance: monthlyBalance[xCoordinatePosition].residualBalance,
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex],
                        date: reportDate,
                        order: xCoordinatePosition,
                        reportItemID: reportItems[xCoordinatePosition].id,
                        reportID: newStoredReportId,
                        responsibleAreaID: monthlyBalance[0].responsibleAreaID
                    }
                    postMonthlyBalance.push(monthlyBalanceObject);

                }
                function postMonthlyBalanceFunc() {
                    return axios.post('/api/monthlyBalances/', postMonthlyBalance);
                }
                function postDataFunc() {
                    return axios.post('/api/reportDatas/', postData);
                }                

                Promise.all([postMonthlyBalanceFunc(), postDataFunc()])
                    .then(function (results) {
                        //var data = JSON.parse(JSON.stringify(results.data));
                        console.log("results", results);
                        toast.success("Успешно сохранено", {
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
            MemberID: parseInt(userId),
            Name: "Цех. Термопласт",
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
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalance: data.monthlyBalance,
                        reportStandards: data.reportStandards
                    })
                   
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
            Name: "Цех. Термопласт",
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
                        reportColumns: data.reportColumns,
                        reportItems: data.reportItems,
                        monthlyBalance: data.monthlyBalance,
                        reportStandards: data.reportStandards
                    })
                  
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
                            <Button color="primary" size="lg" onClick={this.handleSubmit}>
                                ✓ Сохранить
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
        <Edit {...props} >
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
            colId: this.props.columnID,
            calculationSign: this.props.calculationSign
        }
        this.props.onValueChange(newObj);
    }

    render() {
        const idValue = this.props.id;
        return (
            <Input type="number" style={{padding: "0"}} id={idValue} value={this.state.value} onChange={this.handleChange} />
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
            reportColumns: [],
            reportItems: [],
            monthlyBalance: [],
            reportData: [],
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
        let monthlyBalance = this.state.monthlyBalance;
        let reportData = this.state.reportData;

        if (!this.state.isBodyFilled) {                        

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []                                

                for (let indexCount = 0; indexCount < Object.keys(monthlyBalance).length; indexCount++) { // assign beginning balance to specified month
                    if ((monthlyBalance[indexCount].order) == xCoordinatePosition) {
                        let balanceAtTheBeginning = monthlyBalance[indexCount].initialBalance;
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);              
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{balanceAtTheBeginning}</td>);
                        this.state.balanceOperationNumbers[xCoordinatePosition][2] = balanceAtTheBeginning;
                        this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
                        break;
                    }
                }

                for (let j = 0; j < Object.keys(reportItems).length; j++) {
                    if ((reportItems[j].order - 1) == xCoordinatePosition) { // check for report row items consistency

                        for (let yCoordinatePosition = 3; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                            for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                                if ((reportColumns[reportColumnIdIndex].order - 1) == yCoordinatePosition) {
                                    //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                    for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportData).length; reportDataXIndex++) {
                                        if (reportData[reportDataXIndex].reportItemId == reportItems[j].id && reportData[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {
                                            //console.log("reportData[reportDataXIndex].reportItemId == reportItems[reportColumnIdIndex].id ==> " + reportData[reportDataXIndex].reportItemId + "==" + reportItems[j].id)
                                            this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[reportColumnIdIndex].calculationSign;
                                            this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = reportData[reportDataXIndex].data;
                                            childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowID={xCoordinatePosition} columnID={yCoordinatePosition} calculationSign={reportColumns[reportColumnIdIndex].calculationSign} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} onValueChange={this.handleValueChange} /></td>);
                                            //console.log("reportDataXIndex", reportDataXIndex);
                                            //console.log("input field value is: " + reportData[reportDataXIndex].data);
                                            //console.log(reportData[reportDataXIndex]);
                                            break;
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                        let sum = 0;
                        for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                            if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                                sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                            } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                                sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                            } else {

                            }
                        }

                        this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;
                        //console.log("residual: ", sum)
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

                        tbody.push(<tr>{childrenTB}</tr>)
                        break;
                    }
                }


            }

            this.state.isBodyFilled = true;
        } else {
            
            console.log("fillTableBody");

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []
                let sum = 0;
                for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                    if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                        sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                    } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                        sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                    } else {

                    }
                }

                this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;

                for (let indexCount = 0; indexCount < Object.keys(monthlyBalance).length; indexCount++) { // assign beginning balance to specified month
                    if ((monthlyBalance[indexCount].order) == xCoordinatePosition) {
                        let balanceAtTheBeginning = monthlyBalance[indexCount].initialBalance;
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);                        
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{balanceAtTheBeginning}</td>);
                        this.state.balanceOperationNumbers[xCoordinatePosition][2] = balanceAtTheBeginning;
                        this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
                        break;
                    }
                }

                for (let j = 0; j < Object.keys(reportItems).length; j++) {
                    if ((reportItems[j].order - 1) == xCoordinatePosition) { // check for report row items consistency

                        for (let yCoordinatePosition = 3; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                            for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                                if ((reportColumns[reportColumnIdIndex].order - 1) == yCoordinatePosition) {
                                    //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                    for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportData).length; reportDataXIndex++) {
                                        if (reportData[reportDataXIndex].reportItemId == reportItems[j].id && reportData[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {
                                            //console.log("reportData[reportDataXIndex].reportItemId == reportItems[reportColumnIdIndex].id ==> " + reportData[reportDataXIndex].reportItemId + "==" + reportItems[j].id)                                                 
                                            childrenTB.push(<td><MyEditInputField id={xCoordinatePosition} rowID={xCoordinatePosition} columnID={yCoordinatePosition} calculationSign={reportColumns[reportColumnIdIndex].calculationSign} initialValue={this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]} onValueChange={this.handleValueChange} /></td>);
                                            
                                            break;
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                        //console.log("residual: ", sum)
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

                        tbody.push(<tr>{childrenTB}</tr>)
                        break;
                    }
                }


            }
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseInt(target.value);
        let sum = 0;
        for (let xCoordinatePosition = 1; xCoordinatePosition < this.state.balanceAtTheEndIndex; xCoordinatePosition++) {
            if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "+") {
                //console.log("inside sign + : ")
                sum += tempArray[targetRowId][xCoordinatePosition];
            } else if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "-") {
                //console.log("inside sign - : ")
                sum -= tempArray[targetRowId][xCoordinatePosition];
            } else {
                //console.log("inside sign else state : ")
            }

        }

        //console.log("sum: " + sum)
        tempArray[targetRowId][this.state.balanceAtTheEndIndex] = sum;
        tempArray[targetRowId][targetColId] = parseInt(target.value);

        this.setState({
            balanceOperationNumbers: tempArray
        })
        console.log(this.state.balanceOperationNumbers[targetRowId][targetColId]);        
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
        event.preventDefault();
        let tempArray = this.state.balanceOperationNumbers;
        console.table(tempArray);
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        let reportData = this.state.reportData;
        let postData = [];
        let postMonthlyBalance = [];
            
        console.log("fillTableBody");

        for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
          
            for (let indexCount = 0; indexCount < Object.keys(monthlyBalance).length; indexCount++) { // assign beginning balance to specified month
                if ((monthlyBalance[indexCount].order) == xCoordinatePosition) {

                    let monthlyBalanceObject = {
                        id: monthlyBalance[indexCount].id,
                        memberID: monthlyBalance[indexCount].memberID,
                        initialBalance: monthlyBalance[indexCount].initialBalance,
                        residualBalance: this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex],
                        date: monthlyBalance[indexCount].date,
                        order: monthlyBalance[indexCount].order,
                        reportItemID: monthlyBalance[indexCount].reportItemID,
                        reportID: monthlyBalance[indexCount].reportID,
                        responsibleAreaID: monthlyBalance[indexCount].responsibleAreaID
                    }
                    postMonthlyBalance.push(monthlyBalanceObject);
                    
                    break;
                }
            }

            for (let j = 0; j < Object.keys(reportItems).length; j++) {
                if ((reportItems[j].order - 1) == xCoordinatePosition) { // check for report row items consistency

                    for (let yCoordinatePosition = 3; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                        for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                            if ((reportColumns[reportColumnIdIndex].order - 1) == yCoordinatePosition) {
                                //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportData).length; reportDataXIndex++) {
                                    if (reportData[reportDataXIndex].reportItemId == reportItems[j].id && reportData[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {
                                        
                                        let reportDataObject = {
                                            id: reportData[reportDataXIndex].id,
                                            reportId: reportData[reportDataXIndex].reportId,
                                            reportItemId: reportData[reportDataXIndex].reportItemId,
                                            data: this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition],
                                            order: reportData[reportDataXIndex].order,
                                            reportColumnId: reportData[reportDataXIndex].reportColumnId
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

                    let sum = 0;
                    for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                        if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                            sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                        } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                            sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                        } else {

                        }
                    }

                    this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;                              
                }
            }
        }

        //console.table(this.state.balanceOperationNumbers);
        function postMonthlyBalanceFunc() {
            return axios.put('/api/monthlyBalances/', postMonthlyBalance);
        }
        function postDataFunc() {
            return axios.put('/api/reportDatas/', postData);
        }

        Promise.all([postMonthlyBalanceFunc(), postDataFunc()])
            .then(function (results) {
                //var data = JSON.parse(JSON.stringify(results.data));
                //console.log(data);

                toast.success("Успешно обновлено", {
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

    componentDidMount () {
                
        let reportId = parseInt(localStorage.getItem('reportId'));
        axios
            .get('/api/DetailedReports/' + reportId)
            .then(response => {
                if (!this.state.isApiReturnedData) {
                    var data = JSON.parse(JSON.stringify(response.data));
                    console.log("data received: " + data);

                    if (data.monthlyBalance.length > 0) {                        
                        let reportColumns = data.reportColumns;
                        let reportItems = data.reportItems;
                        let monthlyBalance = data.monthlyBalance;

                        
                        let currentReportMonth = new Date(monthlyBalance.date).getMonth() + 1
                        this.setState({                            
                            reportColumns: data.reportColumns,
                            reportItems: data.reportItems,
                            monthlyBalance: data.monthlyBalance,
                            reportData: data.reportData,
                            currentMonth: currentReportMonth
                        })

                        
                        
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
                                <span aria-hidden>&#10003; Сохранить Изменении</span>
                            </Button>
                            <ToastContainer />
                        </Col>
                    </Form >
                </Row>
            </Container>
        )
    }
}

export const ShowTsehTermoplast = props => {
    return (
        <Show {...props} >
            <ShowInfo />
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
            monthlyBalance: [],
            reportData: [],
            isApiReturnedData: false,
            apiStatus: "Загрузка",
            currentMonth: ((new Date).getMonth() + 1),
            isBodyFilled: false
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleResultValueChange = this.handleResultValueChange.bind(this);        
    }

    fillTableBody() {
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        let reportData = this.state.reportData;

        if (!this.state.isBodyFilled) {

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []

                for (let indexCount = 0; indexCount < Object.keys(monthlyBalance).length; indexCount++) { // assign beginning balance to specified month
                    if ((monthlyBalance[indexCount].order) == xCoordinatePosition) {
                        let balanceAtTheBeginning = monthlyBalance[indexCount].initialBalance;
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].unit}</td>);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{balanceAtTheBeginning}</td>);
                        this.state.balanceOperationNumbers[xCoordinatePosition][2] = balanceAtTheBeginning;
                        this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
                        break;
                    }
                }

                for (let j = 0; j < Object.keys(reportItems).length; j++) {
                    if ((reportItems[j].order - 1) == xCoordinatePosition) { // check for report row items consistency

                        for (let yCoordinatePosition = 3; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                            for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                                if ((reportColumns[reportColumnIdIndex].order - 1) == yCoordinatePosition) {
                                    //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                    for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportData).length; reportDataXIndex++) {
                                        if (reportData[reportDataXIndex].reportItemId == reportItems[j].id && reportData[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {
                                            //console.log("reportData[reportDataXIndex].reportItemId == reportItems[reportColumnIdIndex].id ==> " + reportData[reportDataXIndex].reportItemId + "==" + reportItems[j].id)
                                            this.state.balanceCalculationSigns[xCoordinatePosition][yCoordinatePosition] = reportColumns[reportColumnIdIndex].calculationSign;
                                            this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition] = reportData[reportDataXIndex].data;
                                            childrenTB.push(<td key={_uniqueId()}>{this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]}</td>);
                                            //console.log("reportDataXIndex", reportDataXIndex);
                                            //console.log("input field value is: " + reportData[reportDataXIndex].data);
                                            //console.log(reportData[reportDataXIndex]);
                                            break;
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                        let sum = 0;
                        for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                            if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                                sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                            } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                                sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                            } else {

                            }
                        }

                        this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;
                        //console.log("residual: ", sum)
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

                        tbody.push(<tr>{childrenTB}</tr>)
                        break;
                    }
                }


            }

            this.state.isBodyFilled = true;
        } else {

            console.log("fillTableBody");

            for (let xCoordinatePosition = 0; xCoordinatePosition < Object.keys(reportItems).length; xCoordinatePosition++) {
                let childrenTB = []
                let sum = 0;
                for (let j = 2; j < this.state.balanceAtTheEndIndex; j++) {
                    if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("+").trim()) {
                        sum += this.state.balanceOperationNumbers[xCoordinatePosition][j];
                    } else if (this.state.balanceCalculationSigns[xCoordinatePosition][j] === ("-").trim()) {
                        sum -= this.state.balanceOperationNumbers[xCoordinatePosition][j];
                    } else {

                    }
                }

                this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex] = sum;

                for (let indexCount = 0; indexCount < Object.keys(monthlyBalance).length; indexCount++) { // assign beginning balance to specified month
                    if ((monthlyBalance[indexCount].order) == xCoordinatePosition) {
                        let balanceAtTheBeginning = monthlyBalance[indexCount].initialBalance;
                        //console.log("order: " + (reportColumns[indexCount].order - 1) + "==" + j);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].name}</td>);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{reportItems[xCoordinatePosition].unit}</td>);
                        childrenTB.push(<td key={_uniqueId()} id={xCoordinatePosition}>{balanceAtTheBeginning}</td>);
                        this.state.balanceOperationNumbers[xCoordinatePosition][2] = balanceAtTheBeginning;
                        this.state.balanceCalculationSigns[xCoordinatePosition][2] = reportColumns[2].calculationSign;
                        break;
                    }
                }

                for (let j = 0; j < Object.keys(reportItems).length; j++) {
                    if ((reportItems[j].order - 1) == xCoordinatePosition) { // check for report row items consistency

                        for (let yCoordinatePosition = 3; yCoordinatePosition < Object.keys(reportColumns).length; yCoordinatePosition++) {
                            for (let reportColumnIdIndex = 0; reportColumnIdIndex < Object.keys(reportColumns).length; reportColumnIdIndex++) {
                                if ((reportColumns[reportColumnIdIndex].order - 1) == yCoordinatePosition) {
                                    //console.log("reportColumns[reportColumnIdIndex].order - 1) == j ==> " + (reportColumns[reportColumnIdIndex].order - 1) + "==" + j)

                                    for (let reportDataXIndex = 0; reportDataXIndex < Object.keys(reportData).length; reportDataXIndex++) {
                                        if (reportData[reportDataXIndex].reportItemId == reportItems[j].id && reportData[reportDataXIndex].reportColumnId == reportColumns[reportColumnIdIndex].id) {
                                            //console.log("reportData[reportDataXIndex].reportItemId == reportItems[reportColumnIdIndex].id ==> " + reportData[reportDataXIndex].reportItemId + "==" + reportItems[j].id)                                                 
                                            childrenTB.push(<td key={_uniqueId()}>{this.state.balanceOperationNumbers[xCoordinatePosition][yCoordinatePosition]}</td>);

                                            break;
                                        }
                                    }

                                    break;
                                }
                            }
                        }

                        //console.log("residual: ", sum)
                        childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[xCoordinatePosition][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

                        tbody.push(<tr>{childrenTB}</tr>)
                        break;
                    }
                }


            }
        }

        return tbody;
    }

    handleValueChange(target) {

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseInt(target.value);
        let sum = 0;
        for (let xCoordinatePosition = 1; xCoordinatePosition < this.state.balanceAtTheEndIndex; xCoordinatePosition++) {
            if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "+") {
                //console.log("inside sign + : ")
                sum += tempArray[targetRowId][xCoordinatePosition];
            } else if (this.state.balanceCalculationSigns[targetRowId][xCoordinatePosition] === "-") {
                //console.log("inside sign - : ")
                sum -= tempArray[targetRowId][xCoordinatePosition];
            } else {
                //console.log("inside sign else state : ")
            }

        }

        //console.log("sum: " + sum)
        tempArray[targetRowId][this.state.balanceAtTheEndIndex] = sum;
        tempArray[targetRowId][targetColId] = parseInt(target.value);

        this.setState({
            balanceOperationNumbers: tempArray
        })
        console.log(this.state.balanceOperationNumbers[targetRowId][targetColId]);
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

    componentDidMount() {

        let reportId = parseInt(localStorage.getItem('reportId'));
        axios
            .get('/api/DetailedReports/' + reportId)
            .then(response => {
                if (!this.state.isApiReturnedData) {
                    var data = JSON.parse(JSON.stringify(response.data));
                    console.log("data received: " + data);

                    if (data.monthlyBalance.length > 0) {
                        let reportColumns = data.reportColumns;
                        let reportItems = data.reportItems;
                        let monthlyBalance = data.monthlyBalance;


                        let currentReportMonth = new Date(monthlyBalance.date).getMonth() + 1
                        this.setState({
                            reportColumns: data.reportColumns,
                            reportItems: data.reportItems,
                            monthlyBalance: data.monthlyBalance,
                            reportData: data.reportData,
                            currentMonth: currentReportMonth
                        })



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

                        this.state.thead.push(<tr className="tableHeadSticky">{childrenTH}</tr>);

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
        //const divStyle = {
        //    color: 'blue',
        //    position: 'sticky',            
        //    top: 0
        //};        

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
                <TextField source="id" onChange={this.handleIdValueChange} />
                <Row>
                    <Container>
                        <h1>Отчет на {months[this.state.currentMonth - 1]} месяц</h1>
                    </Container>

                    <SimpleShowLayout >
                        <Col md={12} className="p-0 m-0">
                            <Table striped bordered hover size="md" /*className="w-100"*/ >
                                <thead /*style={divStyle}*/>
                                    {this.state.thead}
                                </thead>
                                <tbody>
                                    {this.fillTableBody()}
                                </tbody>
                            </Table>  
                        </Col>
                    </SimpleShowLayout >
                </Row>
            </Container>
        )
    }
}