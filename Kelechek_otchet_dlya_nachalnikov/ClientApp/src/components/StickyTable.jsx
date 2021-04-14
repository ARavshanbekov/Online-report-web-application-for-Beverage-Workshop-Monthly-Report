import React from "react";
import useStickyHeader from "./useStickyHeader.jsx";
import { Table, Row, Col, Container, Form, Button } from 'react-bootstrap';
import './../css/custom.css';

export default function StickyTable({ headers = [], data = [] }) {
    const { tableRef, isSticky } = useStickyHeader();

    const ref = React.useRef(null);

    const renderHeader = () => (
        <thead>
            {headers}
        </thead>
    );           

    return (
        <div ref={ref}>            
            {isSticky && (
                /*
                .sticky will be the copy of table header while sticky 
                needed as otherwise table won't preserve columns width
                */
                <Table 
                    striped bordered hover size="md"
                    
                    style={{
                        position: "fixed",                        
                        top: 0,
                        width: ref.current.offsetWidth,
                        backgroundColor: "white"
                    }}
                >
                    {renderHeader()}
                </Table>
            )}
            <Table striped bordered hover size="md"
                ref={tableRef}>
                {renderHeader()}
                <tbody>
                    {data}
                </tbody>
            </Table>            
        </div>
    );
}
