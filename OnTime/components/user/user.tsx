import React from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useTheme } from '../../theme/Colors'
import MyText from '../../components/MyText'
import type User from '../../models/User'
import UserAPI from '../../api/UserAPI'
import APIClient from '../../api/APIClient'

interface UserProps {
  user: User
  refreshList: () => void
}

const UserItem: React.FC<UserProps> = ({
  user,
  refreshList
}) => {
  const { colors } = useTheme()

  const client = new APIClient()
  const userAPI = new UserAPI(client)

  // Function to handle user deletion
  const handleDelete = async () => {
    try {
      await userAPI.deleteUser(user._id)
      refreshList()
    } catch (error) {
      console.error('Error deleting user:', error)
      Alert.alert(
        'Error',
        'Failed to delete user. Please try again later.'
      )
    }
  }

  // Styles
  const styles = StyleSheet.create({
    container: {
      margin: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border
    },
    line: {
      height: 1.3,
      backgroundColor: 'black',
      padding: 0
    },
    verticalLine: {
      width: 1.3,
      backgroundColor: 'black'
    },
    row: {
      flexDirection: 'row'
    },
    column: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontSize: 14,
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 4
    },
    secondText: {
      fontSize: 14,
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 4,
      textAlign: 'center'
    },
    button: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center'
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold'
    }
  })

  return (
      <View style={styles.container}>
        <MyText style={styles.text}>
          Name: {user.firstName} {user.lastName}
        </MyText>
        <MyText style={styles.text}>
          Email: {user.email}
        </MyText>
        {/* Uncomment below to add delete button */}
      {/*  <TouchableOpacity style={styles.button} onPress={handleDelete}>*/}
      {/*  <MyText style={styles.buttonText}>Delete</MyText>*/}
      {/*</TouchableOpacity>*/}
      {/*  <View style={styles.line} />*/}
      </View>
  )
}

export default UserItem
