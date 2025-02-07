import RouteList from './routeList';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import WithSideBarLayout from '../layout/sidebarLayout/withSideBarLayout';
import { EnrollmentsPage } from 'dhis2-semis-enrollment';

export default function Router() {
    return (
        <HashRouter>
            {/* <Routes>
                <Route path='/home' element={<div>kekeke</div>} />
            </Routes> */}
            <EnrollmentsPage />
        </HashRouter>
    )
}