import { useId } from 'react'
import type { HTMLInputTypeAttribute } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
    name?: string
    label?: string
    caption?: string
    hint?: string
    placeholder?: string
    type?: HTMLInputTypeAttribute
    autoComplete?: string
    accept?: string
    multiline?: boolean
    formRegister?: UseFormRegisterReturn
}

export function Input(props: InputProps) {
    const fieldId = useId()
    const id = `${props.name ?? props.formRegister?.name ?? 'field'}-${fieldId}`
    const description = props.caption ?? props.hint
    const shared = {
        id,
        className: `form-control ${props.caption ? 'has-error' : ''}`,
        placeholder: props.placeholder,
        'aria-invalid': !!props.caption,
        'aria-describedby': description ? `${id}-help` : undefined,
    }
    return (
        <div className="form-field">
            {props.label && <label htmlFor={id} className="form-label">{props.label}</label>}
            {props.multiline ? (
                <textarea {...props.formRegister} {...shared} rows={5} />
            ) : (
                <input {...props.formRegister} {...shared} type={props.type} accept={props.accept} autoComplete={props.autoComplete} />
            )}
            {description && <p id={`${id}-help`} className={props.caption ? 'form-error' : 'form-hint'} role={props.caption ? 'alert' : undefined}>{description}</p>}
        </div>
    )
}
