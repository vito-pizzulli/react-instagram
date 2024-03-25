// Importing necessary asset.
import loading from '../assets/images/loading.gif';

// Component function that encapsulates the UI for the loading screen.
function Loading() {
    return (
        <div className="loading text-center">
            <img className='mw-100' src={loading} alt="Spinning circle" />
        </div>
    )
}

export default Loading;