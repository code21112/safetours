/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// const signup = (email, password, name, passwordConfirm) => {
//     alert(email);
//     alert(password);

// }


export const signup = async (name, email, password, passwordConfirm) => {
    // console.log('IN SIGNUP')
    // console.log(email, password, name, passwordConfirm)

    try {
        // console.log('IN TRY BLOCK')
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', `Welcome ${name}! Your account has been created successfully!`)
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
            // alert('Signed up successfully!')
            // window.setTimeout(() => {
            //     location.assign('/')
            // }, 1500)
        }
    } catch (err) {
        // console.log('IN CATCH BLOCK')
        // alert(err.response.data.message)
        showAlert('error', err.response.data.message)
    }
};

// document.querySelector('.signup-form').addEventListener('submit', e => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const name = document.getElementById('name').value;
//     const passwordConfirm = document.getElementById('passwordConfirm').value;
//     signup(email, password, name, passwordConfirm);
// });