import React, { useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { VStack, HStack, Box, Heading, Text, Button, ButtonText, Input, InputField } from '@/src/components/ui';
import { interopIcons } from '@/src/utils/nativewind';
import { Wifi, Globe, Server, Settings, CheckCircle2, ChevronRight, Copy, QrCode } from 'lucide-react-native';
import ShadowBox from '@/src/components/custom/ShadowBox';

interopIcons([Wifi, Globe, Server, Settings, CheckCircle2, ChevronRight, Copy, QrCode]);

export default function DeviceSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [serverHost, setServerHost] = useState('192.168.4.1');
  const [authMethod, setAuthMethod] = useState<'default' | 'custom'>('default');

  const steps = [
    { number: 1, title: 'Kết nối WiFi', icon: Wifi, color: 'blue' },
    { number: 2, title: 'Truy cập Web', icon: Globe, color: 'emerald' },
    { number: 3, title: 'Cấu hình WiFi', icon: Settings, color: 'purple' },
    { number: 4, title: 'Cấu hình Server', icon: Server, color: 'orange' },
    { number: 5, title: 'Hoàn tất', icon: CheckCircle2, color: 'green' },
  ];

  const StepIndicator = ({ step, isActive, isCompleted }: any) => {
    const Icon = step.icon;
    const colorMap: any = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
    };
    const colors = colorMap[step.color];

    return (
      <HStack className="items-center gap-3">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${isCompleted ? colors.bg : isActive ? `border-2 ${colors.border} bg-white` : 'bg-slate-200'}`}>
          <Icon size={24} className={isCompleted || isActive ? colors.text : 'text-slate-400'} />
        </View>
        <VStack className="flex-1">
          <Text className={`text-xs font-semibold ${isActive ? colors.text : 'text-slate-500'}`}>
            Bước {step.number}
          </Text>
          <Text className={`text-sm ${isActive ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
            {step.title}
          </Text>
        </VStack>
        {step.number < 5 && (
          <ChevronRight size={20} className="text-slate-300" />
        )}
      </HStack>
    );
  };

  return (
    <ScrollView className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <VStack className="gap-6 px-6 py-8">
        {/* Header */}
        <VStack className="gap-3 items-center">
          <View className="bg-primary-500 rounded-full p-4">
            <Settings size={32} className="text-white" />
          </View>
          <Heading className="text-2xl font-bold text-slate-800 text-center">
            Cài đặt thiết bị IoT
          </Heading>
          <Text className="text-sm text-slate-600 text-center leading-relaxed">
            Làm theo hướng dẫn từng bước để kết nối SmartDrip với WiFi và server
          </Text>
        </VStack>

        {/* Progress Steps */}
        <Box className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5">
          <VStack className="gap-4">
            {steps.map((step, idx) => (
              <StepIndicator
                key={step.number}
                step={step}
                isActive={currentStep === step.number}
                isCompleted={currentStep > step.number}
              />
            ))}
          </VStack>
        </Box>

        {/* Step 1: WiFi Connection */}
        {currentStep === 1 && (
          <ShadowBox className="p-6 gap-4">
            <HStack className="items-center gap-3">
              <View className="bg-blue-100 rounded-full p-3">
                <Wifi size={24} className="text-blue-600" />
              </View>
              <Heading className="text-lg font-bold text-slate-800">
                1. Tìm và kết nối WiFi
              </Heading>
            </HStack>

            <VStack className="gap-3">
              <Text className="text-sm text-slate-700 leading-relaxed">
                Tìm kiếm mạng WiFi có định dạng:
              </Text>
              <Box className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <Text className="font-mono text-base font-bold text-blue-800 text-center">
                  ABC_IDH_INVERTER_DATALOGGER_****
                </Text>
              </Box>
              <Text className="text-xs text-slate-500">
                **** là 4 số cuối của Device ID
              </Text>

              <View className="bg-slate-100 rounded-xl p-4 my-2">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=WiFi+Settings+Screenshot' }}
                  style={{ width: '100%', height: 200, borderRadius: 12 }}
                  resizeMode="contain"
                />
              </View>

              <HStack className="items-center gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200">
                <Text className="text-xs text-amber-800">
                  💡 <Text className="font-semibold">Tip:</Text> Bật WiFi trên điện thoại và tìm trong danh sách mạng khả dụng
                </Text>
              </HStack>
            </VStack>

            <Button 
              size="lg" 
              className="bg-blue-500 rounded-xl mt-2"
              onPress={() => setCurrentStep(2)}
            >
              <HStack className="items-center gap-2">
                <ButtonText className="font-bold">Tiếp theo</ButtonText>
                <ChevronRight size={20} className="text-white" />
              </HStack>
            </Button>
          </ShadowBox>
        )}

        {/* Step 2: Open Browser */}
        {currentStep === 2 && (
          <ShadowBox className="p-6 gap-4">
            <HStack className="items-center gap-3">
              <View className="bg-emerald-100 rounded-full p-3">
                <Globe size={24} className="text-emerald-600" />
              </View>
              <Heading className="text-lg font-bold text-slate-800">
                2. Mở trình duyệt web
              </Heading>
            </HStack>

            <VStack className="gap-3">
              <Text className="text-sm text-slate-700 leading-relaxed">
                Sau khi kết nối WiFi thành công, mở trình duyệt và truy cập:
              </Text>
              
              <Box className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
                <HStack className="items-center justify-between">
                  <Text className="font-mono text-lg font-bold text-emerald-800">
                    192.168.4.1
                  </Text>
                  <Button size="xs" variant="solid" className="bg-emerald-600">
                    <HStack className="items-center gap-1">
                      <Copy size={14} className="text-white" />
                      <ButtonText className="text-xs">Copy</ButtonText>
                    </HStack>
                  </Button>
                </HStack>
              </Box>

              <Text className="text-xs text-slate-500 italic">
                Hoặc quét mã QR trên thiết bị (nếu có)
              </Text>

              <View className="bg-slate-100 rounded-xl p-4 my-2">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x250/10b981/ffffff?text=Browser+Address+Bar' }}
                  style={{ width: '100%', height: 250, borderRadius: 12 }}
                  resizeMode="contain"
                />
              </View>
            </VStack>

            <HStack className="gap-3">
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 border-2 border-slate-300 rounded-xl"
                onPress={() => setCurrentStep(1)}
              >
                <ButtonText className="text-slate-700">Quay lại</ButtonText>
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-emerald-500 rounded-xl"
                onPress={() => setCurrentStep(3)}
              >
                <HStack className="items-center gap-2">
                  <ButtonText className="font-bold">Tiếp theo</ButtonText>
                  <ChevronRight size={20} className="text-white" />
                </HStack>
              </Button>
            </HStack>
          </ShadowBox>
        )}

        {/* Step 3: Configure WiFi */}
        {currentStep === 3 && (
          <ShadowBox className="p-6 gap-4">
            <HStack className="items-center gap-3">
              <View className="bg-purple-100 rounded-full p-3">
                <Settings size={24} className="text-purple-600" />
              </View>
              <Heading className="text-lg font-bold text-slate-800">
                3. Cấu hình WiFi
              </Heading>
            </HStack>

            <VStack className="gap-4">
              <Text className="text-sm text-slate-700 leading-relaxed">
                Nhập thông tin WiFi mà bạn muốn thiết bị kết nối:
              </Text>

              <VStack className="gap-3">
                <VStack className="gap-2">
                  <Text className="text-sm font-semibold text-slate-700">Tên WiFi (SSID)</Text>
                  <Input variant="outline" size="md" className="border-2">
                    <InputField 
                      placeholder="Nhập tên WiFi của bạn"
                      value={wifiSSID}
                      onChangeText={setWifiSSID}
                    />
                  </Input>
                </VStack>

                <VStack className="gap-2">
                  <Text className="text-sm font-semibold text-slate-700">Mật khẩu WiFi</Text>
                  <Input variant="outline" size="md" className="border-2">
                    <InputField 
                      placeholder="Nhập mật khẩu"
                      value={wifiPassword}
                      onChangeText={setWifiPassword}
                      secureTextEntry
                    />
                  </Input>
                </VStack>
              </VStack>

              <View className="bg-slate-100 rounded-xl p-4 my-2">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x280/9333ea/ffffff?text=WiFi+Config+Form' }}
                  style={{ width: '100%', height: 280, borderRadius: 12 }}
                  resizeMode="contain"
                />
              </View>

              <Box className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <Text className="text-xs text-purple-800">
                  ⚠️ Đảm bảo thiết bị và điện thoại cùng kết nối một mạng WiFi 2.4GHz
                </Text>
              </Box>

              <Button 
                size="lg" 
                className="bg-green-500 rounded-xl"
                onPress={() => setCurrentStep(4)}
              >
                <HStack className="items-center gap-2">
                  <ButtonText className="font-bold">KẾT NỐI THỬ CÔNG</ButtonText>
                  <CheckCircle2 size={20} className="text-white" />
                </HStack>
              </Button>
            </VStack>

            <HStack className="gap-3">
              <Button 
                size="md" 
                variant="outline"
                className="flex-1 border-2 border-slate-300 rounded-xl"
                onPress={() => setCurrentStep(2)}
              >
                <ButtonText className="text-slate-700">Quay lại</ButtonText>
              </Button>
            </HStack>
          </ShadowBox>
        )}

        {/* Step 4: Server Config */}
        {currentStep === 4 && (
          <ShadowBox className="p-6 gap-4">
            <HStack className="items-center gap-3">
              <View className="bg-orange-100 rounded-full p-3">
                <Server size={24} className="text-orange-600" />
              </View>
              <Heading className="text-lg font-bold text-slate-800">
                4. Cấu hình Server
              </Heading>
            </HStack>

            <VStack className="gap-4">
              <Text className="text-sm text-slate-700 leading-relaxed">
                Chọn phương thức gửi dữ liệu:
              </Text>

              {/* Auth Method Selection */}
              <VStack className="gap-3">
                <Button
                  size="lg"
                  variant={authMethod === 'default' ? 'solid' : 'outline'}
                  className={`rounded-xl ${authMethod === 'default' ? 'bg-orange-500' : 'border-2 border-slate-300'}`}
                  onPress={() => setAuthMethod('default')}
                >
                  <HStack className="items-center gap-2">
                    {authMethod === 'default' && <CheckCircle2 size={20} className="text-white" />}
                    <ButtonText className={authMethod === 'default' ? 'text-white font-bold' : 'text-slate-700'}>
                      Mặc định (Server ứng dụng)
                    </ButtonText>
                  </HStack>
                </Button>

                <Button
                  size="lg"
                  variant={authMethod === 'custom' ? 'solid' : 'outline'}
                  className={`rounded-xl ${authMethod === 'custom' ? 'bg-orange-500' : 'border-2 border-slate-300'}`}
                  onPress={() => setAuthMethod('custom')}
                >
                  <HStack className="items-center gap-2">
                    {authMethod === 'custom' && <CheckCircle2 size={20} className="text-white" />}
                    <ButtonText className={authMethod === 'custom' ? 'text-white font-bold' : 'text-slate-700'}>
                      Nâng cao (Server tùy chỉnh)
                    </ButtonText>
                  </HStack>
                </Button>
              </VStack>

              {authMethod === 'custom' && (
                <VStack className="gap-3">
                  <VStack className="gap-2">
                    <Text className="text-sm font-semibold text-slate-700">Hostname / Địa chỉ Server</Text>
                    <Input variant="outline" size="md" className="border-2">
                      <InputField 
                        placeholder="vd: mqtt.yourserver.com"
                        value={serverHost}
                        onChangeText={setServerHost}
                      />
                    </Input>
                  </VStack>

                  <VStack className="gap-2">
                    <Text className="text-sm font-semibold text-slate-700">Username</Text>
                    <Input variant="outline" size="md" className="border-2">
                      <InputField placeholder="MQTT Username" />
                    </Input>
                  </VStack>

                  <VStack className="gap-2">
                    <Text className="text-sm font-semibold text-slate-700">Password</Text>
                    <Input variant="outline" size="md" className="border-2">
                      <InputField placeholder="MQTT Password" secureTextEntry />
                    </Input>
                  </VStack>
                </VStack>
              )}

              <View className="bg-slate-100 rounded-xl p-4 my-2">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x240/f97316/ffffff?text=Server+Config+UI' }}
                  style={{ width: '100%', height: 240, borderRadius: 12 }}
                  resizeMode="contain"
                />
              </View>

              <Button 
                size="lg" 
                className="bg-green-500 rounded-xl"
                onPress={() => setCurrentStep(5)}
              >
                <HStack className="items-center gap-2">
                  <ButtonText className="font-bold">LƯU CẤU HÌNH SERVER</ButtonText>
                  <CheckCircle2 size={20} className="text-white" />
                </HStack>
              </Button>
            </VStack>

            <HStack className="gap-3">
              <Button 
                size="md" 
                variant="outline"
                className="flex-1 border-2 border-slate-300 rounded-xl"
                onPress={() => setCurrentStep(3)}
              >
                <ButtonText className="text-slate-700">Quay lại</ButtonText>
              </Button>
            </HStack>
          </ShadowBox>
        )}

        {/* Step 5: Completion */}
        {currentStep === 5 && (
          <ShadowBox className="p-8 gap-6 items-center">
            <View className="bg-green-100 rounded-full p-6">
              <CheckCircle2 size={64} className="text-green-600" />
            </View>
            
            <VStack className="gap-3 items-center">
              <Heading className="text-2xl font-bold text-slate-800 text-center">
                Cài đặt hoàn tất! 🎉
              </Heading>
              <Text className="text-base text-slate-600 text-center leading-relaxed">
                Thiết bị SmartDrip đã được cấu hình thành công. Bây giờ bạn có thể cập nhật firmware hoặc quay về dashboard.
              </Text>
            </VStack>

            <Box className="bg-green-50 rounded-xl p-4 border-2 border-green-200 w-full">
              <VStack className="gap-2">
                <HStack className="items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <Text className="text-sm font-semibold text-green-800">WiFi đã kết nối</Text>
                </HStack>
                <HStack className="items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <Text className="text-sm font-semibold text-green-800">Server đã cấu hình</Text>
                </HStack>
                <HStack className="items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <Text className="text-sm font-semibold text-green-800">Sẵn sàng sử dụng</Text>
                </HStack>
              </VStack>
            </Box>

            <VStack className="gap-3 w-full">
              <Button 
                size="lg" 
                className="bg-blue-500 rounded-xl w-full"
                onPress={() => {/* Navigate to firmware update */}}
              >
                <ButtonText className="font-bold">CẬP NHẬT FIRMWARE (OTA)</ButtonText>
              </Button>

              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-slate-300 rounded-xl w-full"
                onPress={() => setCurrentStep(1)}
              >
                <ButtonText className="text-slate-700">Về Dashboard</ButtonText>
              </Button>
            </VStack>
          </ShadowBox>
        )}
      </VStack>
    </ScrollView>
  );
}
