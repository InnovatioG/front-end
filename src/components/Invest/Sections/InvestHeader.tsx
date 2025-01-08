import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./InvestHeader.module.scss"
import Image from 'next/image';
interface InvestHeaderProps {
    title: string;
    logo_url: string;
}

const InvestHeader: React.FC<InvestHeaderProps> = ({ title, logo_url }) => {


    return (
        <div className={styles.layout}>
            <h1>Invest</h1>
            <div className={styles.textInfo}>
                <h2>{title}</h2>
                <div className={styles.imagenContainer}>
                    <Image src={logo_url} alt="cohete" layout='fill' objectFit='cover' />
                </div>
            </div>
        </div>
    );
}

export default InvestHeader;