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

export const InputOriginal: FC<Props> = ({className, children, ...restProps}) => {
    const baseClasses = classNames(styles.base, className)
    return (
        <input className={baseClasses} {...restProps}>{children}</input>
    )
}
InputOriginal.displayName = 'Input'

export const Input = memo(InputOriginal)
