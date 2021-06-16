export default class localStorageUtil {

    getLocalStorage(){
        let passedArray = [];
        passedArray = JSON.parse(localStorage.getItem("CDC-Events"));
        return passedArray;
    }

    setLocalStorage(eventArrayToSave){
        localStorage.setItem("CDC-Events", JSON.stringify(eventArrayToSave));
    }
}