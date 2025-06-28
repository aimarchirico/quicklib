import { Stack } from 'expo-router';

export default function BookLayout() {
  return (
    <Stack>
      <Stack.Screen name="bookInfo" options={{ headerShown: false }} />
      <Stack.Screen name="editBook" options={{ headerShown: false }} />
    </Stack>
  );
}
