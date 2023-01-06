import React from 'react';
import { Card } from 'antd';
import './StoryList.scss';

export default function StoryList({ style }) {
    return (
        <div style={style}>
            <Card title="StoryList" size="small">
                Stories from people follow will show up here.
            </Card>
        </div>
    );
}
