// Importing necessary hooks and styles.
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../assets/styles/PostCard.module.scss';

// Component function that encapsulates the logic and UI for the single post card element dynamically generates by its parent component.
function PostCard({image_url, username, slug}) {

    // Destructuring server url from useAuth custom hook.
    const { serverUrl } = useAuth();

    return (
        <div className={`${styles.postCard} col-6 col-md-4 col-lg-3 ratio-1x1 mb-4`}>
            <Link to={`/${username}/${slug}`}><img className={`${styles.postCardImage} w-100 object-fit-cover`} src={`${serverUrl}${image_url}`} alt="Post Pic" /></Link>
        </div>
    )
};

export default PostCard;