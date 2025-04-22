import * as Location from 'expo-location';


let locationErrorStatus;

// Get current coordinates from the device's current location
// returns the object {coordinates, errorStatus}
export const getCurrentCoordinates = async () => {

    locationErrorStatus = null;

    const isLocationPermissionAllowed = await requestLocationPermission();
    if (isLocationPermissionAllowed) {
        try {
            const { coords } = await Location.getCurrentPositionAsync();
            return {'coordinates': coords, 'errorStatus': locationErrorStatus};
        }
        catch(error) {
            locationErrorStatus =  'لقد حدث خطأ ما أثناء المحاولة للحصول عل إذن الموقع';
        }
    }
    else {
        return {'coordinates': null, 'errorStatus': locationErrorStatus};
    }
}


// Requesting location permission for the auto detection of coordinates
const requestLocationPermission = async () => {

    let isForegroundLocationPermissionAllowed = await requestForegroundLocationPermission();
    let isBackgroundLocationPermissionAllowed;

    if(isForegroundLocationPermissionAllowed) {
        isBackgroundLocationPermissionAllowed = requestBackgroundLocationPermission();
    }

    if (isForegroundLocationPermissionAllowed && isBackgroundLocationPermissionAllowed) {
        return true;
    }
    else {
        return false;
    }

}


// Requesting location permission when the application in the foreground (in use)
const requestForegroundLocationPermission = async () => {

    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
        const requestResult = await Location.requestForegroundPermissionsAsync();

        if (requestResult.status === 'granted')
            return true;           
        else if (requestResult.status === 'denied') {
            // Error: User has denied the foreground location permission
            locationErrorStatus = 'يجب منح إذن الموقع للتطبيق حتى يستطيع تحديد موقعك الحالي';
            return false;
        }
        else {
            // status = "undetermined"
            // Error: User has not granted or denied the foreground location permission yet
            locationErrorStatus = 'لم يتم تحديد إذن الموقع بعد';
            return false;
        }
    }
    else {
        return true;
    }

}


// Requesting location permission when the application in the background (always allowed)
const requestBackgroundLocationPermission = async () => {

    const { status } = await Location.getBackgroundPermissionsAsync();
    if (status !== 'granted') {
        const requestResult = await Location.requestBackgroundPermissionsAsync();

        if (requestResult.status === 'granted')
            return true;           
        else if (requestResult.status === 'denied') {
            // Error: User has denied the background location permission
            locationErrorStatus = 'يجب منح إذن الموقع بالعمل في الخلفية للتطبيق حتى يستطيع تحديد موقعك الحالي';
            return false;
        }
        else {
            // status = "undetermined"
            // Error: User has not granted or denied the background location permission yet
            locationErrorStatus = 'لم يتم تحديد السماح بإذن الموقع بالعمل في الخلفية بعد';
            return false;
        }
    }
    else {
        return true;
    }
        
}