import axios from 'axios';

// Get timeZone from coordinates
export const getTimeZone = async (apiKey, lat, lon) => {

    const responseData = {
        'zoneName': null,
        'gmtOffset': null,
        'errorStatus': null
    };
    
    try {
        const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            responseData.zoneName = response.data.zoneName;
            responseData.gmtOffset = response.data.gmtOffset
        }
        else {
            responseData.errorStatus = 'حدث خطأ ما أثناء تحديد المنطقة الزمنية';
        }
        return responseData;
    }
    catch (error) {
        responseData.errorStatus = 'حدث خطأ ما أثناء تحديد المنطقة الزمنية';
        return responseData;
    }
};