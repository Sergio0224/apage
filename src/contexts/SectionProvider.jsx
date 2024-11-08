import React, { createContext, useState } from 'react';

export const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState('inicio');

    return (
        <SectionContext.Provider
            value={{
                activeSection,
                setActiveSection
            }}>
            {children}
        </SectionContext.Provider>
    );
};