export default class event{
    constructor(eventName, seats, eventDate, eventTime, columnsAreNumbers, rowsAreLetters, Hgap, Vgap){
        this.eventName = eventName;
        this.seats = seats;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.columnsAreNumbers = columnsAreNumbers;
        this.rowsAreLetters = rowsAreLetters;
        this.Hgap = Hgap;
        this.Vgap = Vgap;
    }
}