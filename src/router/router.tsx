import RouteList from './routeList';
import WithSideBarLayout from '../layout/withSideBarLayout';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SyncUrlWithGlobalShell } from './syncUrlWithGlobalShell';

export default function Router() {

    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/semis" replace />} />
                <Route path='/semis' element={
                    <>
                        <SyncUrlWithGlobalShell />
                        <WithSideBarLayout />
                    </>
                }
                >
                    {
                        RouteList().map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <>
                                        <SyncUrlWithGlobalShell />
                                        {route.component}
                                    </>
                                }
                            />
                        ))
                    }
                </Route>
            </Routes>
        </HashRouter>
    );
}
