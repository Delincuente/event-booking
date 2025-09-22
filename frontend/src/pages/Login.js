import React, { use, useState } from 'react';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = () => {
        alert(email + ' ' +password);
    };

    return (
        <div style={{ margin: '0 auto', width: '20%' }}>
            <h1>Login</h1>
            <div>
                <label>Email:</label>
                <input type='email'
                    onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <div>
                <label>Password:</label>
                <input type='password'
                    onChange={(e) => { setPassword(e.target.value) }} />
            </div>
            <div>
                <button onClick={onLogin}>LOGIN</button>
            </div>
        </div>
    )
}

export default Login