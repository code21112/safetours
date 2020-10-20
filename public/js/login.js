/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const login = (email, password) => {
//     alert(email);
//     alert(password)
// }

export const login = async (email, password) => {
    // console.log('IN LOGIN')
    // console.log(email, password)

    try {
        // console.log('IN TRY BLOCK')
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });

        if (res.data.status === 'success') {
            // alert('Logged in successfully!')
            showAlert('success', 'Logged in successfully!')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        // console.log('IN CATCH BLOCK')
        // alert(err.response.data.message)
        showAlert('error', err.response.data.message)
    }
};


export const logout = async () => {
    try {
        // console.log('IN TRY BLOCK of login.js')
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status === 'success') {
            // window.location.reload(true)
            window.setTimeout(() => {
                location.assign('/')
            }, 400)
        }
        // if (res.data.success === 'success') Location.reload(forcedReload: true)
    } catch (err) {
        // console.log('IN CATCH BLOCK of login.js')
        showAlert('error', 'Error logging out. Try again.')
    }
};

// document.querySelector('.form').addEventListener('submit', e => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
// });