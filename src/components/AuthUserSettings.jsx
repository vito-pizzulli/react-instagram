import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import ConfirmWindow from './ConfirmWindow';
import styles from '../assets/styles/Forms.module.scss';

const validationSchema = yup.object({
    email: yup.string()
        .email('Inserisci un indirizzo e-mail valido.')
        .max(255, 'L\'indirizzo e-mail non può contenere più di 255 caratteri.'),
    
    password: yup.string()
        .nullable()
        .min(8, 'La password deve contenere almeno 8 caratteri.')
        .max(255, 'La password non può contenere più di 255 caratteri.')
        .matches(/\d/, 'La password deve contenere almeno un numero.')
        .matches(/[a-z]/, 'La password deve contenere almeno una lettera minuscola.')
        .matches(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La password deve contenere almeno un simbolo speciale.'),
    
    username: yup.string()
        .min(3, 'Il nome utente deve contenere tra 3 e 30 caratteri.')
        .max(30, 'Il nome utente deve contenere tra 3 e 30 caratteri.')
        .matches(/^[a-zA-Z0-9_.]+$/, 'Il nome utente può contenere solo lettere, numeri, underscore e punti.'),
    
    name: yup.string()
        .max(50, 'Il nome non può contenere più di 50 caratteri.')
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, 'Il nome può contenere solo lettere.'),

    profile_pic_url: yup.mixed()
        .nullable()
        .notRequired()
        .test(
            "fileFormat",
            "É necessario caricare un'immagine in formato jpg o png.",
            value => !value || (value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
        ),

    bio: yup.string()
        .nullable()
        .max(150, 'La bio non puó contenere piú di 150 caratteri.')
});

function AuthUserSettings() {
    const { authUserInfo, setAuthUserInfo, setAuthenticated, serverUrl, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();
    const [confirmWindowVisible, setConfirmWindowVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const deleteAccountIfConfirmed = async () => {
            if (isConfirmed) {
                try {
                    const response = await fetch(`${serverUrl}api/deleteProfile`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    const data = await response.json();
                    setConfirmMessage(data.message);
                    setAuthUserInfo({});
                    setAuthenticated(false);
                    navigate('/login');
        
                } catch (err) {
                    console.error(err);
                }
            }
        };
        
        deleteAccountIfConfirmed();
    }, [ isConfirmed, navigate, serverUrl, setAuthUserInfo, setAuthenticated, setConfirmMessage ]);

    const formik = useFormik({
        initialValues: {
            email: authUserInfo.email || '',
            password: '',
            password_confirm: '',
            username: authUserInfo.username || '',
            name: authUserInfo.name || '',
            profile_pic_url: null,
            bio: authUserInfo.bio || ''
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

            if (values.password && values.password !== values.password_confirm) {
                formik.setFieldError('password_confirm', 'Le password non corrispondono.');
                return;
            }
            
            try {
                const response = await fetch(`${serverUrl}api/updateProfile`, {
                    method: 'PATCH',
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
                    navigate(`/${data.user.username}`);
                }

            } catch (err) {
                console.error(err);
            }
        }
    });

    function handleReset() {
        formik.resetForm();
    };

    async function handleAccountDelete() {
        setConfirmWindowVisible(true);
    }

    function handleFileChange(event) {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("profile_pic_url", file);
    };
    
    return (
        <div className={`${styles.authUserSettings} authUserSettings container-fluid`}>
            <div className="row m-auto">
                <div className='col-12 col-xl-5 m-auto border border-secondary-subtle p-5 text-center'>
                    <h2 className='mb-4 fw-bold'>Modifica profilo</h2>
                    {serverInternalError && <p className='alert alert-warning'>{serverInternalError}</p>}
                    <ul>
                        {serverValidationErrors.map((serverValidationError, index) => (
                            <li className='alert alert-warning' key={index}>{serverValidationError}</li>
                        ))}
                    </ul>

                    <form className='d-flex flex-column w-100' onSubmit={formik.handleSubmit}>

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
                        
                        <textarea
                            placeholder='Raccontaci qualcosa di te'
                            className='w-100 mb-2'
                            name="bio"
                            onChange={formik.handleChange}
                            value={formik.values.bio}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.bio && formik.errors.bio ? <p className='alert alert-warning'>{formik.errors.bio}</p> : null}
                        
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

                        {authUserInfo.password !== 'google' && (
                            <>
                                <div className="position-relative">
                                    <label htmlFor='password'>Password</label>
                                    <input
                                        placeholder='Inserisci la nuova password'
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
                                        placeholder='Ridigita la nuova password'
                                        className='w-100'
                                        type="password"
                                        name="password_confirm"
                                        onChange={formik.handleChange}
                                        value={formik.values.password_confirm}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                {formik.touched.password_confirm && formik.errors.password_confirm ? <p className='alert alert-warning'>{formik.errors.password_confirm}</p> : null}
                            </>
                        )}

                        <button className='mb-3 btn btn-primary fw-semibold border-0' type='submit'>Invia</button>
                        <button className='mb-3 btn btn-primary fw-semibold border-0' type='reset' onClick={handleReset}>Resetta i campi</button>
                        <button className={`${styles.delete} btn fw-semibold`} type='button' onClick={handleAccountDelete}>Cancella iscrizione</button>
                    </form>
                </div>
            </div>

            { confirmWindowVisible &&
                <ConfirmWindow
                    message="Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata."
                    setIsConfirmed={setIsConfirmed}
                    setConfirmWindowVisible={setConfirmWindowVisible}
                />
            }
        </div>
    );
}

export default AuthUserSettings;
