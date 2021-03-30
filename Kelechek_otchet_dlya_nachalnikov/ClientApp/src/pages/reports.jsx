// in src/reports.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField, Create, Edit, SimpleForm, TextInput, DateField, DateInput, EditButton } from 'react-admin';

export const ReportList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="title" label={"Названия"} />
            <DateField source="date" label={"Дата"}/>                       
            <EditButton />
        </Datagrid>
    </List>
);


export const ReportEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="ResponsibleAreaID" />
            <DateInput source="Date" />
            <TextInput source="Title" />
            <TextInput source="MemberID" />
        </SimpleForm>
    </Edit>
);

export const ReportCreate = props => (
    <Create {...props} >
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="ResponsibleAreaID" />
            <DateInput source="Date" />
            <TextInput source="Title" />
            <TextInput source="MemberID" />
        </SimpleForm >
    </Create >
);