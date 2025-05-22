import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { Loader, TicketX, ShieldCheck } from "lucide-react-native";
import { get, post } from "@/utils/rest";
import { EntranceCheckRes, IBooking } from "../../../../types/src";

export default function VerifyTicketPage() {

    const [hasRead, setReadStatus] = useState(false)
    const [number, setNumber] = useState('')
    const [validTicket, setTicketValidity] = useState(true)
    const [person, setPerson] = useState<Partial<EntranceCheckRes>>({})

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
        requestPermission()
    }

    async function onCodeScan(scannedNumber: string) {
        if (!hasRead) {
            setReadStatus(true)
            setNumber(scannedNumber)
            try {
                setPerson((await verifyTicket(scannedNumber))!)
                setTicketValidity(true)
            } catch {
                setTicketValidity(false)
            }
        }
    }

    async function verifyTicket(scannedNumber: string) {
        if (scannedNumber.match(/\d{6}/)){
            const response = await get<EntranceCheckRes>('/entrances/check/'+scannedNumber)
            if (response.status == 200){
                return response.data
            } else {throw new Error}
        } else {throw new Error}
    }

    function cleanUpCurrent() {
        setReadStatus(false)
        setTicketValidity(true)
        setPerson({})
        setNumber('')
    }

    async function validateEntrance() {
        const response = await post('/entrances/confirm/'+number)
        if (response.status == 200){
            cleanUpCurrent()
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Vérification de tickets</Text>
            <View style={styles.body}>
                <CameraView
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={(data) => onCodeScan(data.data)}
                    style={styles.cameraPreview}
                ></CameraView>
                {person.name ?
                    (validTicket ? (
                        <View style={[styles.infoBox, { backgroundColor: person.vip ? Colors.gold : Colors.cadet }]}>
                            <View style={[styles.infoSection, {paddingBottom: 10}]}>
                                <Text style={{ ...styles.infoLabel, fontSize: 32 }}>{person.name! + " " + person.surname!}</Text>
                                <Text style={styles.infoLabel} >et {person.attendants! - 1} accompagnants</Text>
                            </View>
                            <View style={styles.infoSection}>
                                <Text style={styles.infoLabel}>Pour l'évènement :</Text>
                                <Text style={[styles.infoLabel, {fontWeight: 'bold'}]}>{person.event_name}</Text>
                            </View>
                            <View style={styles.infoSection}>
                                <Text style={styles.infoLabel}>Catégorie :</Text>
                                <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>{person.category}</Text>
                            </View>
                            <TouchableOpacity style={styles.confirmButton} onPress={validateEntrance}>
                                <ShieldCheck color={Colors.pale} />
                                <Text style={styles.buttonText} >Valider l'entrée</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoBox}>
                            <TicketX size={40} color={Colors.pale} />
                            <Text style={styles.infoLabel}>Ticket invalide</Text>
                        </View>
                    )
                    ) : (
                        <View style={styles.infoBox}>
                            <Loader color={Colors.pale} size={40} />
                            <Text style={styles.infoLabel}>En attente de scan</Text>
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
        fontFamily: "Nunito_400Regular",
        color: "white",
        fontSize: 26,
        marginTop: 20
    },
    body: {
        display: "flex",
        flexGrow: 1,
        width: "100%",
        alignContent: "center",
        gap: 30,
        maxWidth: 500,
    },
    cameraPreview: {
        borderRadius: 25,
        borderColor: Colors.argentinian,
        borderWidth: 1,
        height: "30%",
        width: "100%",
    },
    infoBox: {
        width: "100%",
        backgroundColor: Colors.cadet,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.argentinian,
        padding: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        //height: "35%"
        flexGrow: 1,
    },
    infoSection: { 
        display: "flex", 
        gap: 0, 
        alignItems: "center" 
    },
    infoLabel: {
        color: Colors.pale,
        fontFamily: "Nunito_400Regular",
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
        color: Colors.pale,
        fontSize: 20
    }
})