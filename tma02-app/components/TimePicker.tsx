/**
 * A component to allow an entry of a time value in minutes from 0-60
 * and hours from 0-24
 * 
 * TM352 TMA02
 * Change log
 * 3/10/23 CThomson Intial version
 */

import { Text, View, StyleSheet, TextInput } from 'react-native';

type TimePickerProps = {
  label: string;
  hours: string;
  minutes: string;
  onChangeHours: (text: string) => void;
  onChangeMinutes: (text: string) => void;
};

export default function TimePicker(props: TimePickerProps) {
  return (
    <View style={styles.container}>
      <Text>{props.label}</Text>
      <TextInput style={styles.input} 
                 placeholder='hh' 
                 value={props.hours} 
                 onChangeText={props.onChangeHours} 
                 inputMode='numeric'/>
      <Text>:</Text>
      <TextInput style={styles.input} 
                 placeholder='mm' 
                 value={props.minutes} 
                 onChangeText={props.onChangeMinutes} 
                 inputMode='numeric'/> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 5,
    width: 40,
    backgroundColor: 'white',
    color: '#000000',
  },
});