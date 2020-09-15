import React, { useEffect, useState, useRef } from 'react';
import { Image, View } from 'react-native';
import database from '@react-native-firebase/database';
import { useSelector } from 'react-redux';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { WhiteText } from '../../styled';
import {
  MapViews,
  Container,
  Header,
  PublishBtn,
  ManagementBtn,
  SettingBtn,
} from './style';
import Logo from '../../assets/images/logo.png';

const CustomMarker = (props) => {
  return (
    <View
      style={{
        height: 40,
        width: 40,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
      }}>
      <Image source={props.source} style={{ height: 40, width: 40 }} />
    </View>
  );
};

function Home({ navigation }) {
  const map = useRef(null);
  const userData = useSelector((store) => store.data);
  const [values, setValues] = useState({
    lat: userData.location.lat,
    long: userData.location.long,
    users: [],
  });
  const [users, setUesrs] = useState([]);

  useEffect(() => {
    let tempUsers = [];
    const onChildAdd = database()
      .ref('/users')
      .on('child_added', (snapshot) => {
        tempUsers.push(snapshot.val());
        setValues({ ...values, users: tempUsers });
      });

    return () => database().ref('/users').off('child_added', onChildAdd);
  }, []);

  function loadUsers() {
    map.current.getMapBoundaries().then((bound) => {
      const tempUsers = values.users.filter((user) => user.location.lat < bound.northEast.latitude && user.location.lat > bound.southWest.latitude
      &&  user.location.long < bound.northEast.longitude && user.location.long > bound.southWest.longitude);
      setUesrs(tempUsers.slice(0, 10));
    });
  }

  // console.log('users length', users.length);
  return (
    <Container>
      <Header>
        <Image
          source={Logo}
          style={{ height: 40, width: 40, resizeMode: 'contain' }}
        />
      </Header>

      <MapViews
        ref={map}
        onKmlReady={loadUsers}
        onRegionChangeComplete={loadUsers}
        // onPanDrag={loadUsers}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        initialRegion={{
          latitude: values.lat,
          longitude: values.long,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}>
        {users.map((item, index) => (
          <Marker
            draggable
            coordinate={{
              latitude: item.location.lat,
              longitude: item.location.long,
            }}
            key={index}
            title={item.name}
            description={Object.keys(item).includes("publication") ? item.publication.description : ""}>
            <CustomMarker source={item.avatar}></CustomMarker>
          </Marker>
        ))}
      </MapViews>
      <PublishBtn onPress={() => navigation.navigate('EditPublications', { manage: false })}>
        <WhiteText>Editar e Publicar</WhiteText>
      </PublishBtn >
      <ManagementBtn onPress={() => navigation.navigate('EditPublications', { manage: true })}>
        <WhiteText>Gestão</WhiteText>
      </ManagementBtn>
      <SettingBtn onPress={() => navigation.navigate('EditPublications', { manage: false })}>
        <FontAwesomeIcon icon={faBars} color="white" size={30} />
      </SettingBtn>
    </Container>
  );
}

export default Home;
