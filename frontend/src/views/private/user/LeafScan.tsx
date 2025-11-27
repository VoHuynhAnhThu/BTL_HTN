import React, { useState } from 'react';
import { ScrollView, Image, ActivityIndicator, View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { VStack, Button, ButtonText, Text, HStack, Box, Heading } from '@/src/components/ui';
import * as ImagePicker from 'expo-image-picker';
import { AiInferenceService } from '@/src/lib/api';
import { useUtility } from '@/src/context/utiliity';
import { interopIcons } from '@/src/utils/nativewind';
import { Sparkles, ImagePlus, ScanSearch, AlertCircle, CheckCircle2, Leaf } from 'lucide-react-native';

interopIcons([Sparkles, ImagePlus, ScanSearch, AlertCircle, CheckCircle2, Leaf]);

interface InferenceResult {
  diseasesDetected?: string[];
  classPercents?: Record<string, number>;
  maskOverlayBase64?: string;
}

export default function LeafScan() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [overlay, setOverlay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ai = new AiInferenceService();
  const { pushWarning } = useUtility();

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      pushWarning({ title: 'Không có quyền truy cập thư viện ảnh' });
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0].uri);
      setResult(null);
      setOverlay(null);
    }
  };

  const infer = async () => {
    if (!image) {
      pushWarning({ title: 'Chưa chọn ảnh lá' });
      return;
    }
    setLoading(true);
    const r = await ai.inferImage(image);
    setLoading(false);
    if (!r.success) {
      pushWarning({ title: 'Lỗi AI', message: r.message });
      return;
    }
    const data: InferenceResult = {
      diseasesDetected: Array.isArray(r.data?.diseasesDetected) ? r.data.diseasesDetected : [],
      classPercents: r.data?.classPercents || undefined,
      maskOverlayBase64: r.data?.maskOverlayBase64,
    };
    setResult(data);
    if (data.maskOverlayBase64) {
      setOverlay(`data:image/png;base64,${data.maskOverlayBase64}`);
    }
  };

  // Get the disease with highest percentage from diseasesDetected and classPercents
  const getTopDisease = () => {
    if (!result?.diseasesDetected || result.diseasesDetected.length === 0) return null;
    
    // Get the first disease from diseasesDetected (should be the one with highest %)
    const topDiseaseName = result.diseasesDetected[0];
    
    // Check if it's healthy
    const isHealthy = topDiseaseName.toLowerCase().includes('healthy') || 
                      topDiseaseName.toLowerCase().includes('khỏe') ||
                      topDiseaseName.toLowerCase().includes('normal');
    
    return { name: topDiseaseName, isHealthy };
  };

  const topDisease = getTopDisease();
  const hasDisease = topDisease && !topDisease.isHealthy;

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
          <VStack className="gap-4 px-4 py-4 max-w-2xl mx-auto w-full">
            {/* Header */}
            <VStack className="gap-2 items-center text-center">
              <View className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full p-3 shadow-lg">
                <Sparkles size={24} className="text-white" />
              </View>
              <Heading className="text-2xl font-bold text-slate-800">AI Phát Hiện Bệnh Cây</Heading>
              <Text className="text-sm text-slate-600 leading-relaxed px-2">
                Sử dụng AI để phát hiện bệnh trên lá cây ngay lập tức.
              </Text>
            </VStack>

            {/* Image Upload Card */}
            <Box className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <VStack className="p-4 gap-3">
                <HStack className="items-center gap-2">
                  <ImagePlus size={18} className="text-emerald-600" />
                  <Text className="text-base font-semibold text-slate-800">Chọn hình ảnh</Text>
                </HStack>
                
                {!image ? (
                  <Button 
                    size="lg" 
                    onPress={pickImage}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl h-14 shadow-lg"
                  >
                    <HStack className="items-center gap-2">
                      <ImagePlus size={20} className="text-white" />
                      <ButtonText className="text-base font-semibold">Tải ảnh lá từ thiết bị</ButtonText>
                    </HStack>
                  </Button>
                ) : (
                  <VStack className="gap-2">
                    <View className="relative rounded-lg overflow-hidden border-2 border-emerald-200">
                      <Image 
                        source={{ uri: image }} 
                        style={{ width: '100%', height: 240 }} 
                        resizeMode="cover" 
                      />
                      <View className="absolute top-2 right-2">
                        <View className="bg-emerald-500 rounded-full px-2 py-1">
                          <Text className="text-white text-xs font-bold">✓ Đã chọn</Text>
                        </View>
                      </View>
                    </View>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onPress={pickImage}
                      className="border-2 border-slate-300 rounded-lg"
                    >
                      <HStack className="items-center gap-2">
                        <ImagePlus size={16} className="text-slate-600" />
                        <ButtonText className="text-sm text-slate-700">Chọn ảnh khác</ButtonText>
                      </HStack>
                    </Button>
                  </VStack>
                )}
              </VStack>
            </Box>

            {/* Analyze Button */}
            {image && (
              <Button 
                size="lg" 
                onPress={infer} 
                disabled={loading || !image}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl h-14 shadow-xl"
              >
                {loading ? (
                  <HStack className="items-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <ButtonText className="text-base font-bold">Đang phân tích...</ButtonText>
                  </HStack>
                ) : (
                  <HStack className="items-center gap-2">
                    <ScanSearch size={22} className="text-white" />
                    <ButtonText className="text-base font-bold">Phân tích với AI</ButtonText>
                  </HStack>
                )}
              </Button>
            )}

            {/* Results Card */}
            {result && topDisease && (
              <Box className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <VStack className="gap-0">
                  {/* Header */}
                  <View className={`p-4 ${hasDisease ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                    <HStack className="items-center gap-2">
                      {hasDisease ? (
                        <AlertCircle size={22} className="text-red-600" />
                      ) : (
                        <CheckCircle2 size={22} className="text-green-600" />
                      )}
                      <VStack className="flex-1">
                        <Text className="text-lg font-bold text-slate-800">
                          {hasDisease ? '⚠️ Phát hiện bệnh' : '✅ Lá khỏe mạnh'}
                        </Text>
                        <Text className="text-xs text-slate-600">
                          {hasDisease ? 'Cây có dấu hiệu bệnh' : 'Không phát hiện bệnh'}
                        </Text>
                      </VStack>
                    </HStack>
                  </View>

                  {/* Disease Information */}
                  <VStack className="p-4 gap-3">
                    {hasDisease ? (
                      <VStack className="gap-2">
                        <Text className="text-sm font-semibold text-slate-700">Bệnh được phát hiện:</Text>
                        <Box className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
                          <HStack className="items-center gap-2">
                            <View className="bg-red-100 rounded-full p-2">
                              <Leaf size={20} className="text-red-600" />
                            </View>
                            <VStack className="flex-1">
                              <Text className="text-base font-bold text-red-800">{topDisease.name}</Text>
                              {/* <Text className="text-xs text-red-600">Độ tin cậy: {topDisease.percent.toFixed(1)}%</Text> */}
                            </VStack>
                          </HStack>
                        </Box>
                        <Box className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                          <Text className="text-xs text-amber-800">
                            💡 <Text className="font-semibold">Khuyến nghị:</Text> Xử lý ngay để tránh lây lan.
                          </Text>
                        </Box>
                      </VStack>
                    ) : (
                      <VStack className="gap-2">
                        <Box className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                          <HStack className="items-center gap-2">
                            <View className="bg-green-100 rounded-full p-2">
                              <CheckCircle2 size={20} className="text-green-600" />
                            </View>
                            <VStack className="flex-1">
                              <Text className="text-base font-bold text-green-800">Không có bệnh</Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                          <Text className="text-xs text-blue-800">
                            ✓ <Text className="font-semibold">Khuyến nghị:</Text> Tiếp tục chăm sóc và theo dõi định kỳ.
                          </Text>
                        </Box>
                      </VStack>
                    )}

                    {/* Progress Bar */}
                    {/* <VStack className="gap-1 mt-1">
                      <HStack className="justify-between items-center">
                        <Text className="text-xs text-slate-600 font-medium">Độ chính xác AI</Text>
                        <Text className="text-xs font-bold text-primary-600">{topDisease.percent.toFixed(1)}%</Text>
                      </HStack>
                      <View className="bg-slate-200 rounded-full h-2 overflow-hidden">
                        <View 
                          className={`h-full rounded-full ${hasDisease ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                          style={{ width: `${topDisease.percent}%` }}
                        />
                      </View>
                    </VStack> */}
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Overlay Image */}
            {overlay && (
              <Box className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <VStack className="p-4 gap-3">
                  <HStack className="items-center gap-2">
                    <ScanSearch size={18} className="text-purple-600" />
                    <Text className="text-base font-semibold text-slate-800">Vùng bệnh</Text>
                  </HStack>
                  <View className="rounded-lg overflow-hidden border-2 border-purple-200">
                    <Image 
                      source={{ uri: overlay }} 
                      style={{ width: '100%', height: 240 }} 
                      resizeMode="contain" 
                    />
                  </View>
                </VStack>
              </Box>
            )}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

