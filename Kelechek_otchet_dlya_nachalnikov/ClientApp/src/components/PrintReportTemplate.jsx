import React from "react";
import { Table, Row, Col, Container } from 'react-bootstrap';
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
                        <h5>"Утверждаю"</h5>
                        <h5>Директор ЗАО "Келечек"</h5>
                        <h5>ф-л "Бурулсун-ПЭТ"</h5>
                        <h5>госп.__________Туманов Н.К.</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <h5>Отчет на {months[this.props.reportMonth - 1]} месяц</h5>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6>{this.props.responsibleAreaName}</h6>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Table>
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
                                <h6>Гл. бухгалтер</h6>
                            </Col>
                            <Col>
                                <h6>Осмонова Д.</h6>
                            </Col>  
                        </Row>
                        <Row>
                            <Col>
                                <h6>Зав. склад</h6>
                            </Col>
                            <Col>
                                <h6>Абдыкайыров Ш.</h6>
                            </Col>  
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <h6>Нач. цех №1</h6>
                            </Col>
                            <Col>
                                <h6>Абдилбекова Г.</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h6>Нач. цех №2</h6>
                            </Col>
                            <Col>
                                <h6>Казакбаев Ч.</h6>
                            </Col>
                        </Row>
                    </Col>                   
                </Row>
            </Container>
        );
    }
}

export default PrintReportTemplate;
