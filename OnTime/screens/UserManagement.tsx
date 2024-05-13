import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useAPIClient } from '../api/APIClientContext'
import { useTheme } from '../theme/Colors'
import UserAPI from '../api/UserAPI'
import type User from '../models/User'
import UserItem from '../components/user/user'
import UserFilter from '../components/user/user-filter';

const UserManagement: React.FC = () => {
  const {colors} = useTheme();
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { apiClient } = useAPIClient()
  const userAPI = new UserAPI(apiClient)

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers()
  }, [])

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const usersData = await userAPI.getAllUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  // Function to handle user deletion
  const handleDeleteUser = async (userId: string) => {
    // Implement deletion logic
  }

  // Render user item
  const renderUserItem = ({ item }: { item: User }) => {
    return (
        <UserItem user={item} refreshList={fetchUsers} />
    )
  }

  return (
      <View style={{ flex: 1, position: 'relative' }}>
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Add User Button */}
          <TouchableOpacity style={styles.addButton}>
            <FontAwesomeIcon icon='plus' size={24} color="white" />
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity style={styles.settingsButton}>
            <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
          </TouchableOpacity>
        </View>

        {/* User list */}
        <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text>No users found.</Text>}
            contentContainerStyle={styles.userList}
        />
      </View>

  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 10
  },
  userList: {
    paddingBottom: 20, // Adjust the paddingBottom as needed
  }
})

export default UserManagement
