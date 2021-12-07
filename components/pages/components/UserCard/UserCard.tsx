import {
    FC,
    memo,
} from 'react'
import styles from './UserCard.module.scss'
import {User} from 'graphql/generated/type-graphql/models/User'

export interface Props {
    readonly user: User
}

export const UserCard: FC<Props> = memo(({user}) => {
    const createAt = new Date(user.dob).toLocaleDateString()
    return (
        <div className={styles.base}>
            <img
                className={styles.editIcon}
                src="/static/icons/edit-icon.svg"
                alt="edit icon"
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
}, (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id &&
        prevProps.user.name === nextProps.user.name &&
        prevProps.user.dob === nextProps.user.dob &&
        prevProps.user.address === nextProps.user.address &&
        prevProps.user.image === nextProps.user.image &&
        prevProps.user.description === nextProps.user.description &&
        prevProps.user.createdAt === nextProps.user.createdAt &&
        prevProps.user.updatedAt === nextProps.user.updatedAt
})
