import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    deleteUser,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let usersName;
let usersEmail;
let usersRef;

// get usernameDiv
const usernameDiv = document.querySelector('#uptName');
// get useremailDiv
const useremailDiv = document.querySelector('#uptEmail');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // give reference of the User
        usersRef = doc(db, "users", user.uid);
        // get the details of the user
        const userSnap = await getDoc(usersRef);
        // get user all data
        const usersData = userSnap.data()

        usersName = usersData.sname; // get the user name
        usersEmail = usersData.semail; // get the user name 

        usernameDiv.value = usersName
        useremailDiv.value = usersEmail
    } else {
        localStorage.removeItem("userUid")
        location.href = "../signup/signup.html";
    }
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(() => {
        location.href = "../signup/signup.html";
    })
})


// get updBtn
const updBtn = document.querySelector('#updBtn');
// get errorPara
const errorPara = document.querySelector('#errorPara');
// get successPara
const successPara = document.querySelector('#successPara');
// get delBtn
const delBtn = document.querySelector('#delBtn');



updBtn.addEventListener("click", async () => {
    if (usernameDiv.value == "") {
        errorPara.innerText = "Please fill the name field";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else if (usernameDiv.value == usersName) {
        errorPara.innerText = "Can not update previous name";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else {
        const upedName = usernameDiv.value;
        try {
            await updateDoc(usersRef, {
                sname: upedName
            });
            successPara.innerText = "Successfully Updated!";
            setTimeout(() => {
                successPara.innerHTML = "";
            }, 3000);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        }

    }
});


delBtn.addEventListener("click", async () => {
    try {
        await deleteDoc(doc(db, "users", localStorage.getItem("userUid"))); // deleted data of user from firestore.          
        deleteUser(auth.currentUser).then(() => {
            successPara.innerText = "Successfully deleted your account!";
            setTimeout(() => {
                successPara.innerHTML = "";
            }, 3000);
            localStorage.removeItem("userUid")
            location.href = "../signup/signup.html"
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = errorCode.slice(5).toUpperCase();
        const errMessage = errorMessage.replace(/-/g, " ")
        errorPara.innerText = errMessage;
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    }
})

const profileImgBtn = document.querySelector(".profileImgBtn");

profileImgBtn.addEventListener("click", () => {
    const profileImgInput = document.querySelector("#profileImgInput");
    const file = profileImgInput.files[0];
    if (file.type.startsWith('image/')) {
        console.log(file);
        // profileImgInput.sytle.display = "none"
        Swal.fire({
            title: "Good job!",
            text: "Pictue uploaded successfully!",
            icon: "success"
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please upload an image!"
        });
    }
})