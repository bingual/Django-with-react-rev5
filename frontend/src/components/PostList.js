import React, { useEffect, useState } from 'react';
import Post from './Post';
import { useAppContext } from 'store';
import { axiosInstance, useAxios } from 'api';
import { Alert } from 'antd';

const PostList = () => {
    // simple_jwt토큰 인증
    const {
        store: { bearerToken },
    } = useAppContext();

    const [postList, setPostList] = useState([]);

    // 포스팅 출력
    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: originPostList, loading, error }, refetch] = useAxios({
        url: '/api/posts/',
        headers,
    });

    // 마운트 됐을때 useAxios의 요청을 다시한번 보냄
    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        setPostList(originPostList);
    }, [originPostList]);

    // 좋아요 설정
    const handleLike = async ({ post, isLike }) => {
        const apiUrl = `/api/posts/${post.id}/like/`;
        const method = isLike ? 'POST' : 'DELETE';
        try {
            const response = await axiosInstance({
                url: apiUrl,
                method,
                headers,
            });
            console.log('reponse : ', response);

            setPostList((prevList) => {
                return prevList.map((currentPost) =>
                    currentPost === post
                        ? { ...currentPost, is_like: isLike }
                        : currentPost,
                );
            });
        } catch (error) {
            console.error('error', error);
        }
    };

    // 포스팅 삭제
    const handleDelete = async (postId) => {
        try {
            const response = await axiosInstance.delete(
                `/api/posts/${postId}/`,
                {
                    headers,
                },
            );
            console.log(response);
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {postList && postList.length === 0 && (
                <Alert type="warning" message="포스팅이 없습니다." />
            )}
            {postList &&
                postList.map((post, id) => (
                    <div style={{ marginBottom: '1.0em' }}>
                        <Post
                            key={id}
                            post={post}
                            handleLike={handleLike}
                            handleDelete={handleDelete}
                        />
                    </div>
                ))}
        </div>
    );
};

export default PostList;
