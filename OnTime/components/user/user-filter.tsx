import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, Animated, FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import MyText from '../../components/MyText'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { useTheme } from '../../theme/Colors'
import { useAPIClient } from '../../api/APIClientContext'
import UserAPI from '../../api/UserAPI'
import User from '../../models/User'
import JobsiteAPI from "../../api/JobsiteAPI.ts";

type UserFilterProps = {
  onApply: (selectedRole: string, selectedSortOrder: string) => void;
  onModalVisibleChange: (visible: boolean) => void
};

const UserFilter: React.FC<UserFilterProps> = ({ onModalVisibleChange }) => {
  const {colors } = useTheme()

  const [modalVisible, setModalVisible] = useState(false);
  const [role, setJobsites] = useState<Jobsite[]>([]);
  const [selectedRole, setSelectedPosition] = useState('')
  const [selectedSortOrder, setSelectedSortOrder] = useState('asc')
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalBackdropOpacity, setModalBackdropOpacity] = useState(new Animated.Value(0));

  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    Animated.timing(modalBackdropOpacity, {
      toValue: modalVisible ? 0.5 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const getRole = async () => {
    try {
      const userData = await userAPI.getAllUsers();
      setRole(userData);
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  };

  const applyFiltering = () => {
    setModalVisible(false);
    onModalVisibleChange(false)

    onApply(selectedRole, selectedStatus, selectedSortOrder);
  }

  return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { onModalVisibleChange(false) }}>
              <MyText style={styles.modalButtons}>Cancel</MyText>
            </TouchableOpacity>
            <MyText style={styles.modalTitle}>Filter Users</MyText>
            <TouchableOpacity onPress={() => { setSelectedPosition('') }}>
              <MyText style={styles.modalButtons}>Reset</MyText>
            </TouchableOpacity>
          </View>

          {/* Position Filter */}
          <View style={styles.modalSection}>
            <MyText style={styles.modalSectionTitle}>Position</MyText>
            {/* Implement position filter options */}
          </View>

          {/* Order Filter */}
          <View style={styles.modalSection}>
            <MyText style={styles.modalSectionTitle}>Order</MyText>
            {/* Implement order filter options */}
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={applyFiltering}>
            <MyText style={styles.applyButtonText}>Apply</MyText>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 35,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  modalButtons: {
    color: 'blue'
  },
  modalSection: {
    marginBottom: 20
  },
  modalSectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  applyButtonText: {
    color: 'white'
  }
})

export default UserFilter
