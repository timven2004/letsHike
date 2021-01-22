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

        const res = await fetch("/events/createEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        })
        if (res.status === 200) {
            window.location = "/eventDetails.html"
        }
        console.log(formObject)
    })
}