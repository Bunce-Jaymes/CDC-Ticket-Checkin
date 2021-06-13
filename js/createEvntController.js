import createEvntView from './createEvntView.js';
import eventObject from './event.js';

export default class createEvntController {
    constructor(mainDisplayElement) {
        this.mainDisplayElement = mainDisplayElement;
        this.createEvntView = new createEvntView();
        this.event = new eventObject();
    }

    init(){
        this.mainDisplayElement = document.querySelector(this.mainDisplayElement);

        const addEventButton = document.querySelector('#addEventButton');
        addEventButton.addEventListener('click', event => {
            this.addEvent();
        });
    }

    async addEvent(eventListener = (e) => {
        this.processEventForm();
        this.saveNewEvent();
    }) {
        this.createEvntView.showAddEventView(this.mainDisplayElement);

        const newEventForm = document.querySelector('#newEventForm');
        newEventForm.addEventListener('submit', eventListener);
    }

    processEventForm() {
        let confirmedInfo = confirm("Please confirm the information entered is completely correct.");

        if (confirmedInfo == true){
            const eventInfoArray = this.retrieveFormInfo();\



            this.event.eventName = eventInfoArray[0];
            this.event.eventDate = eventInfoArray[1];
            this.event.eventTime = eventInfoArray[2];
            this.event.seats = to be filled;
            this.event.columnsAreNumbers = eventInfoArray[5];
            this.event.rowsAreLetters = eventInfoArray[6];
        }
    }

    retrieveFormInfo() {
        const eventName = document.querySelector('#eventName').value;
        const eventDate = document.querySelector('#eventDate').value;
        const eventTime = document.querySelector('#eventTime').value;
        const amountOfColumns = document.querySelector('#amountOfColumns').value;
        const amountOfRows = document.querySelector('#amountOfRows').value;
        const columnLabelAs = document.querySelector('#columnLabelAs').value;
        const rowLabelAs = document.querySelector('#rowLabelAs').value;

        const eventInfoArray = [eventName, eventDate, eventTime, amountOfColumns, amountOfRows, columnLabelAs, rowLabelAs];

        return eventInfoArray;
    }

    saveNewEvent() {

    }
}