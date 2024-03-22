// Importing necessary asset.
import loading from '../assets/images/loading.gif';

// Component function that encapsulates the UI for the loading screen.
function Loading() {
    return (
        <div className="loading text-center">
            <img src={loading} alt="Spinning circle" />
        </div>
    )
}

export default Loading;