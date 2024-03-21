import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/Forms.module.scss';
import logo from '../assets/images/logo.png';
import googlePlay from '../assets/images/google-play.png';
import appStore from '../assets/images/app-store.png';

const validationSchema = yup.object({
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

function CompleteRegistration() {
    const { serverUrl, authUserInfo, setAuthenticated, setAuthUserInfo, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
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

            if (authUserInfo) {
                formData.append("email", authUserInfo.email);
            }
            
            try {
                const response = await fetch(`${serverUrl}api/completeRegistration`, {
                    method: 'PUT',
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

    function handleFileChange(event) {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("profile_pic_url", file);
    };

    async function handleLogout(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${serverUrl}api/logout`, { method: 'POST',
            credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                setServerInternalError(data.message || 'Si é verificato un errore non specificato.');
                return;
            }
            setServerInternalError('');
            setConfirmMessage(data.message);
            setAuthenticated(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={`${styles.completeRegistration} completeRegistration container-fluid`}>
            <div className="row m-auto">
                <div className="col-12 col-xl-5 m-auto border border-secondary-subtle p-5 text-center mb-3">
                    <form className='d-flex flex-column w-100' onSubmit={formik.handleSubmit}>
                        <img className='w-50 m-auto mb-4' src={logo} alt="Instagram Logo" />
                        <span>Ciao, <strong>{authUserInfo.email}</strong>!</span>
                        <span>Hai effettuato l'accesso con Google.</span>
                        <span className='mb-4'>Adesso completa il tuo profilo!</span>
                        {serverInternalError && <p className='alert alert-warning'>{serverInternalError}</p>}
                        <ul>
                            {serverValidationErrors.map((serverValidationError, index) => (
                                <li className='alert alert-warning' key={index}>{serverValidationError}</li>
                            ))}
                        </ul>
                                
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

                        <button className='mb-3 btn btn-primary fw-semibold border-0' type='submit'>Iscriviti</button>
                        <button className='mb-3 btn btn-primary fw-semibold border-0' type='reset' onClick={handleReset}>Resetta i campi</button>
                    </form>
                </div>
            </div>

            <div className="row m-auto mb-4">
                <div className='logoutArea border border-secondary-subtle p-4 text-center col-12 col-xl-5 m-auto'>
                    <div className="row">
                        <div className="col-12">
                            <span>Vuoi accedere o registrarti con la tua e-mail? </span>
                            <span className={`${styles.loginButton} fw-semibold`} role='button' onClick={handleLogout}>Logout</span>
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

export default CompleteRegistration;