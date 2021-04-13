// in src/authProvider.js
import decodeJwt from 'jwt-decode';
import { CONSTANTS } from '../Constants';
//import { AUTH_LOGIN } from 'react-admin';

export default {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        const request = new Request(CONSTANTS.PathToLoginController, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ id, memberType }) => {
                console.log('id ' + id);
                //const decodedToken = decodeJwt(token);
                localStorage.setItem('id', id);
                localStorage.setItem('permissions', memberType);
                
                //localStorage.setItem('permissions', decodedToken.permissions);
            });
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('id');
        localStorage.removeItem('permissions');
        //localStorage.removeItem('permissions');
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: error => {
        // ...
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('id') ? Promise.resolve() : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};