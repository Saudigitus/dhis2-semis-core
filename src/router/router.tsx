import RouteList from './routeList';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import WithSideBarLayout from '../layout/sidebarLayout/withSideBarLayout';
import { EnrollmentsPage } from 'dhis2-semis-enrollment';

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/semis" replace />} />
                <Route path='/semis' element={<WithSideBarLayout />}>
                    {
                        RouteList().map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.component}
                            />
                        ))
                    }
                </Route>
            </Routes>
            <EnrollmentsPage/>
        </HashRouter>
    )
}