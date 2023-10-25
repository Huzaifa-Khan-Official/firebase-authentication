import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDocs,
    collection
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


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
const db = getFirestore(app);

let sbtn = document.querySelector("#sbtn"); // get signin btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph


sbtn.addEventListener("click", () => {
    let semail = document.querySelector("#semail"); // get email to signin user
    let spassword = document.querySelector("#spassword"); // get password to signin user
    let sname = document.querySelector("#sname");  // get name of a user
    let userData = {
        sname: sname.value,
        semail: semail.value,
        spassword: spassword.value
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, userData.semail, userData.spassword)
        .then(async (userCredential) => {
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                ...userData,
                userid: user.uid
            });
            location.href = "../login/login.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        });
})

spassword.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        sbtn.click()
    }
})

// get all data

// let getAllUsers = async () => {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     querySnapshot.forEach((doc) => {
//         console.log("User Data", doc.data());
//     });
// }

// getAllUsers()