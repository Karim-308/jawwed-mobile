const initialState = {
    locationDeterminationMethod: null,
    country: null,
    city: null,
    coordinates: null,
    calculationMethod: null,
    mazhab: null,
    timeZone: null,
    prayerTimes: null,
    isSettingsMenuVisible: false,
    errorStatus: null
};


const actionTypes = {
    SET_LOCATION_DETERMINATION_METHOD: 'SET_LOCATION_DETERMINATION_METHOD',
    SET_COUNTRY: 'SET_COUNTRY',
    SET_CITY: 'SET_CITY',
    SET_COORDINATES: 'SET_COORDINATES',
    SET_CALCULATION_METHOD: 'SET_CALCULATION_METHOD',
    SET_MAZHAB: 'SET_MAZHAB',
    SET_TIME_ZONE: 'SET_TIME_ZONE',
    SET_PRAYER_TIMES: 'SET_PRAYER_TIMES',
    SET_IS_SETTINGS_MENU_VISIBLE: 'SET_IS_SETTINGS_MENU_VISIBLE',
    SET_ERROR_STATUS: 'SET_ERROR_STATUS'
};


export const setLocationDeterminationMethod = (locationDeterminationMethod) => ({
    type: actionTypes.SET_LOCATION_DETERMINATION_METHOD,
    payload: locationDeterminationMethod
});
export const setCountry = (country) => ({
    type: actionTypes.SET_COUNTRY,
    payload: country
});
export const setCity = (city) => ({
    type: actionTypes.SET_CITY,
    payload: city
});
export const setCoordinates = (coordinates) => ({
    type: actionTypes.SET_COORDINATES,
    payload: coordinates
});
export const setCalculationMethod = (calculationMethod) => ({
    type: actionTypes.SET_CALCULATION_METHOD,
    payload: calculationMethod
});
export const setMazhab = (mazhab) => ({
    type: actionTypes.SET_MAZHAB,
    payload: mazhab
});
export const setTimeZone = (timeZone) => ({
    type: actionTypes.SET_TIME_ZONE,
    payload: timeZone
});
export const setPrayerTimes = (prayerTimes) => ({
    type: actionTypes.SET_PRAYER_TIMES,
    payload: prayerTimes
});
export const setIsSettingsMenuVisible = (isSettingsMenuVisible) => ({
    type: actionTypes.SET_IS_SETTINGS_MENU_VISIBLE,
    payload: isSettingsMenuVisible
});
export const setErrorStatus = (errorStatus) => ({
    type: actionTypes.SET_ERROR_STATUS,
    payload: errorStatus
});


const prayerTimesReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOCATION_DETERMINATION_METHOD:
            return { ...state, locationDeterminationMethod: action.payload };
        case actionTypes.SET_COUNTRY:
            return { ...state, country: action.payload };
        case actionTypes.SET_CITY:
            return { ...state, city: action.payload };
        case actionTypes.SET_COORDINATES:
            return { ...state, coordinates: action.payload };
        case actionTypes.SET_CALCULATION_METHOD:
            return { ...state, calculationMethod: action.payload };
        case actionTypes.SET_MAZHAB:
            return { ...state, mazhab: action.payload };
        case actionTypes.SET_TIME_ZONE:
            return { ...state, timeZone: action.payload };
        case actionTypes.SET_PRAYER_TIMES:
            return { ...state, prayerTimes: action.payload };
        case actionTypes.SET_IS_SETTINGS_MENU_VISIBLE:
            return { ...state, isSettingsMenuVisible: action.payload };
        case actionTypes.SET_ERROR_STATUS:
            return { ...state, errorStatus: action.payload };
        default:
            return state;
    }
};


export default prayerTimesReducer;
  