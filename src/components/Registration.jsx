import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../style.css';

const validationSchema = yup.object({
    email: yup.string()
        .required('Il campo email non può essere vuoto.')
        .email('Inserisci un indirizzo email valido.')
        .max(255, 'L\'indirizzo email non può contenere più di 255 caratteri.'),
    
    password: yup.string()
        .required('Il campo password non può essere vuoto.')
        .min(8, 'La password deve contenere almeno 8 caratteri.')
        .max(255, 'La password non può contenere più di 255 caratteri.')
        .matches(/\d/, 'La password deve contenere almeno un numero.')
        .matches(/[a-z]/, 'La password deve contenere almeno una lettera minuscola.')
        .matches(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La password deve contenere almeno un simbolo speciale.'),
    
    username: yup.string()
        .required('Il campo username non può essere vuoto.')
        .min(3, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .max(30, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .matches(/^[a-zA-Z0-9_]+$/, 'L\'username può contenere solo lettere, numeri e underscore.'),
    
    name: yup.string()
        .required('Il campo nome non può essere vuoto.')
        .max(50, 'Il nome non può contenere più di 50 caratteri.')
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Il nome può contenere solo lettere.')
});

function Registration({ setAuthenticated, setAuthUserInfo, setConfirmMessage }) {
    const [serverInternalError, setserverInternalError] = useState('');
    const [serverValidationErrors, setServerValidationErrors] = useState([]);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            username: '',
            name: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                    credentials: 'include'
                });
                const data = await response.json();
                setserverInternalError('');
                setServerValidationErrors([]);

                if (!response.ok) {
                    if (data.errors) {
                        setServerValidationErrors(data.errors.map(error => error.msg));
                    }

                    if (data.message) {
                        setserverInternalError(data.message);
                    }

                } else {
                    setConfirmMessage(data.message);
                    setAuthUserInfo(data.user);
                    setAuthenticated(true);
                    navigate('/');
                }

            } catch (err) {
                console.error(err);
            }
        }
    });

    function handleReset() {
        formik.resetForm();
    };

    return (
        <div className='registration'>
            <form onSubmit={formik.handleSubmit}>
                <h2>Inserisci i tuoi dati</h2>
                {serverInternalError && <p>{serverInternalError}</p>}
                <ul>
                    {serverValidationErrors.map((serverValidationError, index) => (
                        <li key={index}>{serverValidationError}</li>
                    ))}
                </ul>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? <p>{formik.errors.email}</p> : null}
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? <p>{formik.errors.password}</p> : null}
                <label htmlFor="username">Username</label>
                <input
                    type="username"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username ? <p>{formik.errors.username}</p> : null}
                <label htmlFor="name">Nome</label>
                <input
                    type="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? <p>{formik.errors.name}</p> : null}
                <button type='submit'>Registrati</button>
                <button type='reset' onClick={handleReset}>Resetta i campi</button>
            </form>
        </div>
    )
}

export default Registration;