window.onload = () => {
    loadAndDisplayEvent()
}

async function loadAndDisplayEvent() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const res = await fetch(`/events/eventDetails/${id}`)
    const data = await res.json()

    let eventStr = `
        <div class="row">
            <div class="edit-button">
                <a href="../eventEdit.html?id=${data.id}">Edit</a>
                <button onclick="deleteEvent(${data.id})">Delete</button>
            </div>
            <div class="col-12 col-md-7 detail">
                <h5>meeting point: ${data.event_name}</h5>
                <h5>Date: ${data.date}</h5>
                <h5>Time: ${data.time}</h5>
                <h5>Max number of member: ${data.max_number_of_member}</h5>
                <h5>Joining number of member: </h5>
                <br>
                <p>Details: ${data.detail}</p>
            </div>
            <div class="col-12 col-md-5 detail-img">
                <img src="${data.image}" alt=""><br>
            </div>
        </div>`


    document.getElementById('event-detail-form').innerHTML = eventStr
}


async function deleteEvent(id) {
    const res = await fetch(`/events/deleteEvent/${id}`, {
        method: "DELETE",
    });
    if (res.status === 200) {
        await loadAndDisplayEvent();
    } else {
        const data = await res.json();
        alert(data.message);
    }
}
