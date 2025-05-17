import React from 'react';

const SelectField = ({
  label,
  name,
  register,
  errors,
  options = [],
  placeholder = "Select...",
  required = false,
  validation = {},
  onChange,
  defaultValue = ''
}) => {
  const selectClass = "outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 w-full";
  const errorClass = "border-red-500";

  return (
    <div className='flex flex-col gap-1 mb-4'>
      <p className="flex">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      
      <select
        {...register(name, validation)}
        className={`${selectClass} ${errors[name] ? errorClass : ''}`}
        onChange={onChange}
        defaultValue={defaultValue}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SelectField;