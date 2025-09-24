import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Vibration, // <-- add
} from "react-native";

const { width } = Dimensions.get("window");
const TILE_MARGIN = 8;
const NUM_COLUMNS = 2;
const TILE_SIZE = width / NUM_COLUMNS - TILE_MARGIN * 2;

interface Tile {
  id: string;
  label: string;
  color: string;
}

interface DraggableGridProps {
  snapToGrid?: boolean; // optional prop
  navigation: any;
}

const initialTiles: Tile[] = [
  { id: "1", label: "ManagerLandingStack", color: "#3498db" },
  { id: "2", label: "OrdersStack", color: "#e67e22" },
  { id: "3", label: "ProductsStack", color: "#9b59b6" },
  { id: "4", label: "ProfileStack", color: "#2ecc71" },
];

export default function DraggableGrid({
  snapToGrid = true,
  navigation,
}: DraggableGridProps) {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  const [draggingIndexState, setDraggingIndexState] = useState<number | null>(
    null
  );
  // position + scale arrays
  const positions = useRef<Animated.ValueXY[]>(
    initialTiles.map((_, i) => {
      const row = Math.floor(i / NUM_COLUMNS);
      const col = i % NUM_COLUMNS;
      return new Animated.ValueXY({
        x: col * (TILE_SIZE + TILE_MARGIN),
        y: row * (TILE_SIZE + TILE_MARGIN),
      });
    })
  ).current;

  const scales = useRef<Animated.Value[]>(
    initialTiles.map(() => new Animated.Value(1))
  ).current;

  const draggingIndex = useRef<number | null>(null);

  const panResponders = tiles.map((tile, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        const longPressTimeout = setTimeout(() => {
          draggingIndex.current = index;
          setDraggingIndexState(index);

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
        }, 750);

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
          // Navigate to the page for this tile
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

        if (draggingIndex.current === index) {
          if (snapToGrid) {
            const tileX =
              positions[index].x._value + positions[index].x._offset;
            const tileY =
              positions[index].y._value + positions[index].y._offset;

            const col = Math.round(tileX / (TILE_SIZE + TILE_MARGIN));
            const row = Math.round(tileY / (TILE_SIZE + TILE_MARGIN));

            const clampedCol = Math.max(0, Math.min(NUM_COLUMNS - 1, col));
            const clampedRow = Math.max(
              0,
              Math.min(Math.floor(tiles.length / NUM_COLUMNS), row)
            );

            Animated.spring(positions[index], {
              toValue: {
                x: clampedCol * (TILE_SIZE + TILE_MARGIN),
                y: clampedRow * (TILE_SIZE + TILE_MARGIN),
              },
              useNativeDriver: false,
            }).start();
          }

          Animated.spring(scales[index], {
            toValue: 1,
            useNativeDriver: false,
          }).start();

          draggingIndex.current = null;
          setDraggingIndexState(null);
          positions[index].flattenOffset();
        }
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
    <View style={styles.container}>
      {tiles
        .map((tile, index) => ({ tile, index }))
        .sort((a, b) => {
          // Render dragging tile last
          if (a.index === draggingIndex.current) return 1;
          if (b.index === draggingIndex.current) return -1;
          return 0;
        })
        .map(({ tile, index }) => {
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
