import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import _ from 'lodash';
import ShowModal from '../ShowModal';
import FilterModal from '../FilterModal';
import {backgroundColor} from '../../styled';
import {distance} from '../../utils/hooks';
import {getToday} from '../../utils/hooks';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {sortByLocation} from '../../utils/hooks';
import Hyperlink from 'react-native-hyperlink';
import * as lodash from 'lodash';

function List(props) {
  const {item, index, userData, setData} = props;
  return (
    <TouchableOpacity
      key={index}
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: backgroundColor,
        borderBottomWidth: 1,
      }}
      onPress={() => setData(item)}>
      <View style={{marginRight: 10}}>
        <Image
          source={item.avatar}
          style={{height: 40, width: 40, borderRadius: 40}}
        />
      </View>
      <View style={{width: wp(75)}}>
        <View>
          <Text>{item.name}</Text>

          <Text style={{color: 'gray'}}>
            {Math.floor(
              distance(
                item.location.lat,
                item.location.long,
                userData.location.lat,
                userData.location.long,
              ),
            )}
            km
          </Text>
        </View>
        {item.publication && (
          <Hyperlink linkStyle={{color: '#2980b9'}}>
            <Text>
              {item.publication.description.length > 120
                ? item.publication.description.substring(0, 120 - 3) + '...'
                : item.publication.description}
            </Text>
          </Hyperlink>
        )}
        <TouchableOpacity
          onPress={() => setData(item)}
          style={{paddingTop: 10}}>
          <Text style={{color: 'gray', textDecorationLine: 'underline'}}>
            ver mais
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function UserList(props) {
  const [values, setValues] = useState({
    users: [],
    isModalVisible: false,
    data: {},
  });
  const userData = useSelector((store) => store.data);
  const {yyyy, mm, dd} = getToday();
  const today = new Date(yyyy, String(parseInt(mm) - 1), dd).getTime();

  const toggleModal = () => {
    setValues({...values, isModalVisible: !values.isModalVisible});
  };

  const setData = (data) => {
    setValues({...values, data: data, isModalVisible: !values.isModalVisible});
  };

  useEffect(() => {
    let temp = [];
    const onChildAdd = database()
      .ref('/users')
      .on('child_added', (snapshot) => {
        temp.push(snapshot.val());
        setValues({...values, users: sortByLocation(temp, userData)});
      });

    return () => database().ref('/users').off('child_added', onChildAdd);
  }, [props.closest, props.latest]);

  useEffect(() => {
    props.onChangePageLength(Math.ceil(values.users.length/8));
  }, [values.users.length]);

  const userList = lodash.cloneDeep(values.users);
  const pageStart = props.page * 8;

  return (
    <View>
      <ShowModal
        isModalVisible={values.isModalVisible}
        toggleModal={toggleModal}
        userData={values.data}
        // navigation={navigation}
      />

      {userList.slice(pageStart, pageStart + 16).map((item, index) => {
        if (props.closest) {
          if (
            Math.floor(
              distance(
                item.location.lat,
                item.location.long,
                userData.location.lat,
                userData.location.long,
              ),
            ) <= 5
          ) {
            if (props.latest) {
              if (item.publicationCreatedDate >= today) {
                return (
                  <List
                    item={item}
                    index={index}
                    userData={userData}
                    key={index}
                    setData={setData}
                  />
                );
              }
            } else {
              return (
                <List
                  item={item}
                  index={index}
                  userData={userData}
                  key={index}
                  setData={setData}
                />
              );
            }
          }
        } else {
          if (props.latest) {
            if (item.publicationCreatedDate >= today) {
              return (
                <List
                  item={item}
                  index={index}
                  userData={userData}
                  key={index}
                  setData={setData}
                />
              );
            }
          } else {
            return (
              <List
                item={item}
                index={index}
                userData={userData}
                key={index}
                setData={setData}
              />
            );
          }
        }
      })}
    </View>
  );
}

export default UserList;
