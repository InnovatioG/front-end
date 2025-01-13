
import React from 'react';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import DraftFilters from './DraftFilters/DraftFilters';
import DraftCard from './DraftCard/DraftCard';
import styles from "./DraftDashboard.module.scss";
import { PLUS_ICON } from '@/utils/images';
import Link from 'next/link';


interface NewDraftDashboardProps {
    address: string | null;
}

const NewDraftDashboard: React.FC<NewDraftDashboardProps> = ({ address }) => {

    const {
        filteredCampaigns,
        visibleCampaigns,
        searchTerm,
        categoryFilter,
        categories,
        handleSearchChange,
        setStateFilter,
        setCategoryFilter,
        loadMoreCampaigns,
        screenSize,
        states,
        stateFilter,
        myProposal,
        setMyProposal,
        isHomePage,
        pathName,
        isAdmin,
        isProtocolTeam
    } = useDashboardCard(address);

    const handleMyProposalChange = (checked: boolean) => {
        setMyProposal(checked);
    };


    return (
        <div className={styles.draftDashboard}>
            <DraftFilters
                isHomePage={isHomePage}
                searchTerm={searchTerm}
                statusFilter={stateFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                setStateFilter={setStateFilter}
                onSearchChange={handleSearchChange}
                screenSize={screenSize}
                isConnected={!!address}
                myProposal={myProposal}
                onMyProposalChange={handleMyProposalChange}
            />
            <div className={styles.draftGrid}>
                <Link href={"./new"}>
                    <div className={styles.newCampaign}>
                        <svg width="24" height="24" className={styles.icon}>
                            <use href={PLUS_ICON}></use>
                        </svg>
                        <p className={styles.text}>Start new campaign</p>
                    </div>
                </Link>
                {visibleCampaigns.map((campaign) => (
                    <DraftCard key={campaign._DB_id} campaign={campaign} isProtocolTeam={isProtocolTeam} isAdmin={isAdmin} />
                ))}
                <button onClick={loadMoreCampaigns}>Load more</button>
            </div>


        </div>
    );


    /*  */
}

export default NewDraftDashboard;