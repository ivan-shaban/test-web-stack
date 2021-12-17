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
import {
    Button,
    ButtonType,
} from '../../../../Button/Button'
import {Input} from '../../../../Input/Input'
import {Layout} from '../../../../Layout/Layout'
import {useMutation} from '@apollo/client'
import {
    DELETE_USER_MUTATION,
    GET_ALL_USERS_QUERY,
    UPDATE_USER_MUTATION,
} from '../../../../../lib/apis/graphql'
import {UpdateUserArgs} from 'graphql/generated/type-graphql/resolvers/crud/User/args/UpdateUserArgs'

import {GoogleMap} from '../GoogleMap/GoogleMap'
import {DeleteUserArgs} from 'graphql/generated/type-graphql/resolvers/crud/User/args/DeleteUserArgs'

export interface Props {
    readonly user: User
    readonly hasScroll?: boolean
    readonly onClose: () => void
}

export const EditUserInfoOverlayOriginal: FC<Props> = ({user, hasScroll, onClose}) => {
    const [username, setUserName] = useState(user.name)
    const [userAddress, setUserAddress] = useState(user.address)
    const [userDescription, setUserDescription] = useState(user.description)
    const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null)
    const [playAppearingAnimation, setExitAnimationStatus] = useState(true)
    const saveButtonEnabled = username !== user.name || userAddress !== user.address || userDescription !== user.description
    const [updateUser, {
        loading: userUpdateInProgress,
        error: userUpdateError,
    }] = useMutation<User, UpdateUserArgs>(UPDATE_USER_MUTATION, {
        awaitRefetchQueries: true,
        refetchQueries: [
            GET_ALL_USERS_QUERY,
            'Users',
        ],
    })
    const [deleteUser, {
        loading: userDeleteInProgress,
        error: deleteUserError,
    }] = useMutation<User, DeleteUserArgs>(DELETE_USER_MUTATION, {
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

    const handleUserDelete = useCallback(async () => {
        try {
            await deleteUser({
                variables: {
                    where: {
                        id: user.id,
                    },
                },
            })
            handleClose()
        } catch (e) {
        }
    }, [user.id])

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
                        {!!userUpdateError && <p className={styles.error}>Error: Cannot update user :(</p>}
                        {!!deleteUserError && <p className={styles.error}>Error: Cannot delete user :(</p>}
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
                            className={styles.deleteButton}
                            type={ButtonType.Danger}
                            isDisabled={userUpdateInProgress || userDeleteInProgress}
                            onClick={handleUserDelete}
                        >
                            DELETE
                        </Button>
                        <Button
                            className={styles.saveButton}
                            isDisabled={(userUpdateInProgress || userDeleteInProgress) || !saveButtonEnabled}
                            onClick={handleUserUpdate}
                        >
                            SAVE
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            isDisabled={userUpdateInProgress || userDeleteInProgress}
                            onClick={handleClose}
                        >
                            CANCEL
                        </Button>
                    </footer>
                </div>
            </Layout>
        </CSSTransition>
    ), document.getElementById('overlay-container')!)
}

EditUserInfoOverlayOriginal.displayName = 'EditUserInfoOverlay'

export const EditUserInfoOverlay = memo(EditUserInfoOverlayOriginal)
