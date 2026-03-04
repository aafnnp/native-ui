import { Slot } from "expo-router"
import { NativeUIProvider } from "kra-ui"

export default function RootLayout() {
  return (
    <NativeUIProvider>
      <Slot />
    </NativeUIProvider>
  )
}
