import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,FlatList,Button,TouchableOpacity,TouchableHighlight ,Dimensions,Modal, Touchable} from 'react-native';
import moment from "moment";
import scheduleFile from "./schedules.json";

export default function App() {

  const [dates,setDates]=useState([]);
  const [times,setTimes]=useState([]);
  const [TodayTimes,setTodayTimes]=useState([]);
  const [timeActive,setTimeActive]=useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(()=>{
    calculateDates();
    calculateTimes();
  },[])

  const calculateDates=()=>{
    const currentDate=moment();
    const lastDate=moment().add(29,'days');
    const temp=[];
    temp.push("Today " + currentDate.format('MMM D'))
    let tomorrow=false;
    let day=null;
    while(currentDate < lastDate){
      if (tomorrow === false){
        day="Tomorrow " + currentDate.add(1,"days").format("MMM D")
        tomorrow=true;
      }
      else{
         day=currentDate.add(1,"days").format("dddd MMM D")
      }
      temp.push(day);
    }
    if (temp){
      setDates(temp);
    }
  }

  const calculateTimes=()=>{
    const currentTime=moment().startOf('day');
    const lastTime=moment().endOf('day');
    const temp=[];
    while (currentTime<=lastTime){
      const timeStart=currentTime.format("h:00 a");
      currentTime.add(1,"hours");
      const timeEnd=currentTime.format("h:00 a");
      temp.push(timeStart+" - "+timeEnd);
    }

    if (temp){
      setTimes(temp);
    }

    const start= moment()
    const end= moment().endOf('day')
    const TodayTemp=[];
    while (start <= end){ 
      const timeStart=start.format("h:00 a");
      start.add(1,"hours");
      const timeEnd=start.format("h:00 a");
      TodayTemp. push(timeStart+" - "+timeEnd)
    }

    if (TodayTemp){
      setTodayTimes(TodayTemp);
    }
  }


  const textActive=(time)=>{
    setTimeActive(time)
  }

  const scheduleCilcked=()=>{
    if(timeActive!==""){
      getSchedulesData();

    }
  }

  const getSchedulesData=()=>{
    setModalVisible(true)
  }


  const ItemTime=({item})=>(
    
    <TouchableOpacity
      // onPressIn={()=>{textActive(item)}}
        onPress={()=>{textActive(item)}}
    >
        <View  style={timeActive === item ? [styles.containerTime,styles.containerTimeActive] : styles.containerTime}>
          <Text  style={styles.time} >{item}</Text>
        </View>
     
    </TouchableOpacity>
  );

  const renderTimes=({item}) => <ItemTime item={item} />


  const Item = ({ item }) => (
    <View style={styles.containerDate}>
      <View  style={styles.containerDays}>
        <Text style={styles.day} >{item.substr(0, item.indexOf(" "))}</Text>
        <Text style={styles.date}>{ item.substr(item.indexOf(item.split(' ')[1]), )}</Text>
      </View>
      <FlatList
        data={item.substr(0, item.indexOf(" ")) === "Today" ? TodayTimes: times}
        renderItem={renderTimes}
        keyExtractor={(item) => item}
      />
    </View>
  );

  const renderDates = ({ item }) => <Item item={item} />;


  return (
    <View style={styles.container} onPress={() => {
      setModalVisible(!modalVisible);
      }}>
      <FlatList 
        horizontal={true}
        data={dates}
        renderItem={renderDates}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
       style={styles.containerSchedule}
       onPress={scheduleCilcked}
       >
          <Text style={{color:"#21618c",fontSize:30}}>Schedule</Text>
       </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {
              Object.entries(scheduleFile).map(([key, val],index) =>{
                return (
                  <Text key={index} style={styles.modalText}>{val}</Text>
                )
              })
            }
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.buttonClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#21618c",
    marginVertical:200,
    
  },
  containerDate:{
    flex:1,
    alignItems: 'center',
    marginVertical:10,
    width: Dimensions.get('screen').width
    
  },
  containerDays:{
    alignItems: 'center',
  },
  containerTime:{
    flex:1,
    alignItems: 'center',
    marginVertical:10,
    width: Dimensions.get('screen').width,
  },
  containerTimeActive:{
    backgroundColor:"#d4ac0d"
  },
  day:{
    fontSize: 30,
    color:"white",
  },
  date:{
    fontSize: 18,
    color:"white",
  },
  time:{
    fontSize: 24,
    color:"white",
  },
  timeActive:{
    fontSize:24,
  },
  containerSchedule:{
    height:40,
    backgroundColor:"#d4ac0d",
    height:50,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  openButton: {
    backgroundColor: "#21618c",
    borderRadius: 8,
    padding: 10,
    marginVertical:5,
    elevation: 2,
  },
  buttonClose:{
    justifyContent:'center',
    alignItems:'center',
    color:"white",
}


});
