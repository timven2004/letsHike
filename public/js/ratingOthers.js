const username = document.querySelector("#username")
const eventDescription = document.querySelector("#eventDescription")
const userLevel = document.querySelector("#userLevel")
const userRating = document.querySelector("#userRating")
const numberOfEventsJoined = document.querySelector("#numberOfEventsJoined")
const ratingStars = document.querySelector("#ratingStars")
const commentText = document.querySelector("#commentText")
const currentURL = window.location.href;
const stars = document.querySelectorAll(".star")
const hiddenNumber = document.querySelector(".hidden")
const date = document.querySelector("#date")
const form = document.querySelector("#form")
const params = new URLSearchParams(document.location.search.substring(1))
const eventId = params.get("eventId")
const userToBeRated =document.querySelector("#userToBeRated")

console.log(currentURL)
console.log(eventId)
console.log(userToBeRated)
// URL example http://localhost:8080/ratingOthers.html?eventId=1//

window.onload = async()=>{
    const res = await fetch(`/ratingOthers/api/${eventId}`,
    {
    method: "GET", // Specific your HTTP method
    headers: {
        // Specify any HTTP Headers Here
        "Content-Type": "application/json; charset=utf-8"
    }})

    res.json().then(result=>{
        console.log(result)
        userToBeRated.setAttribute('href', `/UserProfile/${result.organizer}`);
        username.innerHTML = result.user_name;
        eventDescription.innerHTML = result.detail;
        userLevel.innerHTML = result.level;
        userRating.innerHTML = result.rating;
        numberOfEventsJoined.innerHTML=result.experience;
        date.innerHTML=result.date.toLocaleDateString("en-US");
    })
    }

for (let i=0;i<stars.length;i++){
    stars[i].addEventListener("click", ()=>{
        hiddenNumber.value=`${5-i}`

        for (let j=i;j<stars.length;j++){
        stars[j].innerHTML="★"
        }
        for (let k=i-1;k>=0;k--)
        stars[k].innerHTML="☆"
    })
}

form.setAttribute("action",`/ratingOthers/api/${eventId}`);

