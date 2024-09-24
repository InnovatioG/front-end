import { Category, Contracts } from "@/HardCode/databaseType";
import styles from "./DraftFilters.module.scss";
import { ScreenSize } from "@/contexts/ResponsiveContext";
import BtnDropdown from "@/components/buttons/dropdown/BtnDropdown";
import SearchInput from "@/components/inputs/SearchInput";
import Toggle from "@/components/buttons/toggle/Toggle";

interface DraftFiltersProps {
  searchTerm: string;
  statusContractsFilter: string;
  categoryFilter: string;
  contracts: Contracts[];
  categories: Category[];
  viewAdmin: boolean;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusContractsFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  screenSize: ScreenSize;
  onClickAdminView: () => void;
}

export default function DraftFilters(props: DraftFiltersProps) {
  const {
    searchTerm,
    statusContractsFilter,
    categoryFilter,
    contracts = [],
    categories = [],
    viewAdmin,
    onSearchChange,
    onStatusContractsFilterChange,
    onCategoryFilterChange,
    screenSize,
    onClickAdminView,
  } = props;

  const contractOptions = [
    { value: "", label: "All" },
    ...contracts.map((contract) => ({
      value: contract.id.toString(),
      label: contract.name,
    })),
  ];

  const categoryOptions = [
    { value: "", label: "All" },
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
            <BtnDropdown
              options={contractOptions}
              value={statusContractsFilter}
              onChange={onStatusContractsFilterChange}
              placeholder="Status Project"
              width={screenSize === "desktop" ? 180 : 160}
            />
            <BtnDropdown
              options={categoryOptions}
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              placeholder="Category"
              width={screenSize === "desktop" ? 180 : 150}
            />
          </div>
          <div className={styles.toggleController}>
            <Toggle isActive={viewAdmin} onClickToggle={onClickAdminView} />
            <span
              className={`${styles.toggleText} ${
                viewAdmin ? styles.active : ""
              }`}
            >
              {viewAdmin ? "Admin view active" : "Admin view inactive"}
            </span>
          </div>
        </div>

        <div className={styles.searchInput}>
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Search Project"
            width={undefined}
          />
        </div>
      </div>
      
    </div>
  );
}
