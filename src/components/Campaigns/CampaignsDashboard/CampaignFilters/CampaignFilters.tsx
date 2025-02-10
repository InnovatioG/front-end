import Checkbox from '@/components/General/Buttons/Checkbox/Checkbox';
import BtnDropdown from '@/components/General/Buttons/Dropdown/BtnDropdown';
import SearchInput from '@/components/General/Inputs/SearchInput';
import { ScreenSize } from '@/contexts/ResponsiveContext';
import styles from './CampaignFilters.module.scss';
import { CampaignCategoryEntity, CampaignStatusEntity } from '@/lib/SmartDB/Entities';

interface CampaignFiltersProps {
    searchTerm: string;
    statusFilter?: string;
    categoryFilter?: string;
    campaignStatus: CampaignStatusEntity[];
    campaignCategories: CampaignCategoryEntity[];
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setStatusFilter: (value: string) => void;
    setCategoryFilter: (value: string) => void;
    screenSize: ScreenSize;
    isConnected: boolean;
    myProposal: boolean;
    onMyProposalChange: (checked: boolean) => void;
    showMyProposalButton: boolean;
}

export default function CampaignFilters(props: CampaignFiltersProps) {
    const {
        campaignCategories,
        campaignStatus,
        searchTerm,
        statusFilter,
        categoryFilter,
        onSearchChange,
        setStatusFilter,
        setCategoryFilter,
        screenSize,
        isConnected,
        showMyProposalButton,
        myProposal,
        onMyProposalChange,
    } = props;

    // Opciones para el filtro de estado
    const statusOptions = [
        { value: '-1', label: 'All Status' }, // Opción para borrar el filtro
        ...(campaignStatus.map((status) => ({
            value: status._DB_id,
            label: status.name,
        })) || []),
    ];

    // Opciones para el filtro de categoría
    const categoryOptions = [
        { value: '-1', label: 'All Categories' }, // Opción para borrar el filtro
        ...(campaignCategories?.map((category) => ({
            value: category._DB_id,
            label: category.name,
        })) || []),
    ];
    // Manejo de cambios en el filtro de estado
    const handleStatusFilterChange = (value: string | number) => {
        setStatusFilter(value.toString());
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
                    options={statusOptions}
                    value={statusFilter === undefined ? '-1' : statusFilter}
                    onChange={handleStatusFilterChange}
                    placeholder="Status Project"
                    width={screenSize === 'desktop' ? 180 : 160}
                />

                {/* Filtro de categoría */}
                <BtnDropdown
                    options={categoryOptions}
                    value={categoryFilter === undefined ? '-1' : categoryFilter}
                    onChange={handleCategoryFilterChange}
                    placeholder="Category"
                    width={screenSize === 'desktop' ? 180 : 150}
                />

                {/* Checkbox de "My Proposal" */}
                {isConnected && showMyProposalButton && (
                    <div className={styles.checkboxContainer}>
                        <Checkbox checked={myProposal} onChange={onMyProposalChange} label="My Proposal" />
                    </div>
                )}
            </div>

            {/* Barra de búsqueda (solo visible en escritorio) */}
            {screenSize === 'desktop' && <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} placeholder="Search Project" width={380} />}
        </div>
    );
}
