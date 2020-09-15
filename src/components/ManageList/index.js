import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {backgroundColor, WhiteText, GreenText} from '../../styled';
import ManagementModal from '../ManagementModal';
import EditManagementModal from '../EditManagementModal';
import DatePicker from 'react-native-datepicker';
import * as lodash from 'lodash';

function List(props) {
  const {data, userData, from, to} = props;
  const [values, setValues] = useState({
    clients: [],
    data: {
      images: [],
    },
    userData: {},
    isModalVisible: false,
    index: 0,
  });
  useEffect(() => {
    if (Object.keys(data).includes('clients')) {
      setValues({...values, clients: data.clients, userData: userData});
    }
  }, [data, userData]);
  useEffect(() => {
    let temp = [];

    if (Object.keys(data).includes('clients')) {
      if (from !== '' && to !== '') {
        values.userData.clients.map((item) => {
          if (item.createdDate >= from && item.createdDate <= to) {
            temp.push(item);
            console.log(item);
          }
        });
        setValues({...values, clients: temp});
      }
    }
  }, [from, to]);
  const setData = (item, index) => {
    setValues({
      ...values,
      data: item,
      isModalVisible: !values.isModalVisible,
      index: index,
    });
  };
  const toggleModal = () => {
    setValues({...values, isModalVisible: !values.isModalVisible});
  };
  useEffect(() => {
    props.onChangePageLength(Math.ceil(values.clients.length/8));
  }, [values.clients.length]);

  const clientList = lodash.cloneDeep(values.clients);
  const pageStart = props.page * 8;
  return (
    <View style={{borderBottomColor: backgroundColor, borderBottomWidth: 1}}>
      <EditManagementModal
        isModalVisible={values.isModalVisible}
        toggleModal={toggleModal}
        userData={values.userData}
        data={values.data}
        index={values.index}
      />
      {clientList.slice(pageStart, pageStart + 16).map((item, index) => (
        <View
          key={index}
          style={{
            borderBottomColor: backgroundColor,
            borderBottomWidth: 1,
            padding: 20,
          }}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Nome do Cliente: </Text>
            <Text>{item.name}</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Celular: </Text>
            <Text>{item.phoneNumber}</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Valor: </Text>
            <Text>{item.value}</Text>
          </View>
          <View
            style={{
              paddingVertical: 10,
              display: 'flex',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={
                item.receive
                  ? {
                      height: hp(5),
                      backgroundColor: backgroundColor,
                      borderWidth: 1,
                      borderColor: backgroundColor,
                      width: wp(37),
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {
                      height: hp(5),
                      borderWidth: 1,
                      borderColor: backgroundColor,
                      width: wp(37),
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              {item.receive ? (
                <WhiteText>Para receber</WhiteText>
              ) : (
                <GreenText>Para receber</GreenText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={
                item.pay
                  ? {
                      height: hp(5),
                      backgroundColor: backgroundColor,
                      borderWidth: 1,
                      borderColor: backgroundColor,
                      width: wp(37),
                      borderBottomRightRadius: 5,
                      borderTopRightRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {
                      height: hp(5),
                      borderWidth: 1,
                      borderColor: backgroundColor,
                      width: wp(37),
                      borderBottomRightRadius: 5,
                      borderTopRightRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
              }>
              {item.pay ? (
                <WhiteText>Para pagar</WhiteText>
              ) : (
                <GreenText>Para pagar</GreenText>
              )}
            </TouchableOpacity>
          </View>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{color: 'gray'}}>Data: </Text>
            <Text>{item.createdDate}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setData(item, index)}>
              <Text style={{color: 'gray', textDecorationLine: 'underline'}}>
                ver e editar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

function ManageList(props) {
  const {userData} = props;
  const [values, setValues] = useState({
    isModalVisible: false,
    data: userData,
    from: '',
    to: '',
  });

  useEffect(() => {
    setValues({...values, data: userData});
  }, [userData]);

  const toggleModal = () => {
    setValues({...values, isModalVisible: !values.isModalVisible});
  };

  const onChangePageLength = (pageLength) => {
    props.onChangePageLength(pageLength);
  }

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <DatePicker
          style={{width: wp(40)}}
          date={values.from}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: {
              borderRadius: 5,
              height: hp(3.5),
              width: wp(10),
              borderColor: backgroundColor,
            },
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => {
            setValues({...values, from: date});
          }}
        />
        <DatePicker
          style={{width: wp(40)}}
          date={values.to}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: {
              borderRadius: 5,
              height: hp(3.5),
              width: wp(10),
              borderColor: backgroundColor,
            },
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => {
            setValues({...values, to: date});
          }}
        />
      </View>
      <ScrollView style={{height: hp(60)}}>
        <View>
          <List
            onChangePageLength={onChangePageLength}
            page={props.page}
            data={values.data}
            userData={values.data}
            from={values.from}
            to={values.to}
          />
        </View>
      </ScrollView>
      <ManagementModal
        isModalVisible={values.isModalVisible}
        toggleModal={toggleModal}
        userData={values.data}
      />
      <View
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop: hp(6),
          marginRight: wp(5),
        }}>
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            backgroundColor: backgroundColor,
            paddingHorizontal: wp(5),
            paddingVertical: hp(1),
            borderRadius: 5,
          }}>
          <WhiteText>Adicionar Cliente</WhiteText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ManageList;
