import {
    FC,
    forwardRef,
    memo,
    PropsWithChildren,
    Ref,
} from 'react'
import classNames from 'classnames'
import styles from './Layout.module.scss'

export interface Props extends PropsWithChildren<{}> {
    readonly className?: string
    readonly isAbsolute?: boolean
    readonly hasCenteredContent?: boolean
    readonly ref?: Ref<HTMLDivElement>
}

export const LayoutOriginal: FC<Props> = forwardRef(({className, isAbsolute, hasCenteredContent, children}, ref) => {
    const baseClasses = classNames(styles.base, className, {
        [styles.base__isAbsolute]: isAbsolute,
        [styles.base__hasCenteredContent]: hasCenteredContent,
    })
    return (
        <div className={baseClasses} ref={ref}>
            {children}
        </div>
    )
})

LayoutOriginal.displayName = 'Layout'
export const Layout = memo(LayoutOriginal)
