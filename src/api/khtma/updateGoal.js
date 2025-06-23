import jawwedHttpClient from '../../utils/httpclient';


export const updateKhtma = async(goalId, lastPageRead, lastVerseKeyRead) => {

    try {
        const relativeURL = `Goals/${goalId}`;
        const {data} = await jawwedHttpClient.put(
            relativeURL,
            {
                lastPageRead: lastPageRead,
                lastVerseKeyRead: lastVerseKeyRead
            }
        );
        return data;
    }
    catch (error) {
        return 'error';
    }
}