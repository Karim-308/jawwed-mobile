import axios from 'axios';

// Get timezone from coordinates
export const getTimezone = async (apiKey, lat, lon) => {

    let timezoneErrorStatus = null;
    
    try {
        const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;
        const response = await axios.get(url);
        if (response.data.status === 'OK')
            return {'timezone': response.data.zoneName, 'errorStatus': timezoneErrorStatus};
        else {
            timezoneErrorStatus = 'حدث خطأ ما أثناء تحديد المنطقة الزمنية';
            return {'timezone': null, 'errorStatus': timezoneErrorStatus};
        }
    }
    catch (error) {
        timezoneErrorStatus = 'حدث خطأ ما أثناء تحديد المنطقة الزمنية';
        return {'timezone': null, 'errorStatus': timezoneErrorStatus};
    }
};