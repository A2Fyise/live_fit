import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Header from '../Components/Header'
import axios from 'axios'
import { GET_CALORIES } from '../Queries/GET_CALORIES'
import { Picker } from '@react-native-picker/picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setNutritionResult } from '../redux/states/nutritionSlice'
// import { BASE_URI } from '@env'
import { CalorieResult } from '../Components/popups/CalorieResult'
import BreakfastSVG from '../assets/icons/breakfast.svg'
import LunchSVG from '../assets/icons/lunch.svg'
import SnackSVG from '../assets/icons/snack.svg'
import DinnerSVG from '../assets/icons/dinner.svg'
import PlusSVG from '../assets/icons/plus.svg'
import { BarChart, LineChart } from 'react-native-chart-kit'
import { SEVEN_DAY_MEALS_QUERY } from '../Queries/SEVEN_DAY_MEALS_QUERY'
import { GET_NUTRION_BY_DATE } from '../Queries/GET_NUTRION_BY_DATE'
import { ListTitle } from '../Components/ListTitle'
import { BASE_URI } from '../URI'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { DateBoxMain } from '../Components/DateBoxMain'

export default function Calories() {
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const [foodSeachVal, setFoodSeachVal] = React.useState('')
  const [inputBorderColor, setInputBorderColor] = React.useState('#ccc')
  const [servingSize, setServingSize] = React.useState('100g')
  const [resultPopup, setResultPopup] = useState(false)
  const [resultLoader, setResultLoader] = useState(true)
  const [graphDataValues, setGraphDataValues] = useState<number[]>([])
  const [graphDataLoaded, setGraphDataLoaded] = useState(false)
  const [foodStack, setFoodStack] = useState([])

  const searchMeals = async () => {
    try {
      setResultPopup(true)
      const res = await axios.post(BASE_URI, {
        query: GET_CALORIES,
        variables: {
          query: `${servingSize} ${foodSeachVal}`,
        },
      })
      dispatch(setNutritionResult(res.data.data.getFoodCalories))
      setResultLoader(false)
    } catch (err) {
      console.log(err)
    }
  }

  const screenWidth = Dimensions.get('window').width - 40
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.0,
    color: () => '#555',
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  type objectsType = {
    title: string
    icon: Object
  }
  const mealsData: objectsType[] = [
    { title: 'Breakfast', icon: <BreakfastSVG /> },
    { title: 'Lunch', icon: <LunchSVG /> },
    { title: 'Snack', icon: <SnackSVG /> },
    { title: 'Dinner', icon: <DinnerSVG /> },
  ]

  useEffect(() => {
    axios
      .post(BASE_URI, {
        query: SEVEN_DAY_MEALS_QUERY,
      })
      .then((res) => {
        let dataArr: number[] = []
        res.data.data.sevenDaysIntake.map((meal: { calories: number }) => {
          dataArr.push(meal.calories)
        })
        setGraphDataValues(dataArr)
        setGraphDataLoaded(true)
      })
  }, [])
  const graphData = {
    // labels: ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'],
    datasets: [
      {
        data: graphDataValues,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    // legend: ['Over eaten'],
  }
  useEffect(() => {
    axios
      .post(BASE_URI, {
        query: GET_NUTRION_BY_DATE,
        variables: {
          dateString: '2022-10-24',
        },
      })
      .then((res) => setFoodStack(res.data.data.getNutritionByDate))
      .catch((err) => console.warn(err))
  }, [])

  return (
    <>
      <Header />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <View style={{ alignItems: 'center' }}>
          <View style={[styles.input, { borderColor: inputBorderColor, flexDirection: 'row' }]}>
            <TextInput
              onFocus={() => setInputBorderColor('#92A3FD')}
              onBlur={() => setInputBorderColor('#ccc')}
              value={foodSeachVal}
              onChangeText={(val) => setFoodSeachVal(val)}
              placeholder='Search Food...'
              onEndEditing={() => searchMeals()}
              style={styles.inputTextField}
            />
            <Picker
              style={{ color: '#999', fontFamily: 'Poppins', marginLeft: -45, width: 50, height: 20 }}
              selectedValue={servingSize}
              onValueChange={(value) => setServingSize(value)}>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num, index) => {
                return <Picker.Item key={index} label={`${num} g`} value={`${num}g`} />
              })}
            </Picker>
            <TouchableOpacity onPress={() => navigation.navigate('FoodScan')}>
              <Image
                source={require('../assets/icons/camera.png')}
                style={{ width: 32, height: 32, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {/* <View style={{ alignItems: 'flex-start' }}>
          {graphDataLoaded && (
            <LineChart bezier data={graphData} width={screenWidth} height={220} chartConfig={chartConfig} />
          )}
        </View> */}
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 20,
              backgroundColor: 'rgba(100,100,100,0.03)',
              borderRadius: 12,
              // flex: 1,
            }}>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}> */}
            <View style={{ margin: 20, marginBottom: 40 }}>
              <AnimatedCircularProgress
                size={120}
                width={15}
                fillLineCap='square'
                lineCap='square'
                fill={50}
                tintColor='#C58BF2'
                backgroundColor='#3d5875'
              />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: -95,
                  color: '#3d5875',
                  fontFamily: 'Poppins',
                  fontSize: 50,
                }}>
                80
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                marginTop: -20,
                fontFamily: 'Poppins',
                color: '#555',
              }}>
              Remaining...
            </Text>
            {/* </View> */}
            <DateBoxMain />
            <FlatList
              data={mealsData}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => {
                let foodStackType
                if (item.title.toLowerCase() === 'breakfast') {
                  foodStackType = foodStack.breakfast
                } else if (item.title.toLowerCase() === 'lunch') {
                  foodStackType = foodStack.lunch
                } else if (item.title.toLowerCase() === 'snack') {
                  foodStackType = foodStack.snack
                } else {
                  foodStackType = foodStack.dinner
                }
                return (
                  <View style={{ marginVertical: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginHorizontal: 30,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderRadius: 10,
                        }}>
                        <View style={{ marginHorizontal: 10 }}>{item.icon}</View>
                        <Text
                          style={{
                            fontFamily: 'Poppins_Bold',
                            fontSize: 14,
                            color: '#777',
                            marginRight: 200,
                            width: 80,
                          }}>
                          {item.title}
                        </Text>
                      </View>
                      <PlusSVG />
                    </View>
                    <View style={{ marginTop: 10 }}>
                      {foodStackType && foodStackType.length !== 0 && (
                        <View style={{ marginLeft: 10, margin: 5, flexDirection: 'row' }}>
                          <View style={{ margin: 5 }}>
                            <ListTitle title='Food' width={55} />
                          </View>
                          <View style={{ margin: 5 }}>
                            <ListTitle title='Carbs' width={55} />
                          </View>
                          <View style={{ margin: 5 }}>
                            <ListTitle title='Prot' width={55} />
                          </View>
                          <View style={{ margin: 5 }}>
                            <ListTitle title='Fats' width={55} />
                          </View>
                          <View style={{ margin: 5 }}>
                            <ListTitle title='Cals' width={55} />
                          </View>
                        </View>
                      )}
                      {foodStackType &&
                        foodStackType.map(
                          (
                            el: {
                              food: string
                              carbs: number
                              protein: number
                              fats: number
                              calories: number
                            },
                            idx: string
                          ) => {
                            return (
                              <View key={idx}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginHorizontal: -20,
                                    margin: 5,
                                  }}>
                                  <Text style={[styles.titleTxt, { width: 60 }]}>{el.food}</Text>
                                  <Text style={[styles.titleTxt, { marginLeft: -30 }]}>{el.carbs}</Text>
                                  <Text style={styles.titleTxt}>{el.protein}</Text>
                                  <Text style={styles.titleTxt}>{el.fats}</Text>
                                  <Text style={[styles.titleTxt, { marginRight: 5 }]}>{el.calories}</Text>
                                </View>
                              </View>
                            )
                          }
                        )}
                    </View>
                    {/* <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#DDDADA99',
                      borderRadius: 8,
                      height: 38,
                      marginVertical: 20,
                    }}>
                    <Text style={[styles.titleTxt, { color: '#777' }]}>Add Food</Text>
                  </TouchableOpacity> */}
                  </View>
                )
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <CalorieResult
          resultLoader={resultLoader}
          resultPopup={resultPopup}
          setResultPopup={setResultPopup}
          foodSeachVal={foodSeachVal}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  titleTxt: {
    fontFamily: 'Poppins_Bold',
    textTransform: 'capitalize',
    color: '#777',
    fontSize: 14,
    textAlign: 'left',
  },
  input: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8F9F9',
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Poppins',
    marginHorizontal: 20,
    borderWidth: 1,
    width: 320,
    marginVertical: 20,
  },
  inputTextField: {
    width: 250,
    fontSize: 14,
    marginHorizontal: 10,
  },
})
