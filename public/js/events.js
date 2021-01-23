window.onload = () => {
    loadAndDisplayEvents();
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()
    console.log(data)

    let eventsStr = ``
    for (const event of data) {
        eventsStr += `
            <div class="col-12 col-md-6 col-lg-4 effect">
                <a href="/eventDetails.html"><img src=${data.image} alt=""></a>
                <h2>${data.event_name}</h2>
            </div>
        `

    }

    document.getElementById('events-wrapper').innerHTML = eventsStr
}
