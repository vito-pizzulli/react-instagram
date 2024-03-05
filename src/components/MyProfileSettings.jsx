import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

const validationSchema = yup.object({
    email: yup.string()
        .email('Inserisci un indirizzo email valido.')
        .max(255, 'L\'indirizzo email non può contenere più di 255 caratteri.'),
    
    password: yup.string()
        .nullable()
        .min(8, 'La password deve contenere almeno 8 caratteri.')
        .max(255, 'La password non può contenere più di 255 caratteri.')
        .matches(/\d/, 'La password deve contenere almeno un numero.')
        .matches(/[a-z]/, 'La password deve contenere almeno una lettera minuscola.')
        .matches(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La password deve contenere almeno un simbolo speciale.'),
    
    username: yup.string()
        .min(3, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .max(30, 'L\'username deve contenere tra 3 e 30 caratteri.')
        .matches(/^[a-zA-Z0-9_.]+$/, 'L\'username può contenere solo lettere, numeri, underscore e punti.'),
    
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

function MyProfileSettings() {
    const { authUserInfo, serverUrl, setAuthenticated, setAuthUserInfo, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: authUserInfo.email || '',
            password: '',
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
            
            try {
                const response = await fetch(`${serverUrl}api/updateProfile`, {
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
                    navigate('/my-profile');
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
    
    return (
        <div className='homepage'>

            <h2>Modifica i tuoi dati</h2>
            {serverInternalError && <p>{serverInternalError}</p>}
            <ul>
                {serverValidationErrors.map((serverValidationError, index) => (
                    <li key={index}>{serverValidationError}</li>
                ))}
            </ul>

            <form onSubmit={formik.handleSubmit}>

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username ? <p>{formik.errors.username}</p> : null}

                <label htmlFor="name">Nome</label>
                <input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? <p>{formik.errors.name}</p> : null}

                <label htmlFor="name">Bio</label>
                <textarea
                    name="bio"
                    onChange={formik.handleChange}
                    value={formik.values.bio}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.bio && formik.errors.bio ? <p>{formik.errors.bio}</p> : null}

                <label htmlFor="profile_pic_url">Immagine del profilo</label>
                <input
                    type="file"
                    name='profile_pic_url'
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.profile_pic_url && formik.errors.profile_pic_url ? <p>{formik.errors.profile_pic_url}</p> : null}

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? <p>{formik.errors.email}</p> : null}

                {authUserInfo.password !== 'google' && (
                    <>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? <p>{formik.errors.password}</p> : null}
                    </>
                )}

                <button type='submit'>Salva</button>
                <button type='reset' onClick={handleReset}>Resetta i campi</button>
            </form>
        </div>
    );
}

export default MyProfileSettings;
