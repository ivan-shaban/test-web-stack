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
import {EditUserInfoOverlay} from './components/EditUserInfoOverlay/EditUserInfoOverlay'
import {Layout} from '../../Layout/Layout'
import {User} from '../../../API'

export interface Props {
    readonly users: Readonly<User>[]
}

export const UsersPageOriginal: FC<Props> = ({users}) => {
    const router = useRouter()
    const [filterValue, setFilterValue] = useState('')
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    const [hasScroll, setHasScroll] = useState(false)
    const pageIndex = parseInt(router.query.page as string, 10) || 1
    const baseRef = useRef<HTMLDivElement>(null)

    // const {
    //     data, fetchMore
    // } = useQuery<{ users: User[] }, FindManyUserArgs>(GET_ALL_USERS_QUERY, {
    //     errorPolicy: 'all',
    //     notifyOnNetworkStatusChange: true,
    //     variables: {
    //         // @ts-ignore
    //         take: pageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
    //     },
    // })
    const filteredData = useMemo(() => {
        return filterValue ? users.filter(({name, description, address}) => {
            return name.toLowerCase().includes(filterValue) ||
                description.toLowerCase().includes(filterValue) ||
                address.toLowerCase().includes(filterValue)
        }) : users
    }, [filterValue, users])
    // somehow `loading \ networkStatus` from grahpql doesn't work well, despite `notifyOnNetworkStatusChange: true`
    const [isLoading, setLoadingState] = useState(!users?.length)

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
        setLoadingState(true)

        const newPageIndex = pageIndex + 1

        await router.push({
            query: {page: newPageIndex.toString()},
        }, undefined, {shallow: true})
        // await fetchMore({
        //     variables: {
        //         // @ts-ignore
        //         take: newPageIndex * process.env.NEXT_PUBLIC_USERS_PER_PAGE,
        //     },
        // })
        setLoadingState(false)

        // scroll back to load button, to force smooth ux
        document.getElementById('loadMoreButton')?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [pageIndex, router])
    // }, [pageIndex, fetchMore, router])
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

export const UsersPage = memo(UsersPageOriginal)
