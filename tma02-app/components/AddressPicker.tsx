/**
 * A component to allow an entry of an address. The parent view 
 * needs to handle the address lookup
 * 
 * TM352 TMA02
 * Change log
 * 3/10/23 CThomson Intial version
 */

import { View, Button, StyleSheet, TextInput, GestureResponderEvent, TouchableOpacity } from 'react-native';

type AddressPickerProps = {
  label: string;
  address: string;
  onClick: (event: GestureResponderEvent) => void;
  onChangeAddress: (text: string) => void;
};

export default function AddressPicker(props: AddressPickerProps) {

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder={props.label} accessibilityLabel={props.label} value={props.address} onChangeText={props.onChangeAddress}/>
      <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={props.onClick}>
              <text style={styles.buttonText}>Set current location</text>
            </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
    color: '#000000',
  },
  
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  blackButton: {
    backgroundColor: '#333300',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});