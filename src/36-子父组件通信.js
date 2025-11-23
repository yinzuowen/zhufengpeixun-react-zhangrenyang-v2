import React from 'react';
import ReactDOM from 'react-dom/client';

// class ParentComponent extends React.Component {
//     state = {
//         dataFromChild: '',
//     };

//     handleDataChanged = (data) => {
//         this.setState({
//             dataFromChild: data,
//         });
//     };

//     render() {
//         return (
//             <div>
//                 <h1>Parent Component</h1>
//                 <p>Data from child: {this.state.dataFromChild}</p>
//                 <ChildComponent onDataChanged={this.handleDataChanged} />
//             </div>
//         );
//     }
// }

// class ChildComponent extends React.Component {
//     render() {
//         return (
//             <button onClick={() => this.props.onDataChanged('data from child')}>
//                 Click Me
//             </button>
//         );
//     }
// }

class ParentComponent extends React.Component {
    modalRef = React.createRef();
    openModal = () => {
        this.modalRef.current.open();
    };
    render() {
        return (
            <div>
                <button onClick={this.openModal}>Click Me</button>
                <ModalComponent ref={this.modalRef} />
            </div>
        );
    }
}

class ModalComponent extends React.Component {
    state = {
        isOpen: false,
    };

    open = () => {
        this.setState({
            isOpen: true,
        });
    };

    close = () => {
        this.setState({
            isOpen: false,
        });
    };

    render() {
        return (
            <div style={{ display: this.state.isOpen ? 'block' : 'none' }}>
                <h2>Modal Component</h2>
                <button onClick={this.close}>Close</button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ParentComponent />);
