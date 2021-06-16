import createEvntView from './createEvntView.js';
import eventObject from './event.js';
import seatObject from './seat.js';
import localStorageUtil from "./localStorageUtil.js";
import selectUnavailableSeatViewObject from "./selectUnavailableSeatView.js";

export default class createEvntController {
    constructor(mainDisplayElement) {
        this.mainDisplayElement = mainDisplayElement;
        this.createEvntViewInstance = new createEvntView();
        this.selectUnavailableSeatViewInstance = new selectUnavailableSeatViewObject();
        this.event = new eventObject();
        this.ls = new localStorageUtil();
        this.alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "JB", "KB", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB"]
    }

    init(){
        this.mainDisplayElement = document.querySelector(this.mainDisplayElement);
        const eventListDiv = document.querySelector('#eventListDiv');
        const eventListStatus = document.getElementById("status");

        const addEventButton = document.querySelector('#addEventButton');
        addEventButton.addEventListener('click', event => {
            this.addEvent();
        });

        let savedEventsArray = this.ls.getLocalStorage();

        eventListStatus.innerHTML = "Loading events...";

        if (savedEventsArray == null) {
            eventListStatus.innerHTML = "No saved events found in local storage. Add an event using the button below.";
        }else {
            eventListStatus.style.display = 'none';
            const eventListULElement = document.getElementById("eventListUL");
            savedEventsArray.forEach(element => {
                let newLiItem = document.createElement("li");
                let newEventButton = document.createElement("button");

                let eventDate = new Date(element.eventDate);
                let eventTime = new Date(element.eventDate);

                let hours = eventTime.getHours();
                let minutes = eventTime.getMinutes();
                let ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                let strTime = hours + ':' + minutes + ' ' + ampm;

                newEventButton.textContent = element.eventName + " - " + eventDate.toLocaleDateString('en-US') + " @ " + strTime;
                newLiItem.append(newEventButton);
                eventListULElement.append(newLiItem);
            });
        }
    }

    async addEvent(eventListener = (e) => {
        let success = this.processEventForm();
        if (success === false){
            e.preventDefault();
        } else {
            this.selectUnavailableSeats();
        }

    }) {
        this.createEvntViewInstance.showAddEventView(this.mainDisplayElement);

        const newEventForm = document.querySelector('#newEventForm');
        newEventForm.addEventListener('submit', eventListener);
    }

    processEventForm() {
        let submitForm = true;
        let confirmedInfo = confirm("Please confirm the information entered is completely correct.");

        if (confirmedInfo == true) {
            const eventInfoArray = this.retrieveFormInfo();

            let date = eventInfoArray[1];
            let newDateObject = new Date(date);

            let savedEventsArray = this.ls.getLocalStorage();
            let noMatchFound = true;

            if (savedEventsArray !== null ){
                noMatchFound = savedEventsArray.every(element => {
                    let compareDate = new Date(element.eventDate);
                    compareDate = compareDate.toLocaleDateString('en-US');
                    let currentEventDate = newDateObject.toLocaleDateString('en-US');

                    if (element.eventName === eventInfoArray[0] && compareDate === currentEventDate) {
                        alert("There is already an event saved with this event name and date. Please change the event name or date.")
                        return false;
                    }
                    return true;
                });
            }

            if (noMatchFound === true) {
                let amountOfCol = parseInt(eventInfoArray[3]);
                let amountOfRow = parseInt(eventInfoArray[4]);

                let seatArray = [];

                for (let i = 0; i < amountOfRow; i++) {
                    seatArray.push([0])
                    for (let j = 0; j < amountOfCol; j++) {
                        let newSeat = new seatObject("A", false, i, j);
                        seatArray[i][j] = newSeat;
                    }
                }

                this.event.eventName = eventInfoArray[0];
                this.event.eventDate = newDateObject;
                this.event.eventTime = eventInfoArray[2];
                this.event.seats = seatArray;
                this.event.columnsAreNumbers = eventInfoArray[5];
                this.event.rowsAreLetters = eventInfoArray[6];

                this.saveNewEvent();
                return true;
            } else {
                submitForm = false;
            }
        }
        return submitForm;
    }

    retrieveFormInfo() {
        const eventName = document.querySelector('#eventName').value;
        const eventDate = document.querySelector('#eventDateAndTime').value;
        const eventTime = document.querySelector('#eventDateAndTime').value;
        const amountOfColumns = document.querySelector('#amountOfColumns').value;
        const amountOfRows = document.querySelector('#amountOfRows').value;
        const columnLabelAs = document.querySelector('#columnLabelAs').value;
        const rowLabelAs = document.querySelector('#rowLabelAs').value;

        const eventInfoArray = [eventName, eventDate, eventTime, amountOfColumns, amountOfRows, columnLabelAs, rowLabelAs];

        return eventInfoArray;
    }

    saveNewEvent() {
        let savedEventsArray = this.ls.getLocalStorage();

        if (savedEventsArray == null) {
            savedEventsArray = [];
        }
        savedEventsArray.push(this.event);
        this.ls.setLocalStorage(savedEventsArray);
    }

    selectUnavailableSeats() {
        this.selectUnavailableSeatViewInstance.showUnavailableSeatView(this.mainDisplayElement);
        const seatTable = document.querySelector('#seatTable');

        const seatArrayFromEvent = this.event.seats;
        const columnLabelRow = document.createElement('tr');
        let blankSpace = document.createElement('th');
        blankSpace.innerHTML = '';
        columnLabelRow.append(blankSpace);

        for (let i = 0; i < seatArrayFromEvent[1].length; i++){
            let columnLabel = document.createElement('th');

                if (this.event.columnsAreNumbers === "letters") {
                    columnLabel.innerHTML = this.alphabetArray[i];
                } else {
                    columnLabel.innerHTML = i + 1;
                }

            columnLabelRow.append(columnLabel);
        }

        seatTable.append(columnLabelRow);

        for (let i = 0; i < seatArrayFromEvent.length; i++) {
            let newRow = document.createElement('tr');
            let newRowLabel = document.createElement('th');

            if (this.event.rowsAreLetters === "letters"){
                newRowLabel.innerHTML = this.alphabetArray[i];
            } else {
                newRowLabel.innerHTML = i + 1;
            }

            newRow.append(newRowLabel);

            for (let j = 0; j < seatArrayFromEvent[i].length; j++) {
                let newSeatInTable = document.createElement('td');
                let newSeatButton = document.createElement('button');
                // newSeatButton.style.width = '40px';
                // newSeatButton.style.height = '40px';
                newSeatButton.innerHTML = "<img src='../img/event_seat_black_192x192.png' width='40px' height='40px'>";

                newSeatButton.addEventListener('click', function () {

                });

                newSeatInTable.append(newSeatButton);
                newRow.append(newSeatInTable);



            }

            seatTable.append(newRow);
        }
    }
}