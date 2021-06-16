export default class selectUnavailableSeatView {
    showUnavailableSeatView(mainDisplayElement) {
        mainDisplayElement.innerHTML = "";

        mainDisplayElement.innerHTML = `
        <header>
            <h1>Select seats to be marked as permanently unavailable:</h1>
        </header>
        
        <table id="seatTable"></table>
        
        `;
    }

}