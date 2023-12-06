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

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";


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
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

let usersName;
let usersEmail;
let usersRef;

// get usernameDiv
const usernameDiv = document.querySelector('#uptName');
// get useremailDiv
const useremailDiv = document.querySelector('#uptEmail');
const profileImg = document.querySelector('.profileImg');
let userUid;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // give reference of the User
        usersRef = doc(db, "users", user.uid);
        // get the details of the user
        const userSnap = await getDoc(usersRef);
        // get user all data
        const usersData = userSnap.data()

        userUid = user.uid;

        const userRef = doc(db, "users", userUid);

        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && docSnap.data().imgUrl) {
            const userImgUrl = docSnap.data().imgUrl;
            profileImg.src = userImgUrl;
        }

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
const profileImgInputDiv = document.querySelector(".profileImgInputDiv");
const profileImgInput = document.querySelector("#profileImgInput");
const profileImgLabel = document.getElementById('profileImgLabel');

profileImgLabel.addEventListener('click', () => {
    profileImgInput.click();
});


profileImgInput.addEventListener('change', () => {
    if (profileImgInput.files.length > 0) {
        profileImgBtn.disabled = false;
        profileImgBtn.style.display = "block";
    }
});

const downloadImageUrl = (file) => {
    return new Promise((resolve, reject) => {
        const profileImagesRef = ref(storage, `images/${file.name}/`);
        const uploadTask = uploadBytesResumable(profileImagesRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        );
    });
};

profileImgBtn.addEventListener('click', async () => {
    const file = profileImgInput.files[0];

    if (file.type.startsWith('image/')) {
        try {
            const imgUrl = await downloadImageUrl(file);

            const userRef = doc(db, "users", userUid);

            await updateDoc(userRef, {
                imgUrl
            });

            profileImg.src = imgUrl;

            // profileImgInputDiv.style.display = "none"


            Swal.fire({
                title: "Good job!",
                text: "Picture uploaded successfully!",
                icon: "success"
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please upload an image!',
        });
    }
});
