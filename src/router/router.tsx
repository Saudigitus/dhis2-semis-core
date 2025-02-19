import Home from '../pages/home';
import { EnrollmentPage } from 'dhis2-semis-enrollment';
import { useMenuData } from '../hooks/menu/useMenuData';
import { SideBar, SideBarLayout } from 'dhis2-semis-components';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

export default function Router() {
    const { menuData } = useMenuData()

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/semis" replace />} />
            <Route path="/semis" element={
                <SideBarLayout sidebar={<SideBar sideBarBtnPosition={"top-offset"}collapsed={false} sideBarData={menuData} />}>
                    <Outlet />
                </SideBarLayout>
            }>
                <Route index element={<Home />} />
                <Route path="enrollments" element={<EnrollmentPage />} />
            </Route>
        </Routes>
    );
}
