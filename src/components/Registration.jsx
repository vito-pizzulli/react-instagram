// Importing necessary hooks, component, library, styles and assets.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import Loading from './Loading';
import styles from '../assets/styles/Forms.module.scss';
import logo from '../assets/images/logo.png';
import googlePlay from '../assets/images/google-play.png';
import appStore from '../assets/images/app-store.png';

// Validation schema using Yup for form data validation.
const validationSchema = yup.object({
    email: yup.string()
        .required('Il campo e-mail non può essere vuoto.')
        .email('Inserisci un indirizzo e-mail valido.')
        .max(255, 'L\'indirizzo e-mail non può contenere più di 255 caratteri.'),
    
    password: yup.string()
        .required('Il campo password non può essere vuoto.')
        .min(8, 'La password deve contenere almeno 8 caratteri.')
        .max(255, 'La password non può contenere più di 255 caratteri.')
        .matches(/\d/, 'La password deve contenere almeno un numero.')
        .matches(/[a-z]/, 'La password deve contenere almeno una lettera minuscola.')
        .matches(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La password deve contenere almeno un simbolo speciale.'),

    password_confirm: yup.string()
        .oneOf([yup.ref('password'), null], 'Le password non corrispondono.'),
    
    username: yup.string()
        .required('Il campo nome utente non può essere vuoto.')
        .min(3, 'Il nome utente deve contenere tra 3 e 30 caratteri.')
        .max(30, 'Il nome utente deve contenere tra 3 e 30 caratteri.')
        .matches(/^[a-zA-Z0-9_.]+$/, 'Il nome utente può contenere solo lettere, numeri, underscore e punti.'),
    
    name: yup.string()
        .required('Il campo nome non può essere vuoto.')
        .max(50, 'Il nome non può contenere più di 50 caratteri.')
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Il nome può contenere solo lettere.'),

    profile_pic_url: yup.mixed()
        .required("É necessario caricare un'immagine di profilo.")
        .test(
            "fileFormat",
            "É necessario caricare un'immagine in formato jpg o png.",
            value => value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
});

// Component function that encapsulates the logic and UI for the registration page.
function Registration() {

    // Destructuring server url, along with setter functions for authenticated status, authenticated user info and confirm message from useAuth custom hook.
    const { serverUrl, setAuthenticated, setAuthUserInfo, setConfirmMessage } = useAuth();

    // Destructuring server internal error and server validation errors, along with their setter functions from useErrors custom hook.
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();

    // Initializing state management.
    const [registrationLoading, setRegistrationLoading] = useState(false);

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // Defining form initial values using Formik.
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            password_confirm: '',
            username: '',
            name: '',
            profile_pic_url: null
        },

        // Linking Yup validation schema to Formik.
        validationSchema: validationSchema,

        // Asynchronous function to handle form submission, creating FormData object and handling file uploads.
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {

                if (key !== 'profile_pic_url') {
                    formData.append(key, values[key]);
                }
            });

            if (values.profile_pic_url) {
                formData.append("profile_pic_url", values.profile_pic_url);
            }
            
            // Setting registrationLoading to true so the Loading component will show while the registration is completing.
            setRegistrationLoading(true);

            // Attempt to send the formData to the server via POST request and handle response or errors.
            try {
                const response = await fetch(`${serverUrl}api/register`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include' // Includes credentials to ensure cookies are sent with the request.
                });
                const data = await response.json();
                setServerInternalError('');
                setServerValidationErrors([]);

                if (!response.ok) {
                    if (data.errors) {
                        setRegistrationLoading(false);
                        setServerValidationErrors(data.errors.map(error => error.msg));
                    }

                    if (data.message) {
                        setRegistrationLoading(false);
                        setServerInternalError(data.message);
                    }

                } else {
                    setConfirmMessage(data.message);
                    setAuthUserInfo(data.user);
                    setAuthenticated(true);
                    navigate('/'); // Redirect to Home page on success.
                }

            } catch (err) {
                console.error(err);
            }
        }
    });

    // Handler for resetting the Formik form.
    function handleReset() {
        formik.resetForm();
    };

    // Handler for the navigation to the path for authenticating with Google.
    function handleGoogleLogin() {
        window.location.href = `${serverUrl}auth/google`;
    };

    // Handler for the navigation to the path for registering a new user.
    function handleLoginNavigation() {
        navigate('/login');
    };

    // Handler for updating the Formik form state for file input changes.
    function handleFileChange(event) {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("profile_pic_url", file);
    };

    return (
        <div className={`${styles.registration} registration container-fluid`}>
            <div className="row m-auto mb-3">
                <div className="col-12 col-xl-5 m-auto d-flex flex-column align-items-center border border-secondary-subtle p-3 px-0 px-md-5">
                    <img className='w-50 mb-4' src={logo} alt="Instagram logo" />
                    <span className='mb-3'>Iscriviti per vedere le foto dei tuoi amici.</span>
                    <button className='fw-semibold mb-3 btn btn-primary border-0' onClick={handleGoogleLogin}><i className="fa-brands fa-google me-2"></i> Accedi con Google</button>
                    <div className="row w-100 mb-2">
                        <div className="col-5">
                            <hr />
                        </div>
                        <div className="col-2 text-center">
                            <span className={`${styles.separator} fs-5`}>o</span>
                        </div>
                        <div className="col-5">
                            <hr />
                        </div>
                    </div>
                    {serverInternalError && <p className='alert alert-warning'>{serverInternalError}</p>}
                    <ul>
                        {serverValidationErrors.map((serverValidationError, index) => (
                            <li className='alert alert-warning' key={index}>{serverValidationError}</li>
                        ))}
                    </ul>

                    {!registrationLoading ? (
                        <form className='d-flex flex-column w-100 mb-3' onSubmit={formik.handleSubmit}>
                            <div className='position-relative'>
                                <label htmlFor='email'>Indirizzo e-mail</label>
                                <input
                                    placeholder='Es: mario.rossi.94@gmail.com'
                                    className='w-100'
                                    type="email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? <p className='alert alert-warning'>{formik.errors.email}</p> : null}

                            <div className="position-relative">
                                <label htmlFor='name'>Nome e cognome</label>
                                <input
                                    placeholder='Es: Mario Rossi'
                                    className='w-100'
                                    type="text"
                                    name="name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name ? <p className='alert alert-warning'>{formik.errors.name}</p> : null}
                            
                            <div className="position-relative">
                                <label htmlFor='username'>Nome utente</label>
                                <input
                                    placeholder='Es: mario.rossi.94'
                                    className='w-100'
                                    type="text"
                                    name="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.username && formik.errors.username ? <p className='alert alert-warning'>{formik.errors.username}</p> : null}
                            
                            <div className="position-relative">
                                <label htmlFor='profile_pic_url'>Immagine del profilo</label>
                                <input
                                    className='w-100'
                                    type="file"
                                    name='profile_pic_url'
                                    onChange={handleFileChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.profile_pic_url && formik.errors.profile_pic_url ? <p className='alert alert-warning'>{formik.errors.profile_pic_url}</p> : null}
                            
                            <div className="position-relative">
                                <label htmlFor='password'>Password</label>
                                <input
                                    placeholder='Crea una password'
                                    className='w-100'
                                    type="password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? <p className='alert alert-warning'>{formik.errors.password}</p> : null}
                            
                            <div className="position-relative">
                                <label htmlFor='password_confirm'>Conferma password</label>
                                <input
                                    placeholder='Ridigita la password'
                                    className='w-100'
                                    type="password"
                                    name="password_confirm"
                                    onChange={formik.handleChange}
                                    value={formik.values.password_confirm}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password_confirm && formik.errors.password_confirm ? <p className='alert alert-warning'>{formik.errors.password_confirm}</p> : null}

                            <button className='mb-3 btn btn-primary fw-semibold border-0' type='submit'>Iscriviti</button>
                            <button className='mb-3 btn btn-primary fw-semibold border-0' type='reset' onClick={handleReset}>Resetta i campi</button>
                        </form>
                    ) : <Loading />}
                </div>
            </div>
            
            {!registrationLoading && (
                <>
                    <div className="row m-auto mb-4">
                        <div className='loginArea border border-secondary-subtle p-4 text-center col-12 col-xl-5 m-auto'>
                            <div className="row">
                                <div className="col-12">
                                    <span>Hai un account? </span>
                                    <span className={`${styles.loginButton} fw-semibold`} role='button' onClick={handleLoginNavigation}>Accedi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.appDownload}>
                        <div className="row text-center mb-3">
                            <div className="col-12">
                                <span>Scarica l'applicazione.</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 d-flex justify-content-end">
                            <a href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=it&gl=US" target="_blank" rel="noopener noreferrer">
                                <img src={googlePlay} alt="Download from Google Play Logo" />
                            </a>
                            </div>
                            <div className="col-6 d-flex justify-content-start">
                                <a href="https://apps.apple.com/it/app/instagram/id389801252" target="_blank" rel="noopener noreferrer">
                                    <img src={appStore} alt="Download from App Store Logo." />
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Registration;