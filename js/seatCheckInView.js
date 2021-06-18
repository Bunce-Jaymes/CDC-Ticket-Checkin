export default class seatCheckInView {
    showSeatCheckInView(mainDisplayElement) {
        mainDisplayElement.innerHTML = "";

        mainDisplayElement.innerHTML = `
        <header>
            <h1>Select seats to be checked in. Tapping once will highlight the seat. Tapping again will confirm the seat as checked in and save.</h1>
        </header>
        
        <table id="seatTable"></table>
        
        <button id="cancelButton">Cancel</button>
        
        `;
    }

}