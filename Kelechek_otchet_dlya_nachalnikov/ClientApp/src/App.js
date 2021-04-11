// in src/App.js
import * as React from "react";
import { Admin, Resource, usePermissions } from 'react-admin';
import { MemberList, MemberCreate, MemberEdit } from './pages/members';
import { CreateTsehTermoplast, EditTsehTermoplast, ShowTsehTermoplast, ListTsehTermoplast } from './pages/tsehTermoplast';
import { ListTsehRozlivaSecond, CreateTsehRozlivaSecond, EditTsehRozlivaSecond, ShowTsehRozlivaSecond } from './pages/tsehRozlivaSecond';
import { ListTsehRozlivaFirst, CreateTsehRozlivaFirst, EditTsehRozlivaFirst, ShowTsehRozlivaFirst } from './pages/tsehRozlivaFirst';
import dataProvider from './components/dataProvider';
import authProvider from './components/authProvider';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import './css/custom.css';
import Dashboard from './Dashboard';

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

const App = () => {      
    const { permissions } = usePermissions();
    return (        
        <Admin title="my page title" i18nProvider={i18nProvider} dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} >
            {permissions => [
                permissions === 'admin'
                    ? <Resource name="members" options={{ label: "Ползователи" }} list={MemberList} create={MemberCreate} edit={MemberEdit} />
                    : null,                                
                permissions === 'завсклад'
                    ? <Resource name="tsehTermoplast" options={{ label: "Цех Термопласт" }} list={ListTsehTermoplast} create={CreateTsehTermoplast} edit={EditTsehTermoplast} show={ShowTsehTermoplast} />
                    : null,
                permissions === 'нач. цех №2'
                    ? <Resource name="tsehRozlivaSecond" options={{ label: "Цех розлива №2" }} list={ListTsehRozlivaSecond} create={CreateTsehRozlivaSecond} edit={EditTsehRozlivaSecond} show={ShowTsehRozlivaSecond} />
                    : null,
                permissions === 'нач. цех №1'
                    ? <Resource name="tsehRozlivaFirst" options={{ label: "Цех розлива №1" }} list={ListTsehRozlivaFirst} create={CreateTsehRozlivaFirst} edit={EditTsehRozlivaFirst} show={ShowTsehRozlivaFirst} />
                    : null,
                permissions === 'chiefAccountant'
                    ? <Resource name="tsehRozlivaFirst" options={{ label: "Цех розлива №1" }} list={ListTsehRozlivaFirst} show={ShowTsehRozlivaFirst} />
                    : null,
                permissions === 'chiefAccountant'
                    ? <Resource name="tsehRozlivaSecond" options={{ label: "Цех розлива №2" }} list={ListTsehRozlivaSecond} show={ShowTsehRozlivaSecond} />
                    : null,
                permissions === 'chiefAccountant'
                    ? <Resource name="tsehTermoplast" options={{ label: "Цех розлива №2" }} list={ListTsehTermoplast} show={ShowTsehTermoplast} />
                    : null,
            ]}             
            </Admin >                       
    )
}

export default App;