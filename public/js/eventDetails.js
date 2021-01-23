window.onload = () => {
    loadAndDisplayEvent()
    addChatroomMessage()
    getChatroomMessage()
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

<<<<<<< HEAD

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
=======
function addChatroomMessage() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const event_id = searchParams.get("id")
    const form = document.getElementById("comment-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formData = new FormData
        formData.append("comment", form.comment.value)
        formData.append("event_id", event_id)
        let res = await fetch("/chatroom/addMessage", {
            method: "POST",
            body: formData
        })
        let result = await res.json()
        console.log(result)
    })
}

async function getChatroomMessage() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const event_id = searchParams.get("id")

    const res = await fetch(`/chatroom/getMessage/${event_id}`)
    const datas = await res.json()
    const showComments = document.getElementById("showComments")

    let c = 0
    for (let data of datas) {
        if (c % 2 === 0) {
            showComments.innerHTML += `
                <div class="col-12 col-md-10 comment">
                    <p>Comment:${data.content}</p>
                </div>
            `
        } else {
            showComments.innerHTML += `
                <div class="col-12 col-md-9 comment">
                    <p>Comment:${data.content}</p>
                </div>
            `
        }
    }
}
>>>>>>> bd69b9a1bc8603cf62fa413701290af252eeb29f
