// making sure a screen doesn't appear twice in the navigation stack (as it causes something like a loop)
// while still keeping the order of the other screens in the stack
export const goToScreenWithoutNestingInStack = (navigation, targetScreenName) => {

    const currentState = navigation.getState();
    const screenIndex = currentState.routes.findIndex(route => route.name === targetScreenName);

    // if you found the screen already in the stack
    if(screenIndex !== -1) {
        const {routes} = navigation.getState();
        // pop all the screens until you find the target screen (then remove it)
        for (let i=0; i<routes.length-screenIndex; i++) {
            navigation.pop();
        }
        // re-push all the other screens again (in the same order)
        for (let i=0; i<routes.length-screenIndex-1; i++) {
            navigation.push(routes[screenIndex+i].name);
        }
    }
    // navigate to the target screen (push it)
    navigation.navigate(targetScreenName)
}