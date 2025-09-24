import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
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

const initialTiles: Tile[] = [
  { id: "1", label: "Settings", color: "#3498db" },
  { id: "2", label: "Profile", color: "#e67e22" },
  { id: "3", label: "Messages", color: "#9b59b6" },
  { id: "4", label: "Tasks", color: "#2ecc71" },
];

export default function DraggableGrid() {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);

  // positions of tiles in the grid
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

  const draggingIndex = useRef<number | null>(null);

  const panResponders = tiles.map((tile, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        draggingIndex.current = index;
        positions[index].setOffset({
          x: positions[index].x._value,
          y: positions[index].y._value,
        });
        positions[index].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: positions[index].x, dy: positions[index].y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        if (draggingIndex.current === null) return;
        const tileX = positions[index].x._value + positions[index].x._offset;
        const tileY = positions[index].y._value + positions[index].y._offset;

        // compute nearest grid position
        const col = Math.round(tileX / (TILE_SIZE + TILE_MARGIN));
        const row = Math.round(tileY / (TILE_SIZE + TILE_MARGIN));
        const newIndex = row * NUM_COLUMNS + col;

        // clamp
        const clampedIndex = Math.max(0, Math.min(tiles.length - 1, newIndex));

        // reorder tiles
        if (clampedIndex !== index) {
          const newTiles = [...tiles];
          const [moved] = newTiles.splice(index, 1);
          newTiles.splice(clampedIndex, 0, moved);
          setTiles(newTiles);

          // update all positions
          newTiles.forEach((_, i) => {
            const r = Math.floor(i / NUM_COLUMNS);
            const c = i % NUM_COLUMNS;
            Animated.spring(positions[i], {
              toValue: {
                x: c * (TILE_SIZE + TILE_MARGIN),
                y: r * (TILE_SIZE + TILE_MARGIN),
              },
              useNativeDriver: false,
            }).start();
          });
        } else {
          // snap back to same position
          const row = Math.floor(index / NUM_COLUMNS);
          const col = index % NUM_COLUMNS;
          Animated.spring(positions[index], {
            toValue: {
              x: col * (TILE_SIZE + TILE_MARGIN),
              y: row * (TILE_SIZE + TILE_MARGIN),
            },
            useNativeDriver: false,
          }).start();
        }

        positions[index].flattenOffset();
        draggingIndex.current = null;
      },
    })
  );

  return (
    <View style={styles.container}>
      {tiles.map((tile, index) => (
        <Animated.View
          key={tile.id}
          {...panResponders[index].panHandlers}
          style={[
            styles.tile,
            {
              backgroundColor: tile.color,
              width: TILE_SIZE,
              height: TILE_SIZE,
              transform: positions[index].getTranslateTransform(),
              zIndex: draggingIndex.current === index ? 10 : 1,
            },
          ]}
        >
          <Text style={styles.label}>{tile.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TILE_MARGIN,
  },
  tile: {
    position: "absolute",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
  },
});
