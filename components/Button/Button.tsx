import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    FC,
    memo,
} from 'react'
import classNames from 'classnames'
import styles from './Button.module.scss'

export interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
}

export const Button: FC<Props> = memo(({className, children, ...restProps}) => {
    const baseClasses = classNames(styles.base, className)
    return (
        <button type="button" className={baseClasses} {...restProps}>{children}</button>
    )
})
