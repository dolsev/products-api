import React from 'react';
import { CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
    return (
        <>
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: '1rem' }}>Загрузка, пожалуйста, подождите...</Typography>
                </div>
            )}
        </>
    );
};

export default Loading;
