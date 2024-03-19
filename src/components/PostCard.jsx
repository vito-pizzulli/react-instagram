import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../assets/styles/PostCard.module.scss';

function PostCard({image_url, username, slug}) {
    const { serverUrl } = useAuth();

    return (
        <div className={`${styles.postCard} col-3 ratio-1x1 mb-4`}>
            <Link to={`/${username}/${slug}`}><img className={`${styles.postCardImage} w-100 object-fit-cover`} src={`${serverUrl}${image_url}`} alt="Post Pic" /></Link>
        </div>
    )
};

export default PostCard;