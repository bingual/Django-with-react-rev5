import { Button, Alert } from 'antd';
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from 'store';
import { axiosInstance, useAxios } from 'api';
import { useState, useEffect } from 'react';

export default function UserPage() {
    const {
        store: { bearerToken, username: requestUser },
    } = useAppContext();

    const navigate = useNavigate();

    // 파라미터값 추출
    const params = useParams();
    const { username: pageUser } = params;

    // 프로필 상태값 저장
    const [profile, setProfile] = useState({});

    //
    const [postList, setpostList] = useState([]);
    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: userProfile, loding, error }, refetch] = useAxios({
        url: pageUser,
        headers,
    });

    const [{ data: userpostList, loding2, error2 }, refetch2] = useAxios({
        url: `${pageUser}/postList`,
        headers,
    });

    useEffect(() => {
        setProfile(userProfile);
    }, [userProfile]);

    useEffect(() => {
        setpostList(userpostList);
    }, [userpostList]);

    console.log(userpostList);

    // 팔로우
    const onFollowUser = (username) => {
        const data = { username };
        const config = { headers };
        axiosInstance
            .post('/accounts/follow/', data, config)
            .then((response) => {
                console.log(response);
                refetch();
            })
            .catch((error) => console.error(error));
    };

    // 언팔로우
    const unFollowUser = (username) => {
        const data = { username };
        const config = { headers };
        axiosInstance
            .post('/accounts/unfollow/', data, config)
            .then((response) => {
                console.log(response);
                refetch();
            })
            .catch((error) => console.error(error));
    };

    if (profile && profile.username === pageUser) {
        const {
            username,
            avatar_url,
            first_name,
            last_name,
            follower_count,
            following_count,
            post_list_count,
            is_follow,
        } = profile;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <img
                            className="rounded-circle"
                            src={avatar_url}
                            alt="None"
                            width="160px;"
                            height="160px;"
                        />
                    </div>

                    <div className="col-sm-9">
                        <span style={{ marginRight: '0.5em' }}>{username}</span>
                        {username === requestUser && (
                            <Button
                                onClick={() => navigate('/accounts/profile')}
                            >
                                프로필 수정
                            </Button>
                        )}
                        {username !== requestUser && is_follow === false && (
                            <Button onClick={() => onFollowUser(username)}>
                                팔로우
                            </Button>
                        )}
                        {username !== requestUser && is_follow === true && (
                            <Button onClick={() => unFollowUser(username)}>
                                언팔로우
                            </Button>
                        )}
                        <hr />
                        {post_list_count} 게시물 {follower_count} 팔로워{' '}
                        {following_count} 팔로우
                        <hr />
                        {last_name} {first_name}
                    </div>
                </div>

                <hr />

                <div className="row my-5">
                    <h2 style={{ marginBottom: '1.0em' }}>게시글 목록</h2>
                    {postList && postList.length === 0 && (
                        <Alert type="warning" message="포스팅이 없습니다." />
                    )}
                    {postList &&
                        postList.map((post) => (
                            <div className="col-sm-4" key={post.id}>
                                <Link to={`/posts/${post.id}`}>
                                    <img
                                        src={post.photo}
                                        alt={post.username}
                                        style={{ width: '100%' }}
                                    />
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        );
    } else {
        return (
            <>
                <Alert
                    type="error"
                    message="해당 사용자는 존재 하지 않습니다."
                />
            </>
        );
    }
}
