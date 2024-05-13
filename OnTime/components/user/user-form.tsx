import React, { useState, useEffect } from 'react';
import { Alert, View, Pressable, StyleSheet, TextInput, Button } from 'react-native';
import MyText from '../../components/MyText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import UserAPI from '../../api/UserAPI';
import APIClient from '../../api/APIClient';

interface UserFormProps {
  styles: any;
  showCloseButton: boolean;
  onClose?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ styles, showCloseButton, onClose }) => {
  const { colors } = useTheme();

  const client = new APIClient();
  const userAPI = new UserAPI(client);

  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await userAPI.createUser({
        firstName,
        lastName,
        email,
        phone,
        notes,
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert(
          'Error',
          'Failed to create user. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  const localStyles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      padding: 10,
      paddingTop: 0,
      paddingRight: 0,
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
  });

  return (
      <View style={styles.section}>
        <View style={localStyles.row}>
          <MyText style={styles.sectionTitle}>New User</MyText>
          {showCloseButton && (
              <Pressable onPress={onClose} style={localStyles.closeButton}>
                <FontAwesomeIcon icon="times" size={26} color={colors.text} />
              </Pressable>
          )}
        </View>
        <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor={colors.border}
            style={localStyles.textInput}
        />
        <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor={colors.border}
            style={localStyles.textInput}
        />
        <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.border}
            style={localStyles.textInput}
        />
        <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            placeholderTextColor={colors.border}
            style={localStyles.textInput}
        />
        <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            placeholderTextColor={colors.border}
            style={localStyles.textInput}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
  );
};

export default UserForm;
