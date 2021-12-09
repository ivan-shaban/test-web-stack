import {
    ChangeEvent,
    FC,
    memo,
    useCallback,
    useState,
} from 'react'
import {CSSTransition} from 'react-transition-group'
import classNames from 'classnames'
import {User} from 'graphql/generated/type-graphql/models/User'
import styles from './EditUserInfoOverlay.module.scss'
import {createPortal} from 'react-dom'
import {Button} from '../../../../Button/Button'
import {Input} from '../../../../Input/Input'
import {Layout} from '../../../../Layout/Layout'
import {useMutation} from '@apollo/client'
import {
    GET_ALL_USERS_QUERY,
    UPDATE_USER_MUTATION,
} from '../../../../../lib/apis/graphql'
import {UpdateUserArgs} from 'graphql/generated/type-graphql/resolvers/crud/User/args/UpdateUserArgs'

import {GoogleMap} from '../GoogleMap/GoogleMap'

export interface Props {
    readonly user: User
    readonly hasScroll?: boolean
    readonly onClose: () => void
}

export const EditUserInfoOverlay: FC<Props> = memo(({user, hasScroll, onClose}) => {
    const [username, setUserName] = useState(user.name)
    const [userAddress, setUserAddress] = useState(user.address)
    const [userDescription, setUserDescription] = useState(user.description)
    const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null)
    const [playAppearingAnimation, setExitAnimationStatus] = useState(true)
    const [updateUser, {loading, error: gqlError}] = useMutation<User, UpdateUserArgs>(UPDATE_USER_MUTATION, {
        awaitRefetchQueries: true,
        refetchQueries: [
            GET_ALL_USERS_QUERY,
            'Users',
        ],
    })
    const layoutClasses = classNames(styles.layout, {
        [styles.layout__hasScroll]: hasScroll,
    })

    const handleClose = () => {
        setExitAnimationStatus(false)
    }

    const handleUserUpdate = useCallback(async () => {
        try {
            await updateUser({
                variables: {
                    data: {
                        name: {
                            set: username,
                        },
                        address: {
                            set: userAddress,
                        },
                        description: {
                            set: userDescription,
                        },
                    },
                    where: {
                        id: user.id,
                    },
                },
            })
            handleClose()
        } catch (e) {
        }
    }, [username, userAddress, userDescription, user.id])

    const handleUserNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUserName(event.currentTarget.value)
    }, [])

    const handleUserAddressChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUserAddress(event.currentTarget.value)
    }, [])

    const handleUserDescriptionChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUserDescription(event.currentTarget.value)
    }, [])

    const handleMapError = useCallback((message: string | null) => {
        setMapErrorMessage(message)
    }, [])

    return createPortal((
        <CSSTransition
            in={playAppearingAnimation}
            appear
            timeout={500}
            classNames="overlay-animation"
            unmountOnExit
            onExited={onClose}
        >
            <Layout isAbsolute hasCenteredContent className={layoutClasses}>
                <div className={styles.base}>
                    <header className={styles.header}>
                        <p className={styles.title}>Edit user</p>
                        {!!gqlError && <p className={styles.error}>Error: Cannot update user :(</p>}
                        {!!mapErrorMessage && <p className={styles.error}>Error: {mapErrorMessage} :(</p>}
                    </header>
                    <main className={styles.main}>
                        <GoogleMap className={styles.map}
                                   address={userAddress}
                                   onAddressChange={setUserAddress}
                                   onError={handleMapError}
                        />
                        <div className={styles.inputsBlock}>
                            <label className={styles.label}>Name
                                <Input className={styles.input}
                                       type="text"
                                       value={username}
                                       onChange={handleUserNameChange}
                                />
                            </label>
                            <label className={styles.label}>Address
                                <Input
                                    className={styles.input}
                                    type="text"
                                    value={userAddress}
                                    onChange={handleUserAddressChange}
                                />
                            </label>
                            <label className={styles.label}>Description
                                <Input
                                    className={styles.input}
                                    type="text"
                                    value={userDescription}
                                    onChange={handleUserDescriptionChange}
                                />
                            </label>
                        </div>
                    </main>
                    <footer className={styles.footer}>
                        <Button
                            className={styles.saveButton}
                            isDisabled={loading}
                            onClick={handleUserUpdate}
                        >
                            SAVE
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            isDisabled={loading}
                            onClick={handleClose}
                        >
                            CANCEL
                        </Button>
                    </footer>
                </div>
            </Layout>
        </CSSTransition>
    ), document.getElementById('overlay-container')!)
})
