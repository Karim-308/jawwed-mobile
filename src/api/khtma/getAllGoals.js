import jawwedHttpClient from '../../utils/httpclient';


export const getAllGoals = async() => {
    
    try {
        relativeURL = 'Goals';
        const {data} = await jawwedHttpClient.get(relativeURL);
        return data;
    }
    catch (error) {
        return 'error';
    }
}