// Importing necessary hooks, library and styles.
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useErrors } from '../contexts/ErrorsContext';
import styles from '../assets/styles/Forms.module.scss';

// Validation schema using Yup for form data validation.
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

// Component function that encapsulates the logic and UI for the page that allows the user to create a new post.
function AddPost() {

    // Destructuring server url, along with setConfirmMessage function from useAuth custom hook.
    const { serverUrl, setConfirmMessage } = useAuth();

    // Destructuring server internal error and server validation errors, along with their setter functions from useErrors custom hook.
    const { serverInternalError, setServerInternalError, serverValidationErrors, setServerValidationErrors} = useErrors();

    // Initializing the navigate function from React Router for managing navigation.
    const navigate = useNavigate();

    // Defining form initial values using Formik.
    const formik = useFormik({
        initialValues: {
            description: '',
            location: '',
            image_url: null
        },

        // Linking Yup validation schema to Formik.
        validationSchema: validationSchema,

        // Asynchronous function to handle form submission, creating FormData object and handling file uploads.
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
            
            // Attempt to send the formData to the server via POST request and handle response or errors.
            try {
                const response = await fetch(`${serverUrl}api/addPost`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include' // Includes credentials to ensure cookies are sent with the request.
                });
                const data = await response.json();

                // Errors reset before checking the response.
                setServerInternalError('');
                setServerValidationErrors([]);

                // Handle server responses, updating contexts for errors or successful operation messages.
                if (!response.ok) {
                    if (data.errors) {
                        setServerValidationErrors(data.errors.map(error => error.msg));
                    }

                    if (data.message) {
                        setServerInternalError(data.message);
                    }
                
                } else {
                    setConfirmMessage(data.message);
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

    // Handlers for updating the Formik form state for file input changes.
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
                        <label htmlFor='image_url'>Immagine del post</label>
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
                        <label htmlFor='location'>Luogo</label>
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