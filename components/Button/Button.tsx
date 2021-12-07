import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    FC,
    memo,
} from 'react'
import classNames from 'classnames'
import styles from './Button.module.scss'

export interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    readonly isDisabled?:boolean
}

export const Button: FC<Props> = memo(({className, isDisabled, children, ...restProps}) => {
    const baseClasses = classNames(styles.base, className, {
        [styles.base__disabled]: isDisabled,
    })
    return (
        <button type="button" className={baseClasses} {...restProps}>{children}</button>
    )
})
