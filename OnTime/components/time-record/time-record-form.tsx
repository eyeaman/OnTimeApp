import React, {useState, useEffect} from 'react';
import { Alert, View, StyleSheet, TextInput, Button } from 'react-native';
import MyText from '../../components/MyText';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { storageEmitter } from '../storageEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from '../../theme/Colors';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';
import APIClient from '../../api/APIClient';

interface TimesheetRecordFormProps {
  styles: any;
}

const TimeRecordForm: React.FC<TimesheetRecordFormProps> = ({ styles }) => {  
  const {colors} = useTheme();
  const user = 'user';

  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);
  const jobsiteAPI = new JobsiteAPI(client);

  const [loading, setLoading] = useState<boolean>(true);
  const [jobsite, setJobsite] = useState(null);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(7);
    now.setMinutes(0);
    return now;
  });  
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setHours(15);
    now.setMinutes(0);
    return now;
  });  
  const [notes, setNotes] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [jobsiteValid, setJobsiteValid] = useState(true);
  const [endTimeValid, setEndTimeValid] = useState(true); 

  const getJobsites = async () => {
    setLoading(true);
    try {
      const jobsitesData = await jobsiteAPI.getAllJobsites();
      setJobsites(jobsitesData);
    } catch (error) {
      console.error('Error fetching jobsites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormSubmitted(true);
    const selectedJobsite = jobsites.find(js => js._id === jobsite);

    // Validate inputs
    const isJobsiteValid = jobsite !== null && jobsite !== 'null';
    const isEndTimeValid = !!endTime && endTime > startTime;

    // Update validation status
    setJobsiteValid(isJobsiteValid);
    setEndTimeValid(isEndTimeValid);

    // If any input is invalid, return early
    if (!isJobsiteValid || !isEndTimeValid) {
      return;
    }

    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Show a confirmation popup
    Alert.alert(
      'Submit Time Record',
      `You worked at ${selectedJobsite?.name ?? 'ERROR'} for ${totalHours.toFixed(2)} hours. Do you wish to submit this record? `, // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              await timeRecordAPI.addTimeRecord({
                employee: '660e6d7413463bb6826432f1',
                // date: date,
                startTime: startTime.toISOString(), 
                endTime: endTime.toISOString(),
                jobsite: selectedJobsite,
                isApproved: false,
              });
        
              saveTimeRecord();
            } catch (error) {
              console.error('Error creating time record:', error);
              Alert.alert(
                'Error',
                'Failed to create time record. Please try again later.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const saveTimeRecord = async () => {
    storageEmitter.emit('timeRecordsUpdated');
  };

  useEffect(() => {
    getJobsites();
  }, []);

  const localStyles = StyleSheet.create({
    timesheetView: {},
    invalidForm: {
      color: colors.warning,
      paddingBottom: 10,
    },
    invalidFormIcon: {
      color: colors.warning,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.text,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownIcon: {
      top: 6,
      right: 10,
    },
    dateTimeInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
    },
    text: {
      color: colors.border,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.section}>
      <MyText style={styles.sectionTitle}>New Time Record</MyText>
      {!jobsiteValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Please pick a jobsite
        </MyText>
      )}

      {!endTimeValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> End Time must be after the Start Time
        </MyText>
      )}
      <RNPickerSelect
        onValueChange={value => {
          setJobsite(value);
          if (formSubmitted) {
            setJobsiteValid(!!value);
          }
        }}
        items={jobsites.map(jobsite => ({ label: jobsite.name, value: jobsite._id }))}
        placeholder={{label: 'Select Jobsite', value: null}}
        Icon={() => {
          return <FontAwesomeIcon icon='chevron-down' size={24} color={jobsiteValid ? colors.border : colors.warning} />;
        }}
        style={{
          inputIOS: {
            ...localStyles.dropdownInputIOS,
            borderColor: jobsiteValid ? colors.border : colors.warning,
          },
          inputAndroid: {
            ...localStyles.dropdownInputAndroid,
            borderColor: jobsiteValid ? colors.border : colors.warning,
          },
          iconContainer: localStyles.dropdownIcon,
          placeholder: {
            ...localStyles.placeholderText,
            color: jobsiteValid ? colors.border : colors.warning,
          },
        }}
      />
      <View style={localStyles.dateTimeInput}>
        <MyText style={localStyles.text}>Date: </MyText>
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || new Date(date);
            setDate(currentDate.toISOString().split('T')[0]);
          }}
        />
      </View>
      <View style={localStyles.dateTimeInput}>
        <MyText style={localStyles.text}>Start Time: </MyText>
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            const currentTime = selectedTime || startTime;
            setStartTime(currentTime);
          }}
        />
      </View>
      <View style={{
        ...localStyles.dateTimeInput,
        borderColor: endTimeValid ? colors.border : colors.warning,
      }}>
        <MyText style={{
          ...localStyles.text,
          color: endTimeValid ? colors.border : colors.warning,
        }}>End Time: </MyText>
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            const currentTime = selectedTime || endTime;
            setEndTime(currentTime);
            setEndTimeValid(true);
          }}
        />
      </View>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        placeholderTextColor={localStyles.placeholderText.color}
        style={localStyles.textInput}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default TimeRecordForm;
