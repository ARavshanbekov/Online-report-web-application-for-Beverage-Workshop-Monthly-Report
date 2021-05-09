import React from "react";
import useStickyHeader from "./useStickyHeader.jsx";
import { Table} from 'react-bootstrap';
import './../components/css/custom.css';

export default function StickyTable(props) {
    const { tableRef, isSticky } = useStickyHeader();

    const ref = React.useRef(null);

    const renderHeader = () => (
        <thead>
            {props.headers}
        </thead>
    );           

    console.log("inside StickyTable");

    return (
        <div ref={ref}>            
            {isSticky && (
                /*
                .sticky will be the copy of table header while sticky 
                needed as otherwise table won't preserve columns width
                */
                <Table 
                    striped bordered hover size="md"
                    className="sticky"
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
            <Table striped bordered hover size="md" ref={tableRef}>
                {renderHeader()}
                <tbody>
                    {props.data}
                </tbody>
            </Table>            
        </div>
    );
}
