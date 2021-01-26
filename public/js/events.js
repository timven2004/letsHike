window.onload = () => {
    hiddenProfileNavbar()
    loadAndDisplayEvents()
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()


    let eventsStr = ``
    for (const event of data) {
        if (event.is_active === true) {
            eventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html?id=${event.id}"><img src="${event.image}" alt=""></a>
                <h2>${event.event_name}</h2>
            </div>

        `
        }
    }
    document.getElementById('events-wrapper').innerHTML = eventsStr
}

//Nav-bar
async function hiddenProfileNavbar() {
    const res = await fetch("/api/v1/userLoggedIn")
    const data = await res.json()

    if (data === 'notLoggedIn') {
        document.getElementById('hidden-propfile').innerHTML = '';
    }
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

async function hard() {
    const res = await fetch('/events')
    const data = await res.json()

    const a = data.filter(trail => trail.hardness >= 3)

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
