import React from 'react';
import ReactDOM from 'react-dom/client';

import { cloneDeep, isEqual } from 'lodash';
// import { produce } from 'immer';

function produce(recipe) {
    return (baseState) => {
        const draft = cloneDeep(baseState);
        recipe(draft);
        return draft;
    };
}

class App extends React.Component {
    state = {
        count: {
            value: 0,
        },
        text: '',
    };

    setCount = () => {
        // this.setState({
        //     count: {
        //         value: this.state.count.value + 1
        //     },
        // });
        this.setState(
            produce((draft) => {
                draft.count.value += 1;
            }),
        );
    };

    setText = (text) => {
        this.setState({
            text,
        });
    };

    render() {
        return (
            <div>
                <input
                    value={this.state.text}
                    onChange={(e) => this.setText(e.target.value)}
                />
                <Counter count={this.state.count} increment={this.setCount} />
            </div>
        );
    }
}

// class Counter extends React.PureComponent {
//     render() {
//         console.log('Counter render');
//         return (
//             <div>
//                 <button onClick={() => this.props.increment()}>increment</button>
//             </div>
//         );
//     }
// }

class Counter extends React.PureComponent {
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
    //     );
    // }

    render() {
        console.log('Counter render');
        return (
            <div>
                <button onClick={() => this.props.increment()}>
                    increment
                </button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
