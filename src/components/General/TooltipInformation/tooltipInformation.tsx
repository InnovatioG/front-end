import React, { useState } from 'react';
import styles from './tooltipInformation.module.scss';

interface ToolTipInformationProps {
    content: string;
}

const ToolTipInformation: React.FC<ToolTipInformationProps> = ({ content }) => {
    const [showToolTip, setShowToolTip] = useState(false);

    return (
        <div className={styles.informationContainer}>
            <div onMouseEnter={() => setShowToolTip(true)} onMouseLeave={() => setShowToolTip(false)}>
                <i className={styles.informationIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 14 14" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.16868 10.1898C6.89268 10.1898 6.66535 9.9658 6.66535 9.6898C6.66535 9.4138 6.88668 9.1898 7.16268 9.1898H7.16868C7.44468 9.1898 7.66868 9.4138 7.66868 9.6898C7.66868 9.9658 7.44468 10.1898 7.16868 10.1898ZM6.66602 4.75978C6.66602 4.48378 6.89002 4.25978 7.16602 4.25978C7.44202 4.25978 7.66602 4.48378 7.66602 4.75978V7.35647C7.66602 7.63247 7.44202 7.85647 7.16602 7.85647C6.89002 7.85647 6.66602 7.63247 6.66602 7.35647V4.75978ZM7.16602 0.856445C2.36735 0.856445 0.666016 2.55778 0.666016 7.35647C0.666016 12.1551 2.36735 13.8565 7.16602 13.8565C11.9647 13.8565 13.666 12.1551 13.666 7.35647C13.666 2.55778 11.9647 0.856445 7.16602 0.856445Z"
                            fill="#0076CB"
                        />
                    </svg>
                </i>
            </div>
            {showToolTip && (
                <div className={styles.tooltip}>
                    <p>{content}</p>
                </div>
            )}
        </div>
    );
};

export default ToolTipInformation;
