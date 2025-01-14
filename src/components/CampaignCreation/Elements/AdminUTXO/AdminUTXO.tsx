import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import React from 'react';
import styles from "@/components/CampaignCreation/Elements/AdminUTXO/AdminUTXO.module.scss"

interface AdminUTXOSProps {
    // Define props here
}

const AdminUTXOS: React.FC<AdminUTXOSProps> = (props) => {
    return (
        <article className={styles.generalContainer}>
            <h2 className={styles.h2}>Administration of UTXOs</h2>
            <header className={styles.header}>
                <div className={styles.buttonContainer}>
                    <h3 className={styles.h3}>Add UTXO</h3>
                    <div className={styles.buttonRow}>
                        <div className={styles.button}>
                            <GeneralButtonUI text="Connect Wallet" onClick={() => console.log('Create')} classNameStyle="fillb" />
                        </div>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <h3 className={styles.h3}>Manage UTXO</h3>
                    <div className={styles.buttonRow}>
                        <div className={styles.button}>
                            <GeneralButtonUI text="Merge Funds" onClick={() => console.log('Create')} classNameStyle="fillb" />
                        </div>
                        <div className={styles.button}>
                            <GeneralButtonUI text="Balance Funds" onClick={() => console.log('Create')} classNameStyle="outline" />
                        </div>
                    </div>
                </div>
            </header>
            <div></div>
        </article>
    );
};

export default AdminUTXOS;
