// for styling the auto-detect location button's background
export const getLocationBackgroundColor = (locationDeterminationMethod) => {
    if(locationDeterminationMethod === 'Auto')
        return '#0F0';
    else
        return '#F00';
}

// for styling each option's border in the setting menu
export const getOptionBorderColor = (selectedOptionValue) => {
    if(selectedOptionValue === null)
        return '#F00';
    else
        return '#0F0';
}

