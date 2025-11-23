import React from 'react';
import ReactDOM from 'react-dom/client';

const Layout = React.memo(() => {
    return (
        <div>
            <Header />
            <Main />
            <Footer />
        </div>
    );
});

function Header() {
    return <header>Header</header>;
}

function Main() {
    return <main>Main</main>;
}

function Footer() {
    return <footer>Footer</footer>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Layout />);
