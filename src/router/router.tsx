import RouteList from './routeList';
import WithSideBarLayout from '../layout/withSideBarLayout';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

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
        </HashRouter>
    );
}
