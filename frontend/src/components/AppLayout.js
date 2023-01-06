import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './AppLayout.module.scss';
import { Input, Menu, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import LogoImage from 'assets/instagram_logo.png';
import { useAppContext } from 'store';
import { deleteToken } from 'store';
import { useNavigate } from 'react-router-dom';

const AppLayout = ({ sidebar }) => {
    const {
        store: { isAuthenticated, username: requestUser },
        dispatch,
    } = useAppContext();

    const navigate = useNavigate();

    const handleLogout = () => {
        notification.open({
            message: '로그아웃 되었습니다.',
            icon: <SmileOutlined style={{ color: '#ff3333' }} />,
        });
        dispatch(deleteToken());
    };

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <h1 className={styles.page_title}>
                    <Link to="/">
                        <img src={LogoImage} alt="logo" width="108px" />
                    </Link>
                </h1>
                <div className={styles.search}>
                    <Input.Search />
                </div>
                <div className={styles.topnav}>
                    <Menu mode="horizontal" title="사용자">
                        {isAuthenticated && (
                            <Menu.Item>
                                <Link onClick={handleLogout}>로그아웃</Link>
                            </Menu.Item>
                        )}
                        {isAuthenticated && (
                            <Menu.Item>
                                <Link to={`/${requestUser}`}>프로필</Link>
                            </Menu.Item>
                        )}
                    </Menu>
                </div>
            </div>
            <div className={styles.contents}>
                <Outlet />
            </div>
            <div className={styles.sidebar}>{sidebar}</div>
            <div className={styles.footer}>&copy; 2022. Adora Company.</div>
        </div>
    );
};

export default AppLayout;
