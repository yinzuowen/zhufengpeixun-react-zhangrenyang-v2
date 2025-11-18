import React from './react';
import ReactDOM from './react-dom/client';

function useForm(initialValues) {
    const [values, setValues] = React.useState(initialValues);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);
    };

    return { values, handleChange, handleSubmit };
}

const LoginForm = () => {
    const { values, handleChange, handleSubmit } = useForm({
        username: '',
        password: '',
    });

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
            />
            <button type="submit">Login</button>
        </form>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<LoginForm />);
