import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyABpF5Aq3pvwYfqSGd4A1LfyhjgKApnFmE",
    authDomain: "test-project-2b.firebaseapp.com",
    projectId: "test-project-2b",
    storageBucket: "test-project-2b.appspot.com",
    messagingSenderId: "545460196890",
    appId: "1:545460196890:web:c8718f9b0776412ddaa3a3",
    measurementId: "G-24X003ETZV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const username  = document.querySelector("#username");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const uemail = user.email;
        username.innerText = `Welcome ${uemail}`
    } else {
        location.href = "../signup/signup.html";
    }
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(()=> {
        location.href = "../signup/signup.html";
    })
})