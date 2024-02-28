// Loading.tsx
import React from 'react';
import { CircularProgress, Typography } from '@mui/material';

const Loading: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography variant="body1" style={{ marginTop: '1rem' }}>Загрузка, пожалуйста, подождите...</Typography>
        </div>
    );
}

export default Loading;
