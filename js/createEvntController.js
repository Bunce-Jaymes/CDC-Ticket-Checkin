import createEvntView from './createEvntView.js';
import eventObject from './event.js';
import seatObject from './seat.js';
import localStorageUtil from "./localStorageUtil.js";
import selectUnavailableSeatViewObject from "./selectUnavailableSeatView.js";
import seatCheckInViewViewObject from "./seatCheckInView.js";

export default class createEvntController {
    constructor(mainDisplayElement) {
        this.mainDisplayElement = mainDisplayElement;
        this.createEvntViewInstance = new createEvntView();
        this.selectUnavailableSeatViewInstance = new selectUnavailableSeatViewObject();
        this.event = new eventObject();
        this.ls = new localStorageUtil();
        this.seatCheckInView = new seatCheckInViewViewObject();
        this.alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "JB", "KB", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB"]
    }

    init() {
        this.mainDisplayElement = document.querySelector(this.mainDisplayElement);
        const eventListStatus = document.getElementById("status");

        const addEventButton = document.querySelector('#addEventButton');
        addEventButton.addEventListener('click', event => {
            this.addEvent();
        });

        let savedEventsArray = this.ls.getLocalStorage();

        eventListStatus.innerHTML = "Loading events...";

        if (savedEventsArray == null) {
            eventListStatus.innerHTML = "No saved events found in local storage. Add an event using the button below.";
        } else {
            eventListStatus.style.display = 'none';
            const eventListULElement = document.getElementById("eventListUL");
            savedEventsArray.forEach(element => {
                let newLiItem = document.createElement("li");
                let newEventButton = document.createElement("button");
                let resetButton = document.createElement('button');
                resetButton.textContent = "Reset";
                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.classList.add("deleteButton");

                newEventButton.addEventListener("click", e => {
                    this.setCurrentEvent(element);
                    alert("Select seats to be checked in. Tapping once will highlight the seat. Tapping again will confirm the seat as checked in and save.")
                    this.showSeatCheckIn();

                });

                let eventDate = new Date(element.eventDate);
                let eventTime = new Date(element.eventDate);

                let hours = eventTime.getHours();
                let minutes = eventTime.getMinutes();
                let ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                let strTime = hours + ':' + minutes + ' ' + ampm;

                newEventButton.textContent = element.eventName + " - " + eventDate.toLocaleDateString('en-US') + " @ " + strTime;
                newLiItem.append(newEventButton, resetButton, deleteButton);
                eventListULElement.append(newLiItem);
            });
        }
    }

    async addEvent(eventListener = (e) => {
        let success = this.processEventForm();
        if (success === false) {
            e.preventDefault();
        } else {
            this.selectUnavailableSeats();
        }

    }) {
        this.createEvntViewInstance.showAddEventView(this.mainDisplayElement);

        const newEventForm = document.querySelector('#newEventForm');
        newEventForm.addEventListener('submit', eventListener);
        const cancelButton = document.querySelector('#cancelFormButton');
        cancelButton.addEventListener('click', e => {
            this.backToMain();
        });
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

            if (savedEventsArray !== null) {
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

    backToMain() {
        let response = confirm("The following event/seating chart has not been saved if cancelled. Please select yes to continue.");
        if (response == true) {
            location.reload();
        }
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
        const doneButton = document.querySelector('#doneButton');
        const seatTable = document.querySelector('#seatTable');

        doneButton.addEventListener('click', e => {
            this.removeSeatsAndSave(seatTable);
        });

        const cancelButton = document.querySelector('#cancelButton');

        cancelButton.addEventListener('click', e => {
            this.backToMain();
        });

        const seatArrayFromEvent = this.event.seats;
        const columnLabelRow = document.createElement('tr');
        let blankSpace = document.createElement('th');
        blankSpace.innerHTML = '';
        columnLabelRow.append(blankSpace);

        for (let i = 0; i < seatArrayFromEvent[1].length; i++) {
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

            if (this.event.rowsAreLetters === "letters") {
                newRowLabel.innerHTML = this.alphabetArray[i];
            } else {
                newRowLabel.innerHTML = i + 1;
            }

            newRow.append(newRowLabel);

            for (let j = 0; j < seatArrayFromEvent[i].length; j++) {
                let newSeatInTable = document.createElement('td');
                let newSeatButton = document.createElement('button');
                newSeatButton.classList.add("availableSeatImg");
                newSeatButton.id = i + "-" + j;
                newSeatButton.value = "OFF";

                newSeatButton.addEventListener('click', function (e) {
                    let button = e.target;

                    if (button.value == "OFF") {
                        button.classList.remove("availableSeatImg");
                        button.classList.add("permUnavailableSeatImg");
                        button.value = "ON";
                    } else if (button.value == "ON") {
                        button.classList.remove("permUnavailableSeatImg");
                        button.classList.add("availableSeatImg");
                        button.value = "OFF";
                    }
                });

                newSeatInTable.append(newSeatButton);
                newRow.append(newSeatInTable);
            }
            seatTable.append(newRow);
        }
    }

    removeSeatsAndSave(seatTableFull) {
        let buttonArray = [];

        let tableChildren = seatTableFull.childNodes;

        for (let i = 1; i < tableChildren.length; i++) {
            let rowChildren = tableChildren[i].childNodes;
            for (let j = 1; j < rowChildren.length; j++) {
                let checkTD = rowChildren[j].childNodes;
                let checkButton = checkTD[0];

                if (checkButton.value == "ON") {
                    buttonArray.push(checkButton);
                }
            }
        }

        for (let i = 0; i < this.event.seats.length; i++) {

            for (let j = 0; j < this.event.seats[i].length; j++) {
                let eventSeat = this.event.seats[i][j];
                let y;

                for (y = 0; y < buttonArray.length; y++) {
                    let buttonValue = buttonArray[y].id;
                    let selectedSeatRow = parseInt(buttonValue.split("-", 1));
                    let selectedSeatCol = parseInt(buttonValue.split('-', 2)[1]);

                    if (eventSeat.columnLocation == selectedSeatRow && eventSeat.rowLocation == selectedSeatCol) {
                        eventSeat.seatType = "PU";
                        eventSeat.isOccupied = true;
                    }
                }

            }
        }

        this.findAndSavedUpdatedEvent();

        this.reload();
    }

    reload() {
        location.reload();
    }

    setCurrentEvent(selectedEvent) {
        this.event = selectedEvent;
    }

    showSeatCheckIn() {
        function updateSeatEvent(e) {
            let button = e.target;

            if (button.value == "OFF") {
                button.classList.remove("availableSeatImg");
                button.classList.add("firstTap");
                button.value = "1stTap";
            } else if (button.value == "1stTap") {
                button.classList.remove("firstTap");
                button.classList.add("confirmed");
                button.value = "Confirmed";

                let selectedSeatRow = parseInt(button.id.split("-", 1));
                let selectedSeatCol = parseInt(button.id.split('-', 2)[1]);

                for (let i = 0; i < seatArrayFromEvent.length; i++) {
                    for (let j = 0; j < seatArrayFromEvent[i].length; j++) {
                        let eventSeat = seatArrayFromEvent[i][j];

                        if (eventSeat.columnLocation == selectedSeatRow && eventSeat.rowLocation == selectedSeatCol) {
                            eventSeat.seatType = "O";
                            eventSeat.isOccupied = true;
                        }
                    }
                }
            }
        }

        this.seatCheckInView.showSeatCheckInView(this.mainDisplayElement);

        let eventNameLabel = document.querySelector('#eventNameLabel');
        let eventDate = new Date(this.event.eventDate);
        let eventTime = new Date(this.event.eventDate);

        let hours = eventTime.getHours();
        let minutes = eventTime.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;

        eventNameLabel.textContent = this.event.eventName + " - " + eventDate.toLocaleDateString('en-US') + " @ " + strTime;


        const seatTable = document.querySelector('#seatTable');

        const cancelButton = document.querySelector('#cancelButton');

        cancelButton.addEventListener('click', e => {
            this.backToMain();
        });

        const seatArrayFromEvent = this.event.seats;
        const columnLabelRow = document.createElement('tr');
        let blankSpace = document.createElement('th');
        blankSpace.innerHTML = '';
        columnLabelRow.append(blankSpace);

        for (let i = 0; i < seatArrayFromEvent[1].length; i++) {
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

            if (this.event.rowsAreLetters === "letters") {
                newRowLabel.innerHTML = this.alphabetArray[i];
            } else {
                newRowLabel.innerHTML = i + 1;
            }

            newRow.append(newRowLabel);

            for (let j = 0; j < seatArrayFromEvent[i].length; j++) {
                let seatToCheckFromEvent = this.event.seats[i][j];
                let newSeatInTable = document.createElement('td');
                let newSeatButton = document.createElement('button');
                newSeatButton.id = i + "-" + j;

                if (seatToCheckFromEvent.seatType == "PU" && seatToCheckFromEvent.isOccupied == true) {
                    newSeatButton.classList.add("permUnavailableSeatImg");
                    newSeatButton.value = "N/A";
                } else if (seatToCheckFromEvent.seatType == "O" && seatToCheckFromEvent.isOccupied == true) {
                        newSeatButton.classList.add("confirmed");
                        newSeatButton.value = "N/A";
                    } else {
                        newSeatButton.classList.add("availableSeatImg");
                        newSeatButton.value = "OFF";

                        newSeatButton.addEventListener('click', updateSeatEvent);

                        // newSeatButton.addEventListener('click', function (e) {
                        //     let button = e.target;
                        //
                        //     if (button.value == "OFF") {
                        //         button.classList.remove("availableSeatImg");
                        //         button.classList.add("firstTap");
                        //         button.value = "1stTap";
                        //     } else if (button.value == "1stTap") {
                        //         button.classList.remove("firstTap");
                        //         button.classList.add("confirmed");
                        //         button.value = "Confirmed";
                        //
                        //         let selectedSeatRow = parseInt(button.id.split("-", 1));
                        //         let selectedSeatCol = parseInt(button.id.split('-', 2)[1]);
                        //
                        //         for (let i = 0; i < seatArrayFromEvent.length; i++) {
                        //             for (let j = 0; j < seatArrayFromEvent[i].length; j++) {
                        //                 let eventSeat = seatArrayFromEvent[i][j];
                        //
                        //                 if (eventSeat.columnLocation == selectedSeatRow && eventSeat.rowLocation == selectedSeatCol) {
                        //                     eventSeat.seatType = "O";
                        //                     eventSeat.isOccupied = true;
                        //                 }
                        //             }
                        //         }
                        //     }
                        // });
                    // }
                }

                newSeatInTable.append(newSeatButton);
                newRow.append(newSeatInTable);
            }
            seatTable.append(newRow);
        }
    }

    findAndSavedUpdatedEvent() {
        let savedEventsArray = this.ls.getLocalStorage();

        savedEventsArray.every(element => {
            let compareDate = new Date(element.eventDate);
            compareDate = compareDate.toLocaleDateString('en-US');
            let currentEventDate = this.event.eventDate.toLocaleDateString('en-US');

            if (element.eventName === this.event.eventName && compareDate === currentEventDate) {
                let index = savedEventsArray.indexOf(element);
                savedEventsArray[index] = this.event;
            }
        });

        this.ls.setLocalStorage(savedEventsArray);
    }
}