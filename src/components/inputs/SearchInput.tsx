import { SEARCH } from "@/utils/images";
import styles from "./Input.module.scss";
import Image from "next/image";

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  width: number;
}

export default function SearchInput(props: SearchInputProps) {

  const { onSearchChange, searchTerm, placeholder, width } = props;

  return (
    <div className={styles.searchActions} style={{width: `${width}px`}}>
      <Image src={SEARCH} height={24} width={24} alt="search" className={styles.icon}/>
      <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          className={styles.input}
        />
    </div>
  )
}
