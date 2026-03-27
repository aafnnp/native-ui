/**
 * Avatar 示例源码文本
 */
export const avatarBasicSource = `import React from "react";
import { Avatar, AvatarGroup, Box, NativeUIProvider } from "kra-ui";

export default function AvatarBasicDemo() {
  return (
    <NativeUIProvider>
      <Box>
        <Avatar
          size="lg"
          name="张三"
          source={{ uri: "https://i.pravatar.cc/200?img=12" }}
          status="online"
          marginBottom="s"
        />
        <AvatarGroup max={3}>
          <Avatar name="张三" />
          <Avatar name="李四" />
          <Avatar name="王五" />
          <Avatar name="赵六" />
        </AvatarGroup>
      </Box>
    </NativeUIProvider>
  );
}
`;
