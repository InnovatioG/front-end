import { Category, State } from "@/HardCode/databaseType";
import styles from "./DraftFilters.module.scss";
import { ScreenSize } from "@/contexts/ResponsiveContext";
import BtnDropdown from "@/components/buttons/dropdown/BtnDropdown";
import SearchInput from "@/components/inputs/SearchInput";
import Toggle from "@/components/buttons/toggle/Toggle";

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
    isAdmin
  } = props;

  const stateOptions = [
    { value: "", label: "All" },
    ...states.map((state) => ({
      value: state.id.toString(),
      label: state.name,
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
              options={stateOptions}
              value={stateFilter}
              onChange={onStateFilterChange}
              placeholder="Status"
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
          {/* <div className={styles.toggleController}>
            <Toggle isActive={viewAdmin} onClickToggle={onClickAdminView} disabled={!isAdmin} />
            <span
              className={`${styles.toggleText} ${viewAdmin ? styles.active : ""
                }`}
            >
              {viewAdmin ? "Admin view active" : "Admin view inactive"}
            </span>
          </div> */}
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


/*  */