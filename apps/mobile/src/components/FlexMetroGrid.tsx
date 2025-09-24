import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  ScrollView,
  type PanResponderInstance,
} from "react-native";
import { IconButton } from "react-native-paper";

const { width } = Dimensions.get("window");
const MIN_TILE_WIDTH = 150;
const COLS = Math.max(1, Math.floor(width / MIN_TILE_WIDTH));
const TILE_MARGIN = 4;
const BASE_SIZE = width / COLS - TILE_MARGIN * 2;
// Maximum tile size
const MAX_COLSPAN = 2;
const MAX_ROWSPAN = 2;

export interface MetroTile {
  id: string;
  label: string;
  color: string;
  rowSpan?: number;
  colSpan?: number;
  onPress: () => void;
}

interface FlexMetroGridProps {
  tiles: MetroTile[];
  editable?: boolean;
  onTilesChange?: (tiles: MetroTile[]) => void;
}

export default function FlexMetroGrid({
  tiles: initialTiles,
  editable = false,
  onTilesChange,
}: FlexMetroGridProps) {
  const [tiles, setTiles] = useState(initialTiles);
  const [editingTileId, setEditingTileId] = useState<string | null>(null); // track which tile is being edited

  const panInitialSize = useRef<{ rowSpan: number; colSpan: number }[]>([]);
  const panResponders = useRef<PanResponderInstance[]>([]);

  useEffect(() => {
    panResponders.current = tiles.map((_, index) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          const deltaX = gestureState.dx;
          const deltaY = gestureState.dy;

          setTiles((prev) => {
            const newTiles = [...prev];
            const tile = newTiles[index];

            const newColSpan = Math.min(
              MAX_COLSPAN,
              Math.max(
                1,
                Math.round(
                  (BASE_SIZE * (tile.colSpan ?? 1) + deltaX) / BASE_SIZE
                )
              )
            );

            const newRowSpan = Math.min(
              MAX_ROWSPAN,
              Math.max(
                1,
                Math.round(
                  (BASE_SIZE * (tile.rowSpan ?? 1) + deltaY) / BASE_SIZE
                )
              )
            );

            newTiles[index] = {
              ...tile,
              rowSpan: newRowSpan,
              colSpan: newColSpan,
            };

            return newTiles;
          });
        },
        onPanResponderRelease: () => {},
      })
    );
  }, [tiles.length]);

  // Grid placement
  const positions: { row: number; col: number }[] = [];
  const grid: boolean[][] = [];
  tiles.forEach((tile) => {
    const rowSpan = tile.rowSpan ?? 1;
    const colSpan = tile.colSpan ?? 1;
    let row = 0;
    let col = 0;

    outer: while (true) {
      for (col = 0; col <= COLS - colSpan; col++) {
        let canPlace = true;
        for (let r = 0; r < rowSpan; r++) {
          if (!grid[row + r]) grid[row + r] = [];
          for (let c = 0; c < colSpan; c++) {
            if (grid[row + r][col + c]) {
              canPlace = false;
              break;
            }
          }
          if (!canPlace) break;
        }
        if (canPlace) break outer;
      }
      row++;
    }

    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        grid[row + r][col + c] = true;
      }
    }
    positions.push({ row, col });
  });

  const containerHeight =
    (grid.length || 1) * (BASE_SIZE + TILE_MARGIN) + TILE_MARGIN;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={[
          styles.container,
          { height: containerHeight, backgroundColor: "white" },
        ]}
      >
        {tiles.map((tile, index) => {
          const { row, col } = positions[index];
          const rowSpan = tile.rowSpan ?? 1;
          const colSpan = tile.colSpan ?? 1;

          const isEditing = editingTileId === tile.id;

          return (
            <View
              key={tile.id}
              style={[
                styles.tileWrapper,
                {
                  top: row * (BASE_SIZE + TILE_MARGIN),
                  left: col * (BASE_SIZE + TILE_MARGIN),
                  width: BASE_SIZE * colSpan + TILE_MARGIN * (colSpan - 1),
                  height: BASE_SIZE * rowSpan + TILE_MARGIN * (rowSpan - 1),
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.tile, { backgroundColor: tile.color }]}
                onPress={tile.onPress}
                onLongPress={() => setEditingTileId(tile.id)} // unlock edit on long press
                activeOpacity={0.9}
              >
                <Text style={styles.label}>{tile.label}</Text>
              </TouchableOpacity>

              {editable && isEditing && (
                <>
                  <IconButton
                    icon="content-save" // save icon
                    size={20}
                    iconColor="#fff"
                    containerColor="rgba(0,0,0,0.3)"
                    style={styles.editBtn}
                    onPress={() => {
                      if (onTilesChange) onTilesChange(tiles); // save changes
                      setEditingTileId(null); // exit edit mode
                    }}
                  />
                  <View
                    {...panResponders.current[index].panHandlers}
                    style={styles.resizer}
                  />
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: TILE_MARGIN,
  },
  tileWrapper: {
    position: "absolute",
    zIndex: 1,
  },
  tile: {
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  editBtn: {
    position: "absolute",
    bottom: 4,
    left: 4,
    zIndex: 2,
  },
  resizer: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderTopLeftRadius: 8,
    zIndex: 3,
  },
});
