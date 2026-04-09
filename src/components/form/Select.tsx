import type { UseFormRegisterReturn } from "react-hook-form"

type Option = {
    value: string | number
    label: string
}

type SelectProps = {
    name?: string
    label?: string
    caption?: string
    formRegister?: UseFormRegisterReturn
    options: Option[]
}

export function Select(props: SelectProps) {
    return (
        <div>
            {props.label && (
                <label 
                    htmlFor={props.name} 
                    className="block text-sm font-medium text-gray-700"
                >
                    {props.label}
                </label>
            )}

            <div className="relative">
                <select
                    {...props.formRegister}
                    id={props.name}
                    className="mt-1 block w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {props.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {props.caption && (
                <p className="mt-1 text-sm text-red-600">
                    {props.caption}
                </p>
            )}
        </div>
    )
}