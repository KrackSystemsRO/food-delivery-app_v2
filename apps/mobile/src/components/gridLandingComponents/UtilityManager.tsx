import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Vibration,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const TILE_MARGIN = 8;
const NUM_COLUMNS = 2;
const TILE_SIZE = width / NUM_COLUMNS - TILE_MARGIN * 2;

interface Tile {
  id: string;
  label: string;
  color: string;
  w?: number;
  h?: number;
}

const STORAGE_KEY = "@grid_tiles";

const initialTiles: Tile[] = [
  { id: "1", label: "ManagerLandingStack", color: "#3498db", w: 1, h: 1 },
  { id: "2", label: "OrdersStack", color: "#e67e22", w: 1, h: 1 },
  { id: "3", label: "ProductsStack", color: "#9b59b6", w: 1, h: 1 },
  { id: "4", label: "ProfileStack", color: "#2ecc71", w: 1, h: 1 },
];

const getTilePixelSize = (tile: Tile) => ({
  width: TILE_SIZE * (tile.w || 1) + TILE_MARGIN * ((tile.w || 1) - 1),
  height: TILE_SIZE * (tile.h || 1) + TILE_MARGIN * ((tile.h || 1) - 1),
});

export default function DraggableGrid() {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [editMode, setEditMode] = useState(false);
  const [modalTileIndex, setModalTileIndex] = useState<number | null>(null);

  const positions = useRef<Animated.ValueXY[]>(
    initialTiles.map(
      (_, i) =>
        new Animated.ValueXY({
          x: (i % NUM_COLUMNS) * (TILE_SIZE + TILE_MARGIN),
          y: Math.floor(i / NUM_COLUMNS) * (TILE_SIZE + TILE_MARGIN),
        })
    )
  ).current;

  const scales = useRef<Animated.Value[]>(
    initialTiles.map(() => new Animated.Value(1))
  ).current;

  const draggingIndex = useRef<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  const saveTiles = async (newTiles: Tile[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTiles));
    } catch (e) {
      console.log("Failed to save tiles", e);
    }
  };

  const resizeTile = (index: number, w: number, h: number) => {
    const newTiles = [...tiles];
    newTiles[index] = { ...newTiles[index], w, h };
    setTiles(newTiles);
    saveTiles(newTiles);
    setModalTileIndex(null);
  };

  const panResponders = useRef(
    tiles.map((tile, index) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          draggingIndex.current = index;
          positions[index].setOffset({
            x: positions[index].x._value,
            y: positions[index].y._value,
          });
          positions[index].setValue({ x: 0, y: 0 });
          Animated.spring(scales[index], {
            toValue: 1.05,
            useNativeDriver: false,
          }).start();
          Vibration.vibrate(30);
        },
        onPanResponderMove: (_, gesture) => {
          if (draggingIndex.current !== index) return;
          positions[index].x.setValue(gesture.dx);
          positions[index].y.setValue(gesture.dy);

          // Optional: highlight swap positions
          const draggedCenterY =
            positions[index].y._offset +
            positions[index].y._value +
            TILE_SIZE / 2;
          const draggedCenterX =
            positions[index].x._offset +
            positions[index].x._value +
            TILE_SIZE / 2;

          let newOrder = [...tiles];
          const oldIndex = index;

          for (let i = 0; i < tiles.length; i++) {
            if (i === index) continue;
            const col = i % NUM_COLUMNS;
            const row = Math.floor(i / NUM_COLUMNS);
            const x = col * (TILE_SIZE + TILE_MARGIN) + TILE_SIZE / 2;
            const y = row * (TILE_SIZE + TILE_MARGIN) + TILE_SIZE / 2;

            if (
              draggedCenterX > x - TILE_SIZE / 2 &&
              draggedCenterX < x + TILE_SIZE / 2 &&
              draggedCenterY > y - TILE_SIZE / 2 &&
              draggedCenterY < y + TILE_SIZE / 2
            ) {
              // Reorder tiles array
              newOrder.splice(oldIndex, 1);
              newOrder.splice(i, 0, tile);
              setTiles(newOrder);

              // Animate other tiles to their new positions
              newOrder.forEach((t, j) => {
                const row = Math.floor(j / NUM_COLUMNS);
                const col = j % NUM_COLUMNS;
                Animated.spring(positions[tiles.indexOf(t)], {
                  toValue: {
                    x: col * (TILE_SIZE + TILE_MARGIN),
                    y: row * (TILE_SIZE + TILE_MARGIN),
                  },
                  useNativeDriver: false,
                  bounciness: 0,
                }).start();
              });
              break;
            }
          }
        },
        onPanResponderRelease: () => {
          if (draggingIndex.current !== null) {
            tiles.forEach((_, i) => {
              const row = Math.floor(i / NUM_COLUMNS);
              const col = i % NUM_COLUMNS;
              Animated.spring(positions[i], {
                toValue: {
                  x: col * (TILE_SIZE + TILE_MARGIN),
                  y: row * (TILE_SIZE + TILE_MARGIN),
                },
                useNativeDriver: false,
              }).start();
            });
            Animated.spring(scales[draggingIndex.current], {
              toValue: 1,
              useNativeDriver: false,
            }).start();
            positions[draggingIndex.current].flattenOffset();
            draggingIndex.current = null;
            saveTiles(tiles);
          }
        },
      })
    )
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{
          height:
            Math.ceil(tiles.length / NUM_COLUMNS) * (TILE_SIZE + TILE_MARGIN),
        }}
      >
        {tiles.map((tile, index) => {
          const { width, height } = getTilePixelSize(tile);
          return (
            <Animated.View
              key={tile.id}
              {...panResponders[index].panHandlers}
              style={[
                styles.tile,
                {
                  width,
                  height,
                  backgroundColor: tile.color,
                  transform: [
                    ...positions[index].getTranslateTransform(),
                    { scale: scales[index] },
                  ],
                  zIndex: draggingIndex.current === index ? 999 : index,
                },
              ]}
            >
              <Text style={styles.label}>{tile.label}</Text>
              {editMode && (
                <TouchableOpacity
                  style={styles.resizeHandle}
                  onPress={() => setModalTileIndex(index)}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>⇲</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>

      <Modal transparent visible={modalTileIndex !== null} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Resize Tile
            </Text>
            {[1, 2].map((w) =>
              [1, 2].map((h) => (
                <Pressable
                  key={`${w}x${h}`}
                  onPress={() =>
                    modalTileIndex !== null && resizeTile(modalTileIndex, w, h)
                  }
                  style={styles.resizeOption}
                >
                  <Text>
                    {w} x {h}
                  </Text>
                </Pressable>
              ))
            )}
            <Pressable
              onPress={() => setModalTileIndex(null)}
              style={[styles.resizeOption, { backgroundColor: "#ddd" }]}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  tile: {
    position: "absolute",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { color: "#fff", fontWeight: "600" },
  resizeHandle: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 200,
  },
  resizeOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
});
