import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./EmptyState.module.scss"
import GeneralButtonUI from '../buttons/UI/Button';
import Link from 'next/link';
interface EmptyStateProps {
    // Define props here
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
    const { project, setMenuView } = useProjectDetailStore();
    return (
        <article className={styles.emptyStateContainer}>
            <h2 className={styles.emptyStateText}>No content available</h2>
            <div className={styles.buttonContainer}>
                <Link href={`edit?id=${project.id}`}>
                    <GeneralButtonUI onClick={() => { }} classNameStyle='outlineb'>Start editing your content!</GeneralButtonUI>
                </Link>
            </div>
        </article>
    );
}

export default EmptyState;