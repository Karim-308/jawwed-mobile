const Colors = {
  dark: {
    // General Dark Mode Colors
    background: "#121212", // Very dark gray background
    text: "#ddd", // Light gray text for readability
    underline: "#E0A500", // Golden yellow for underlines/highlights
    buttonBackground: "#222", // Dark gray for button backgrounds
    separator: "#555", // Medium gray for dividing lines
    loaderBackground: "#000", // Pure black background for loading screens
    loaderText: "#fff", // White text on loaders
    thumbColor: "#E0A500", // Golden yellow toggle thumb
    cardBackground: "#222", // Dark gray for card components

    // Home Screen Specific
    headerBackground: "#000", // Black header bar
    searchBackground: "#222", // Dark gray search box
    sectionTitle: "#FFF", // White section titles
    featureText: "#FFF", // White text for features
    clock: "#FFF", // White clock text
    prayerTime: "#FFF", // White prayer time text
    inputPlaceholder: "#666", // Muted gray placeholder
    featureBackground: "#212020", // Near-black background for features

    // Quiz Specific
    timer: "#F4A950", // Orange/yellow timer color
    question: "#fff", // White question text
    optionBackground: "#1C1C1E", // Dark charcoal option background
    selectedOptionBackground: "#F4A950", // Highlighted orange for selected
    optionText: "#fff", // White option text
    navButtonBackground: "#F4A950", // Orange button background
    navButtonText: "#000", // Black button text
    progressText: "#F4A950", // Orange progress indicator

    // Qiblah Specific
    qiblahBackground: "black", // Solid black for Qiblah screen

    highlight: "#DE9953", // Peachy-orange used across both modes

    // Goals Specific
    menuOptionBackground: '#1E1D1D',
    menuOptionPlaceholderText: '#838383',
  },
  light: {
    // General Light Mode Colors
    background: "#fff", // White background
    text: "#000", // Black text
    underline: "#333", // Dark gray underline
    buttonBackground: "#ddd", // Light gray button
    separator: "#999", // Medium gray line divider
    loaderBackground: "#fff", // White loader background
    loaderText: "#000", // Black loader text
    thumbColor: "#f4f3f4", // Soft light gray toggle thumb
    cardBackground: "#f5f5f5", // Light card background

    // Home Screen Specific
    headerBackground: "#f5f5f5", // Light gray header
    searchBackground: "#ddd", // Pale gray for search bar
    sectionTitle: "#000", // Black titles
    featureText: "#000", // Black text for features
    clock: "#000", // Black clock text
    prayerTime: "#000", // Black prayer time text
    inputPlaceholder: "#999", // Medium gray input hints
    featureBackground: "#f0f0f0", // Light feature box background

    // Quiz Specific
    timer: "#F4A950", // Orange/yellow timer color
    question: "#000", // Black question text
    optionBackground: "#f5f5f5", // Light gray option background
    selectedOptionBackground: "#F4A950", // Orange for selected
    optionText: "#000", // Black text for options
    navButtonBackground: "#F4A950", // Orange button background
    navButtonText: "#000", // Black button text
    progressText: "#F4A950", // Orange progress bar text

    // Goals Specific
    menuOptionBackground: '#D3D3D3',
    menuOptionPlaceholderText: '#6E6D6D',
  },
  trackColor: {
    false: "#767577", // Muted gray for toggle OFF
    true: "#81b0ff", // Soft blue for toggle ON
  },
  highlight: "#DE9953", // Peachy-orange used across both modes
};

export default Colors;
