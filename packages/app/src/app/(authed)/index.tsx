import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import useStaffStore from "@/stores/staffStore";
import { Href, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import {  LogOut, LucideIcon, TicketCheck, UserSearch } from "lucide-react-native";
import type { LucideProps } from "lucide-react";
import type React from "react";

function MenuItem(props: {icon: LucideIcon, label: string, onPress: () => void, style: object}) {

    const styles = StyleSheet.create({
        menuItem: {
            padding: 10,
            backgroundColor: Colors.cadet,
            borderRadius: 10,
            borderColor: Colors.argentinian,
            borderWidth: 1,
            width: "100%",
            fontFamily: "Nunito_400Regular",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
        },
        menuLabel: {
            color: Colors.pale,
            fontFamily: "Nunito_400Regular",
            fontSize: 24,
        }
    })

    // Assign the icon component to a capitalized variable
    const IconComponent = props.icon;

    return (
        <TouchableOpacity style={[styles.menuItem, props.style]} onPress={props.onPress}>
            <IconComponent size={60} color={Colors.pale} />
            <Text style={styles.menuLabel}>{props.label}</Text>
        </TouchableOpacity>
    );
}

export default function Index() {

    const { logout, token } = useStaffStore();

    useEffect(() => { }, [useStaffStore(state => state.token)]);
    if (!token) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>Staff Panel</Text>
                <View style={styles.menuList}>
                    <MenuItem
                        icon={UserSearch}
                        label="Validation d'adhésion"
                        onPress={() => router.push("/verifMember")}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        icon={TicketCheck} 
                        label="Vérification de tickets" 
                        onPress={() => router.push("/verifTicket")}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        icon={LogOut}
                        label="Déconnexion"
                        onPress={logout}
                        style={styles.menuItem}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.lapis,
        height: "100%",
    },
    wrapper: {
        width: "90%",
        alignItems: "center",
        height: "100%",
    },
    title: {
        fontSize: 26,
        marginBottom: 20,
        color: Colors.pale,
        fontFamily: "Nunito_400Regular",
    },
    menuList: {
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        gap: 15,
        marginBottom: 20,
        flexGrow: 1
    },
    menuItem: {
        flexGrow: 1,
        maxHeight: 200
    }
});
