export default class createEvntView {
    showAddEventView(mainDisplayElement) {
        mainDisplayElement.innerHTML = "";

        mainDisplayElement.innerHTML = `
        <header>
            <h1>Add New Event Information:</h1>
        </header>

        <form id="newEventForm">
            <label>Event Name: <input id="eventName" required></label>
            <label id="eventTimeLabel">Event Date and Time: <input type="datetime-local" id="eventDateAndTime" required></label>
            <label>Amount of Columns: <input type="number" id="amountOfColumns" required></label>
            <label>Amount of Rows: <input type="number" id="amountOfRows" required></label>
            <label>Column Labels as: <select id="columnLabelAs">
                <option value="letters">Letters</option>
                <option value="numbers">Numbers</option>
            </select></label>
            <label>Row Labels as: <select id="rowLabelAs">
                <option value="numbers">Numbers</option>
                <option value="letters">Letters</option>
            </select></label>

            <button id="submitButton" type="submit">Add This Event</button>
            
            <button id="cancelFormButton">Cancel</button>
        </form>      
        `;
    }

}