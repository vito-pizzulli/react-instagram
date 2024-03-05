import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import '../style.css';

const validationSchema = yup.object({
    image_url: yup.mixed()
        .required("É necessario caricare un'immagine per pubblicare il post.")
        .test(
            "fileFormat",
            "É necessario caricare un'immagine in formato jpg o png.",
            value => value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)),
    
    description: yup.string()
        .nullable()
        .max(255, 'L\'indirizzo email non può contenere più di 255 caratteri.'),

    location: yup.string()
        .nullable()
        .max(255, 'L\'username deve contenere tra 3 e 30 caratteri.')
});

function AddPost() {
    const { serverUrl, setConfirmMessage } = useAuth();
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            description: '',
            location: '',
            image_url: null
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {

                if (key !== 'image_url') {
                    formData.append(key, values[key]);
                }
            });

            if (values.image_url) {
                formData.append("image_url", values.image_url);
            }
            
            try {
                const response = await fetch(`${serverUrl}api/addPost`, {
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
        formik.setFieldValue("image_url", file);
    };

    return (
        <div className='add-post'>
            <h2>Pubblica un nuovo post</h2>
            {serverInternalError && <p>{serverInternalError}</p>}
            <ul>
                {serverValidationErrors.map((serverValidationError, index) => (
                    <li key={index}>{serverValidationError}</li>
                ))}
            </ul>
            <form onSubmit={formik.handleSubmit}>

                <label htmlFor="image_url">Immagine del Post</label>
                <input
                    type="file"
                    name='image_url'
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.image_url && formik.errors.image_url ? <p>{formik.errors.image_url}</p> : null}

                <label htmlFor="description">Descrizione</label>
                <textarea
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description ? <p>{formik.errors.description}</p> : null}

                <label htmlFor="location">Luogo</label>
                <input
                    type="text"
                    name="location"
                    onChange={formik.handleChange}
                    value={formik.values.location}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.location && formik.errors.location ? <p>{formik.errors.location}</p> : null}
                
                <button type='submit'>Pubblica Post</button>
                <button type='reset' onClick={handleReset}>Resetta i campi</button>
            </form>
        </div>
    )
}

export default AddPost;