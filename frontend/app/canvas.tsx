
// import React, { useContext, useState,useLayoutEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
// import Canvas from './components/Canvas';
// import Toolbar from './components/Toolbar';
// import { ShapeName } from '../constants/shapes';
// import { useNavigation } from 'expo-router';
// import { Button } from 'react-native';


// export default function CanvasScreen() {
//     const router=useRouter();
//      const navigation = useNavigation();

//   useLayoutEffect(() => {
//     router.setParams?.({}); // optional, avoid navigation warning
//   }, []);

//   return (
//     <Button title="Search" onPress={() => router.push('/search')} />
//   );


//   const [selectedShape, setSelectedShape] = useState<ShapeName | null>(null);
//   const [deleteMode, setDeleteMode] = useState(false);

//   const toggleDeleteMode = () => {
//     setDeleteMode(!deleteMode);
//     setSelectedShape(null); // Exit shape placement if entering delete
//   };

//   return (
//     <View style={styles.container}>
//       <Toolbar 
//       onAddShape={setSelectedShape} 
//       onToggleDeleteMode={toggleDeleteMode}
//         deleteMode={deleteMode}
//       />
//      <Canvas selectedShape={selectedShape} deleteMode={deleteMode} />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
