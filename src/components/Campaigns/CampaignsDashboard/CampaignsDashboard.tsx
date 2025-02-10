import GeneralButtonUI from '@/components/General/Buttons/UI/Button';
import LoaderDots from '@/components/General/LoadingPage/LoaderDots';
import { ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import CampaignCard from './CampaignCard/CampaignCard';
import CampaignFilters from './CampaignFilters/CampaignFilters';
import styles from './CampaignsDashboard.module.scss';
import { useCampaignsDashboard } from './useCampaignsDashboard';
import { PLUS_ICON } from '@/utils/constants/images';

export default function CampaignDashboard() {
    const {
        walletStore,
        searchTerm,
        campaignsLoading,
        campaigns,
        hasMore,
        pathName,
        campaignStatus,
        statusFilter,
        setStatusFilter,
        campaignCategories,
        categoryFilter,
        setCategoryFilter,
        handleSearchChange,
        screenSize,
        myProposal,
        handleMyProposalChange,
        showMyProposalButton,
    } = useCampaignsDashboard();

    return (
        <div className={styles.campaignDashboard}>
            <CampaignFilters
                campaignStatus={campaignStatus}
                campaignCategories={campaignCategories}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                setStatusFilter={setStatusFilter}
                onSearchChange={handleSearchChange}
                screenSize={screenSize}
                isConnected={walletStore.isConnected}
                myProposal={myProposal}
                onMyProposalChange={handleMyProposalChange}
                showMyProposalButton={showMyProposalButton}
            />

            {campaignsLoading ? (
                <>
                    <LoaderDots />
                </>
            ) : (
                <>
                    {campaigns.length === 0 && pathName !== ROUTES.manage ? (
                        <p className={styles.notFound}>No Campaigns Found</p>
                    ) : (
                        <div className={styles.campaignGrid}>
                            {pathName === ROUTES.manage && (
                                <Link href={ROUTES.campaignNew}>
                                    <div className={styles.newCampaign}>
                                        <svg width="24" height="24" className={styles.icon}>
                                            <use href={PLUS_ICON}></use>
                                        </svg>
                                        <p className={styles.text}>Start new campaign</p>
                                    </div>
                                </Link>
                            )}
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign.campaign._DB_id} campaign={campaign} />
                            ))}
                        </div>
                    )}

                    {hasMore &&
                        (pathName === ROUTES.home ? (
                            <Link href={ROUTES.campaigns}>
                                <div className={styles.buttonContainer}>
                                    <GeneralButtonUI onClick={() => {}} classNameStyle="outlineb" text="Explore more campaigns" />
                                </div>
                            </Link>
                        ) : (
                            <div className={styles.buttonContainer}>
                                {/* <GeneralButtonUI onClick={loadMoreCampaigns} classNameStyle="outlineb" text="Explore more campaigns" /> */}
                                PAGINATION
                            </div>
                        ))}
                </>
            )}
        </div>
    );
}
