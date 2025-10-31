import React from './react';
import ReactDOM from './react-dom/client';

class ScrollList extends React.Component {
    state = {
        items: Array.from({ length: 10 }, (_, index) => index).reverse(),
    };
    listRef = React.createRef();
    handleAddItem = () => {
        this.setState((prevState) => ({
            items: [prevState.items.length, ...prevState.items],
        }));
    };
    componentDidMount() {
        this.listRef.current.scrollTop = 20;
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        const list = this.listRef.current;
        return list.scrollHeight;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const list = this.listRef.current;
        list.scrollTop = list.scrollTop + list.scrollHeight - snapshot;
    }
    render() {
        return (
            <div>
                <ul
                    ref={this.listRef}
                    className="scroll-list"
                    style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid red',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {this.state.items.map((item, index) => (
                        <li
                            key={item}
                            style={{
                                listStyle: 'none',
                                height: '20px',
                                backgroundColor:
                                    index % 2 === 0 ? 'green' : 'blue',
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
                <button onClick={this.handleAddItem}>Add Item</button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ScrollList />);
