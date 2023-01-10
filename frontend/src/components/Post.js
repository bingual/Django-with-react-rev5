import React from 'react';
import { Avatar, Card, Popconfirm, Button } from 'antd';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import CommentList from './CommentList';
import { axiosInstance } from 'api';
import { useAppContext } from 'store';
import { Link, Routes, useNavigate } from 'react-router-dom';
const Post = ({ post, handleLike, handleDelete }) => {
    const {
        store: { username: requestUser },
    } = useAppContext();

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

    console.log(tag_set);
    return (
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
                            onClick={() => handleLike({ post, isLike: false })}
                        />
                    ) : (
                        <HeartOutlined
                            onClick={() => handleLike({ post, isLike: true })}
                        />
                    ),
                ]}
            >
                <Card.Meta
                    avatar={
                        <Link to={`/${username}`}>
                            <Avatar
                                size="large"
                                icon={<img src={avatar_url} alt={username} />}
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
                {requestUser === username && (
                    <Popconfirm
                        title="정말 삭제하겠습니까?"
                        okText="예"
                        cancelText="아니오"
                        onConfirm={() => handleDelete(id)}
                    >
                        <Button
                            type="primary"
                            style={{
                                marginTop: '0.5em',
                                marginBottom: '0.5em',
                            }}
                        >
                            포스팅 삭제
                        </Button>
                    </Popconfirm>
                )}
                <CommentList post={post} />
            </Card>
        </div>
    );
};

export default Post;
