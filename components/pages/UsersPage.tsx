import {
    FC,
    memo,
    useCallback,
} from 'react'
import {ClientUser} from '../../types/client'
import styles from './UsersPage.module.scss'
import {UserCard} from './components/UserCard/UserCard'
import {Input} from '../Input/Input'
import {Button} from '../Button/Button'
import {useRouter} from 'next/router'

export interface Props {
    readonly users: ClientUser[]
}

export const UsersPage: FC<Props> = memo(({users}) => {
    const router = useRouter()
    const page = parseInt(router.query.page as string, 10) || 1
    const onLoadMoreClick = useCallback(() => {

        router.push({
            pathname: router.pathname,
            query: {page: (page + 1).toString()},

        }, undefined, {shallow: true})
    }, [page])

    return (
        <div className={styles.base}>
            <header className={styles.header}>
                <p className={styles.title}>Users list</p>
                <Input className={styles.searchInput}
                       type="search"
                       placeholder="Search..."
                />
            </header>
            <main className={styles.cardList}>{
                users.map((user) => (
                    <UserCard user={user} key={user.id}/>
                ))
            }</main>
            <footer className={styles.footer}>
                <Button className={styles.loadMoreButton} onClick={onLoadMoreClick}>LOAD MORE</Button>
            </footer>
        </div>
    )
})
