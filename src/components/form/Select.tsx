import { useId } from 'react'
import { CaretDown } from 'phosphor-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type Option = { value: string | number; label: string }
type SelectProps = {
    name?: string
    label?: string
    caption?: string
    hint?: string
    formRegister?: UseFormRegisterReturn
    options: Option[]
}

export function Select(props: SelectProps) {
    const fieldId = useId()
    const id = `${props.name ?? props.formRegister?.name ?? 'select'}-${fieldId}`
    const description = props.caption ?? props.hint
    return (
        <div className="form-field">
            {props.label && <label htmlFor={id} className="form-label">{props.label}</label>}
            <div className="form-select-wrapper">
                <select {...props.formRegister} id={id} className={`form-control form-select ${props.caption ? 'has-error' : ''}`} aria-invalid={!!props.caption} aria-describedby={description ? `${id}-help` : undefined}>
                    {props.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <CaretDown aria-hidden="true" size={16} className="form-select-caret" />
            </div>
            {description && <p id={`${id}-help`} className={props.caption ? 'form-error' : 'form-hint'} role={props.caption ? 'alert' : undefined}>{description}</p>}
        </div>
    )
}
