// in src/members.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField } from 'react-admin';

export const MemberList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="surname" />
            <TextField source="phoneNumber" />
            <TextField source="username" />
            <TextField source="password" />            
        </Datagrid>
    </List>
);

export default MemberList;