/**
 * TM352 23J TMA02 Q1, code
 *
 * 26/10/2023 Intial version Chris Thomson
 * 14/12/2023 Line 74 modified to getDate rather than getDay Chris Thomson
 * 
 * This is the main application code for the React Native application.
 * It is a simple application that allows a user to register a userid
 * and then make a taxi request or offer.
 * 
 * The application uses the Expo framework to provide access to the
 * device GPS and to provide a simple UI.
 * 
 * The application uses the TaxiService library to access the taxi
 * service API.
 * 
 * The application uses the NominatimService library to access the
 * Nominatim service to lookup the address of the current GPS location.
 * 
 * The application uses the TimePicker, AddressPicker and WaitTime
 * components to provide a simple UI.
 **/

import { Text, TextInput, Button, SafeAreaView, View, StyleSheet, GestureResponderEvent, Alert, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import TimePicker from './components/TimePicker';
import AddressPicker from './components/AddressPicker';
import WaitTime from './components/WaitTime';
import { getLocationAddress } from './libraries/NominatimService';
import * as Taxi from './libraries/TaxiService';
import * as Location from 'expo-location';

/**
 * Requests user permission to get the GPS location of the device.
 * This needs to be called before the GPS is read.
 * 
 * @returns true if permission is granted, otherwise throws an error.
 */
async function getUserPermission(): Promise<boolean> {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw('Permission to access location was denied, please check your device settings.');
  } else {
    return true;
  }
}

export default function App() {
  // State variables to hold the data entered by the user.
  const [ownerAddress, setOwnerAddress] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [ownerHours, setOwnerHours] = useState("0");
  const [ownerMinutes, setOwnerMinutes] = useState("0");
  const [ownerMatches, setOwnerMatches] = useState("");
  const [customerHours, setCustomerHours] = useState("0");
  const [customerMinutes, setCustomerMinutes] = useState("0");
  const [ownerWait, setOwnerWait] = useState("0");
  const [userid,setUserid] = useState("");
  const [ownerOrderid,setOwnerOrderid] = useState("");
  const [customerMatches, setCustomerMatches] = useState("");
  
  
  //Make sure we can get the GPS location when required.
  getUserPermission();
  
  const getOwnerData = async () => {
    // fetch the current location.
    const location = await Location.getCurrentPositionAsync({});
    setOwnerAddress("location found");
  }
  
  const getCustomerData = async () => {
    // fetch the current location.
    const location = await Location.getCurrentPositionAsync({});
    setCustomerAddress("location found");
  }

  const transportOwnerMake = async () => {
    const now = new Date();
    // Create a start and end time for the order.
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(ownerHours), parseInt(ownerMinutes));
    const end =  new Date(start.getTime() + parseInt(ownerWait)*60000);
      
    const order = await Taxi.postOrders(userid, start.toISOString(), end.toISOString(), "0", ownerAddress);
    setOwnerOrderid(order.id);
    
  }
  
  const transportCustomerMake = async () => {
    const now = new Date();
    // Create a start and end time for the order.
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(ownerHours), parseInt(ownerMinutes));
    const end =  new Date(start.getTime() + parseInt(ownerWait)*60000);
      
    const order = await Taxi.postOrders(userid, start.toISOString(), end.toISOString(), "1", customerAddress);
    setUserid(order.id);
  }

  const transportOwnerCancel = () => {
    if (ownerOrderid != "")
      Taxi.deleteOrders(userid, ownerOrderid);
    setOwnerOrderid("");
  }
  
  const transportCustomerCancel = () => {
    if (userid != "")
      Taxi.deleteOrders(userid, userid);
      setUserid("");
  }

  const transportOwnerMatches = async () => {
    const matches = await Taxi.getMatches(userid);
    setOwnerMatches(JSON.stringify(matches));
    
  }  

  const transportCustomerMatches = async () => {
    
    const matches = await Taxi.getMatches(userid);
    setCustomerMatches(JSON.stringify(matches));
    
  }  

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  
  const confirmAndPay = () => {
    
    // display confirmation Alert
    Alert.alert(
      'Confirm the Match',
      'Would you like to confirm the match and proceed to payment?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        {text: 'OK', onPress: () => setPaymentModalOpen(true)},
      ],
      { cancelable: false }
    );
  }

  const handlePayment = () => {
    // handle payment process here using paymentDetails
    console.log(paymentDetails);
    setPaymentModalOpen(false);
  }
  
  // The UI for the application.
  return (
    
    
        <SafeAreaView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Noricum Ride Share</Text>
          </View>
    
          {/* Login Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Login</Text>
            <TextInput style={styles.input} value={userid} onChangeText={setUserid} />
          </View>
    
          {/* Owner Offer Section */}
          <View style={[styles.section, styles.brightYellowBackground]}>
            <Text style={styles.sectionTitle}>Owner Offer</Text>
            
        <AddressPicker label='Waiting address' address={ownerAddress} onClick={getOwnerData} onChangeAddress={setOwnerAddress} />
          <TimePicker label='Start to wait at (24hrs)' hours={ownerHours} minutes={ownerMinutes} onChangeHours={setOwnerHours} onChangeMinutes={setOwnerMinutes}/>
          <WaitTime label='Wait time (minutes)' minutes={ownerWait} onChangeMinutes={setOwnerWait} />
        
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportOwnerMake}>
              <Text style={styles.buttonText}>Make</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportOwnerCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportOwnerMatches}>
              <Text style={styles.buttonText}>Matches</Text>
            </TouchableOpacity>
            <Text style={styles.matches}>Matches: {ownerMatches}</Text>
          </View>
    
          {/* Customer Request Section */}
          <View style={[styles.section, styles.brightYellowBackground]}>
            <Text style={styles.sectionTitle}>Customer Request</Text>
            
        <AddressPicker label='Pickup address' address={customerAddress} onClick={getCustomerData} onChangeAddress={setCustomerAddress} />
            <TimePicker label='Pickup time (24hrs)' hours={customerHours} minutes={customerMinutes} onChangeHours={setCustomerHours} onChangeMinutes={setCustomerMinutes}/>
        
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportCustomerMake}>
              <Text style={styles.buttonText}>Make</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportCustomerCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={transportCustomerMatches}>
              <Text style={styles.buttonText}>Matches</Text>
            </TouchableOpacity>
            <Text style={styles.matches}>Matches: {customerMatches}</Text>
            {/* Customer Payment Section */}
            <TouchableOpacity style={styles.button} onPress={confirmAndPay}>
        <Text style={styles.buttonText}>Confirm and Pay</Text>
      </TouchableOpacity>
      <Modal visible={paymentModalOpen} animationType='slide'>
        <View style={styles.modalContent}>
          <Text>Enter Payment Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter payment details here"
            onChangeText={setPaymentDetails}
            value={paymentDetails}
          />
          <TouchableOpacity style={styles.button} onPress={handlePayment}>
            <Text>Pay Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setPaymentModalOpen(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
          </View>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
      },
      titleContainer: {
        backgroundColor: '#666600',
        padding: 20,
        marginBottom: 20,
        mergin: 0,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
      section: {
        marginBottom: 20,
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#CCCC00',
      },
      brightYellowBackground: {
        backgroundColor: '#FFD700',
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      input: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        color: '#000000',
      },
      button: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        color: 'white'
      },
      blackButton: {
        backgroundColor: '#333300',
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      matches: {
        marginTop: 10,
        color: 'black',
        fontWeight: 'bold',
      },
      modalContent: {
        padding: 20,
        backgroundColor: '#333300',
      },
    });