console.log("userprofileSelf js connected")

const profilePic = document.querySelector(".profilePic");
const username = document.querySelector("#username");
const rating = document.querySelector("#rating");
const level = document.querySelector("#level");
const userIntro = document.querySelector("#UserIntroduction");
const email = document.querySelector("#email");
const gender = document.querySelector("#gender");
const experience = document.querySelector("#experience");
const commentCardsHolder = document.querySelector(".commentCardsHolder")

window.onload = async () => {

  const response = await fetch(`/api/v1/userProfile/self`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })

  response.json().then(result => {
    console.log(result);
    profilePic.setAttribute("src", `../${(result).user_icon}`);
    username.innerHTML = (result).user_name;
    rating.innerHTML = `Rating: ${result.rating}/5.0`
    level.innerHTML = "Skills Level: " + result.level;
    email.innerHTML = result.email;
    gender.innerHTML = result.gender;
    experience.innerHTML = `${result.experience} experience point accumulated`
    userIntro.innerHTML = result.introduction;


    let string = ""
    result.comments.forEach(element => {
      string = string +
      `<div class="card" style="width: 20rem;">
        <div class="card-body">
        <h5 class="card-title">${element.single_rating}/5</h5>
        <h6 class="card-subtitle mb-2 text-muted">by ${element.user_name} <span
                id="date">${element.date}</span></span></h6>
        <p class="card-text" >${element.comment}</p>
        </div>
      </div>`

    });
    commentCardsHolder.innerHTML=string;

  })

}

  



