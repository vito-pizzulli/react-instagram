import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/Authentication.module.scss';
import logo from '../assets/images/logo.png';
import googlePlay from '../assets/images/google-play.png';
import appStore from '../assets/images/app-store.png';

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

    password_confirm: yup.string()
        .oneOf([yup.ref('password'), null], 'Le password non corrispondono.'),
    
    username: yup.string()
        .required('Il campo username non può essere vuoto.')
        .min(3, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .max(30, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .matches(/^[a-zA-Z0-9_.]+$/, 'L\'username può contenere solo lettere, numeri, underscore e punti.'),
    
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

function Registration() {
    const { serverUrl, setAuthenticated, setAuthUserInfo, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            password_confirm: '',
            username: '',
            name: '',
            profile_pic_url: null
        },
        validationSchema: validationSchema,
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
            
            try {
                const response = await fetch(`${serverUrl}api/register`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                const data = await response.json();
                setServerInternalError('');
                setServerValidationErrors([]);

                if (!response.ok) {
                    if (data.errors) {
                        setServerValidationErrors(data.errors.map(error => error.msg));
                    }

                    if (data.message) {
                        setServerInternalError(data.message);
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

    function handleGoogleLogin() {
        window.location.href = `${serverUrl}auth/google`;
    };

    function handleLoginNavigation() {
        navigate('/login');
    };

    function handleFileChange(event) {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("profile_pic_url", file);
    };

    return (
        <div className={`${styles.registration} registration container-fluid`}>
            <div className="row m-auto mb-3">
                <div className="col-12 col-xl-5 m-auto d-flex flex-column align-items-center border border-secondary-subtle p-5">
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

                    <form className='d-flex flex-column w-100 mb-3' onSubmit={formik.handleSubmit}>
                        <div className='position-relative'>
                            <span className={styles.placeholder}>Indirizzo e-mail</span>
                            <input
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
                            <span className={styles.placeholder}>Nome e cognome</span>
                            <input
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
                            <span className={styles.placeholder}>Nome utente</span>
                            <input
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
                            <span className={styles.placeholder}>Immagine del profilo</span>
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
                            <span className={styles.placeholder}>Password</span>
                            <input
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
                            <span className={styles.placeholder}>Conferma password</span>
                            <input
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
                </div>
            </div>
            
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
        </div>
    )
}

export default Registration;