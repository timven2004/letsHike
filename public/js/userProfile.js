console.log("userprofile js connected")

const profilePic = document.querySelector(".profilePic");
const username = document.querySelector("#username");
const rating = document.querySelector("#rating");
const level = document.querySelector("#level");
const userIntro = document.querySelector("#UserIntroduction");
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

response.json().then(result=>{console.log(result);
  profilePic.setAttribute("src", `/assets/UserProfile/${(result).user_icon}`);
  username.innerHTML = (result).user_name;
  rating.innerHTML = `Rating: ${result.rating}/5.0`
  level.innerHTML= "Skills Level: "+ result.level;
  email.innerHTML = result.email;
  gender.innerHTML = result.gender;
  experience.innerHTML = `${result.experience} experience point accumulated`
  userIntro.innerHTML = result.introduction;
})

  

}

