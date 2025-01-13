import { Category, State } from '@/HardCode/databaseType';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import BtnDropdown from '@/components/UI/Buttons/Dropdown/BtnDropdown';
import SearchInput from '@/components/UI/Inputs/SearchInput';
import { ScreenSize } from '@/contexts/ResponsiveContext';
import styles from "@/components/CampaignDashboard/Sections/Dashboard/CampaignFilters/CampaignFilters.module.scss"
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

interface CampaignFiltersProps {
    isHomePage: boolean;
    searchTerm: string;
    statusFilter: string | null;
    categoryFilter: string | null;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setStateFilter: (value: string) => void;
    setCategoryFilter: (value: string) => void;
    screenSize: ScreenSize;
    isConnected: boolean;
    myProposal: boolean;
    onMyProposalChange: (checked: boolean) => void;
}

export default function CampaignFilters(props: CampaignFiltersProps) {
    const {
        searchTerm,
        statusFilter,
        categoryFilter,
        onSearchChange,
        setStateFilter,
        setCategoryFilter,
        screenSize,
        isConnected,
        myProposal,
        onMyProposalChange,
    } = props;

    const { campaignCategories, campaignStatus } = useGeneralStore();

    // Opciones para el filtro de estado
    const stateOptions = [
        { value: '', label: 'All Status' }, // Opción para borrar el filtro
        ...(campaignStatus?.filter((status) => Number(status.id) >= 8 && Number(status.id) !== 10)
            .map((state) => ({
                value: state.id,
                label: state.name,
            })) || []),
    ];

    // Opciones para el filtro de categoría
    const categoryOptions = [
        { value: '', label: 'All Categories' }, // Opción para borrar el filtro
        ...(campaignCategories?.map((category) => ({
            value: category.id,
            label: category.name,
        })) || []),
    ];
    // Manejo de cambios en el filtro de estado
    const handleStateFilterChange = (value: string | number) => {
        setStateFilter(value.toString());
    };

    // Manejo de cambios en el filtro de categoría
    const handleCategoryFilterChange = (value: string | number) => {
        setCategoryFilter(value.toString());
    };

    return (
        <div className={styles.filters}>
            <div className={styles.btnActions}>
                {/* Filtro de estado */}
                <BtnDropdown
                    options={stateOptions}
                    value={statusFilter}
                    onChange={handleStateFilterChange}
                    placeholder="Status Project"
                    width={screenSize === 'desktop' ? 180 : 160}
                />

                {/* Filtro de categoría */}
                <BtnDropdown
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    placeholder="Category"
                    width={screenSize === 'desktop' ? 180 : 150}
                />

                {/* Checkbox de "My Proposal" */}
                {isConnected && (
                    <div className={styles.checkboxContainer}>
                        <Checkbox checked={myProposal} onChange={onMyProposalChange} label="My Proposal" />
                    </div>
                )}
            </div>

            {/* Barra de búsqueda (solo visible en escritorio) */}
            {screenSize === 'desktop' && (
                <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} placeholder="Search Project" width={380} />
            )}
        </div>
    );
}
/* import BtnDropdown from '@/components/UI/Buttons/Dropdown/BtnDropdown';
import SearchInput from '@/components/UI/Inputs/SearchInput';
import { ScreenSize } from '@/contexts/ResponsiveContext';
import { Category, State } from '@/HardCode/databaseType';
import styles from './DraftFilters.module.scss';

interface DraftFiltersProps {
    searchTerm: string;
    stateFilter: string;
    categoryFilter: string;
    categories: Category[];
    states: State[];
    viewAdmin: boolean;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onStateFilterChange: (value: string) => void;
    onCategoryFilterChange: (value: string) => void;
    screenSize: ScreenSize;
    onClickAdminView: () => void;
    isAdmin: boolean;
}

export default function DraftFilters(props: DraftFiltersProps) {
    const {
        searchTerm,
        stateFilter,
        categoryFilter,
        categories = [],
        states = [],
        viewAdmin,
        onSearchChange,
        onStateFilterChange,
        onCategoryFilterChange,
        screenSize,
        onClickAdminView,
        isAdmin,
    } = props;

    const stateOptions = [
        { value: '', label: 'All' },
        ...states.map((state) => ({
            value: state.id.toString(),
            label: state.name,
        })),
    ];

    const categoryOptions = [
        { value: '', label: 'All' },
        ...categories.map((category) => ({
            value: category.id.toString(),
            label: category.name,
        })),
    ];

    return (
        <div className={styles.filters}>
            <div className={styles.btnActions}>
                <div className={styles.sectionController}>
                    <div className={styles.btnDrop}>
                        <BtnDropdown options={stateOptions} value={stateFilter} onChange={onStateFilterChange} placeholder="Status" width={screenSize === 'desktop' ? 180 : 160} />
                        <BtnDropdown
                            options={categoryOptions}
                            value={categoryFilter}
                            onChange={onCategoryFilterChange}
                            placeholder="Category"
                            width={screenSize === 'desktop' ? 180 : 150}
                        />
                    </div>
                </div>

                <div className={styles.searchInput}>
                    <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} placeholder="Search Project" width={undefined} />
                </div>
            </div>
        </div>
    );
}
 */
/*  */
