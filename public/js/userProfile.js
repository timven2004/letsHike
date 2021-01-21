console.log("userprofile js connected")

const profilePic = document.querySelector(".profilePic");
const username = document.querySelector("#username");
const rating = document.querySelector("#username");
const level = document.querySelector("#username");
const userIntro = document.querySelector("#userIntroduction");
const email = document.querySelector("#email");
const gender = document.querySelector("#gender");
const experience = document.querySelector("#experience");

window.onload = async ()=>{
    const response = await fetch(`/api/v1/userProfile/self`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
})
console.log(response)

}


