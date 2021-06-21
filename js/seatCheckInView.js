export default class seatCheckInView {
    showSeatCheckInView(mainDisplayElement) {
        mainDisplayElement.innerHTML = "";

        mainDisplayElement.innerHTML = `

        <label id="eventNameLabel"></label>

        <table id="seatTable"></table>
        
        <button id="cancelButton">Back</button>
        
        `;
    }

}