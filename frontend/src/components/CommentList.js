import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useAppContext } from 'store';
import { axiosInstance, useAxios } from 'api';
import Comment from './Comment';

export default function CommentList({ post }) {
    const {
        store: { bearerToken },
    } = useAppContext();

    const [commentContent, setCommentContent] = useState('');

    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: commentList, loading, error }, refetch] = useAxios({
        url: `/api/posts/${post.id}/comments`,
        headers,
    });

    // 댓글쓰기
    const handleCommentSave = async () => {
        const apiUrl = `/api/posts/${post.id}/comments/`;
        console.group('handleCommentSave');
        try {
            const response = await axiosInstance.post(
                apiUrl,
                {
                    messages: commentContent,
                },
                { headers },
            );
            console.log(response);
            setCommentContent('');
            refetch();
        } catch (error) {
            console.log(error);
        }

        console.groupEnd();
    };

    // FIXME:댓글삭제
    const handleDelete = async (commentId) => {
        const apiUrl = `/api/posts/${post.id}/comments/${commentId}`;
        console.group('handleDelete');
        try {
            const response = await axiosInstance.delete(apiUrl, { headers });
            console.log(response);
            setCommentContent('');
            refetch();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {commentList &&
                commentList.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        handleDelete={handleDelete}
                    />
                ))}
            <Input.TextArea
                style={{ marginBottom: '0.5em' }}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button
                block
                type="primary"
                disabled={commentContent.length === 0}
                onClick={handleCommentSave}
            >
                댓글쓰기
            </Button>
        </div>
    );
}
