import React, { useEffect, useState } from 'react';
import './SuggestionList.scss';
import { Card } from 'antd';
import Suggestion from './Suggestion';
import { axiosInstance, useAxios } from 'api';
import { useAppContext } from 'store';
import { Button } from 'antd';

export default function SuggestionList({ style }) {
    const {
        store: { bearerToken },
    } = useAppContext();

    const [userList, setUserList] = useState([]);

    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: orignUserList, loading, error }, refetch] = useAxios({
        url: '/accounts/suggestions/',
        headers,
    });

    // 디펜더시(orignUserList) 값이 바뀔때에만 함수실행
    // 요청을보내어서 받기전까지는 데이터는 언디파인드로 처리가됨
    // 값이 있을때 순회시키게 로직수행

    // is_follow 상태값 설정
    useEffect(() => {
        if (!orignUserList) setUserList([]);
        else
            setUserList(
                orignUserList.map((user) => ({
                    ...user,
                    is_follow: false,
                })),
            );
    }, [orignUserList]);

    // is_follow true 설정
    const onFollowUser = (username) => {
        const data = { username };
        const config = { headers };
        axiosInstance
            .post('/accounts/follow/', data, config)
            .then((response) =>
                setUserList((prevUserList) =>
                    prevUserList.map((user) =>
                        user.username !== username
                            ? user
                            : { ...user, is_follow: true },
                    ),
                ),
            )
            .catch((error) => console.error(error));
    };

    return (
        <div style={style}>
            {/* 로딩과 에러 처리 */}
            {loading && <div>Loading...</div>}
            {error && <div>로딩 중에 에러가 발생했습니다.</div>}

            <Card title="Suggestions for you" size="small">
                {userList.map((suggestionUser) => (
                    <Suggestion
                        key={suggestionUser.username}
                        suggestionUser={suggestionUser}
                        onFollowUser={onFollowUser}
                    />
                ))}
            </Card>
        </div>
    );
}
