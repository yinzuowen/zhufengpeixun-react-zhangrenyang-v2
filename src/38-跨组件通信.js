import React from 'react';
import ReactDOM from 'react-dom/client';

const text = {
    en: {
        greeting: 'Hello',
    },
    zhCN: {
        greeting: '你好',
    },
};

const LanguageContext = React.createContext();

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = React.useState('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

function LocalizedText() {
    const { language } = React.useContext(LanguageContext);
    return <div>{text[language].greeting}</div>;
}

function LanguageSwitcher() {
    const { setLanguage } = React.useContext(LanguageContext);
    return (
        <div>
            <button onClick={() => setLanguage('en')}>English</button>
            <button onClick={() => setLanguage('zhCN')}>中文</button>
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <LocalizedText />
            <LanguageSwitcher />
        </LanguageProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
