
window.onload = () => {
    getNewChatroomMessage()
    loadAndDisplayEvent()
    userJoiningEventData()
    addChatroomMessage()
    getChatroomMessage()
    userJoinEvent()
    logOut()
}

async function loadAndDisplayEvent() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const res = await fetch(`/events/eventDetails/${id}`)
    const data = await res.json()

    let eventStr = `
        <div class="row">
            <div class="col-12">
                <h1>${data.event_name}</h1>
                <img src="${data.image}" alt="">
            </div>
        </div>
        <div id="event-detail-form">
            <div class="row">
            <div class="edit-button"></div>
            <div class="col-12 col-md-7 detail">
                <h5>meeting point: ${data.meeting_point}</h5>
                <h5>Date: ${data.date}</h5>
                <h5>Time: ${data.time}</h5>
                <h5>Max number of member: ${data.max_number_of_member}</h5>
                <h5>Joining number of member:${data.joining_number_of_member} </h5>
                <br>
                <p>Details: ${data.detail}</p>
            </div>
            <div class="col-12 col-md-5 detail-img">
                <img src="${data.image}" alt=""><br>
            </div>
            </div>
        </div>`

    document.getElementById('eventDetails-wrapper').innerHTML = eventStr

    const resForCheckUserIsOrganizer = await fetch(`/users/checkUserIsOrganizer/${id}`)
    const result = await resForCheckUserIsOrganizer.json()
    if (result) {
        let editButton = document.querySelector(".edit-button")
        editButton.innerHTML = `
            <a href="/eventEdit.html?id=${id}">Edit</a>
            <button onclick="deleteEvent(${id})">Delete</button>
        `
    }
}

async function userJoiningEventData() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const res = await fetch(`/events/userJoiningEvent/${id}`)
    const data = await res.json()

    let joiningMemberStr = ``
    for (const joiningMember of data) {
        joiningMemberStr += `
        <div class="col-12">
            <p>${joiningMember.user_name}</p>
        </div>`
    }

    document.getElementById('joiningMember').innerHTML = joiningMemberStr
}

async function deleteEvent(id) {
    const res = await fetch(`/events/deleteEvent/${id}`, {
        method: "DELETE",
    });
    if (res.status === 200) {
        await loadAndDisplayEvent();
        window.location = `/events.html`
    } else {
        const data = await res.json();
        alert(data.message);
    }
}

function addChatroomMessage() {
    const socket = io.connect()
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
        if (res.status === 200) {
            socket.emit("newMessage", `${result}`)
        }
    })
}

async function getChatroomMessage() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const event_id = searchParams.get("id")

    const res = await fetch(`/chatroom/getMessage/${event_id}`)
    const datas = await res.json()
    const showComments = document.getElementById('show-comment-form')

    for (let data of datas) {
        const msgDate = moment(data.date).format('YYYY-MM-DD h:mm:ss a');

        showComments.innerHTML += `
            <div class="col-12 col-md-10 comment">
                <a href="/userProfileSelf.html">${data.user_name}:</a>
                <p>${data.content}</p>
                <p>${msgDate}</p>
            </div>
        `
    }
}

async function userJoinEvent() {
    // Check organizer
    const res = await fetch("/checkEventOrganizer")
    const result = await res.json()
    console.log(result)
    if (result === true) {
        document.querySelector("div.join").innerHTML = ""
        return
    }

    // Join event
    const join = document.querySelector("div.join > a")
    join.addEventListener("click", async (event) => {
        event.preventDefault()
        const paramString = window.location.search
        const searchParams = new URLSearchParams(paramString)
        const event_id = searchParams.get("id")
        const res = await fetch("/userJoinEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "event_id": event_id })
        })
        const result = await res.json()
        // User don't login
        if (res.status === 400) {
            console.log("hi")
            window.location.assign("http://localhost:8080/login.html")
        }

        const joinResult = document.getElementById("joinResult")
        joinResult.innerText = result
    })
}

function getNewChatroomMessage() {
    const socket = io.connect()
    socket.on("newMessage", data => {
        const showComments = document.querySelector(".show-comment")
        showComments.innerHTML += `
            <div class="col-12 col-md-10 comment">
                <p>${data.content}</p>
            </div>
        `
    })
}

//Nav-bar
async function hiddenProfileNavbar() {
    const res = await fetch("/api/v1/userLoggedIn")
    const data = await res.json()

    if (data === 'undefined') {
        document.getElementById('hidden-propfile').innerHTML = '';
    }
}

//logout
function logOut() {
    const logOut = document.getElementById('logout')
    logOut.addEventListener("click", async (e) => {
        e.preventDefault()
        const res = await fetch("/api/v1/logout")
        if (res.status === 200) {
            window.location = '/events.html'
        }
    })
}
