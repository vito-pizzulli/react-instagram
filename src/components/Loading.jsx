import loading from '../assets/images/loading.gif';

function Loading() {
    return (
        <div className="loading text-center">
            <img src={loading} alt="Spinning circle" />
        </div>
    )
}

export default Loading;