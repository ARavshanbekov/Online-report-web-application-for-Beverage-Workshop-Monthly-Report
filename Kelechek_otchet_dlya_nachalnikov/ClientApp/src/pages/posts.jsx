// in src/posts.jsx
import * as React from "react";
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    Create,
} from 'react-admin';

export const PostList = props => (
    <List {...props}>
        <Datagrid>            
            <TextField source="Date" label="Дата" />
            <TextField source="Title" label="Заглавие" />          
            <EditButton/>
        </Datagrid>
    </List>
);