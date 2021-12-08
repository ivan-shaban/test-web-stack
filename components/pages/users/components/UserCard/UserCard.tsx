import {
    FC,
    memo,
} from 'react'
import classNames from 'classnames'
import styles from './UserCard.module.scss'
import {User} from 'graphql/generated/type-graphql/models/User'

export interface Props {
    readonly user: User
    readonly isDisabled?: boolean
    readonly onClick: (user: User) => void
}

export const UserCard: FC<Props> = memo(({user, isDisabled, onClick}) => {
    const createAt = new Date(user.dob).toLocaleDateString()
    const baseClasses = classNames(styles.base, {
        [styles.base__disabled]: isDisabled,
    })
    const handleClick = () => {
        onClick(user)
    }

    return (
        <div className={baseClasses} onClick={handleClick}>
            <img
                className={styles.editIcon}
                src="/static/icons/edit-icon.svg"
                alt="edit icon"
                draggable="false"
            />
            <img
                className={styles.avatar}
                src={user.image}
                alt={`${user.name}'s avatar`}
                draggable="false"
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
