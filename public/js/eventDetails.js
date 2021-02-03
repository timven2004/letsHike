window.onload = () => {
    const socket = io.connect();
    socket.on('delMessage', (id) => {
        document.getElementById(`chatmsg${id}`).remove();
    });
    getNewChatroomMessage();
    loadAndDisplayEvent();
    userJoiningEventData();
    addChatroomMessage();
    getChatroomMessage();
    userJoinEvent();
    showProfileNavbar();
    logOut();
};

async function loadAndDisplayEvent() {
    const paramString = window.location.search;
    const searchParams = new URLSearchParams(paramString);
    const id = searchParams.get('id');

    const res = await fetch(`/events/eventDetails/${id}`);
    const data = await res.json();

    let eventStr = `
        <div class="row">
            <div class="col-12">
                <h1>${data.event_name}</h1>
            </div>
        </div>
        <div id="event-detail-form">
            <div class="row">
            <div class="edit-button"></div>
            <div class="col-12 col-md-6 detail">
                <h4>Hardness: ${data.hardness}</h4>
                <h4>Organizer: ${data.user_name}</h4>
                <h5>meeting point: ${data.meeting_point}</h5>
                <h5>Date: ${data.date}</h5>
                <h5>Time: ${data.time}</h5>
                <h5>Max number of member: ${data.max_number_of_member}</h5>
                <h5 id="joinNumber">Joining number of member:${data.joining_number_of_member} </h5>
                <br>
                <p>Details: ${data.detail}</p>
            </div>
            <div class="col-12 col-md-6 detail-img">
                <img src="${data.image}" alt=""><br>
            </div>
            </div>
        </div>`;

    document.getElementById('eventDetails-wrapper').innerHTML = eventStr;

    const resForCheckUserIsOrganizer = await fetch(
        `/users/checkUserIsOrganizer/${id}`
    );
    const result = await resForCheckUserIsOrganizer.json();
    if (result) {
        let editButton = document.querySelector('.edit-button');
        editButton.innerHTML = `
            <a href="/eventEdit.html?id=${id}">Edit</a>
            <button onclick="deleteEvent(${id})">Delete</button>
        `;
    }
}

async function userJoiningEventData() {
    const paramString = window.location.search;
    const searchParams = new URLSearchParams(paramString);
    const id = searchParams.get('id');

    const res = await fetch(`/events/userJoiningEvent/${id}`);
    const data = await res.json();

    let joiningMemberStr = ``;
    for (const joiningMember of data) {
        joiningMemberStr += `<p>${joiningMember.user_name}</p>`;
    }

    document.getElementById('joiningMember').innerHTML = joiningMemberStr;
}

async function deleteEvent(id) {
    const res = await fetch(`/events/deleteEvent/${id}`, {
        method: 'DELETE',
    });
    if (res.status === 200) {
        await loadAndDisplayEvent();
        window.location = `/events.html`;
    } else {
        const data = await res.json();
        alert(data.message);
    }
}

function addChatroomMessage() {
    const socket = io.connect();
    const paramString = window.location.search;
    const searchParams = new URLSearchParams(paramString);
    const event_id = searchParams.get('id');
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('comment', form.comment.value);
        formData.append('event_id', event_id);
        let res = await fetch('/chatroom/addMessage', {
            method: 'POST',
            body: formData,
        });
        let result = await res.json();
        console.log(result);
        if (res.status === 200 && result !== 'no login') {
            socket.emit('newMessage', `${result}`);
        } else if (result === 'no login') {
            window.location = '/login.html';
        }
    });
}

async function getChatroomMessage() {
    const paramString = window.location.search;
    const searchParams = new URLSearchParams(paramString);
    const event_id = searchParams.get('id');

    const res = await fetch(`/chatroom/getMessage/${event_id}`);
    const datas = await res.json();
    const showComments = document.getElementById('show-comment-form');
    const user_id = (await (await fetch('/api/v1/getUserData')).json()).id;

    for (let data of datas) {
        const create_id = data.users_id;
        const newMessageID = data.id;
        const msgDate = moment(data.date).format('YYYY-MM-DD h:mm:ss a');
        // console.log(`user_id=`,user_id,`create_id`,create_id)
        if (user_id !== create_id) {
            showComments.innerHTML += `
                <div class="col-12 col-md-10 comment" id="chatmsg${newMessageID}">
                    <a href="/userProfile/${create_id}">${data.user_name}:</a>
                    <p>${data.content}</p>
                    <p>${msgDate}</p>
                </div>
            `;
        } else {
            showComments.innerHTML += `
                <div class="col-12 col-md-10 comment" id="chatmsg${newMessageID}">
                    <a href="/userProfile/${create_id}">${data.user_name}:</a>
                    <p>${data.content}</p>
                    <p>${msgDate}</p>
                    <a onclick="deleteChatroomMessage(${newMessageID})">-Delete-</a>
                </div>
            `;
        }
    }
}

async function getNewChatroomMessage() {
    const user_id = (await (await fetch('/api/v1/getUserData')).json()).id;

    const socket = io.connect();
    socket.on('newMessage', (data) => {
        const msgDate = moment(data.date).format('YYYY-MM-DD h:mm:ss a');
        const showComments = document.querySelector('.show-comment');
        const newMessageID = data.id;
        const create_id = data.users_id;

        if (user_id !== data.users_id) {
            showComments.innerHTML += `
                <div class="col-12 col-md-10 comment" id="chatmsg${newMessageID}">
                    <a href="/userProfile/${create_id}">${data.user_name}:</a>
                    <p>${data.content}</p>
                    <p>${msgDate}</p>
                </div>
            `;
        } else {
            // console.log(`user_id=`,user_id,`newMessageID=`,newMessageID)
            showComments.innerHTML += `
                <div class="col-12 col-md-10 comment" id="chatmsg${newMessageID}">
                    <a href="/userProfile/${create_id}">${data.user_name}:</a>
                    <p>${data.content}</p>
                    <p>${msgDate}</p>
                    <a onclick="deleteChatroomMessage(${newMessageID})">-Delete-</a>
                </div>
            `;
        }
    });
}

async function deleteChatroomMessage(id) {
    const res = await fetch(`/deleteChatroomMessage/${id}`, {
        method: 'DELETE',
    });
    const result = await res.json();
}

async function userJoinEvent() {
    const paramString = window.location.search;
    const searchParams = new URLSearchParams(paramString);
    const event_id = searchParams.get('id');
    const join = document.querySelector('div.join > a');

    // User leave function
    const userLeave = async (event) => {
        console.log('userLeave');
        event.preventDefault();
        const resOfUserLeave = await fetch(`/userLeaveEvent/${event_id}`, {
            method: 'DELETE',
        });
        if (resOfUserLeave.status === 200) {
            join.innerHTML = 'JOIN NOW';
            join.removeEventListener('click', userLeave);
            join.addEventListener('click', userJoin);
            updateJoiningNumber();
            userJoiningEventData();
        }
    };

    // User Join function
    const userJoin = async (event) => {
        console.log('userJoin');
        event.preventDefault();
        const paramString = window.location.search;
        const searchParams = new URLSearchParams(paramString);
        const event_id = searchParams.get('id');
        const res = await fetch(`/userJoinEvent/${event_id}`);
        const result = await res.json();
        // User don't login
        if (res.status === 400) {
            // window.location.assign("http://localhost:8080/login.html")
            window.location = '/login.html';
        }
        join.innerHTML = 'leave';
        join.removeEventListener('click', userJoin);
        join.addEventListener('click', userLeave);
        updateJoiningNumber();
        userJoiningEventData();
    };

    // Check organizer
    checkOrganizer();
    async function checkOrganizer() {
        const paramString = window.location.search;
        const searchParams = new URLSearchParams(paramString);
        const id = searchParams.get('id');
        const res = await fetch(`/checkEventOrganizer/${id}`);
        const result = await res.json();
        // console.log(result)
        if (result === true) {
            document.querySelector('div.join').innerHTML = '';
            return;
        }
    }

    // Check user have been join
    checkUserJoin();
    async function checkUserJoin() {
        const res = await fetch(`/checkUserHaveBeenJoin/${event_id}`);
        const result = await res.json();
        if (result === "don't login") {
            // console.log("don't login")
        }
        // User leave
        if (result && res.status === 200 && result !== "don't login") {
            // console.log("userJoin")
            join.innerHTML = 'leave';
            join.addEventListener('click', userLeave);
            return;
        } else {
            // Join event
            // console.log("userNotJoin")
            join.innerHTML = 'JOIN NOW';
            join.addEventListener('click', userJoin);
        }
    }

    async function updateJoiningNumber() {
        const joinNumber = document.getElementById('joinNumber');
        const data = await fetch(`/getJoiningNumber/${event_id}`);
        const numberOfJoining = await data.json();
        joinNumber.innerHTML = `Joining number of member:${numberOfJoining} `;
    }
}

//NavBar
async function showProfileNavbar() {
    const res = await fetch('/api/v1/userLoggedIn');
    const data = await res.json();

    if (data !== 'noLogin') {
        document.getElementById(
            'hidden-propfile'
        ).innerHTML = `<a href="/userProfile/${data}">My profile</a>`;
        document.getElementById('logout').innerHTML = '<a href="">Logout</a>';
    } else {
        document.getElementById('login').innerHTML =
            '<a href="/login.html">Login</a>';
    }
}

function logOut() {
    const logOut = document.getElementById('logout');
    logOut.addEventListener('click', async (e) => {
        e.preventDefault();
        const res = await fetch('/api/v1/logout');
        if (res.status === 200) {
            window.location = '/events.html';
        }
    });
}
