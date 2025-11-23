import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return <UserListContainer />;
}

function UserListContainer() {
    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <UserList users={users} />;
}

function UserList({ users }) {
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
