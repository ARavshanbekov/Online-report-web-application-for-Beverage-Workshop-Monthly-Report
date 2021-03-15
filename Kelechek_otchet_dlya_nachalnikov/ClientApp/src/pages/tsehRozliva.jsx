// in src/termoplastIVyduv.js
import * as React from "react";
import _uniqueId from 'lodash/uniqueId';

import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    Create,
    DateInput,
    ShowButton,
    CardActions,    
    ListButton,
    DeleteButton,
    RefreshButton,   
    SaveButton,
    useRefresh
} from 'react-admin';
import axios from 'axios';
import { Table, Row, Col, Container, Input, Form, Label } from 'reactstrap';

export const TsehRozlivaList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />      
            <TextField source="ResponsibleAreaID" />
            <TextField source="Date" label="Дата" /> 
            <TextField source="Title" label="Заглавие" />
            <EditButton />
        </Datagrid>
    </List>
);

export const TsehRozlivaCreate = props => (
    <Create {...props}>
        <Info />
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
            colId: this.props.columnID
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

export class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thead: [],
            tbody: [],
            balances: [],
            balanceOperationNumbers: [],
            balanceAtTheEndIndex: 0,
            value: 0,            
            report: [],
            reportColumns: [],
            reportItems: [],
            monthlyBalance: [],
            apiReturnStatus: false
        };                 
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleResultValueChange = this.handleResultValueChange.bind(this);
    }

    fillTableHead() {
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        //console.log(JSON.stringify(data[0].name));
        let childrenTH = []
        //create table heads
        for (let j = 0; j < Object.keys(reportColumns).length; j++) {
            let as = reportColumns[j].name;
            childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{as}</th>);
        }

        return <tr>{childrenTH}</tr>;
    }

    fillTableBody() {
        let tbody = [];
        let report = this.state.report;
        let reportColumns = this.state.reportColumns;
        let reportItems = this.state.reportItems;
        let monthlyBalance = this.state.monthlyBalance;
        //create table heads
        console.table(this.state.balanceOperationNumbers);
        //console.log
        for (let i = 0; i < Object.keys(reportItems).length; i++) {
            let childrenTB = []
            let name = reportItems[i].name

            //let balanceAtTheBeginning = monthlyBalance[i].residualBalance;
            //this.state.balances.push(balanceAtTheBeginning);
            childrenTB.push(<td key={_uniqueId()} id={i}>{name}</td>);

            childrenTB.push(<td key={_uniqueId()} id={i}>{0}</td>);

            for (let j = 2; j < Object.keys(reportColumns).length - 1; j++) {
                childrenTB.push(<td> <MyInputField id={i} rowID={i} columnID={j} onValueChange={this.handleValueChange} /></td>);
            }

            childrenTB.push(<td><ResultInputField key={_uniqueId()} resultValue={this.state.balanceOperationNumbers[i][this.state.balanceAtTheEndIndex]} onResultValueChange={this.handleResultValueChange} /></td>);

            tbody.push(<tr>{childrenTB}</tr>)
        }

        return tbody;
    }
    handleValueChange(target) {        
        
        console.log("target rowID " + target.rowId)
        console.log("target columnID " + target.colId)
        console.log("object " + target);
        console.log("target value " + this.state.balanceOperationNumbers[target.rowId][target.colId])

        let targetRowId = target.rowId;
        let targetColId = target.colId;
        
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[targetRowId][targetColId] = parseInt(target.value);
        let sum = 0;
        for (let i = 2; i < this.state.balanceAtTheEndIndex; i++) {
            sum += tempArray[targetRowId][i];
        }

        tempArray[targetRowId][this.state.balanceAtTheEndIndex] = sum;
        
        this.setState({
            balanceOperationNumbers: tempArray
        })
        console.table(this.state.balanceOperationNumbers);  

        let tbody = this.state.tbody;        
        this.setState({
            tbody: tbody
        })
    }

    handleResultValueChange(target) {
        let targetValue = target.value;
        let tbody = this.state.tbody;
        let tempArray = this.state.balanceOperationNumbers;
        tempArray[target.colId][this.state.balanceAtTheEndIndex] = parseInt(targetValue);
        this.setState({
            balanceOperationNumbers: tempArray
        })

        
        this.setState({
            tbody: tbody
        })
        console.log("handleResultValueChange triggered");
    }

    componentDidMount() {
        let userId = localStorage.getItem('id');
        let request = {
            MemberID: parseInt(userId),
            Name: "ЦЕХ розлива №2"
        }
        console.log('userID: ' + request)
        console.log('MemberID: ' + request.MemberID)
        console.log('Name: ' + request.Name)
        axios
            .post("/api/DetailedReports/", request)
            .then(response => {
                var data = JSON.parse(JSON.stringify(response.data));
                console.log(data);
                                
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
                    let as = reportColumns[j].name;
                    childrenTH.push(<th key={_uniqueId()} id={_uniqueId()}>{as}</th>);
                }

                this.state.thead.push(<tr> {childrenTH}</tr>);   

                let totalColumnNumber = Object.keys(reportColumns).length;   
                for (let i = 0; i < Object.keys(reportItems).length; i++) {
                                     
                    //let tempBalanceOperationNumbers = this.state.balanceOperationNumbers;
                    this.state.balanceOperationNumbers.push([totalColumnNumber])

                    for (let j = 0; j < Object.keys(data.reportColumns).length; j++) {
                        this.state.balanceOperationNumbers[i][j] = 0;                        
                    }
                }

                this.setState({ balanceAtTheEndIndex: Object.keys(reportColumns).length });
                this.setState({ apiReturnStatus: true });
                console.log("Object.keys(data.reportColumns).length - 1: " + Object.keys(reportColumns).length);
                console.log("balanceAtTheEndIndex: " + this.state.balanceAtTheEndIndex);
                console.log("balanceAtTheEndIndex:");
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

    render() {
        if (!this.state.apiReturnStatus) {
            return <span>Loading...</span>;
        }
        return (
            <Container className="themed-container" fluid={true}>                     
                <Row>                    
                    <Form>
                        <Col md={12} className="p-0 m-0">                            
                            <Table striped bordered hover size="md" >
                                <thead>
                                    {this.state.thead}
                                </thead>
                                <tbody>
                                    {this.fillTableBody()}
                                </tbody>
                            </Table>
                            <SaveButton />                            
                        </Col>
                    </Form >                    
                </Row>                
            </Container>                                                                    
        )
    }    
}

export const TsehRozlivaEdit = props => (
    <Edit {...props} >
        <SimpleForm>
            <Container>
                <Row>
                    <Row>
                        <Container><h2></h2></Container>
                    </Row>
                    <Row>
                        <Table striped bordered hover size="md">
                            <thead>
                                <tr>
                                    <th>Наименование</th>
                                    <th>Ед. изм.</th>
                                    <th>Осн. на нач</th>
                                    <th>Расход</th>
                                    <th>Расход по накладн.</th>
                                    <th>Приход</th>
                                    <th>Брак</th>
                                    <th>Приход на накл.</th>
                                    <th>Остаток на конец</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </Table>
                    </Row>
                </Row>
            </Container>
            <TextField source="id" />
            <TextInput source="ResponsibleAreaID" />
            <DateInput  source="Date" />
            <TextInput source="Title" />            
        </SimpleForm>
    </Edit>
);

