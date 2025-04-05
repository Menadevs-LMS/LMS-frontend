const InputField = ({ label, name, value, onChange, type = 'text', placeholder, required = false, isTextArea = false }) => {
    const inputClass = "outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500 w-full";

    return (
        <div className='flex flex-col gap-1 mb-4'>
            <p>{label}</p>
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClass}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputClass}
                    required={required}
                />
            )}
        </div>
    );
};

export default InputField