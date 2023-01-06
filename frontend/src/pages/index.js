import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import Home from './Home';
import LoginRequiredPage from '../utils/LoginRequiredPage';
import AccountsRoutes from 'pages/accounts';
import AppLayout from 'components/AppLayout';
import AppLayout2 from 'components/AppLayout2';
import StoryList from 'components/StoryList';
import SuggestionList from 'components/SuggestionList';
import About from './About';
import PostNew from './PostNew';
import UserPage from 'components/UserPage';
import PostDetail from 'components/PostDetail';
import ChangePassword from 'components/ChangePassword';

const Root = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/posts/new');

    const sidebar = (
        <>
            <Button
                type="primary"
                block
                style={{ marginBottom: '1rem' }}
                onClick={handleClick}
            >
                새 포스팅 쓰기
            </Button>
            <StoryList style={{ marginBottom: '1rem' }} />
            <SuggestionList style={{ marginBottom: '1rem' }} />
        </>
    );
    return (
        <div>
            <Routes>
                {/*
                react-router-dom에서는 중첩 라우트 직접 기재시
                /* 와 같이 와일드 카드(*)를 사용해서
                / 주소 뒤에 무언가 더 올 수 있다고 명시를 해준다.
            */}
                <Route element={<AppLayout sidebar={sidebar} />}>
                    <Route element={<LoginRequiredPage />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Route>

                <Route element={<AppLayout2 />}>
                    <Route element={<LoginRequiredPage />}>
                        <Route path="/:username" element={<UserPage />} />
                        <Route path="/posts/:postId" element={<PostDetail />} />
                    </Route>
                </Route>

                <Route path="/accounts/*" element={<AccountsRoutes />} />
                <Route path="*" element={<RouteNoMatch />} />
                <Route path="/about" element={<About />} />
                <Route element={<LoginRequiredPage />}>
                    <Route
                        path="/changePassword"
                        element={<ChangePassword />}
                    />
                    <Route path="/posts/new" element={<PostNew />} />
                </Route>
            </Routes>
        </div>
    );
};

const RouteNoMatch = () => {
    return (
        <>
            <h1>잘못된 경로로 접근하였습니다.</h1>
        </>
    );
};

export default Root;
