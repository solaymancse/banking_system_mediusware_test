// resources/js/components/SelectInput.js

import React from 'react';

const SelectInput = ({ id, name, value, className, onChange, children }) => {
    return (
        <select id={id} name={name} value={value} className={className} onChange={onChange}>
            {children}
        </select>
    );
};

export default SelectInput;
