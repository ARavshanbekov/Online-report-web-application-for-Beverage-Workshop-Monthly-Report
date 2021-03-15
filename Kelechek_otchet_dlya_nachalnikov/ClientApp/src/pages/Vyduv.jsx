// in src/Foo.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';
//import { Form, Button, Table, thead, tr, th, tbody, Row, Col, p, Container } from 'react-bootstrap';
import { Form, Button, Table, thead, tr, th, tbody, Row, Col, p, Container } from 'reactstrap';

const elements = ['one', 'two', 'three'];

function Car() {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < 9; j++) {
            children.push(<td>{`Column ${j + 1}`}</td>)
        }
        //Create the parent and add the children
        table.push(<tr>{children}</tr>)
    }
    return table
    //return <h2>Hi, I am also a Car!</h2>;
}

const Vyduv = () => (
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
                        <Car />
                    </tbody>
                </Table>
            </Row>
        </Row>
    </Container>
);    

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (

            <input type="text" value={this.state.value} onChange={this.handleChange} />

        );
    }
}

export default Vyduv;