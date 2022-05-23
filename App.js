import { StyleSheet, Text, View, Button, Platform, Image } from "react-native";
import React from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default class App extends React.Component {
  state = {
    image: null,
  };

  componentDidMount() {
    this.askPermissions();
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Pick Image" onPress={this.pickImage} />
        <Image source={{
          uri: this.state.image,
          width: 200,
          height: 200
        }}/>
      </View>
    );
  }

  askPermissions = async () => {
    if (Platform.OS != "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status != "granted") {
        alert("Camera roll permissions were not granted!");
      }
    } else {
      alert("this doesn't work on web");
    }
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.cancelled) {
        this.setState({image: result.uri});
        console.log("picked image");
        this.uploadImage(result.uri);
      }
    } catch (e) {
      alert(e);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1];
    let type = `image/${uri.split(".")[uri.split(".").length - 1]}`;
    const fileToUpload = { uri: uri, name: filename, type: type };
    data.append("digit", fileToUpload);
    fetch(
      "insert api url",
      {
        method: "POST",
        body: data,
        headers: { "content-type": "multipart/form-data" },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        alert("Success!\n" + result);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error:\n" +  error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
