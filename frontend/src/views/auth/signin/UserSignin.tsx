import { Link, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import AlternativeSigninButtons from "../components/AlternativeSigninButtons";
import { Button, ButtonText, Center, Divider, FormControl, Heading, HStack, Icon, Input, InputField, InputSlot, Text, VStack } from "@/src/components/ui";
import { BigLogo } from "@/src/components/custom";
import { Eye, EyeClosed, Lock, Mail, LogIn } from "lucide-react-native";
import { useState } from "react";
import { useUtility } from "@/src/context/utiliity";
import { AuthService } from "@/src/lib/api";
import { interopIcons } from "@/src/utils/nativewind";

interopIcons([Eye, EyeClosed, Lock, Mail, LogIn]);

export default function UserSignin() {
    const router = useRouter();
    const { pushSuccess, pushError, pushWarning } = useUtility();

    const unimplemented = () => {
        pushWarning({
            title: "Unimplemented feature",
        })
    }

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [signinPayload, setSigninPayload] = useState<{ username: string; password: string }>({ username: "", password: "" });

    const submit = async () => {
        if (!signinPayload.username || !signinPayload.password) {
            pushError({ title: "Please fill in all fields!" });
            return;
        }

        const auth = new AuthService();
        const res = await auth.login({ email: signinPayload.username, password: signinPayload.password } as any);
        if (!res.success) {
            const msg = typeof res.message === 'object' ? JSON.stringify(res.message) : res.message;
            pushError({ title: "Error", message: msg || "Sign in failed" });
            return;
        }
        pushSuccess({ title: "Sign in successful!" });
        router.push("/user/dashboard");
    }

    const onChangePayload = (key: string, value: string) => {
        setSigninPayload((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <ScrollView className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 min-h-screen">
            <Center className="py-8 px-6">
                <VStack className="w-full max-w-md gap-6">
                    {/* Logo */}
                    <View className="items-center mb-4">
                        <BigLogo />
                    </View>
                    
                    {/* Welcome Card */}
                    <VStack className="gap-2 items-center">
                        <Heading className="text-3xl font-bold text-slate-800">Welcome Back!</Heading>
                        <Text className="text-base text-slate-600 text-center">Sign in to continue to SmartDrip</Text>
                    </VStack>

                    {/* Form Card */}
                    <VStack className="bg-white rounded-2xl shadow-xl p-6 gap-5 border border-slate-200">
                        <FormControl>
                            <Text className="text-sm font-semibold text-slate-700 mb-2">Email Address</Text>
                            <Input variant="outline" size="lg" className="rounded-xl border-2 border-slate-200 focus:border-primary-500">
                                <InputSlot className="pl-4">
                                    <Icon as={Mail} size="lg" className="text-primary-500" />
                                </InputSlot>
                                <InputField 
                                    placeholder="your.email@example.com" 
                                    value={signinPayload.username} 
                                    onChangeText={(text) => onChangePayload("username", text)}
                                    className="text-base"
                                />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <Text className="text-sm font-semibold text-slate-700 mb-2">Password</Text>
                            <Input variant="outline" size="lg" className="rounded-xl border-2 border-slate-200 focus:border-primary-500">
                                <InputSlot className="pl-4">
                                    <Icon as={Lock} size="lg" className="text-primary-500" />
                                </InputSlot>
                                <InputField 
                                    type={isShowPassword ? "text" : "password"} 
                                    placeholder="Enter your password" 
                                    value={signinPayload.password} 
                                    onChangeText={(text) => onChangePayload("password", text)}
                                    className="text-base"
                                />
                                <InputSlot onTouchStart={() => setIsShowPassword(!isShowPassword)} className="pr-4">
                                    {!isShowPassword ? 
                                        <Icon as={Eye} size="lg" className="text-slate-400" /> : 
                                        <Icon as={EyeClosed} size="lg" className="text-slate-400" />
                                    }
                                </InputSlot>
                            </Input>
                        </FormControl>

                        <HStack className="justify-end">
                            <Link href="/forgot-password" className="text-primary-600 font-medium text-sm">
                                Forgot password?
                            </Link>
                        </HStack>

                        <Button 
                            size="xl" 
                            className="rounded-xl h-14 bg-gradient-to-r from-primary-500 to-emerald-600 shadow-lg"
                            onPress={submit}
                        >
                            <HStack className="items-center gap-2">
                                <LogIn size={20} className="text-white" />
                                <ButtonText className="font-bold text-base">Sign In</ButtonText>
                            </HStack>
                        </Button>

                        <HStack className="items-center gap-4 py-2">
                            <Divider className="flex-1 bg-slate-200" />
                            <Text className="text-sm text-slate-500">OR</Text>
                            <Divider className="flex-1 bg-slate-200" />
                        </HStack>

                        <AlternativeSigninButtons />
                    </VStack>

                    {/* Sign Up Link */}
                    <HStack className="justify-center gap-2 items-center">
                        <Text className="text-slate-600">Don't have an account?</Text>
                        <Link href="/sign-up" replace className="text-primary-600 font-bold">
                            Sign up
                        </Link>
                    </HStack>
                </VStack>
            </Center>
        </ScrollView>
    )
}