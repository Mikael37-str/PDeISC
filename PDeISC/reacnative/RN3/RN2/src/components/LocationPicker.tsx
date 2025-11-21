// src/components/LocationPicker.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";

interface PickerItem {
  id: string;
  name: string;
}

interface LocationPickerProps {
  label: string;
  value: string;
  items: PickerItem[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  enabled?: boolean;
}

export default function LocationPicker({
  label,
  value,
  items,
  onValueChange,
  placeholder = "Seleccionar...",
  enabled = true,
}: LocationPickerProps) {
  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedItem = items.find(item => item.id === value);
  const displayText = selectedItem ? selectedItem.name : placeholder;

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (itemId: string) => {
    onValueChange(itemId);
    setVisible(false);
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          !enabled && styles.pickerButtonDisabled,
          !selectedItem && styles.pickerButtonEmpty,
        ]}
        onPress={() => enabled && setVisible(true)}
        disabled={!enabled}
      >
        <Text
          style={[
            styles.pickerButtonText,
            !selectedItem && styles.pickerButtonTextEmpty,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.pickerButtonArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {items.length > 5 && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
              </View>
            )}

            <ScrollView style={styles.itemsList}>
              {filteredItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron resultados</Text>
                </View>
              ) : (
                filteredItems.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemButton,
                      value === item.id && styles.itemButtonSelected,
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        value === item.id && styles.itemTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {value === item.id && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  pickerButton: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.6,
  },
  pickerButtonEmpty: {
    borderColor: "#ccc",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  pickerButtonTextEmpty: {
    color: "#999",
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    fontSize: 24,
    color: "#999",
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 15,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemsList: {
    maxHeight: 400,
  },
  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemButtonSelected: {
    backgroundColor: "#e7f3ff",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  itemTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  checkMark: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});