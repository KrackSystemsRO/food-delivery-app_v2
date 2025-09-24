import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Vibration,
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
}

interface GridPos {
  row: number;
  col: number;
}

interface DraggableGridProps {
  snapToGrid?: boolean;
  navigation: any;
}

const initialTiles: Tile[] = [
  { id: "1", label: "ManagerLandingStack", color: "#3498db" },
  { id: "2", label: "OrdersStack", color: "#e67e22" },
  { id: "3", label: "ProductsStack", color: "#9b59b6" },
  { id: "4", label: "ProfileStack", color: "#2ecc71" },
];

const STORAGE_KEY = "@grid_positions";

export default function DraggableGrid({
  snapToGrid = true,
  navigation,
}: DraggableGridProps) {
  const [tiles] = useState<Tile[]>(initialTiles);
  const [gridPositions, setGridPositions] = useState<GridPos[]>([]);

  const positions = useRef<Animated.ValueXY[]>(
    initialTiles.map(() => new Animated.ValueXY({ x: 0, y: 0 }))
  ).current;

  const scales = useRef<Animated.Value[]>(
    initialTiles.map(() => new Animated.Value(1))
  ).current;

  const draggingIndex = useRef<number | null>(null);

  // Load saved positions from AsyncStorage
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: GridPos[] = JSON.parse(saved);
          setGridPositions(parsed);
          parsed.forEach((pos, i) => {
            positions[i].setValue({
              x: pos.col * (TILE_SIZE + TILE_MARGIN),
              y: pos.row * (TILE_SIZE + TILE_MARGIN),
            });
          });
        } else {
          // If no saved, use defaults
          const defaultPositions = initialTiles.map((_, i) => ({
            row: Math.floor(i / NUM_COLUMNS),
            col: i % NUM_COLUMNS,
          }));
          setGridPositions(defaultPositions);
          defaultPositions.forEach((pos, i) => {
            positions[i].setValue({
              x: pos.col * (TILE_SIZE + TILE_MARGIN),
              y: pos.row * (TILE_SIZE + TILE_MARGIN),
            });
          });
        }
      } catch (err) {
        console.log("Failed to load positions:", err);
      }
    };
    loadPositions();
  }, []);

  // Save positions to AsyncStorage
  const savePositions = async (newPositions: GridPos[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPositions));
    } catch (err) {
      console.log("Failed to save positions:", err);
    }
  };

  const panResponders = tiles.map((tile, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        const longPressTimeout = setTimeout(() => {
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
        }, 200);

        (positions[index] as any).longPressTimeout = longPressTimeout;
      },

      onPanResponderMove: (e, gesture) => {
        if (draggingIndex.current === index) {
          positions[index].x.setValue(gesture.dx);
          positions[index].y.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (e, gesture) => {
        clearTimeout((positions[index] as any).longPressTimeout);

        const isTap = Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5;
        if (isTap) {
          switch (tile.id) {
            case "1":
              navigation.navigate("ManagerLandingStack");
              break;
            case "2":
              navigation.navigate("OrdersStack");
              break;
            case "3":
              navigation.navigate("ProductsStack");
              break;
            case "4":
              navigation.navigate("ProfileStack");
              break;
          }
          return;
        }

        if (draggingIndex.current === index && snapToGrid) {
          const tileX = positions[index].x._value + positions[index].x._offset;
          const tileY = positions[index].y._value + positions[index].y._offset;

          let col = Math.round(tileX / (TILE_SIZE + TILE_MARGIN));
          let row = Math.round(tileY / (TILE_SIZE + TILE_MARGIN));

          col = Math.max(0, Math.min(NUM_COLUMNS - 1, col));
          row = Math.max(0, row);

          // Check for occupied cells
          const occupied = gridPositions.some(
            (pos, iPos) => iPos !== index && pos.row === row && pos.col === col
          );
          if (occupied) {
            col = gridPositions[index].col;
            row = gridPositions[index].row;
          } else {
            const newPositions = [...gridPositions];
            newPositions[index] = { row, col };
            setGridPositions(newPositions);
            savePositions(newPositions); // save after each move
          }

          Animated.spring(positions[index], {
            toValue: {
              x: col * (TILE_SIZE + TILE_MARGIN),
              y: row * (TILE_SIZE + TILE_MARGIN),
            },
            useNativeDriver: false,
          }).start();
        }

        Animated.spring(scales[index], {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        draggingIndex.current = null;
        positions[index].flattenOffset();
      },

      onPanResponderTerminate: () => {
        clearTimeout((positions[index] as any).longPressTimeout);
        Animated.spring(scales[index], {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        draggingIndex.current = null;
      },
    })
  );

  return (
    <View
      style={[
        styles.container,
        {
          height:
            Math.ceil(tiles.length / NUM_COLUMNS) * (TILE_SIZE + TILE_MARGIN),
        },
      ]}
    >
      {tiles.map((tile, index) => {
        const isDragging = draggingIndex.current === index;
        return (
          <Animated.View
            key={tile.id}
            {...panResponders[index].panHandlers}
            style={[
              styles.tile,
              {
                backgroundColor: tile.color,
                width: TILE_SIZE,
                height: TILE_SIZE,
                transform: [
                  ...positions[index].getTranslateTransform(),
                  { scale: scales[index] },
                ],
                zIndex: isDragging ? 999 : index,
                elevation: isDragging ? 999 : index,
              },
            ]}
          >
            <Text style={styles.label}>{tile.label}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: TILE_MARGIN },
  tile: {
    position: "absolute",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { color: "#fff", fontWeight: "600" },
});
