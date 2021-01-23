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

console.log(currentURL)

window.onload = async()=>{

    const res = await fetch('/ratingOthers/api/1',
    {
    method: "GET", // Specific your HTTP method
    headers: {
        // Specify any HTTP Headers Here
        "Content-Type": "application/json; charset=utf-8"
    }})

    res.json().then(result=>{
        username.innerHTML = result.user_name;
        eventDescription.innerHTML = result.detail;
        userLevel.innerHTML = result.level;
        userRating.innerHTML = result.rating;
        numberOfEventsJoined.innerHTML=result.experience;
    })

    }

for (let i=0;i<stars.length;i++){
    stars[i].addEventListener("click", ()=>{
        hiddenNumber.value=`${5-i}`
        for (let j=i;j<stars.length;j++){
        stars[j].innerHTML="★"
        }
        for (let k=i;k>=0;k--)
        stars[k].innerHTML="☆"
    })
}


