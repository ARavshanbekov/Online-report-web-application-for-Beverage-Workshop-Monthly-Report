// in src/Dashboard.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

export default () => (
    <Card>                            
        <Container className="p-3">
            <Jumbotron>
                <h1 className="header">Добро пожаловать на отчетный сайт ЗАО «Келечек».</h1>                
            </Jumbotron>
        </Container>
    </Card>
);