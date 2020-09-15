import React, {useState, useEffect, useRef} from 'react';
import {Image, View, ScrollView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import AddModal from '../../components/AddModal';
import FilterModal from '../../components/FilterModal';
import {Container, Header, WhiteText} from '../../styled';
import {Content, ManagementBtn, PublishBtn} from './style';
import Logo from '../../assets/images/logo.png';
import {backgroundColor} from '../../styled';
import UserList from '../../components/UserList';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ManageList from "../../components/ManageList"

function EditPublications({route,navigation}) {
  const scrollList =  useRef(null);
  const { manage } = route.params;
  const [values, setValues] = useState({
    isModalVisible: false,
    isFilterModalVisible: false,
    closest: false,
    latest: false,
    management: manage,
    data: {},
  });
  const [page, setPage] = useState(0);
  const [pageLength, setPageLength] = useState(0);
  const [nativeEvent, setNativeEvent] = useState(0);
  const userData = useSelector((store) => store.data);

  const toggleModal = () => {
    setValues({...values, isModalVisible: !values.isModalVisible, management:false});
  };
  const toggleFilterModal = () => {
    setValues({...values, isFilterModalVisible: !values.isFilterModalVisible});
  };
  const toggleCloset = () => {
    setValues({...values, closest: !values.closest});
  };

  const toggleLatest = () => {
    setValues({...values, latest: !values.latest});
  };

  const visibleManagement = () => {
    setValues({...values, management: true});
  };

  useEffect(() => {
    // console.log("========================",userData)
    setValues({...values, data: userData});    
  }, [userData]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 60;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const onScrollEndDrag = () => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    console.log('layoutMeasurement.height', layoutMeasurement.height);
    console.log('contentOffset.y', contentOffset.y);
    console.log('contentSize.height', contentSize.height);

    if (typeof layoutMeasurement !== 'undefined' && isCloseToBottom(nativeEvent) && page < pageLength) {
      setPage(page + 1);
      scrollList.current.scrollTo({x: 0, y:  contentOffset.y / 2, animated: true});
    }
    if (typeof layoutMeasurement !== 'undefined' && contentOffset.y < 60 && page > 0) {   
      setPage(page - 1);
      scrollList.current.scrollTo({x: 0, y:  (contentSize.height - layoutMeasurement.height)/ 2, animated: true});
    } 
  }
  const onScroll = ({nativeEvent}) => {
    setNativeEvent(nativeEvent);
  }

  const onChangePageLength = (pageL) => {
    if (pageLength !== pageL) {
      setPageLength(pageL - 2);
    }    
  }

  console.log('page == ', page);
  return (
    <Container>
      <AddModal
        isModalVisible={values.isModalVisible}
        toggleModal={toggleModal}
        userData={values.data}
        navigation={navigation}
      />
      <FilterModal
        isModalVisible={values.isFilterModalVisible}
        toggleModal={toggleFilterModal}
        toggleCloset={toggleCloset}
        toggleLatest={toggleLatest}
        latest={values.latest}
        closest={values.closest}
        navigation={navigation}
      />
      <Header>
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{position: 'absolute', bottom: hp(3), left: wp(8)}}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Image
          source={Logo}
          style={{height: 40, width: 40, resizeMode: 'contain'}}
        />
      </Header>
      <Content>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 5,
            borderBottomColor: backgroundColor,
            borderBottomWidth: 1,
          }}>
          <PublishBtn onPress={toggleModal}>
            <WhiteText>Editar e Publicar</WhiteText>
          </PublishBtn>
          <ManagementBtn onPress={visibleManagement}>
            <WhiteText>Gestão</WhiteText>
          </ManagementBtn>

          <ManagementBtn onPress={toggleFilterModal}>
            <WhiteText>Filtrar</WhiteText>
          </ManagementBtn>
        </View>
        <ScrollView
          ref={scrollList}
          style={{
            flex: 1
          }}
          onScrollEndDrag={onScrollEndDrag}
          onScroll={onScroll}
        >         
          {values.management?
          <ManageList 
          onChangePageLength={onChangePageLength}
          page={page}
          userData={values.data}
          />
          :
          <UserList
          onChangePageLength={onChangePageLength}
          page={page}
          navigation={navigation}
          closest={values.closest}
          latest={values.latest}
        />
          }
          
        </ScrollView>
      </Content>
    </Container>
  );
}

export default EditPublications;
