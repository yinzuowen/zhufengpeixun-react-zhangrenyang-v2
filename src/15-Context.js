import React from './react';
import ReactDOM from './react-dom/client';

const ThemeContext = React.createContext();

const COMMON_STYLE = {
    margin: '8px 0',
    padding: '8px',
};

function BorderBox({ children }) {
    return (
        <ThemeContext.Consumer>
            {(value) => (
                <div
                    style={{
                        ...COMMON_STYLE,
                        border: `2px solid ${value.color}`,
                    }}
                >
                    {children}
                </div>
            )}
        </ThemeContext.Consumer>
    );
}

class Header extends React.Component {
    static contextType = ThemeContext;

    render() {
        return (
            <BorderBox>
                Header
                <Title />
            </BorderBox>
        );
    }
}

function Title() {
    return <BorderBox>Title</BorderBox>;
}

class Main extends React.Component {
    render() {
        return (
            <BorderBox>
                Main
                <Content />
            </BorderBox>
        );
    }
}

function Content() {
    return <BorderBox>Content</BorderBox>;
}

class Footer extends React.Component {
    static contextType = ThemeContext;
    render() {
        return (
            <div
                style={{
                    ...COMMON_STYLE,
                    border: `2px solid ${this.context.color}`,
                }}
            >
                Footer
                <Button text="Green" color="green" />
                <Button text="Blue" color="blue" />
            </div>
        );
    }
}

function Button(props) {
    return (
        <ThemeContext.Consumer>
            {(value) => (
                <button onClick={() => value.changeColor(props.color)}>
                    {props.text}
                </button>
            )}
        </ThemeContext.Consumer>
    );
}

class App extends React.Component {
    state = {
        color: 'red',
    };
    changeColor = (color) => {
        this.setState({
            color,
        });
    };
    render() {
        return (
            <ThemeContext.Provider
                value={{
                    color: this.state.color,
                    changeColor: this.changeColor,
                }}
            >
                <BorderBox>
                    <Header />
                    <Main />
                    <Footer />
                </BorderBox>
            </ThemeContext.Provider>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
