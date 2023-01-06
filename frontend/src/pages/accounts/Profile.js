import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Upload, notification, Radio } from 'antd';
import { useAppContext } from 'store';
import { PlusOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { axiosInstance, useAxios } from 'api';
import { useState } from 'react';
import { getBase64FromFile } from 'utils/base64';
import { parseErrorMessages } from 'utils/forms';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '././Card.scss';

export default function Profile() {
    const {
        store: { bearerToken, username: requestUser },
    } = useAppContext();

    // 파일 상태값 저장
    const [fileList, setFileList] = useState([]);

    // 미리보기 상태값 저장
    const [previewPhoto, setPreviewPhoto] = useState({
        visible: false,
        base64: null,
    });

    // 프로필 상태값 저장
    const [profile, setProfile] = useState({});

    // Form 컨트롤
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const { state } = useLocation();

    const [fieldErrors, setFieldErrors] = useState({});

    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ data: userProfile, loding, error }, refetch] = useAxios({
        url: requestUser,
        headers,
    });

    useEffect(() => {
        setProfile(userProfile);
    }, [userProfile]);

    // Form.setvalue
    useEffect(() => {
        profile &&
            form.setFieldsValue({
                first_name: profile.first_name,
                last_name: profile.last_name,
                website_url: profile.website_url,
                bio: profile.bio,
                phone_number: profile.phone_number,
                gender: profile.gender,
            });
    }, [profile]);

    const navigateBack = (state) => {
        if (state) {
            navigate(state);
        } else {
            navigate(`/${requestUser}`);
        }
    };

    // 이미지를 fileList 상태값에 저장
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    // 파일 미리보기
    const handlePreviewPhoto = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64FromFile(file.originFileObj);
        }

        // 공개여부와 이미지 소스 설정
        setPreviewPhoto({
            visible: true,
            base64: file.url || file.preview,
        });
    };

    const handleFinish = async (fieldValues) => {
        const {
            first_name,
            last_name,
            website_url,
            bio,
            phone_number,
            gender,
        } = fieldValues;

        // formData에 key: value 값 저장
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('website_url', website_url);
        formData.append('bio', bio);
        formData.append('phone_number', phone_number);
        formData.append('gender', gender);

        if (fileList.length !== 0) {
            const {
                avatar: { fileList },
            } = fieldValues;

            fileList.forEach((file) => {
                formData.append('avatar', file.originFileObj);
            });
        }

        try {
            const response = await axiosInstance.put(
                `/${requestUser}/`,
                formData,
                { headers },
            );
            console.log(response);
            notification.open({
                message: '프로필 수정을 완료했습니다.',
                icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
            refetch();
        } catch (error) {
            if (error.response) {
                const { status, data: fieldsErrorMessages } = error.response;
                if (typeof fieldsErrorMessages === 'string') {
                    notification.open({
                        message: '서버 오류',
                        description: `에러) ${status} 응답을 받았습니다. 서버에러를 확인해주세요.`,
                        icon: <FrownOutlined style={{ color: '#ff3333' }} />,
                    });
                } else {
                    setFieldErrors(parseErrorMessages(fieldsErrorMessages));
                }
            }
        }
    };

    return (
        <div className="Card">
            <Card title="프로필">
                <Form {...layout} form={form} onFinish={handleFinish}>
                    <Form.Item
                        label="avatar"
                        name="avatar"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        hasFeedback
                        {...fieldErrors.avatar_url}
                    >
                        {/* 파일업로드를 도와주는 디자인 */}
                        <Upload
                            listType="picture-card"
                            fileList={fileList} // 파일목록
                            beforeUpload={() => {
                                // 업로드 방지
                                return false;
                            }}
                            onChange={handleUploadChange}
                            onPreview={handlePreviewPhoto}
                        >
                            {/* 파일의 개수가 1개 이상일 경우 업로드 차단 */}
                            {fileList.length > 0 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div className="ant_upload-text">
                                        Upload
                                    </div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="first_name"
                        name="first_name"
                        rules={[
                            {
                                required: false,
                                message: '이름을 입력해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.first_name}
                        {...fieldErrors.detail}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="last_name"
                        name="last_name"
                        rules={[
                            {
                                required: false,
                                message: '성을 입력해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.last_name}
                        {...fieldErrors.detail}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="website_url"
                        name="website_url"
                        rules={[
                            {
                                required: false,
                                message: '웹사이트 주소를 입력해주세요.',
                            },
                            {
                                type: 'url',
                                message:
                                    '올바른 웹사이트 형식이 아닙니다. 확인해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.website_url}
                        {...fieldErrors.detail}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="bio"
                        name="bio"
                        rules={[
                            {
                                required: false,
                                message: '성을 입력해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.bio}
                        {...fieldErrors.detail}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="phone_number"
                        name="phone_number"
                        rules={[
                            {
                                required: false,
                                message:
                                    '( - ) 없이 휴대폰 번호 11자리 번호를 입력해주세요.',
                            },
                            {
                                pattern: /^010[1-9]\d{3}\d{4}$/,
                                message:
                                    '11자리 숫자의 정확한 휴대폰 번호를 입력해주세요.',
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.phone_number}
                        {...fieldErrors.detail}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="gender"
                        name="gender"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        hasFeedback // 입력 컨트롤의 피드 아이콘 표시
                        {...fieldErrors.gender}
                        {...fieldErrors.detail}
                    >
                        <Radio.Group>
                            <Radio value="M"> 남성 </Radio>
                            <Radio value="F"> 여성 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: '0.5em' }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="ghost"
                            onClick={() => navigateBack(state)}
                            style={{ marginRight: '0.5em' }}
                        >
                            Cancel
                        </Button>
                        <Link to={'/ChangePassword'}>ChangePassword</Link>
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
