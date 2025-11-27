import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BigLogo } from '../components/custom';
import { Heading, Text, Button, ButtonText, HStack, VStack } from '@/src/components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck } from 'lucide-react-native';
import { interopIcons } from '@/src/utils/nativewind';

interopIcons([CircleCheck]);


export default function Index() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            <LinearGradient
                colors={['#f8fafc', '#f1f5f9']}
                style={{ flex: 1 }}
            >
                <VStack className="flex-1 px-6 py-12 items-center gap-10">
                    <VStack className="items-center gap-4 w-full max-w-xl">
                        <BigLogo />
                        <Heading className="text-3xl text-center font-semibold tracking-tight">Smart Drip</Heading>
                        <Text className="text-center text-slate-600 text-sm leading-5 w-10/12">
                            Automated irrigation & plant health monitoring. Manage sensors, view analytics, and keep your garden thriving effortlessly.
                        </Text>
                    </VStack>
                    <VStack className="w-full max-w-md gap-4">
                        <Button size="md" className="w-full rounded-lg bg-primary-500" onPress={() => router.push('/sign-in/admin')}>
                            <ButtonText>Sign in as Admin</ButtonText>
                        </Button>
                        <Button size="md" className="w-full rounded-lg bg-primary-500" onPress={() => router.push('/sign-in/user')}>
                            <ButtonText>Sign in as User</ButtonText>
                        </Button>
                        <Button size="md" variant="outline" className="w-full rounded-lg border-primary-500" onPress={() => router.push('/sign-up')}>
                            <ButtonText className="text-primary-500">Create Account</ButtonText>
                        </Button>
                    </VStack>
                    <HStack className="mt-4 gap-3 items-center">
                        <CircleCheck size={16} className="text-green-500" />
                        <Text className="text-xs text-slate-500">Secure • Fast • Cross‑platform</Text>
                    </HStack>
                </VStack>
            </LinearGradient>
        </ScrollView>
    );
}