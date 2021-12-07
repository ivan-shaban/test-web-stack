import {FC} from 'react'
import styles from './UserCard.module.scss'
import {ClientUser} from '../../../../types/client'

export interface Props {
    readonly user: ClientUser
}

export const UserCard: FC<Props> = ({user}) => {
    const createAt = new Date(user.dob).toLocaleDateString()
    return (
        <div className={styles.base}>
            <img
                className={styles.editIcon}
                src="/static/icons/edit-icon.svg"
            />
            <img
                className={styles.avatar}
                src={user.image}
                alt={`${user.name}'s avatar`}
            />
            <div className={styles.credentials}>
                <p className={styles.title}>{user.name}</p>
                <p className={styles.createdTitle}>created <span className={styles.createdValue}>{createAt}</span></p>
            </div>
            <p className={styles.description}>{user.description}</p>
        </div>
    )
}
