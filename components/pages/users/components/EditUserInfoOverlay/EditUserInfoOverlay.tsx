import {
    FC,
    memo,
} from 'react'
import classNames from 'classnames'
import {User} from 'graphql/generated/type-graphql/models/User'
import styles from './EditUserInfoOverlay.module.scss'
import {createPortal} from 'react-dom'
import {Button} from '../../../../Button/Button'
import {Input} from '../../../../Input/Input'
import {Layout} from '../../../../Layout/Layout'

export interface Props {
    readonly user: User
    readonly hasScroll?: boolean
}

export const EditUserInfoOverlay: FC<Props> = memo(({user, hasScroll}) => {
    const baseClasses = classNames(styles.base, {
        [styles.base__hasScroll]: hasScroll,
    })
    return createPortal((
        <Layout isAbsolute hasCenteredContent className={styles.layout}>
            <div className={baseClasses}>
                    <header className={styles.header}>
                        <p className={styles.title}>Edit user</p>
                    </header>
                    <main className={styles.main}>
                        <label htmlFor="depositInput" className={styles.label}>Name
                            <Input className={styles.input}
                                   type="text"
                                   value={user.name}
                            />
                        </label>

                        <label htmlFor="depositInput" className={styles.label}>Address
                            <Input
                                className={styles.input}
                                type="text"
                                value={user.address || ''}
                            />
                        </label>

                        <label htmlFor="depositInput" className={styles.label}>Description
                            <Input
                                className={styles.input}
                                type="text"
                                value={user.description}
                            />
                        </label>
                    </main>
                    <footer className={styles.footer}>
                        <Button
                            className={styles.saveButton}
                        >
                            SAVE
                        </Button>
                        <Button
                            className={styles.loadMoreButton}
                        >
                            CANCEL
                        </Button>
                    </footer>
                </div>
        </Layout>
    ), document.getElementById('overlay-container'))
})
