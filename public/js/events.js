window.onload = () => {
    loadAndDisplayEvents();
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()

    let eventsStr = ``
    for (const event of data) {
        eventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html?id=${event.id}"><img src=${event.image} alt=""></a>
                <h2>${event.event_name}</h2>
            </div>
        `
    }

    document.getElementById('events-wrapper').innerHTML = eventsStr
}
