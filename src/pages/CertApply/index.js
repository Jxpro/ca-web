import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Step from '../../components/Step';

function CertApply() {
    return (
        <div>
            <Step />
            <Outlet />
        </div>
    );
}

export default React.memo(CertApply);