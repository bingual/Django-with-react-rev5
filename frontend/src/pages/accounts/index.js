import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';
import LoginRequiredPage from '../../utils/LoginRequiredPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            {/* <Route path="profile" element={<LoginRequiredPage />} /> */}
            <Route element={<LoginRequiredPage />}>
                {/* 중첩 라우트를 이런방식으로 사용시 자식에서 Outlet 사용필요 */}
                <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="signup" element={<Signup />} />
        </Routes>
    );
};

export default AppRoutes;
