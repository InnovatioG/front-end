import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import Link from 'next/link';
import React from 'react';
import styles from './EmptyState.module.scss';
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
                    <GeneralButtonUI onClick={() => {}} classNameStyle="outlineb">
                        Start editing your content!
                    </GeneralButtonUI>
                </Link>
            </div>
        </article>
    );
};

export default EmptyState;
