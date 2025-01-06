import { useEffect, useRef, useState } from "react";
import styles from "./CampaignFilters.module.scss";
import { State, Category } from "@/HardCode/databaseType";
import BtnDropdown from "@/components/ui/buttons/dropdown/BtnDropdown";
import SearchInput from "@/components/ui/inputs/SearchInput";
import { ScreenSize } from "@/contexts/ResponsiveContext";
import Checkbox from "@/components/ui/buttons/checkbox/Checkbox";

interface CampaignFiltersProps {
  isHomePage: boolean;
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
    isHomePage
  } = props;


  /*  { value: '', label: 'All' },
     { value: '1', label: 'Created' },
     { value: '2', label: 'Submitted' },
     { value: '3', label: 'Rejected' },
     { value: '4', label: 'Approved' },
     { value: '5', label: 'Contract Created' },
     { value: '6', label: 'Contract Published' },
     { value: '7', label: 'Contract Started' },
     { value: '9', label: 'Fundraising' },
     { value: '10', label: 'Finishing' },
     { value: '11', label: 'Active' },
     { value: '12', label: 'Failed' },
     { value: '13', label: 'Unreached' },
     { value: '14', label: 'Success' }
   ] */


  const stateOptions = [
    { value: "", label: "All" },
    ...states
      .filter(state =>
        !isHomePage || !["1", "2", "3", "4", "5", "6", "7"].includes(state.id.toString())
      )
      .map(state => ({ value: state.id.toString(), label: state.name }))
  ];


  const categoryOptions = [
    { value: "", label: "All" },
    ...categories.map(category => ({ value: category.id.toString(), label: category.name }))
  ];



  return (
    <div className={styles.filters}>
      <div className={styles.btnActions}>
        <BtnDropdown options={stateOptions} value={statusFilter} onChange={onStatusFilterChange} placeholder="Status Project" width={screenSize === 'desktop' ? 180 : 160} />
        <BtnDropdown options={categoryOptions} value={categoryFilter} onChange={onCategoryFilterChange} placeholder="Category" width={screenSize === 'desktop' ? 180 : 150} />
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
        screenSize === 'desktop' && <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} placeholder="Search Project" width={380} />
      }

    </div>
  );
}
