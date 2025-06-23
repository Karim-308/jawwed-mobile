// for styling each option's border in the setting menu
export const getOptionBorderColor = (selectedOptionValue) => {
    if(selectedOptionValue === null)
        return '#F00';
    else
        return '#0F0';
}