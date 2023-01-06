import React, { useState } from 'react';
import { axiosInstance, useAxios } from 'api';
import { useAppContext } from 'store';
import { Card, Form, Input, Button, notification } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseErrorMessages } from 'utils/forms';
import { deleteToken } from 'store';
import 'pages/accounts/Card.scss';

export default function ChangePassword() {
    const {
        store: { bearerToken, username: requestUser },
        dispatch,
    } = useAppContext();

    const navigate = useNavigate();
    const location = useLocation();

    const [fieldErrors, setFieldErrors] = useState({});

    const { from: loginRedirectUrl } = location.state || {
        from: { pathname: '/' },
    };

    const onFinish = (values) => {
        async function fn() {
            // 에러내역 초기화
            setFieldErrors({});

            const { old_password, new_password, new_password2 } = values;

            const formData = new FormData();
            formData.append('old_password', old_password);
            formData.append('new_password', new_password);
            formData.append('new_password2', new_password2);

            const headers = { Authorization: `Bearer ${bearerToken}` };
            try {
                const response = await axiosInstance.put(
                    '/accounts/change-password/',
                    formData,
                    {
                        headers,
                    },
                );
                console.log('response : ', response);

                // 오른쪽 상단의 알림메시지 출력하는 antd 기능
                notification.open({
                    message: '암호변경 성공',
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                });
                dispatch(deleteToken());
            } catch (error) {
                if (error.response) {
                    notification.open({
                        message: '암호변경 실패',
                        description: '암호를 확인해주세요.',
                        icon: <FrownOutlined style={{ color: '#ff3333' }} />,
                    });
                    const { data: fieldsErrorMessages } = error.response;
                    console.log('fieldsErrorMessages :', fieldsErrorMessages);
                    setFieldErrors(parseErrorMessages(fieldsErrorMessages));
                }
            }
        }
        fn();
    };
    return (
        <div className="Card">
            <Card title="암호 변경">
                <Form {...layout} onFinish={onFinish}>
                    <Form.Item
                        label="old_password"
                        name="old_password"
                        rules={[
                            {
                                required: true,
                                message: '기존 암호를 입력해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.old_password}
                        {...fieldErrors.detail}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="new_password"
                        name="new_password"
                        rules={[
                            {
                                required: true,
                                message: '새로운 암호를 입력해주세요.',
                            },
                        ]}
                        {...fieldErrors.new_password}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="new_password2"
                        name="new_password2"
                        rules={[
                            {
                                required: true,
                                message: '새로운 암호와 동일하게 입력해주세요.',
                            },
                        ]}
                        {...fieldErrors.new_password2}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...taiLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: '0.5em' }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="ghost"
                            onClick={() => navigate(loginRedirectUrl)}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const taiLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
