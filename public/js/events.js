window.onload = async () => {
    loadAndDisplayEvents()
    showCreateEventBtnChecking()
    showProfileNavbar()
    logOut()
    checkRatingRemember()
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()

    let eventsStr = ``
    for (const event of data) {
        eventsStr += `
        <div class="col-12 col-md-6 col-lg-4 effect">
            <a href="/eventDetails.html?id=${event.id}"><img src="${event.image}" alt=""></a>
            <h2>${event.event_name}</h2>
        </div>
    `
    }

    document.getElementById('events-wrapper').innerHTML = eventsStr
}


async function easy() {
    const res = await fetch('/events')
    const data = await res.json()

    const a = data.filter(trail => trail.hardness < 3)

    let hardeventsStr = ``
    for (const event of a) {
        if (event.is_active === true) {
            hardeventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html?id=${event.id}"><img src="${event.image}" alt=""></a>
                <h2>${event.event_name}</h2>
            </div>
        `
        }
    }
    document.getElementById('events-wrapper').innerHTML = hardeventsStr
}
async function medium() {
    const res = await fetch('/events')
    const data = await res.json()

    const a = data.filter(trail => trail.hardness == 3)

    let hardeventsStr = ``
    for (const event of a) {
        if (event.is_active === true) {
            hardeventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html?id=${event.id}"><img src="${event.image}" alt=""></a>
                <h2>${event.event_name}</h2>
            </div>
        `
        }
    }
    document.getElementById('events-wrapper').innerHTML = hardeventsStr
}

async function hard() {
    const res = await fetch('/events')
    const data = await res.json()

    const a = data.filter(trail => trail.hardness > 3)

    let hardeventsStr = ``
    for (const event of a) {
        if (event.is_active === true) {
            hardeventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html?id=${event.id}"><img src="${event.image}" alt=""></a>
                <h2>${event.event_name}</h2>
            </div>
        `
        }
    }
    document.getElementById('events-wrapper').innerHTML = hardeventsStr
}

//NavBar
async function showProfileNavbar() {
    const res = await fetch("/api/v1/userLoggedIn")
    const data = await res.json()
    console.log(data)

    if (data !== 'noLogin') {
        document.getElementById('hidden-propfile').innerHTML = '<a href="./userProfileSelf.html">My profile</a>';
        document.getElementById('logout').innerHTML = '<a href="">Logout</a>'
        document.getElementById('show-username').innerHTML = '<a id="username" onclick="shownotice()">notice</a>'

    } else {
        document.getElementById('login').innerHTML = '<a href="/login.html">Login/Sign up</a>'
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


async function showCreateEventBtnChecking() {
    const res = await fetch("/api/v1/getUserData")
    const data = await res.json()

    if (data.level >= 3) {
        document.querySelector('.add-event-btn').innerHTML = '<a href="/goCreateEventPage">Create Event</a>'
    }
}

async function checkRatingRemember() {
    const data = await fetch("/ratingOthers/checkRatingRemember")
    const events = await data.json()
    if (events.message === "Don't Login") {
        return
    }
    for (const event of events) {
        console.log(event)
        const remember = document.getElementById("remember")
        remember.innerHTML += `
            <div id="${event.id}">
                <a href="ratingOthers.html?eventId=${event.id}"></a>
                <a onclick="neverShowRemember(${event.id})">Never Show</a>
            </div>
        `
    }
}

async function neverShowRemember(event_id) {
    const res = await fetch(`/neverShowRemember/${event_id}`,{
        method:"PUT"
    })
    if(res.status!==200){
        console.log("???")
        return
    }
    document.getElementById(event_id).innerHTML = ""
}




async function weatherApi() {
    const api = await fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
    const data = await api.json()
    console.log(data)

    

}
weatherApi()
