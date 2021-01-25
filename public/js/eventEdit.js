window.onload = () => {
    displayOptionForm()
    getEventDataIntoEditForm()
    eventDetailEditSubmit()
}

async function displayOptionForm() {
    const res = await fetch(`/9hiketrails/api/index`)
    const data = await res.json()
    console.log(data)

    let optionStr = ``
    for (const option of data) {
        optionStr += `
        <option id="${option.id}" value="${option.id}">${option.name}</option>
        `
    }
    document.getElementById('hiking_trail_id').innerHTML = `
    <option id="1" value="1">1. Po Pin Chau 破邊洲</option>
                <option id="2" value="2">2. Po Toi 蒲台島</option>
                <option id="3" value="3">3. Tung Lung Chau 東龍島</option>
                <option id="4" value="4" selected>4. Dragon’s Back 龍脊</option>
                <option id="5" value="5">5. Brick Hill - Nam Long Shan 南朗山</option>
                <option id="6" value="6">6. Pok Fu Lam Reservoir to Aberdeen -薄扶林水庫至香港仔</option>
                <option id="7" value="7">7. Parkview to Jardine’s Lookout 陽明山至畢拿山</option>
                <option id="8" value="8">8. Sir Cecil’s Ride and Red Incense Burner Summit 金督馳馬徑至紅香爐峰</option>
                <option id="9" value="9">9. Black Hill 五桂山</option> 
    `
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
    document.getElementById('hiking_trail').innerHTML = eventData.name
    // document.getElementById('${eventData.hiking_trail_id}')['selected'] = "selected"
    document.getElementById('detail').value = eventData.detail


    // var option;

    // for (var i = 0; i < select.options.length; i++) {
    //     option = select.options[i];

    //     if (option.value == eventData.hiking_trail_id) {
    //         // or
    //         // if (option.text == 'Malaysia') {
    //         option.setAttribute('selected', true);

    //         // For a single select, the job's done
    //         return;
    //     }
    // }
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
