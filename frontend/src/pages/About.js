import React from 'react';
import { axiosInstance, useAxios } from 'api';
import { useAppContext } from 'store';

const About = () => {
    const {
        store: { bearerToken },
    } = useAppContext();

    const headers = { Authorization: `Bearer ${bearerToken}` };

    const [{ response, loading, error }, refetch] = useAxios({
        url: '/api/posts/',
        headers,
    });
    console.log('about : ', response);

    return <div>About</div>;
};

export default About;
