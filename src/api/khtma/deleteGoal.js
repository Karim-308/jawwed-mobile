import jawwedHttpClient from '../../utils/httpclient';


export const deleteGoal = async(goalId) => {

    try {
        const relativeURL = `Goals/${goalId}`;
        const {data} = await jawwedHttpClient.delete(relativeURL);
        return data;
    }
    catch (error) {
        return 'error';
    }
}