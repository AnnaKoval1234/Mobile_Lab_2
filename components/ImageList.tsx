import { Image, View, StyleSheet, Button } from "react-native";
import { ImageData } from "@/types";

type Props = {
  images: ImageData[];
  onDelete: (image: ImageData) => void
};

export default function ImageList({ images, onDelete }: Props) {
  return (
    <View style={styles.col}>
      <View style={styles.row}>
        { images.map((image) => (
          <View key={image.id}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <Button title="Удалить" color="#dc3545" onPress={() => onDelete(image)} />
          </View>
        )) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    col: {
      flex: 1,
      marginVertical: 8
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16
    },
    image: {
      width: 125,
      height: 125,
    }
  });