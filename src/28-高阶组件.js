import React from './react';
import ReactDOM from './react-dom/client';

function App() {
    return <MyComponentWithLoading />;
}

const MyComponentWithLoading = withLoading(MyComponent);

function MyComponent() {
    return <div>内容加载完成</div>;
}

function withLoading(Component) {
    return (props) => {
        const [isLoading, setIsLoading] = React.useState(true);
        React.useEffect(() => {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }, []);
        if (isLoading) {
            return <div>加载中...</div>;
        }
        return <Component {...props} />;
    };
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
