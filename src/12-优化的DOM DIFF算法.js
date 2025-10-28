import React from './react';
import ReactDOM from './react-dom/client';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: ['A', 'B', 'C', 'D', 'E', 'F'],
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                list: ['A', 'C', 'E', 'B', 'G'],
            });
        }, 1000);
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.list.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
