import {
    FC,
    forwardRef,
    memo,
    Ref,
} from 'react'
import classNames from 'classnames'
import styles from './Layout.module.scss'

export interface Props {
    readonly className?: string
    readonly isAbsolute?: boolean
    readonly hasCenteredContent?: boolean
    readonly ref?: Ref<HTMLDivElement>
}

export const Layout: FC<Props> = memo(forwardRef(({className, isAbsolute, hasCenteredContent, children}, ref) => {
    const baseClasses = classNames(styles.base, className, {
        [styles.base__isAbsolute]: isAbsolute,
        [styles.base__hasCenteredContent]: hasCenteredContent,
    })
    return (
        <div className={baseClasses} ref={ref}>
            {children}
        </div>
    )
}))
