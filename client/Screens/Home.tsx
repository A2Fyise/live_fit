import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Header from '../Components/Header'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar'

const screenWidth = Dimensions.get('window').width - 50

type navigationList = {
  FoodScan: undefined
  Workouts: undefined
  BMI: undefined
  WalkSteps: undefined
  Cals: undefined
}

export default function Home() {
  const navigation = useNavigation<NavigationProp<navigationList>>()
  const data = {
    labels: ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'],
    datasets: [
      {
        data: [1800, 1450, 1150, 1705, 1780, 1980],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
    ],
    // legend: ['Over eaten'],
  }
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Header />
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('BMI')}>
        <LinearGradient colors={['#92A3FD', '#9DCEFF']} style={styles.gradientBar}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ alignItems: 'center' }}>
              <AnimatedCircularProgress
                size={80}
                width={14}
                fill={40}
                tintColor='#eeefff'
                backgroundColor='#3d5875'
              />
              <Text
                style={{
                  position: 'absolute',
                  marginTop: 25,
                  color: '#fff',
                  fontSize: 20,
                }}>
                20
              </Text>
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={[styles.topbarText, { fontWeight: 'bold' }]}>Mass Index</Text>
              <Text style={[styles.topbarText, { width: 170 }]}>Normal weight</Text>
            </View>
              <Image
                source={require('../assets/icons/workout_btn.png')}
                style={{ resizeMode: 'contain', width: 40 }}
              />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Cals')}>
        <LinearGradient
          colors={['#C58BF255', '#EEA4CE33']}
          style={[styles.gradientBar, { height: 100, marginTop: 15 }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/icons/calories.png')}
              style={{ resizeMode: 'contain', width: 80 }}
            />
            <View style={{ marginHorizontal: 10 }}>
              <Text style={styles.textDark}>Calories</Text>
              <Text style={styles.textDarkLighter}>Check your calorie intake</Text>
            </View>
          </View>
          <Image
            source={require('../assets/icons/workout_btn.png')}
            style={{ resizeMode: 'contain', width: 40 }}
          />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.5}
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate('Workouts')}>
        <LinearGradient colors={['#C58BF255', '#EEA4CE33']} style={[styles.gradientBar, { height: 100 }]}>
          <Image
            source={require('../assets/icons/home_workout.png')}
            style={{ resizeMode: 'contain', width: 70, marginHorizontal: 10 }}
          />
          <View style={{ marginLeft: -10 }}>
            <Text style={styles.textDark}>Workout</Text>
            <Text style={styles.textDarkLighter}>Create and log your workouts</Text>
          </View>
          <Image
            source={require('../assets/icons/workout_btn.png')}
            style={{ resizeMode: 'contain', width: 40 }}
          />
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ marginLeft: 20, marginTop: 40 }}>
        <LineChart data={data} width={screenWidth} height={250} chartConfig={chartConfig} />
      </View>
      <StatusBar style='dark' />
    </View>
  )
}

const styles = StyleSheet.create({
  topbarText: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 5,
    fontFamily: 'Poppins',
  },
  gradientBar: {
    padding: 15,
    borderRadius: 16,
    marginHorizontal: 20,
    height: 130,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientBar2: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 30,
    height: 200,
    width: '40%',
    marginVertical: 20,
  },
  textLight: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Poppins',
  },
  textDark: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  textDarkLighter: {
    fontSize: 15,
    color: '#A4A9AD',
    fontFamily: 'Poppins',
    fontWeight: '500',
    width: 180,
  },
})
