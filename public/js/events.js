window.onload = () => {
    loadAndDisplayEvents();
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()

    let eventsStr = ``
    for (const event of data) {
        eventsStr += `
        <div class="event" onclick="">
            <img src=${data.image} alt="">
            <p>${data.event_name}</p>
        </div>
        `
    }

    document.querySelector('.events').innerHTML = eventsStr
}
