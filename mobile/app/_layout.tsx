import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

// Separate component to use hook inside provider
function StackLayout() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'MicroMarket',
          headerRight: () => (
            user ? (
              <TouchableOpacity onPress={() => router.push('/favorites')} style={{ marginRight: 10 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Favorites</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.push('/login')} style={{ marginRight: 10 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Login</Text>
              </TouchableOpacity>
            )
          ),
        }}
      />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Details' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
