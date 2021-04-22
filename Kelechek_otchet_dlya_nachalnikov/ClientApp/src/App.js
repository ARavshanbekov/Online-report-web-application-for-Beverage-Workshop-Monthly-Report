// in src/App.js
import * as React from "react";
import { Admin, Resource, usePermissions, Login } from 'react-admin';
import { MemberList, MemberCreate, MemberEdit } from './pages/members';
import { CreateTsehTermoplast, EditTsehTermoplast, ShowTsehTermoplast, ListTsehTermoplast } from './pages/tsehTermoplast';
import { ListTsehRozlivaSecond, CreateTsehRozlivaSecond, EditTsehRozlivaSecond, ShowTsehRozlivaSecond } from './pages/tsehRozlivaSecond';
import { ListTsehRozlivaFirst, CreateTsehRozlivaFirst, EditTsehRozlivaFirst, ShowTsehRozlivaFirst } from './pages/tsehRozlivaFirst';
import dataProvider from './components/dataProvider';
import authProvider from './components/authProvider';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import './components/css/custom.css';
import Dashboard from './Dashboard';
import { CONSTANTS } from "./Constants";
const MyLoginPage = () => <Login backgroundImage="https://source.unsplash.com/1366x768/?accounting" />;

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

const App = () => {      
    const { permissions } = usePermissions();
    return (
        <Admin i18nProvider={i18nProvider} dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} loginPage={MyLoginPage} >
            {permissions => [
                permissions === CONSTANTS.PermissionAdministrator
                    ? <Resource name="members" options={{ label: "Ползователи" }} list={MemberList} create={MemberCreate} edit={MemberEdit} />
                    : null,
                permissions === CONSTANTS.PermissionThermoplasticProductionManager
                    ? <Resource name="tsehTermoplast" options={{ label: "Цех Термопласт" }} list={ListTsehTermoplast} create={CreateTsehTermoplast} edit={EditTsehTermoplast} show={ShowTsehTermoplast} />
                    : null,
                permissions === CONSTANTS.PermissionHeadOfBottlingProductionSecond
                    ? <Resource name="tsehRozlivaSecond" options={{ label: "Цех розлива №2" }} list={ListTsehRozlivaSecond} create={CreateTsehRozlivaSecond} edit={EditTsehRozlivaSecond} show={ShowTsehRozlivaSecond} />
                    : null,
                permissions === CONSTANTS.PermissionHeadOfBottlingProductionFirst
                    ? <Resource name="tsehRozlivaFirst" options={{ label: "Цех розлива №1" }} list={ListTsehRozlivaFirst} create={CreateTsehRozlivaFirst} edit={EditTsehRozlivaFirst} show={ShowTsehRozlivaFirst} />
                    : null,
                permissions === CONSTANTS.PermissionChiefAccountant
                    ? <Resource name="tsehRozlivaFirst" options={{ label: "Цех розлива №1" }} list={ListTsehRozlivaFirst} show={ShowTsehRozlivaFirst} />
                    : null,
                permissions === CONSTANTS.PermissionChiefAccountant
                    ? <Resource name="tsehRozlivaSecond" options={{ label: "Цех розлива №2" }} list={ListTsehRozlivaSecond} show={ShowTsehRozlivaSecond} />
                    : null,
                permissions === CONSTANTS.PermissionChiefAccountant
                    ? <Resource name="tsehTermoplast" options={{ label: "Цех Термопласт" }} list={ListTsehTermoplast} show={ShowTsehTermoplast} />
                    : null,
                permissions === CONSTANTS.PermissionDirector
                    ? <Resource name="tsehRozlivaFirst" options={{ label: "Цех розлива №1" }} list={ListTsehRozlivaFirst} show={ShowTsehRozlivaFirst} />
                    : null,
                permissions === CONSTANTS.PermissionDirector
                    ? <Resource name="tsehRozlivaSecond" options={{ label: "Цех розлива №2" }} list={ListTsehRozlivaSecond} show={ShowTsehRozlivaSecond} />
                    : null,
                permissions === CONSTANTS.PermissionDirector
                    ? <Resource name="tsehTermoplast" options={{ label: "Цех Термопласт" }} list={ListTsehTermoplast} show={ShowTsehTermoplast} />
                    : null,
                permissions === CONSTANTS.PermissionDirector
                    ? <Resource name="members" options={{ label: "Ползователи" }} list={MemberList} create={MemberCreate} edit={MemberEdit} />
                    : null,
            ]}             
            </Admin >                       
    )
}

export default App;