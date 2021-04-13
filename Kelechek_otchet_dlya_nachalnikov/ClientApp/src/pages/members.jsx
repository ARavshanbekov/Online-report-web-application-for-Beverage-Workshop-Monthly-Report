// in src/members.js
import * as React from "react";
import { List, Datagrid, TextField, Edit, Create, SimpleForm, TextInput, EditButton } from 'react-admin';

export const MemberList = props => (
    <List {...props}>
        <Datagrid>            
            <TextField source="firstName" label={"Имя"} />
            <TextField source="lastName" label={"Фамилия"}/>
            <TextField source="phoneNumber" label={"Телефон"}/>            
            <EditButton />
        </Datagrid>
    </List>
);

export const MemberEdit = props => (
    <Edit {...props}>
        <SimpleForm>           
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="phoneNumber" />
            <TextInput source="username" />
            <TextInput source="password" />        
        </SimpleForm>
    </Edit>
);

export const MemberCreate = props => (
    <Create {...props} >
        <SimpleForm>            
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="phoneNumber" />
            <TextInput source="username" />
            <TextInput source="password" />        
        </SimpleForm >
    </Create >
);