window.onload = () => {
    loadAndDisplayEvents();
}

async function loadAndDisplayEvents() {
    const res = await fetch('/events')
    const data = await res.json()
    console.log(data)

    let eventsStr = `
        <div class="event">
            <img src=${data.image} alt="">
            <p>${data.event_name}</p>
        </div>`

    document.querySelector('.events').innerHTML = eventsStr
    // console.log(document.querySelector('.events'))

}
