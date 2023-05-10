import React, { createContext, useReducer, useContext } from "react";

const ThemeContext = createContext();

const themeReducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_THEME":
            return { ...state, darkMode: !state.darkMode };
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
};


const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, { darkMode: false });

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, ThemeContext };
