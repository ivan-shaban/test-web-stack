import {
    ChangeEvent,
    FC,
    memo,
    useCallback,
    useMemo,
    useState,
} from 'react'
import styles from './UsersPage.module.scss'
import {UserCard} from './components/UserCard/UserCard'
import {Input} from '../Input/Input'
import {Button} from '../Button/Button'
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/client'
import {GET_ALL_USERS_QUERY} from '../../lib/apis/graphql'
import {User} from 'graphql/generated/type-graphql/models/User'

export interface Props {
}

export const UsersPage: FC<Props> = memo(() => {
    const router = useRouter()
    const [filterValue, setFilterValue] = useState('')
    const pageIndex = parseInt(router.query.page as string, 10) || 1
    const {
        data, error, loading, fetchMore,
    } = useQuery<{ users: User[] }, { take: number }>(GET_ALL_USERS_QUERY, {
        variables: {
            // @ts-ignore
            take: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
    const filteredData = useMemo(() => {
        return filterValue ? data?.users.filter(({name, description, address}) => {
            const lowered = filterValue.toLowerCase()
            return name.toLowerCase().includes(lowered) ||
                description.toLowerCase().includes(lowered) ||
                address?.toLowerCase().includes(lowered)
        }) : data?.users
    }, [filterValue, data?.users])

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.currentTarget.value)
    }

    const onLoadMoreClick = useCallback(async () => {
        const newPageIndex = pageIndex + 1

        await router.push({
            query: {page: newPageIndex.toString()},
        }, undefined, {shallow: true})

        await fetchMore({
            variables: {
                // @ts-ignore
                take: newPageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
            },
        })

        // scroll back to load button
        document.querySelector(`.${styles.loadMoreButton}`)?.scrollIntoView()
    }, [pageIndex])

    return (
        <div className={styles.base}>
            <header className={styles.header}>
                <p className={styles.title}>Users list</p>
                <Input className={styles.searchInput}
                       type="search"
                       placeholder="Search..."
                       value={filterValue}
                       onChange={onInputChange}
                />
            </header>
            <main className={styles.cardList}>{
                filteredData?.map((user) => (
                    <UserCard user={user} key={user.id}/>
                ))
            }</main>
            <footer className={styles.footer}>
                <Button
                    className={styles.loadMoreButton}
                    onClick={onLoadMoreClick}
                    isDisabled={loading}
                >
                    LOAD MORE
                </Button>
            </footer>
        </div>
    )
})
