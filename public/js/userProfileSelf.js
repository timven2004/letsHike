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
const notYetRateCardsHolder = document.querySelector(".notYetRateCardsHolder")


window.onload = async () => {

  const response = await fetch(`/api/v1/userProfile/self`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })

  const notYetRate = await fetch(`/ratingOthers/checkRatingRememberUserProfile`,{
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })

  let rateString = "";


  notYetRate.json().then(result =>{
    console.log(result);

  for (notYetRatedEvent of result[0]){
    console.log(notYetRatedEvent)
    rateString = rateString + 
  `<div class="card" style="width: 20rem;">
  <div class="card-body">
  <h5 class="card-title"> <a href="/ratingOthers.html?eventId=${notYetRatedEvent.id}"> ${notYetRatedEvent.event_name} </a></h5>
  <h6 class="card-subtitle mb-2 text-muted">by <a href=userProfile/${notYetRatedEvent.organizer}>${notYetRatedEvent.user_name}</a> <span
          id="date">${new Date(notYetRatedEvent.date).toLocaleDateString()}</span></h6>
  <p class="card-text" >${notYetRatedEvent.detail}</p>
  </div>
</div>`};

notYetRateCardsHolder.innerHTML = rateString;
})



  response.json().then(result => {

    if(isNaN(result.rating)||result.rating==null){result.rating="N/A"}

    profilePic.setAttribute("src", `../${(result).user_icon}`);
    username.innerHTML = (result).user_name;
    rating.innerHTML = `Rating: ${result.rating} ${result.rating=="N/A"?"":"/5.0"}`
    level.innerHTML = "Skills Level: " + result.level;
    email.innerHTML = "Email: " + result.email;
    gender.innerHTML = "Gender: " + result.gender;
    experience.innerHTML = `${result.experience} experience point accumulated`
    userIntro.innerHTML = "Introduction:<br>" + result.introduction;


    let string = ""
    result.comments.forEach(element => {
      string = string +
        `<div class="card" style="width: 20rem;">
        <div class="card-body">
        <h5 class="card-title">${element.single_rating}/5</h5>
        <h6 class="card-subtitle mb-2 text-muted">by <a href="/userProfile/${element.users_id}">${element.user_name} <span
                id="date"></a>${new Date(element.date).toLocaleDateString()}</span></h6>
        <p class="card-text" >${element.comment}</p>
        </div>
      </div>`

    });
    commentCardsHolder.innerHTML = string;

  })
  showProfileNavbar()
  logOut()
}


//NavBar
async function showProfileNavbar() {
  const res = await fetch("/api/v1/userLoggedIn")
  const data = await res.json()

  if (data !== 'noLogin') {
    document.getElementById('hidden-propfile').innerHTML = '<a href="./userProfileSelf.html">My profile</a>';
    document.getElementById('logout').innerHTML = '<a href="">Logout</a>'
  } else {
    document.getElementById('login').innerHTML = '<a href="/login.html">Login</a>'
  }
}

function logOut() {
  const logOut = document.getElementById('logout')
  logOut.addEventListener("click", async (e) => {
    e.preventDefault()
    const res = await fetch("/api/v1/logout")
    if (res.status === 200) {
      window.location = '/events.html'
    }
  })
}