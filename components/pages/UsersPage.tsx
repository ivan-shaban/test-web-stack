import {FC} from 'react'
import {ClientUser} from '../../types/client'
import styles from './UsersPage.module.scss'
import {UserCard} from './components/UserCard/UserCard'

export interface Props {
    readonly users: ClientUser[]
}

export const UsersPage: FC<Props> = ({users}) => {
    return (
        <div className={styles.base}>
            <header className={styles.header}>
                <p className={styles.title}>Users list</p>
                <input className={styles.searchInput}
                       type="search"
                       placeholder="Search..."
                />
            </header>
            <main className={styles.cardList} >{
                users.map((user) => (
                    <UserCard user={user} key={user.id}/>
                ))
            }</main>
            <footer></footer>
        </div>
    )
}
