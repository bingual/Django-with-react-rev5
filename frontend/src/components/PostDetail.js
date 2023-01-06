import React, { useEffect, useState } from 'react';
import { useAppContext } from 'store';
import { axiosInstance, useAxios } from 'api';
import { useParams } from 'react-router-dom';
import { Card, Button, Avatar, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import CommentList from './CommentList';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';

export default function PostDetail() {
    const {
        store: { bearerToken, username: requestUser },
    } = useAppContext();

    const { postId } = useParams();

    const [post, setPost] = useState();

    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: postDetail, loding, error }, refetch] = useAxios({
        url: `/api/posts/${postId}`,
        headers,
    });

    useEffect(() => {
        setPost(postDetail);
    }, [postDetail]);

    // 좋아요 설정
    const handleLike = async (postId, { isLike }) => {
        const apiUrl = `/api/posts/${postId}/like/`;
        const method = isLike ? 'POST' : 'DELETE';
        try {
            const response = await axiosInstance({
                url: apiUrl,
                method,
                headers,
            });
            console.log('reponse : ', response);

            setPost((prevList) => {
                return { ...prevList, is_like: isLike };
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

    //FIXME: 미구현
    const handleEdit = async (postId) => {};

    if (typeof post !== 'undefined') {
        const {
            id,
            author,
            caption,
            caption_origin,
            location,
            photo,
            tag_set,
            is_like,
        } = post;
        const { username, name, avatar_url } = author;
        return (
            <>
                <div>
                    <Card
                        hoverable
                        cover={
                            <Link to={`/posts/${id}`}>
                                <img src={photo} alt={caption} width="100%;" />
                            </Link>
                        }
                        actions={[
                            is_like ? (
                                <HeartTwoTone
                                    twoToneColor="#eb2f96"
                                    onClick={() =>
                                        handleLike(postId, { isLike: false })
                                    }
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={() =>
                                        handleLike(postId, { isLike: true })
                                    }
                                />
                            ),
                        ]}
                    >
                        <Card.Meta
                            avatar={
                                <Link to={`/${username}`}>
                                    <Avatar
                                        size="large"
                                        icon={
                                            <img
                                                src={avatar_url}
                                                alt={username}
                                            />
                                        }
                                    />
                                </Link>
                            }
                            title={[
                                <small
                                    className="text-muted"
                                    style={{ marginRight: '0.5em' }}
                                >
                                    {username}
                                </small>,
                                location,
                            ]}
                            description={[
                                caption_origin,
                                <br />,
                                tag_set &&
                                    tag_set.map((tag) => {
                                        return (
                                            <small
                                                className="badge bg-primary"
                                                style={{ marginRight: '0.5em' }}
                                            >
                                                #{tag}
                                            </small>
                                        );
                                    }),
                            ]}
                            style={{ marginBottom: '0.5em' }}
                        />
                        <CommentList post={post} />

                        {/* FIXME: 미구현 */}
                        {requestUser === username && (
                            <Button
                                style={{
                                    marginTop: '0.5em',
                                    marginRight: '0.5em',
                                }}
                                onClick={() => handleEdit(id)}
                            >
                                수정
                            </Button>
                        )}
                        {requestUser === username && (
                            <Popconfirm
                                title="정말 삭제하겠습니까?"
                                okText="예"
                                cancelText="아니오"
                                onConfirm={() => handleDelete(id)}
                            >
                                <Button style={{ marginTop: '0.5em' }}>
                                    삭제
                                </Button>
                            </Popconfirm>
                        )}
                    </Card>
                </div>
            </>
        );
    }
}
