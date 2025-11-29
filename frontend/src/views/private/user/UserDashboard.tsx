import ShadowBox from "@/src/components/custom/ShadowBox";
import { Box, Button, Fab, FabLabel, Heading, HStack, Text, VStack } from "@/src/components/ui";
import { interopIcons } from "@/src/utils/nativewind";
import { CalendarDays, CloudSun, Droplet, Leaf, Moon, PenLine, Plus, Sun, Thermometer, Trash, Sparkles } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import PopupAddPlant from "./components/PopupAddPlant";
import { useUtility } from "@/src/context/utiliity";
import { GardenInfoServfice } from "@/src/lib/api";
import PopupEditPlant from "./components/PopupEditPlant";
import { ButtonIcon } from "@/src/components/ui/button";
import { useAuth } from "@/src/context/auth";
import { getFromStorage } from "@/src/lib/utils";
import axios from "axios";
import { useRouter } from "expo-router";

interopIcons([CloudSun, Sun, Moon, Thermometer, Droplet, Leaf, Plus, PenLine]);

type DataType = {
    temperature: number | null,
    light: number | null,
    humidity: number | null,
    isOn: boolean,
}

export default function UserDashboard() {
    const router = useRouter();
    const { pushError, pushSuccess, pushAlertDialog } = useUtility();

    const COREIOT_BASE_URL = "https://app.coreiot.io";
    const JWT_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdXkubmd1eWVuaGFvQGhjbXV0LmVkdS52biIsInVzZXJJZCI6IjVjYjNhZjMwLTIwNDQtMTFmMC1hNjg5LWQ1NDRhOTUwNGMyNyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwic2Vzc2lvbklkIjoiMTdhMTcxN2EtMmRkYS00N2ZlLTg2MWItMTY2MmZkOWRhYzFjIiwiZXhwIjoxNzY0NDA0OTExLCJpc3MiOiJjb3JlaW90LmlvIiwiaWF0IjoxNzY0Mzk1OTExLCJmaXJzdE5hbWUiOiJEVVkiLCJsYXN0TmFtZSI6Ik5HVVnhu4ROIEjhuqBPIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjVjYTkwMGQwLTIwNDQtMTFmMC1hNjg5LWQ1NDRhOTUwNGMyNyIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAifQ.dQKblpy-SGz7Qf1SRXEsBUcPVlMN_60GHWQz5v3NXPo2vc1RrBb267FWJeqBAxFjsKd4CPsFkk6eWPLWv3gxaw";
    const DEVICE_ID = "a26d5e00-a518-11f0-b5f4-25fce636d3ff";

    const [counterRefresh, setCounterRefresh] = useState(0);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const [telemetry, setTelemetry] = useState<DataType>({
        temperature: null,
        light: null,
        humidity: null,
        isOn: false,
    });

    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                const url = `${COREIOT_BASE_URL}/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries`;
                const params = {
                    keys: "temperature,humidity,light,isOn",
                    limit: 1,
                };
                const headers = {
                    "X-Authorization": `Bearer ${JWT_TOKEN}`,
                };
                const res = await axios.get(url, { params, headers });
                const data = res.data;

                function readFloat(key: string) {
                    const arr = data[key] || [];
                    if (!arr.length) return null;
                    return parseFloat(arr[0].value);
                }
                function readBool(key: string) {
                    const arr = data[key] || [];
                    if (!arr.length) return false;
                    return arr[0].value === "true" || arr[0].value === true || arr[0].value === 1 || arr[0].value === "1";
                }

                setTelemetry({
                    temperature: readFloat("temperature"),
                    humidity: readFloat("humidity"),
                    light: readFloat("light"),
                    isOn: readBool("isOn"),
                });
            } catch (e) {
                // Xử lý lỗi nếu cần
            }
        };

        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 5000); // 5 giây

        return () => clearInterval(interval);
    }, []);

    const onCloseAddModal = () => {
        setIsOpenAddModal(false);
    }

    const [gardenInfo, setGardenInfo] = useState<GardenInfo>();
    const [currentTreeInfo, setCurrentTreeInfo] = useState<TreeInfo | null>(null);

    const onCloseEditModal = () => {
        setCurrentTreeInfo(null);
    }

    useEffect(() => {
        const fetchGardenInfo = async () => {
            const garden = new GardenInfoServfice();
            const res = await garden.getAllGardenInfo({current: 1, pageSize: 10});
            if (!res.success) {
                pushError({title: "Error", message: res.message});
                return;
            }
            setGardenInfo(res.data)
        };
        fetchGardenInfo();
    }, [counterRefresh]);

    const refresh = () => {
        setCounterRefresh((prev) => prev + 1);
    }

    const deletePlant = async (id: string) => {
        const del = () => {
            const garden = new GardenInfoServfice();
            garden.deleteGardenInfo(id).then((res) => {
                if (!res.success) {
                    pushError({title: "Error", message: res.message});
                    return;
                }
                pushSuccess({title: "Success", message: "Plant deleted successfully"});
                refresh();
            })
        }
        pushAlertDialog({
            title: "Delete plant",
            message: "Are you sure you want to delete this plant?",
            onConfirmText: "Delete",
            onConfirm: del,
        })
    }

    return (
        <Fragment>
            <PopupAddPlant isOpen={isOpenAddModal} onClose={onCloseAddModal} refresh={refresh} />
            {currentTreeInfo && <PopupEditPlant currentPlant={currentTreeInfo} isOpen={currentTreeInfo != null} onClose={onCloseEditModal} refresh={refresh} />}
            <Fab onPress={() => setIsOpenAddModal(true)}>
                <Leaf color="white" size={16} />
                <Plus color="white" size={12} className="absolute bottom-2 left-6" />
                <FabLabel>Add plant</FabLabel>
            </Fab>
            <ScrollView className="bg-background-0 h-screen p-4">
                <VStack className="flex-1 items-center gap-4 mb-20">
                    <Heading className="text-2xl font-semibold text-primary-500">Welcome</Heading>
                    <Box className="w-full h-fit bg-background-0 rounded-xl border border-slate-200 shadow-md shadow-slate-200 p-4">
                        <Heading className="text-primary-500">Weather</Heading>
                        <VStack className="w-full h-fit gap-4">
                            <HStack className="items-end gap-2">
                                <CloudSun size={40} className="text-primary-500" />
                                <Heading className="text-2xl text-black font-medium">
                                    {telemetry.temperature !== null ? `${telemetry.temperature.toFixed(2)} \u00b0` : "--"}
                                </Heading>
                                <Text className="text-xl ml-auto text-black font-medium">Smart drip farm</Text>
                            </HStack>
                            <HStack className="gap-4">
                                <ShadowBox className="h-fit">
                                    <HStack className="flex-1 justify-start items-center p-4 gap-4">
                                        <Droplet className="text-primary-500" />
                                        <VStack>
                                            <Text className="font-semibold text-2xs">Pump</Text>
                                            <Text>{telemetry.isOn ? "On" : "Off"}</Text>
                                        </VStack>
                                    </HStack>
                                </ShadowBox>
                                <ShadowBox className="h-fit">
                                    <HStack className="flex-1 justify-start items-center p-4 gap-4">
                                        <Thermometer className="text-primary-500" />
                                        <VStack>
                                            <Text className="font-semibold text-2xs">Thermometer</Text>
                                            <Text>
                                                {telemetry.temperature !== null ? `${telemetry.temperature.toFixed(2)} \u00b0` : "--"}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ShadowBox>
                            </HStack>
                            <HStack className="gap-4">
                                <ShadowBox className="h-fit">
                                    <HStack className="flex-1 justify-start items-center p-4 gap-4">
                                        <Sun className="text-primary-500" />
                                        <VStack>
                                            <Text className="font-semibold text-2xs">Light</Text>
                                            <Text>
                                                {telemetry.light !== null ? `${telemetry.light.toFixed(2)}` : "--"}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ShadowBox>
                                <ShadowBox className="h-fit">
                                    <HStack className="flex-1 justify-start items-center p-4 gap-4">
                                        <Droplet className="text-primary-500" />
                                        <VStack>
                                            <Text className="font-semibold text-2xs">Humidity</Text>
                                            <Text>
                                                {telemetry.humidity !== null ? `${telemetry.humidity.toFixed(2)} %` : "--"}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </ShadowBox>
                            </HStack>
                        </VStack>
                    </Box>
                    {/* AI Scan Button - Full Width */}
                    <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl h-16"
                        onPress={() => router.push('/user/leaf-scan')}
                    >
                        <HStack className="items-center gap-3">
                            <Sparkles size={24} className="text-white" />
                            <Text className="text-white font-bold text-base">AI Disease Detection</Text>
                        </HStack>
                    </Button>

                    <Box className="w-full h-fit bg-background-0 rounded-xl border border-slate-200 shadow-md shadow-slate-200 p-4">
                        <HStack className="justify-between w-full">
                            <Heading className="text-primary-500">Plants info</Heading>       
                        </HStack>
                        <VStack className="gap-4 pt-4">
                            {gardenInfo?.gardenInfos.map(plant => (
                                <ShadowBox key={plant._id} className="w-full">
                                    <HStack className="flex-1 items-center p-4 gap-4">
                                        <Leaf className="text-primary-500" />
                                        <VStack>
                                            <Text className="font-semibold text-2xs">{plant.treeType}</Text>
                                            <Text>{`${plant.numOfTree} plants`}</Text>
                                            <Text>{`${ new Date(new Date(plant.cropStart).getTime() * 1000).toDateString() }`}</Text>
                                        </VStack>
                                        <Button size="xs" action="negative" onPress={() => deletePlant(plant._id)} className="ml-auto rounded-md px-2">
                                            <ButtonIcon as={Trash} size="sm"     />
                                        </Button>
                                        <Button size="xs" onPress={() => setCurrentTreeInfo(plant)} className="rounded-md px-2">
                                            <ButtonIcon as={PenLine} size="sm" />
                                        </Button>
                                    </HStack>
                                </ShadowBox>
                            ))}
                        </VStack>
                    </Box>

                </VStack>
            </ScrollView>
        </Fragment>
    )
}