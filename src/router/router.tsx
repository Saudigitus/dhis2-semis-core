import RouteList from './routeList';
import WithSideBarLayout from '../layout/withSideBarLayout';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SyncUrlWithGlobalShell } from './syncUrlWithGlobalShell';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 60 * 1000, // 5 hours
        },
    },
});

export default function Router() {

    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
}
