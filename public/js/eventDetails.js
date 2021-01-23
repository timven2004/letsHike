window.onload = () => {
    loadAndDisplayEvent()
    addChatroomMessage()
}

async function loadAndDisplayEvent() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const res = await fetch(`/events/eventDetails/${id}`)
    const data = await res.json()

    let eventStr = `
        <div class="row">
            <div class="col-12 col-md-5 detail">
                <h5>meeting point: ${data.event_name}</h5>
                <h5>Date: ${data.date}</h5>
                <h5>Time: ${data.time}</h5>
                <h5>Max number of member: ${data.max_number_of_member}</h5>
                <h5>Joining number of member: </h5>
            </div>
            <div class="col-12 col-md-5 detail">
                <p>Details: ${data.detail}</p>
            </div>
        </div>`


    document.getElementById('event-detail-form').innerHTML = eventStr
}

function addChatroomMessage() {
    const paramString = window.location.search
    const serachParams = new URLSearchParams(paramString)
    const id = serachParams.get("id")
    const form = document.getElementById("comment-form")
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const formData = new FormData
        formData.append("comment", form.comment.value)
        formData.append("event_id", id)
        let res = await fetch("/chatroom/addMessage", {
            method: "POST",
            body: formData
        })
        let result = await res.json()
        console.log(result)
    })
}