import jawwedHttpClient from '../../utils/httpclient';


export const createNewKhtma = async(goalTitle, goalTotalPages, goalStartPage, goalDuration, goalReminderTime) => {

    try {
        const relativeURL = 'Goals';
        const {data} = await jawwedHttpClient.post(
            relativeURL,
            {
                title: goalTitle,
                durationDays: goalDuration,
                totalPages: goalTotalPages,
                startPage: goalStartPage,
                reminderTime: goalReminderTime
            }
        );
        return data;
    }
    catch (error) {
        console.log(error);
        console.log(goalTitle);
        console.log(goalTotalPages);
        console.log(goalStartPage);
        console.log(goalDuration);
        console.log(goalReminderTime);
        return 'error';
    }
}