import React, { useState, useEffect } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import axios from 'axios';
import LoadingPage from '../LoadingPage/LoadingPage';
interface TokenomicsProps {
    // Define props here
}

const Tokenomics: React.FC<TokenomicsProps> = (props) => {

    const { project, fetchAdaPrice, price_ada, isLoadingPrice } = useProjectDetailStore();
    const goal = project.goal;
    const cdRequestedMaxADA = project.cdRequestedMaxADA;


    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    console.log(price_ada)


    if (isLoadingPrice) {
        return <LoadingPage />;
    }



    return (
        <div>
            <div
                dangerouslySetInnerHTML={{ __html: project.tokenomics_description }}
            />
        </div>
    );
}

export default Tokenomics;