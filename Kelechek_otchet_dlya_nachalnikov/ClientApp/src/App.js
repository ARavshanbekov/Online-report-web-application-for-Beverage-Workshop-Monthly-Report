// in src/App.js
import * as React from "react";
import { Admin, Resource, usePermissions } from 'react-admin';
import { MemberList, MemberCreate, MemberEdit } from './pages/members';
import { ReportCreate, ReportEdit, ReportList } from './pages/reports';
import { TermoplastList, TermoplastCreate, TermoplastEdit } from './pages/termoplastIVyduv';
import { TsehRozlivaList, TsehRozlivaCreate, TsehRozlivaEdit } from './pages/tsehRozliva';
import dataProvider from './components/dataProvider';
import authProvider from './components/authProvider';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import russianMessages from 'ra-language-russian';
import './custom.css';

import Dashboard from './Dashboard';

const i18nProvider = polyglotI18nProvider(() => russianMessages, 'ru');

const App = () => { 
     
    const { permissions } = usePermissions();
    return (
        <Admin i18nProvider={i18nProvider} dashboard={Dashboard} dataProvider={dataProvider} authProvider={authProvider} >
            {permissions => [
                //permissions === 'admin'
                //    ? <Resource name="members" options={{ label: "Ползователи" }} list={MemberList} />
                //    : null,
                permissions === 'завсклад'
                    ? <Resource name="termoplastIVyduv" options={{ label: "Термопласт и выдув" }} list={TermoplastList} create={TermoplastCreate} edit={TermoplastEdit} />
                    : null,
                permissions === 'нач. цех №2'
                    ? <Resource name="tsehRozliva" options={{ label: "Цех розлива №2" }} list={TsehRozlivaList} create={TsehRozlivaCreate} edit={TsehRozlivaEdit} />
                    : null

            ]}
            <Resource name="members" options={{ label: "Ползователи" }} list={MemberList} create={MemberCreate} edit={MemberEdit} />
            <Resource name="reports" options={{ label: "Отчеты" }} list={MemberList} create={ReportCreate} edit={ReportEdit} />
        </Admin >
    )
}

export default App;