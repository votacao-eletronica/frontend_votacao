import type { UseFormRegisterReturn } from "react-hook-form"

type InputProps = {
    name?: string
    label?: string
    caption?: string
    type?: React.HTMLInputTypeAttribute
    multiline?: boolean
    formRegister?: UseFormRegisterReturn
}

export function Input(props: InputProps) {
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
                {props.multiline ? (
                    <textarea
                        {...props.formRegister}
                        id={props.name}
                        className="mt-1 block w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                        rows={4}
                    />
                ) : (
                    <input
                        {...props.formRegister}
                        id={props.name}
                        type={props.type}
                        className="mt-1 block w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                )}
            </div>

            {props.caption && (
                <p className="mt-1 text-sm text-red-600">
                    {props.caption}
                </p>
            )}
        </div>
    )
}