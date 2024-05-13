import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet } from 'react-native';
import UserForm from './user-form';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';

interface NewUserRecordButtonProps {
  onModalVisibleChange: (visible: boolean) => void;
}

const NewUserRecordButton: React.FC<NewUserRecordButtonProps> = ({ onModalVisibleChange }) => {
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.text,
      fontSize: 18,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
  });

  return (
      <View style={styles.container}>
        <Pressable
            style={styles.button}
            onPress={() => {
              setModalVisible(true);
              onModalVisibleChange(true);
            }}
        >
          <FontAwesomeIcon icon="plus" size={26} color={colors.opText} />
        </Pressable>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              onModalVisibleChange(false);
            }}
        >
          <View style={styles.centeredView}>
            <UserForm
                styles={styles}
                showCloseButton={true}
                onClose={() => {
                  setModalVisible(false);
                  onModalVisibleChange(false);
                }}
            />
          </View>
        </Modal>
      </View>
  );
};

export default NewUserRecordButton;
