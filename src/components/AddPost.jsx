import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/Forms.module.scss';

const validationSchema = yup.object({
    image_url: yup.mixed()
        .required("É necessario caricare un'immagine per pubblicare il post.")
        .test(
            "fileFormat",
            "É necessario caricare un'immagine in formato jpg o png.",
            value => value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)),
    
    description: yup.string()
        .nullable()
        .max(255, 'La bio non può contenere più di 255 caratteri.'),

    location: yup.string()
        .nullable()
        .max(255, 'Il nome utente deve contenere tra 3 e 30 caratteri.')
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
        <div className={`${styles.addPost} addPost container-fluid`}>
            <div className="row m-auto">
                <div className="col-12 col-xl-5 m-auto border border-secondary-subtle p-5 text-center">
                    <h2 className='mb-4 fw-bold'>Crea un nuovo post</h2>
                {serverInternalError && <p className='alert alert-warning'>{serverInternalError}</p>}
                <ul>
                    {serverValidationErrors.map((serverValidationError, index) => (
                        <li className='alert alert-warning' key={index}>{serverValidationError}</li>
                    ))}
                </ul>
                <form className='d-flex flex-column w-100' onSubmit={formik.handleSubmit}>
                    
                    <div className="position-relative">
                        <span className={styles.placeholder}>Immagine del post</span>
                        <input
                            className='w-100'
                            type="file"
                            name='image_url'
                            onChange={handleFileChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.image_url && formik.errors.image_url ? <p className='alert alert-warning'>{formik.errors.image_url}</p> : null}
                    
                    <textarea
                        placeholder='Scrivi una didascalia'
                        className='w-100 mb-2'
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description ? <p className='alert alert-warning'>{formik.errors.description}</p> : null}
                    
                    <div className="position-relative">
                        <span className={styles.placeholder}>Luogo</span>
                        <input
                            placeholder='Es: Roma'
                            className='w-100'
                            type="text"
                            name="location"
                            onChange={formik.handleChange}
                            value={formik.values.location}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.location && formik.errors.location ? <p className='alert alert-warning'>{formik.errors.location}</p> : null}
                    
                    <button className='mb-3 btn btn-primary fw-semibold border-0' type='submit'>Pubblica Post</button>
                    <button className='btn btn-primary fw-semibold border-0' type='reset' onClick={handleReset}>Resetta i campi</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default AddPost;