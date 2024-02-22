import '../style.css';

function Registration() {
    return (
        <div className='registration'>
            <form action="" method='POST'>
                <label htmlFor="email">Email</label>
                <input type="text" name='email' />
                <label htmlFor="email">Password</label>
                <input type="text" name='password' />
                <label htmlFor="email">Username</label>
                <input type="text" name='username' />
                <label htmlFor="email">Nome</label>
                <input type="text" name='firstname' />
                <label htmlFor="email">Cognome</label>
                <input type="text" name='lastname' />
            </form>
        </div>
    )
}

export default Registration;