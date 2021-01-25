window.onload = () => {
    getEventDataIntoEditForm()
    eventDetailEditSubmit()
}

async function getEventDataIntoEditForm() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const data = await fetch(`/events/eventDetails/${id}`)
    const eventData = await data.json()

    document.getElementById('event_name').value = eventData.event_name
    document.getElementById('meeting_point').value = eventData.meeting_point
    document.getElementById('date').value = eventData.date
    document.getElementById('time').value = eventData.time
    document.getElementById('max_number_of_member').value = eventData.max_number_of_member
    document.getElementById('hiking_trail_id').value = eventData.hiking_trail_id
    document.getElementById('detail').value = eventData.detail
}

function eventDetailEditSubmit() {
    const paramString = window.location.search
    const searchParams = new URLSearchParams(paramString)
    const id = (searchParams.get('id'))

    const form = document.getElementById("edit-event-form")
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        formObject = {}
        formObject["event_name"] = form.event_name.value
        formObject["meeting_point"] = form.meeting_point.value
        formObject["date"] = form.date.value
        formObject["time"] = form.time.value
        formObject["max_number_of_member"] = form.max_number_of_member.value
        formObject["hiking_trail_id"] = form.hiking_trail_id.value
        formObject["detail"] = form.detail.value

        const res = await fetch(`/events/updateEventDetail/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(formObject)
        });
        let result = await res.json()
        if (res.status === 200) {
            window.location = `/eventDetails.html?id=${id}`
        }
    })
}
