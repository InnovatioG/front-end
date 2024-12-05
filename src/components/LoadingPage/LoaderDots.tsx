{/* <div class="loader">
  <li class="ball"></li>
  <li class="ball"></li>
  <li class="ball"></li>
</div> */}


import React from 'react';
import styles from "./LoaderDots.module.scss"

interface LoaderDotsProps {
    // Define props here
}

const LoaderDots: React.FC<LoaderDotsProps> = (props) => {
    return (
        <div className={styles.loader}>
            <li className={styles.ball}></li>
            <li className={styles.ball}></li>
            <li className={styles.ball}></li>
        </div>
    );
}

export default LoaderDots;