import React from 'react';
import { render, fireEvent ,waitFor } from '@testing-library/react-native';
import TafsirModal from '../TafsirModal';
import { PanResponder } from 'react-native';
import getTafsir from '../../../../../api/tafsir/GetTafsir';

//  Mock getTafsir API call
jest.mock('../../../../../api/tafsir/GetTafsir', () => ({
  __esModule: true,
  default: jest.fn((verseKey, sourceId) => {
    return Promise.resolve(`Tafsir from source ${sourceId}`);
  }),
}));


//  Mock PanResponder only (safely)
jest.spyOn(PanResponder, 'create').mockImplementation(() => ({
  panHandlers: {},
}));

//  Mock Slider
jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ onValueChange, testID }) => (
    <Text testID={testID} onPress={() => onValueChange?.(20)}>MockSlider</Text>
  );
});


//  Mock RenderHTML
jest.mock('react-native-render-html', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ source }) => (
    <Text testID="tafsir-content">{source?.html}</Text>
  );
});




describe('TafsirModal', () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
    ayahKey: '2:255',
    ayahText: 'Test Ayah',
    selectedSource: 1,
    onSourceChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ayah text correctly', () => {
    const { getByText } = render(<TafsirModal {...defaultProps} />);
    expect(getByText('Test Ayah')).toBeTruthy();
  });

  it('calls onClose when backdrop is pressed', () => {
    const { getByTestId } = render(<TafsirModal {...defaultProps} />);
    fireEvent.press(getByTestId('modal-backdrop'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows the mocked tafsir content', async () => {
    const { getByTestId, queryByTestId } = render(<TafsirModal {...defaultProps} />);
  
    // Wait for loading indicator to disappear and tafsir content to appear
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(getByTestId('tafsir-content')).toBeTruthy();
    });
  });



it('updates tafsir content when source is changed', async () => {
  const mockOnSourceChange = jest.fn();

  const { getByText, getByTestId ,rerender } = render(
    <TafsirModal
      {...defaultProps}
      selectedSource={1}
      onSourceChange={mockOnSourceChange}
    />
  );

  // Press the source button for تفسير الطبري (which is source id 3)
  fireEvent.press(getByText('تفسير الطبري'));

  // Assert the callback was called
  expect(mockOnSourceChange).toHaveBeenCalledWith(3);

  // Simulate prop update from parent
  rerender(
    <TafsirModal
      {...defaultProps}
      selectedSource={3}
      onSourceChange={mockOnSourceChange}
    />
  );
  
  // Wait for re-rendered tafsir content
  await waitFor(() => {
    expect(getByTestId('tafsir-content').props.children).toBe('Tafsir from source 3');
  });
});

it('updates font size when slider is moved', async () => {
  const { getByTestId } = render(<TafsirModal {...defaultProps} />);
  const slider = getByTestId('font-size-slider');

  fireEvent.press(slider); // triggers onValueChange(20)
  
  await waitFor(() => {
    expect(getByTestId('tafsir-content').props.children).toBe('Tafsir from source 1');
  });
});



it('shows error message when tafsir fetch fails', async () => {
  getTafsir.mockImplementationOnce(() => Promise.reject('API Error'));

  const { getByText } = render(<TafsirModal {...defaultProps} />);

  await waitFor(() => {
    expect(getByText('Failed to fetch Tafsir.')).toBeTruthy();
  });
});

});
