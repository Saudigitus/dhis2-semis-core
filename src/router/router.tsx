import RouteList from './routeList';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import WithSideBarLayout from '../layout/sidebarLayout/withSideBarLayout';
import { EnrollmentPage } from 'dhis2-semis-enrollment';
import HomeLayout from '../layout/sidebarLayout/homeLayout';

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/semis" replace />} />
                <Route path='/semis' element={<HomeLayout />}>
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
                <Route path='/semis/enrollments' element={<WithSideBarLayout />}>
                    <Route path="/semis/enrollments" element={<EnrollmentPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
