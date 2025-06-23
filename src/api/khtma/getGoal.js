import jawwedHttpClient from '../../utils/httpclient';


export const getGoal = async(goalId) => {

    try {
        relativeURL = `Goals/${goalId}`;
        const {data} = await jawwedHttpClient.get(relativeURL);
        return data;
    }
    catch (error) {
        return 'error';
    }
}