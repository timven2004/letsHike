window.onload = () => {
    createEventFormSubmit()
}

function createEventFormSubmit() {
    const form = document.getElementById("create-event-form")
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formObject = {}
        formObject["event_name"] = form.event_name.value
        formObject["meeting_point"] = form.meeting_point.value
        formObject["date"] = form.date.value
        formObject["time"] = form.time.value
        formObject["max_number_of_member"] = parseInt(form.max_number_of_member.value)
        formObject["hiking_trail_id"] = parseInt(form.hiking_trail_id.value)
        formObject["detail"] = form.detail.value

        const eventDate = new Date(form.date.value)
        const now = new Date()
        console.log(eventDate - now)
        if(eventDate - now < 0){
            console.log("date past")
            return
        }

        const res = await fetch("/events/createEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)

        })
        let id = await res.json();
        console.log(id)
        if (res.status === 200) {
            window.location = `/eventDetails.html?id=${id}`
        }
        console.log(formObject)
    })
}