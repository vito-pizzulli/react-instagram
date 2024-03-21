import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import 'moment/locale/it';
import styles from '../assets/styles/Post.module.scss';

function Post({username, profile_pic_url, location, image_url, description, created_at}) {
    const { serverUrl } = useAuth();

    function formatDate(date) {
        moment.locale('it');
        return moment(date).format('D MMMM YYYY');
    };

    const formattedDate = formatDate(created_at);

    return (
        <div className={`${styles.post} mb-3`}>
            <div className="row mb-3 align-items-center">
                <div className="col-3 col-xl-1 d-flex justify-content-center">
                    <Link className='text-decoration-none text-black fw-semibold' to={`/${username}`}><img className={`${styles.profilePic} object-fit-cover rounded-circle`} src={`${serverUrl}${profile_pic_url}`} alt="" /></Link>
                </div>
                <div className="col-9 col-xl-11 p-0">
                    <Link className='text-decoration-none text-black fw-semibold' to={`/${username}`}><p className='mb-1'>{username} • <span className='fw-normal'>{formattedDate}</span></p></Link>
                    <p className={styles.location}>{location}</p>
                </div>
            </div>
            
            <div className="row mb-3">
                <div className="col-12">
                    <img className={`${styles.postImage} object-fit-contain`} src={`${serverUrl}${image_url}`} alt="Post Pic" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12">
                    <i className={`${styles.postIcon} fa-regular fa-heart`}></i>
                    <i className={`${styles.postIcon} fa-regular fa-comment`}></i>
                    <i className={`${styles.postIcon} fa-regular fa-paper-plane`}></i>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xxl-7">
                    <p className={styles.description}><span className='fw-semibold'>{username}</span> {description}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xxl-6">
                    <hr />
                </div>
            </div>
        </div>
    )
};

export default Post;