// //Pangea loading component
// //as long as it's imported in another component it will show
// //import
// //import LoadingSpinner from "../reusable/LoadingSpinner";
// //usage
// //<LoadingSpinner />

// import React, { Component } from "react";
// import {
//   View,
//   Animated,
//   Easing,
//   Modal,
//   Dimensions,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import Pangea from "../../assets/images/Pangea_Logo.png";
// import ImagePreview from "../reusable/ImageProof";
// import CustomButton from "../reusable/CustomButton";
// import { global } from "../../Styles/Styles";

// export default class MultiEdit extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       imgString: "",
//       showImagePreview: true,
//     };
//   }

//   componentDidMount = () => {};

//   render() {
//     return (
//       <View style={{ flexDirection: "row" }}>
//         <View>
//           <ImagePreview />
//         </View>
//         <View
//           style={{
//             // flexDirection: "row",
//             borderColor: "grey",
//             borderWidth: 1,
//             marginTop: Dimensions.get("screen").height / 2,
//             width: Dimensions.get("screen").width / 2,
//             height: Dimensions.get("screen").height / 2,
//           }}
//         >
//           <View style={{ flexDirection: "row" }}>
//             <TouchableOpacity style={{ backgroundColor: "grey" }}>
//               <Text>button</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={{ color: "white" }}></Text>
//         </View>
//         {this.state.showImagePreview && (
//           //   <Modal visible={true} transparent={true} animationType={"fade"}>
//           <View
//             style={{
//               //   marginLeft: 200,
//               flexDirection: "column",
//               //   width: "100%",
//               borderColor: "grey",
//               borderWidth: 1,
//               width: Dimensions.get("screen").width / 2,
//               height: Dimensions.get("screen").height,
//             }}
//           >
//             <Text></Text>
//           </View>
//           //   </Modal>
//         )}
//       </View>
//     );
//   }
// }
