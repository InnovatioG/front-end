import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import LoaderDots from '@/components/General/LoadingPage/LoaderDots';
import { PLUS_ICON } from '@/utils/constants/images';
import { ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import CampaignCard from './CampaignCard/CampaignCard';
import CampaignFilters from './CampaignFilters/CampaignFilters';
import styles from './CampaignsDashboard.module.scss';
import { CampaignDashboardProps, useCampaignsDashboard } from './useCampaignsDashboard';
import { PageViewEnums } from '@/utils/constants/routes';

export default function CampaignDashboard(props: CampaignDashboardProps) {
    const {
        walletStore,
        searchTerm,
        campaignsLoading,
        campaigns,
        hasMore,
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
        fetchCampaignsEX,
    } = useCampaignsDashboard(props);

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
                    {campaigns.length === 0 && props.pageView !== PageViewEnums.MANAGE ? (
                        <p className={styles.notFound}>No Campaigns Found</p>
                    ) : (
                        <div className={styles.campaignGrid}>
                            {props.pageView === PageViewEnums.MANAGE && (
                                <Link href={ROUTES.campaignCreation}>
                                    <div className={styles.newCampaign}>
                                        <svg width="24" height="24" className={styles.icon}>
                                            <use href={PLUS_ICON}></use>
                                        </svg>
                                        <p className={styles.text}>Start new campaign</p>
                                    </div>
                                </Link>
                            )}
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign.campaign._DB_id} campaign={campaign} fetchCampaignsEX={fetchCampaignsEX} {...props} />
                            ))}
                        </div>
                    )}
                    {hasMore &&
                        (props.pageView === PageViewEnums.HOME ? (
                            <Link href={ROUTES.campaigns}>
                                <div className={styles.buttonContainer}>
                                    <BtnGeneral onClick={() => {}} classNameStyle="outlineb" text="Explore more campaigns" />
                                </div>
                            </Link>
                        ) : (
                            <div className={styles.buttonContainer}>
                                {/* <BtnGeneral onClick={loadMoreCampaigns} classNameStyle="outlineb" text="Explore more campaigns" /> */}
                                PAGINATION
                            </div>
                        ))}
                </>
            )}
        </div>
    );
}
