import Toast from '../Toast';
import theme from '../../../theme/theme';
import { renderWithProvider } from '../../../test-utils/render';

test('status 会映射到主题 toastVariants（accent color）', () => {
  const { getByTestId } = renderWithProvider(
    <Toast visible onClose={() => {}} message="ok" status="success" />,
  );

  expect(getByTestId('native-ui-toast')).toHaveStyle({
    borderLeftColor: theme.colors.success,
  });
});

test('默认可访问性 label 可用', () => {
  const { getByLabelText } = renderWithProvider(
    <Toast visible onClose={() => {}} message="hello" />,
  );

  expect(getByLabelText('hello')).toBeTruthy();
});
