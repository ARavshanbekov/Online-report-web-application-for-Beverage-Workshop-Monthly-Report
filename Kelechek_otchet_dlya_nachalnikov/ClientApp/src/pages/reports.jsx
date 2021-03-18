// in src/reports.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField, Create, Edit, SimpleForm, TextInput } from 'react-admin';

export const ReportList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="ResponsibleAreaID" />
            <TextField source="Date" />
            <TextField source="Title" />
            <TextField source="MemberID" />
        </Datagrid>
    </List>
);


export const ReportEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextField source="id" />
            <TextField source="ResponsibleAreaID" />
            <TextField source="Date" />
            <TextField source="Title" />
            <TextField source="MemberID" />
        </SimpleForm>
    </Edit>
);

export const ReportCreate = props => (
    <Create {...props} >
        <SimpleForm>
            <TextField source="id" />
            <TextField source="ResponsibleAreaID" />
            <TextField source="Date" />
            <TextField source="Title" />
            <TextField source="MemberID" />
        </SimpleForm >
    </Create >
);