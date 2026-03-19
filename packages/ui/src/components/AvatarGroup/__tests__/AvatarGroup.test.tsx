/**
 * AvatarGroup 用例
 * - 超出 max 时显示 +N
 */
import Avatar from '../../Avatar';
import AvatarGroup from '../index';
import { renderWithProvider } from '../../../test-utils/render';

test('超出 max 时显示 +N', () => {
  const { getByText } = renderWithProvider(
    <AvatarGroup max={2}>
      <Avatar name="A" />
      <Avatar name="B" />
      <Avatar name="C" />
    </AvatarGroup>,
  );
  expect(getByText('+1')).toBeTruthy();
});
