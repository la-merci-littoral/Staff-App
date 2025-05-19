import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { Loader, TicketX, ShieldCheck } from "lucide-react-native";
import { get, post } from "@/utils/rest";
import { IBooking } from "../../../../types/src";

export default function VerifyTicketPage() {

    const [hasRead, setReadStatus] = useState(false)
    const [number, setNumber] = useState('')
    const [validTicket, setTicketValidity] = useState(true)
    const [personName, setPersonName] = useState('')

    useEffect(() => {
        if (hasRead && !validTicket) {
            const timeout = setTimeout(() => {
                cleanUpCurrent()
            }, 1500) // 1.5 seconds, adjust as needed
            return () => clearTimeout(timeout)
        }
    }, [hasRead, validTicket])

    const [permission, requestPermission] = useCameraPermissions()
    if (!permission) {
        return (
            <View style={styles.container}></View>
        )
    }
    if (!permission.granted) {
        <View style={styles.container}>
            <Text>La permission d'accéder à la caméra est nécessaire</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
    }

    async function onCodeScan(scannedNumber: string) {
        if (!hasRead) {
            setReadStatus(true)
            try {
                setPersonName((await verifyTicket(scannedNumber))!)
                setTicketValidity(true)
            } catch {
                setTicketValidity(false)
            }
        }
    }

    async function verifyTicket(scannedNumber: string) {
        try {
            if (scannedNumber.match(/\d{6}/)){
                const response = await get<IBooking>('/entrances/check'+scannedNumber)
                if (response.status == 200){
                    return response.data.name + " " + response.data.surname
                } else {throw ''}
            } else {throw ''}
        } catch { throw '' }
    }

    function cleanUpCurrent() {
        setReadStatus(false)
        setTicketValidity(true)
        setPersonName('')
        setNumber('')
    }

    async function validateEntrance() {
        const response = await post('/events/tickets/confirm'+number)
        if (response.status == 200){
            cleanUpCurrent()
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ticket Validator</Text>
            <View style={styles.body}>
                <CameraView
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={(data) => onCodeScan(data.data)}
                    style={styles.cameraPreview}
                ></CameraView>
                {hasRead ?
                    (validTicket ? (
                        <View style={styles.infoBox}>
                            <Text style={{ ...styles.infoLabel, fontSize: 32 }}>{personName}</Text>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => validateEntrance()}>
                                <ShieldCheck color={Colors.cadet} />
                                <Text style={styles.buttonText}>Confirm entrance</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoBox}>
                            <TicketX size={40} color={Colors.pale} />
                            <Text style={styles.infoLabel}>Invalid ticket</Text>
                        </View>
                    )
                    ) : (
                        <View style={styles.infoBox}>
                            <Loader color={Colors.pale} size={40} />
                            <Text style={styles.infoLabel}>Waiting for scan</Text>
                        </View>
                    )}
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.lapis,
        height: "100%",
        display: "flex",
        gap: 20,
        alignItems: "center",
        justifyContent: 'space-evenly',
        flexGrow: 1
    },
    header: {
        fontFamily: "BrunoAceSC_400Regular",
        color: "white",
        fontSize: 26,
        marginTop: 20
    },
    body: {
        display: "flex",
        flexGrow: 1,
        width: "100%",
        alignContent: "center",
        gap: 30
    },
    cameraPreview: {
        borderRadius: 25,
        borderColor: "white",
        borderWidth: 1,
        height: "50%",
        width: "100%",
    },
    infoBox: {
        width: "100%",
        backgroundColor: Colors.cadet,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.pale,
        padding: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "35%"
    },
    infoLabel: {
        color: Colors.pale,
        fontFamily: "Oxanium_400Regular",
        fontSize: 20
    },
    confirmButton: {
        display: "flex",
        width: "90%",
        flexDirection: "row",
        padding: 15,
        backgroundColor: Colors.unitedNations,
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 25,
        borderColor: Colors.pale,
        marginTop: 30,
        borderWidth: 1
    },
    buttonText: {
        color: Colors.lapis,
        fontSize: 20
    }
})