import { useEffect, useRef, useState } from "react";
import styles from "./CampaignFilters.module.scss";
import { State, Category } from "@/HardCode/databaseType";
import BtnDropdown from "@/components/buttons/dropdown/BtnDropdown";
import SearchInput from "@/components/inputs/SearchInput";
import { ScreenSize } from "@/contexts/ResponsiveContext";
import Checkbox from "@/components/buttons/checkbox/Checkbox";

interface CampaignFiltersProps {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  states: State[];
  categories: Category[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
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
    states,
    categories,
    onSearchChange,
    onStatusFilterChange,
    onCategoryFilterChange,
    screenSize,
    isConnected,
    myProposal,
    onMyProposalChange,
  } = props;

  const stateOptions = [
    { value: "", label: "All" },
    ...states.map(state => ({ value: state.id.toString(), label: state.name }))
  ];
  
  const categoryOptions = [
    { value: "", label: "All" },
    ...categories.map(category => ({ value: category.id.toString(), label: category.name }))
  ];

  

  return (
    <div className={styles.filters}>
      <div className={styles.btnActions}>
        <BtnDropdown options={stateOptions} value={statusFilter} onChange={onStatusFilterChange} placeholder="Status Project" width={screenSize === 'desktop' ? 180 : 160}/>
        <BtnDropdown options={categoryOptions} value={categoryFilter} onChange={onCategoryFilterChange} placeholder="Category" width={screenSize === 'desktop' ? 180 : 150}/>
        {isConnected && (
          <div className={styles.checkboxContainer}>
            <Checkbox
              checked={myProposal}
              onChange={onMyProposalChange}
              label="My Proposal"
            />
          </div>
        )}
      </div>
      {
        screenSize === 'desktop' && <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} placeholder="Search Project" width={380}/>
      }
      
    </div>
  );
}
