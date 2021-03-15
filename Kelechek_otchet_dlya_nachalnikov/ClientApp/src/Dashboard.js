// in src/Dashboard.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Row, Col, FormText, Form, InputGroup, FormControl } from 'react-bootstrap';

import { Title, TextInput, ReferenceInput, SimpleForm, SelectInput, required } from 'react-admin';

const ExampleToast = ({ children }) => {
    const [show, toggleShow] = React.useState(true);

    return (
        <>
            {!show && <Button onClick={() => toggleShow(true)}>Show Toast</Button>}
            <Toast show={show} onClose={() => toggleShow(false)}>
                <Toast.Header>
                    <strong className="mr-auto">React-Bootstrap</strong>
                </Toast.Header>
                <Toast.Body>{children}</Toast.Body>
            </Toast>
        </>
    );
};

export default () => (
    <Card>
        <Title title="главная страница" />        
        
       
        <Container className="p-3">
            <Jumbotron>
                <h1 className="header">Добро пожаловать на отчетный сайт ЗАО «Келечек».</h1>                
            </Jumbotron>
        </Container>
    </Card>
);