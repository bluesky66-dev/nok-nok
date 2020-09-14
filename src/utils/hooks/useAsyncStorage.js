import AsyncStorage from '@react-native-community/async-storage';
import React, {useSate} from 'react'


export function useAsyncStorage () {
    const [token, setToken] = React.useState("") 
    const storeData  = async (value) => {
        try {
            await AsyncStorage.setItem('@token', value)
          } catch (e) {
            console.log(e)
          }
    }
    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@token')
          await setToken(jsonValue)
        } catch(e) {
            console.log(e)
        }
      }
    return{
        storeData, getData, token
    }
}