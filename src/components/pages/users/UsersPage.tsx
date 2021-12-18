import {
    ChangeEvent,
    FC,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import classNames from 'classnames'
import styles from './UsersPage.module.scss'
import {UserCard} from './components/UserCard/UserCard'
import {Input} from '../../Input/Input'
import {Button} from '../../Button/Button'
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/client'
import {EditUserInfoOverlay} from './components/EditUserInfoOverlay/EditUserInfoOverlay'
import {Layout} from '../../Layout/Layout'
import {
    ListUsersQuery,
    ListUsersQueryVariables,
    User,
} from '../../../lib/apis/graphql/API'
import {getAllUsers} from '../../../lib/apis/graphql'

export interface Props {
}

export const UsersPageOriginal: FC<Props> = () => {
    const router = useRouter()
    const [filterValue, setFilterValue] = useState('')
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    const [hasScroll, setHasScroll] = useState(false)
    const pageIndex = parseInt(router.query.page as string, 10) || 1
    const baseRef = useRef<HTMLDivElement>(null)

    const {
        data, fetchMore, loading: isLoading
    } = useQuery<ListUsersQuery, ListUsersQueryVariables>(getAllUsers, {
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
        variables: {
            // @ts-ignore
            limit: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        },
    })
    const filteredData = useMemo(() => {
        return filterValue ? data?.listUsers?.items.filter(({name, description, address}) => {
            return name.toLowerCase().includes(filterValue) ||
                description.toLowerCase().includes(filterValue) ||
                address.toLowerCase().includes(filterValue)
        }) : data?.listUsers?.items
    }, [filterValue, data?.listUsers?.items])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.currentTarget.value.toLowerCase())
    }

    const handleCardClick = (user: User) => {
        setUserToEdit(user)
    }

    const handleOverlayClose = () => {
        setUserToEdit(null)
    }

    const handleLoadMoreClick = useCallback(async () => {
        const newPageIndex = pageIndex + 1

        // in case if fetch request failed we don't increase page number
        await fetchMore({
            variables: {
                // @ts-ignore
                limit: newPageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
            },
        })
        await router.push({
            query: {page: newPageIndex.toString()},
        }, undefined, {shallow: true})
    }, [pageIndex, fetchMore, router])

    const baseClasses = classNames(styles.base, {
        [styles.base__withOverlay]: !!userToEdit,
    })

    useEffect(() => {
        if (baseRef.current) {
            setHasScroll(baseRef.current.scrollHeight > baseRef.current.clientHeight)
        } else {
            setHasScroll(false)
        }
    }, [baseRef, filteredData])

    useEffect(() => {
        // scroll back to load button only after we get new users, to force smooth ux
        document.getElementById('loadMoreButton')?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [data?.listUsers?.items.length])

    return (
        <Layout isAbsolute className={styles.layout} ref={baseRef}>
            <div className={baseClasses}>
                <header className={styles.header}>
                    <p className={styles.title}>Users list</p>
                    <Input className={styles.searchInput}
                           type="search"
                           placeholder="Search..."
                           value={filterValue}
                           onChange={handleInputChange}
                    />
                </header>
                <main className={styles.cardList}>{
                    filteredData?.map((user) => (
                        <UserCard
                            user={user}
                            key={user.id}
                            isDisabled={isLoading}
                            onClick={handleCardClick}
                        />
                    ))
                }</main>
                <footer className={styles.footer}>
                    <Button
                        id="loadMoreButton"
                        onClick={handleLoadMoreClick}
                        isDisabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'LOAD MORE'}
                    </Button>
                </footer>
                {userToEdit && (
                    <EditUserInfoOverlay
                        user={userToEdit}
                        hasScroll={hasScroll}
                        onClose={handleOverlayClose}
                    />
                )}
            </div>
        </Layout>
    )
}

UsersPageOriginal.displayName = 'UsersPage'
export const UsersPage = memo(UsersPageOriginal)
