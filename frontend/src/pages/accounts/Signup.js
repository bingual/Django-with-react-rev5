import React, { useState } from 'react';
import { Form, Input, Button, notification, Card } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from 'api';
import { parseErrorMessages } from 'utils/forms';
import '././Card.scss';

export default function Signup() {
    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});

    const handleLoginPage = () => {
        notification.open({
            message: '로그인 페이지로 이동합니다.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        navigate('/accounts/login');
    };

    const onFinish = (values) => {
        async function fn() {
            const { username, password, email, first_name, last_name } = values;

            setFieldErrors({});

            const data = { username, password, email, first_name, last_name };
            try {
                await axiosInstance.post('/accounts/signup/', data);

                notification.open({
                    message: '회원가입 성공',
                    description: '로그인 페이지로 이동합니다.',
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                });

                navigate('/accounts/login');
            } catch (error) {
                if (error.response) {
                    notification.open({
                        message: '회원가입 실패',
                        description: '유효하지않은 항목들을 확인해주세요.',
                        icon: <FrownOutlined style={{ color: '#ff3333' }} />,
                    });

                    const { data: fieldsErrorMessages } = error.response;

                    setFieldErrors(parseErrorMessages(fieldsErrorMessages));
                }
            }
        }
        fn();
    };

    return (
        <div className="Card">
            <Card title="회원가입">
                <Form
                    {...layout}
                    onFinish={onFinish}
                    //   onFinishFailed={onFinishFailed}
                    autoComplete={'false'}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '사용자 이름을 입력해주세요.',
                            },
                            { min: 5, message: '5글자이상 입력해주세요.' },
                        ]}
                        hasFeedback
                        {...fieldErrors.username}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '사용자 암호를 입력해주세요.',
                            },
                        ]}
                        hasFeedback
                        {...fieldErrors.password}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: '이메일을 입력해주세요.',
                            },
                            {
                                type: 'email',
                                message: '정확한 이메을 주소를 입력해주세요.',
                            },
                        ]}
                        hasFeedback
                        {...fieldErrors.email}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="first_name"
                        name="first_name"
                        rules={[
                            {
                                required: true,
                                message: '성을 입력해주세요.',
                            },
                        ]}
                        hasFeedback
                        {...fieldErrors.first_name}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="last_name"
                        name="last_name"
                        rules={[
                            {
                                required: true,
                                message: '이름을 입력해주세요.',
                            },
                        ]}
                        hasFeedback
                        {...fieldErrors.last_name}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <p>
                            계정이 있습니까?{' '}
                            <Button onClick={handleLoginPage}>
                                로그인 하기
                            </Button>
                        </p>
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

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
