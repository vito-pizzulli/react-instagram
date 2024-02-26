import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Registration({ setAuthenticated }) {
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [validationErrorMessages, setValidationErrorMessages] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formDataObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
                credentials: 'include'
            });
            const data = await response.json();
            setServerErrorMessage('');
            setValidationErrorMessages([]);

            if (!response.ok) {
                if (data.errors) {
                    setValidationErrorMessages(data.errors.map(error => error.msg));
                }

                if (data.message) {
                    setServerErrorMessage(data.message);
                }

            } else {
                setAuthenticated(true);
                navigate('/');
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='registration'>
            <form onSubmit={handleSubmit}>
                <h2>Inserisci i tuoi dati</h2>
                {serverErrorMessage && <p>{serverErrorMessage}</p>}
                <ul>
                    {validationErrorMessages.map((validationErrorMessage, index) => (
                        <li key={index}>{validationErrorMessage}</li>
                    ))}
                </ul>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' />
                <label htmlFor="email">Password</label>
                <input type="password" name='password' />
                <label htmlFor="username">Username</label>
                <input type="text" name='username' />
                <label htmlFor="firstname">Nome</label>
                <input type="text" name='firstname' />
                <label htmlFor="lastname">Cognome</label>
                <input type="text" name='lastname' />
                <button type='submit'>Registrati</button>
                <button type='reset'>Resetta i campi</button>
            </form>
        </div>
    )
}

export default Registration;