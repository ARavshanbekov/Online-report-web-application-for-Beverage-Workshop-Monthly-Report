import React from "react";
import { Table, Row, Col, Container, Form, Button } from 'react-bootstrap';
import './../components/css/custom.css';

class PrintReportTemplate extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        return (
            <Container>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                        <h3>"Утверждаю"</h3>
                        <h3>Директор ЗАО "Келечек"</h3>
                        <h3>ф-л "Бурулсун-ПЭТ"</h3>
                        <h3>госп.__________Туманов Н.К.</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <h1>Отчет на {months[this.props.reportMonth - 1]} месяц</h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>{this.props.responsibleAreaName}</h3>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Table striped bordered hover size="md">
                        <thead>
                            {this.props.headers}
                        </thead>
                        <tbody>
                            {this.props.data}
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    <Col>     
                        <Row>
                            <Col>
                                <h3>Гл. бухгалтер</h3>
                            </Col>
                            <Col>
                                <h3>Осмонова Д.</h3>
                            </Col>  
                        </Row>
                        <Row>
                            <Col>
                                <h3>Зав. склад</h3>
                            </Col>
                            <Col>
                                <h3>Абдыкайыров Ш.</h3>
                            </Col>  
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <h3>Нач. цех №1</h3>
                            </Col>
                            <Col>
                                <h3>Абдилбекова Г.</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>Нач. цех №2</h3>
                            </Col>
                            <Col>
                                <h3>Казакбаев Ч.</h3>
                            </Col>
                        </Row>
                    </Col>                   
                </Row>
            </Container>
        );
    }
}

export default PrintReportTemplate;
