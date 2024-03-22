import styles from '../assets/styles/NotFound.module.scss';
import logo from '../assets/images/logo.png';

function NotFound() {
    return (
        <div className={`${styles.notFound} notFound container-fluid`}>
            <div className="row">
                <div className="col-12 d-flex flex-column align-items-center">
                    <img className='w-25' src={logo} alt="Instagram Logo" />
                    <span className={`${styles.largeWord} fw-bold text-danger`}>404</span>
                    <span className='fw-bold fs-2 mb-5 text-danger'>Not Found</span>
                    <span className='fw-bold fs-4'>Oops! La pagina richiesta non é stata trovata.</span>
                </div>
            </div>
        </div>
    )
}

export default NotFound;