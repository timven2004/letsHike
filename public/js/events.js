window.onload = async () => {
    loadAndDisplayEvents()
    showCreateEventBtnChecking()//error here
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


async function showCreateEventBtnChecking() {
    const res = await fetch("/api/v1/getUserData")
    const data = await res.json()

    console.log(data)
    if (data.level >= 3) {
        document.querySelector('.add-event-btn').innerHTML = '<a href="/goCreateEventPage">Create Event</a>'
    }
}

//NavBar
async function showProfileNavbar() {
    const res = await fetch("/api/v1/userLoggedIn")
    const data = await res.json()
    console.log(data)

    if (data !== 'noLogin') {
        document.getElementById('hidden-propfile').innerHTML = '<a href="./userProfileSelf.html">My profile</a>';
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
<<<<<<< HEAD
=======
}


async function showCreateEventBtnChecking() {
    const res = await fetch("/api/v1/getUserData")
    const data = await res.json()

    // console.log(data)
    if (data.level >= 3) {
        document.querySelector('.add-event-btn').innerHTML = '<a href="/goCreateEventPage">Create Event</a>'
    }
}

async function checkRatingRemember(){
    const data = await fetch("/checkRatingRemember")
    const events_id = await data.json()
    for(const event_id of events_id){
        console.log(event_id)
    }
>>>>>>> 86e752ac1a53310f5dad10655fda9f8f260dcddb
}