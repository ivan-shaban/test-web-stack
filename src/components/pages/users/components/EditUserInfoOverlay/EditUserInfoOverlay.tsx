import {
    ChangeEvent,
    FC,
    memo,
    useCallback,
    useState,
} from 'react'
import {CSSTransition} from 'react-transition-group'
import classNames from 'classnames'
import styles from './EditUserInfoOverlay.module.scss'
import {createPortal} from 'react-dom'
import {
    Button,
    ButtonType,
} from '../../../../Button/Button'
import {Input} from '../../../../Input/Input'
import {Layout} from '../../../../Layout/Layout'

import {GoogleMap} from '../GoogleMap/GoogleMap'
import {
    DeleteUserMutationVariables,
    UpdateUserMutationVariables,
    User,
} from '../../../../../lib/apis/graphql/API'
import {
    deleteUser as deleteUserMutation,
    updateUser as updateUserMutation,
} from '../../../../../lib/apis/graphql/mutations'
import {
    useMutation,
    gql,
} from '@apollo/client'
import {getAllUsers} from '../../../../../lib/apis/graphql'

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
    }] = useMutation<User, UpdateUserMutationVariables>(gql(updateUserMutation), {
        awaitRefetchQueries: true,
        refetchQueries: [
            getAllUsers,
            'listUsers',
        ],
    })
    const [deleteUser, {
        loading: userDeleteInProgress,
        error: deleteUserError,
    }] = useMutation<User, DeleteUserMutationVariables>(gql(deleteUserMutation), {
        awaitRefetchQueries: true,
        refetchQueries: [
            getAllUsers,
            'listUsers',
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
                    input: {
                        id: user.id,
                        name: username,
                        address: userAddress,
                        description: userDescription,
                    },
                },
            })
            handleClose()
        } catch (e) {
        }
    }, [updateUser, username, userAddress, userDescription, user.id])

    const handleUserDelete = useCallback(async () => {
        try {
            await deleteUser({
                variables: {
                    input: {
                        id: user.id,
                    },
                },
            })
            handleClose()
        } catch (e) {
        }
    }, [deleteUser, user.id])

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
