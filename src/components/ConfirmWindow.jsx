import styles from '../assets/styles/ConfirmWindow.module.scss';

function ConfirmWindow({ message, setIsConfirmed, setConfirmWindowVisible }) {

    function handleConfirm() {
        setIsConfirmed(true);
        setConfirmWindowVisible(false);
    }

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