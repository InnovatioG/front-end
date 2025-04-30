import { AvatarDisplay, AvatarFallback, AvatarImage } from '@/components/GeneralOK/Avatar/AvatarDisplay/AvatarDisplay';
import AvatarUpload from './AvatarUpload/AvatarUpload';
import styles from './Avatar.module.scss';

interface AvatarProps {
    name: string;
    picture: string;
    setPicture: (value: string) => void;
    isEditing: boolean;
}

const Avatar = ({ name, picture, setPicture, isEditing }: AvatarProps) => {
    return isEditing === false ? (
        <AvatarDisplay big={true} className={styles.pictureContainer}>
            <AvatarImage src={picture} alt={name} />
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </AvatarDisplay>
    ) : (
        <div className={styles.pictureContainer}>
            <AvatarUpload picture={picture || ''} setPicture={(picture) => setPicture(picture)} />
        </div>
    );
};

export default Avatar;
