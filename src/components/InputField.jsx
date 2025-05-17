import React from 'react';

const InputField = ({
    label,
    name,
    register,
    errors,
    type = 'text',
    placeholder,
    required = false,
    isTextArea = false,
    validation = {},
    defaultValue = ''
}) => {
    const inputClass = "outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 w-full";
    const errorClass = "border-red-500";

    return (
        <div className='flex flex-col gap-1 mb-4'>
            <p className="flex">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </p>

            {isTextArea ? (
                <textarea
                    {...register(name, validation)}
                    placeholder={placeholder}
                    className={`${inputClass} ${errors[name] ? errorClass : ''}`}
                    defaultValue={defaultValue}
                />
            ) : (
                <input
                    type={type}
                    {...register(name, validation)}
                    placeholder={placeholder}
                    className={`${inputClass} ${errors[name] ? errorClass : ''}`}
                    defaultValue={defaultValue}
                />
            )}

            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
            )}
        </div>
    );
};

export default InputField;