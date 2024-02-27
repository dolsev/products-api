import React from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingProps {
    loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loading && <CircularProgress />}
        </div>
    );
}

export default Loading;
