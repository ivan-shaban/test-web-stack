import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    FC,
    memo,
} from 'react'
import classNames from 'classnames'
import styles from './Button.module.scss'

export enum ButtonType {
    Primary = 'primary',
    Danger = 'danger',
}

export interface Props extends Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'type'> {
    readonly isDisabled?: boolean
    readonly type?: ButtonType
}

export const ButtonOriginal: FC<Props> = ({
                                              className,
                                              isDisabled,
                                              type = ButtonType.Primary,
                                              children,
                                              ...restProps
                                          }) => {
    const baseClasses = classNames(styles.base, styles[`base__${type}`], className, {
        [styles.base__disabled]: isDisabled,
    })
    return (
        <button type="button" className={baseClasses} {...restProps}>{children}</button>
    )
}
ButtonOriginal.displayName = 'Button'

export const Button = memo(ButtonOriginal)
