import {
    DetailedHTMLProps,
    FC,
    InputHTMLAttributes,
    memo,
} from 'react'
import classNames from 'classnames'
import styles from './Input.module.scss'

export interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
}

export const Input: FC<Props> = memo(({className, children, ...restProps}) => {
    const baseClasses = classNames(styles.base, className)
    return (
        <input className={baseClasses} {...restProps}>{children}</input>
    )
})
