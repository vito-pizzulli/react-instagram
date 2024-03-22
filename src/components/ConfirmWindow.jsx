// Importing necessary styles.
import styles from '../assets/styles/ConfirmWindow.module.scss';

// Component function that encapsulates the logic and UI for the confirm window.
function ConfirmWindow({ message, setIsConfirmed, setConfirmWindowVisible }) {

    // Function to set isConfirmed on true and make the confirm window disappear if the user has clicked Yes.
    function handleConfirm() {
        setIsConfirmed(true);
        setConfirmWindowVisible(false);
    }

    // Function to make the confirm window disappear if the user has clicked No or outside the confirm window.
    function handleCancel() {
        setConfirmWindowVisible(false);
    }

    return (
        <div onClick={handleCancel} className={`${styles.confirmWindow} position-absolute z-1 vw-100 vh-100 d-flex justify-content-center align-items-center`}>
            <div onClick={(e) => e.stopPropagation()} className={`${styles.messageContainer} bg-white p-5 rounded-1 d-flex flex-column`}>
                <span className='mb-4 text-center'>{message}</span>
                <div className='d-flex justify-content-center gap-2'>
                    <button className='btn btn-primary fw-semibold border-0' onClick={handleConfirm}>Si</button>
                    <button className='btn btn-primary fw-semibold border-0' onClick={handleCancel}>No</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmWindow;