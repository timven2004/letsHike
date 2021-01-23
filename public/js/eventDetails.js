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